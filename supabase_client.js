// ════════════════════════════════════════════════════════════
// SUPABASE CLIENT — минимальный REST-обёртка без npm-зависимостей
// Работает напрямую через fetch к Supabase REST API (PostgREST)
// ════════════════════════════════════════════════════════════

var SUPABASE_URL = 'https://zqeeaoemjijuscrybgzh.supabase.co';
var SUPABASE_KEY = 'sb_publishable_foEUGFuOlW1sRDB-02m84A_FkheDSwL';

function sbHeaders(extra) {
  var h = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json'
  };
  if (extra) for (var k in extra) h[k] = extra[k];
  return h;
}

// ── INSERT a row into a table. Returns the inserted row(s). ──
function sbInsert(table, payload) {
  return fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method: 'POST',
    headers: sbHeaders({ 'Prefer': 'return=representation' }),
    body: JSON.stringify(payload)
  }).then(function(res) {
    if (!res.ok) {
      return res.text().then(function(t) { throw new Error('Supabase insert error: ' + res.status + ' ' + t); });
    }
    return res.json();
  });
}

// ── SELECT rows from a table. filters is an object like {token: 'eq.abc123'} ──
function sbSelect(table, filters, opts) {
  opts = opts || {};
  var qs = [];
  if (filters) {
    Object.keys(filters).forEach(function(k) { qs.push(k + '=' + encodeURIComponent(filters[k])); });
  }
  if (opts.order) qs.push('order=' + encodeURIComponent(opts.order));
  if (opts.select) qs.push('select=' + encodeURIComponent(opts.select));
  var url = SUPABASE_URL + '/rest/v1/' + table + (qs.length ? '?' + qs.join('&') : '');
  return fetch(url, { method: 'GET', headers: sbHeaders() }).then(function(res) {
    if (!res.ok) {
      return res.text().then(function(t) { throw new Error('Supabase select error: ' + res.status + ' ' + t); });
    }
    return res.json();
  });
}

// ── DELETE rows matching filters ──
function sbDelete(table, filters) {
  var qs = [];
  if (filters) Object.keys(filters).forEach(function(k) { qs.push(k + '=' + encodeURIComponent(filters[k])); });
  var url = SUPABASE_URL + '/rest/v1/' + table + (qs.length ? '?' + qs.join('&') : '');
  return fetch(url, { method: 'DELETE', headers: sbHeaders() }).then(function(res) {
    if (!res.ok) return res.text().then(function(t){ throw new Error('Supabase delete error: '+res.status+' '+t); });
    return true;
  });
}
