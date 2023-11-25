const Data = require('./data.js');

class API {
 constructor() {
  this.apiMethods = {
   get_link: this.getLink,
   get_stats: this.getStats,
   set_link: this.setLink,
   set_visit: this.setVisit
  };
 }

 async processAPI(name, params) {
  console.log('API request: ', name);
  console.log('Parameters: ', params);
  const method = this.apiMethods[name];
  if (method) return await method.call(this, params);
  else return { error: 1, message: 'API not found' };
 }

 async runAPI() {
  this.data = new Data();
  await this.data.init();
 }

 async getLink(p = {}) {
  if (!p.short) return { error: 1, message: 'No short name specified.' };
  const res = await this.data.getLinkByShort(p.short);
  if (!res) return { error: 2, message: 'The short link does not exist.' };
  return { error: 0, data: res };
 }

 async getStats(p = {}) {
  if (!p.short) return { error: 1, message: 'No short name specified.' };
  const link = await this.data.getLinkByShort(p.short);
  if (!link) return { error: 2, message: 'The short link does not exist.' };
  const res = await this.data.getStats(link.id);
  return {
   error: 0,
   data: {
    id: link.id,
    short: link.short,
    link: link.link,
    created: link.created,
    visits: res
   }
  }
 }

 async setLink(p = {}) {
  if (!p.link) return { error: 1, message: 'No destination link specified.' };
  if (!p.short) return { error: 2, message: 'No short name specified.' };
  const res = await this.data.getLinkByShort(p.short);
  if (res) return { error: 3, message: 'The short link name already exists.' };
  if (!/^[a-z0-9]{1,32}$/.test(p.short)) return { error: 4, message: 'The short link name can only contain lower case letters or numbers and has to have 1 - 32 characters.' };
  await this.data.setLink(p.link, p.short);
  return { error: 0, message: 'The link has been successfully created.' };
 }

 async setVisit(p = {}) {
  console.log(p);
  if (!p.short) return { error: 1, message: 'No short name specified.' };
  const res = await this.data.getLinkByShort(p.short);
  if (!res) return { error: 2, message: 'The short link does not exist.' };
  await this.data.setVisit(res.id);
  // TODO: short name does not exist
  return { error: 0, message: 'The visit was successfully stored in database.' };
 }
}

module.exports = API;
