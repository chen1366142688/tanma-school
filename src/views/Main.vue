<style lang="less">
@import "./main.less";
</style>

<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div
      class="sidebar-menu-con"
      :style="{width: shrink?'90px':'250px', overflow: shrink ? 'visible' : 'auto'}"
    >
      <shrinkable-menu
        ref="shrinkable"
        :shrink="shrink"
        :menu-list="menuList"
        :open-names="openNames"
      >
        <div
          slot="top"
          :class="schoolName.length<10?'logo-con':'logo-con-more'"
          style="background-color: white;"
        >
          <!-- <img v-show="!shrink" src="../images/index_timo.png" key="max-logo" /> -->
          <img src="../images/schoolLogo.png" class="min-logo" />
          <div class="schoolName-tit">{{schoolName}}</div>
          <!-- <img src="../images/logo.png" alt="小马健康logo" class="min-logo">
          <div  class="schoolName-tit">小马健康</div>-->
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'90px':'250px'}">
      <div class="main-header">
        <div class="navicon-con">
          <topMenu
            ref="tpoMenu"
            :menu-list="menuListAll"
            :theme1="theme1"
            @on-click="handleChange"
            @on-change="handleOpenNames"
          ></topMenu>
        </div>
        <div class="header-avator-con">
          <font
            v-if="isTest"
            style="color:red;font-size:30px;position:absolute;top:7px;left:-147px"
          >测试环境</font>
          <div class="nowTimes">
            <p>
              <strong>
                {{semesterStatus == 1 ? '第一学期' : semesterStatus == 2 ? '寒假' : semesterStatus == 3 ? '第二学期' : '暑假'}}
                <span
                  v-if="semesterStatus == 1 || semesterStatus == 3"
                >第{{weekCount}}周 星期{{weekDay}}</span>
              </strong>
            </p>
            <p>{{nowTime}}</p>
          </div>
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="md-arrow-dropdown" />
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-if="loginSchoolList && loginSchoolList.length > 1"
                    :name="item.relationSchoolId"
                    v-for="(item,index) in loginSchoolList"
                    :key="index"
                    divided
                    style="margin-top:0px"
                    :selected="schoolName===item.relationSchoolName"
                  >{{item.relationSchoolName}}</DropdownItem>
                  <DropdownItem name="loginout" divided style="margin-top:0px">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!-- <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/> -->
              <Avatar
                :src="avatarUrl"
                icon="person"
                style="background: #619fe7;margin-left:10px;border: 1px #9ea7b4 solid;"
              ></Avatar>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'90px':'250px'}">
      <!-- 待办事项浮窗 -->
      <div class="glob-message">
        <div class="circle" @click="clickShowMessage" v-if="messageList.length && messageList.length > 0">待办 <br> 事项</div>
        <div class="message-box" v-if="showMessageBox">
          <div>
            <div class="message-box-title">
              <img src="../images/icon_horn.png" alt="" class="icon_horn" v-if="messageList[pageIndex].noticeType == 2">
              <img src="../images/icon_submit.png" alt="" class="icon_horn" v-else>
              <span>{{messageList[pageIndex].noticeType == 1 ? '数据报送' : '通知公告'}}</span>
            </div>
            <div class="message-box-content">
              <div>{{messageList[pageIndex].noticeContent}}</div>
              <div class="time">截止时间：{{messageList[pageIndex].endTime}}</div>
            </div>
            <div class="message-box-footer">
              <div class="shouqi" @click="cancelMessageBox">
                <span>收起</span>
                <img src="../images/icon_arrow_top.png" alt="" class="icon_arrow_top">
              </div>
              <Page :current="pageIndex+1"  :total="pageTotal*10" simple @on-change="changeMessage"/>
            </div>
          </div>
        </div>
      </div>
      <div class="single-page">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import topMenu from "./main-components/shrinkable-menu/components/topMenu.vue";
import axios from "axios";
import Fullscreen from "../components/main/fullscreen";
export default {
  components: {
    shrinkableMenu,
    topMenu,
    Fullscreen,
  },
  data() {
    return {
      schoolLogo: "../images/index_timo.png",
      schoolName: "",
      shrink: false,
      userName: "",
      phoneNo: "",
      operationCode: "",
      avatarUrl: "",
      nowTime: "",
      isTest: false,
      theme1: "light",
      openNames: [],
      loginSchoolList: [],
      weekCount: "",
      semesterStatus: "",
      weekDay: "",
      isFullscreen: false,
      showMessageBox: false,
      messageList: [
      ],
      pageIndex:0,
      pageTotal:3
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    menuListAll() {
      return this.itemvalue(this.$store.state.app.menuListAll);
    },
  },
  methods: {
    getMessageList () {
      this.$axios.get('/v1/education/queryEducationInfoList').then(res => {
        if (res.data.code === 10000) {
          let result = res.data.response
          if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              let item = result[i]
              item.endTime = item.endTime.split('.')[0]
            }
            let lastNoticeId = Number(sessionStorage.getItem('lastNoticeId'))
            if (lastNoticeId) { // 从缓存中取出noticeId
              if (result[result.length -1].noticeId > lastNoticeId) { // 如果最新的noticeId大于缓存中的noticeId则说明有消息
                this.showMessageBox = true
              }
            }
            sessionStorage.setItem('lastNoticeId', result[result.length -1].noticeId)
            this.messageList = result
            this.pageTotal = res.data.response.length
            if (sessionStorage.getItem('showMessageBox')) { // 如果检测到是第一次登陆进来显示消息
              this.showMessageBox = true
            }
          }
        }
      })
    },
    changeMessage (e) {
      this.pageIndex = e-1
    },
    cancelMessageBox () {
      this.showMessageBox = false
      sessionStorage.removeItem('showMessageBox')
    },
    clickShowMessage () {
      this.showMessageBox = true
    },
    handleChange(name) {
      this.$refs.shrinkable.handleChange(name);
    },
    handleOpenNames(name) {
      this.openNames = [name];
    },
    itemvalue(list) {
      let newList = [];
      for (let val of list) {
        newList.push({
          parentCode: val.parentCode,
          parentName: val.parentName,
          name: val.name,
          parentIcon: val.parentIcon,
        });
      }
      return this.unique(newList);
    },
    unique(person) {
      let obj = {};
      let peon = person.reduce((cur, next) => {
        obj[next.parentCode]
          ? ""
          : (obj[next.parentCode] = true && cur.push(next));
        return cur;
      }, []);
      return peon;
    },
    init() {
      this.userName = sessionStorage.getItem("name");
      if (this.userName == "") {
        this.handleClickUserDropdown(this.userName);
      }
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleClickUserDropdown(name) {
      if (name != "loginout") {
        let thisSchoolId = sessionStorage.getItem("schoolId");
        if (thisSchoolId == name) {
          return false;
        } else {
          this.$Spin.show({
            render: (h) => {
              return h("div", [
                h("Icon", {
                  class: "demo-spin-icon-load",
                  props: {
                    type: "ios-loading",
                    size: 18,
                  },
                }),
                h("div", "切换中"),
              ]);
            },
          });
          let token = sessionStorage.getItem("token");
          sessionStorage.clear();
          sessionStorage.clear();
          sessionStorage.setItem("token", token);
          this.loginByToken(name);
        }
      }
      if (name == "loginout") {
        sessionStorage.setItem("token", "");
        sessionStorage.setItem("phoneNo", "");
        sessionStorage.setItem("teacherId", "");
        sessionStorage.setItem("schoolId", "");
        sessionStorage.setItem("name", "");
        sessionStorage.setItem("avatarUrl", "");
        sessionStorage.setItem("menuList", "");
        sessionStorage.setItem("schoolName", "");
        sessionStorage.setItem("schoolType", "");
        sessionStorage.setItem("selectedName", "");
        sessionStorage.clear();
        sessionStorage.clear();
        this.$router.push({
          name: "login",
        });
      }
    },
    showTime() {
      var myDate = new Date();
      this.nowTime =
        myDate.getFullYear() +
        "-" +
        (myDate.getMonth() + 1 < 10
          ? "0" + (myDate.getMonth() + 1)
          : myDate.getMonth() + 1) +
        "-" +
        (myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()) +
        " " +
        (myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()) +
        ":" +
        (myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()) +
        ":" +
        (myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds());
      setTimeout(() => {
        this.showTime();
      }, 1000);
    },
    loginByToken(schoolId) {
      let this_ = this;
      let token = sessionStorage.getItem("token");
      this_.$axios.defaults.headers.common["token"] = token;
      if (token != null && token != "") {
        this.$axios
          .get(
            "/v1/auth/login/token?token=" +
              token +
              "&schoolId=" +
              schoolId +
              "&schoolType=" +
              "2"
          )
          .then(function (res) {
            if (res.data.code != 10000) {
              this_.$Message.error(res.data.msg);
              this_.$Spin.hide();
              this_.$router.push({
                name: "login",
              });
            } else {
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
              sessionStorage.setItem("isAdmin", response.isAdmin);
              sessionStorage.setItem("yearSemester", response.yearSemester);
              sessionStorage.setItem("semesterOver", response.semesterOver);
              sessionStorage.setItem("schoolYear", response.schoolYear);
              sessionStorage.setItem("semesterStatus", response.semesterStatus);
              sessionStorage.setItem("weekCount", response.weekCount);
              sessionStorage.setItem("single", response.single);
              sessionStorage.setItem("schoolDistrict", response.schoolDistrict);
              this_.userName = response.name;
              this_.phoneNo = response.phoneNo;
              this_.operationCode = response.operationCode;
              this_.avatarUrl = response.avatarUrl;
              this_.schoolName = response.schoolName;
              if (sessionStorage.getItem("selectedName") == null) {
                if (sessionStorage.getItem("schoolType") == 6) {
                  sessionStorage.setItem(
                    "selectedName",
                    "top_data-dataMonitoring"
                  );
                }
                this_.$store.commit("updateMenulist");
                this_.$store.commit("setStateName", "");
                this_.$store.commit("modifyMnueList", "");
                this_.$router.push({
                  name: this_.$store.state.app.menuList[0].children[0].name,
                });
                this_.handleOpenNames(
                  this_.$store.state.app.menuList[0].children[0].name
                );
                this_.handleChange(
                  this_.$store.state.app.menuList[0].children[0].name
                );
              }
              if (schoolId != null && schoolId > 0) {
                this_.$Spin.hide();
              }
            }
          })
          .catch(function (error) {
            this_.$Spin.hide();
            this_.$router.push({
              name: "login",
            });
          });
      } else {
        this_.$Spin.hide();
        this_.$router.push({
          name: "login",
        });
      }
    },
    queryLoginSchoolList() {
      let this_ = this;
      let token = sessionStorage.getItem("token");
      this_.$axios.defaults.headers.common["token"] = token;
      if (token != null && token != "") {
        this.$axios
          .get("/v1/auth/query/login/school/list?token=" + token)
          .then(function (res) {
            if (res.data.code == 10000) {
              this_.loginSchoolList = [];
              for (let i = 0; i < res.data.response.length; i++) {
                if (
                  res.data.response[i].relationSchoolId !=
                  sessionStorage.getItem("schoolId")
                ) {
                  this_.loginSchoolList.push(res.data.response[i]);
                } else {
                  this_.loginSchoolList.push(res.data.response[i]);
                }
              }
            }
          })
          .catch(function (error) {});
      } else {
      }
    },
  },
  created() {
    this.getMessageList()
  },
  mounted() {
    this.$parent.getSchoolWasNotice();
    this.$store.commit("updateMenulist");
    this.schoolLogo = sessionStorage.getItem("schoolLogo");
    this.weekCount = sessionStorage.getItem("weekCount"); // 当前周数
    this.semesterStatus = sessionStorage.getItem("semesterStatus"); // 当前学期
    this.weekDay = "日一二三四五六".charAt(new Date().getDay());
    this.showTime();
    this.queryLoginSchoolList();
    if (this.menuList && this.menuList.length > 0) {
      this.loginByToken(0);
    } else {
      this.$refs.shrinkable.handleChange("semesterStandard");
    }
  },
};
</script>
