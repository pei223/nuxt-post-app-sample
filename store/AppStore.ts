import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { User } from '~/domain/UserInfo'

@Module({
  name: 'AppStore',
  stateFactory: true,
  namespaced: true,
})
export default class AppStore extends VuexModule {
  accessToken: string = ''
  curretnUser: User | null = null

  @Mutation
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }

  @Mutation
  setUser(user: User) {
    this.curretnUser = user
  }
}
