<template>
  <div class="app-wrap group">
    <Schedule :date="initDate" :data="dataList" :loading="loading" :height="height" :totalData="totalList" children="workPunchChildrens" @click="workAdd" @change="TimeChange" size="default">
      <template v-slot:menu>
        <div class="menu">
          <span></span>
          <!-- <el-popover placement="bottom-end" :width="300" trigger="click">
            <template #reference>
              <span>
                所有成员
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </span>
            </template>
            <div class="pop-dept">
              <div class="search">
                <el-input v-model="deptKeyword" size="default" placeholder="搜索部门" />
              </div>
              <el-scrollbar height="260px">
                <div class="pop-user-group" @click="showUserSelect('pro')">
                  所有成员<el-icon>
                    <ArrowRight />
                  </el-icon>
                </div>
                <div class="pop-user-group" @click="showUserSelect('dept')">
                  部门成员<el-icon>
                    <ArrowRight />
                  </el-icon>
                </div>
              </el-scrollbar>
            </div>
          </el-popover> -->
          <div class="right">
            <el-popover placement="bottom" :width="260" trigger="click" v-model:visible="popUser">
              <template #reference>
                <el-icon class="add" size="20px">
                  <CirclePlusFilled />
                </el-icon>
              </template>
              <div class="pop-user">
                <template v-if="popUserSelect">
                  <span class="back" @click="back">
                    <el-icon>
                      <ArrowLeft />
                    </el-icon>返回
                  </span>
                  <div class="search">
                    <el-input v-model="popUserSelectKeyword" size="default" :placeholder="`搜索${
                        popUserSelect == 'pro' ? '项目' : '用户'
                      }`" />
                  </div>
                  <el-scrollbar height="260px">
                    <el-checkbox-group v-model="popList" v-if="selectOption.length">
                      <el-checkbox class="pop-user-item" size="default" v-for="item in selectOption" :key="item" :label="item.VALUE">{{ item.LABEL }}</el-checkbox>
                    </el-checkbox-group>
                    <el-empty v-else :image-size="70" />
                  </el-scrollbar>
                </template>
                <template v-else>
                  <div class="search">
                    <el-input v-model="userKeyword" size="default" placeholder="搜索用户" />
                  </div>
                  <el-scrollbar height="260px">
                    <template v-if="userKeyword == ''">
                      <div class="pop-user-group" @click="showUserSelect('pro')">
                        项目成员<el-icon>
                          <ArrowRight />
                        </el-icon>
                      </div>
                      <div class="pop-user-group" @click="showUserSelect('dept')">
                        部门成员<el-icon>
                          <ArrowRight />
                        </el-icon>
                      </div>
                    </template>
                    <template v-else>
                      <el-checkbox-group v-model="popList" v-if="selectOption.length">
                        <el-checkbox class="pop-user-item" size="default" v-for="item in selectOption" :key="item" :label="item.userNo">{{ item.userName }}</el-checkbox>
                      </el-checkbox-group>
                      <el-empty v-else :image-size="70" />
                    </template>
                  </el-scrollbar>
                </template>
                <div class="btn">
                  <el-button @click="setUser" type="primary" size="default">确定</el-button>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </template>
      <template v-slot:block="{ data, index }">
        <div class="user">
          <el-icon class="close" :disabled="index == 0" @click.stop="delUser(data)" size="20px">
            <CircleCloseFilled />
          </el-icon>
          <div class="info">
            <div class="name">{{ data.punchUserName }}</div>
            <el-icon class="right">
              <ArrowRight />
            </el-icon>
          </div>
          <div class="time">
            合计：<span class="num">{{ data.practicalLaborHourSum }}</span>小时
          </div>
        </div>
      </template>
      <template v-slot:day="{ data }">
        <div class="btn" v-if="data.practicalLaborHourSumOfDay">
          <span>{{ Number(data?.practicalLaborHourSumOfDay) }} 小时</span>
        </div>
      </template>
      <template v-slot:day-item="{ data }">
        <ul v-if="data.taskChildrens.length" class="day">
          <li v-for="(item, index) in data.taskChildrens" :key="index" class="day-item">
            <el-icon v-if="data.punchUserNo == userInfo.BILLNO" class="close" @click="workDelete(item)">
              <CircleCloseFilled />
            </el-icon>
            <div class="degree" :class="`degree-${item.taskPriority}`"></div>
            <div class="work" @click="workDetail(item)">
              <div class="work-title">
                <el-tooltip :content="item.taskName" placement="top" effect="dark">
                  {{ item.taskName }}
                </el-tooltip>
              </div>
              <div class="work-time">
                <span>工时</span>
                <span class="value">{{ item.laborHour }}小时</span>
              </div>
              <div class="work-time">
                <span>项目</span>
                <span class="value" :title="item.projName">{{item.projName}}</span>
              </div>
            </div>
          </li>
        </ul>
      </template>
      <template v-slot:total>
        <div class="total">总计：{{ total }}小时</div>
      </template>
      <template v-slot:total-item="{ data }">
        <div class="total-item">{{ data?.total }}小时</div>
      </template>
    </Schedule>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <Form v-if="formType != 'detail'" ref="formRef" v-model:formData="form" size="default" :formConfig="formConfig" :othConfig="{ labelWidth: '70px' }" :rules="rules" :detail="formType == 'detail'" labelPosition="top">
          <template v-slot:laborHour="">
            <el-input-number v-model="form.laborHour" size="default" :min="0.5" controls-position="right" :precision="1" :max="8" :step="0.5" @change="handleChange" style="width: 100%; text-align: left" />
          </template>
        </Form>
        <!-- 详情 -->
        <div class="work-detail" v-else>
          <div class="left">
            <el-scrollbar>
              <el-form modal="form" label-width="70px" size="default">
                <el-form-item label-width="0" prop="taskName">
                  <h2 class="title edit" :contentEditable="edit && form.taskCompleteStatus == '0'" @blur="(e) => setForm('taskName', e)">
                    {{ form.taskName }}
                  </h2>
                </el-form-item>
                <el-form-item prop="taskName" label="状态">
                  <el-popover v-model:visible="taskStatusVisiable" placement="bottom-start" :width="200" trigger="click" :disabled="!edit">
                    <template #reference>
                      <el-tag class="tag" size="default" :type="
                          selectDictLabel(
                            taskStatus,
                            form.taskCompleteStatus,
                            'COLOR'
                          )
                        ">{{
                          selectDictLabel(taskStatus, form.taskCompleteStatus)
                        }}</el-tag>
                    </template>
                    <div class="tag-item" v-for="item in taskStatus" :key="item.VALUE" @click="setForm('taskCompleteStatus', item.VALUE)">
                      <el-icon v-if="form.taskCompleteStatus == item.VALUE" class="icon">
                        <Select />
                      </el-icon>
                      <el-tag size="default" :type="selectDictLabel(taskStatus, item.VALUE, 'COLOR')">{{ item.LABEL }}</el-tag>
                    </div>
                  </el-popover>
                </el-form-item>
                <el-form-item label="时间">
                  <template v-if="!edit">{{ form.punchDate }}</template>
                  <el-date-picker v-else v-model="form.punchDate" type="date" :clearable="false" size="default" :disabled="!edit" />
                </el-form-item>
                <el-form-item label="项目">
                  <template v-if="!edit">{{ form.projName }}</template>
                  <el-select v-else v-model="form.projNo" filterable remote :remote-method="getPro" @change="(val) => setForm('projNo', val)">
                    <el-option v-for="item in proList" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="优先级">
                  <el-popover v-model:visible="taskPriorityVisiable" placement="bottom-start" :width="200" trigger="click" :disabled="!edit">
                    <template #reference>
                      <el-tag class="tag" size="default" :type="
                          selectDictLabel(
                            taskPriority,
                            form.taskPriority,
                            'COLOR'
                          )
                        ">{{
                          selectDictLabel(taskPriority, form.taskPriority)
                        }}</el-tag>
                    </template>
                    <div class="tag-item" v-for="item in taskPriority" :key="item.VALUE" @click="setForm('taskPriority', item.VALUE)">
                      <el-icon v-if="form.taskPriority == item.VALUE" class="icon">
                        <Select />
                      </el-icon>
                      <el-tag size="default" :type="
                          selectDictLabel(taskPriority, item.VALUE, 'COLOR')
                        ">{{ item.LABEL }}</el-tag>
                    </div>
                  </el-popover>
                </el-form-item>
                <el-form-item label="备注">
                  <div class="memo edit" :contentEditable="edit && form.taskCompleteStatus == '0'" @blur="(e) => setForm('vmemo', e)">
                    {{ form.vmemo }}
                  </div>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
          <div class="right">
            <div class="work-user">
              <div class="title">
                参与者 · {{ form.taskRelateUserList.length }}
              </div>
              <ul class="users">
                <li class="users-item" v-for="(item, index) in form.taskRelateUserList" :key="item.taskRelateUserNo">
                  <div class="del" v-if="index > 0" @click="delProUser(index)">
                    <el-icon>
                      <Close />
                    </el-icon>
                  </div>
                  <el-tooltip effect="dark" :content="item.taskRelateUserName" placement="top">
                    <div class="avatar">
                      {{ calcUserName(item.taskRelateUserName) }}
                    </div>
                  </el-tooltip>
                </li>
                <li class="users-item" v-if="edit">
                  <el-tooltip effect="dark" content="添加参与者" placement="top">
                    <div class="add">
                      <el-popover placement="bottom" :width="200" trigger="click">
                        <template #reference>
                          <el-icon @click="getProUsers">
                            <Plus />
                          </el-icon>
                        </template>
                        <div class="pop-user">
                          <el-scrollbar height="260px">
                            <el-checkbox-group v-model="proSelectUser" v-if="proUserList.length">
                              <el-checkbox class="pop-user-item" size="default" v-for="item in proUserList" :key="item" :label="item.userNo" :checked="item.disabled" :disabled="item.disabled">{{ item.userName }}</el-checkbox>
                            </el-checkbox-group>
                            <el-empty v-else :image-size="70" />
                          </el-scrollbar>
                          <div class="btn">
                            <el-button @click="setProUser" type="primary" size="default">确定</el-button>
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </el-tooltip>
                </li>
              </ul>
            </div>
            <el-divider />
            <div class="work-log">
              <div class="types"></div>
              <el-scrollbar class="log" :height="logHeight">
                <el-link class="log-item" v-if="logList.length" @click="showAllLog = !showAllLog">{{
                    !showAllLog
                      ? `显示最早的${logList.length}条动态`
                      : "隐藏较早的动态"
                  }}</el-link>
                <template v-if="showAllLog">
                  <div class="log-item" v-for="(item, index) in logList" :key="index">
                    <div class="content">{{ item.opAction }}</div>
                    <div class="time">{{ formatLogTime(item.opTime) }}</div>
                  </div>
                </template>
                <div class="log-item" v-for="(item, index) in last5Log" :key="index">
                  <div class="content">{{ item.opAction }}</div>
                  <div class="time">{{ formatLogTime(item.opTime) }}</div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <el-button v-if="edit" type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup>
import Schedule from "@/components/Schedule";
import {
  reportWorkList,
  reportWorkDetail,
  reportWorkAdd,
  reportWorkEdit,
  reportWorkDelete,
  FormConfig,
  projectList,
  getProjeftUsers,
  getUsers,
  getDept,
  taskPriority,
  taskStatus,
  setWorkUsers,
  delWorkUser,
  getWorkLog,
} from "#/ETEAM/project_report";
import { getFormValue, getFormRule, formatTime } from "@/utils";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const height = window.innerHeight - 180;

const route = useRoute();
const { proxy } = getCurrentInstance();
const formRef = ref(null);

const loading = ref(true);
const initDate = ref(calcNow());
const queryParams = ref({
  beginDate: initDate.value[0],
  endDate: initDate.value[1],
  MODULEID: route.meta.BILLNO,
  PAGEID: route.meta.PBILLNO,
  userNoList: [],
});
const dataList = ref([]);
const total = ref(0);
const totalList = ref([]);

// menu
const deptKeyword = ref("");
const userKeyword = ref("");
watch(userKeyword, (val) => {
  getUsers({
    userName: val,
  }).then((res) => {
    selectOption.value = res.RESULT;
  });
});
const popList = ref([]);
const back = () => {
  popUserSelect.value = "";
  popUserSelectKeyword.value = "";
  selectOption.value = [];
};

const popUser = ref(false);
const popUserSelect = ref("");
const popUserSelectKeyword = ref("");
const selectOption = ref([]);
const showUserSelect = (type) => {
  if (type == "pro") {
    projectList({
      KEYWORD: popUserSelectKeyword.value,
    })
      .then((res) => {
        selectOption.value = res.RESULT;
      })
      .finally(() => {
        popUserSelect.value = type;
      });
  } else {
    getDept({
      KEYWORD: popUserSelectKeyword.value,
    })
      .then((res) => {
        selectOption.value = res.RESULT.map((el) => {
          el.LABEL = el.deptName;
          el.VALUE = el.deptNo;
          return el;
        });
      })
      .finally(() => {
        popUserSelect.value = type;
      });
  }
};
watch(popUserSelectKeyword, (val) => {
  showUserSelect(popUserSelect.value);
});
const initPop = () => {
  popUser.value = false;
  popUserSelect.value = "";
  popList.value = [];
  userKeyword.value = "";
  selectOption.value = [];
};

const setUser = () => {
  let type = popUserSelect.value;
  if (type == "pro") {
    getProjeftUsers({
      projNo: popList.value.join(","),
    }).then((res) => {
      mapUsers(res.RESULT);
    });
  } else {
    let data = JSON.parse(JSON.stringify(popList.value));
    queryParams.value.userNoList = data;
    initPop();
    getData();
  }
};
function mapUsers(arr) {
  let hash = {};
  let newArr = arr.reduce((item, next) => {
    hash[next.userNo] ? "" : (hash[next.userNo] = true && item.push(next));
    return item;
  }, []);
  queryParams.value.userNoList = newArr.map((el) => el.userNo);
  initPop();
  getData();
}
const delUser = (row) => {
  let { punchUserNo: id } = row;
  let queryIndex = queryParams.value.userNoList.findIndex((el) => el == id);
  queryParams.value.userNoList.splice(queryIndex, 1);
  let dataIndex = dataList.value.findIndex((el) => el.punchUserNo == id);
  dataList.value.splice(dataIndex, 1);
};

function calcNow() {
  let startTime, endTime;
  let now = new Date(); //当前日期
  let nowDayOfWeek = now.getDay() - 1; //今天本周的第几天
  let nowDay = now.getDate(); //当前日
  let nowMonth = now.getMonth(); //当前月
  let nowYear = now.getFullYear(); //当前年
  let jd = Math.ceil((nowMonth + 1) / 3);
  startTime = proxy.parseTime(
    new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString(),
    "{y}-{m}-{d}"
  );
  endTime = proxy.parseTime(
    new Date(nowYear, nowMonth, nowDay + 6 - nowDayOfWeek).toLocaleDateString(),
    "{y}-{m}-{d}"
  );
  return [startTime, endTime];
}

const TimeChange = (val) => {
  let { start, end } = val;
  queryParams.value.beginDate = proxy.parseTime(start, "{y}-{m}-{d}");
  queryParams.value.endDate = proxy.parseTime(end, "{y}-{m}-{d}");
  getData();
};

function mapDate(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    el.practicalLaborHourSumOfDay = Number(el.practicalLaborHourSumOfDay);
    let dateInfo = formarDateObj(el.punchDate);
    newArr.push({ ...el, ...dateInfo });
    if (!totalList.value?.[i]) {
      totalList.value.push({
        ...dateInfo,
        total: el.practicalLaborHourSumOfDay,
      });
    } else {
      totalList.value[i].total += el.practicalLaborHourSumOfDay;
    }
  }
  return newArr;
}
function formarDateObj(date) {
  let weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let day = new Date(date);
  return {
    year: day.getFullYear(),
    month: day.getMonth() + 1,
    day: day.getDate(),
    week: weekArr[day.getDay()],
    date: `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`,
    value: new Date(day),
  };
}

const getData = () => {
  total.value = 0;
  totalList.value = [];
  loading.value = true;
  reportWorkList(queryParams.value)
    .then((res) => {
      dataList.value = res.RESULT.map((el) => {
        el.workPunchChildrens = mapDate(el.workPunchChildrens);
        el.practicalLaborHourSum = Number(el.practicalLaborHourSum);
        total.value += el.practicalLaborHourSum;
        return el;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const form = ref({});
const formConfig = ref(FormConfig);
const rules = ref({});
const formType = ref("add");
const pageConfig = reactive({
  modalVisible: false,
  modalW: "50%",
  modalH: "40%",
  modelTitle: "",
});

const workAdd = (row) => {
  let { date } = row;
  formType.value = "add";
  form.value = getFormValue(formConfig.value);
  form.value.punchDate = proxy.parseTime(date, "{y}-{m}-{d}");
  rules.value = getFormRule(formConfig.value);
  pageConfig.modelTitle = "报工录入";
  pageConfig.modalW = "440px";
  pageConfig.modalH = "520px";
  pageConfig.modalVisible = true;
};
const proList = ref([]);
const proUserList = ref([]);
const proSelectUser = ref([]);
const getPro = (val) => {
  projectList({
    KEYWORD: val,
  }).then((res) => {
    proList.value = res.RESULT;
  });
};
const getProUsers = (val) => {
  let proUser = form.value.taskRelateUserList ? form.value.taskRelateUserList.map(el => el.taskRelateUserNo) : [];
  getProjeftUsers({
    projNo: val,
  }).then((res) => {
    proUserList.value = res.RESULT.map((el) => {
      el.disabled = proUser.includes(el.userNo);
      return el;
    });
  });
};
const setProUser = () => {
  if (!proSelectUser.value.length) return;
  let proUser = form.value.taskRelateUserList ? form.value.taskRelateUserList.map(el => el.taskRelateUserNo) : [];
  let data = proUserList.value
    .filter((el) => !proUser.includes(el.userNo) && proSelectUser.value.includes(el.userNo))
    .map((el) => {
      return {
        taskRelateUserNo: el.userNo,
        taskRelateUserName: el.userName,
        taskRelateUserAvatar: el.userAvatar,
        taskRelateUserIdentity: "2",
      };
    });
  form.value.taskRelateUserList = [...form.value.taskRelateUserList, ...data];
  updateUsers();
};
const delProUser = (index) => {
  let delUser = form.value.taskRelateUserList.splice(index, 1);
  delWorkUser({
    taskNo: form.value.taskNo,
    projNo: form.value.projNo,
    projName: form.value.projName,
    taskRelateUserNo: delUser[0].taskRelateUserNo,
  }).then((res) => {
    getDept(form.value);
    workLog();
  });
};
const updateUsers = () => {
  setWorkUsers(form.value).then((res) => {
    getDept(form.value);
    workLog();
  });
};

const workDetail = (row) => {
  let { taskNo, punchNo } = row;
  workLog(row);
  getPro();
  reportWorkDetail({
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    taskNo,
    punchNo,
  }).then((res) => {
    formType.value = "detail";
    form.value = { ...getFormValue(formConfig.value), ...res.RESULT };
    edit.value = form.value.punchUserNo == userInfo.value.BILLNO;
    getProUsers(res.RESULT.projNo);
    pageConfig.modelTitle = "报工详情";
    pageConfig.modalW = "1100px";
    pageConfig.modalH = "70%";
    pageConfig.modalVisible = true;
  });
};

const showAllLog = ref(false);
const logList = ref([]);
const last5Log = ref([]);
const workLog = (data) => {
  let row = data || form.value;
  showAllLog.value = false;
  let { taskNo } = row;
  getWorkLog({
    taskNo,
  }).then((res) => {
    logList.value = res.RESULT.slice(0, res.RESULT.length - 5);
    last5Log.value = res.RESULT.slice(-5);
  });
};

const workDelete = (row) => {
  let { taskNo, punchNo } = row;
  proxy.$modal.confirm("确定删除工时？").then(() => {
    reportWorkDelete({
      MODULEID: route.meta.BILLNO,
      PAGEID: route.meta.PBILLNO,
      taskNo,
      punchNo,
    }).then(() => {
      proxy.$modal.msgSuccess("删除成功");
      getData();
    });
  });
};

const formSubmit = () => {
  formRef.value.submitForm().then((valid) => {
    if (!valid) return;
    reportWorkAdd({
      ...form.value,
      MODULEID: route.meta.BILLNO,
      PAGEID: route.meta.PBILLNO,
    }).then((res) => {
      pageConfig.modalVisible = false;
      proxy.$modal.msgSuccess("提交成功");
      getData();
    });
  });
};

const edit = ref(true);
const taskPriorityVisiable = ref(false);
const taskStatusVisiable = ref(false);
const setForm = (id, val) => {
  taskPriorityVisiable.value = false;
  taskStatusVisiable.value = false;
  if (val == form.value) return false;
  if (id == "taskName" || id == "vmemo") {
    form.value[id] = val.target.innerText;
  } else {
    form.value[id] = val;
  }
  reportWorkEdit({
    id,
    workClockPunchTaskReqDto: form.value,
  }).then(() => {
    workLog();
  });
};

const formatLogTime = (time) => formatTime(time);

const calcUserName = (str) => (str && str.length > 2 ? str.substr(-2) : str);

getData();
</script>

<style lang="scss" scoped>
.app-wrap {
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 10px;
}
.group {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.menu {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .add {
    color: var(--el-color-primary);
  }
}
.search {
  margin-bottom: 5px;
}
.pop-user {
  .back {
    height: 20px;
    font-size: 14px;
    display: block;
    display: flex;
    align-items: stretch;
    color: var(--el-color-primary);
    user-select: none;
    cursor: pointer;
    margin-bottom: 5px;
  }
  &-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    height: 40px;
    &:hover {
      background: var(--el-color-info-light-9);
    }
  }
  &-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-right: 0;
    font-size: 14px;
    &:hover {
      background: var(--el-color-info-light-9);
    }
  }

  .btn {
    border-top: 1px solid var(--el-border-color);
    padding-top: 8px;
    button {
      width: 100%;
      height: 40px;
    }
  }
}
.user {
  width: 100%;
  height: 60px;
  padding: 10px 10px 10px 30px;
  font-size: 14px;
  position: relative;
  &:hover {
    .close {
      display: block;
    }
  }
  .close {
    display: none;
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--el-color-primary);
    &[disabled="true"] {
      color: var(--el-text-color-secondary);
      pointer-events: none;
    }
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .time {
    color: var(--el-text-color-secondary);
    .num {
      display: inline-block;
      margin-right: 3px;
    }
  }
}
.day {
  margin: 0;
  padding: 8px;
  list-style: none;
  &-item {
    width: 100%;
    background: #fff;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 8px;
    transition: all 0.28s ease;
    font-size: 12px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    &:hover {
      .close {
        display: block;
        &::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: #fff;
          border-radius: 50%;
          z-index: -1;
        }
      }
    }
    .degree {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      overflow: hidden;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      &-1 {
        background: #f93a4a;
      }
      &-2 {
        background: #ff8f1f;
      }
      &-4 {
        background: #999;
      }
    }
    .close {
      display: none;
      position: absolute;
      right: -10px;
      top: -10px;
      z-index: 1;
      font-size: 20px;
      color: var(--el-text-color-secondary);
    }
    &:last-child {
      margin-bottom: 0;
    }
    .work {
      overflow: hidden;
      &-title {
        font-size: 14px;
        margin-bottom: 5px;
        word-break: break-word;
        white-space: normal;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        &:hover {
          color: var(--el-color-primary);
        }
      }
      &-time {
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
        :first-child {
          color: var(--el-text-color-secondary);
        }
        .value {
          max-width: calc(100% - 30px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.total,
.total-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.open {
  .right {
    transform: rotate(90deg);
  }
}
:deep(.el-input-number) {
  box-sizing: content-box;
  .el-input__inner {
    text-align: left;
  }
}
.work-detail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  .left {
    width: 60%;
    height: 100%;
    padding-right: 10px;
    border-right: 1px solid var(--el-border-color);
    .edit {
      width: 100%;
      font-weight: 500;
      word-break: break-word;
      padding: 8px;
      margin: 0;
      font-size: 20px;
      &:focus {
        border: none;
        outline: none;
      }
      [contenteditable] {
        cursor: text;
        outline: 0;
        border: none;
        &:empty::before {
          content: attr(placeholder);
          opacity: 0.5;
        }
      }
      &:hover,
      &:focus {
        background: var(--el-color-info-light-9);
      }
    }
    .memo {
      font-size: var(--font-size);
      padding: 0;
      font-weight: 400;
    }
  }
  .right {
    width: 40%;
    height: 100%;
  }
  .log-item {
    user-select: none;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--el-color-info-dark-2);
    .content {
      max-width: calc(100% - 126px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .time {
      max-width: 126px;
    }
  }
}
.work-user {
  padding: 8px;
  .title {
    font-size: 14px;
  }
  .users {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &-item {
      cursor: pointer;
      margin: 10px 5px 0;
      position: relative;
      &:hover {
        .avatar {
          outline: 2px solid var(--el-color-info);
        }
        .del {
          display: flex;
        }
      }
      .del {
        display: none;
        position: absolute;
        top: -8px;
        right: -5px;
        background: var(--el-color-info);
        font-size: 14px;
        color: #fff;
        font-weight: bold;
        width: 16px;
        height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        &:hover {
          background: var(--el-color-primary);
        }
      }
      .avatar {
        font-size: 12px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--el-color-primary-light-2);
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
      }
      .add {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        justify-content: center;
        background: var(--el-color-primary);
      }
    }
  }
}
.work-log {
  height: calc(100% - 98px);
  .type {
    padding: 8px;
  }
}
.tag {
  cursor: pointer;
}
.tag-item {
  display: flex;
  align-items: center;
  padding: 5px 30px;
  position: relative;
  .icon {
    position: absolute;
    left: 5px;
    font-size: 16px;
    color: var(--el-color-primary);
  }
  &:hover {
    background: var(--el-color-info-light-9);
  }
}
:deep(.el-radio) {
  width: 100%;
  .el-radio__inner {
    display: none !important;
  }
}
</style>
