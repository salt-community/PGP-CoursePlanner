export function getHomeUrl() {
  const pathName = location.href;
  const len = pathName.length
  let i = -1
  let index = 3;
  while (index-- && i++ < len) {
    i = pathName.indexOf("/", i);
    if (i < 0) break;
  }
  return pathName.substring(0, i);
}

export function trackUrl() {
  const url = window.location.href;
  const history = JSON.parse(localStorage.getItem('urlHistory') || '[]');

  // Only store the current URL if it's different from the last one
  if (history[history.length - 1] !== url) {
    history.push(url);
    localStorage.setItem('urlHistory', JSON.stringify(history));
  }
}