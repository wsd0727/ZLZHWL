<template>
  <div class="top-menu">
    <div class="top-menu-wrap">
      <div class="collapse-btn" @click="openIsCollapse" v-show="menuStyle == 'WZC'">
        <el-icon :size="30" v-if="!isCollapse">
          <Fold />
        </el-icon>
        <el-icon :size="30" v-else>
          <Expand />
        </el-icon>
      </div>
      <div class="system-title">
        <div class="logo-wrap" v-if="menuStyle == 'WZC'">
          <img :src="avatarUrl" alt="" />
        </div>
        <div class="system-name">
          {{ systemName || "" }}
        </div>
        <el-divider direction="vertical" />

        <div class="company-name">
          {{ userInfo.COMPANYNAME }}
        </div>

        <!-- <el-button type="info" plain @click="goToWorkbench">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span style="font-size: 12px"> 工作台 </span>
        </el-button>
        <div class="text-s ml10" v-if="ExpiryDate">到期[{{ ExpiryDate }}]</div> -->
      </div>

      <div class="right-menu">
        <div class="setting-wrap">
          <div class="search-wrap">
            <el-select filterable remote placeholder="搜索文档、菜单..." v-model="mkeyword" :remote-method="remoteMethod">
              <el-option v-for="item in MenuOptions" :key="item.BILLNO" :label="item.NAME" :value="item.BILLNO" />
            </el-select>
          </div>

          <el-dropdown size="large" trigger="click">
            <el-icon style="color:#999;font-size:20px;margin-left:10px" v-if="CustomerTel">
              <Phone />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{CustomerTel}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <div class="quetion-wrap">
            <el-dropdown size="large" trigger="click">
              <div class="icon-btn" v-if="systemConfig?.systemCode == 'ZLZHWL'">
                <i class="vxe-icon-question-circle el-icon"></i>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="clickHelp">帮助</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- <div class="icon-btn">
              <i class="vxe-icon-question-circle el-icon"></i>
            </div> -->

            <!-- <div class="icon-btn down-btn">
              <el-icon>
                <Iphone />
              </el-icon>
              <span> APP下载 </span>
            </div> -->
            <el-badge class="icon-btn notice" :value="noticeLength=='0'?'':noticeLength" :min="1" :max="99" @click="opneDrawerNotice">
              <i class="vxe-icon-bell el-icon"></i>
            </el-badge>

            <div class="icon-btn" @click="openWorkflow" v-if="hasWorkFlow">
              <el-icon>
                <FolderChecked />
              </el-icon>
              <div class="red-flag" v-if="hasWorkFlowNUM > 0">
                {{ hasWorkFlowNUM }}
              </div>
            </div>
          </div>

          <div class="avatar-container">
            <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click" size="def">
              <div class="avatar-wrapper">
                <avatar :avatar="userAvatar" :name="username" />
                <div class="user-wrap">
                  <div class="user-text">
                    {{ username }}
                  </div>
                  <div class="user-role">
                    {{ userInfo.ROLENAME }}
                  </div>
                </div>
                <el-icon :size="18" color="#666">
                  <CaretBottom />
                </el-icon>
              </div>

              <template #dropdown>
                <el-dropdown-menu style="width: 300px">
                  <div class="userinfo-wrap">
                    <span class="user-name">{{ username }}</span>
                    <router-link to="/user/profile">
                      <el-button>编辑</el-button>
                    </router-link>
                  </div>

                  <!-- <router-link to="/user/profile">
                      <el-dropdown-item><el-icon><Odometer /></el-icon>个人信息</el-dropdown-item>
                    </router-link> -->
                  <el-dropdown-item command="setLayout">
                    <el-icon>
                      <Setting />
                    </el-icon><span>界面设置</span>
                  </el-dropdown-item>

                  <el-dropdown-item command="clearIndexDB">
                    <el-icon>
                      <Delete />
                    </el-icon><span>清空缓存</span>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <el-popover placement="right" :width="200" trigger="hover">
                      <template #reference>
                        <div class="role-selcet">
                          <el-icon>
                            <Connection />
                          </el-icon><span>切换角色</span>
                        </div>
                      </template>
                      <template #default>
                        <div class="role-wrap">
                          <div class="role-item" v-for="item in RoleList" :key="item.BILLNO" @click="activeRoleEvent(item)">
                            <el-avatar :size="25" :src="circleUrl" />
                            <span class="role-name">
                              {{ item.VNAME }}
                            </span>
                            <el-icon class="choose" v-if="
                                item.ISDEFAULT == 1 ||
                                activeRole.BILLNO == item.BILLNO
                              ">
                              <SuccessFilled />
                            </el-icon>
                          </div>
                        </div>
                      </template>
                    </el-popover>
                  </el-dropdown-item>

                  <!-- <el-dropdown-item command="downExe">
                    <el-icon>
                      <SoldOut />
                    </el-icon><span>插件下载</span>
                  </el-dropdown-item> -->

                  <router-link to="/PLAT_YW/versions/manual">
                    <el-dropdown-item>
                      <el-icon>
                        <Calendar />
                      </el-icon>
                      <span>更新日志</span>
                    </el-dropdown-item>
                  </router-link>

                  <router-link to="/PLAT_YW/help/wtzsk">
                    <el-dropdown-item>
                      <el-icon>
                        <Service />
                      </el-icon>
                      <span>帮助中心</span>
                    </el-dropdown-item>
                  </router-link>

                  <!-- <el-dropdown-item command="setLayout">
                    <el-icon>
                      <Service /> </el-icon
                    ><span>帮助中心</span>
                  </el-dropdown-item> -->
                  <!-- <el-dropdown-item command="register">
                    <div class="flex-wb">
                      <div>
                        <el-icon>
                          <Finished />
                        </el-icon>
                        <span> 账户将于{{ ExpiryDate }}到期 </span>
                      </div>
                      <el-button link>注册</el-button>
                    </div>
                  </el-dropdown-item> -->

                  <el-dropdown-item divided command="logout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <vxe-modal destroy-on-close v-model="visibleDown" :width="500" :height="400" id="reportModal" title="插件下载" resize storage transfer show-zoom show-footer>
      <div class="down-wrap">
        <div class="down-item" v-for="item in downList" :key="item.class">
          <div class="item-left">
            <el-icon>
              <SoldOut />
            </el-icon>
            {{ item.name }}
          </div>
          <div class="item-btn">
            <el-button size="small" @click="downEvent(item)">
              {{ item.type == "manual" ? "打开" : "下载" }}
            </el-button>
          </div>
        </div>
      </div>
    </vxe-modal>

    <vxe-modal destroy-on-close v-model="visibleRegister" :width="500" :height="400" id="reportModal" title="软件注册" resize storage transfer show-zoom show-footer @confirm="submitForm">
      <div>
        <Form ref="formRefDetail" :formData="formConfig.formValue" :formConfig="formConfig.formColumns" :rules="{}" @select="formSelect" />
      </div>
    </vxe-modal>
  </div>
</template>

<script setup>
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
import useWorkflowStore from "@/store/modules/workflow";
import { ElMessageBox, ElMessage } from "element-plus";
import { saveSoftware, queryMenu, setRole, getRole } from "#/common";
import { setToken } from "@/utils/auth";
import localforage from "localforage";

const props = defineProps({
  noticeLength: Number,
});
// const { noticeLength } = toRefs(props);
// 暗黑模式
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark();
const toggleDark = useToggle(isDark);

const mkeyword = ref("");
const MenuOptions = ref([]);
const router = useRouter();

const { proxy } = getCurrentInstance();
import { getFormRule, getFormValue, deepClone } from "@/utils";
import { computed } from "vue";
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const WorkflowStore = useWorkflowStore();
// WorkflowStore.getWaitDo()

const visibleDown = ref(false);
const visibleRegister = ref(false);
const visibleRoel = ref(false);

const RoleList = ref([]);

const topMenuRouters = computed(() => {
  return permissionStore.topMenu;
});

const username = computed(() => userStore.name);
const userInfo = computed(() => userStore.userInfo);
const userAvatar = computed(() => userStore.avatar);
// const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const systemConfig = computed(() => settingsStore.systemConfig);
const menuStyle = computed(() => settingsStore.menuStyle);
const CustomerTel = computed(
  () => settingsStore.systemConfig?.CustomerTel || ""
);
const hasWorkFlow = computed(
  () => settingsStore.systemConfig?.hasWorkFlow == "1"
);
const hasWorkFlowNUM = computed(() => WorkflowStore.waitDoNum);
const topNav = computed(() => settingsStore.topNav);
const systemName = computed(() => systemConfig.value.title);
const avatarUrl = computed(() => {
  let newlogo = systemConfig.value.logo;
  avatarUrl.value = newlogo.includes("http")
    ? newlogo
    : systemConfig.value.baseUrl + newlogo;
  return newlogo;
});

const downList = [
  { name: "身份证读卡工具", class: "black", type: "IDCARD" },
  { name: "射频卡读卡工具", class: "red", type: "IDCARD" },
  { name: "报表工具", class: "blues", type: "IDCARD" },
  { name: "操作手册", class: "blues", type: "manual" },
];

const circleUrl = ref(
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
);

const clickHelp = () => {
  window.open("https://lazhiyun.com:8086/help/default.html");
};

// 系统顶部左侧logo
// const avatarUrl = ref();
// if (systemConfig.value && systemConfig.value.baseUrl) {
//   let newlogo = systemConfig.value.logo;
//   avatarUrl.value = newlogo.includes("http")
//     ? newlogo
//     : systemConfig.value.baseUrl + newlogo;
//   systemName.value = systemConfig.value.title || "-";
// }

const goToWorkbench = () => {
  router.push("/Portal");
};

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
const systemlogo = proxy.getAssetsFile("scm/menu/logo_2.png");

const emits = defineEmits(["setLayout", "openNotice"]);
function setLayout() {
  emits("setLayout");
}

const registerForm = [
  {
    COL: "24",
    CONTROLS: "ExTextBox",
    FIELD: "CCNAME",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "公司名称",
    ISDISABLED: 1,
    OTHER: "",
    point: "",
    RULES: "",
    DEFAULTVAL: "",
  },
  {
    COL: "24",
    CONTROLS: "ExTextBox",
    FIELD: "BILLNO",
    ISSHOW: "1",
    ISDISABLED: 1,
    ISREQUIRE: "1",
    LABEL: "机器码",
    OTHER: "",
    point: "",
    RULES: "",
    DEFAULTVAL: "",
  },
  {
    COL: "24",
    CONTROLS: "ExTextarea",
    FIELD: "LICENSEINFO",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "注册码",
    OTHER: "",
    point: "",
    RULES: "",
  },
];

// 控制一级菜单是否折叠
const isCollapse = ref(false);
function openIsCollapse() {
  // 暂时移除
  isCollapse.value = !isCollapse.value;
  settingsStore.setIsCollapse(isCollapse.value);
}

const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: registerForm, // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "ADD", // DTL ADD
  buttonList: [], // 表单中的按钮
});

formConfig.formValue = getFormValue(formConfig.formColumns);
formConfig.formValue.BILLNO = userStore.systemInfo.REGISTRANO;
formConfig.formValue.CCNAME = userStore.systemInfo.REGISTRACOMPANY;

const ExpiryDate = ref(userStore.systemInfo.REGISTRAEXPIREDDATE);

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/Portal";
      });
    })
    .catch(() => { });
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    case "downExe":
      visibleDown.value = true;
      break;
    case "register":
      visibleRegister.value = true;
      break;
    case "clearIndexDB":
      localforage.clear();
      setTimeout(() => {
        location.reload();
      }, 20);
    default:
      break;
  }
}

//  获取角色 信息
const setRoleEvent = () => {
  getRole().then((res) => {
    RoleList.value = res.RESULT;
  });
};
setRoleEvent();

const activeRole = ref("");
const activeRoleEvent = (item) => {
  activeRole.value = item.BILLNO;
  visibleRoel.value = false;
  saveRoleEvent();
};

const saveRoleEvent = () => {
  setRole({ BILLNO: activeRole.value }).then((res) => {
    let { ACCESS_TOKEN } = res.RESULT;
    setToken(ACCESS_TOKEN);
    ElMessage({
      message: "保存成功",
      type: "success",
    });

    router.push("/Portal");
    setTimeout(() => {
      location.reload();
    }, 20);
  });
};

// 角色设置 end

function downEvent(item) {
  let id = item.type;
  if (id == "manual") {
    window.open(
      "http://139.9.245.83:8103/Content/images/login/%e5%b9%b3%e5%8f%b0%e6%93%8d%e4%bd%9c%e6%89%8b%e5%86%8c.pdf",
      "_blank"
    );
  } else {
    window.location.href =
      "http://139.9.245.83:8103/grinstall/%E8%BA%AB%E4%BB%BD%E8%AF%81%E8%AF%BB%E5%8F%96%E6%B5%8B%E8%AF%95.zip";
  }
}

function submitForm() {
  let saveData = {
    BILLNO: formConfig.formValue.BILLNO,
    LICENSEINFO: formConfig.formValue.LICENSEINFO,
  };

  saveSoftware(saveData).then((res) => {
    ElMessage({
      message: "保存成功",
      type: "success",
    });
    ExpiryDate.value = res.RESULT.EXPIRED_DATE;
    userStore.setExpiryDate(res.RESULT.EXPIRED_DATE);
  });
}

const remoteMethod = (key) => {
  if (!key) {
    let kk = MenuOptions.value.filter((i) => {
      return i.BILLNO == mkeyword.value;
    });
    let mPath = kk.length ? kk[0].VURL : "";
    if (!mPath) return;
    router.push({
      path: "/" + mPath,
    });
    return;
  }

  queryMenu({ KEYWORD: key }).then((res) => {
    MenuOptions.value = res.RESULT;
  });
};

const opneDrawerNotice = () => {
  emits("openNotice");
};
const openWorkflow = () => {
  router.push("/Approval/waitDo");
};

const scaleValue = inject("scaleValue");

let topMenuHeight = 72;
topMenuHeight = computed(() => Math.floor(72 * scaleValue.value) + "px");
</script>

<style lang="scss" scoped>
.top-menu-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;

  .collapse-btn {
    width: 120px;
    height: 100%;
    background-color: var(--el-color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .system-title {
    display: flex;
    width: 100%;
    padding-left: 10px;
    align-items: center;
    .logo-wrap {
      img {
        width: 32px;
        height: 32px;
      }
      margin-right: 10px;
    }
    .tag-version {
      margin: 0 8px;
      background-color: rgba($color: #fff, $alpha: 0.3);
      color: yellow;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .system-name {
      white-space: nowrap;
      font-weight: 600;
      color: #112951;
    }
    img {
      max-height: 50px;
    }
  }
  .right-menu {
    // flex-grow: 1;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // background: blue;
    :deep(.el-menu--horizontal) {
      justify-content: flex-end;
      width: 100%;
      min-width: 100px;
    }
    .setting-wrap {
      padding: 0 10px;
      cursor: pointer;
      min-width: 100px;
      display: flex;
      align-items: center;
      .quetion-wrap {
        display: flex;
        margin: 0 10px;
        .down-btn {
          width: 100px !important;
          span {
            color: #999 !important;
            font-size: 14px;
            position: relative;
            top: -4px;
          }
        }
        .icon-btn {
          width: 32px;
          height: 32px;
          text-align: center;
          margin-right: 10px;
          border-radius: 4px;
          position: relative;
          user-select: none;
          cursor: pointer;
          .red-flag {
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 20px;
            position: absolute;
            top: -4px;
            right: -1px;
            background-color: #ff7461;
            font-size: 10px;
            color: #fff;
          }
          .el-icon {
            margin-top: 5px;
            color: #999;
            font-size: 20px;
          }
          &:hover {
            background-color: var(--el-color-primary-light-9);
            .el-icon {
              color: var(--el-color-primary) !important;
            }
          }
        }
      }
    }
  }
  .menu {
    width: 100%;
    height: 50px;
    :deep(.el-sub-menu) {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .logo {
      height: 50px;
    }
  }

  .el-divider--horizontal {
    margin: 6px 0;
  }
}
.avatar-container {
  min-width: 115px;
  // max-width: 115px;
  max-width: 142px;
}
.avatar-wrapper {
  // max-width: 110px;
  // display: flex;
  // align-items: center;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // overflow: hidden;
  // padding-right: 15px;
  // width: 30px;
  height: 30px;
  border-radius: 30px;
  text-align: center;
  overflow: hidden;
  color: #333;
  display: flex;
  img {
    width: 100%;
    height: 100%;
  }
  .user-wrap {
    text-align: left;
    margin-left: 10px;
  }
  .user-text {
    font-weight: 600;
    text-align: center;
  }
  .user-role {
    padding: 2px 4px;
    font-size: 8px;
    font-weight: 500;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}
.username {
  color: #fff;
  font-size: 12px;
}

.userinfo-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  .user-name {
    font-size: 18px;
  }
}
.flex-wb {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.down-wrap {
  width: 400px;
  border: 1px solid #ddd;
  margin: 0 auto;
  .down-item {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }
}

.role-wrap {
  display: flex;
  justify-content: center;
  flex-direction: column;
  .role-item {
    padding: 10px 0;
    display: flex;
    align-items: center;
    // border: 1px solid #f5f5f5;
    cursor: pointer;
    position: relative;
    .choose {
      position: absolute;
      right: 2px;
      top: 15px;
      color: var(--el-color-primary);
    }
    .role-name {
      margin-left: 10px;
    }
  }
}

.notice {
  :deep(.el-badge__content.is-fixed) {
    right: 15px;
  }
}
</style>
