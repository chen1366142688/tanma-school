<template>
  <div>
    <div>
      <h1>{{schoolName}}-{{startSchool}}级 - {{gradeName}}</h1>
    </div>
    <Card style="margin-top:15px;">
      <div>
        <div>
          <div class="top-search">
              <div class="left-input">
                    <div style="margin:5px 20px;">
                        <span>性别：</span>
                        <Select v-model="gender" size="small" style="width:180px;">
                            <Option
                            v-for="item in genderType"
                            :value="item.typeId"
                            :key="item.typeId"
                            >{{ item.typeName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>是否免试：</span>
                        <Select v-model="exemptStatus" size="small" style="width:120px;">
                            <Option
                            v-for="item in exemptStatusType"
                            :value="item.typeId"
                            :key="item.typeId"
                            >{{ item.typeName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span style="margin-left:40px;">学籍号：</span>
                        <Input v-model="registerCode" size="small" placeholder="学生学籍号" style="width: 180px;"/>
                    </div>
                </div>
                <div class="right-btns">
                    <Button v-on:click="getTeacherList()" type="success" >查询</Button>
                    <Button v-on:click="pageToList()" type="success" >返回</Button>
                </div>
          </div>
          <Row :gutter="16" type="flex" style="margin-top:15px;" align="middle">
            <Col span="20" style="font-size:18px;" offset="1">
              <font style="margin-right:50px;">总数：{{allCount}}人</font>
              <font style="margin-right:50px;">免试：{{exemptCount}}人</font>
              <font style="margin-right:50px;color:red;">未测试完成：{{noTestCount}}人</font>
              <font style="margin-right:50px;">测试完成：{{overCount}}人</font>
              <font style="margin-right:50px;">优秀：{{excellentCount}}人</font>
              <font style="margin-right:50px;">良好：{{wellCount}}人</font>
              <font style="margin-right:50px;">及格：{{passCount}}人</font>
              <font style="margin-right:50px;color:red;">不及格：{{noPassCount}}人</font>
            </Col>
          </Row>
        </div>
        <br>
        <div>
          <Row>
            <div>
              <Table border :columns="resultColumns" :data="resultData"></Table>
            </div>
          </Row>
        </div>
      </div>
    </Card>
    <div style="margin-top:20px;text-align:center;padding-bottom:50px;">
      <Button @click="pageToList" style="width:100px;" type="success">返回</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "teacherList",
  data() {
    return {
      activityId: "",
      classId: "",
      collegeName: "",
      majorName: "",
      gradeName: "",
      startSchool: "",
      subordinateSchoolId:"",
      schoolId: "",
      gender: "",
      registerCode: "",
      allCount: 0,
      overCount: 0,
      excellentCount: 0,
      wellCount: 0,
      passCount: 0,
      noPassCount: 0,
      schoolName:"",
      exemptCount: 0,
      noTestCount: 0,
      genderType: [
        {
          typeId: "",
          typeName: "全部"
        },
        {
          typeId: 1,
          typeName: "男生"
        },
        {
          typeId: 2,
          typeName: "女生"
        }
      ],
      primaryColumns: [
        {
          title: "姓名",
          key: "studentName",
          align: "center",
          width: 100
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          width: 80,
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
          width: 120
        },
        {
          title: "身高",
          key: "height",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.height != null ? params.row.height + "cm" : ""
              )
            ]);
          }
        },
        {
          title: "体重",
          key: "weight",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.weight != null ? params.row.weight + "kg" : ""
              )
            ]);
          }
        },
        {
          title: "肺活量",
          key: "vitalCapacityValue",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.vitalCapacityValue != null
                  ? params.row.vitalCapacityValue + "ml"
                  : ""
              )
            ]);
          }
        },
        {
          title: "50米跑",
          key: "runFiftyValue",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runFiftyValue != null
                  ? params.row.runFiftyValue + "s"
                  : ""
              )
            ]);
          }
        },
        // {
        //   title: '立定跳远',
        //   key: 'standingJumpValue',
        //   align: 'center',
        //   width: 100,
        //   render: (h, params) => {
        //     return h('div', [
        //       h(
        //         'span',
        //         params.row.standingJumpValue != null
        //           ? params.row.standingJumpValue + 'cm'
        //           : ''
        //       )
        //     ])
        //   }
        // },
        {
          title: "坐位体前屈",
          key: "sitAndReachValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.sitAndReachValue != null
                  ? params.row.sitAndReachValue + "cm"
                  : ""
              )
            ]);
          }
        },
        {
          title: "一分钟仰卧起坐",
          key: "oneMinuteSitUpValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.oneMinuteSitUpValue != null
                  ? params.row.oneMinuteSitUpValue + "次"
                  : ""
              )
            ]);
          }
        },
        {
          title: "一分钟跳绳",
          key: "oneMinuteSitUpValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.oneMinuteRopeSkippingValue != null
                  ? params.row.oneMinuteRopeSkippingValue + "次"
                  : ""
              )
            ]);
          }
        },
        {
          title: "50米X8往返跑",
          key: "oneMinuteSitUpValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runFiftyEightValue != null
                  ? params.row.runFiftyEightValue + "s"
                  : ""
              )
            ]);
          }
        },
        {
          title: "总得分",
          key: "totalScore",
          align: "center",
          width: 130,
          render: (h, params) => {
            if (params.row.totalScoreLevel == "5") {
              return h("div", [h("span", "未完成测试")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.totalScore != null
                    ? params.row.totalScore + "分"
                    : ""
                )
              ]);
            }
          }
        },
        {
          title: "得分等级",
          key: "totalScoreLevel",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.totalScoreLevel == "6"
                  ? "免试"
                  : params.row.totalScoreLevel == "1"
                  ? "优秀"
                  : params.row.totalScoreLevel == "2"
                  ? "良好"
                  : params.row.totalScoreLevel == "3"
                  ? "及格"
                  : params.row.totalScoreLevel == "4"
                  ? "不及格"
                  : ""
              )
            ]);
          }
        }
      ],
      highSchoolColumns: [
        {
          title: "姓名",
          key: "studentName",
          align: "center",
          width: 100
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          width: 80,
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
          width: 120
        },
        {
          title: "身高",
          key: "height",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.height != null ? params.row.height + "cm" : ""
              )
            ]);
          }
        },
        {
          title: "体重",
          key: "weight",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.weight != null ? params.row.weight + "kg" : ""
              )
            ]);
          }
        },
        {
          title: "肺活量",
          key: "vitalCapacityValue",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.vitalCapacityValue != null
                  ? params.row.vitalCapacityValue + "ml"
                  : ""
              )
            ]);
          }
        },
        {
          title: "50米跑",
          key: "runFiftyValue",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runFiftyValue != null
                  ? params.row.runFiftyValue + "s"
                  : ""
              )
            ]);
          }
        },
        {
          title: "立定跳远",
          key: "standingJumpValue",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.standingJumpValue != null
                  ? params.row.standingJumpValue + "cm"
                  : ""
              )
            ]);
          }
        },
        {
          title: "坐位体前屈",
          key: "sitAndReachValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.sitAndReachValue != null
                  ? params.row.sitAndReachValue + "cm"
                  : ""
              )
            ]);
          }
        },
        {
          title: "800米跑(女)",
          key: "runEightHundredValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runEightHundredValue != null
                  ? params.row.runEightHundredValue + "min"
                  : ""
              )
            ]);
          }
        },
        {
          title: "一分钟仰卧起坐(女)",
          key: "oneMinuteSitUpValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.oneMinuteSitUpValue != null
                  ? params.row.oneMinuteSitUpValue + "次"
                  : ""
              )
            ]);
          }
        },
        {
          title: "1000米跑(男)",
          key: "runThousandValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runThousandValue != null
                  ? params.row.runThousandValue + "min"
                  : ""
              )
            ]);
          }
        },
        {
          title: "引体向上(男)",
          key: "pullUpsValue",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.pullUpsValue != null
                  ? params.row.pullUpsValue + "次"
                  : ""
              )
            ]);
          }
        },
        {
          title: "总得分",
          key: "totalScore",
          align: "center",
          width: 130,
          render: (h, params) => {
            if (params.row.totalScoreLevel == "5") {
              return h("div", [h("span", "未完成测试")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.totalScore != null
                    ? params.row.totalScore + "分"
                    : ""
                )
              ]);
            }
          }
        },
        {
          title: "得分等级",
          key: "totalScoreLevel",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.totalScoreLevel == "6"
                  ? "免试"
                  : params.row.totalScoreLevel == "1"
                  ? "优秀"
                  : params.row.totalScoreLevel == "2"
                  ? "良好"
                  : params.row.totalScoreLevel == "3"
                  ? "及格"
                  : params.row.totalScoreLevel == "4"
                  ? "不及格"
                  : ""
              )
            ]);
          }
        }
      ],
      resultColumns: [],
      resultData: [],
      exemptStatus: "",
      exemptStatusType: [
        {
          typeId: "",
          typeName: "全部"
        },
        {
          typeId: 1,
          typeName: "免试"
        },
        {
          typeId: 2,
          typeName: "未免试"
        }
      ]
    };
  },
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    getTeacherList() {
      this.$axios
        .get(
          "/v1/testdata/test/class/result?schoolId=" +
            this.subordinateSchoolId +
            "&classId=" +
            this.classId +
            "&activityId=" +
            this.activityId +
            "&gender=" +
            this.gender +
            "&registerCode=" +
            this.registerCode +
            "&exemptStatus=" +
            this.exemptStatus
        )
        .then(res => {
          if (res.data.code == 10000) {
            let list = res.data.response;
            this.allCount = list.length;
            this.overCount = 0;
            this.excellentCount = 0;
            this.wellCount = 0;
            this.passCount = 0;
            this.noPassCount = 0;
            this.exemptCount = 0;
            this.noTestCount = 0;

            for (let i = 0; i < list.length; i++) {
              let gender = list[i].gender;
              let grade = list[i].grade;

              if (gender == "1") {
                if (grade > 0 && grade < 3) {
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteRopeSkippingValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                } else if (grade > 2 && grade < 5) {
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteSitUpValue == null ||
                    list[i].oneMinuteRopeSkippingValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                } else if (grade > 4 && grade < 7) {
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteSitUpValue == null ||
                    list[i].runFiftyEightValue == null ||
                    list[i].oneMinuteRopeSkippingValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                }else{
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].standingJumpValue == null ||
                    list[i].runThousandValue == null ||
                    list[i].pullUpsValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                }
              } else {
                if (grade > 0 && grade < 3) {
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteRopeSkippingValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                } else if (grade > 2 && grade < 5) {
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteSitUpValue == null ||
                    list[i].oneMinuteRopeSkippingValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                } else if (grade > 4 && grade < 7) {
                  if (
                    list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteSitUpValue == null ||
                    list[i].runFiftyEightValue == null ||
                    list[i].oneMinuteRopeSkippingValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                }else{
                  if (
                   list[i].height == null ||
                    list[i].weight == null ||
                    list[i].vitalCapacityValue == null ||
                    list[i].runFiftyValue == null ||
                    list[i].sitAndReachValue == null ||
                    list[i].oneMinuteSitUpValue == null ||
                    list[i].standingJumpValue == null ||
                    list[i].runEightHundredValue == null
                  ) {
                    list[i].totalScoreLevel = 5;
                  } else {
                    this.overCount = this.overCount + 1;
                  }
                }
              }


              if (list[i].haveExempt == "1") {
                list[i].totalScoreLevel = "6";
                this.exemptCount = this.exemptCount + 1;
              }
              if (list[i].totalScoreLevel == "1") {
                this.excellentCount = this.excellentCount + 1;
              } else if (list[i].totalScoreLevel == "2") {
                this.wellCount = this.wellCount + 1;
              } else if (list[i].totalScoreLevel == "3") {
                this.passCount = this.passCount + 1;
              } else if (list[i].totalScoreLevel == "4") {
                this.noPassCount = this.noPassCount + 1;
              } else if (list[i].totalScoreLevel == "5") {
                this.noTestCount = this.noTestCount + 1;
              }
              if (list[i].runEightHundredValue != null) {
                list[i].runEightHundredValue =
                  Math.floor(list[i].runEightHundredValue / 60) +
                  "'" +
                  (list[i].runEightHundredValue % 60);
              }
              if (list[i].runThousandValue != null) {
                list[i].runThousandValue =
                  Math.floor(list[i].runThousandValue / 60) +
                  "'" +
                  (list[i].runThousandValue % 60);
              }
            }
            this.resultData = list;
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    }
  },
  watch: {
    //   provinceId:'getCityList',
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    var vm = this;
    let schoolType = sessionStorage.getItem("schoolType");
    if (schoolType == "2") {
      vm.resultColumns = vm.primaryColumns;
    } else {
      vm.resultColumns = vm.highSchoolColumns;
    }
    this.activityId = sessionStorage.getItem(
      "subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-activityId"
    );
    this.classId = sessionStorage.getItem(
      "subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-classId"
    );
    this.gradeName = sessionStorage.getItem(
      "subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-gradeName"
    );
    this.startSchool = sessionStorage.getItem(
      "subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-startSchool"
    );
    this.subordinateSchoolId = sessionStorage.getItem('subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-subordinateSchoolId');
    this.schoolName = sessionStorage.getItem('subordinateSchoolList-subordinateSchoolTestData-schoolName');
    this.getTeacherList();
  }
};
</script>
