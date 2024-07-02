<template>
  <div class="PlugPage-app">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="已安装" name="first">
        <div class="contentDiv" v-for="(itemHtml, htminIn) in images" :key="htminIn">
          <!-- <img src="../../assets/img/2.png" class="imgClass" alt=""> -->
          <span class="titleCLass">{{itemHtml.title}}</span>
          <div class="image-buttons">
            <!-- Buttons for preview and install -->
            <el-button>预览</el-button>
            <el-button type="primary">卸载</el-button>
          </div>
        </div>
        <div class="contentDiv2" @click="jumpPage">
          <div class="image-buttons">
            <!-- Buttons for preview and install -->
            <el-icon>
              <Plus />
            </el-icon>
            <p>新增插件</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未安装" name="second"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
const router = useRouter();
const activeName = ref('first')
const previewImage = ref('')
const images = ref([
  // { url: '../../assets/img/2.png', installable: false, title: "罚款缴费" },
  { url: 'https://gw.alicdn.com/imgextra/i4/O1CN01luau8e21cneec19fk_!!6000000007006-2-tps-512-342.png', installable: false, title: "短信叫号" },
  { url: 'https://gw.alicdn.com/imgextra/i4/O1CN018jD7jw1yTgvLbiDOZ_!!6000000006580-2-tps-512-342.png', installable: false, title: "车检管理" },
  { url: 'https://gw.alicdn.com/imgextra/i4/O1CN0172AQEx22FGuhO6Eah_!!6000000007090-2-tps-512-342.png', installable: false, title: "车检记录" },
  { url: 'https://gw.alicdn.com/imgextra/i4/O1CN0172AQEx22FGuhO6Eah_!!6000000007090-2-tps-512-342.png', installable: false, title: "调度管理" },
  { url: 'https://gw.alicdn.com/imgextra/i4/O1CN0172AQEx22FGuhO6Eah_!!6000000007090-2-tps-512-342.png', installable: false, title: "装车看板" },
])
function jumpPage() {
  router.push({
    path: '/public/anliCC/PlugAdd',
  });
}
</script>

<style lang="scss">
.PlugPage-app {
  margin: 10px 0px 0px 5px;
  height: calc(100vh - 105px);
  background: #fff;
  .demo-tabs > .el-tabs__content {
    padding: 12px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  .contentDiv {
    display: inline-block;
    width: calc(17% - 26px);
    margin: 10px;
    position: relative;
    &:hover {
      .image-buttons {
        display: block;
      }
      .contentDiv {
        opacity: 0.8;
      }
    }
    .imgClass {
      width: 100%;
      // max-width: 250px;
      transition: transform 0.3s ease-out;
    }
    .imgClass:hover,
    .imgClass:focus {
      transform: scale(1.05); /* 鼠标悬停/焦点状态下放大图片 */
      cursor: pointer; /* 添加光标样式以提示可以点击 */
    }
    .titleCLass {
      font-size: 14px;
      color: #f7f7f7;
      position: relative;
      left: 18px;
      bottom: 45px;
    }
    .image-buttons {
      display: none;
      position: absolute;
      top: 55%;
      left: 50%;
      cursor: pointer;
      transform: translate(-50%, -50%);
      /* Other custom styles */
    }
  }
  .contentDiv2 {
    display: inline-block;
    min-height: 140px;
    width: calc(17% - 26px);
    margin: 0px 10px 10px 10px;
    background-color: #f7f7f7;
    transition: transform 0.3s ease-out;
    border-radius: 13px;
    .image-buttons {
      .el-icon {
        color: #373737;
        position: relative;
        left: 10px;
        font-size: 19px;
        top: 20px;
      }
      p {
        font-size: 15px;
        color: #000;
        position: relative;
        top: 55px;
        left: 10px;
      }
    }
  }
  .contentDiv2:hover,
  .contentDiv2:focus {
    transform: scale(1.05); /* 鼠标悬停/焦点状态下放大图片 */
    cursor: pointer; /* 添加光标样式以提示可以点击 */
  }
}
</style>