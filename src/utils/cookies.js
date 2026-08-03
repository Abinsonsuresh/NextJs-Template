export function setCookie(name, value, days = 7) {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`
}
