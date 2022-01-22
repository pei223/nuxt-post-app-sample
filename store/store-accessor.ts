import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AppStore from './AppStore'

// eslint-disable-next-line import/no-mutable-exports
let appStore: AppStore

function initialiseStores(store: Store<any>): void {
  appStore = getModule(AppStore, store)
}

export { initialiseStores, appStore }
