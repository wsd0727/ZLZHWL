<template>
  <pageCoponents ref="pageRef" @treeClick="targetDetail(false)">
    <template #toolbar>
      <el-button-group class="btn-group">
        <el-button :type="Block?'primary':''" @click="TargetMod(true)">
          <el-icon>
            <Menu />
          </el-icon>
        </el-button>
        <el-button :type="!Block?'primary':''" @click="TargetMod(false)">
          <i class="fa fa-align-justify"></i>
        </el-button>
      </el-button-group>
    </template>
    <template v-slot="{data, config}">
      <div class="docs-content" v-if="Block" :style="`height:${docsH}px`">
        <template v-if="isDetail">
          <div class="docs-detail">
            <el-icon class="back" @click="targetDetail(false)" :size="24">
              <Back />
            </el-icon>
            <el-breadcrumb class="nav" :separator-icon="ArrowRightBold">
              <el-breadcrumb-item class="nav-item" :title="form.VNAME">{{ form.VNAME }}</el-breadcrumb-item>
              <el-breadcrumb-item class="nav-item" :title="form.DOCTITLE">{{ form.DOCTITLE  }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-divider />
          <div class="block" v-if="form.FILELISTArr.length">
            <div class="block-item" v-for="item in form.FILELISTArr" :key="item.BILLNO" @click="getDetail(config, item)">
              <fileIcon :filename="item.FILENAME" />
              <div class="num" :title="item.FILENAME">{{item.FILENAME}}</div>
            </div>
            <el-image-viewer ref="imgViewRef" v-if="imgViewShow" @close="imgViewClose" :url-list="imgViewList" />
          </div>
          <el-empty v-else />
        </template>
        <template v-else>
          <template v-if="data.length">
            <el-scrollbar :height="docsListH" :style="`height:${docsListH}px`">
              <div class="block">
                <div class="block-item" v-for="item in data" :key="item.BILLNO" @click="getDetail(config, item)">
                  <fileIcon filename="folder" />
                  <div class="name">{{item.DOCTITLE}}</div>
                  <div class="num">{{item.FILESCOUNT}}项</div>
                </div>
              </div>
            </el-scrollbar>
            <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="[
                'Total',
                'PrevPage',
                'JumpNumber',
                'NextPage',
                'Sizes',
              ]" @page-change="handlePageChange" />
          </template>
          <el-empty v-else />
        </template>
      </div>
    </template>
  </pageCoponents>
</template>

<script setup>
import pageCoponents from "@/views/table";
import request from '@/utils/request';
import { downFile } from "#/ETEAM/common"
import { ArrowRight, ArrowRightBold } from "@element-plus/icons-vue";
import fileJson from "@/components/FileIcon/config.js"
const { img: imgTypes } = fileJson

const route = useRoute();
const router = useRouter();
const docsH = window.innerHeight - 195;
const docsListH = window.innerHeight - 230;

const pageRef = ref(null)

const imgViewRef = ref(null)
const imgViewShow = ref(false)
const imgViewList = ref([])
const imgViewClose = () => imgViewShow.value = false

const Block = ref(true)
const isDetail = ref(false)
const pageConfig = ref({})
const getDetailURL = ref("")
const form = ref({})
const pageInfo = ref({
  currentPage: 1,
  pageSize: 20,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
})

const TargetMod = val => {
  Block.value = val
  console.log(pageInfo);
  if (!val) targetDetail()
}
const targetDetail = val => {
  isDetail.value = val
  pageInfo.value = pageRef?.value.pageData
  if (!val) form.value = {}
}
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.value.currentPage = currentPage;
  pageInfo.value.pageSize = pageSize;
  pageRef?.value.pageChange({ currentPage, pageSize })
}

// 获取文件名称
function getFileName(name) {
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return name;
  }
}

const newWindowOption = `
    menubar=no,
    location=no,
    resizable=no,
    scrollbars=yes,
    status=no
`

const getDetail = (config, row) => {
  if (isDetail.value) {
;

    let { URL, FILENAME } = row,
      fileType = URL.slice(URL.lastIndexOf(".") + 1),
      fileName = getFileName(FILENAME);
    if (imgTypes.includes(fileType)) {
      imgViewList.value = URL.split(",")
      imgViewShow.value = true
    } else if (fileType == 'pdf') {
      window.open(URL, FILENAME, '_blank')
    } else {
      downFile({
        APPID: "",
        DATA: {
          FILEID: row.BILLNO,
          PK_PARENT_MENU_ID: "",
          PROJECTID: form.value.VBILLCODE
        },
        KEY: "",
        MODULEID: route.meta.BILLNO,
        PAGEID: route.meta.PBILLNO,
        VERSION: ""
      })
    }
  } else {
    pageConfig.value = config;
    let DtlConfig = config.initButton.filter(el => el.ACTION == 'DTL')
    if (DtlConfig.length == 0) return false;
    request({
      url: DtlConfig[0]?.ACTIONADDRESS,
      method: "post",
      data: {
        BILLNO: row.BILLNO,
        MODULEID: route.meta.BILLNO,
        PAGEID: route.meta.ACTION,
      }
    }).then(res => {
      form.value = res.RESULT
      targetDetail(true)
    })
  }
}
</script>

<style lang="scss" scoped>
:deep(.tool-wrap) {
  .el-col-23 {
    max-width: 88% !important;
    flex: 0 0 88% !important;
  }
  .el-col-1 {
    max-width: 11% !important;
    flex: 0 0 11% !important;
  }
}
.docs {
  &-detail {
    height: 30px;
    display: flex;
    align-items: center;
    .back {
      margin-right: 10px;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
:deep(.el-breadcrumb__inner) {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn {
  &-group {
    margin-right: 10px;
  }
}
.block {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  &-item {
    box-sizing: border-box;
    padding: 10px;
    width: calc(100% / 6);
    font-size: 12px;
    text-align: center;
    border-radius: 4px;
    &:hover {
      background: rgba(#ccc, 0.5);
      transition: opacity 0.2s;
      cursor: pointer;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #666;
    }
    .num {
      box-sizing: border-box;
      margin: 0 auto;
      max-width: 80%;
      color: var(--el-color-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>