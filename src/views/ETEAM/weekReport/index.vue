<template>
  <div class="RZ">
    <div class="RZ-head">
      <ul class="RZ-head-menu">
        <li :class="['RZ-head-menu-item', queryParams.type == item.value ? 'action' : '']" v-for="item in Top" :key="item.value" @click="SET_TYPE(item.value)">{{ item.title }}</li>
        <!-- <li :class="['RZ-head-menu-item',queryParams.type == item.VALUE?'action':'']" v-for="item in TYPEOption" :key="item.dictValue" @click="SET_TYPE(item.VALUE)">{{item.LABEL}}</li> -->
      </ul>
      <el-row :gutter="10" class="RZ-head-button">
        <el-col :span="1.5">
          <el-button type="text" class="TJ" :disabled="detailId == ''" size="mini" @click="handleCOUNT">统计</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="Edit" size="mini" @click="ClickFrom">写日志</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="RZ-content" v-loading="loading">
      <div class="RZ-content-time" style="overflow:auto">
        <template v-if="dataList.length > 0">
          <el-scrollbar>
            <div class="RZ-content-time-item" v-for="(item, index) in dataList" :key="index">
              <span class="time">{{ item.submitDate }} {{ getWeekdayName(item.submitDate) }} </span>
              <div :class="['list-item', BILLNO == item.BILLNO ? 'action' : '']" v-for="(item, Tindex) in item.detail" :key="Tindex" @click="getDetail(index, Tindex)">
                <span class="titles">{{ item.CREATORTITLE }}</span>
                <!-- <span v-if="item.COMMENTTAG == '0'" class="isread hasNPL"></span>
              <span v-else-if="item.REPLYTAG == '0'" class="isread hasNHF"></span> -->
                <span v-if="item.READFLG == '-1'"></span>
                <span v-if="item.READFLG != '-1'" :class="item.READFLG == '0' ? 'Wdisread' : item.READFLG == '1' ? 'isread' : ''"></span>
              </div>
            </div>
          </el-scrollbar>
        </template>
        <template v-else>
          <span class="nodate">暂无数据</span>
        </template>
      </div>
      <!-- 右侧详情 -->
      <el-scrollbar class="app-weekContent">
        <div class="app-weekReport" v-if="detailId">
          <p>{{ detailform.CREATORNAME }}的周报</p>
          <p class="time">{{ detailform.CREATIONTIME }}</p>
          <el-form :model="detailform" class="detailContent" ref="detailRef" label-width="120px" size="small">
            <el-form-item label="" class="formItemClass">
              <p class="Label">本周完成工作:</p>
              <pre>{{ detailform.COMPLETEWORK }}</pre>
            </el-form-item>
            <el-form-item label="">
              <p class="Label">本周工作总结:</p>
              <pre>{{ detailform.WORKSUMMARY }}</pre>
            </el-form-item>
            <el-form-item label="">
              <p class="Label">下周工作计划:</p>
              <pre>{{ detailform.PLANWORK }}</pre>
            </el-form-item>
            <el-form-item label="" prop="needHelp">
              <p class="Label">需协调与帮助:</p>
              <pre>{{ detailform.NEEDHELP }}</pre>
            </el-form-item>
            <el-form-item label="" prop="vmemo">
              <p class="Label">备注:</p>
              <pre>{{ detailform.VMEMO }}</pre>
            </el-form-item>
            <el-form-item label="" prop="IMGLIST">
              <!-- <div class="img" v-if="detailform.imgList&& detailform.imgList.length>0">
            <div class="img-item" v-for="(item, index) in detailform.imgList" :key="index">
              <el-image class="img-item-img" style="width: 100%; height: 100%" :src="`${BASE}${item.FILEURL}`" :alt="item.FILENAME" lazy fit="cover" :preview-src-list="[`${BASE}${item.FILEURL}`]"></el-image>
            </div>
          </div> -->
              <p class="Label">图片</p>
              <!-- <img :src="detailform.PHOTOURL" alt="" class="showImage"> -->
              <div>
                <div class="imageList" v-for="(item, index) in detailform.IMGLIST">
                  <el-image :initial-index="index" class="showImage" :src="item" :zoom-rate="1.2" :preview-src-list="detailform.IMGLIST" fit="cover" />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="" prop="FILELIST">
              <p class="Label">附件:</p>
              <!-- <pre>{{detailform.FILELIST}}</pre> -->
              <div v-if="detailform.FILELISTArr">
                <div class="block-item" v-for="item in detailform.FILELISTArr" :key="item.BILLNO" @click="clickFile(item)">
                  <fileIcon :filename="item.FILENAME" />
                  <div class="num" :title="item.FILENAME">{{ item.FILENAME }}</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="" prop="detailform">
              <p class="Label">抄送人员(未读):</p>
              <ul class="CS">
                <li class="CS-item" v-for="item in detailform.UNREADERLIST" :key="item.billNo">
                  <avatar class="avatar" :avatar="item.AVATAR?'/'+item.AVATAR:''" :name="item.USERNAME"></avatar>
                  <span class="name">{{ item.USERNAME }}</span>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="" prop="READERLIST">
              <p class="Label">抄送人员(已读):</p>
              <ul class="CS">
                <li class="CS-item" v-for="item in detailform.READERLIST" :key="item.billNo">
                  <avatar class="avatar" :avatar="item.AVATAR?'/'+item.AVATAR:''" :name="item.USERNAME"></avatar>
                  <span class="name">{{ item.USERNAME }}</span>
                </li>
              </ul>
            </el-form-item>
          </el-form>

          <!-- 评论点赞内容 -->
          <div class="PLDZ" v-show="plTotal > 0 || dzTotal > 0">
            <div class="DZ" v-if="dzTotal > 0">
              <div class="DZ-item" v-for="item in dzList" :key="item.BILLNO">
              <avatar class="avatar" :avatar="item.AVATAR?'/'+item.AVATAR:''" :name="item.CREATORNAME"></avatar>
              </div>
              <span class="info">{{ dzTotal }}人赞了</span>
            </div>
            <div class="PL">
              <div class="PL-item" v-for="item in plList" :key="item.BILLNO">
                <!-- <span class="avatar">{{item.CREATORNAME.length >2?item.creatorName.slice(-2):item.CREATORNAME}}</span> -->
                <div class="content">
                  <p clas="name">{{ item.CREATORNAME }}</p>
                  <p class="contentText">{{ item.CONTENTS }}</p>
                  <p class="time">
                    <span class="menu" v-if="item.VDEF1 == '1'" @click="handlelDelete(item.BILLNO)">删除</span>
                    <span>{{ item.CREATIONTIME }}</span>
                    <span class="reply" @click="handleReport(item,)">回复</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论点赞功能 -->
          <div class="PLMENU">
            <el-input class="input" ref="input" id="input" v-model="plContent" type="textarea" :focus="hasFocus" placeholder="评论" autosize @keydown.shift.50.native="PPAIT" @focus="SET_hasFocus(1)" @blur="SET_hasFocus(0)"></el-input>
            <el-button v-show="hasFocus" type="primary" round size="mini" @click="SENDPL" :disabled="plContent == ''" :loading="submit">发送</el-button>
            <div v-show="!hasFocus" class="dzTotal">
              <i :class="['DZ', hasRead && user.BILLNO == detailform.CREATORID ? 'action' : '']" @click="handelDZ"></i>
              <span v-if="user.BILLNO == detailform.CREATORID && dzTotal > 0">{{ dzTotal }}</span>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </el-scrollbar>

    </div>
    <vxe-modal destroy-on-close v-model="VisibleForm" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer>
      <div>
        <Form ref="formRef" v-model:formData="ruleForm" :formConfig="formConfig" :rules="rules" :detail="formType == 'detail'">
          <template #READERIDLIST="{ data }">
            <!-- <el-select multiple v-model="data['READERIDLISTArr']" filterable @change="selectChange" :teleported="false" style="width:100%">
              <el-option v-for="item in options2" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
            </el-select> -->
            <el-select multiple v-model="data['READERIDLIST']" filterable remote :remote-method="remoteMethod" @change="selectChange" :teleported="false" style="width:100%">
              <el-option v-for="item in options2" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
            </el-select>
          </template>
        </Form>
      </div>
      <template #footer>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup>
import { reportList, UserList, weekAdd, getLeftList, getRightist, getPllist, addPL, deletePL, DZadd, DZlist, getUserList, WeekFormConfig } from "#/ETEAM/weekReport";
import { ElMessageBox, ElMessage } from "element-plus";
import { getFormValue, getFormRule } from "@/utils";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
import TJVue from "./TJ.vue";
const router = useRouter();
const { proxy } = getCurrentInstance();
const routerParams = router.currentRoute.value.meta;
const loading = ref(false);
const FSHIds = ref([])
const detailLoading = ref(true);
const formConfig = ref([]);
const formRef = ref();
const queryParams = ref({
  pageSize: 30,
  pageNum: 1,
  type: "3"
}
)
const isactivated = ref('-1')
const modalConfig = reactive({
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "80%",
  height: "90%",
});
const submit = ref(false)
const plContent = ref("")
const dataList = ref([]);
const total = ref(0);
const dzTotal = ref(0);

const Top = ref([
  { title: "全部", value: '3' },
  { title: "未读", value: 'unread' },
  { title: "我发出的", value: 'mine' },
  { title: "我的团队", value: 'team' },
  // { title: "周报", value: '3' },
]);
const hasFocus = ref(false)
const options2 = ref(
  []
)

const VisibleForm = ref(false)
const hasRead = ref(false)
const TYPEOption = ref([])
function handTypeOption() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    PAGENUM: 1,
    PAGESIZE: 20,
    SORTNAME: "",
    REVERSE: "",
    KEY: "",
    MODULEID: "",
    PAGEID: "",
    VERSION: "",
  };
  reportList(data).then((res) => {
    TYPEOption.value = res.RESULT;
  });
}
const plParent = ref("root")
const formSize = ref('default')
const ruleFormRef = ref()
const detailId = ref('')
const plTotal = ref(0)
const plList = ref([])
const dzList = ref([])
const ruleForm = ref({
  COMPLETEWORK: '',
  WORKSUMMARY: '',
  PLANWORK: '',
  NEEDHELP: '',
  date2: '',
  VMEMO: "",
  IMGLIST: [],
  FILELIST: [],
  READERIDLIST: [],
})
const detailRef = ref()
const detailform = ref({})
const rules = ref({})
const Addform = ref({});
const baseForm = ref({});
const UserId = ref('3')
const fileList = ref([
])
const initForm = () => {
  formConfig.value = WeekFormConfig;
  let formData = getFormValue(WeekFormConfig);
  baseForm.value = formData;
  Addform.value = formData;
  rules.value = getFormRule(WeekFormConfig);
};
const upload = ref()
function handleExceed2(files) {
  // upload.value!.clearFiles()
  // const file = files[0] as UploadRawFile
  file.uid = genFileId()
  // upload.value!.handleStart(file)
}

function SET_hasFocus(val) {
  // this.startPos = undefined;
  // this.endPos = undefined;
  if (val == 1) {
    hasFocus.value = true
    plParent.value = "root"
  } else {
    setTimeout(() => {
      hasFocus.value = false
    }, 300)
  }
}

function SET_TYPE(val, index) {
  isactivated.value = index;
  queryParams.value.type = val;
  detailId.value = '';
  getPageList();
};
function submitUpload() {
  // upload.value!.submit()
}

function handlelDelete(id) {
  ElMessageBox.confirm(`您确定要删除单据`, "Warning", {
    type: "warning",
  }).then(() => {
    deletePL([id]).then(res => {
      proxy.$modal.msgSuccess(res.MESSAGE);
      setTimeout(() => {
        handgetPLList()
      }, 1000);
    })
  });

}

function handelDZ() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    ORDERNO: detailId.value,
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
    VERSION: "",
  };
  DZadd(data).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE);
    hasRead.value = res.RESULT.SUCCESS;
    getDZList();
  })
}
function getDZList() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    ORDERNO: detailId.value,
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
    VERSION: "",
  };
  DZlist(data).then(res => {
    dzList.value = res.RESULT.RECORDS;
    dzTotal.value = res.RESULT.TOTAL;
    hasRead.value = res.RESULT.RECORDS.length ? true : false;
  })
}
function handleRemove(file, uploadFiles) {
  // console.log(file, uploadFiles)
}

function handlePreview(uploadFile) {
  // console.log(uploadFile)
}
function handgetPLList() {
  getPllist({ JOURNALNO: detailId.value }).then(res => {
    plList.value = res.RESULT.RECORDS;
    plTotal.value = res.RESULT.TOTAL;
  })
}
function SENDPL() {
  submit.value = true
  addPL({ JOURNALNO: detailId.value, CONTENTS: plContent.value, PKPARENT: plParent.value }).then(res => {
    submit.value = false
    // this.msgSuccess(res.msg)
    plContent.value = "";
    proxy.$modal.msgSuccess(res.MESSAGE);
    handgetPLList();
  }).finally(() => {
    submit.value = false
  })
}
function clickFile(item) {
  window.open("/" + item.URL)
}
function handleReport(val) {
  const { CREATORNAME, BILLNO } = val
  plContent.value = `回复 @${CREATORNAME} `
  plParent.value = BILLNO
  hasFocus.value = true
}
function getDetail(Pindex, index) {
  let rowdata = dataList.value[Pindex].detail[index];
  // rowdata.READFLG = '1';
  rowdata.READFLG = dataList.value[Pindex].detail[index].READFLG == '-1' ? dataList.value[Pindex].detail[index].READFLG : '1'
  detailId.value = rowdata.BILLNO ? rowdata.BILLNO : detailId.value;
  detailform.value = {};
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    BILLNO: detailId.value,
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
    VERSION: "",
  };
  getRightist(data).then((res) => {
    detailform.value = res.RESULT;
    detailform.value.IMGLIST = detailform.value.PHOTOURL.split(',')
    handgetPLList();
  })
  getDZList();
}
function handleExceed(files, uploadFiles) {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`
  )
}

function beforeRemove(uploadFile, uploadFiles) {
  return ElMessageBox.confirm(
    `Cancel the transfert of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}
function submitForm() {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return
    if (valid) {
      let data = {
        APPID: "",
        VNAME: "",
        DR: "0",
        SORTNAME: "",
        REVERSE: "",
        ...ruleForm.value,
        JOURNALTYPE: "3",
        KEY: "",
        MODULEID: routerParams.BILLNO,
        PAGEID: 'PG230302286731',
        VERSION: "",
      };
      weekAdd(data).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        VisibleForm.value = false;
        ruleForm.value = {};
        getPageList();
      })
    }
  })
}
function getPageList(params) {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    KEY: "",
    TYPE: queryParams.value.type,
    JOURNALTYPE: "3",
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
    VERSION: "",
  };
  getLeftList(data).then((res) => {
    dataList.value = res.RESULT.RECORDS;
    detailId.value = res.RESULT.RECORDS[0].detail[0].BILLNO;
    dataList.value[0].detail[0].READFLG = dataList.value[0].detail[0].READFLG == '-1' ? dataList.value[0].detail[0].READFLG : '1'
    getDetail(0, 0);
  })
}
function handUserData() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    KEY: "",
    MODULEID: "",
    PAGEID: "",
    VERSION: "",
  };
  UserList(data).then((res) => {
    options2.value = res.RESULT;
  });
}
// 定义一个方法，传入日期字符串，返回对应的星期几名称
function getWeekdayName(dateStr) {
  // 创建一个 Date 对象，将日期字符串转换为日期格式
  const date = new Date(dateStr);
  // 定义一个数组，包含一周中每天的名称
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  // 使用 getDay() 方法获取当前日期是一周中的第几天，0 代表星期日，1 代表星期一，以此类推。
  const weekdayIndex = date.getDay();
  // 通过 weekdayIndex 值获取对应的星期几名称
  const weekdayName = weekdays[weekdayIndex];
  // 返回结果
  return weekdayName;
}
function handleCOUNT() {
  router.push({
    path: '/public/baseCC/weekTj',
  });
}
// function resetForm(formEl) {
//   if (!formEl) return
//   formEl.resetFields()
// }
function ClickFrom() {
  initForm();
  VisibleForm.value = true;
  ruleForm.value.READERIDLISTArr = FSHIds.value;
  if (ruleForm.value.READERIDLISTArr.length > 0) {
    ruleForm.value.READERIDLIST = ruleForm.value.READERIDLISTArr.join(",")
    ruleForm.value.READERIDLIST = ruleForm.value.READERIDLIST.split(',')
  }
}
function selectChange(e) {
  // 调用change 清空之前的校验
  formRef.value.submitForm().then((valid) => {
    if (!valid) return
  })
}

const remoteMethod = (query) => {
  // if (query) {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    KEY: "",
    MODULEID: "",
    PAGEID: "",
    VERSION: "",
    KEYWORD: query
  };
  UserList(data).then((res) => {
    options2.value = res.RESULT;
  });
  // } else {
  //   options2.value = []
  // }
}

function GetUserData() {
  let data = {
    TYPE: UserId.value
  };
  getUserList(data).then((res) => {
    FSHIds.value = res.RESULT[0].CCUSERS.split(',')
  });
}
// handTypeOption();
handUserData();
getPageList();
GetUserData();
</script>

<style lang="scss" scoped>
.RZ {
  width: 100%;
  height: 100%;

  &-head {
    background: #fff;
    padding: 10px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);

    &-menu {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      list-style: none;
      margin: 0;
      padding: 0;

      &-item {
        white-space: nowrap;
        margin-right: 10px;
        font-size: 14px;
        padding: 5px 10px;
        background: #f2f4f5;
        color: #868a8e;

        &:hover {
          color: #1677ff;
          cursor: pointer;
        }

        &.action {
          color: #1677ff;
          background: #e6f2fe;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  &-content {
    height: calc(100vh - 95px - 41px);
    background: #f2f4f5;
    display: flex;
    align-content: flex-start;

    &-time {
      min-width: 200px;
      width: 20%;
      height: 100%;
      background: #fff;
      padding: 10px;
      border-right: 1px solid #d8dce5;

      &-item {
        .time {
          display: block;
          color: #130909;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 5px;
          line-height: 30px;
        }

        .list-item {
          padding: 10px;
          font-size: 14px;
          display: flex;
          align-items: center;

          .titles {
            display: block;
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .isread {
            text-align: center;
            width: 60px;
            color: #1677ff;
            font-size: 10px;
            border: 1px solid #1677ff;
            border-radius: 20px;
            padding: 0 5px;
            white-space: nowrap;

            &::before {
              content: "已读";
            }
          }

          .Wdisread {
            text-align: center;
            width: 60px;
            color: #1677ff;
            font-size: 10px;
            border: 1px solid #1677ff;
            border-radius: 20px;
            padding: 0 5px;
            white-space: nowrap;

            &::before {
              content: "未读";
            }
          }

          .hasNPL {
            &::before {
              content: "有新评论";
            }
          }

          .hasNHF {
            &::before {
              content: "有新回复";
            }
          }

          &:hover {
            background: #f2f4f5;
            border-radius: 10px;
            cursor: pointer;
          }

          &.action {
            background: #f2f4f5;
            border-radius: 10px;
          }
        }
      }
    }

    &-detail {
      min-width: 600px;
      width: calc(100% - 20%);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}

.RZType {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;

  &-item {
    width: 130px;
    height: 150px;
    font-size: 18px;
    padding: 10px;
    margin-right: 20px;
    background: #b0cbf1;
    border: 1px solid #d8dce5;

    &:hover {
      cursor: pointer;
      box-shadow: 0 5px 5px 5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    }
  }
}

.nodate {
  display: block;
  line-height: 200px;
  font-size: 16px;
  text-align: center;
  color: #868a8e;
}

.app-weekContent {
  min-width: 600px;
  width: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;

  .app-weekReport {
    width: 95%;
    height: 100%;
    // overflow-y: scroll;
    margin: 0px auto;
    background: #fff;

    // border-radius: 16px;
    .formItemClass {
      width: 100%;
    }

    p {
      // font-size: 20px;
      margin-left: 5px;
      // font-weight: 800;
      display: inline-block;
    }

    .time {
      font-size: 16px;
      margin-top: 20px;
      font-weight: 500;
      display: inline-block;
      float: right;
    }

    .Label {
      width: 100%;
      height: 20px;
      font-size: 17px;
      font-weight: 600;
    }

    pre {
      font-size: 14px;
      white-space: pre-wrap !important;
      margin-left: 10px;
    }
  }
}

.CS {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-wrap: wrap;

  &-item {
    text-align: center;
    width: 80px;
    height: 50px;

    .avatar {
      margin: 0 auto;
      display: block;
      width: 34px;
      height: 34px;
      line-height: 34px;
      background: #1677ff;
      color: #fff;
      overflow: hidden;
      font-size: 12px;
      border-radius: 8px;
    }

    .name {
      display: block;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 12px;
      white-space: nowrap;
    }

    &:hover {
      cursor: pointer;
    }
  }
}

.PLMENU {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .input {
    width: 90%;
  }

  .dzTotal {
    display: flex;
    align-items: center;
    color: #1677ff;

    span {
      font-size: 14px;
    }
  }

  .el-button {
    width: 60px;
    position: relative;
    right: 10px;
    top: -3px;
  }

  .DZ {
    display: block;
    width: 33px;
    height: 33px;
    position: relative;
    right: 20px;
    top: -3px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFL0lEQVR4XuWba4gcRRDHq2ZXPD0fH0QiiAEjgcMz7qVrdj3OSBQlolEOkRzmJBHUGN+oKCYo+EATER+gJkqMIkaDJBAlCGrUKIrKcd29eyH6wTsNgh98kQ8nJq53MyUbouzt9s727O3eznbm2zL/rq36TXV39XQPwjF+YVLi11qfHgRBr+d5i8MwzGez2c/nwrdEAJBSLkHELysCVgBwIxHtayWIRABQSpWCX2IKdGpq6qz+/v6fWwUhKQB+AoD5piAR8eOJiYmrhoaG/mkFhKQA4KjgEPFuIcSLTgKQUs5HxFIGRF0fENGVrgIwDYCmWBcS0USzIbS9C0gphxHx7XqBIeJqIcS2erq495MAYB0ibrRw/BkiesBCF0vSdgBKqW8AoN/C6z1EdLmFLpakrQC01j4zj9p4zMy/+r5/ho02jqatAPL5/HNhGN5r6fBfRHSSpdZa1jYAhULhzDAMFTPPs/GWmQ/4vr/ARhtH0zYAWuuNzLzO1llmHvF932assDV5RNcWAFrrcwFghJmtUxoRdwshBmNFZyFuCwAp5cuIeKuFf/9LEHGrEGJNnDY22jkHoLVexcxv2jhXodlARA810C6yyZwCUEqdz8x7ENFq4Cv33IlKUCn1EQAsa+QpptPpRZlMZn8jbaPazFkGaK13MPOKRgMgopb42hKjlUHONngA2EdEmUbhtTUDmhB8yf9tRLS64wAopZ4HgHtm6zgzr/F9f+ts7Zjat6wLjI6OPup53iPNcDqdTi/IZDIHmmGr0kYVAK31dUEQ9Nj8med5Y0T0bqVWSrkdEVfa2LDRhGH4mI0uSpNKpbQQYnckgAaf2jtENCNYrfVnzHzxbJ1uQftXieiWGfVF+Q+l1CcAcGnMP54kolPL2yQYACDizUKI1/7zd0YXUErtAoBrYgKAyjk6yQAAYAsRrTUCkFK+gYg3OA7gQyK6ohaAFxDxLscBbCKiO2t1gScAIPaKq8O6wH1EVKpPjlyVY0DptfPTLmcAIg6WT4eVAEqDwysuA0ilUuf19fV9a8wArfVKZt7uMoBisXjiwMDAYSOAfD6/PAzD9x0G8B0R9UYVQhcBwBeuAkDE14UQN9UEoLXOMHPBVQAAsJaIttQEMDY2dvb09PSPDgPIVJ45mjELjIyMnJZOp/9wFMAhIuqOXA1KKY9DxNhncTqkENpLRFULvar3AUqpQwBwQpws6BAAxn2FKgBSyl/ivrfvBABhGA5ms9noFyKlp66U+h4AFrqWAd3d3af09PT8GTkGHAUgAYAcAzBCRMadZdMYsBcALnEMQM19RdMY8F5pxeQSgCAILsvlcp+aYjJlQGnndpVDAIJisXhy+QKoZiV4dAx4CQDucAhA5OkyUxfYgIjrXQHAzOt933+qVjymjZEHmblmA5OhJNcBiLhUCFFzhWsCcBszb3YhA5j5IBHNQ8Rp6wxQSl0PAG+5AAAAdhHRtVGxmGaBqwGgqmSMMpLULoCI9wshno0FQGu9lJljfbCUVABBEFyYy+W+jgWgUCgsDoJAO9AF9hPRonpxmKbBcxAx1ocJCc2Ah4noydgASt/vMfNv9RqW368EoJTaBAC3x7HRZO1hZl7k+/4P9exWZcD4+Pjxk5OTf9drGAVASrkCEXfEsdFk7WYisqpmjUdk4m5vm46waa1j1xNNgvB7V1dXT29v70Ebe0YAUspliPg4AFxQzwgi7hRCDJl0UsrlnucNM/NwPTvNuI+IX5X2Nk1HYawLoWY40kk2WnZKrFMgHPMA/gWa1qJfp7Q21wAAAABJRU5ErkJggg==")
      no-repeat center center;
    background-size: 65% 65%;

    &.action {
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFJElEQVR4XuWbbYhUVRjH//9Z3HB7I3TurEhCliDZJlJQkGFRGL2xRBhpaFCpvRkV7tyZDNrCdufcrIVKC7MILREDCwmqrSyKCimtxPoQlQT7wXtm8YORxrYzTwwZzMude+/Zndm5c70wn+Z/nvs8v/Oc555zz7nEaX4xKvF3ZyU5LljQASwqAN+P5vj5VPgWCQBJWxYT+LI8YAIHpAP36AEeaiaISACwbCkFv9gr0HHB+cccjjQLQlQA/AFgTp0gP9bTcQv6OdYMCFEBIH7BCfBIXvGlWAKYZcucAlDKAL/rA614UywBeBVAr0CFmJfP8ddGQ2j5EEjZskKAtwMDE6zSDncE6gwFLQeQtCVDYDCE35u0Yl8InZGk5QAsW74BcGWg18SwzvGGQJ2hoKUAZqXl8gLxbUifXa3YHVIbWtZSAJYtLwB4LKS3f2nFs0JqQ8taBmDGBpndMY4DAFKhvBUc0Q7nhtIaiFoGIGXLoAAZA1/3a8XgWmFgsCRtCYDurFxcFOyHIHxKE3t1jr2G8QXKWwLASssrIO4P9K5MIIJteYerTdqE0U45ACstK0FsD+NcuUaAgbziBtN2QfopBWA9IZeigOHQha+SQPvPBK2MfATB0qBe8fqfHehxB3h4Im392kxZBqRs2S3AsokGoBWb4mtTjFYHOdngITikHS6cKLyWZsCkg//vYb1D57iq7QAkbRki8OhkHSex2s1x22TteNaWZhgt2bTS0g/iqUbY5zTMdTfySCNsVduoqQEpW+4UwfxQN0vgR53ju9VaKy07QSwPZSOMSPB0GJnvWO/AQXeQe30BTKTXBNiVV6wINmnLZwSumazTTWj/mlZcU263IgMsWz4BcJ3hjY9rxXPL20QYACi4z3X4+v/+VgPYA+A2QwCofkZHGQAEW7XDtd4A0vImiLtjDuBD7fBGTwApW14UYF2sAQCbteLDngCSadlIwnjF1U5DgMTjbo5D3kMgI30QOHHOACbQW/44rC6CpeLwapwBJIBLjir+5F0DMrJcBDvjDKBzDF0jQzzpCWCmLTcngPdjDOBnrbig7kQomZWrWcQXcQVA4A1X8V6/mWBpzf1DbAEI1roOt9YFkFovF0gHfo8rABSwUG+qPHNU8RSYnZUZ/xQxGlMAJ7Timb6rQayRadZ5MD6L0yYToX1asWahV/M+wLLlBIDpJlnQDgAIDLge+wpeAI6avrdvCwCCXtcJeCFS6nXLll8AzItbBhQF54w6/NO/BpS63pbvBLgsZgDq7izXDIGkLfsIXBsnAH77il414D0ARtvQUa8BFFzvOvzUq1NrAaRlO4iVMcqAQucYzi5fANWdCZ4qgi8DeChGAIa1qn+6rHZfIC0DQmTjAkCAbF4xVy+e2iKYEZuCug28DEW5BgiwJK9Yd4XrVQQfALAlFhkgOKa7kEI/x0NngJWRuyB4KxYAgD1a8Xa/WLz2Bm8VoGYPzc9IZIcAsV7n+LwRgJlZWZIowuiDpcgCAK7Sil8bAUhmZBEFB9t+CAgOa4c9QXHUFsE+uRAJGH2YEMUMoOBJ1+GzxgBK3+8Vi9BBDcv/rwZgpWUziAdNbDRYexJF9Ojn+FuQ3ZoMuGidnHG8C38HNfQDkMzIMgp2m9hoqFawRTsMNZv1PCVmur3tdYTNssV4PtEgCPnOMcwfGeKxMPY8AVh9shQJPAPgiiAjBN5xFe/w0p3aaFkBoPRr/kV8RcLxOgoTeiLUfC+jdYcpOSgZrZArvTntAfwLyOIOX6kPdDwAAAAASUVORK5CYII=")
        no-repeat center center;
      background-size: 65% 65%;
    }
  }
}

.PLDZ {
  border-top: 1px solid #d8dce5;
  padding-top: 20px;
  margin-bottom: 20px;

  .DZ {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;

    &-item {
      .avatar {
        margin: 5px;
        text-align: center;
        display: block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        background: #1677ff;
        color: #fff;
        overflow: hidden;
        font-size: 12px;
        border-radius: 8px;
      }
    }

    .info {
      font-size: 14px;
      color: #868a8e;
    }
  }

  .PL {
    &-item {
      display: flex;
      align-items: flex-start;

      &:hover {
        .menu {
          display: inline !important;
        }
      }

      .avatar {
        text-align: center;
        margin-right: 10px;
        display: block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        background: #1677ff;
        color: #fff;
        overflow: hidden;
        font-size: 12px;
        border-radius: 8px;
      }

      .content {
        width: calc(100% - 44px);

        .name {
          font-size: 14px;
          font-weight: 400;
        }

        .contentText {
          color: #333;
          font-weight: 400;
          font-size: 15px;
        }

        .time {
          color: #868a8e;
          font-size: 14px;

          span {
            margin-right: 10px;
            line-height: 20px;
          }

          .menu {
            display: none;

            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.img {
  display: flex;
  flex-wrap: wrap;

  &-item {
    width: 80px;
    height: 80px;
    padding: 3px;
    border: 1px solid #d8dce5;
    overflow: hidden;
    margin: 5px;

    &-img {
      width: 100%;
      height: 100%;
    }
  }
}

.el-form-item__label {
  font-size: 20px;
}
</style>
<style scoped>
:v-deep(.el-form-item__label) {
  font-weight: 800 !important;
  color: #fff !important;
  font-size: 18px !important;
}

.showImage {
  max-width: 300px;
}

.block-item {
  display: flex;
  margin: 5px 14px 10px 0;
}

.FileIcon {
  font-size: 40px;
  width: auto;
  height: auto;
  margin: 4px;
}
</style>
