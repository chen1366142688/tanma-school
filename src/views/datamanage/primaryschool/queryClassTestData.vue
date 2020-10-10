<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">{{title}}</h2>
    </div>
    <div>
      <Card>
        <div class="top-search">
          <div class="left-input">
            <div style="margin:5px 10px;">
              <span>年级：</span>
              <Select v-model="grade" style="width:120px;">
                <Option
                  v-for="item in schoolGradeList"
                  :value="item.grade"
                  :key="item.grade"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div style="margin:5px 10px;">
              <span>班级：</span>
              <Select v-model="classId" disabled style="width:120px;">
                <Option
                  v-for="(item,index) in classList"
                  :value="item.classId"
                  :key="item.classId"
                >{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="right-btns">
            <Button type="success" @click="querySearch">查询</Button>
            <Button type="success" @click="pageToList">返回</Button>
            <Button type="success" @click="exportSchoolTestData">导出EXCEL</Button>
          </div>
        </div>
      </Card>
      <br />
      <div>
        <Card>
          <div style="font-size:18px;height:40px;">数据概览</div>
          <Row>
            <div>
              <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
            </div>
          </Row>
        </Card>
      </div>
      <div style="margin-top:20px">
        <Card>
          <div style="font-size:18px;height:40px;">数据明细</div>
          <Row>
            <div style>
              <Table border :loading="loading" :columns="overViewColumns" :data="overViewData"></Table>
            </div>
            <br />
            <!-- <div style="float: right;">
              <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
            </div>-->
          </Row>
        </Card>
      </div>
      <div :style="{marginTop:'20px'}">
        <Card>
          <div style="font-size:18px;height:40px;">数据分析</div>
          <div :style="{backgroundColor:'#FFFFFF'}">
            <Row :style="{textAlign:'center'}">
              <div
                id="myChart1"
                :style="{width: '40%', height: '400px', marginTop: '50px',display: 'inline-block'}"
              ></div>
              <div
                id="myChart2"
                :style="{width: '40%', height: '400px', marginTop: '50px',display: 'inline-block'}"
              ></div>
            </Row>
          </div>
        </Card>
      </div>
      <div :style="{marginTop:'10px'}">
        <Card>
          <div style="font-size:18px;height:40px;">平均分</div>
          <div id="myChart3" :style="{width: '100%', height: '400px'}"></div>
        </Card>
      </div>
      <div :style="{marginTop:'10px'}">
        <Card>
          <div style="font-size:18px;height:40px;">合格率</div>
          <div id="myChart4" :style="{width: '100%', height: '400px'}"></div>
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
      title: "2019学年体测",
      schoolYear: "",
      schoolId: "",
      loading: false,
      myChart1: null,
      option1: {},
      myChart2: null,
      option2: {},
      myChart3: null,
      option3: {},
      myChart4: null,
      option4: {},
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
      classId: 99,
      classList: [{ classId: 99, label: "全部" }],
      grade: 99,
      schoolGradeList: [{ grade: 99, label: "全部" }],
      resultColumns: [
        {
          title: "总人数",
          key: "studentTotalCount",
          align: "center",
        },
        {
          title: "已完成体测人数/体测总人数",
          key: "overTestCount",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              params.row.overTestCount + "/" + params.row.needJoinTestCount
            );
          },
        },
        {
          title: "免试人数",
          key: "exemptCount",
          align: "center",
        },
        {
          title: "平均分",
          key: "averageScore",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.averageScore / 100);
          },
        },
        {
          title: "优秀率",
          key: "goodCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.goodCount == 0
                ? params.row.goodCount
                : Math.floor(
                    (params.row.goodCount / params.row.overTestCount) * 100
                  ) / 100
            }%`;
            return h("div", text);
          },
        },
        {
          title: "良好率",
          key: "wellCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.wellCount == 0
                ? params.row.wellCount
                : Math.floor(
                    (params.row.wellCount / params.row.overTestCount) * 100
                  ) / 100
            }%`;
            return h("div", text);
          },
        },
        {
          title: "及格率",
          key: "passCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.passCount == 0
                ? params.row.passCount
                : Math.floor(
                    (params.row.passCount / params.row.overTestCount) * 100
                  ) / 100
            }%`;
            return h("div", text);
          },
        },
        {
          title: "合格率",
          key: "qualifiedCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.qualifiedCount == 0
                ? params.row.qualifiedCount
                : Math.floor(
                    (params.row.qualifiedCount / params.row.overTestCount) * 100
                  ) / 100
            }%`;
            return h("div", text);
          },
        },
      ],
      resultData: [],
      overViewColumns: [
        {
          title: "班级",
          key: "studentClass",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.studentClass + "班");
          },
        },
        {
          title: "总人数",
          key: "studentTotalCount",
          align: "center",
        },
        {
          title: "已完成体测人数/体测总人数",
          key: "overTestCount",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h(
              "div",
              params.row.overTestCount + "/" + params.row.needJoinTestCount
            );
          },
        },
        {
          title: "免试人数",
          key: "exemptCount",
          align: "center",
        },
        {
          title: "平均分",
          key: "averageScore",
          align: "center",
          render: (h, params) => {
            return h("div", params.row.averageScore / 100);
          },
        },
        {
          title: "优秀率",
          key: "goodCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.goodCount == 0
                ? params.row.goodCount
                : Math.floor(
                    (params.row.goodCount / params.row.overTestCount) * 100
                  )
            }%`;
            return h("div", text);
          },
        },
        {
          title: "良好率",
          key: "wellCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.wellCount == 0
                ? params.row.wellCount
                : Math.floor(
                    (params.row.wellCount / params.row.overTestCount) * 100
                  )
            }%`;
            return h("div", text);
          },
        },
        {
          title: "及格率",
          key: "passCount",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.passCount == 0
                ? params.row.passCount
                : Math.floor(
                    (params.row.passCount / params.row.overTestCount) * 100
                  )
            }%`;
            return h("div", text);
          },
        },
        {
          title: "合格率",
          key: "qualifiedCount",
          align: "center",
          width: 120,
          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.qualifiedCount == 0
                ? params.row.qualifiedCount
                : Math.floor(
                    (100 * params.row.qualifiedCount) / params.row.overTestCount
                  )
            }%`;
            return h("div", text);
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                  },
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.toDetail(params.row);
                    },
                  },
                },
                "详情"
              ),
            ]);
          },
        },
      ],
      overViewData: [],
      scorexAxisData: [],
      scoreseriesData: [],
      passSeriesData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    pageToList() {
      this.$router.go(-1);
    },
    toDetail(item) {
      var vm = this;
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-activityId",
        item.activityId
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classId",
        item.classId
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-gradeName",
        item.studentClass + "班"
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-startSchool",
        item.startSchool
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-schoolYear",
        item.schoolYear
      );
      this.$router.push({ name: "classTestResultHis" });
    },
    querySearch() {
      let vm = this;
      this.pageNum = 1;
      this.pageNo = 1;
      this.scorexAxisData = [];
      this.scoreseriesData = [];
      this.passSeriesData = [];
      this.resultData = [];
      this.search();
    },
    restore() {
      var vm = this;
      (vm.activityId = vm.activityId), (vm.grade = "");
      vm.pageNo = 1;
      vm.pageSize = 10;
      vm.registerCode = "";
      vm.studentClass = "";
      vm.studentName = "";
      vm.college = "";
      vm.major = "";
      vm.testTypeId = "";
      vm.submitStatus = "";
      let schoolId = vm.schoolId;
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value;
        // this.search()
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageNum = 1;
        this.pageSize = value;
        // this.search()
      }
    },
    exportSchoolTestData() {
      var vm = this;
      let url =
        this.$axios.defaults.baseURL +
        "/v1/testdataexport/exportTestClassData?grade=" +
        (vm.grade == 99 ? "" : vm.grade) +
        "&schoolYear=" +
        vm.schoolYear +
        "&schoolId=1&type=2" +
        "&token=" +
        sessionStorage.getItem("token");
      window.open(url);
    },
    drawGenSLine() {
      var vm = this;
      var myChart1 = this.$echarts.init(document.getElementById("myChart1"));
      myChart1.setOption(
        {
          title: {
            text: "体测情况图形分布",
            subtext: "",
            x: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} :  {d}%",
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["免试人数", "完成人数", "未参加人数", "已参加未完成人数"],
          },
          series: [
            {
              name: "占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              data: [
                { value: vm.resultData[0].exemptCount, name: "免试人数" },
                { value: vm.resultData[0].overTestCount, name: "完成人数" },
                {
                  value:
                    vm.resultData[0].needJoinTestCount -
                    vm.resultData[0].joinTestCount,
                  name: "未参加人数",
                },
                {
                  value:
                    vm.resultData[0].joinTestCount -
                    vm.resultData[0].overTestCount,
                  name: "已参加未完成人数",
                },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
                normal: {
                  color: function (params) {
                    var colorList = [
                      "#4fa995",
                      "#f1d776",
                      "#e99954",
                      "#e58467",
                    ];
                    return colorList[params.dataIndex];
                  },
                },
              },
            },
          ],
        },
        true
      );
    },
    drawGenSLine2() {
      var vm = this;
      var myChart2 = this.$echarts.init(document.getElementById("myChart2"));
      myChart2.setOption(
        {
          title: {
            text: "等级情况图形分布",
            subtext: "",
            x: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {d}%",
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["优秀数", "良好数", "及格数", "不及格数"],
          },
          series: [
            {
              name: "占比",
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              data: [
                {
                  value: vm.resultData[0].goodCount,
                  name: "优秀数",
                  itemStyle: {},
                },
                { value: vm.resultData[0].wellCount, name: "良好数" },
                { value: vm.resultData[0].passCount, name: "及格数" },
                { value: vm.resultData[0].notPassCount, name: "不及格数" },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
                normal: {
                  color: function (params) {
                    var colorList = [
                      "#4abce4",
                      "#699bc9",
                      "#bdd685",
                      "#95c685",
                    ];
                    return colorList[params.dataIndex];
                  },
                },
              },
            },
          ],
        },
        true
      );
    },
    drawBar1() {
      var vm = this;
      var myChart3 = this.$echarts.init(document.getElementById("myChart3"));
      myChart3.setOption(
        {
          title: {
            // text: '平均分',
            subtext: "",
          },
          color: "#00C693",
          xAxis: {
            type: "category",
            name: "年级",
            data: vm.scorexAxisData,
          },
          yAxis: {
            type: "value",
            name: "分",
          },
          series: [
            {
              data: vm.scoreseriesData,
              barCategoryGap: "50%", //柱图间距
              barWidth: 60, //柱图宽度
              type: "bar",
              label: {
                show: true,
                position: "top",
              },
            },
          ],
        },
        true
      );
    },
    drawBar2() {
      var vm = this;
      var myChart4 = this.$echarts.init(document.getElementById("myChart4"));
      myChart4.setOption(
        {
          title: {
            // text: '合格率',
            subtext: "",
          },
          color: "#00C693",
          xAxis: {
            type: "category",
            name: "年级",
            data: vm.scorexAxisData,
          },
          yAxis: {
            type: "value",
            name: "%",
          },
          series: [
            {
              data: vm.passSeriesData,
              barCategoryGap: "50%", //柱图间距
              barWidth: 60, //柱图宽度
              type: "bar",
              label: {
                show: true,
                position: "top",
              },
            },
          ],
        },
        true
      );
    },
    search() {
      let vm = this;
      this.$axios
        .get(
          `/v1/testdata/queryActivityStatisticsHisList?grade=${
            vm.grade == 99 ? "" : vm.grade
          }&schoolYear=${vm.schoolYear}&schoolId=${vm.schoolId}&type=2`
        )
        .then((res) => {
          if (res.data.code == 10000) {
            this.resultData = res.data.response;
            this.drawGenSLine();
            this.drawGenSLine2();
            this.$axios
              .get(
                `/v1/testdata/queryActivityStatisticsHisClassList?grade=${
                  vm.grade == 99 ? "" : vm.grade
                }&schoolYear=${vm.schoolYear}&schoolId=${vm.schoolId}&classId=${
                  vm.classId == 99 ? "" : vm.classId
                }`
              )
              .then((res) => {
                if (res.data.code == 10000) {
                  this.overViewData = res.data.response;
                  for (let val of this.overViewData) {
                    this.scorexAxisData.push(val.studentClass + "班");
                    this.scoreseriesData.push(val.averageScore / 100);
                    this.passSeriesData.push(
                      val.qualifiedCount == 0
                        ? val.qualifiedCount
                        : Math.floor(
                            (val.qualifiedCount / val.overTestCount) * 100
                          )
                    );
                  }
                  this.drawBar1();
                  this.drawBar2();
                }
              });
          }
        });
    },
  },
  watch: {},
  created() {},
  mounted() {
    let vm = this;
    let schoolId = sessionStorage.getItem("schoolId");
    vm.schoolId = schoolId;
    let SchoolYear = sessionStorage.getItem("historyData_SchoolYear");
    vm.schoolYear = SchoolYear;
    vm.title = SchoolYear + "学年体测";

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
      vm.grade = parseInt(
        sessionStorage.getItem("gradeTestData_grade")
          ? sessionStorage.getItem("gradeTestData_grade")
          : ""
      );
      console.log(vm.grade);
      vm.search();
    }
  },
};
</script>