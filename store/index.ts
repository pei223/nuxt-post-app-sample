import { Context } from '@nuxt/types'
import type { Store } from 'vuex'
import { initialiseStores, appStore } from './store-accessor'
import CookieService from '~/services/CookieService'
const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]

export const actions = {
  nuxtServerInit(_: any, { req }: Context) {
    if (!req.headers?.cookie) {
      return
    }
    const token = new CookieService(req.headers.cookie).getAuthToken()
    appStore.setAccessToken(token)
  },
}

export * from './store-accessor'
