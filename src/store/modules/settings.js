import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'

const { sideTheme, leftTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle, font, rowHeight, menuStyle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ""
const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '',
    theme: storageSetting.theme || '#0C64EB',
    leftTheme: storageSetting.leftTheme || leftTheme,
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings: showSettings,
    topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
    fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
    font: storageSetting.font === undefined ? font : storageSetting.font,
    rowHeight: storageSetting.rowHeight === undefined ? rowHeight : storageSetting.rowHeight,
    systemConfig: null,
    menuStyle: storageSetting.menuStyle === undefined ? menuStyle : storageSetting.menuStyle, // 菜单风格  MES ， WZC
    isCollapse: false
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data
      if (this.hasOwnProperty(key)) this[key] = value
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title
      useDynamicTitle();
    },
    setSystem(data) {
      this.systemConfig = data
    },
    setIsCollapse(data) {
      this.isCollapse = data
    }
  }
})

export default useSettingsStore
