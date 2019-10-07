const fs = require('fs');
const libmoji = require('libmoji');
const fetch = require('node-fetch');
const path = require('path');

const test = require('tape');

function getBitmojiOS( params = {} ){
  if(!params) params = {};
  const {gender='', traits={}, outfit=''} = params;

  return libmoji.buildPreviewUrl(
    "fashion",
    1,
    gender === 'female' ? 2 : 1,
    4, 0,
    Object.keys(traits).map(k => [k, traits[k]]),
    outfit
  );
}

function getJSON(s) {
  try{
    return JSON.parse(s);
  }
  catch(e) {
    return null;
  }
}

test('bitmojis', async t => {
  const files = fs.readdirSync(path.join(__dirname, '../bitmojis'));

  for(let i in files) {
    const filename = files[i];
    t.test(`Bitmoji at ${filename}`, async st => {

      const contents = fs.readFileSync(path.join(__dirname, '../bitmojis/', filename), 'utf8');
      const obj = getJSON(contents);

      st.notEqual(obj, null, `Bitmoji JSON at ${filename} must be valid JSON`);

      const url = getBitmojiOS(obj);
      const res = await fetch(url).catch(() => null);

      st.equal(res.ok, true, `Generated Bitmoji picture for ${filename} must return a picture - ${url}`);
      st.end();
    })
  }
  t.end();
})
