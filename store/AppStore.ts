import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { User } from '~/domain/UserInfo'
import CookieService from '~/services/CookieService'

type WithCookieService<T> = {
  value: T
  cookieService: CookieService
}

@Module({
  name: 'AppStore',
  stateFactory: true,
  namespaced: true,
})
export default class AppStore extends VuexModule {
  accessToken: string = ''
  curretnUser: User | null = null

  @Mutation
  setAccessToken({
    value: accessToken,
    cookieService,
  }: WithCookieService<string>) {
    this.accessToken = accessToken
    cookieService.setAuthToken(accessToken)
  }

  @Mutation
  setUser({ value: user, cookieService }: WithCookieService<User>) {
    this.curretnUser = user
    cookieService.setUserInfo(user)
  }

  @Mutation
  fetchStoreFromCookie(cookieService: CookieService) {
    const token = cookieService.getAuthToken()
    const userInfo = cookieService.getUserInfo()
    if (userInfo === null || token === '') {
      return
    }
    this.accessToken = token
    this.curretnUser = userInfo
  }

  @Mutation
  clear(cookieService: CookieService) {
    this.accessToken = ''
    this.curretnUser = null
    cookieService.deleteAuthToken()
    cookieService.deleteUserInfo()
  }
}
