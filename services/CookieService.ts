import UniversalCookie from 'universal-cookie'

const AUTH_TOKEN_KEY = 'AUTH_TOKEN'

export default class CookieService {
  private cookieWrapper: UniversalCookie
  constructor(cookieStr?: string) {
    this.cookieWrapper = new UniversalCookie(cookieStr)
  }

  getAuthToken(): string {
    return this.cookieWrapper.get(AUTH_TOKEN_KEY)
  }

  setAuthToken(token: string) {
    this.cookieWrapper.set(AUTH_TOKEN_KEY, token)
  }
}
