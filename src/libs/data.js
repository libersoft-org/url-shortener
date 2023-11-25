const crypto = require('crypto');
const Database = require('./database.js');
const { Common } = require('./common.js');

class Data {
 constructor() {
  this.db = new Database();
 }

 async init() {
  await this.db.open();
  await this.db.query('USE ' + Common.settings.database.name);
  Common.addLog('Database "' + Common.settings.database.name + '" is connected ...');
 }

 async dbCreate() {
  await this.db.open();
  await this.db.query('CREATE DATABASE IF NOT EXISTS ' + Common.settings.database.name);
  await this.db.query('USE ' + Common.settings.database.name);
  await this.db.query('CREATE TABLE IF NOT EXISTS urls (id INT PRIMARY KEY AUTO_INCREMENT, link TEXT NOT NULL, short VARCHAR(128) NOT NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
  await this.db.query('CREATE TABLE IF NOT EXISTS visits (id INT PRIMARY KEY AUTO_INCREMENT, id_urls INT, FOREIGN KEY (id_urls) REFERENCES urls(id), ip VARCHAR(39) NULL, ip_forwarded VARCHAR(39) NULL, ip_client VARCHAR(39) NULL, variable VARCHAR(255) NULL, user_agent VARCHAR(128) NULL, referrer VARCHAR(255) NULL, os VARCHAR(64) NULL, country VARCHAR(32) NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
  await this.db.close();
 }

 async getLinkByShort(short) {
  const res = await this.db.query('SELECT id, link, short, created FROM urls WHERE short = ?', [short]);
  if (res.length != 1) return null;
  return res[0];
 }

 async setLink(link, short) {
  return await this.db.query('INSERT INTO urls (link, short) VALUES (?, ?)', [link, short]);
 }

 async setVisit(id_urls, ip, ip_forwarded, user_agent, referer, country) {
  
 }

 async getStats(id) {
  return await this.db.query('SELECT COUNT(*) AS cnt FROM visits WHERE id_urls = ?', [id]);
 }
/*
 async getCategories(items = null, order = 'created', direction = false, search = null, count = 12, offset = 0) {
  let query = `
   SELECT
    id,
    name,
    link,
    image,
    (SELECT COUNT(*) FROM items WHERE id_categories = categories.id) AS items_count,
    (SELECT COUNT(*) FROM items WHERE id_categories = categories.id AND hidden = 1) AS items_count_hidden,
    created
   FROM categories
  `;
  const params = [];
  if (search) {
   query += ' WHERE MATCH(name) AGAINST (?)';
   params.push(search);
  }
  if (items === true || items === false) query += ' HAVING items_count - items_count_hidden ' + (items ? '!=' : '=') + ' 0';
  query += ' ORDER BY ' + this.db.escapeId(order) + ' ' + (direction ? 'DESC' : 'ASC') + ', id ' + (direction ? 'DESC' : 'ASC');
  query += ' LIMIT ? OFFSET ?';
  params.push(count);
  params.push(offset);
  return await this.db.query(query, params);
 }
*/

/*
 async setRegistration(params) {
  if (!/^[A-Za-z0-9]{3,24}$/.test(params.username)) return { error: 2, message: 'User name must be 3 to 24 characters long and can contain only letters and numbers!' };
  if (!validateEmail(params.email)) return { error: 4, message: 'E-mail is in invalid format!' };
  if (!(params.sex === '0' || params.sex === '1')) return { error: 6, message: 'You have to choose the right sex!' };
  if (!params.month || !params.day || !params.year || !checkDate(params.month, params.day, params.year)) return { error: 7, message: 'The date is in invalid format!' };
  if (params.password.length < 3) return { error: 8, message: 'The minimum password length is 3 characters!' };
  if (params.password !== params.password2) return { error: 9, message: 'Passwords does not match!' };
  if (!params.terms) return { error: 10, message: 'You have to agree with registration terms!' };
  if (!params.ip) params.ip = 'not available';
  if (!params.session) params.session = 'not available';
  const usernameExists = await this.db.query('SELECT COUNT(*) AS cnt FROM users WHERE username = ?', [params.username]);
  if (usernameExists[0].cnt > 0) return { error: 3, message: 'User name already exists!' };
  const emailExists = await this.db.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ?', [params.email]);
  if (emailExists[0].cnt > 0) return { error: 5, message: 'Account with the same e-mail already exists!' };
  const hash = crypto.createHash('sha1');
  hash.update(new Date().getTime() + Math.random().toString());
  const confirmation = hash.digest('hex');
  const passwordHash = crypto.createHash('sha1').update(params.password).digest('hex');
  try {
   const result = await this.db.query(`
    INSERT INTO users
    (username, password, email, first_name, last_name, sex, birthdate, confirmation, reg_ip, reg_session, reg_user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [params.username, passwordHash, params.email, params.firstname, params.lastname, params.sex, params.year + '-' + params.month + '-' + params.day, confirmation, params.ip, params.session, params.useragent]
   );
   //if (!sendConfirmationEmail(confirmation, params.email, params.username, params.firstname, params.lastname)) {
   // return { error: 11, message: 'Error while sending confirmation e-mail!' };
   //}
   const userId = result.insertId;
   const res = await this.validateLogin(params);
   if (res.error) return res;
   return { error: 0, data: res.data };
  } catch (error) {
   return { error: 99, message: 'Database error, try later!' };
  }
 }
*/
}

module.exports = Data;
