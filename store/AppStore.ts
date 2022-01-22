import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'AppStore',
  stateFactory: true,
  namespaced: true,
})
export default class AppStore extends VuexModule {
  accessToken: string = ''

  @Mutation
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken
  }
}
