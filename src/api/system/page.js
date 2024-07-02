/*
 * @Author: cc2049
 * @Date: 2024-01-25 10:22:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-13 16:37:18
 * @Description: 简介
 */
import localforage from 'localforage'
import request from "@/utils/request";
import Cookies from 'js-cookie'

// 设置本地数据库名称
const EosIndexedDB = localforage.createInstance({
  name: 'EosIndexedDB',
})
let PageCache = null; // 是否开启本地数据库缓存

// 查询页面配置
export async function getPageConfig(data) {
  let localKey = data.MODULEID + data.PAGEID
  PageCache = Cookies.get('PageCache') || null
  try {
    const localData = await localforage.getItem(localKey);
    let configData = null;
    if (PageCache == 1 && localData) {
      configData = localData
    } else {
      configData = await request({
        url: "/sys/pageConfig/getByPageNo",
        method: "post",
        data: data,
      })
      PageCache==1 ? localforage.setItem(localKey, configData) : null
      console.log('PageCache', typeof PageCache);
    }

    return new Promise((resolve, reject) => {
      resolve(configData);
    });
  } catch (err) {
    console.log(err);
  }
}

// 查询列表配置
export function getTableData(url, data) {
  delete data.EnumData
  return request({
    url: url,
    method: "post",
    data
  });
}

// 公共的数据交互接口
export function axiosSave(url, data) {
  return request({
    url: url,
    method: "post",
    data: data,
    isRepeatSubmit: true
  });
}



//重置列配置接口
export function restClick(data) {
  return request({
    url: "/sys/selectConfig/reset",
    method: "post",
    data: data,
  });
}

