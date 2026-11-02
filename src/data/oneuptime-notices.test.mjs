import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  MAX_TIMEOUT_MS,
  createNoticeDismissalState,
  failureOutcome,
  loadSessionOverview,
  nextAnnouncementChange,
  parseOverview,
  readSessionOutcome,
  selectActiveAnnouncement,
  successOverviewOutcome,
  timeoutDelay,
  writeSessionOutcome,
} from './oneuptime-notices.mjs';

const announcement = (overrides = {}) => ({
  _id: 'maintenance-1',
  title: 'Scheduled maintenance',
  showAnnouncementAt: { _type: 'DateTime', value: '2026-10-13T10:00:00Z' },
  endAnnouncementAt: { _type: 'DateTime', value: '2026-10-13T12:00:00Z' },
  ...overrides,
});

const overview = (announcements) => ({ activeAnnouncements: announcements });
const dataDirectory = path.dirname(fileURLToPath(import.meta.url));

const memoryStorage = () => {
  const entries = new Map();
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  };
};

test('parses OneUptime overview activeAnnouncements with serialized DateTime fields', () => {
  const notices = parseOverview(overview([announcement()]));
  assert.deepEqual(notices, [
    {
      id: 'maintenance-1',
      title: 'Scheduled maintenance',
      startsAt: '2026-10-13T10:00:00Z',
      endsAt: '2026-10-13T12:00:00Z',
    },
  ]);
});

test('selects an active announcement using the visitor clock', () => {
  const notices = parseOverview(overview([announcement()]));
  assert.equal(
    selectActiveAnnouncement(notices, Date.parse('2026-10-13T11:00:00Z')).id,
    'maintenance-1'
  );
  assert.equal(selectActiveAnnouncement(notices, Date.parse('2026-10-13T09:59:59Z')), undefined);
  assert.equal(selectActiveAnnouncement(notices, Date.parse('2026-10-13T12:00:00Z')), undefined);
});

test('chooses the most recently started active announcement deterministically', () => {
  const notices = parseOverview(
    overview([
      announcement({ _id: 'a', showAnnouncementAt: '2026-10-13T09:00:00Z' }),
      announcement({ _id: 'b', showAnnouncementAt: '2026-10-13T10:00:00Z' }),
    ])
  );
  assert.equal(selectActiveAnnouncement(notices, Date.parse('2026-10-13T11:00:00Z')).id, 'b');
});

test('rejects malformed public overview responses rather than rendering remote content', () => {
  assert.throws(() => parseOverview(overview([announcement({ title: '' })])));
  assert.throws(() => parseOverview({ activeAnnouncements: {} }));
});

test('finds the next start or expiry so an open page refreshes on time', () => {
  const notices = parseOverview(
    overview([
      announcement({ _id: 'future', showAnnouncementAt: '2026-10-13T13:00:00Z' }),
      announcement({ _id: 'active', endAnnouncementAt: '2026-10-13T11:30:00Z' }),
    ])
  );
  assert.equal(
    nextAnnouncementChange(notices, Date.parse('2026-10-13T11:00:00Z')),
    Date.parse('2026-10-13T11:30:00Z')
  );
});

test('uses a successful empty result to hide the local fallback and caches it for the tab session', () => {
  const storage = memoryStorage();
  const outcome = successOverviewOutcome(overview([]));
  writeSessionOutcome(storage, outcome);
  assert.deepEqual(readSessionOutcome(storage), outcome);
});

test('caches a failed result so later pages retain their local fallback without another request', () => {
  const storage = memoryStorage();
  const outcome = failureOutcome();
  writeSessionOutcome(storage, outcome);
  assert.deepEqual(readSessionOutcome(storage), outcome);
});

test('rehydrates a non-empty normalized cache without requesting the overview again', async () => {
  const storage = memoryStorage();
  const outcome = successOverviewOutcome(overview([announcement()]));
  writeSessionOutcome(storage, outcome);
  let calls = 0;
  const request = async () => {
    calls += 1;
    return overview([]);
  };

  const cached = await loadSessionOverview(storage, request);
  assert.equal(cached.announcements[0].id, 'maintenance-1');
  assert.equal(calls, 0);
});

test('calls the status page overview once per tab session', async () => {
  const storage = memoryStorage();
  let calls = 0;
  const request = async () => {
    calls += 1;
    return overview([]);
  };

  await loadSessionOverview(storage, request);
  await loadSessionOverview(storage, request);
  assert.equal(calls, 1);
});

test('fetches and renders an overview outcome when session storage is unavailable', async () => {
  const unavailableStorage = {
    getItem() {
      throw new Error('SecurityError');
    },
    setItem() {
      throw new Error('SecurityError');
    },
  };
  let calls = 0;
  const outcome = await loadSessionOverview(unavailableStorage, async () => {
    calls += 1;
    return overview([announcement()]);
  });

  assert.equal(calls, 1);
  assert.equal(outcome.announcements[0].id, 'maintenance-1');
});

test('keeps a selected notice dismissed after another active notice expires without storage', () => {
  const unavailableStorage = {
    getItem() {
      throw new Error('SecurityError');
    },
    setItem() {
      throw new Error('SecurityError');
    },
  };
  const notices = parseOverview(
    overview([
      announcement({
        _id: 'dismissed',
        showAnnouncementAt: '2026-10-13T10:00:00Z',
        endAnnouncementAt: '2026-10-13T12:00:00Z',
      }),
      announcement({
        _id: 'expiring-other',
        showAnnouncementAt: '2026-10-13T09:00:00Z',
        endAnnouncementAt: '2026-10-13T11:00:00Z',
      }),
    ])
  );
  const dismissal = createNoticeDismissalState(unavailableStorage);
  const beforeExpiry = selectActiveAnnouncement(notices, Date.parse('2026-10-13T10:30:00Z'));
  dismissal.dismiss(beforeExpiry.id);

  const afterOtherExpires = selectActiveAnnouncement(notices, Date.parse('2026-10-13T11:00:00Z'));
  assert.equal(afterOtherExpires.id, 'dismissed');
  assert.equal(dismissal.isDismissed(afterOtherExpires.id), true);
  assert.equal(dismissal.isDismissed('expiring-other'), false);
});

test('caps long timeout delays and re-evaluates at the cap', () => {
  const now = Date.parse('2026-10-13T11:00:00Z');
  assert.equal(timeoutDelay(now + MAX_TIMEOUT_MS + 1, now), MAX_TIMEOUT_MS);
  assert.equal(timeoutDelay(now + 100, now), 100);
});

test('remote titles remain plain data so French pages can mark the English title with lang=en', () => {
  const notice = parseOverview(
    overview([announcement({ title: '<strong>English only</strong>' })])
  )[0];
  assert.equal(notice.title, '<strong>English only</strong>');
});

test('hidden notice bars compute to display none', async () => {
  const pageFrame = await readFile(
    path.join(dataDirectory, '../overrides/PageFrame.astro'),
    'utf8'
  );
  const styles = pageFrame.match(/<style>([\s\S]*)<\/style>/)?.[1];
  assert.ok(styles);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(`<style>${styles}</style><div class="notice-bar" hidden></div>`);
    assert.equal(
      await page
        .locator('.notice-bar')
        .evaluate((bar) => bar.ownerDocument.defaultView?.getComputedStyle(bar).display),
      'none'
    );
  } finally {
    await browser.close();
  }
});
