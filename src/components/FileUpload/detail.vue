<template>
  <div class="file-detail" v-if="fileList.length">
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="file.url" :underline="false" target="_blank" class="file-item" :title="getFileName(file.name)">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action" v-if="!detail">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Object, Array],
  detail: {
    type: Boolean,
    default: true
  },
  filelist: {
    type: Array,
    default: []
  },
  down: {
    type: Boolean,
    default: false
  }
})
const { proxy } = getCurrentInstance();
const emit = defineEmits(['change', "update:modelValue"]);
const fileList = ref([]);
const uploadList = ref([])

const resetImgUrl = (path)=>{
  if(path.includes('http') || path.charAt(0) == '/' ){
    return path
  }else{
    return '/'+path
  }
}

watch(() => props.modelValue, val => {
  if (val) {
    let temp = 1,
      list = props.filelist;
    if (list.length == 0) {
      // 兼容 无Arr
      list = Array.isArray(val) ? val : val.split(',');
      fileList.value = list.map(el => {
        console.log(el)
        return {
          name: getFileName(el),
          uid: new Date().getTime() + temp++,
          url: resetImgUrl( el)
        }
      })
      uploadList.value = list.map(el => {
        return {
          FILENAME: getFileName(el),
          URL: resetImgUrl( el) ,
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
  } else {
    fileList.value = [];
    uploadList.value = [];
    return [];
  }
}, { deep: true, immediate: true });

const handleFile = index => {
  const row = fileList.value[index];
  let url = row.url
}


function handleDelete(index) {
  fileList.value.splice(index, 1);
  uploadList.value.splice(index, 1)
  emit("change", uploadList.value)
  emit("update:modelValue", listToString(uploadList.value));
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
</script>

<style scoped lang="scss">
.file-detail {
  display: block;
  width: 100%;
}
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
  margin: 0;
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
</style>