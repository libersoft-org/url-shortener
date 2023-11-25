const f = new Framework();
let pageName;

window.onload = async () => {
 document.addEventListener('page-loaded', () => getPageContent());
 pageName = document.title;
 await f.init();
};

async function getPageContent() {
 delError();
 f.qs('.loader').style.display = 'block';
 if (f.pathArr[0] == 'main') await getPageMain();
 else if (f.pathArr[0] == 'stats') await getPageStats();
 else if (f.pathArr[0] == 'created') await getPageCreated();
 else await getPageNotFound();
 f.qs('.loader').style.display = 'none';
}

async function getPageMain() {
 const main = await f.getFileContent('/html/main.html');
 f.qs('#content').innerHTML = main;
}

async function getPageStats() {
 console.log(f.pathArr[1]);
 const res = await f.getAPI('get_stats', { short: f.pathArr[1] });
 let stats_html = '';
 if (res.error != 0) stats_html = f.translate(await f.getFileContent('/html/stats-notfound.html'), { '{SHORT}': f.pathArr[1] });
 else {
  stats_html = f.translate(await f.getFileContent('/html/stats.html'), {
   '{SHORT}': location.protocol + '//' + location.hostname + '/r/' + res.data.short,
   '{LINK}': res.data.link,
   '{CREATED}': new Date(res.data.created).toLocaleString(),
   '{VISITS}': res.data.visits[0].cnt,
  });
 }
 f.qs('#content').innerHTML = stats_html;
}

async function getPageCreated() {
 const res = await f.getAPI('get_link', { short: f.pathArr[1] });
 let created_html = '';
 if (res.error != 0) {
  created_html = f.translate(await f.getFileContent('/html/created-notfound.html'), {
   '{SHORT}': location.protocol + '//' + location.hostname + '/r/' + f.pathArr[1]
  });
 } else {
  created_html = f.translate(await f.getFileContent('/html/created.html'), {
   '{SHORT}': location.protocol + '//' + location.hostname + '/r/' + res.data.short,
   '{LINK}': res.data.link,
   '{STATS}': location.protocol + '//' + location.hostname + '/stats/' + res.data.short,
  });
 }
 f.qs('#content').innerHTML = created_html;
}

async function getPageNotFound() {
 f.qs('#content').innerHTML = await f.getFileContent('/html/notfound.html');
}

async function create() {
 delError();
 const short = f.qs('#create-short').value.trim();
 const res = await f.getAPI('set_link', {
  link: f.qs('#create-link').value.trim(),
  short: short
 });
 if (res && res.error != 0) setError(res.message);
 else await f.getPage('created/' + short);
}

async function stats() {
 delError();
 await f.getPage('stats/' + f.qs('#stats-short').value.trim());
}

function setError(error) {
 f.qs('.error .message').innerHTML = error;
 f.qs('.error').style.display = 'block';
}

function delError() {
 f.qs('.error').style.display = 'none';
}

//f.qs('.loader').style.setProperty('display', 'block');
/*
 const diskInfo = (await f.getAPI('get_disk_info')).data;
 f.qs('#content .disk').innerHTML = f.translate(f.getHTML('disk'), {
  '{PERCENT}': ((diskInfo.used / diskInfo.total) * 100).toFixed(2),
  '{USED}': getHumanSize(diskInfo.used),
  '{FREE}': getHumanSize(diskInfo.total - diskInfo.used),
  '{TOTAL}': getHumanSize(diskInfo.total)
 });
*/
