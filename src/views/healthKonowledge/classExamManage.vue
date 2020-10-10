<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">{{gradeId==1?"一年级":gradeId==2?"二年级":gradeId==3?"三年级":gradeId==4?"四年级":gradeId==5?"五年级":gradeId==6?"六年级":gradeId==7?"七年级":gradeId==8?"八年级":gradeId==9?"九年级":gradeId==10?"高一":gradeId==11?"高二":gradeId==12?"高三":""}}、{{studentClass}}班</h2>
    </div>
    <Card>
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>性别：</span>
                    <Select v-model="gender"  style="width:120px;">
                        <Option
                            v-for="item in genderType"
                            :value="item.typeId"
                            :key="item.typeId"
                        >{{ item.typeName }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>学籍号：</span>
                    <Input v-model="registerCode"  placeholder="学生学籍号" style="width: 120px;"/>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="search">查询</Button>
                <Button type="success" @click="pageToList">返回</Button>
            </div>
        </div>
      </Card>
      <br/>
      <Tabs type="card" @on-click="tagClick" v-model="examItemName">
        <TabPane  v-for="examItem in examItemList"  :label="examItem.examItemName" :name="examItem.examItemName"></TabPane>
      </Tabs>
      <Card>
        <div style="font-size:18px;height:40px;">
            数据概览
        </div>
        <div>
          <Row>
            <div style>
              <Table border :loading="loading" :columns="resultColumnsTotal" :data="resultDataTotal"></Table>
            </div>
          </Row>
        </div>
      </Card>
      </br>
      <Card >
      <div style="font-size:18px;height:40px;">
            数据明细
      </div>
      <div>
        <div>
          <Row>
            <div>
              <Table border max-height="450" :columns="resultColumns" :data="resultData"></Table>
            </div>
          </Row>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: "teacherList",
  data() {
    return {
      schoolName: "",
      gradeName: "",
      gradeId:'',
      loading:false,
      examItemId:'',
      studentClass: "",
      examItemId: "",
      examItemName: "",
      yearSemester: "",
      classId: "",
      gender: "",
      registerCode: "",
      allCount: 0,
      overCount: 0,
      excellentCount: 0,
      wellCount: 0,
      passCount: 0,
      noPassCount: 0,
      noTestCount: 0,
      resultDataTotal:[],
      resultColumnsTotal:[
        {
          title: "总人数",
          key: "allCount",
          align: "center",
          minWidth:100
        },
        {
          title: "未考核完成人数",
          key: "noTestCount",
          align: "center",
          minWidth:100,
        },
        {
          title: "考核完成人数",
          key: "overCount",
          align: "center",
          minWidth:100,
        },
        {
          title: "免试人数",
          key: "exemptStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "优秀人数",
          key: "excellentCount",
          align: "center",
          minWidth:100,
        },
        {
          title: "良好人数",
          key: "wellCount",
          align: "center",
          minWidth:100,
        },
        {
          title: "及格人数",
          key: "passCount",
          align: "center",
          minWidth:100,
        },
        {
          title: "不及格人数",
          key: "noPassCount",
          align: "center",
          minWidth:100,
        },
      ],
      genderType: [
        {
          typeId: "",
          typeName: "全部"
        },
        {
          typeId: '1',
          typeName: "男生"
        },
        {
          typeId: '2',
          typeName: "女生"
        }
      ],
      resultColumns: [
        {
          title: "姓名",
          key: "studentName",
          align: "center",
          minWidth:100,
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.gender == "1" ? "男" : "女")
            ]);
          }
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          minWidth:100,
        },
        {
          title: "成绩",
          key: "examResult",
          align: "center",
          minWidth:100,
          render: (h, params) => {

            if(params.row.exemptStatus=='1'){
              return h("div", [h("span", "免试")]);
            }else{
              let data=params.row.examResult;

            if(params.row.examUnit && params.row.examUnit == "分.秒"){
              data=Number(data)%60>0?(Math.floor(Number(data)/60)+'分'+(Number(data)%60)+'秒'):Number(data)/60+'分'
            }else{
              data=params.row.examUnit != '99' ? params.row.examResult + params.row.examUnit : params.row.examResult
            }

            if (!params.row.examResult) {
              return h("div", [h("span", "-")]);
            }else {
              return h("div", [
                h(
                  "span",
                  data
                )
              ]);
            }
            }

          }
        },
        {
          title: "基础得分",
          key: "score",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            if(params.row.exemptStatus=='1'){
              return h("div", [h("span", "免试")]);
            }else{
            if (!params.row.examResult) {
              return h("div", [h("span", "未完成测试")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.baseScore != null
                    ? params.row.baseScore + "分"
                    : ""
                )
              ]);
            }
            }
          }
        },
        {
          title: "技评得分",
          key: "score",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            if(params.row.exemptStatus=='1'){
              return h("div", [h("span", "免试")]);
            }else{
            if (!params.row.examResult) {
              return h("div", [h("span", "未完成测试")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.teacherScore != null
                    ? params.row.teacherScore + "分"
                    : ""
                )
              ]);
            }
            }
          }
        },
        {
          title: "总得分",
          key: "score",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            if(params.row.exemptStatus=='1'){
              return h("div", [h("span", "免试")]);
            }else{
            if (!params.row.examResult) {
              return h("div", [h("span", "未完成测试")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.score != null
                    ? params.row.score + "分"
                    : ""
                )
              ]);
            }
          }
          }
        },
        {
          title: "得分等级",
          key: "scoreLevel",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            if(params.row.exemptStatus=='1'){
              return h("div", [h("span", "免试")]);
            }else{
            return h("div", [
              h(
                "span",
               params.row.scoreLevel == "1"
                  ? "优秀"
                  : params.row.scoreLevel == "2"
                  ? "良好"
                  : params.row.scoreLevel == "3"
                  ? "及格"
                  : params.row.scoreLevel == "4"
                  ? "不及格"
                  : ""
              )
            ]);
            }
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            var vm=this;
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.toClassTestDetail(
                          params.row.studentId,
                          params.row.studentName,
                          vm.gradeId,
                          vm.studentClass,
                          params.row.gender
                        );
                      }
                    }
                  },
                  "编辑"
                )
              ]);
            }
        }
      ],
      resultData: [],
      examItemList:[],
      classTestType:"",
      exemptStudent:''
    };
  },
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    tagClick(examItemName){
      var vm=this;
      for(var i=0;i<vm.examItemList.length;i++){
        if(examItemName==vm.examItemList[i].examItemName){
          vm.examItemId=vm.examItemList[i].examItemId
           vm.examItemName=examItemName
        }
      }
    },
    search(){
        var vm=this;
        vm.getClassStudentList(vm.classId,vm.examItemId)
    },
    getClassExamList(classId,examItemId,yearSemester) {
      var vm = this;
      vm.loading = true;
      let data = {
        classId: classId,
        examItemId: examItemId,
        yearSemester: yearSemester,
        gender: vm.gender,
        registerCode: vm.registerCode
      };
      this.$axios.post("/v1/studentexam/getClassExamList", data).then(res => {
        vm.loading = false;
        if (res.data.code == 10000) {
          vm.resultData = res.data.response;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    toClassTestDetail(studentId,studentName,gradeId,studentClass,gender) {
        var vm=this;
      sessionStorage.setItem(
        "classExamManage1-studentExamDetail1-studentId",
        studentId
      );
      sessionStorage.setItem(
        'classExamManage1-studentExamDetail1-studentName',
        studentName
      )
       sessionStorage.setItem(
        'classExamManage1-studentExamDetail1-examItemId',
        vm.examItemId
      )
      sessionStorage.setItem(
        "classExamManage1-studentExamDetail1-gradeId",
        gradeId
      );
      sessionStorage.setItem(
        'classExamManage1-studentExamDetail1-gender',
       gender
      )
       sessionStorage.setItem(
        'classExamManage1-studentExamDetail1-studentClass',
        vm.studentClass
      )
      sessionStorage.setItem(
        'classExamManage1-studentExamDetail1-classId',
        vm.classId
      )
      sessionStorage.setItem( 'classExamManage1-studentExamDetail1-classTestType',vm.classTestType)
      this.$router.push({ name: "studentExamDetail1" });
    },
    getClassStudentStatiscalInfo(classId,examItemId) {
      var vm = this;
      this.$axios
        .get(
          "/v1/examschool/getClassStudentStatiscalInfo?classId=" +
            classId +
            "&examItemId=" +
            examItemId
        )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response;
            vm.allCount =data.totalStudent;
            vm.overCount = data.examFinish;
            vm.excellentCount = data.vgStudent
            vm.wellCount = data.goodStudent
            vm.passCount = data.passStudent
            vm.noPassCount = data.notPass
            vm.noTestCount = data.noExam
            vm.exemptStudent = data.exemptStudent

            vm.schoolName=data.schoolName;
            vm.gradeName=data.gradeName;
            vm.studentClass=data.studentClass;

            vm.resultDataTotal=[];
            let aotal = {
                allCount:vm.allCount,
                noTestCount:vm.noTestCount,
                overCount:vm.overCount,
                excellentCount:vm.excellentCount,
                wellCount:vm.wellCount,
                passCount:vm.passCount,
                noPassCount:vm.noPassCount,
                exemptStudent:vm.exemptStudent,
            }
            vm.resultDataTotal.push(aotal);
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    },
    getClassExamItemList(classId) {
      var vm = this;
      this.$axios
        .get("/v1/examschool/getClassExamItemList?classId=" +classId+"&classTestType="+vm.classTestType)
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response;
            vm.examItemList=data?data:[]
            if(vm.examItemList.length>0){
                vm.examItemId=vm.examItemList[0].examItemId
                vm.examItemName=vm.examItemList[0].examItemName
            }
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    },
    getClassStudentList(classId,examItemId) {
      var vm = this;
      this.$axios
        .get("/v1/examschool/getClassStudentList?classId="+classId+"&examItemId="+examItemId+"&gender="+vm.gender+"&register="+vm.registerCode )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response;
            vm.resultData=data
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    }
  },
  watch: {
      examItemId:function(){
        var vm=this;
        vm.resultDataTotal=[];
        vm.resultData=[];
        vm.getClassStudentStatiscalInfo(vm.classId,vm.examItemId);
        vm.getClassStudentList(vm.classId,vm.examItemId);
      },
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    var vm = this;
    let schoolType = sessionStorage.getItem("schoolType");
    console.log(sessionStorage.getItem( 'examAchievement1-classExamManage1-classTestType'))
    vm.classTestType=sessionStorage.getItem( 'examAchievement1-classExamManage1-classTestType')
    vm.classId = sessionStorage.getItem("examAchievement1-classExamManage1-classId");
    vm.gradeId = sessionStorage.getItem("examAchievement1-classExamManage1-gradeId");
    vm.studentClass = sessionStorage.getItem("examAchievement1-classExamManage1-studentClass");
    vm.schoolId = sessionStorage.getItem("schoolId");
    vm.getClassExamItemList(sessionStorage.getItem("examAchievement1-classExamManage1-classId"));
  }
};
</script>
