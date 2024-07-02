import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
// import { VueAmapResolver } from '@vuemap/unplugin-resolver'

export default function createComponents() {
  return Components({
    resolvers: [
      ElementPlusResolver(),
      IconsResolver({
        enabledCollections: ['ep'],
      }),
      // VueAmapResolver()
    ],
    dts: false
  })
}