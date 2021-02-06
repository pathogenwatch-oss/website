
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const path = '/';
const expires = new Date();
expires.setFullYear(expires.getFullYear() + 1);

function getCookieSeen() {
  return Boolean(cookies.get('cookie-seen'));
}

function setCookieSeen() {
  return cookies.set('cookie-seen', true, { path, expires });
}

function getIsTourSkipped() {
  return Boolean(cookies.get('tour-skipped'));
}

function setIsTourSkipped() {
  return cookies.set('tour-skipped', true, { path, expires });
}

function set(key, value) {
  return cookies.set(key, value, { path, expires });
}

export default {
  getCookieSeen,
  setCookieSeen,
  getIsTourSkipped,
  setIsTourSkipped,
  set,
};
