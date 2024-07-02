<template>
  <div class="app-container">
    <div class="border-content">
      <el-scrollbar :height="modalHeight">
        <div class="main">
          <h2 class="text-center">{{ main.FILETITLE }}</h2>
          <div class="auther text-right text-muted">
            <!-- <span class="mr10"> 点击 {{ main.clickNumber }} </span> -->
            <span class="mr10"> 阅读 {{ main.ACCESSPSNCOUNT }}人 </span>
            <span class="mr10 text-danger" title="精华" v-if="main.ESSFLAG == 1">
              <el-tag class="ml5" type="danger" effect="dark" size="mini">
                <i class="GoldMedal"></i>精华
              </el-tag>
            </span>
            <span class="mr10 text-danger" title="已置顶" v-if="main.TOPFLAG == 1">
              <el-tag class="ml5" type="warning" effect="dark" size="mini">
                <i class="Upload"></i>已置顶
              </el-tag>
            </span>
            <span class="mr10"> {{ main.CREATIONTIME }} </span>
            <span class="mr10"> {{ main.CREATORNAME }} </span>
          </div>
          <div class="mt20 cljClass" v-html="main.CONTENTS"></div>
        </div>
        <div class="doc-wrap mt20" v-if="main.FILEIDS">
          <hr />
          <h4>附件 <el-icon class="fjClass">
              <Paperclip />
            </el-icon>
          </h4>
          <!-- <fileTable :data="main.FILEIDS" code="ZSK" /> -->
          <VTable ref="VTableRef" :tableCFG="tableConfig" :tableData="main.FILEIDSArr" :totalData="main.FILEIDSArr.length" actionBar :actionBarWidht="90">
            <template #SIZE="{row}">
              {{ calcFileSize(row.SIZE) }}
            </template>
            <template #actionBar="{row}">
              <el-row :gutter="5" justify="center">
                <el-col :span="1.5">
                  <el-link :underline="false" :href="`${baseUrl}${row.URL}`">下载</el-link>
                </el-col>
                <el-col :span="1.5">
                  <el-link :underline="false" v-if="row.CREATORID==user.BILLNO" @click="handleDelete(row)">删除</el-link>
                </el-col>
              </el-row>
            </template>
          </VTable>
          <!-- <fileItem v-for="item in main.files" :data="item" :formatter="{label:'FILENAME', value:'BILLNO'}" :key="item.BILLNO" showDown @download="download" /> -->
        </div>

        <!-- 最佳答案展示 -->
        <div class="Bast" v-if="main.BEST != null">
          <span class="bast">
            <i></i><span style="line-height:22px">最佳答案</span>
          </span>
          <div class="head">
            <span class="text-success">{{main.BEST.CREATORNAME}}</span>
          </div>
          <div class="content" v-html="main.BEST.CONTENTS"></div>
        </div>
        <!-- 最佳答案展示结束 -->

        <hr>
        <div class="CSb">
          <span>浏览：</span>
          <ul class="CS">
            <li class="CS-item" v-for="item in main.ACCESSPSNS" :key="item.USERID" @click="ShowCS('LL')">
              <avatar class="avatar" :avatar="item.AVATAR?'/'+item.AVATAR:''" :name="item.USERNAME" />
              <span class="name">{{item.USERNAME}}</span>
            </li>
          </ul>
        </div>
        <div class="CSb">
          <span>收藏：</span>
          <ul class="CS">
            <li class="CS-item" v-for="(item,index) in main.FAVPSNS" :key="index" @click="ShowCS('SC')">
              <avatar class="avatar" :avatar="item.AVATAR?'/'+item.AVATAR:''" :name="item.USERNAME" />
              <span class="name">{{item.CREATORNAME}}</span>
            </li>
          </ul>
        </div>
        <div class="mt20">
          <hr />
          <div class="bbs-btn">
            <span>
              <el-button class="collect" size="mini" round @click="handlefork">
                <i :class="['bbs-btn-icon', isFork == true ? 'el-icon-star-on' : 'el-icon-star-off']"></i>
                {{isFork == true ? '取消收藏':'收藏'}}</el-button>
              <el-button class="collect" size="mini" round @click="handelLike(1)"><i :class="['bbs-btn-icon', 'iconfont', isLike == true ? 'icon-zan' : 'icon-zan1']"></i>{{isLike == true ? '取消点赞':'点赞'}}</el-button>
            </span>
            <el-button type="success" icon="Plus" size="mini" round @click="isShowEditor = !isShowEditor">我来答</el-button>
          </div>
          <div class="answer-list-ask-submit mt10" v-if="isShowEditor">
            <!-- <editor ref="reply" v-model="askContents" :min-height="150" /> -->
            <!-- ExEditor 富文本 -->
            <Editor ref="reply" v-model="askContents" style="width: 100%;" />
            <div class="text-right mt5">
              <el-button type="success" size="mini" @click="submitQuestion({ REPLYTYPE: '0', CONTENTS: askContents },1)">发表</el-button>
            </div>
          </div>
        </div>

        <div class="answer-wrap mt20">
          <div class="answer-wrap-head">
            <span>
              问答列表 <i class="el-icon-chat-line-round"></i>
            </span>
          </div>
          <el-empty v-if="askList.length == 0" :image-size="100" description="暂无回答"></el-empty>
          <div class="answer-list" v-for="(item, index) in askList" :key="index">
            <div v-if="['BBS:admin:admin']">
              <!-- 最佳答案 开始 -->
              <span class="best" v-if="item.BESTANSWER == '0'" @click="handelBest(item.BILLNO)">设为最佳</span>
              <span class="best" v-else @click="handelBest(item.BILLNO,0)">取消最佳</span>
              <!-- 最佳答案 结束 -->
            </div>
            <div class="answer-list-head">
              <span class="text-success">{{ item.CREATORNAME }}</span>
            </div>
            <div class="answer-list-content" v-html="item.CONTENTS"></div>
            <el-row :gutter="10" class="answer-list-foot">
              <el-col :span="1.5" :offset="14">
                <span class="text-muted" style="vertical-align: bottom">
                  {{ index + 1 }} 楼 {{ item.CREATIONTIME }}
                </span>
              </el-col>
              <el-col :span="1.5">
                <el-link type="primary" @click="handelLike(2,item.BILLNO)">
                  {{ item.LIKEFLAG == '0'?'点赞':'取消点赞' }}
                </el-link>
              </el-col>
              <el-col :span="1.5">
                <el-link type="primary" @click="handelReply(index)">
                  {{ item.OPENSHOWLIST || item.OPENASK ? '收起回复' : '回复' }}
                  ({{ item.CHILDREN.length }})
                </el-link>
              </el-col>
            </el-row>

            <div class="answer-list-ask" v-if="item.OPENSHOWLIST || item.OPENASK">
              <template v-if="item.OPENSHOWLIST">
                <div class="answer-list-ask-list" v-for="(itemC, indexC) in item.CHILDREN" :key="indexC">
                  <div class="answer-list-ask-list-item">
                    <span class="text-success">{{ itemC.CREATORNAME }}</span>：
                    <span v-if="itemC.PARENTNAME">
                      回复
                      <span class="text-success">{{ itemC.PARENTNAME }} </span> ：
                    </span>
                    <span v-html="itemC.CONTENTS"> </span>
                  </div>
                  <div class="text-right text-s">
                    {{ itemC.CREATIONTIME }}
                    <a href="javascript:" @click="handelReplylist(index, indexC)">回复</a>
                  </div>
                </div>
              </template>

              <div class="text-right mt10">
                <el-button size="mini" @click="replyAsk(index)">我也说一句</el-button>
              </div>

              <div class="answer-list-ask-submit mt10 bg-white" v-if="item.OPENASK">
                <Editor ref="reply" v-model="askContents" style="width: 100%;" />
                <div class="text-right mt5">
                  <el-button type="primary" size="mini" @click="submitQuestion({ REPLYTYPE: 1, contents:askContents },2,index)">发表</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 浏览记录 -->
        <el-dialog v-model:visible="openLL" :show-close="true" width="600" class="dialog-div-pre-style" title="浏览记录" append-to-body :close-on-click-modal="false" height="70vh">
          <el-table border stripe size="mini" :data="main.accessPsns">
            <el-table-column prop="integral" label="用户" align="center">
              <template slot-scope="scope">
                <div class="flex">
                  <avatar class="avatar" :avatar="scope.row.photo?'/'+scope.row.photo:''" :name="scope.row.username" />
                  <span>{{scope.row.username}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="accdtime" label="时间" align="center"></el-table-column>
          </el-table>
        </el-dialog>

        <!-- 收藏记录 -->
        <el-dialog v-model:visible="openSC" :show-close="true" width="600" class="dialog-div-pre-style" title="收藏记录" append-to-body :close-on-click-modal="false" height="70vh">
          <el-table border stripe size="mini" :data="main.favPsns">
            <el-table-column prop="creatorName" label="用户" align="center">
              <template slot-scope="scope">
                <div class="flex">
                  <avatar class="avatar" :avatar="scope.row.photo?'/'+scope.row.photo:''" :name="scope.row.username" />
                  <span>{{scope.row.creatorName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="CREATIONTIME" label="时间" align="center"></el-table-column>
          </el-table>
        </el-dialog>
      </el-scrollbar>
    </div>

  </div>

</template>

<script setup>
import { getFork, detailItem, getWDList, getTwAdd, getDW, getSZZJ, delProStageFile, TableConfig } from "#/ETEAM/BBS";
import VTable from "@/components/Tables"
import { bytesToSize } from "@/utils"
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
const props = defineProps({
  mainP: Object,
  askListP: Array,
  detailId: String
});
const tableConfig = reactive({
  tableColumns: TableConfig,
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  expandID: "",
  loading: false,
  height: 200,
});
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const isFork = ref(false)
const isLike = ref(false)
const { proxy } = getCurrentInstance();
const modalHeight = window.innerHeight - 200;
const baseUrl = window.location.origin + '/' //"http://116.63.138.118:8080/";
let { mainP: main } = toRefs(props)
isFork.value = main.value.COLLECTFLAG
isLike.value = main.value.LIKEFLAG
const replyList = ref(false)
const activeReply = ref({})
const askList = ref(props.askListP);
const likePsnCount = ref(0)
const isShowEditor = ref(false)
const askListIndex = ref(0)
const askContents = ref('')
function handlefork() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    SORTNAME: "",
    REVERSE: "",
    KNOWLEDGEHELPID: main.value.BILLNO,
    VTYPE: isFork.value == true ? 1 : 0,
    KEY: "",
    MODULEID: "MU230323113066",
    PAGEID: "PG230323702457",
    VERSION: "",
  };
  getFork(data).then((res) => {
    opendetail()
    proxy.$modal.msgSuccess("操作成功");
    isFork.value = !isFork.value
  });
}
function opendetail() {
  let data = {
    BILLNO: main.value.BILLNO,
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
  };
  detailItem(data).then(res => {
    main.value = res.RESULT;
    isFork.value = res.RESULT.COLLECTFLAG;
    isLike.value = res.RESULT.LIKEFLAG;
    likePsnCount.value = main.value.LIKEPSNCOUNT;

    // main.ACCESSPSNS = main.ACCESSPSNS.filter(item => { return item.USERNAME });
    // main.FAVPSNS =  main.FAVPSNS.filter(item => { return item.CREATORNAME });
    getAskList(main.value.BILLNO);
  })
}
function getAskList(IDrow) {
  let data = {
    KNOWLEDGEHELPID: IDrow,
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
  };
  getWDList(data).then(res => {
    let List = []
    res.RESULT.forEach((item) => {
      let listChildren = item.CHILDREN
      item.OPENASK = false;
      item.OPENSHOWLIST = true;
      item.ASKCONTENTS = '';
      item.CHILDREN = listChildren.length > 0 ? resetArr(listChildren, item.CREATORNAME) : []
      List.push(item)
    })
    askList.value = List;
  })
}
const handleDelete = (row) => {
  proxy.$modal.confirm(`是否确定删除 ${row.FILENAME} ？`).then((res) => {
    let id = row.BILLNO;
    delProStageFile({
      FILEID: id,
      BILLNO: main.value.BILLNO
    }).then(res => {
      proxy.$modal.msgSuccess("删除成功");
      proxy.$emit("detaileMethod");
      // getProStageList()
      // handleDetail({
      //   PROBILLNO: KEYWORD.value,
      //   PLANBILLNO: NodeValue.value
      // })
    })
  });
};
function resetArr(Arr, str) {
  let List = []
  const getAllChildren = function (data, str) {
    data.forEach((item) => {
      item.PARENTNAME = str
      List.push(item)
      if (item.CHILDREN.length > 0) {
        getAllChildren(item.CHILDREN, item.CREATORNAME)
      }
    })
  }
  getAllChildren(Arr, str)
  return List
}
function submitQuestion(content, type) {
  if (content.CONTENTS == '') return proxy.$modal.msgError("内容不可为空！")
  content.KNOWLEDGEHELPID = main.value.BILLNO;
  content.MODULEID = routerParams.BILLNO;
  content.PAGEID = 'PG230302286731';
  if (content.REPLYTYPE == "1") {
    content.PKPARENT = askList.value[askListIndex.value].BILLNO;
  }
  getTwAdd(content).then(res => {
    proxy.$modal.msgSuccess("发表成功");
    getAskList(main.value.BILLNO);
    isShowEditor.value = false;
    askContents.value = '';
    askList.value[askListIndex.value].OPENASK = !askList.value[askListIndex.value].OPENASK;
    askList.value = [];
  })
}
function handelBest(id, set = "1") {
  let best = set == '1' ? 1 : 0;
  let data = {
    BILLNO: id,
    TYPE: best,
    MODULEID: routerParams.BILLNO,
    PAGEID: 'PG230302286731',
  };
  getSZZJ(data).then(res => {
    proxy.$modal.msgSuccess(res.MESSAGE);
    getAskList(main.value.BILLNO)
    opendetail()
  })
}
const calcFileSize = bytes => {
  if (!bytes) return "0 B"
  return bytesToSize(bytes * 1)
}
function handelLike(TYPE, BILLNO = main.value.BILLNO) {
  TYPE = TYPE + ''
  getDW({
    TYPE,
    BILLNO,
    ACTION: '4'
  }).then(res => {
    if (TYPE == 1) {
      isLike.value = !isLike.value;
      !isLike.value ? likePsnCount.value -= 1 : likePsnCount.value += 1;
      opendetail()
    } else {
      let index = askList.value.findIndex(el => el.BILLNO == BILLNO);
      askList.value[index].LIKEFLAG = askList.value[index].LIKEFLAG ==
        '0' ? '1' : '0'
      askList.value[index].LIKEFLAG == '1' ? askList.value[index].LIKEPSNCOUNT += 1 :
        askList.value[index].LIKEPSNCOUNT -= 1;
    }
    proxy.$modal.msgSuccess(res.MESSAGE);

  })
}

function handelReply(i) {
  askListIndex.value = i;
  if (askList.value[i].CHILDREN.length > 0) {
    askList.value[i].OPENSHOWLIST = !askList.value[i].OPENSHOWLIST
  } else {
    askList.value[i].OPENASK = !askList.value[i].OPENASK
  }
  if (askList.value[i].OPENASK) {
    activeReply.value = askList.value[i]
    activeReply.value.pkParent = activeReply.billNo
  } else {
    activeReply.value = {}
  }
  if (askList.value[i].OPENSHOWLIST == false && askList.value[i].CHILDREN.length > 0) {
    askList.value[i].OPENASK = false
  }
}
function replyAsk(i) {
  askListIndex.value = i;
  askList.value[i].OPENASK = !askList.value[i].OPENASK
  activeReply.value = askList.value[i];
}
function handelReplylist(i, ii) {
  askList.value[i].OPENASK = true;
  askList.value[i].ASKCONTENTS = '@' + askList.value[i].CHILDREN[ii].CREATORNAME + ''
  activeReply.value = askList.value[i].CHILDREN[ii]
  replyList.value = true
}
function calcName(str) {
  console.log(str)
  return str.length > 2 ? str.substr(-2, 2) : str;
}
</script>

<style lang="scss">
.app-container {
  padding: 10px 10px 10px 20px;
  // height: 100%;
  height: calc(100vh - 142px);
  width: 100%;
  background: #fff;
  .border-content {
    .answer-wrap {
      &-head {
        padding: 10px;
        background-color: #f5f8f9;
      }
      .answer-list {
        padding: 16px 10px;
        border: 1px solid #ddd;
        box-sizing: border-box;
        margin-bottom: 10px;
        font-size: 14px;
        position: relative;
        &:hover {
          .best {
            display: block;
          }
        }
        .best {
          display: none;
          position: absolute;
          z-index: 1;
          right: 10px;
          top: 16px;
          cursor: pointer;
          color: #46a6ff;
          font-size: 13px;
        }
        &-head {
          margin-bottom: 8px;
        }
        &-content {
          // padding: 10px 0;
          img {
            max-width: 100%;
          }
        }
        &-foot {
          text-align: right;
        }
        &-ask {
          background-color: #f3f3f3;
          padding: 10px;
          &-list {
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
            img {
              max-width: 100%;
            }
            &-submit {
              background-color: #fff;
            }
          }
        }
      }
    }
  }

  .answer-list img {
    max-width: 100% !important;
  }
  .main img {
    max-width: 100% !important;
  }

  .Bast {
    margin: 20px 0;
    position: relative;
    padding: 16px 10px;
    border: 1px solid #13ce66;
    border-radius: 16px;
    min-height: 120px;
    box-shadow: inset 0px 30px 30px -20px #13ce66;
  }
  .Bast .bast {
    position: absolute;
    top: 6px;
    right: 20px;
  }
  .Bast .head {
    margin-bottom: 8px;
    font-size: 14px;
  }
  .bast i {
    display: inline-block;
    width: 22px;
    height: 22px;
    //   background: url("data:image/png;base64,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")
    //     no-repeat center;
    background-size: cover;
    vertical-align: bottom;
  }
  .bbs-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // .collect.el-button {
    //   &:hover,
    //   &:active,
    //   &:focus {
    //     color: #fff !important;
    //     border-color: #dcdfe6 !important;
    //     background: #fff;
    //   }
    // }
    // .collect.el-button {
    //   &:hover{
    //     color: #fff !important;
    //     border-color: #dcdfe6 !important;
    //     background: #fff;
    //   }
    // }
  }
  .bbs-btn-icon {
    font-size: 16px;
    vertical-align: text-bottom;
    margin-right: 3px;
  }
  .el-icon-star-on {
    color: #fcd337 !important;
  }
  .icon-zan {
    color: #f93a4a !important;
  }
  .CSb {
    display: flex;
    align-items: center;
    padding: 10px 0;
    overflow: hidden;
    .CS {
      overflow: hidden;
      flex-wrap: nowrap !important;
    }
  }
  .avatar {
    margin: 10px auto;
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
  .imgClass {
    margin-top: 15px;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    .avatar {
      margin-right: 10px;
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
      width: 70px;
      height: 80px;
      // margin-top: 5px;
      .name {
        display: block;
        font-size: 12px;
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &:hover {
        cursor: pointer;
      }
    }
    .SZLi {
      position: relative;
      top: 15px;
    }
  }
  .text-right {
    text-align: right;
  }
}
.cljClass {
  a {
    color: #1677ff;
  }
}
.fjClass {
  position: relative;
  top: 3px;
}
</style>