/**
 * Behaviour for src/components/NavTree.astro that the markup cannot do alone.
 *
 * `followCurrent` keeps the branch holding the current row open: when the current row moves into
 * a closed branch, that branch opens, and a branch it opened closes again once the current row
 * leaves, unless the reader opened or closed it by hand.
 *
 * `trackHeadings` marks the heading being read in an "On this page" tree, from the scroll
 * position, and calls `followCurrent` as it moves.
 */
export function followCurrent(root: HTMLElement) {
  const touched = new WeakSet<HTMLDetailsElement>();
  const auto = new WeakSet<HTMLDetailsElement>();
  root.addEventListener('click', (event) => {
    const summary = (event.target as Element).closest('summary');
    // A click on the label link navigates and does not fold, so it is not a choice.
    if (!summary || (event.target as Element).closest('a')) return;
    const details = summary.parentElement;
    if (details instanceof HTMLDetailsElement) touched.add(details);
  });
  return () => {
    const current = root.querySelector('[aria-current]');
    root.querySelectorAll<HTMLDetailsElement>('details.zs-tree-branch').forEach((details) => {
      if (touched.has(details)) return;
      const holds = Boolean(current && details.contains(current));
      if (holds && !details.open) {
        details.open = true;
        auto.add(details);
      } else if (!holds && auto.has(details)) {
        details.open = false;
        auto.delete(details);
      }
    });
  };
}

export function trackHeadings(root: HTMLElement) {
  const links = [...root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const headings = links.map((link) =>
    document.getElementById(decodeURIComponent(link.hash.slice(1)))
  );
  if (!links.length) return;
  const follow = followCurrent(root);
  const header = document.querySelector('header');
  let current: HTMLAnchorElement | undefined;
  let queued = false;

  const update = () => {
    queued = false;
    const line = (header?.getBoundingClientRect().bottom ?? 0) + 32;
    let index = 0;
    headings.forEach((heading, i) => {
      if (heading && heading.getBoundingClientRect().top <= line) index = i;
    });
    // At the end of the page the last sections may never reach the line.
    const page = document.documentElement;
    if (window.innerHeight + window.scrollY >= page.scrollHeight - 2) index = links.length - 1;
    const link = links[index];
    if (!link || link === current) return;
    current?.removeAttribute('aria-current');
    link.setAttribute('aria-current', 'true');
    current = link;
    follow();
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
}
