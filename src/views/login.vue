<style lang="less">
@import "./login.less";
</style>
<template>
  <div class="login_box" @keydown.enter="handleSubmit">
    <h2 class="login-title" style="font-size:48px;">学校体育与健康管理信息系统</h2>
    <section class="section">
      <div class="form">
        <img class="welcome" src="../images/welcome.png" alt="welcomeLogin" />
        <Form ref="loginForm" :model="form" :rules="rules">
          <div class="userSign">
            <span>{{login?'用户登录':'找回密码'}}</span>
          </div>
          <div class="formData">
            <div v-if="login">
              <FormItem prop="userName" class="login-item">
                <img src="../images/userName.png" alt />
                <Input
                  v-model="form.userName"
                  class="login-name"
                  placeholder="请输入账号"
                  :maxlength="11"
                ></Input>
              </FormItem>
              <FormItem prop="password" class="login-item">
                <img src="../images/password.png" alt />
                <Input
                  v-model="form.password"
                  type="password"
                  class="login-name"
                  placeholder="请输入密码"
                  :minlength="6"
                ></Input>
              </FormItem>
              <FormItem prop="code" class="login-item">
                <img src="../images/code.png" alt />
                <Input v-model="form.code" class="login-names" placeholder="请输入验证码" :maxlength="4"></Input>
                <img class="code-img" @click="changeCode" alt :src="codeUrl" />
                <img class="reload" @click="changeCode" alt src="../images/reload.png" />
              </FormItem>
            </div>
            <div v-if="!login">
              <FormItem prop="userNameAgain" class="login-items">
                <img src="../images/userName.png" alt />
                <Input
                  v-model="form.userNameAgain"
                  class="login-name"
                  placeholder="请输入需找回密码的用户名"
                  :maxlength="11"
                ></Input>
                <div class="sendCode" @click="changePhoneCode" :style="codeStyle">{{codeTxt}}</div>
              </FormItem>
              <FormItem prop="codeAgain" class="login-items">
                <img src="../images/code.png" alt />
                <Input
                  v-model="form.codeAgain"
                  class="login-name"
                  placeholder="请输入验证码"
                  :maxlength="6"
                ></Input>
              </FormItem>
              <FormItem prop="newPassword" class="login-items1">
                <img src="../images/password.png" alt />
                <Input
                  v-model="form.newPassword"
                  class="login-name"
                  type="password"
                  placeholder="请输入新密码"
                  :minlength="6"
                ></Input>
                <span>密码至少6位,包含字母和数字</span>
              </FormItem>
              <FormItem prop="passWordAgain" class="login-items1">
                <img src="../images/password.png" alt />
                <Input
                  v-model="form.passWordAgain"
                  class="login-name"
                  type="password"
                  placeholder="请再次输入新密码"
                  :minlength="6"
                ></Input>
              </FormItem>
            </div>
            <div class="sCode">
              <img src="../images/sCode.png" alt="二维码" />
              <div class="goWechart">微信扫一扫</div>
              <div class="goWechart">进入教师移动端</div>
            </div>
          </div>
          <div class="Forget">
            <span @click="forgetThePwd">{{login?'忘记密码？':'返回登录'}}</span>
          </div>
          <FormItem class="login-check">
            <Button class="login-button" @click="handleSubmit" type="success" long v-if="login">登 录</Button>
            <Button
              class="login-button"
              @click="handleSubmitForget"
              type="success"
              long
              v-else
              style="margin-top:25px"
            >登 录</Button>
          </FormItem>
        </Form>
      </div>
    </section>
    <footer style="font-size：16px;z-index:1">
      <span>技术支持：400-666-1816</span>
      <span>copyright© 2019 TMNETWORK</span>
      <div>
        <span>( 推荐浏览器：谷歌浏览器Google Chrome | 推荐分辨率：1920*1080 )</span>
      </div>
    </footer>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    const userNameCheck = (rule, value, callback) => {
      let str = value;
      let regExps = new RegExp(/^1[34578]\d{9}$/);
      if (str == null || str.length < 11) {
        callback(new Error("手机号不能少于11位"));
      } else if (!regExps.test(this.form.userNameAgain)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    const pwdCheck = (rule, value, callback) => {
      let str = value;
      let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
      if (str == null || str.length < 6) {
        callback(new Error("密码至少6位,同时包含字母和数字"));
      } else if (!reg.test(str)) {
        callback(new Error("密码至少6位,同时包含字母和数字"));
      } else {
        callback();
      }
    };
    const pwdCheckValidate = (rule, value, callback) => {
      let str = value;
      if (str == null || str.length < 6) {
        callback(new Error("密码至少6位,同时包含字母和数字"));
      } else if (this.form.newPassword != this.form.passWordAgain) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      schoolType: 2,
      login: true,
      countdown: 60,
      codeTxt: "发送验证码",
      isShowPng: true,
      codeStyle: {
        background: "#2DB394",
      },
      form: {
        userName: "",
        password: "",
        code: "",
        userNameAgain: "",
        codeAgain: "",
        newPassword: "",
        passWordAgain: "",
      },
      codeUrl: "",
      userCode: "",
      rules: {
        userName: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        ],
        userNameAgain: [
          {
            required: true,
            validator: userNameCheck,
            trigger: "blur",
          },
        ],
        codeAgain: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            validator: pwdCheck,
            trigger: "blur",
          },
        ],
        passWordAgain: [
          {
            required: true,
            validator: pwdCheckValidate,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmitForget() {
      let _this = this;
      _this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let password = md5(_this.form.passWordAgain);
          let userData = {
            code: _this.form.codeAgain,
            passWord: password,
            phoneNum: _this.form.userNameAgain,
            teacherId: "",
            schoolType: this.schoolType,
          };
          sessionStorage.setItem("token", "");
          sessionStorage.setItem("phoneNo", "");
          sessionStorage.setItem("teacherId", "");
          sessionStorage.setItem("schoolId", "");
          sessionStorage.setItem("name", "");
          sessionStorage.setItem("avatarUrl", "");
          sessionStorage.setItem("menuList", "");
          sessionStorage.setItem("schoolName", "");
          sessionStorage.setItem("schoolType", "");
          sessionStorage.setItem("schoolDistrict", "");
          sessionStorage.setItem("isAdmin", "");
          _this.$axios
            .post("/v1/auth/update/pass/word", userData)
            .then(function (res) {
              _this.$Message.destroy();
              if (res.data.code == 10000) {
                let response = res.data.response;
                _this.$axios.defaults.headers.common["token"] =
                  response.oAuthTokenVO.token;
                sessionStorage.setItem("token", response.oAuthTokenVO.token);
                sessionStorage.setItem("phoneNo", response.phoneNum);
                sessionStorage.setItem("teacherId", response.teacherId);
                sessionStorage.setItem("schoolId", response.schoolId);
                sessionStorage.setItem("name", response.name);
                sessionStorage.setItem("avatarUrl", response.avatarUrl);
                sessionStorage.setItem("menuList", response.menuList);
                sessionStorage.setItem("schoolName", response.schoolName);
                sessionStorage.setItem("schoolType", response.schoolType);
                sessionStorage.setItem("isAdmin", response.isAdmin);
                sessionStorage.setItem(
                  "schoolDistrict",
                  response.schoolDistrict
                );
                _this.$store.commit("updateMenulist");
                _this.$store.commit("setStateName", "");
                _this.$store.commit("modifyMnueList", "");
                _this.$router.push({
                  name: "home_index",
                });
                _this.$Message.success("登录成功！");
                _this.$router.push({
                  name: "home_index",
                });
              } else if (res.data.code == 40004) {
                _this.$Message.info("验证码不正确或验证码已过期！");
              } else if (res.data.code == 50003) {
                _this.$Message.info("该账号已失效，请联系管理员！");
              } else {
                _this.$Message.info("账户或者密码错误！");
              }
            });
        } else {
          _this.$Message.error("请填写正确的各项信息");
        }
      });
    },
    handleSubmit() {
      let this_ = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let password = md5(this.form.password);
          let data_ = {
            userPhone: this.form.userName,
            password: password,
            code: this.form.code,
            userCode: this.userCode,
            schoolType: this.schoolType,
            type: "1",
          };
          sessionStorage.setItem("token", "");
          sessionStorage.setItem("phoneNo", "");
          sessionStorage.setItem("teacherId", "");
          sessionStorage.setItem("schoolId", "");
          sessionStorage.setItem("name", "");
          sessionStorage.setItem("avatarUrl", "");
          sessionStorage.setItem("menuList", "");
          sessionStorage.setItem("schoolName", "");
          sessionStorage.setItem("schoolType", "");
          sessionStorage.setItem("schoolDistrict", "");
          sessionStorage.setItem("isAdmin", "");
          sessionStorage.setItem("yearSemester", "");
          sessionStorage.setItem("semesterOver", "");
          sessionStorage.setItem("schoolYear", "");
          sessionStorage.setItem("semesterStatus", "");
          sessionStorage.setItem("weekCount", "");
          sessionStorage.setItem("single", "");
          this.$axios
            .post("/v1/auth/login/password", data_)
            .then(function (res) {
              this_.$Message.destroy();
              if (res.data.code == 10000) {
                let response = res.data.response;
                this_.$axios.defaults.headers.common["token"] =
                  response.oAuthTokenVO.token;
                sessionStorage.setItem("token", response.oAuthTokenVO.token);
                sessionStorage.setItem("phoneNo", response.phoneNum);
                sessionStorage.setItem("teacherId", response.teacherId);
                sessionStorage.setItem("schoolId", response.schoolId);
                sessionStorage.setItem("name", response.name);
                sessionStorage.setItem("avatarUrl", response.avatarUrl);
                sessionStorage.setItem("menuList", response.menuList);
                sessionStorage.setItem("schoolName", response.schoolName);
                sessionStorage.setItem("schoolType", response.schoolType);
                sessionStorage.setItem("weekCount", response.weekCount); // 周数
                sessionStorage.setItem('showMessageBox', true) // 登陆后需要显示待办事项
                sessionStorage.setItem(
                  "semesterStatus",
                  response.semesterStatus
                ); // 当前学期状态 1第一学期 2 寒假 3 第二学期 4 暑假 ,
                sessionStorage.setItem("isAdmin", response.isAdmin);
                sessionStorage.setItem("yearSemester", response.yearSemester);
                sessionStorage.setItem("semesterOver", response.semesterOver);
                sessionStorage.setItem("schoolYear", response.schoolYear);
                sessionStorage.setItem(
                  "semesterStatus",
                  response.semesterStatus
                );
                sessionStorage.setItem("weekCount", response.weekCount);
                sessionStorage.setItem("single", response.single);
                sessionStorage.setItem(
                  "schoolDistrict",
                  response.schoolDistrict
                );
                this_.$store.commit("updateMenulist");
                this_.$store.commit("setStateName", "");
                this_.$store.commit("modifyMnueList", "");
                this_.$router.push({
                  name: "home_index",
                });
                this_.$Message.success("登录成功！");
                this_.$router.push({
                  name: "home_index",
                });
              } else {
                this_.$Message.info(res.data.msg);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
    organLogin(ortanToken, loginSchoolId) {
      let this_ = this;
      sessionStorage.setItem("token", "");
      sessionStorage.setItem("phoneNo", "");
      sessionStorage.setItem("teacherId", "");
      sessionStorage.setItem("schoolId", "");
      sessionStorage.setItem("name", "");
      sessionStorage.setItem("avatarUrl", "");
      sessionStorage.setItem("menuList", "");
      sessionStorage.setItem("schoolName", "");
      sessionStorage.setItem("schoolType", "");
      sessionStorage.setItem("schoolDistrict", "");
      sessionStorage.setItem("isAdmin", "");
      sessionStorage.setItem("yearSemester", "");
      sessionStorage.setItem("semesterOver", "");
      sessionStorage.setItem("schoolYear", "");
      sessionStorage.setItem("semesterStatus", "");
      sessionStorage.setItem("weekCount", "");
      sessionStorage.setItem("single", "");
      this.$axios
        .get(
          "/v1/auth/loginSchoolByOrgantoken?token=" +
            ortanToken +
            "&schoolId=" +
            loginSchoolId
        )
        .then(function (res) {
          this_.$Message.destroy();
          if (res.data.code == 10000) {
            let response = res.data.response;
            this_.$axios.defaults.headers.common["token"] =
              response.oAuthTokenVO.token;
            sessionStorage.setItem("token", response.oAuthTokenVO.token);
            sessionStorage.setItem("phoneNo", response.phoneNum);
            sessionStorage.setItem("teacherId", response.teacherId);
            sessionStorage.setItem("schoolId", response.schoolId);
            sessionStorage.setItem("name", response.name);
            sessionStorage.setItem("avatarUrl", response.avatarUrl);
            sessionStorage.setItem("menuList", response.menuList);
            sessionStorage.setItem("schoolName", response.schoolName);
            sessionStorage.setItem("schoolType", response.schoolType);
            sessionStorage.setItem("weekCount", response.weekCount); // 周数
            sessionStorage.setItem("semesterStatus", response.semesterStatus); // 当前学期状态 1第一学期 2 寒假 3 第二学期 4 暑假 ,
            sessionStorage.setItem("isAdmin", response.isAdmin);
            sessionStorage.setItem("yearSemester", response.yearSemester);
            sessionStorage.setItem("semesterOver", response.semesterOver);
            sessionStorage.setItem("schoolYear", response.schoolYear);
            sessionStorage.setItem("semesterStatus", response.semesterStatus);
            sessionStorage.setItem("weekCount", response.weekCount);
            sessionStorage.setItem("single", response.single);
            sessionStorage.setItem("schoolDistrict", response.schoolDistrict);
            this_.$store.commit("updateMenulist");
            this_.$store.commit("setStateName", "");
            this_.$store.commit("modifyMnueList", "");
            this_.$router.push({
              name: "home_index",
            });
            this_.$Message.success("登录成功！");
            this_.$router.push({
              name: "home_index",
            });
          } else {
            this_.$Message.info(res.data.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    changeCode() {
      var myDate = new Date();
      this.userCode = myDate.getTime();
      this.codeUrl =
        this.$axios.defaults.baseURL +
        "/v1/auth/login/getCheckCode?userCode=" +
        this.userCode;
    },
    changePhoneCode() {
      let _this = this;
      if (_this.countdown < 60) {
        return;
      }
      if (/^1[34578]\d{9}$/.test(_this.form.userNameAgain)) {
        _this.$axios
          .get(
            `/v1/auth/sendSmsForUpdatePassword?phoneNum=${_this.form.userNameAgain}&schoolType=${this.schoolType}`
          )
          .then(function (res) {
            if (res.data.code == 10000) {
              _this.codeStyle.background = "#999999";
              _this.settime(_this);
            } else {
              _this.$Message.error("发送失败，请稍后再试！");
            }
          });
      }
    },
    settime(_this) {
      if (_this.countdown == 0) {
        _this.codeStyle.background = "#2DB394";
        _this.countdown = 60;
        _this.codeTxt = "发送验证码";
        return;
      } else {
        _this.codeTxt = `已发送${_this.countdown}s`;
        _this.countdown--;
      }
      setTimeout(function () {
        _this.settime(_this);
      }, 1000);
    },
    forgetThePwd() {
      let _this = this;
      _this.login = !_this.login;
    },
  },
  mounted() {
    let hrefUrl = window.location.href;
    if (hrefUrl.indexOf("token=") > 0) {
      let organToken = hrefUrl.substring(
        hrefUrl.indexOf("token=") + 6,
        hrefUrl.indexOf("&")
      );
      let loginSchool = hrefUrl.substring(
        hrefUrl.indexOf("schoolid=") + 9,
        hrefUrl.indexOf("key=") - 1
      );
      this.organLogin(organToken, loginSchool);
    }
    this.changeCode();
  },
};
</script>

<style>
.footer_name {
  margin: 16px 0 14px 0;
}
.footer_recommend {
  padding-right: 70px;
}
</style>
