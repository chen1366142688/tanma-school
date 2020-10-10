<template>
  <div>
    <div>
      <h1>学生体育成绩</h1>
    </div>
    <Card style="margin-top:15px;">
      <div>
        <span>学生姓名：{{studentName}}</span>
        <span style="margin-left:15px;">学籍号：{{registerCode}}</span>
        <span style="margin-left:15px;">学校：{{schoolName}}</span>
        <span style="margin-left:15px;">班级：{{studentClass}}</span>
        <span style="margin-left:15px;">性别：{{gender == '1'?'男':'女'}}</span>
        <Button class="add-button" v-on:click="pageToList()" type="success" style="float:right;margin-right:100px;">返回</Button>
      </div>
    </Card>
    <Tabs type="card" style="margin-top:20px;">
      <TabPane name="operator" label="考试">
        <Card>
          <div>
            <div>
              <div>
                <span style>开始时间：</span>
                 <DatePicker   @on-change="examStartTimeChange" format="yyyy-MM-dd" type="date" placeholder="选择开始时间" style="width: 200px"></DatePicker>
                <span style="margin-left:40px;">结束时间：</span>
                 <DatePicker  @on-change="examEndTimeChange" format="yyyy-MM-dd" type="date" placeholder="选择结束时间" style="width: 200px"></DatePicker>
                <span style="margin-left:40px;">测试项目：</span>
                <Select v-model="examItemId" size="small" style="width:120px;">
                  <Option
                    v-for="item in examItemList"
                    :value="item.itemId"
                    :key="item.itemId"
                  >{{ item.itemName }}</Option>
                </Select>
                <span style="margin-left:40px;">学期：</span>
                <Select v-model="examSemester" size="small" style="width:120px;">
                  <Option
                    v-for="item in semesterList"
                    :value="item.type"
                    :key="item.type"
                  >{{ item.name }}</Option>
                </Select>
                <Button
                  type="success"
                  size="small"
                  style="margin-left:40px;"
                  @click="querySearch"
                >查询</Button>
              </div>
            </div>
            <br>
            <div>
              <Row>
                <div>
                  <Table border :columns="resultColumns" :data="resultData"></Table>
                </div>
                <br>
                <div style="float: right;">
                  <Page
                    :total="total"
                    :current="pageNum"
                    :page-size="pageSize"
                    @on-change="pageNumChange"
                    @on-page-size-change="pageSizechange"
                    show-total
                    show-sizer
                  ></Page>
                </div>
              </Row>
            </div>
          </div>
        </Card>
      </TabPane>
      <TabPane name="test" label="体测">
        <Card>
          <div>
            <div>
              <div>
                <span style>开始时间：</span>
                 <DatePicker  @on-change="testStartTimeChange" format="yyyy-MM-dd" type="date" placeholder="选择开始时间" style="width: 200px"></DatePicker>
                <span style="margin-left:40px;">结束时间：</span>
                 <DatePicker   @on-change="testEndTimeChange" format="yyyy-MM-dd" type="date" placeholder="选择结束时间" style="width: 200px"></DatePicker>
                <span style="margin-left:40px;">测试项目：</span>
                <Select v-model="testItemId" size="small" style="width:120px;">
                  <Option
                    v-for="item in testItemList"
                    :value="item.itemId"
                    :key="item.itemId"
                  >{{ item.itemName }}</Option>
                </Select>
                <span style="margin-left:40px;">活动名称：</span>
                <Select v-model="activityId" size="small" style="width:120px;">
                  <Option
                    v-for="item in activityList"
                    :value="item.activityId"
                    :key="item.activityId"
                  >{{ item.activityName }}</Option>
                </Select>
                <Button
                  type="success"
                  size="small"
                  style="margin-left:40px;"
                  @click="querySearch2"
                >查询</Button>
              </div>
            </div>
            <br>
            <div>
              <Row>
                <div>
                  <Table border :columns="resultGroupColumns" :data="resultData2"></Table>
                </div>
                <br>
                <div style="float: right;">
                  <Page
                    :total="total2"
                    :current="pageNum2"
                    :page-size="pageSize2"
                    @on-change="pageNumChange2"
                    @on-page-size-change="pageSizechange2"
                    show-total
                    show-sizer
                  ></Page>
                </div>
              </Row>
            </div>
          </div>
        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: "teacherList",
  data() {
    return {
      studentId: "",
      studentName: "",
      registerCode: "",
      schoolName: "",
      studentClass: "",
      gender: "",
      age: "",
      examStartTime: "",
      examEndTime: "",
      examItemId: "",
      examItemList: [],
      examSemester: "",
      semesterList: [
        {
          type: "999",
          name: "全部"
        },
        {
          type: "1",
          name: "上学期"
        },
        {
          type: "2",
          name: "下学期"
        }
      ],
      resultColumns: [
        {
          title: "测试时间",
          key: "testTime",
          align: "center",
          minWidth: 250
        },
        {
          title: "项目名称",
          key: "examItemName",
          align: "center",
          minWidth: 150
        },
        {
          title: "项目类型",
          key: "examItemType",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.examItemType == "1" ? "健康知识" : "运动技能")
            ]);
          }
        },
        {
          title: "测试结果",
          key: "examResult",
          align: "center",
          minWidth: 150,
        },
        {
          title: "测试得分",
          key: "score",
          align: "center",
          minWidth: 150,
        },
        {
          title: "等级",
          key: "scoreLevel",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.scoreLevel == "1" ? "优秀" :params.row.scoreLevel == "2" ? "良好" :params.row.scoreLevel == "3" ? "及格" : "不及格")
            ]);
          }
        },
      ],
      resultData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      resultGroupColumns: [
        {
          title: "测试时间",
          key: "testTime",
          align: "center"
        },
        {
          title: "项目名称",
          key: "examItemName",
          align: "center"
        },
        {
          title: "测试结果",
          key: "examResult",
          align: "center",
        },
        {
          title: "测试得分",
          key: "score",
          align: "center"
        },
        {
          title: "等级",
          key: "scoreLevel",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("span", params.row.scoreLevel == "1" ? "优秀" :params.row.scoreLevel == "2" ? "良好" :params.row.scoreLevel == "3" ? "及格" : "不及格")
            ]);
          }
        },
      ],
      testStartTime: "",
      testEndTime: "",
      testItemId: "",
      testItemList: [],
      activityId:'',
      activityList:[],
      resultData2: [],
      pageNum2: 1,
      pageSize2: 10,
      total2: 0
    };
  },
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1)
    },
    getStudentExamList(studentId) {
      var vm = this
      vm.loading=true;
      console.log(vm.examStartTime)
      let data = {
      "endTime": vm.examEndTime,
      "examItemId":vm.examItemId=='999'?'':vm.examItemId,
      "pageNo":vm.pageNum,
      "pageSize": vm.pageSize,
      "semester": vm.examSemester=='999'?'':vm.examSemester,
      "startTime": vm.examStartTime,
      "studentId": studentId
       }
      this.$axios.post('/v1/exam/getStudentExamList', data).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          let result = res.data.response;
          for(let i=0;i<result.length;i++){
            if(result[i].examItemName == "50米X8往返跑" || result[i].examItemName == "1000米跑"){
              result[i].examResult = vm.s_to_hs(result[i].examResult)+result[i].examUnit
            }else if(result[i].examUnit == '99'){
              result[i].examResult += "分"
            }else if(result[i].examUnit == '个数'){
              result[i].examResult += "个"
            }else{
              result[i].examResult += result[i].examUnit
            }
            if(result[i].examItemName == "BMI" && result[i].examUnit == "kg"){
              result[i].examItemName = "体重"
            }
            if(result[i].examItemName == "BMI" && result[i].examUnit == "cm"){
              result[i].examItemName = "身高"
            }
          }
          vm.resultData = result
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    countStudentExamNum(studentId) {
      var vm = this
      let data = {
      "endTime": vm.examStartTime,
      "examItemId":vm.examItemId,
      "pageNo":vm.pageNum,
      "pageSize": vm.pageSize,
      "semester": vm.examSemester,
      "startTime": vm.examStartTime,
      "studentId": studentId
    }
      this.$axios.post('/v1/exam/countStudentExamNum', data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    getStudentTestList(studentId) {
      var vm = this
      vm.loading=true;
      let data = {
        "activityId": vm.activityId=='999'?'': vm.activityId,
        "endTime":vm.testEndTime,
        "pageNo":vm.pageNum2,
        "pageSize":vm.pageSize2,
        "startTime": vm.testStartTime,
        "studentId": studentId,
        "testId": vm.testItemId=='999'?'': vm.testItemId
      }
      this.$axios.post('/v1/exam/getStudentTestList', data).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          let result = res.data.response;
          for(let i=0;i<result.length;i++){
            if(result[i].examItemName == "50米X8往返跑" || result[i].examItemName == "1000米跑"){
              result[i].examResult = vm.s_to_hs(result[i].examResult)+result[i].valueUnit
            }else{
              result[i].examResult += result[i].valueUnit
            }
            if(result[i].examItemName == "BMI" && result[i].valueUnit == "kg"){
              result[i].examItemName = "体重"
            }
            if(result[i].examItemName == "BMI" && result[i].valueUnit == "cm"){
              result[i].examItemName = "身高"
            }
          }
          vm.resultData2 = result
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    s_to_hs(s) {
      var h;
      h = Math.floor(s / 60);
      s = s % 60;
      h += '';
      s += '';
      h = (h.length == 1) ? '0' + h : h;
      s = (s.length == 1) ? '0' + s : s;
      return h + '\'' + s;
    },
    countStudentTestNum(studentId) {
      var vm = this
      let data = {
        "activityId": vm.activityId=='999'?'': vm.activityId,
        "endTime":vm.testEndTime,
        "pageNo":vm.pageNum2,
        "pageSize":vm.pageSize2,
        "startTime": vm.testStartTime,
        "studentId": studentId,
        "testId": vm.testItemId=='999'?'': vm.testItemId
      }
      this.$axios.post('/v1/exam/countStudentTestNum', data).then(res => {
        if (res.data.code == 10000) {
          this.total2 = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    querySearch(){
      this.pageNum = 1;
      this.pageNo = 1
      this.search();
    },
    search() {
      var vm = this
      let studentId = vm.studentId
      vm.getStudentExamList(studentId)
      vm.countStudentExamNum(studentId)
    },
    querySearch2(){
      this.pageNum2 = 1;
      this.pageNo2 = 1
      this.search2();
    },
    search2() {
      var vm = this
      let studentId = vm.studentId
      vm.getStudentTestList(studentId)
      vm.countStudentTestNum(studentId)
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value;
        this.search();
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value;
        this.pageNum = 1;
        this.search();
      }
    },
    pageNumChange2(value) {
      //页码改变方法处理
      if (this.pageNum2 != value) {
        this.pageNum2 = value;
        this.search2();
      }
    },
    pageSizechange2(value) {
      //页面大小改变方法处理
      if (this.pageSize2 != value) {
        this.pageSize2 = value;
        this.pageNum2 = 1;
        this.search2();
      }
    },

    examStartTimeChange(date,type){
      var vm=this;
        vm.examStartTime=date
    },
    examEndTimeChange(date,type){
      var vm=this;
        vm.examEndTime=date
    },
    testStartTimeChange(date,type){
      var vm=this;
      console.log(date)
        vm.testStartTime=date
    },
    testEndTimeChange(date,type){
      var vm=this;
        vm.testEndTime=date
    },
    getActivitySingleInfoBySchoolId() {
      var vm = this
      this.$axios.get('/v1/testdata/getActivitySingleInfoBySchoolId?schoolId=' + sessionStorage.getItem('schoolId'))
        .then(res => {
          if (res.data.code == 10000) {

            let all={
              activityId:'999',
              activityName:'全部'
            }
            vm.activityList.push(all);
            vm.activityList=vm.activityList.concat(res.data.response)
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getStudentInfo(studentId) {
      var vm = this
      this.$axios.get('/v1/exam/getStudentInfo?studentId=' +studentId)
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response
            vm.studentName=data.studentName;
            vm.registerCode=data.registerCode;
            vm.schoolName=data.schoolName;
            vm.studentClass=data.gradeName+data.studentClass+'班'
            vm.gender=data.gender;
            vm.age=data.studentAge;
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },

    getTestItemList() {
      var vm = this
      this.$axios.get('/v1/exam/getTestItemList')
        .then(res => {
          if (res.data.code == 10000) {

            let all={
              itemId:'999',
              itemName:'全部'
            }
            vm.testItemList.push(all);
            vm.testItemList=vm.testItemList.concat(res.data.response)
            // vm.testItemList=res.data.response
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },

    getExamItemList() {
      var vm = this
      this.$axios.get('/v1/exam/getExamItemList')
        .then(res => {
          if (res.data.code == 10000) {
            let all={
              itemId:'999',
              itemName:'全部'
            }
            vm.examItemList.push(all);
            vm.examItemList=vm.examItemList.concat(res.data.response)
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },
  },
  watch: {
    //   provinceId:'getCityList',
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    var vm=this;
    vm.schoolId = sessionStorage.getItem("schoolId");
    vm.studentId=sessionStorage.getItem("studentInfoManage-studentExamInfo-studentId");
    vm.getActivitySingleInfoBySchoolId();
    vm.getTestItemList();
    vm.getExamItemList();
    vm.getStudentInfo(sessionStorage.getItem("studentInfoManage-studentExamInfo-studentId"));
    vm.getStudentExamList(sessionStorage.getItem("studentInfoManage-studentExamInfo-studentId"));
    vm.countStudentExamNum(sessionStorage.getItem("studentInfoManage-studentExamInfo-studentId"));
    vm.getStudentTestList(sessionStorage.getItem("studentInfoManage-studentExamInfo-studentId"));
    vm.countStudentTestNum(sessionStorage.getItem("studentInfoManage-studentExamInfo-studentId"));
  }
};
</script>