export const ONEUPTIME_OVERVIEW_URL =
  'https://status.zcp.zsoftly.ca/status-page-api/overview/e6c6cd2d-5290-4091-a150-2d046be03d75';

export const ONEUPTIME_STATUS_PAGE_URL =
  'https://status.zcp.zsoftly.ca/status-page/e6c6cd2d-5290-4091-a150-2d046be03d75';

export const ONEUPTIME_NOTICE_CACHE_KEY = 'zs-oneuptime-overview-v2';
export const MAX_TIMEOUT_MS = 2 ** 31 - 1;

const parseTimestamp = (value, field, id) => {
  if (value === undefined || value === null) return undefined;
  const timestamp =
    typeof value === 'string' ? value : value?._type === 'DateTime' ? value.value : undefined;
  if (typeof timestamp !== 'string' || !Number.isFinite(Date.parse(timestamp))) {
    throw new TypeError(`Announcement ${id} has an invalid ${field}`);
  }
  return timestamp;
};

const normalizeAnnouncement = (announcement, idField) => {
  if (
    !announcement ||
    typeof announcement[idField] !== 'string' ||
    !announcement[idField] ||
    typeof announcement.title !== 'string' ||
    !announcement.title.trim()
  ) {
    throw new TypeError('Announcement is missing a stable id or title');
  }

  return {
    id: announcement[idField],
    title: announcement.title.trim(),
    startsAt: parseTimestamp(
      announcement.showAnnouncementAt ?? announcement.startsAt,
      'showAnnouncementAt',
      announcement[idField]
    ),
    endsAt: parseTimestamp(
      announcement.endAnnouncementAt ?? announcement.endsAt,
      'endAnnouncementAt',
      announcement[idField]
    ),
  };
};

/**
 * Validates the public status-page overview before it is stored or rendered.
 * Descriptions are deliberately excluded: status-page Markdown is untrusted
 * remote content, while a title is safe to render with textContent.
 */
export function parseOverview(payload) {
  if (!payload || !Array.isArray(payload.activeAnnouncements)) {
    throw new TypeError('Expected an activeAnnouncements array');
  }
  return payload.activeAnnouncements.map((announcement) =>
    normalizeAnnouncement(announcement, '_id')
  );
}

const parseCachedAnnouncements = (announcements) => {
  if (!Array.isArray(announcements)) throw new TypeError('Expected cached announcements');
  return announcements.map((announcement) => normalizeAnnouncement(announcement, 'id'));
};

export function selectActiveAnnouncement(announcements, now = Date.now()) {
  return announcements
    .filter((announcement) => {
      const start = announcement.startsAt ? Date.parse(announcement.startsAt) : -Infinity;
      const end = announcement.endsAt ? Date.parse(announcement.endsAt) : Infinity;
      return start <= now && now < end;
    })
    .sort((a, b) => {
      const aStart = a.startsAt ? Date.parse(a.startsAt) : -Infinity;
      const bStart = b.startsAt ? Date.parse(b.startsAt) : -Infinity;
      return bStart - aStart || a.id.localeCompare(b.id);
    })[0];
}

/** Returns the next start or expiry that could change the selected notice. */
export function nextAnnouncementChange(announcements, now = Date.now()) {
  const changes = announcements.flatMap((announcement) =>
    [announcement.startsAt, announcement.endsAt]
      .map((timestamp) => (timestamp ? Date.parse(timestamp) : undefined))
      .filter((timestamp) => timestamp !== undefined && timestamp > now)
  );
  return changes.length ? Math.min(...changes) : undefined;
}

export function timeoutDelay(target, now = Date.now()) {
  return Math.min(Math.max(target - now, 0), MAX_TIMEOUT_MS);
}

export function successOverviewOutcome(payload) {
  return { status: 'success', announcements: parseOverview(payload) };
}

export function failureOutcome() {
  return { status: 'failure' };
}

export function readSessionOutcome(storage) {
  try {
    const value = storage.getItem(ONEUPTIME_NOTICE_CACHE_KEY);
    if (!value) return undefined;
    const outcome = JSON.parse(value);
    if (outcome?.status === 'failure') return failureOutcome();
    if (outcome?.status === 'success') {
      return { status: 'success', announcements: parseCachedAnnouncements(outcome.announcements) };
    }
  } catch {
    // A corrupt cache is equivalent to no cache. A new request can repair it.
  }
  return undefined;
}

export function writeSessionOutcome(storage, outcome) {
  try {
    storage.setItem(ONEUPTIME_NOTICE_CACHE_KEY, JSON.stringify(outcome));
  } catch {
    // Storage can be disabled. The static fallback must still render normally.
  }
}

/** Keeps a dismissal for this page when sessionStorage is unavailable. */
export function createNoticeDismissalState(storage) {
  let dismissedId;

  return {
    dismiss(id) {
      dismissedId = id;
      try {
        storage.setItem('zs-notice-dismissed', id);
      } catch {
        // The in-memory id still keeps this page's notice dismissed.
      }
    },
    isDismissed(id) {
      if (dismissedId === id) return true;
      try {
        return storage.getItem('zs-notice-dismissed') === id;
      } catch {
        return false;
      }
    },
  };
}

/** Fetches the public overview at most once per browser tab session, including a failed request. */
export async function loadSessionOverview(storage, request) {
  const cached = readSessionOutcome(storage);
  if (cached) return cached;

  let outcome;
  try {
    outcome = successOverviewOutcome(await request());
  } catch {
    outcome = failureOutcome();
  }
  writeSessionOutcome(storage, outcome);
  return outcome;
}
