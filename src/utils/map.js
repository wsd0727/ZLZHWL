/**
 * 地图初始化 
 * @author WangJun 2024/03/13
 * @全局设置Key AMapSetting
 * @param string {"Key":"地图key","Code":"地图安全密钥"}
 */
import pinia from '@/store'
import AMapLoader from '@amap/amap-jsapi-loader';
import useSettingsStore from "@/store/modules/settings";
const useSetting = useSettingsStore(pinia)

let AmapSetting = null
function getKeyCode() {
  try {
    if (useSetting.systemConfig?.AMapCode) {
      AmapSetting = JSON.parse(useSetting.systemConfig.AMapCode)
    } else {
      AmapSetting = { Key: null, Code: null }
      console.error("获取地图配置失败");
    }
  } catch (error) {
    AmapSetting = { Key: null, Code: null }
    console.error("获取地图配置失败", error);
  }
}

const initMap = () => {
  getKeyCode()
  const { Key: key, Code: Scode } = AmapSetting
  if (!key || !Scode) return
  window._AMapSecurityConfig = {
    securityJsCode: Scode,
  }
  return new Promise((resolve, reject) => {
    AMapLoader.load({
      key: key,
      version: "2.0",
      AMapUI: {
        version: '1.1'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      console.error("amap init 失败:", err);
      reject(err)
    })
  })
}

export default initMap