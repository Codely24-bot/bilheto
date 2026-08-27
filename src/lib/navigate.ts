export function navigate(href: string) {
  const url = new URL(href, location.origin);
  history.pushState(null, "", url.pathname + url.search);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}
