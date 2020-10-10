<style>
.systemBaseConfigClass .ivu-form .ivu-form-item-label {
  text-align: left;
  font-size: 15px;
}
.systemBaseConfigClass .ivu-radio-wrapper {
  font-size: 15px;
}
</style>


<template>
  <div class="systemBaseConfigClass" style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">系统标准配置</h2>
    </div>
    <div>
      <Form ref="unirunInfo" :model="unirunInfo" :label-width="150">
        <Card style="margin-bottom:20px;" v-if="false">
          <FormItem label="学期标准配置：" style="margin-bottom:0px;">
            <Row style="margin-top:1px;">
              <Col span="20">
                <Label>学年上学期：</Label>
                <Select
                  v-model="secondSemesterDateStart_month"
                  @on-change="semesterDateEndChange"
                  placeholder="月"
                  style="width:60px"
                >
                  <Option
                    v-for="item in months"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.name }}</Option>
                </Select>月
                <Select v-model="secondSemesterDateStart_day" placeholder="日" style="width:60px">
                  <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>日
                <font style="color:red;">{{showyearS}}</font>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至
                <Select
                  v-model="secondSemesterDateEnd_month"
                  @on-change="semesterDateEndChange"
                  placeholder="月"
                  style="width:60px;margin-left:20px;"
                >
                  <Option
                    v-for="item in months"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.name }}</Option>
                </Select>月
                <Select v-model="secondSemesterDateEnd_day" placeholder="日" style="width:60px">
                  <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>日
                <font style="color:red;">{{showyear}}</font>
              </Col>
            </Row>
            <Row style="margin-top:5px;">
              <Col span="20">
                <Label>学年下学期：</Label>
                <Select v-model="firstSemesterDateStart_month" placeholder="月" style="width:60px">
                  <Option
                    v-for="item in months"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.name }}</Option>
                </Select>月
                <Select v-model="firstSemesterDateStart_day" placeholder="日" style="width:60px">
                  <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>日
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至
                <Select
                  v-model="firstSemesterDateEnd_month"
                  @on-change="semesterDateEndChange"
                  placeholder="月"
                  style="width:60px;margin-left:20px;"
                >
                  <Option
                    v-for="item in months"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.name }}</Option>
                </Select>月
                <Select v-model="firstSemesterDateEnd_day" placeholder="日" style="width:60px">
                  <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>日
              </Col>
            </Row>
          </FormItem>
        </Card>

        <Card style="margin-bottom:20px;" v-if="false">
          <!-- <FormItem label="学期开始日期：" style="margin-bottom:0px;"> -->
            <Row style="margin-top:1px;">
              <Col span="20">
                <span>上课开始日期:</span><Label style="margin-left:20px">学年上学期：</Label>
                <Select v-model="sportsClassSecondStart_month" placeholder="月" style="width:60px">
                  <Option
                    v-for="item in months"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.name }}</Option>
                </Select>月
                <Select v-model="sportsClassSecondStart_day" placeholder="日" style="width:60px">
                  <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>日
                <font style="color:red;">{{showyearS}}</font>
              </Col>
            </Row>
            <Row style="margin-top:5px;">
              <Col span="20">
                <span>上课开始日期:</span><Label style="margin-left:20px">学年下学期：</Label>
                <Select v-model="sportsClassFirstStart_month" placeholder="月" style="width:60px">
                  <Option
                    v-for="item in months"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.name }}</Option>
                </Select>月
                <Select v-model="sportsClassFirstStart_day" placeholder="日" style="width:60px">
                  <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>日
              </Col>
            </Row>
          <!-- </FormItem> -->
        </Card>

        <Card style="margin-bottom:20px;">
          <FormItem label="学校教学模式：" style="margin-bottom:0px;">
            <Row style="margin-top:1px;">
              <Col span="20">
                <RadioGroup v-model="sportsType" @on-change="sportsTypeChange">
                  <Radio label="模块化教学"></Radio>
                  <Radio label="非模块化教学"></Radio>
                </RadioGroup>
              </Col>
            </Row>
          </FormItem>
        </Card>
        <!-- <Card style="margin-bottom:20px;">
          <FormItem label="课后作业模式配置：" style="margin-bottom:0px;">
            <Row style="margin-top:1px;">
              <Col span="20">
                <RadioGroup v-model="homeworkType">
                  <Radio label="1">简易模式</Radio>
                  <Radio label="2">智能模式</Radio>
                </RadioGroup>
              </Col>
            </Row>
          </FormItem>
        </Card> -->
        <Row>
          <div style="margin-top:10px;padding-left:46%">
<!--            <Button style="float:left;width:100px" @click="saveSchoolStandard" type="success">保存</Button>-->
            <Button style="float:left;width:100px" @click="smsSend" type="success">保存</Button>
          </div>
        </Row>
      </Form>
    </div>
    <Modal v-model="smsModalStatus" :mask-closable="false" width="420" >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>短信验证</span>
      </p>
      <div style="">
        <p style="margin-left:40px;margin-top:10px;"><span >管理员账号：</span>
          <Select v-model="phoneNum"  style="width:200px;">
            <Option
                    v-for="item in phoneNumList"
                    :value="item"
                    :key="item"
            >{{ item.substring(0,3)}}****{{item.substring(7,11)}}</Option>
          </Select>
        </p>
      </div>
      <div style="">
        <p style="margin-left:40px;margin-top:10px;"><span >短信验证码：</span>
          <Input v-model="smsCode" size="small" placeholder="请输入短信验证码" style="width: 180px;"/>
          <!-- <Button type="success" size="small"   style="margin-left:10px;" :disabled="sendStatus"  @click="sendSmsCode" >发送</Button> -->
          <Button type="success" size="small"  :disabled="disable" :class="{ codeGeting:isGeting }" @click="getVerifyCode">{{getCode}}</Button>
        </p>
        <span style="margin-left:40px;color:red">{{errorMsg}}</span>
      </div>
      <div slot="footer">
        <Button type="success"  @click="cancle" >取消</Button>
        <Button type="success"  :loading="changeLoading" @click="getSmsIsOk" :disabled="dataTf">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  name: "organInfo",
  data() {
    return {
      phoneNum: '',
      phoneNumList: '',
      pageTitle: {},
      getCode:'获取验证码',
      smsModalStatus:false,
      changeLoading:false,
      isGeting:false,
      count:60,
      disable:false,
      dataTf:true,
      errorMsg:"",
      sendStatus:false,
      smsCode:'',
      sportsType: '',
      unirunInfo: {
        schoolId: "",
        firstSemesterDateStart: "",
        firstSemesterDateEnd: "",
        secondSemesterDateStart: "",
        secondSemesterDateEnd: "",
        wristbandType: "",
        homeworkType:"",
        sportsType: ''
      },
      wristbandTypeShow: "",
      homeworkType:"",
      months: [
        { name: "1", value: "01" },
        { name: "2", value: "02" },
        { name: "3", value: "03" },
        { name: "4", value: "04" },
        { name: "5", value: "05" },
        { name: "6", value: "06" },
        { name: "7", value: "07" },
        { name: "8", value: "08" },
        { name: "9", value: "09" },
        { name: "10", value: "10" },
        { name: "11", value: "11" },
        { name: "12", value: "12" }
      ],
      days: [
        { name: "1", value: "01" },
        { name: "2", value: "02" },
        { name: "3", value: "03" },
        { name: "4", value: "04" },
        { name: "5", value: "05" },
        { name: "6", value: "06" },
        { name: "7", value: "07" },
        { name: "8", value: "08" },
        { name: "9", value: "09" },
        { name: "10", value: "10" },
        { name: "11", value: "11" },
        { name: "12", value: "12" },
        { name: "13", value: "13" },
        { name: "14", value: "14" },
        { name: "15", value: "15" },
        { name: "16", value: "16" },
        { name: "17", value: "17" },
        { name: "18", value: "18" },
        { name: "19", value: "19" },
        { name: "20", value: "20" },
        { name: "21", value: "21" },
        { name: "22", value: "22" },
        { name: "23", value: "23" },
        { name: "24", value: "24" },
        { name: "25", value: "25" },
        { name: "26", value: "26" },
        { name: "27", value: "27" },
        { name: "28", value: "28" },
        { name: "29", value: "29" },
        { name: "30", value: "30" },
        { name: "31", value: "31" }
      ],
      firstSemesterDateStart_month: "",
      firstSemesterDateStart_day: "",
      firstSemesterDateEnd_month: "",
      firstSemesterDateEnd_day: "",
      secondSemesterDateStart_month: "",
      secondSemesterDateStart_day: "",
      secondSemesterDateEnd_month: "",
      secondSemesterDateEnd_day: "",
      showyear: "",
      showyearS: "",

      sportsClassFirstStart_month: "",
      sportsClassFirstStart_day: "",
      sportsClassSecondStart_month: "",
      sportsClassSecondStart_day: "",
    };
  },
  methods: {
    getSmsIsOk(){
      var vm = this;
      vm.sendStatus=true;
      this.$axios
              .get("/v1/common/getSmsCode?name=sportsType"+'&phoneNum='+vm.phoneNum+'&smsCode='+vm.smsCode)
              .then(function(response) {
                if (response.data.code == 10000) {
                  vm.saveSchoolStandard();
                } else {
                  vm.$Message.info(response.data.msg);
                }
              })
              .catch(function(response) {
                console.log(response);
              });
    },
    getSystemPhoneNumAll(){
      var vm = this;
      this.$axios
              .get("/v1/school/getSystemPhoneNumAll")
              .then(function(response) {
                if (response.data.code == 10000) {
                  vm.phoneNumList = response.data.response
                  if(vm.phoneNumList.length>0){
                    vm.phoneNum = vm.phoneNumList[0]
                  }
                } else {
                  vm.$Message.info(response.data.msg);
                }
              })
              .catch(function(response) {
              });
    },
    sendSmsCodeByphoneNum(){
      var vm = this;
      vm.sendStatus=true;
      this.$axios
              .get("/v1/common/sendSmsForUpdateSensitiveDataByphoneNum?name=sportsType"+'&phoneNum='+vm.phoneNum)
              .then(function(response) {
                // console.log(response)
                if (response.data.code == 10000) {
                  vm.$Message.info("发送成功，请注意接收");
                  vm.dataTf=false;
                  vm.errorMsg="发送成功，请注意接收"
                } else {
                  vm.$Message.info(response.data.msg);
                  vm.dataTf=true;
                  vm.errorMsg=response.data.msg
                }
              })
              .catch(function(response) {
                console.log(response);
              });
    },
    getVerifyCode(){
      var countDown = setInterval(()=>{
        if(this.count < 1){
          this.isGeting = false;
          this.disable = false;
          this.getCode = '获取验证码';
          this.count = 60;
          clearInterval(countDown);
          // console.log(this.count)
        }else{
          this.isGeting = true;
          this.disable = true;
          this.getCode = this.count-- + 's后重发';
          // console.log(this.count)
        }
      },1000);
      this.$once('hook:beforeDestroy', () => {
        clearInterval(countDown);
      })
      // this.sendSmsCode();
      this.sendSmsCodeByphoneNum();
    },
    cancle(){
      var vm=this;
      vm.smsModalStatus=false;
    },
    smsSend(){
      if(this.cleranType==""){
        this.$Message.info("请选择需要清除的数据类型！");
        return;
      }
      var vm=this;
      vm.smsModalStatus=true;
      vm.getSystemPhoneNumAll();
    },
    sportsTypeChange(){},
    semesterDateEndChange() {
      if (
        this.secondSemesterDateEnd_month < this.secondSemesterDateStart_month ||
        this.secondSemesterDateEnd_month < this.firstSemesterDateEnd_month
      ) {
        this.showyear = "(次年)";
      } else {
        this.showyear = "";
      }
      if (
        this.secondSemesterDateStart_month < this.firstSemesterDateEnd_month
      ) {
        this.showyearS = "(次年)";
      } else {
        this.showyearS = "";
      }
    },
    wristbandTypeChange(val) {},
    querySchoolStandard() {
      this.$axios
        .get(
          "/v1/school/query/school/semester?schoolId=" +
            sessionStorage.getItem("schoolId")
        )
        .then(res => {
          if (res.data.code == 10000) {
            this.unirunInfo = res.data.response;
            if (this.unirunInfo.firstSemesterDateStart != null) {
              if (
                this.unirunInfo.firstSemesterDateStart.split("-").length > 1
              ) {
                this.firstSemesterDateStart_month = this.unirunInfo.firstSemesterDateStart.split(
                  "-"
                )[0];
                this.firstSemesterDateStart_day = this.unirunInfo.firstSemesterDateStart.split(
                  "-"
                )[1];
              }
              if (this.unirunInfo.firstSemesterDateEnd.split("-").length > 1) {
                this.firstSemesterDateEnd_month = this.unirunInfo.firstSemesterDateEnd.split(
                  "-"
                )[0];
                this.firstSemesterDateEnd_day = this.unirunInfo.firstSemesterDateEnd.split(
                  "-"
                )[1];
              }
              if (
                this.unirunInfo.secondSemesterDateStart.split("-").length > 1
              ) {
                this.secondSemesterDateStart_month = this.unirunInfo.secondSemesterDateStart.split(
                  "-"
                )[0];
                this.secondSemesterDateStart_day = this.unirunInfo.secondSemesterDateStart.split(
                  "-"
                )[1];
              }
              if (this.unirunInfo.secondSemesterDateEnd.split("-").length > 1) {
                this.secondSemesterDateEnd_month = this.unirunInfo.secondSemesterDateEnd.split(
                  "-"
                )[0];
                this.secondSemesterDateEnd_day = this.unirunInfo.secondSemesterDateEnd.split(
                  "-"
                )[1];
              }
              if (
                this.unirunInfo.sportsClassSecondStart.split("-").length > 1
              ) {
                this.sportsClassSecondStart_month = this.unirunInfo.sportsClassSecondStart.split(
                  "-"
                )[0];
                this.sportsClassSecondStart_day = this.unirunInfo.sportsClassSecondStart.split(
                  "-"
                )[1];
              }
              if (this.unirunInfo.sportsClassFirstStart.split("-").length > 1) {
                this.sportsClassFirstStart_month = this.unirunInfo.sportsClassFirstStart.split(
                  "-"
                )[0];
                this.sportsClassFirstStart_day = this.unirunInfo.sportsClassFirstStart.split(
                  "-"
                )[1];
              }
              if( this.unirunInfo.homeworkType){
                this.homeworkType = this.unirunInfo.homeworkType;
              }else{
                this.homeworkType = "2";
              }

              if (this.unirunInfo.wristbandType == "1") {
                this.wristbandTypeShow = "仅用于校内教学监测";
              } else if (this.unirunInfo.wristbandType == "2") {
                this.wristbandTypeShow = "用于校外家长和校内教学监测";
              } else {
                this.wristbandTypeShow = "不开展手环教学模式";
              }

              if (this.unirunInfo.sportsType == "1") {
                this.sportsType = "模块化教学";
              } else {
                this.sportsType = "非模块化教学";
              }
            }
            this.semesterDateEndChange();
          }
        });
    },
    saveSchoolStandard() {
      if (
        this.firstSemesterDateStart_month == "" ||
        this.firstSemesterDateStart_day == "" ||
        this.firstSemesterDateEnd_month == "" ||
        this.firstSemesterDateEnd_day == "" ||
        this.secondSemesterDateStart_month == "" ||
        this.secondSemesterDateStart_day == "" ||
        this.secondSemesterDateEnd_month == "" ||
        this.secondSemesterDateEnd_day == "" ||
        this.sportsClassFirstStart_month == "" ||
        this.sportsClassFirstStart_day == "" ||
        this.sportsClassSecondStart_month == "" ||
        this.sportsClassSecondStart_day == ""
      ) {
        this.$Message.error("请先进行“学期标准配置”配置！。");
        return false;
      }

      if (this.wristbandTypeShow == "仅用于校内教学监测") {
        this.unirunInfo.wristbandType = "1";
      } else if (this.wristbandTypeShow == "用于校外家长和校内教学监测") {
        this.unirunInfo.wristbandType = "2";
      } else {
        this.unirunInfo.wristbandType = "0";
      }

      if (this.sportsType == "模块化教学") {
        this.unirunInfo.sportsType = "1";
      } else {
        this.unirunInfo.sportsType = "0";
      }

      this.unirunInfo.firstSemesterDateStart =
        this.firstSemesterDateStart_month +
        "-" +
        this.firstSemesterDateStart_day;
      this.unirunInfo.firstSemesterDateEnd =
        this.firstSemesterDateEnd_month + "-" + this.firstSemesterDateEnd_day;
      this.unirunInfo.secondSemesterDateStart =
        this.secondSemesterDateStart_month +
        "-" +
        this.secondSemesterDateStart_day;
      this.unirunInfo.secondSemesterDateEnd =
        this.secondSemesterDateEnd_month + "-" + this.secondSemesterDateEnd_day;

      this.unirunInfo.sportsClassFirstStart =
        this.sportsClassFirstStart_month + "-" + this.sportsClassFirstStart_day;
      this.unirunInfo.sportsClassSecondStart =
        this.sportsClassSecondStart_month +
        "-" +
        this.sportsClassSecondStart_day;

        this.unirunInfo.homeworkType = "2";
        this.unirunInfo.saveType = "2";

      this.$axios
        .post("/v1/school/save/school/semester", this.unirunInfo)
        .then(res => {
          this.smsModalStatus = false
          if (res.data.code == 10000) {
            this.$Message.success("保存成功！");
            this.querySchoolStandard();
          } else {
            this.$Message.success(res.data.msg);
            this.querySchoolStandard();
          }
        });
    }
},
  mounted() {
    this.querySchoolStandard();
  }
};
</script>
