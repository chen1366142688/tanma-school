<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">锻炼数据录入</h2>
    </div>
    <div>
      <Card :dis-hover="true">
        <div class="top-search" @keydown.enter="getStudentHomeworkList">
          <div class="left-input">
            <div style="margin:5px 20px;">
              <span>日期：</span>
              <DatePicker
                :value="dateTime"
                @on-change="startTimeChange"
                :clearable="false"
                format="yyyy-MM-dd"
                type="datetime"
                placeholder="日期"
                style="width: 120px"
                on-clear="dateClear"
              ></DatePicker>
            </div>
            <div style="margin:5px 20px;">
              <span style>年级：</span>
              <Select v-model="grade" style="width:120px;">
                <Option
                  v-for="item in schoolGradeList"
                  :value="item.grade"
                  :key="item.grade"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div style="margin:5px 20px;">
              <span>班级：</span>
              <Select v-model="sportsClassId" style="width:120px;">
                <Option
                  v-for="item in gradeSportsClassList"
                  :value="item.sportsClassId"
                  :key="item.sportsClassId"
                >{{ item.sportsClassName }}</Option>
              </Select>
            </div>
            <div style="margin:5px 20px;">
              <span>姓名：</span>
              <Input style="width:120px;" v-model="studentName" :maxlength="20" />
            </div>
          </div>
          <div class="right-btns">
            <Button @click="getStudentHomeworkList" type="success">查询</Button>
          </div>
        </div>
      </Card>
      <br />
      <div>
        <Card :dis-hover="true">
          <div style="font-size:18px;height:40px;">
            数据明细
            <Button @click="allFinish" style="margin-left:1300px;" type="success">一键完成</Button>
            <Button @click="allCancle" style="margin-left:20px;" type="success">一键取消</Button>
          </div>
          <div style="font-size:15px;height:40px;" v-if="classTestName == ''">当前无学习项目</div>
          <div style="font-size:15px;height:40px;" v-else>当前学习项目:{{classTestName}}</div>
          <Row>
            <div style>
              <Table
                border
                :loading="loading"
                max-height="600"
                :columns="resultColumns"
                :data="resultData"
              ></Table>
            </div>
          </Row>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "schoolList",
  data() {
    return {
      loading: false,
      dateTime: "",
      studentName: "",
      infostudentName: "",
      infostudentId: "",
      inforegisterCode: "",
      infogender: "",
      infogradeName: "",
      infocompleteStatus: "",
      grade: "",
      schoolGradeList: [],
      classId: "",
      studentClass: 1,
      classList: [
        // {
        //   value: "",
        //   label: '全部'
        // },
        {
          value: 1,
          label: "1班",
        },
        {
          value: 2,
          label: "2班",
        },
        {
          value: 3,
          label: "3班",
        },
        {
          value: 4,
          label: "4班",
        },
        {
          value: 5,
          label: "5班",
        },
        {
          value: 6,
          label: "6班",
        },
        {
          value: 7,
          label: "7班",
        },
        {
          value: 8,
          label: "8班",
        },
        {
          value: 9,
          label: "9班",
        },
        {
          value: 10,
          label: "10班",
        },
        {
          value: 11,
          label: "11班",
        },
        {
          value: 12,
          label: "12班",
        },
        {
          value: 13,
          label: "13班",
        },
        {
          value: 14,
          label: "14班",
        },
        {
          value: 15,
          label: "15班",
        },
        {
          value: 16,
          label: "16班",
        },
        {
          value: 17,
          label: "17班",
        },
        {
          value: 18,
          label: "18班",
        },
        {
          value: 19,
          label: "19班",
        },
        {
          value: 20,
          label: "20班",
        },
        {
          value: 21,
          label: "21班",
        },
        {
          value: 22,
          label: "22班",
        },
        {
          value: 23,
          label: "23班",
        },
        {
          value: 24,
          label: "24班",
        },
        {
          value: 25,
          label: "25班",
        },
      ],
      primaryList: [
        { grade: 1, label: "一年级" },
        { grade: 2, label: "二年级" },
        { grade: 3, label: "三年级" },
        { grade: 4, label: "四年级" },
        { grade: 5, label: "五年级" },
        { grade: 6, label: "六年级" },
      ],
      middleList: [
        { grade: 7, label: "七年级" },
        { grade: 8, label: "八年级" },
        { grade: 9, label: "九年级" },
      ],
      highList: [
        { grade: 10, label: "高一" },
        { grade: 11, label: "高二" },
        { grade: 12, label: "高三" },
      ],
      resultColumns: [
        {
          title: "学生姓名",
          key: "studentName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          minWidth: 100,
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            const row = params.row;
            return h("span", row.gender == "1" ? "男" : "女");
          },
        },
        {
          title: "班级",
          key: "sportsClassName",
          align: "center",
          minWidth: 100,
          // render: (h, params) => {
          //   const row = params.row;
          //   return h("span", row.gradeName+row.studentClass+"班");
          // }
        },
        {
          title: "是否完成作业",
          key: "resultValue",
          align: "center",
          width: 250,
          render: (h, params) => {
            const param = params.row;
            return h(
              "i-switch",
              {
                props: {
                  type: "primary",
                  size: "default",
                  fontSize: "2px",
                  font_size_style_values: "2px",
                  value: param.completeStatus === "1",
                },
                slots: {
                  open: "是",
                  close: "否",
                },
                on: {
                  "on-change": (status) => {
                    let type = status ? "1" : "2";
                    // console.log(status)
                    this.resultData[params.index].completeStatus = type;
                    this.infostudentId = this.resultData[
                      params.index
                    ].studentId;
                    this.infostudentName = this.resultData[
                      params.index
                    ].studentName;
                    this.infogender = this.resultData[params.index].gender;
                    this.infogradeName = this.resultData[
                      params.index
                    ].gradeName;
                    this.inforegisterCode = this.resultData[
                      params.index
                    ].registerCode;
                    this.studentClass = this.resultData[
                      params.index
                    ].studentClass;
                    this.sportsClassId = this.resultData[
                      params.index
                    ].sportsClassId;
                    this.infocompleteStatus = type;
                    this.oneStudentHomeworkQuery();
                    // console.log(param)
                    // this.updateHomeworlStatus(param.row,type);
                  },
                },
              },
              [
                h("span", {
                  slot: "open",
                  domProps: {
                    innerHTML: "是",
                  },
                }),
                h("span", {
                  slot: "close",
                  domProps: {
                    innerHTML: "否",
                  },
                }),
              ]
            );
          },
        },
      ],
      resultData: [],
      semesterStatus: "",
      gradeSportsClassList: [],
      sportsClassId: "",
      schoolId: "",
      classTestName: "",
    };
  },
  methods: {
    getGradeSportsClassList() {
      var vm = this;
      this.$axios
        .get(
          "/v1/cd/high/skills/getGradeSportsClassList?schoolId=" +
            vm.schoolId +
            "&gradeId=" +
            vm.grade
        )
        .then((res) => {
          if (res.data.code == 10000) {
            let data = res.data.response;
            // let a = {
            //     sportsClassId: -1,
            //     sportsClassName: '全部'
            // };
            vm.gradeSportsClassList = data;
            // vm.gradeSportsClassList.unshift(a);
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    cancelAllHomeWorkQuery() {
      var vm = this;
      // return
      //如果是全部，需要传grade和classnum
      if (
        vm.sportsClassId == null ||
        vm.sportsClassId == "" ||
        vm.sportsClassId == undefined
      ) {
        this.$Message.success("请选择体育班级！");
        return;
      }
      let data = {
        dateTime: vm.dateTime,
        semesterStatus: vm.semesterStatus,
        sportsClassId: vm.sportsClassId,
      };
      this.$axios
        .post("/v1/cd/high/schoolexercise/cancelAllStudentHomework", data)
        .then((res) => {
          if (res.data.code == 10000) {
            this.$Message.success("保存成功！");
            this.getStudentHomeworkList();
          } else {
            this.$Message.success(res.data.msg);
            this.getStudentHomeworkList();
          }
        });
    },

    oneStudentHomeworkQuery() {
      var vm = this;
      // console.log(vm.resultData);
      // return
      //如果是全部，需要传grade和classnum
      let data = {
        dateTime: vm.dateTime,
        semesterStatus: vm.semesterStatus,
        gradeNum: vm.grade,
        sportsClassId: vm.sportsClassId,
        studentId: vm.infostudentId,
        studentName: vm.infostudentName,
        registerCode: vm.inforegisterCode,
        gender: vm.infogender,
        completeStatus: vm.infocompleteStatus,
      };
      this.$axios
        .post("/v1/cd/high/schoolexercise/upsertOneStudentHomework", data)
        .then((res) => {
          if (res.data.code == 10000) {
            this.$Message.success("保存成功！");
            this.getStudentHomeworkList();
          } else {
            this.$Message.success(res.data.msg);
            this.getStudentHomeworkList();
          }
        });
    },
    startTimeChange(time) {
      this.dateTime = time;
    },
    allFinish() {
      var vm = this;
      //  if(vm.resultData){
      //    for(let i=0;i<vm.resultData.length;i++){
      //      this.resultData[i].completeStatus='1';
      //    }
      //  }
      vm.saveResult();
    },
    allCancle() {
      var vm = this;
      // if(vm.resultData){
      //   for(let i=0;i<vm.resultData.length;i++){
      //     this.resultData[i].completeStatus='2';
      //   }
      // }
      vm.cancelAllHomeWorkQuery();
    },
    getStudentHomeworkList() {
      var vm = this;
      vm.resultData = [];
      vm.loading = true;
      let sportsClassId = vm.sportsClassId;
      if (undefined == sportsClassId) {
        sportsClassId = "";
      }
      this.$axios
        .get(
          "/v1/schoolteststudent/getStudentHomeworkList?schoolId=1&dateTime=" +
            vm.dateTime +
            "&gradeId=" +
            vm.grade +
            "&sportsClassId=" +
            sportsClassId +
            "&studentName=" +
            vm.studentName
        )
        .then((res) => {
          vm.loading = false;
          if (res.data.code == 10000) {
            let data = res.data.response;
            if (data) {
              vm.semesterStatus = data.semesterStatus;
              if (data.semesterStatus == "1") {
                vm.resultData = res.data.response.list;
              }
              vm.classTestName = data.classTestName;
            }
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    updateHomeworlStatus(student, status) {
      var vm = this;
    },
    saveResult() {
      var vm = this;
      // console.log(vm.resultData);
      // return
      //如果是全部，需要传grade和classnum
      if (
        vm.sportsClassId == null ||
        vm.sportsClassId == "" ||
        vm.sportsClassId == undefined
      ) {
        this.$Message.success("请选择体育班级！");
        return;
      }
      let data = {
        dateTime: vm.dateTime,
        semesterStatus: vm.semesterStatus,
        sportsClassId: vm.sportsClassId,
      };
      this.$axios
        .post("/v1/cd/high/schoolexercise/upsertStudentHomework", data)
        .then((res) => {
          if (res.data.code == 10000) {
            this.$Message.success("保存成功！");
            this.getStudentHomeworkList();
          } else {
            this.$Message.success(res.data.msg);
            this.getStudentHomeworkList();
          }
        });
    },
  },

  created() {},
  watch: {
    grade: function () {
      var vm = this;
      vm.getGradeSportsClassList();
    },
  },
  mounted() {
    var vm = this;
    var day1 = new Date();
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    let mm = day1.getMonth() + 1;
    if (mm < 10) {
      mm = "0" + mm;
    }
    vm.dateTime = day1.getFullYear() + "-" + mm + "-" + day1.getDate();
    let schoolId = sessionStorage.getItem("schoolId");
    vm.schoolId = schoolId;
    let schoolType = sessionStorage.getItem("schoolType");
    if (schoolType) {
      if ("0" == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList);
      }
      if ("2" == schoolType) {
        vm.schoolGradeList = vm.primaryList;
      }
      if ("3" == schoolType) {
        vm.schoolGradeList = vm.middleList;
      }
      if ("4" == schoolType) {
        vm.schoolGradeList = vm.highList;
      }
    }
    vm.grade = vm.schoolGradeList[0].grade;
    vm.getStudentHomeworkList();
  },
};
</script>
