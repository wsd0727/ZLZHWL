<template>
  <div class="upload-file">
    <template v-if="fileList.length < limit">
      <el-upload :multiple="limit!='1'" :accept="fileAccept" :action="uploadFileUrl" :before-upload="handleBeforeUpload" :file-list="fileList" :limit="limit" :on-error="handleUploadError" :on-exceed="handleExceed" :on-success="handleUploadSuccess" :show-file-list="false" :headers="headers" :data="upData" class="upload-file-uploader" ref="fileUpload">
        <!-- 上传按钮 -->
        <el-button type="">选择附件</el-button>
      </el-upload>
      <!-- 上传提示 -->
      <!-- <div class="el-upload__tip" v-if="showTip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileTypeArr"> 格式为 <b style="color: #f56c6c">{{ fileTypeArr.join("/") }}</b> </template>
        的文件
      </div> -->
    </template>
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="file.url" :underline="false" target="_blank" class="file-item" :title="getFileName(file.name)">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { fileUploadApi } from "#/common";

const props = defineProps({
  modelValue: [String, Object, Array],
  filelist: {
    type: Array,
    default: []
  },
  // 数量限制
  limit: {
    type: Number,
    default: 1,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 50,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: String,
    default: ".pdf"
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 上传时追加数据
  data: {
    type: Object,
    default: {}
  },
  // 文件上传接口地址
  ajaxUrl: {
    type: String,
    default: ""
  },
});

const { proxy } = getCurrentInstance();
const emit = defineEmits(['change', "update:modelValue"]);
const number = ref(0);
const uploadList = ref([]);
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + (props.ajaxUrl != "" ? props.ajaxUrl : fileUploadApi)); // 上传的图片服务器地址
const headers = ref({ Authorization: "Bearer " + getToken() });
// 上传附带数据
const upData = ref({
  ...props.data,
  BILLFROM: "0"
})
const fileList = ref([]);
// 默认文件格式 txt\PDF、word、excel、ppt、apk、jpg、png、sql、rar，zip
const basefileType = [];
const fileTypeArr = computed(() => props.fileType == '' ? ["pdf"] : props.fileType.split(",").map(el => el.replaceAll(".", '')))
const fileAccept = computed(() => fileTypeArr.value.map(el => `.${el}`))
const showTip = computed(() => props.isShowTip && (fileTypeArr.value || props.fileSize));

watch(() => props.modelValue, val => {
  if (val) {
    let temp = 1,
      list = props.filelist;
    if (list.length == 0) {
      // 兼容 无Arr
      list = Array.isArray(val) ? val : val.split(',');
      fileList.value = list.map(el => {
        return {
          name: getFileName(el),
          uid: new Date().getTime() + temp++,
          url: el
        }
      })
      uploadList.value = list.map(el => {
        return {
          FILENAME: getFileName(el),
          URL: el,
          BILLNO: "",
          SIZE: 0,
          CREATIONTIME: ""
        }
      })
    } else {
      fileList.value = list.map(el => {
        return {
          name: el.FILENAME,
          uid: new Date().getTime() + temp++,
          url: el.URL
        }
      })
      uploadList.value = list;
    }
    number.value = uploadList.value.length
    // let temp = 1;
    // // 首先将值转为数组
    // const list = Array.isArray(val) ? val : val.split(',');
    // // 然后将数组转为对象数组
    // fileList.value = list.map(item => {
    //   let nameArr = item.split("/");
    //   if (typeof item === "string") item = { name: nameArr[nameArr.length - 1], url: item };
    //   item.uid = item.uid || new Date().getTime() + temp++;
    //   return item;
    // });
  } else {
    fileList.value = [];
    uploadList.value = [];
    number.value = 0
    return [];
  }
}, { deep: true, immediate: true });

// 上传前校检格式和大小
function handleBeforeUpload(file) {
  // 校检文件类型
  if (fileTypeArr.value.length) {
    let fileExtension = "";
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    const isTypeOk = fileTypeArr.value.some((type) => {
      if (file.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
    if (!isTypeOk) {
      proxy.$modal.msgError(`文件格式不正确, 请上传${fileTypeArr.value.join("/")}格式文件!`);
      return false;
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    if (file.size == '0') {
      proxy.$modal.msgError(`不可上传空白文件！`);
      return false;
    }
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("正在上传文件，请稍候...");
  number.value++;
  return true;
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

// 上传失败
function handleUploadError(err) {
  proxy.$modal.closeLoading()
  proxy.$modal.msgError("上传文件失败");
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.SUCCESS) {
    uploadList.value.push({
      FILENAME: res.RESULT.SUBMITTEDFILENAME,
      URL: res.RESULT.FILEPATH.includes('http')? res.RESULT.FILEPATH : '/' + res.RESULT.FILEPATH,
      BILLNO: res.RESULT.PK_FILE,
      SIZE: res.RESULT.SIZE,
      CREATIONTIME: res.RESULT.CREATIONTIME
    });
    uploadedSuccessfully();
  } else {
    number.value--;
    proxy.$modal.closeLoading();
    proxy.$modal.msgError(res.MESSAGE);
    proxy.$refs.fileUpload.handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除文件
function handleDelete(index) {
  fileList.value.splice(index, 1);
  uploadList.value.splice(index, 1)
  number.value--;
  emit("change", uploadList.value)
  emit("update:modelValue", listToString(uploadList.value));
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value);
    // uploadList.value = [];
    // number.value = 0;
    emit("change", uploadList.value)
    emit("update:modelValue", listToString(uploadList.value));
    proxy.$modal.closeLoading();
  }
}

// 获取文件名称
function getFileName(name) {
  if(name.includes('attname')){
    let newName = name.split('=')[1];
    return newName
  }else if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return name;
  }
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = "";
  separator = separator || ",";
  for (let i in list) {
    if (list[i].URL) {
      strs += `${list[i].URL}${separator}`;
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : '';
}
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action {
  display: flex;
  align-items: center;
  justify-items: center;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
ul {
  width: 100%;
  li {
    width: 100%;
  }
  .file-item {
    width: calc(100% - 40px);
    overflow: hidden;
    text-align: left;
    padding-left: 5px;
    justify-content: flex-start;
    :deep(.el-link__inner) {
      width: 100%;
      justify-content: flex-start;
    }
    .el-icon-document {
      display: block;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.el-upload__tip {
  line-height: 1.3;
}
:deep(.el-icon--close-tip) {
  display: none !important;
  opacity: 0 !important;
  top: 1000px !important;
}
</style>
