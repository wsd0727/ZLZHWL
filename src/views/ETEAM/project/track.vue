<template>
  <el-row class="app-wrap" :gutter="20">
    <el-col :span="6" :xs="24" class="group">
      <div class="head-container">
        <el-select v-model="KEYWORD" placeholder="请选择项目" clearable filterable remote :remote-method="getProList" @change="getProStageList" style="width:100%;margin-bottom: 8px">
          <el-option v-for="item in ProOptions" :key="item.VALUE" :value="item.VALUE" :label="item.LABEL"></el-option>
        </el-select>
      </div>
      <div class="head-container">
        <el-scrollbar :height="treeHeight" class="tree-border">
          <el-tree :data="ProStageOptions" :props="{ label: 'LABEL', children: 'CHILDREN' }" node-key="VALUE" :filter-node-method="filterNode" ref="deptTreeRef" highlight-current default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick">
            <template #default="{ data }">
              {{data.LABEL}}
              <template v-if="data.CHILDREN.length == 0">
                <el-tag :type="DictLabel(status,data.STATUS,'COLOR')">{{ DictLabel(status,data.STATUS)}}</el-tag>
                <span v-if="data.STATUS == '2'" style="margin-left:3px">({{data.FILENUM || 0}})</span>
              </template>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="18" :xs="24" class="card">
      <el-card v-loading="loading">
        <template #header>
          <div class="title" v-if="form.STATUS">
            <span class="stage">{{form.LABEL}}</span>
            <el-tag :type="DictLabel(status,form.STATUS,'COLOR')">{{ DictLabel(status,form.STATUS)}}</el-tag>
            <span v-if="form.STATUS == '0'" class="time">计划开始：{{form.PLANSDATE}} 计划完成：{{form.PLANEDATE}}</span>
            <span v-else-if="form.STATUS == '1'" class="time">实际开始:{{form.SJSTARTDATE}}</span>
            <span v-else-if="form.STATUS == '2'" class="time">实际开始:{{form.SJSTARTDATE}} 实际结束:{{form.SJENDDATE}}</span>
          </div>
        </template>
        <el-scrollbar :height="cardHeight">
          <el-form v-if="form.BILLNO" ref="formRef" :model="form" label-width="110px" :rules="rules" :validate-on-rule-change="false">
            <template v-if="form.STATUS == '0'">
              <el-form-item label="实际开始" prop="SJSTARTDATE">
                <el-date-picker v-model="form.SJSTARTDATE" type="date" :default-value="today" value-format="YYYY-MM-DD" placeholder="" :disabled-date="timeline" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">开始</el-button>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="实际结束" prop="SJENDDATE">
                <el-date-picker v-model="form.SJENDDATE" type="date" :default-value="today" value-format="YYYY-MM-DD" placeholder="" :disabled-date="SJtimeline" />
              </el-form-item>
              <el-form-item v-for="item in stageConfig" :key="item.BILLNO" :label="item.DOCNAME" :prop="item.BILLNO">
                <div class="form-value">
                  <FileUpload v-model="form[item.BILLNO]" :filelist="form[item.BILLNO+'Arr']" :data="uploadData" :limit="5" :fileType="item.FILETYPE?item.FILETYPE:'.pdf,.docx,.xlsx,.pptx'" style="width: 100%" @change="val=>setUploadFile(val,item.BILLNO)" />
                  <el-link class="downlink" type="primary" v-if="item.FILEPATH" :underline="false" target="_blank" @click="handleDown(item)">模板下载</el-link>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">保存</el-button>
              </el-form-item>
              <template v-if="form.BDFILELINKS.length">
                <el-divider />
                <div class="title">
                  <el-icon>
                    <Link />
                  </el-icon> 附件
                </div>
                <VTable ref="VTableRef" :tableCFG="tableConfig" :tableData="form.BDFILELINKS" :totalData="form.BDFILELINKS.length" actionBar :actionBarWidht="90">
                  <template #FILESIZE="{row}">
                    {{ calcFileSize(row.FILESIZE) }}
                  </template>
                  <template #actionBar="{row}">
                    <el-row :gutter="5" justify="center">
                      <el-col :span="1.5">
                        <el-link :underline="false" @click="handleDown(row)">下载</el-link>
                      </el-col>
                      <el-col :span="1.5">
                        <el-link :underline="false" @click="handleDelete(row)">删除</el-link>
                      </el-col>
                    </el-row>
                  </template>
                </VTable>
              </template>
            </template>
          </el-form>
          <el-empty v-else />
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { getProTree, getProStageTree, getStageConfig, getProDetail, saveProStage, delProStageFile, TableConfig } from "#/ETEAM/project_track"
import VTable from "@/components/Tables"
import { bytesToSize } from "@/utils"
import { downFile } from "#/ETEAM/common"

const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  expandID: "",
  loading: false,
  height: 200,
});

const route = useRoute();
const { proxy } = getCurrentInstance();
const treeHeight = window.innerHeight - 155;
const cardHeight = window.innerHeight - 180;
const rules = reactive({
  SJSTARTDATE: [{ type: 'date', required: true, message: '请选择', trigger: 'change' }],
  SJENDDATE: [{ type: 'date', required: true, message: '请选择', trigger: 'change' }],
})
const status = reactive([
  { LABEL: "未开始", VALUE: "0", COLOR: "info" },
  { LABEL: "进行中", VALUE: "1", COLOR: "danger" },
  { LABEL: "已完成", VALUE: "2", COLOR: "success" },
])

const formRef = ref()
const loading = ref(false);
const KEYWORD = ref("")
const ProOptions = ref([])
const ProStageOptions = ref([])
const filterNode = (value, data) => {
  if (!value) return true;
  return data.LABEL.indexOf(value) !== -1;
};
const NodeValue = ref("")
const handleNodeClick = val => {
  let { VALUE, PK_PARENT, STATUS = undefined } = val;
  if (!STATUS) return false;
  NodeValue.value = VALUE;
  handleDetail({
    PROBILLNO: PK_PARENT,
    PLANBILLNO: VALUE
  });
};
const getProList = val => {
  getProTree({
    KEYWORD: val,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
  }).then(res => {
    ProOptions.value = res.RESULT
  })
}
const getProStageList = () => {
  getProStageTree({
    KEYWORD: KEYWORD.value,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
  }).then(res => {
    ProStageOptions.value = res.RESULT;
    if (res.RESULT.length == 0) form.value = {}
  })
}
const form = ref({
  MODULEID: route.meta.BILLNO,
  PAGEID: route.meta.PBILLNO,
  PLANSDATE: "",
  PLANEDATE: "",
  SJSTARTDATE: "",
  SJENDDATE: ""
})
const today = new Date()
const timeline = time => time.getTime() > new Date().getTime()
const SJtimeline = time => time.getTime() < (new Date(form.value.SJSTARTDATE).getTime() - 24 * 60 * 60 * 1000) || time.getTime() > new Date().getTime()
const stageConfig = ref([])
const handleDetail = data => {
  loading.value = true
  getStageConfig(data).then(res => {
    stageConfig.value = res.RESULT;
    getProDetail({
      MODULEID: route.meta.BILLNO,
      PAGEID: route.meta.PBILLNO,
      ...data
    }).then(res => {
      form.value = res.RESULT;
      for (let i = 0; i < stageConfig.value.length; i++) {
        const el = stageConfig.value[i];
        form.value[el.BILLNO] = ""
        if (el.ISREQUIRE == '1') rules[el.BILLNO] = [{ required: true, message: '请上传', trigger: 'change' }]
        form.value[el.BILLNO + 'Arr'] = []
      }
      form.value.PROBILLNO = res.RESULT.PK_PARENT;
      form.value.PLANSTATUS = res.RESULT.STATUS;
      form.value.PLANBILLNO = res.RESULT.BILLNO;
      form.value.PJSTARTREPORTArr = [];
      formRef.value && formRef.value.resetFields()
      nextTick(() => {
        form.value = res.RESULT;
      })
    }).finally(() => {
      loading.value = false
    })
  })
}
const DictLabel = (arr, data, label = 'LABEL', value = 'VALUE') => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabel(arr, data, label, value);
};

const setUploadFile = (val, id) => {
  form.value[id + 'Arr'] = val
}

const calcFileSize = bytes => {
  if (!bytes) return "0 B"
  return bytesToSize(bytes * 1)
}

const handleDelete = (row) => {
  proxy.$modal.confirm(`是否确定删除 ${row.FILENAME} ？`).then((res) => {
    let id = row.BILLNO;
    delProStageFile({
      BILLNO: id,
      FILEID: row.FILEBILLNO,
      PROJECTID: row.VBILLCODE,
      MODULEID: route.meta.BILLNO,
      PAGEID: route.meta.PBILLNO,
    }).then(res => {
      proxy.$modal.msgSuccess("删除成功");
      getProStageList()
      handleDetail({
        PROBILLNO: KEYWORD.value,
        PLANBILLNO: NodeValue.value
      })
    })
  });
};

const handleDown = row => {
  downFile({
    APPID: "",
    DATA: {
      FILEID: row.FILEBILLNO,
      PK_PARENT_MENU_ID: "",
      PROJECTID: KEYWORD.value
    },
    KEY: "",
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    VERSION: ""
  })
}

const submit = () => {
  formRef.value.validate(valid => {
    if (!valid) return;
    let configIds = stageConfig.value.map(el => el.BILLNO), arr = [];
    for (let i = 0; i < configIds.length; i++) {
      const el = configIds[i];
      arr = [...arr, ...form.value[el + 'Arr']]
    }
    form.value.PJSTARTREPORTArr = arr;
    loading.value = true
    saveProStage(form.value).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      getProStageList()
      handleDetail({
        PROBILLNO: KEYWORD.value,
        PLANBILLNO: NodeValue.value
      })
    }).finally(() => {
      loading.value = false
    })
  })
}

getProList()
</script>

<style lang="scss" scoped>
.app-wrap {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.group {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.card {
  padding-left: 10px;
  padding-right: 0 !important;
}
.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  span {
    margin-right: 10px;
  }
  .stage {
    font-size: 16px;
  }
  .time {
    font-size: 14px;
  }
}
:deep(.el-form-item) {
  margin-bottom: 15px;
  .el-form-item__label {
    display: block;
    text-align: right;
    padding: 0 10px 0 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
:deep(.el-form-item__label) {
  font-weight: unset;
  color: #666;
}
.form-value {
  position: relative;
  .downlink {
    position: absolute;
    top: 0;
    left: 90px;
    z-index: 1;
  }
}
</style>