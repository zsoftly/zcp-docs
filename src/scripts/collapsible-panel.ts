/**
 * A side panel that folds into a narrow rail, shared by the left sidebar and the right "On this
 * page" panel.
 *
 * The toggle sets `<html {modeAttr}="rail">` and remembers the choice in localStorage; CSS in
 * src/styles/custom.css draws the rail and gives the page the freed width. While folded,
 * hovering the rail (after a short rest) or moving keyboard focus into it sets `{modeAttr}-peek`,
 * which floats the full panel over the page without moving the content. Leaving, Escape or a
 * fresh fold closes the preview. A press on a folded branch (touch has no hover) opens that
 * branch inside the preview. With `peek: false` the rail only folds and unfolds, as the console's
 * right info rail does. Each panel sets the attribute before paint with a one-line inline
 * script, so a folded panel never flashes open.
 */
export interface CollapsiblePanelOptions {
  /** The scrolling panel element the pointer enters. */
  pane: HTMLElement | null;
  toggle: HTMLButtonElement | null;
  /** For example `data-zs-sidebar`. */
  modeAttr: string;
  storageKey: string;
  /** The panel folds only while this media query matches. */
  media: string;
  /** Float the full panel over the page while the rail is hovered or focused. Default true. */
  peek?: boolean;
}

export function initCollapsiblePanel({
  pane,
  toggle,
  modeAttr,
  storageKey,
  media,
  peek = true,
}: CollapsiblePanelOptions) {
  const root = document.documentElement;
  const peekAttr = `${modeAttr}-peek`;
  const holdAttr = `${modeAttr}-hold`;
  const wide = window.matchMedia(media);
  const isRail = () => wide.matches && root.getAttribute(modeAttr) === 'rail';
  const isPeek = () => root.hasAttribute(peekAttr);
  let timer: number | undefined;

  const openPeek = () => {
    window.clearTimeout(timer);
    if (isRail() && !root.hasAttribute(holdAttr)) root.setAttribute(peekAttr, '');
  };
  const closePeek = () => {
    window.clearTimeout(timer);
    root.removeAttribute(peekAttr);
  };

  const syncToggle = () => {
    if (!toggle) return;
    const label = isRail() ? toggle.dataset.labelExpand : toggle.dataset.labelCollapse;
    if (label) {
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    }
    toggle.setAttribute('aria-expanded', String(!isRail()));
  };

  // A pointer press marks the toggle so its focus ring shows for keyboard use only.
  toggle?.addEventListener('pointerdown', () => toggle.setAttribute('data-pointer', ''));
  toggle?.addEventListener('keydown', () => toggle.removeAttribute('data-pointer'));
  toggle?.addEventListener('blur', () => toggle.removeAttribute('data-pointer'));

  toggle?.addEventListener('click', () => {
    const rail = !isRail();
    closePeek();
    if (rail) {
      root.setAttribute(modeAttr, 'rail');
      // A pointer still over the panel would reopen it at once: wait until it leaves. A keyboard
      // fold sets no hold, so focus moving back into the rail opens the preview as usual.
      if (pane?.matches(':hover')) root.setAttribute(holdAttr, '');
    } else {
      root.removeAttribute(modeAttr);
    }
    try {
      localStorage.setItem(storageKey, rail ? 'rail' : 'full');
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
    syncToggle();
  });

  if (pane && peek) {
    pane.addEventListener('mouseenter', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(openPeek, 120);
    });
    pane.addEventListener('mouseleave', () => {
      root.removeAttribute(holdAttr);
      // Keyboard focus inside keeps the preview open; otherwise leaving closes it.
      if (pane.querySelector(':focus-visible')) window.clearTimeout(timer);
      else closePeek();
    });
    // Keyboard focus opens the preview. A pointer press does not, so a press is handled below.
    pane.addEventListener('focusin', (event) => {
      if ((event.target as Element).matches(':focus-visible')) openPeek();
    });
    pane.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if ((!next || !pane.contains(next)) && !pane.matches(':hover')) closePeek();
    });
    pane.addEventListener(
      'click',
      (event) => {
        if (!isRail() || isPeek()) return;
        const summary = (event.target as Element).closest('summary');
        if (!summary) return;
        // Stop here so Starlight's sidebar state persister does not record this as a close.
        event.preventDefault();
        event.stopPropagation();
        const details = summary.parentElement;
        if (details instanceof HTMLDetailsElement) details.open = true;
        root.removeAttribute(holdAttr);
        openPeek();
      },
      true
    );
    pane.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isPeek()) {
        // Nested rows disappear in the rail, so focus moves to the top-level row holding it first.
        const top = (document.activeElement as Element | null)
          ?.closest('[data-depth="0"] > li')
          ?.querySelector<HTMLElement>('.zs-tree-row');
        top?.focus();
        closePeek();
        root.setAttribute(holdAttr, '');
      }
    });
  }

  wide.addEventListener('change', () => {
    closePeek();
    syncToggle();
  });
  syncToggle();
}
