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