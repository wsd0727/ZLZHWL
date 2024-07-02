<template>
  <div class="app-container">
    <el-row :gutter="4">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div style="left-user">
            <div class="text-center">
              <userAvatar />
            </div>
            <div class="left-userText">
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  <!-- 用户名称 -->
                  <!-- <svg-icon icon-class="user" /> -->
                  <el-icon :size="16">
                    <User />
                  </el-icon>
                  <div class="left-text">{{ user.VNAME }}</div>
                </li>
                <li class="list-group-item">
                  <!-- 手机号码 -->
                  <svg-icon icon-class="phone" />
                  <div class="left-text">{{ user.MOBILE }}</div>
                </li>

                <!-- 所属角色 -->
                <!-- <svg-icon icon-class="peoples" /> -->
                <li class="list-group-item">
                  <el-icon>
                    <Discount />
                  </el-icon>
                  <div class="left-text">
                    {{ user.ROLENAME }}
                  </div>
                </li>
                <!-- <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="left-text">{{ user.email }}</div>
              </li> -->
                <li class="list-group-item">
                  <el-icon>
                    <OfficeBuilding />
                  </el-icon>
                  <div class="left-text">
                    {{ user.COMPANYNAME }}
                  </div>
                </li>
                <!-- <li class="list-group-item">
                  <svg-icon icon-class="tree" />
                  <div class="left-text">
                    {{ user.DEPTNAME }}
                  </div>
                </li> -->
                
                <!-- 注册日期 -->
                <li class="list-group-item">
                  <svg-icon icon-class="date" />
                  <div class="left-text">{{ user.CREATIONTIME }}</div>
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <!-- <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane> -->
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
console.log(user.value);
const activeTab = ref("resetPwd");
const state = reactive({
  roleGroup: {},
  postGroup: {},
});
</script>
<style lang="scss" scoped>
.app-container {
  padding: 4px 1px 0px 1px;
  width: 100%;
  background: #fff;
  overflow: hidden;
  .list-group {
    margin-top: 40px;
    .list-group-item {
      line-height: 30px;
      .el-icon {
        position: relative;
        top: 12px;
        font-size: 16px;
        left: 3px;
      }
      .svg-icon {
        position: relative;
        top: 12px;
        font-size: 16px;
        left: 3px;
      }
      .left-text {
        text-align: left;
        display: inline-block;
        position: relative;
        top: 10px;
        left: 15px;
      }
    }
  }
}
.box-card {
  min-height: 87.3vh;
  height: auto;
}
</style>
