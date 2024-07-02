import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import md5 from "@/utils/md5";

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    systemInfo: {},
    userInfo: null,
    permissions: [],
    showUpdatePassword: false,
  }),
  persist: {
    enabled: true, // 开启存储
  },
  actions: {
    // 登录
    login(userInfo) {
      const saveData = {
        CODE: userInfo.code,
        UUID: userInfo.uuid,
        PASSWORD:   md5.hex_md5(userInfo.password)   ,  //  !userInfo.isMd5 ? md5.hex_md5(userInfo.password) : userInfo.password , // "ce00580d6b3d1e0d7b7b8ec5eab0bc89", // userInfo.password,
        APASSWORD:  ''  ,  // !userInfo.isMd5 ? userInfo.password : 'Mm123456@',
        USERNAME: userInfo.username.trim(),
        LOGINTYPE: userInfo.LOGINTYPE,
        TYPE: "WEB",
        MOBILE: userInfo.mobile,
        USERTYPE: '0'
      };
      return new Promise((resolve, reject) => {
        login(saveData)
          .then((res) => {
            setToken(res.RESULT.ACCESS_TOKEN);
            this.token = res.RESULT.ACCESS_TOKEN;
            let { REGISTRACOMPANY, REGISTRANO, REGISTRAEXPIREDDATE, REGISTRAEXPIREDALERTDATE } = res.RESULT
            this.systemInfo = { REGISTRACOMPANY, REGISTRANO, REGISTRAEXPIREDDATE, REGISTRAEXPIREDALERTDATE }
            resolve();

          })
          .catch((error) => {
            if (error.STATUS == 205) {
              this.showUpdatePassword = true
            } else {
              this.showUpdatePassword = false
            }
            reject(error);

          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then((res) => {
          const user = res.RESULT;
          let avatar = user.AVATAR ?  user.AVATAR : "";
          if( avatar && !avatar.includes('http') && avatar.slice(0,1) !='/'  ){
            avatar = '/' + avatar
          }
          this.roles = ["ROLE_DEFAULT"];
          this.name = user.VNAME;
          this.avatar = avatar;
          this.userInfo = user;
          resolve(res.RESULT);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    cleanUserInfo() {
      console.log('cleanUserInfo');
      this.token = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
    },
    setExpiryDate(date) {
      this.systemInfo.REGISTRAEXPIREDDATE = date
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export default useUserStore;
