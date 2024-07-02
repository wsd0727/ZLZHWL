<template>
  <div class="playback-tools">
    <div class="playback-tools-item" v-if="speed">
      <span>播放速度</span>
      <el-slider v-model="PlaySpeed" :min="1" :max="10" :format-tooltip="val=>val+'x'" show-stops @change="ChangeSpeed" />
    </div>
    <div class="playback-tools-item" v-if="progress">
      <span>播放进度</span>
      <el-slider v-model="PlayProcess" :min="0" :max="100" :format-tooltip="val=>val+'%'" striped text-inside @change="ChangeProcess" @input="InputProcess" />
    </div>
    <div class="playback-tools-item" style="margin-top:10px">
      <el-button type="primary" @click="startAnimation" v-if="PlayStatus == 0">开始回放</el-button>
      <el-button type="primary" @click="pauseAnimation" v-if="PlayStatus == 1">暂停回放</el-button>
      <el-button type="primary" @click="resumeAnimation" v-if="PlayStatus == 2">继续回放</el-button>
      <el-button type="primary" @click="stopAnimation" v-if="PlayStatus > 0">停止回放</el-button>
    </div>
  </div>
</template>

<script setup>
import { boolean } from "mathjs";

/**
 * 轨迹回放组件
 * 2024-04-16 WangJun
 * @param AmapRef 高德地图实例
 * @param mapRef 地图实例
 * @param path 轨迹点数组
 */
const props = defineProps({
  AmapRef: Object,
  mapRef: Object,
  path: Array,
  speed: {
    type: boolean,
    default: true
  },
  progress: {
    type: boolean,
    default: true
  }
})

const PlayBack = ref() // 播放器实例
const OverPlay = ref() // 已播放的实例

const Init = () => {
  const startPath = props.path[0];
  PlayBack.value = new props.AmapRef.Marker({
    map: props.mapRef,
    position: startPath,
    icon: new URL("@/assets/images/map/playbackcar.png", import.meta.url).href,
    offset: new props.AmapRef.Pixel(-13, -26),
  });
  OverPlay.value = new props.AmapRef.Polyline({
    map: props.mapRef,
    strokeColor: "#18DA88",
    strokeWeight: 6,
    isOutline: true,
    outlineColor: "#ffeeff",
    lineJoin: "round",
    lineCap: "round",
    showDir: true,
  });
  PlayBack.value.on("moving", function (e) {
    OverPlay.value.setPath(e.passedPath);
    props.mapRef.setCenter(e.target.getPosition(), true);
    // RePlayStart.value = e.index
    // 更新进度条
    PlayProcess.value = Math.round((e.passedPath.length + RePlayStart.value) / props.path.length * 100)
  });
}

const PlayStatus = ref(0) // 播放状态
const PlaySpeed = ref(1) // 播放倍率
const PlayProcess = ref(0) // 播放进度
const RePlayStart = ref(0) // 重放下边

const startAnimation = () => {
  const path = []
  for (let i = RePlayStart.value; i < props.path.length; i++) {
    const el = props.path[i]
    path.push(el)
  }
  PlayBack.value.moveAlong(path, {
    // duration: 10,
    speed: 5000 * PlaySpeed.value,
    circlable: false,
    autoRotation: true
  })
  PlayStatus.value = 1
}
const pauseAnimation = () => {
  PlayStatus.value = 2
  PlayBack.value.pauseMove();
}
const resumeAnimation = () => {
  PlayStatus.value = 1
  PlayBack.value.resumeMove();
}
const stopAnimation = () => {
  PlayStatus.value = 0
  PlayBack.value.stopMove();
  PlayProcess.value = 0
  RePlayStart.value = 0
  PlayBack.value.setPosition(props.path[RePlayStart.value]);
}

const ChangeSpeed = () => {
  if (PlayStatus.value == 1) pauseAnimation()
  RePlayStart.value = Math.round(props.path.length * PlayProcess.value / 100);
  if (PlayStatus.value == 2) startAnimation()
}

const InputProcess = () => {
  if (PlayStatus.value == 1) pauseAnimation()
  RePlayStart.value = Math.round(props.path.length * PlayProcess.value / 100);
  PlayBack.value.setPosition(props.path[RePlayStart.value]);
}
const ChangeProcess = () => {
  if (PlayStatus.value == 2) startAnimation()
}

defineExpose({ Init });
</script>
<style lang="scss" scoped>
</style>