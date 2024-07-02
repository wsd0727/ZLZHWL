/*
 * @Author: cc2049
 * @Date: 2024-01-25 10:23:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-08 08:36:54
 * @Description: 简介
 */
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    build: {
      minify: 'terser',
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      },
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
          //生产环境时移除console.log()
          // drop_console: true,
          drop_debugger: true,
        },
      },
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
        '~@': path.resolve(__dirname, "src"),
        '#': path.resolve(__dirname, './src/api')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置
    server: {
      port: 8078,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          target: 'http://192.168.10.40:8080/',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        },
        '/eos-api': {
          // target: 'http://116.63.138.118:8078/',// WZC
          // target: 'http://120.48.15.176/',// 接口监测
          // target: 'http://120.48.123.183',// 我找车 现场测试
          // target: 'http://120.48.123.183:8586',// 我找车 现场测试
          // target: 'http://120.48.14.220',// 我找车 生产
          // target: 'http://222.175.162.156:8083/',// 金德    TMS@2023123456!!
          target: 'http://8.130.143.184:9001/',// 众联
          // target: 'http://121.37.86.183:8074/',// 通钢仓储
          // target: 'http://116.63.138.118:8073/',// 仓储WMS
          // target: 'http://120.48.123.183:8886',// 天山铝业
        },
        '/group1/M00': {
          target: 'http://120.48.123.183'
        }
      }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  }
})
