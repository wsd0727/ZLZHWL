<template>
  <view class="timeout" v-if="show">
    <div class="name">{{ label || '距结束'}}:</div>
    <div class="timeout-item" v-for="(item, index) in timeArr" :key="index">{{ item }}</div>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue"
const props = defineProps({
  time: String ,
  label: String

})
const show = ref(true)
const timeArr = ref([])

const timeCha = ref(0)  // arr
const subTime = ref(null) // 倒计时
// const endTime = computed(() => Date.parse(props.time))
const newTime = computed(() => props.time)

watch(() => props.time, () => {


  clearInterval(subTime.value);
  timeCha.value = newTime.value;

  // let newTime = Date.now();
  // show.value = newTime < endTime.value
  show.value = newTime.value > 0
  // if (!show.value) return
  // timeCha.value = endTime.value - newTime
  // console.log("🚀 ~ watch ~ timeCha.value :", timeCha.value )
  timeArr.value = formatDuring(timeCha.value)
  subTime.value = setInterval(() => {
    timeCha.value -= 1000;
    if (timeCha.value < 0) {
      show.value = false
      return subTime.value = null
    }
    timeArr.value = formatDuring(timeCha.value)
  }, 1000)
}, {
  immediate: true
})

function formatDuring(millisecond) {
  // var days = parseInt(millisecond / (1000 * 60 * 60 * 24));
  // var hours = parseInt(millisecond / (1000 * 60 * 60 * 60));
  // var minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60));
  // var seconds = parseInt((millisecond % (1000 * 60)) / 1000);

  var days = parseInt(millisecond / (1000 * 60 * 60 * 24));
  var hours = parseInt(millisecond / (1000 * 60 * 60) % 24);
  var minutes = parseInt((millisecond / (1000 * 60)) % 60);
  var seconds = parseInt((millisecond / 1000) % 60);

  let arr = []
  arr.push(checkT(days <= 0 ? '00' : days))
  arr.push(checkT(hours <= 0 ? '00' : hours))
  arr.push(checkT(minutes <= 0 ? '00' : minutes))
  arr.push(checkT(seconds))
  return arr
}

function checkT(val) {
  // return val < 10 ? '0' + val : val
  return val < 10 && val !== '00' ? '0' + val : val
}

const countDownClearInterval = () => {
  clearInterval(subTime.value);
  timeCha.value = 0;
}

defineExpose({ countDownClearInterval })
</script>

<style lang="scss" scoped>
.timeout {
  // padding: 10px 10px;
  // background: #f5f8ff;
  font-size: 24px;
  // color: $primary;
  color: #333;
  display: inline-flex;
  align-items: center;
  border-radius: 10px;

  .name {
    margin-right: 3px;
    font-size: 20px;
    font-weight: 500;
    color: #DD593B;
    white-space: nowrap;
  }

  &-item {
    min-width: 38px;
    // background: #333;
    // color: #fff;
    margin-right: 16px;
    text-align: center;
    padding: 2px 0;
    position: relative;

    background: #FFEDEA;
    border-radius: 3px;

    font-size: 18px;
    font-weight: 500;
    color: #DD593B;

    &::after {
      content: ":";
      // color: #333;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -10px;

      // font-size: 23px;
      // font-weight: 500;
      color: #DD593B;

    }

    &:last-child {
      margin-right: 0;

      &::after {
        display: none;
      }
    }
  }
}
</style>