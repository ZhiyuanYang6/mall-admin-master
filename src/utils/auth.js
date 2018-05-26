const TokenKey = 'Admin-Token'

export function setSession(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeSession() {
  return sessionStorage.removeItem(TokenKey);
}

export function getSession() {
  return sessionStorage.getItem(TokenKey);
}
