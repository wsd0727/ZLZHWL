// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./views/**/*.vue");
/**
 * 将一个路径 转化为 组件
 * @author WangJun <piplns@163.com>
 * @param {String} view 页面路径
 * @returns  组件实例
 */
export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = defineAsyncComponent(() => modules[path]())
    }
  }
  return res;
};

export default loadView