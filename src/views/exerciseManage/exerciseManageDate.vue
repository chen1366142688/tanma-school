<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">按日期查询</h2>
    </div>
    <div>
    <Card>
      <div class="top-search">
        <div class="left-input">
          <div style="margin:5px 20px;">
            <span style>日期：</span>
            <DatePicker
              v-model="startTime"
              @on-change="examStartTimeChange"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 120px"
            ></DatePicker>
          </div>
          <div style="margin:5px 20px;">
            <span>年级：</span>
            <Select v-model="grade" @on-change="gradeNameChange" style="width:120px;">
              <Option
                v-for="item in schoolGradeList"
                :value="item.gradeId"
                :key="item.gradeId"
              >{{ item.gradeName }}</Option>
            </Select>
          </div>
          <div style="margin:5px 20px;">
            <span>班级：</span>
            <Select v-model="studentClass" @on-change="studentClassNameChange" style="width:120px;">
              <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="right-btns">
          <Button type="success" @click="querySearch">查询</Button>
          <Button type="success"  @click="exportExerciseDateData">导出EXCEL</Button>
        </div>
      </div>
    </Card>
    <br />
    <div>
      <Card>
        <div style="font-size:18px;height:40px;">数据概览</div>
        <Table border :columns="resultColumnsTotal" :data="resultDataTotal"></Table>
      </Card>
    </div>
    <br />
    <div>
      <Card>
        <div style="font-size:18px;height:40px;">数据明细</div>
        <div>
          <Row>
            <div style>
              <Table
                border
                max-height="430"
                :loading="loading"
                :columns="resultColumns"
                :data="resultData"
              ></Table>
            </div>
            <br />
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
      </Card>
    </div>
    </div>
  </div>
</template>

<script>
import familyExerciseAnalyzeVue from "../dataAnalyze/familyExerciseAnalyze.vue";
export default {
  name: "exercisePlanList",
  data() {
    return {
      startTime: "",
      examStartTime: "",
      loading: false,
      gradeName: "",
      studentClassName: "",
      statisticalData: {},
      grade: 999,
      schoolGradeList: [],
      studentClass: 999,
      classList: [
        {
          value: 999,
          label: "全部",
        },
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
      ],
      resultColumns: [
        {
          title: "日期",
          key: "dateTime",
          align: "center",
          width: 140,
        },
        {
          title: "年级",
          key: "gradeName",
          align: "center",
          minWidth:100
        },
        {
          title: "班级",
          key: "studentClassName",
          align: "center",
          minWidth:100,
        },
        {
          title: "总人数",
          key: "totalStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日参与锻炼人数",
          key: "joinStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日未参与锻炼人数",
          key: "notJoinStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业参与率（%）",
          key: "joinPercent",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            let row = params.row;
            let totalStudent = row.totalStudent;
            let joinStudent = row.joinStudent;

            var percent = (joinStudent * 100) / totalStudent.toFixed(2);
            percent = percent.toFixed(2);
            var text = percent == 0 ? 0 : percent;
            text = text + "%";
            return h("span", text);
          },
        },
        {
          title: "当日作业未完成人数",
          key: "notFinishStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业完成人数",
          key: "finishStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业完成率（%）",
          key: "finishPercent",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            let row = params.row;
            let totalStudent = row.totalStudent;
            let finishStudent = row.finishStudent;
            var percent = (finishStudent * 100) / totalStudent.toFixed(2);
            percent = percent.toFixed(2);
            var text = percent == 0 ? 0 : percent;
            text = text + "%";
            return h("span", text);
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 140,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.toDetail(params.row.classId);
                    },
                  },
                },
                "详情"
              ),
            ]);
          },
        },
      ],
      resultData: [],

      resultColumnsTotal: [
        {
          title: "日期",
          key: "dateTime",
          align: "center",
          width: 140,
        },
        {
          title: "总人数",
          key: "totalStudent",
          align: "center",
          minWidth:100
        },
        {
          title: "当日参与锻炼人数",
          key: "joinStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日未参与锻炼人数",
          key: "notJoinStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业参与率（%）",
          key: "joinPercent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业未完成人数",
          key: "notFinishStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业完成人数",
          key: "finishStudent",
          align: "center",
          minWidth:100,
        },
        {
          title: "当日作业完成率（%）",
          key: "finishPercent",
          align: "center",
          minWidth:100,
        },
      ],
      resultDataTotal: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    toDetail(classId) {
      var vm = this;
      sessionStorage.setItem(
        "exerciseManageDate-exerciseManageDateDetail-classId",
        classId
      );
      sessionStorage.setItem(
        "exerciseManageDate-exerciseManageDateDetail-dateTime",
        vm.examStartTime
      );
      this.$router.push({ name: "exerciseManageDateDetail" });
    },
    gradeNameChange(e) {
      var vm = this;
      vm.gradeName = "";
      if (e != 999) {
        for (var i = 0; i < vm.schoolGradeList.length; i++) {
          if (e == vm.schoolGradeList[i].gradeId) {
            vm.gradeName = vm.schoolGradeList[i].gradeName;
          }
        }
      }
    },
    studentClassNameChange(e) {
      var vm = this;
      vm.studentClassName = "";
      if (e != 999) {
        for (var i = 0; i < vm.classList.length; i++) {
          if (e == vm.classList[i].value) {
            vm.studentClassName = vm.classList[i].label;
          }
        }
      }
    },
    getDateList() {
      var vm = this;
      vm.loading = true;

      let data = {
        dateTime: vm.examStartTime,
        gradeId: vm.grade == 999 ? "" : vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        studentClass: vm.studentClass == 999 ? "" : vm.studentClass,
      };
      this.$axios
        .post("/v1/exercisedatamanage/getDateList", data)
        .then((res) => {
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
    countDateList() {
      var vm = this;
      let data = {
        dateTime: vm.examStartTime,
        gradeId: vm.grade == 999 ? "" : vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        studentClass: vm.studentClass == 999 ? "" : vm.studentClass,
      };
      this.$axios
        .post("/v1/exercisedatamanage/countDateList", data)
        .then((res) => {
          if (res.data.code == 10000) {
            this.total = res.data.response;
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    },
    getDateStatisticalInfo() {
      var vm = this;
      let data = {
        dateTime: vm.examStartTime,
        gradeId: vm.grade == 999 ? "" : vm.grade,
        studentClass: vm.studentClass == 999 ? "" : vm.studentClass,
      };
      this.$axios
        .post("/v1/exercisedatamanage/getDateStatisticalInfo", data)
        .then((res) => {
          if (res.data.code == 10000) {
            let data = res.data.response;
            vm.statisticalData = res.data.response;
            let finishPercent =
              vm.statisticalData.totalStudent == 0
                ? 0
                : (vm.statisticalData.finishStudent * 100) /
                  vm.statisticalData.totalStudent;
            finishPercent = finishPercent.toFixed(2) + "%";

            let joinPercent =
              vm.statisticalData.totalStudent == 0
                ? 0
                : (vm.statisticalData.joinStudent * 100) /
                  vm.statisticalData.totalStudent;
            joinPercent = joinPercent.toFixed(2) + "%";

            vm.resultDataTotal = [
              {
                dateTime: vm.examStartTime,
                totalStudent: vm.statisticalData.totalStudent,
                joinStudent: vm.statisticalData.joinStudent,
                notJoinStudent: vm.statisticalData.notJoinStudent,
                joinPercent: joinPercent,
                notFinishStudent: vm.statisticalData.notFinishStudent,
                finishStudent: vm.statisticalData.finishStudent,
                finishPercent: finishPercent,
              },
            ];
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    examStartTimeChange(date, type) {
      var vm = this;
      vm.examStartTime = date;
    },
    exportExerciseDateData() {
      var vm = this;
      let url =
        this.$axios.defaults.baseURL +
        "/v1/exercisedatamanage/exportExerciseDateData?dateTime=" +
        vm.examStartTime +
        "&gradeId=" +
        (vm.grade == 999 ? "" : vm.grade) +
        "&studentClass=" +
        (vm.studentClass == 999 ? "" : vm.studentClass) +
        "&token=" +
        sessionStorage.getItem("token");
      window.open(url);
    },
    querySearch() {
      var vm = this;
      if (vm.startTime == "") {
        this.$Message.info("请选择查询日期！");
        return false;
      }
      vm.pageNum = 1;
      vm.pageSize = 10;
      vm.search();
    },
    search() {
      var vm = this;
      vm.getDateList();
      vm.countDateList();
      vm.getDateStatisticalInfo();
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
        this.pageNum = 1;
        this.pageSize = value;
        this.search();
      }
    },
    getStartYearList() {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      this.$axios.get("/v1/school/getStartYearList").then((res) => {
        if (res.data.code == 10000) {
          //   console.log(res);
          let data = res.data.response;
          let all = {
            gradeId: 999,
            gradeName: "全部",
          };
          this.schoolGradeList.push(all);
          this.schoolGradeList = this.schoolGradeList.concat(data);

          // this.schoolName = data.name
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    let date = new Date();
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var nowDay =
      date.getFullYear() +
      "-" +
      (mon < 10 ? "0" + mon : mon) +
      "-" +
      (day < 10 ? "0" + day : day);
    vm.startTime = nowDay;
    vm.examStartTime = nowDay;
    // vm.startTime='2019-06-28';
    // vm.examStartTime='2019-06-28';
    vm.search();
    vm.getStartYearList();
  },
};
</script>