class Framework {
 constructor() {
  this.eventPageLoaded = new Event('page-loaded');
 }

 async init() {
  this.setPath(location.pathname);
  this.getReload();
  window.addEventListener('popstate', () => this.getReload());
 }

 setPath(path) {
  if (path) {
   if (!path.endsWith('/')) path += '/';
   if (!path.startsWith('/')) path = '/' + path;
  } else path = '/';
  this.path = path;
  this.pathArr = path.split('/').filter((item) => item !== '');
 }

 getReload() {
  return this.processPath(location.pathname, 'replaceState');
 }

 getPage(path) {
  return this.processPath(path, 'pushState');
 }

 processPath(path, historyMethod) {
  this.setPath(path);
  window.history[historyMethod]('', '', this.path);
  if (!this.pathArr || this.pathArr.length == 0) this.pathArr = ['main'];
  document.dispatchEvent(this.eventPageLoaded);
 }

 async getFileContent(file) {
  return (await fetch(file, { headers: { 'cache-control': 'no-cache' } })).text();
 }

 async getAPI(name, body = null) {
  const res = await fetch('/api/' + name, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: body ? JSON.stringify(body) : '{}'
  });
  return res.ok ? await res.json() : false;
 }

 translate(template, dictionary) {
  for (const key in dictionary) template = template.replaceAll(key, dictionary[key]);
  return template;
 }

 qs(query) {
  return document.querySelector(query);
 }

 qsa(query) {
  return document.querySelectorAll(query);
 }
}
