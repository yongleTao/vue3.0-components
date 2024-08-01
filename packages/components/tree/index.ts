import { withInstall } from '@zi-shui/utils/with-install'
import _Tree from './src/tree.vue'

const Tree = withInstall(_Tree)

export default Tree
// export * from './src/tree'

declare module 'vue' {
  export interface GolbalComponents {
    ZTree: typeof Tree
  }
}

export * from './src/tree'
