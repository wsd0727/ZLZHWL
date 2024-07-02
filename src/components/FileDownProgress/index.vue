<template>
  <span class="FileDownProgress"></span>
</template>
<script setup name="FileDownProgress">
import { ElNotification } from 'element-plus'
import { Download } from "@element-plus/icons-vue";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
import useFileDownStore from "@/store/modules/filedown"
const theme = computed(() => settingsStore.theme);
const FileDownStore = useFileDownStore()
const filedownList = computed(() => FileDownStore.downList)

const ProgressList = ref({})

watch(filedownList.value, val => {
  val.forEach(el => {
    const domList = [...document.getElementsByClassName(el.path)]
    if (el.downProgress == null) {
      FileDownStore.delDown(el.path)
      return ElNotification({
        title: "下载失败",
        type: 'error',
      })
    }
    if (el.downProgress == '100') {
      setTimeout(() => {
        ProgressList.value[el.path].close()
        delete ProgressList.value[el.path]
        FileDownStore.delDown(el.path)
      }, 1500)
    }
    if (ProgressList.value.hasOwnProperty(el.path)) {
      if (el.downProgress) domList.find(i => i.className == el.path).innerHTML = `${el.downProgress}%`
    } else {
      ProgressList.value[el.path] = ElNotification({
        title: el.name,
        duration: 0,
        dangerouslyUseHTMLString: true,
        customClass: `progress-notify-item notify-${el.path}`,
        icon: Download,
        position: "bottom-right",
        showClose: false,
        message: `<p style="width:100%;color:#999">正在下载 <span class="${el.path}" style="float:right;color:#000">${el.downProgress}%</span></p>`
      })
    }
  })
}, { immediate: true })
</script>

<style lang="scss" scoped>
:deep(.progress-notify-item) {
  .el-notification__icon {
    color: #0c64eb !important;
  }
  .el-notification__group {
    width: 90%;
  }
  .el-notification__title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>