import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import createComponents from './components'
import createIcons from './icon'
import { visualizer } from "rollup-plugin-visualizer";

// import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue(),
        visualizer({
            gzipSize: true,
            brotliSize: true,
            emitFile: false,
            filename: "BuildReport.html", //分析图生成的文件名
            open: false //如果存在本地服务端口，将在打包后自动展示
        })
    ]
    vitePlugins.push(createAutoImport())
    vitePlugins.push(createComponents())
    vitePlugins.push(createIcons())
    vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
    isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
