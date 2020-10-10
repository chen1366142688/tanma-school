<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">历史数据查询</h2>
    </div>
    <div>
      <Card>
        <div class="top-search">
          <div class="left-input">
            <div style="margin:5px 10px;">
              <span>体测年级：</span>
              <Select v-model="grade" style="width:120px;">
                <Option
                  v-for="item in schoolGradeList"
                  :value="item.grade"
                  :key="item.grade"
                >{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="right-btns">
            <Button type="success" @click="querySearch">查询</Button>
            <Button type="success" style="margin-left:40px;" @click="exportSchoolTestData">导出EXCEL</Button>
          </div>
        </div>
      </Card>
      <div>
        <Card :dis-hover="true">
          <div style="font-size:18px;height:40px;">数据明细</div>
          <Row>
            <div style>
              <Table border :loading="loading" :columns="overViewColumns" :data="overViewData"></Table>
            </div>
            <br />
          </Row>
        </Card>
      </div>
      <div :style="{marginTop:'20px'}">
        <Card :dis-hover="true">
          <div id="myCharts" :style="{width: '100%', height: '600px'}"></div>
          <div id="myChart" :style="{width: '100%', height: '600px',marginTop: '50px'}"></div>
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
      schoolYear: "",
      schoolId: "",
      type: 2,
      grade: 99,
      schoolGradeList: [{ grade: 99, label: "全校" }],
      overViewColumns: [
        {
          title: "学年",
          key: "schoolYear",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("div", params.row.schoolYear + "学年");
          },
        },
        {
          title: "年级",
          key: "grade",
          align: "center",
                    minWidth: 100,

          render: (h, params) => {
            return h(
              "div",
              params.row.grade == 1
                ? "一年级"
                : params.row.grade == 2
                ? "二年级"
                : params.row.grade == 3
                ? "三年级"
                : params.row.grade == 2
                ? "四年级"
                : params.row.grade == 5
                ? "五年级"
                : params.row.grade == 6
                ? "六年级"
                : params.row.grade == 7
                ? "七年级"
                : params.row.grade == 8
                ? "八年级"
                : params.row.grade == 9
                ? "九年级"
                : params.row.grade == 10
                ? "高一"
                : params.row.grade == 11
                ? "高二"
                : params.row.grade == 12
                ? "高三"
                : "全校"
            );
          },
        },
        {
          title: "总人数",
          key: "studentTotalCount",
          align: "center",
                    minWidth: 100,

        },
        {
          title: "完成体测人数/体测总人数",
          key: "overTestCount",
          align: "center",
          minWidth: 100,

          render: (h, params) => {
            return h(
              "div",
              params.row.overTestCount + "/" + params.row.joinTestCount
            );
          },
        },
        {
          title: "免试人数",
          key: "exemptCount",
          align: "center",
                    minWidth: 100,

        },
        {
          title: "平均分",
          key: "averageScore",
          align: "center",
                    minWidth: 100,

          render: (h, params) => {
            return h("div", params.row.averageScore / 100);
          },
        },
        {
          title: "优秀率",
          key: "goodCount",
          align: "center",
                    minWidth: 100,

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
                    minWidth: 100,

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
                    minWidth: 100,

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
                    minWidth: 100,

          render: (h, params) => {
            const row = params.row;
            const text = `${
              params.row.qualifiedCount == 0
                ? params.row.qualifiedCount
                : Math.floor(
                    (params.row.qualifiedCount / params.row.overTestCount) * 100
                  )
            }%`;
            return h("div", text);
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
                    minWidth: 100,

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
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    toDetail(item) {
      var vm = this;
      sessionStorage.setItem("historyData_grade", item.grade);
      sessionStorage.setItem("historyData_SchoolYear", item.schoolYear);
      this.$router.push({ name: "queryGradeTestData" });
    },
    querySearch() {
      this.pageNum = 1;
      this.pageNo = 1;
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
        this.search();
      }
    },
    pageSizechange(value) {
      //页面高小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value;
        this.search();
      }
    },
    search() {
      this.$axios
        .get(
          `/v1/testdata/queryActivityStatisticsHisList?grade=${
            this.grade == 99 ? "" : this.grade
          }&schoolYear=${this.schoolYear}&schoolId=${this.schoolId}&type=2`
        )
        .then((res) => {
          if (res.data.code == 10000) {
            this.overViewData = res.data.response;
            this.$axios
              .get(
                `/v1/testdata/queryActivityStatisticsHisList?grade=${
                  this.grade == 99 ? "" : this.grade
                }&schoolYear=${this.schoolYear}&schoolId=${
                  this.schoolId
                }&type=1`
              )
              .then((res) => {
                if (res.data.code == 10000) {
                  this.drawGen(res.data.response);
                  this.drawGen1(res.data.response);
                }
              });
          }
        });
    },
    exportSchoolTestData() {
      var vm = this;
      let url =
        this.$axios.defaults.baseURL +
        "/v1/testdataexport/exportTestHistoryData?grade=" +
        (vm.grade == 99 ? "" : vm.grade) +
        "&schoolYear=" +
        vm.schoolYear +
        "&schoolId=1&type=2" +
        "&token=" +
        sessionStorage.getItem("token");
      window.open(url);
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((a) => !res.has(a) && res.set(a, 1));
    },
    drawGen(result) {
      var vm = this;
      let myCharts = this.$echarts.init(document.getElementById("myCharts"));
      let legendDataDault = [],
        legendData = [],
        xAxisData = [];
      for (let val of result) {
        legendDataDault.push(
          val.grade == 1
            ? "一年级"
            : val.grade == 2
            ? "二年级"
            : val.grade == 3
            ? "三年级"
            : val.grade == 4
            ? "四年级"
            : val.grade == 5
            ? "五年级"
            : val.grade == 6
            ? "六年级"
            : val.grade == 7
            ? "七年级"
            : val.grade == 8
            ? "八年级"
            : val.grade == 9
            ? "九年级"
            : val.grade == 10
            ? "高一"
            : val.grade == 11
            ? "高二"
            : val.grade == 12
            ? "高三"
            : "全校"
        );
        legendData.push(
          val.grade == 1
            ? "一年级"
            : val.grade == 2
            ? "二年级"
            : val.grade == 3
            ? "三年级"
            : val.grade == 4
            ? "四年级"
            : val.grade == 5
            ? "五年级"
            : val.grade == 6
            ? "六年级"
            : val.grade == 7
            ? "七年级"
            : val.grade == 8
            ? "八年级"
            : val.grade == 9
            ? "九年级"
            : val.grade == 10
            ? "高一"
            : val.grade == 11
            ? "高二"
            : val.grade == 12
            ? "高三"
            : "全校"
        );
        xAxisData.push(val.schoolYear + "学年");
      }
      legendData = this.unique(legendData);
      xAxisData = this.unique(xAxisData);
      legendDataDault = this.unique(legendDataDault);
      legendData = legendData.map((v, i, arr) => {
        let json = {};
        json.name = v;
        json.data = [];
        json.type = "line";
        return json;
      });
      for (let vals of result) {
        for (let val1 of legendData) {
          let grade =
            vals.grade == 1
              ? "一年级"
              : vals.grade == 2
              ? "二年级"
              : vals.grade == 3
              ? "三年级"
              : vals.grade == 4
              ? "四年级"
              : vals.grade == 5
              ? "五年级"
              : vals.grade == 6
              ? "六年级"
              : vals.grade == 7
              ? "七年级"
              : vals.grade == 8
              ? "八年级"
              : vals.grade == 9
              ? "九年级"
              : vals.grade == 10
              ? "高一"
              : vals.grade == 11
              ? "高二"
              : vals.grade == 12
              ? "高三"
              : "全校";
          if (grade == val1.name) {
            val1.data.push(
              vals.averageScore == null ? 0 : vals.averageScore / 100
            );
          }
        }
      }
      myCharts.setOption(
        {
          title: {
            text: "平均分",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: legendDataDault,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            name: "学年",
            boundaryGap: false,
            data: xAxisData,
          },
          yAxis: {
            type: "value",
            name: "分",
            max: 100,
            interval: 10,
          },
          series: legendData,
        },
        true
      );
    },
    drawGen1(result) {
      var vm = this;
      console.log(result);
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let legendDataDault = [],
        legendData = [],
        xAxisData = [];
      for (let val of result) {
        legendDataDault.push(
          val.grade == 1
            ? "一年级"
            : val.grade == 2
            ? "二年级"
            : val.grade == 3
            ? "三年级"
            : val.grade == 4
            ? "四年级"
            : val.grade == 5
            ? "五年级"
            : val.grade == 6
            ? "六年级"
            : val.grade == 7
            ? "七年级"
            : val.grade == 8
            ? "八年级"
            : val.grade == 9
            ? "九年级"
            : val.grade == 10
            ? "高一"
            : val.grade == 11
            ? "高二"
            : val.grade == 12
            ? "高三"
            : "全校"
        );
        legendData.push(
          val.grade == 1
            ? "一年级"
            : val.grade == 2
            ? "二年级"
            : val.grade == 3
            ? "三年级"
            : val.grade == 4
            ? "四年级"
            : val.grade == 5
            ? "五年级"
            : val.grade == 6
            ? "六年级"
            : val.grade == 7
            ? "七年级"
            : val.grade == 8
            ? "八年级"
            : val.grade == 9
            ? "九年级"
            : val.grade == 10
            ? "高一"
            : val.grade == 11
            ? "高二"
            : val.grade == 12
            ? "高三"
            : "全校"
        );
        xAxisData.push(val.schoolYear + "学年");
      }
      legendData = this.unique(legendData);
      xAxisData = this.unique(xAxisData);
      legendDataDault = this.unique(legendDataDault);
      legendData = legendData.map((v, i, arr) => {
        let json = {};
        json.name = v;
        json.data = [];
        json.type = "line";
        return json;
      });
      for (let vals of result) {
        for (let val1 of legendData) {
          let grade =
            vals.grade == 1
              ? "一年级"
              : vals.grade == 2
              ? "二年级"
              : vals.grade == 3
              ? "三年级"
              : vals.grade == 4
              ? "四年级"
              : vals.grade == 5
              ? "五年级"
              : vals.grade == 6
              ? "六年级"
              : vals.grade == 7
              ? "七年级"
              : vals.grade == 8
              ? "八年级"
              : vals.grade == 9
              ? "九年级"
              : vals.grade == 10
              ? "高一"
              : vals.grade == 11
              ? "高二"
              : vals.grade == 12
              ? "高三"
              : "全校";
          if (grade == val1.name) {
            val1.data.push(
              vals.qualifiedCount == null || vals.qualifiedCount == 0
                ? 0
                : Math.floor((vals.qualifiedCount / vals.overTestCount) * 100)
            );
          }
        }
      }
      console.log(legendData);
      myChart.setOption(
        {
          title: {
            text: "合格率",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: legendDataDault,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            name: "学年",
            boundaryGap: false,
            data: xAxisData,
          },
          yAxis: {
            type: "value",
            name: "%",
            max: 100,
            interval: 10,
          },
          series: legendData,
        },
        true
      );
    },
  },
  watch: {},
  created() {},
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this;
    let schoolId = sessionStorage.getItem("schoolId");
    vm.schoolId = schoolId;
    if (schoolId) {
      vm.search();
    }
    let schoolType = sessionStorage.getItem("schoolType");
    if (schoolType) {
      if ("0" == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList);
      }
      if ("2" == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList);
      }
      if ("3" == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList);
      }
      if ("4" == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList);
      }
    }
  },
};
</script>