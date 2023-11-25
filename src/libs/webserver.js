const fs = require('fs');
const path = require('path');
const { Elysia } = require('elysia');
//const { ip } = require('elysia-ip');
const API = require('./api.js');
const { Common } = require('./common.js');

class WebServer {
 async run() {
  try {
   this.api = new API();
   await this.api.runAPI();
   await this.startServer();
  } catch (ex) {
   Common.addLog('Cannot start web server.', 2);
   Common.addLog(ex, 2);
  }
 }

 async startServer() {
  const app = new Elysia()
   //.use(ip())
   .onRequest((req) => {
    //console.log(req);
    let url = '/' + req.request.url.split('/').slice(3).join('/');
    Common.addLog(req.request.method + ' request from: ' + req.request.headers.get('cf-connecting-ip') + ' (' + (req.request.headers.get('cf-ipcountry') + ')') + ', URL: ' + url);
   })
   .post('/api/:name', async (req) => this.getAPI(req))
   .get('/r/:name', async (req) => this.getRedirect(req))
   //.get('/*', async ({ ip, req }) => this.getFile(ip, req))
   .get('/*', async (req) => this.getFile(req))
  const server = { fetch: app.fetch };
  if (Common.settings.web.standalone) server.port = Common.settings.web.port;
  else server.unix = Common.settings.web.socket_path;
  Bun.serve(server);
  if (!Common.settings.web.standalone) fs.chmodSync(Common.settings.web.socket_path, '777');
  Common.addLog('Web server is running on ' + (Common.settings.web.standalone ? 'port: ' + Common.settings.web.port : 'Unix socket: ' + Common.settings.web.socket_path));
 }

 async getAPI(req) {
  return new Response(JSON.stringify(await this.api.processAPI(req.params.name, req.body)), { headers: { 'Content-Type': 'application/json' }})
 }

 async getRedirect(req) {
  console.log(req);
  console.log(req.request.headers.get('user-agent'));
  console.log(req.connection);
  if (!req.params.name) return this.getIndex(req);
  // TODO: check if link exists
  const link = await this.api.processAPI('get_link', { short: req.params.name });
  if (link.error != 0) return this.getIndex(req);
  await this.api.processAPI('set_visit', { short: req.params.name });
  return new Response(null, { status: 302, headers: { 'Location': link.data.link } });
 }

 //async getIndex(ip, req) {
 async getIndex(req) {
  console.log(req);
  //console.log(ip);
  const content = await Bun.file(path.join(__dirname, '../web/index.html')).text();
  return new Response(Common.translate(content, {
   '{TITLE}': Common.settings.web.name,
   '{DESCRIPTION}': Common.settings.web.description
  }), { headers: { 'Content-Type': 'text/html' }});
 }

 async getFile(req) {
  const file = Bun.file(path.join(__dirname, '../web/', req.path));
  if (!await file.exists()) return this.getIndex(req);
  else return new Response(file);
 };
}

module.exports = WebServer;
