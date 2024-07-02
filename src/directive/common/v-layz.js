/**
 * v-lazy 图片懒加载
 * Copyright (c) 2023-6-20 cc2049
 */
// 定义懒加载插件
import { useIntersectionObserver } from "@vueuse/core";
export default {
  mounted(el, binding) {
    // el:指令绑定的那个元素 img
    // binding: binding.value 指令等于号后面绑定的表达式的值 图片 url
    // console.log(el, binding.value);
    const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        el.src = binding.value;
        stop();
      }
    });
  },
};
