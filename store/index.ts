import { Context } from '@nuxt/types'
import type { Store } from 'vuex'
import { initialiseStores, appStore } from './store-accessor'
import CookieService from '~/services/CookieService'

const initializer = (store: Store<any>) => initialiseStores(store)

export const actions = {
  nuxtServerInit(_: any, { req }: Context) {
    if (!req.headers?.cookie) {
      return
    }
    const cookieService = new CookieService(req.headers.cookie)
    appStore.fetchStoreFromCookie(cookieService)
  },
}

export * from './store-accessor'
export const plugins = [initializer]
