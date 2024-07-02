<template>
  <div class="main el-upload--picture-card" @click="openModel">
    <el-image v-if="ImgUrl" :src="ImgUrl" />
    <el-icon class="avatar-uploader-icon" v-else>
      <Camera />
    </el-icon>

    <vxe-modal destroy-on-close v-model="modalVisible" width="45%" height="70%" id="formModal" resize storage transfer show-zoom show-footer @close="closeModel">
      <template #title>
        <span>拍照上传</span>
      </template>
      <template #default>
        <div class="photoBox">
          <!-- 画笔控件 用来拍照 -->
          <canvas style="display: none" ref="canvasDom" />
          <!-- 播放器，用来播放拍摄的视频 -->
          <video v-if="!photoUrl" class="camera_video" ref="videoDom" />
          <!--  显示照片  -->
          <img v-else class="watchPhoto" :src="photoUrl" />
        </div>
      </template>
      <template #footer>
        <el-button type="primary" size="default" @click="takePhoto">{{ photoUrl ? "重拍" : "拍照" }}</el-button>
        <el-button type="primary" size="default" v-if="photoUrl" @click="uploadImg">上传</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { fileUploadApi } from "#/common"
import axios from 'axios'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(["update:modelValue"])
const { proxy } = getCurrentInstance();



const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + fileUploadApi); // 上传的图片服务器地址
const headers = ref({
  Authorization: "Bearer " + getToken(),
  'Content-Type': 'multipart/form-data'
});

// canvas控件对象
const canvasDom = ref(null);
// video 控件对象
const videoDom = ref(null);
// 照片路径
const photoUrl = ref(null);
const ImgUrl = ref(null)
// 照片文件 上传用 
const imgFile = ref(null)

watch(() => props.modelValue, val => {
  if (val) {
    ImgUrl.value = val
    photoUrl.value = val
  } else {
    ImgUrl.value = null
    photoUrl.value = null
  }
}, { immediate: true });

const openCamera = () => {
  // 检测浏览器是否支持mediaDevices
  if (navigator.mediaDevices) {
    // 开启视频，关闭音频
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    }).then((stream) => {
      // 将视频流传入viedo控件
      videoDom.value.srcObject = stream;
      // 播放
      videoDom.value.play();
    }).catch((err) => {
      console.log(err);
    });
  } else {
    window.alert("该浏览器不支持开启摄像头，请更换最新版浏览器");
  }
};

// 拍照
const takePhoto = () => {
  // 如果已经拍照了就重新启动摄像头
  if (photoUrl.value) {
    photoUrl.value = null;
    openCamera()
    return;
  }
  // 设置画布大小与摄像大小一致
  canvasDom.value.width = videoDom.value.videoWidth;
  canvasDom.value.height = videoDom.value.videoHeight;
  // 执行画的操作
  canvasDom.value.getContext("2d").drawImage(videoDom.value, 0, 0);
  // 将结果转换为可展示的格式
  photoUrl.value = canvasDom.value.toDataURL("image/jpeg");
  // 关闭摄像头
  stop();
}

// 关闭摄像头
const stop = () => {
  let stream = videoDom.value.srcObject;
  if (!stream) return;
  let tracks = stream.getTracks();
  tracks.forEach((x) => {
    x.stop();
  });
};

function base64ToFile(base64, fileName) {
  // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
  const data = base64.split(',')
  // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
  const type = data[0].match(/:(.*?);/)[1]
  // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
  const suffix = type.split('/')[1]
  // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
  const bstr = window.atob(data[1])
  // 获取解码结果字符串的长度
  let n = bstr.length
  // 根据解码结果字符串的长度创建一个等长的整形数字数组
  // 但在创建时 所有元素初始值都为 0
  const u8arr = new Uint8Array(n)
  // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
  while (n--) {
    // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
    u8arr[n] = bstr.charCodeAt(n)
  }
  // 利用构造函数创建File文件对象
  // new File(bits, name, options)
  const file = new File([u8arr], `${fileName}.${suffix}`, {
    type: type
  })
  // 将File文件对象返回给方法的调用者
  return file
}

const modalVisible = ref(false)

// 上传图片
const uploadImg = () => {
  const fileName = (new Date()).valueOf()
  imgFile.value = base64ToFile(photoUrl.value, fileName)
  const formData = new FormData();
  formData.append('BILLFROM', "0")
  formData.append('file', imgFile.value)
  proxy.$modal.loading("正在上传图片，请稍候...");
  axios({
    url: uploadImgUrl.value,
    method: 'post',
    headers: headers.value,
    data: formData
  }).then(res => {
    const newRes = res.data
    if (newRes.STATUS == '200') {
      ImgUrl.value = (newRes.RESULT.FILEPATH.substr(0, 4) == 'http' || newRes.RESULT.FILEPATH.charAt(0) == '/') ? newRes.RESULT.FILEPATH : `/${newRes.RESULT.FILEPATH}`
      emit("update:modelValue", ImgUrl.value)
      closeModel()
    } else {
      emit("update:modelValue", "")
      proxy.$modal.closeLoading();
      proxy.$modal.msgError(newRes.MESSAGE);
    }
  }).finally(() => {
    proxy.$modal.closeLoading();
  })
}

const openModel = () => {
  modalVisible.value = true
  openCamera()
}
const closeModel = () => {
  modalVisible.value = false
  stop()
}
</script>
<style lang="scss" scoped>
.main {
  background-color: var(--el-fill-color-lighter);
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 6px;
  box-sizing: border-box;
  width: var(--el-upload-picture-card-size);
  height: var(--el-upload-picture-card-size);
  cursor: pointer;
  vertical-align: top;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.camera_video {
  width: 100%;
  height: 100%;
  border: 1px dashed var(--el-border-color-darker);
}
.watchPhoto {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.photoBox {
  width: 100%;
  height: 100%;
}
</style>