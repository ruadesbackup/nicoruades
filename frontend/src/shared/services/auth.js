const TOKEN_KEY = 'nr_auth_token'

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (e) {
    // noop
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    // noop
  }
}

export function isAuthenticated() {
  return Boolean(getToken())
}
