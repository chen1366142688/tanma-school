<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">{{schoolYear}}学年体测-{{startSchool}}级 - {{gradeName}}</h2>
    </div>

      <div>
        <div>
          <Card>
            <div class="top-search">
              <div class="left-input">
                <div style="margin:5px 10px;">
                  <span>性<span style="visibility: hidden;">占位</span>别：</span>
                  <Select v-model="gender"  style="width:120px;">
                    <Option
                      v-for="item in genderType"
                      :value="item.typeId"
                      :key="item.typeId"
                    >{{ item.typeName }}</Option>
                  </Select>
                </div>
                <div style="margin:5px 10px;">
                  <span>是否免试：</span>
                  <Select v-model="exemptStatus" style="width:120px;">
                    <Option
                      v-for="item in exemptStatusType"
                      :value="item.typeId"
                      :key="item.typeId"
                    >{{ item.typeName }}</Option>
                  </Select>
                </div>
                <div style="margin:5px 10px;">
                  <span>学籍号<span style="visibility:hidden">占</span>：</span>
                  <Input v-model="registerCode" placeholder="学生学籍号" style="width: 120px;"/>
                </div>
              </div>
              <div class="right-btns">
                <Button
                  v-on:click="getTeacherList()"
                  type="success"
                >查询</Button>
                <Button
                  v-on:click="pageToList()"
                  type="success"
                >返回</Button>
              </div>
            </div>
         </Card>
        </div>
        <Card style="margin-top:20px;" >
          <div style="color:#333333;margin-bottom:10px;">
              <font style="margin-right:50px;">总数：{{allCount}}人</font>
              <font style="margin-right:50px;">免试：{{exemptCount}}人</font>
              <font style="margin-right:50px;color:#F87D00;">未测试完成：{{noTestCount}}人</font>
              <font style="margin-right:50px;">测试完成：{{overCount}}人</font>
              <font style="margin-right:50px;">优秀：{{excellentCount}}人</font>
              <font style="margin-right:50px;">良好：{{wellCount}}人</font>
              <font style="margin-right:50px;">及格：{{passCount}}人</font>
              <font style="margin-right:50px;color:#F87D00;">不及格：{{noPassCount}}人</font>
          </div>
          <div>
            <Row>
              <div>
                <Table border max-height="650" :columns="resultColumns" :data="resultData"></Table>
              </div>
            </Row>
          </div>
        </Card>
        <div style="margin-top:20px">
          <Card>
            <div id="myChart3" style="width:100%;height:400px"></div>
          </Card>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "teacherList",
  data() {
    return {
      scorexAxisData:[],
      scoreseriesData:[],
      activityId: "",
      classId: "",
      collegeName: "",
      majorName: "",
      gradeName: "",
      schoolYear:"",
      startSchool: "",
      schoolId: "",
      gender: "",
      registerCode: "",
      allCount: 0,
      overCount: 0,
      excellentCount: 0,
      wellCount: 0,
      passCount: 0,
      noPassCount: 0,
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
          width: 70,
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
          width: 70,
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
          width: 60,
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
          width: 60,
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
          width: 70,
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
          width: 100,
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
          width: 70,
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runFiftyEightValue != null
                  ? params.row.runFiftyEightValue + "m‘s“"
                  : ""
              )
            ]);
          }
        },
        {
                title: '裸眼视力',
                key: 'resultValue',
                align: 'center',
                width: 80,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+row.leftVision+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+row.rightVision+"</div>"
                        }else{
                          text="未完成测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: text
                            }
                        });
                    }
                },
                {
                title: '串镜',
                key: 'createTime',
                width: 170,
                align: 'center',
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        console.log(row.leftVision);
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+(row.leftMirror=="0"?"正常":row.leftMirror=="1"?"正片上升、负片下降":row.leftMirror=="-1"?"正片下降、负片上升":row.leftMirror=="2"?"其他":row.leftMirror=="9"?"未测试":"--")+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightMirror=="0"?"正常":row.rightMirror=="1"?"正片上升、负片下降":row.rightMirror=="-1"?"正片下降、负片上升":row.rightMirror=="2"?"其他":row.rightMirror=="9"?"未测试":"--")+"</div>"
                        }else{
                          text="未完成测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: text
                            }
                        });
                    }
                },
                {
                title: '屈光不正',
                key: 'createTime',
                align: 'center',
                width: 100,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;' >&nbsp;&nbsp;左眼："+(row.leftLight=="0"?"正常":row.leftLight=="1"?"近视":row.leftLight=="2"?"远视":row.leftLight=="3"?"其他":"未测试")+"</div>"
                            text+='<div  style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightLight=="0"?"正常":row.rightLight=="1"?"近视":row.rightLight=="2"?"远视":row.rightLight=="3"?"其他":"未测试")+"</div>"
                        }else{
                          text="未完成测试"
                        }

                        return h("div", {
                            domProps: {
                            innerHTML: text
                            }
                        });
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
                    ? params.row.totalScore.toFixed(1) + "分"
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
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.totalScoreLevel == "6") {
            } else {
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
                          params.row.registerCode,
                          params.row.gender,
                          params.row.grade
                        );
                      }
                    }
                  },
                  "编辑"
                )
              ]);
            }
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
          width: 60,
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
          width: 60,
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
          width: 60,
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
          width: 60,
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
          width: 60,
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
          width: 70,
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
          width: 70,
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
          width: 80,
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
          width: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.runThousandValue != null
                  ? params.row.runThousandValue + "m's"
                  : ""
              )
            ]);
          }
        },
        {
          title: "引体向上(男)",
          key: "pullUpsValue",
          align: "center",
          width: 70,
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
                title: '裸眼视力',
                key: 'resultValue',
                align: 'center',
                width: 80,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+row.leftVision+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+row.rightVision+"</div>"
                        }else{
                          text="未完成测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: text
                            }
                        });
                    }
                },
                {
                title: '串镜',
                key: 'createTime',
                width: 170,
                align: 'center',
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+(row.leftMirror=="0"?"正常":row.leftMirror=="1"?"正片上升、负片下降":row.leftMirror=="-1"?"正片下降、负片上升":row.leftMirror=="2"?"其他":row.leftMirror=="9"?"未测试":"--")+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightMirror=="0"?"正常":row.rightMirror=="1"?"正片上升、负片下降":row.rightMirror=="-1"?"正片下降、负片上升":row.rightMirror=="2"?"其他":row.rightMirror=="9"?"未测试":"--")+"</div>"
                        }else{
                          text="未完成测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: text
                            }
                        });
                    }
                },
                {
                title: '屈光不正',
                key: 'createTime',
                align: 'center',
                width: 90,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;' >&nbsp;&nbsp;左眼："+(row.leftLight=="0"?"正常":row.leftLight=="1"?"近视":row.leftLight=="2"?"远视":row.leftLight=="3"?"其他":"未测试")+"</div>"
                            text+='<div  style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightLight=="0"?"正常":row.rightLight=="1"?"近视":row.rightLight=="2"?"远视":row.rightLight=="3"?"其他":"未测试")+"</div>"
                        }else{
                          text="未完成测试"
                        }

                        return h("div", {
                            domProps: {
                            innerHTML: text
                            }
                        });
                    }
                },
        {
          title: "总得分",
          key: "totalScore",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.totalScoreLevel == "5") {
              return h("div", [h("span", "未完成测试")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.totalScore != null
                    ? params.row.totalScore.toFixed(1) + "分"
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
          width: 80,
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
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.totalScoreLevel == "6") {
            } else {
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
                          params.row.registerCode,
                          params.row.gender,
                          params.row.grade
                        );
                      }
                    }
                  },
                  "编辑"
                )
              ]);
            }
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
    toClassTestDetail(studentId, studentName, registerCode, gender,gradeId) {
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-activityId",
        this.activityId
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-classId",
        this.classId
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-studentId",
        studentId
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-studentName",
        studentName
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-gradeName",
        this.gradeName
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-startSchool",
        this.startSchool
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-registerCode",
        registerCode
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-gender",
        gender
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-gradeId",
        gradeId
      );
      this.$router.push({ name: "classTestDetail" });
    },
    drawBar() {
      var vm = this;
      var myChart3 = this.$echarts.init(document.getElementById("myChart3"));
      myChart3.setOption({
          title:{
              // text: '平均分',
              subtext: ''
          },
          color:'#00C693',
          tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: '',
                label: {
                    show: true
                }
            }
        },
        grid: {
            bottom: '2%',
            left: '1%',
            right: '1%',
            containLabel: true
        },
          xAxis: {
              type: 'category',
              name:'学生',
              data: vm.scorexAxisData,
              axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                show: true,
                rotate:-45,
                interval:0
              },
          },
          calculable : true,
          dataZoom: [
            {
              type: 'inside',
              show: true,
              start: 0,
              end: 90,
              orient:'horizontal',
              zoomLock:true
            }
        ],
          yAxis: {
              type: 'value',
              name:'分'
          },
          series: [{
              barCategoryGap:'50%',//柱图间距
              // barWidth : 40,//柱图宽度
              data: vm.scoreseriesData,
              type: 'bar',
              label:{
                show:true,
                position:'top'
              }
          }]
      },true)
    },
    getClassTotal(grade){
       let vm = this;
        this.$axios
              .get(
                '/v1/testdata/queryActivityStatisticsHisClassList?grade='+grade+'&schoolId='+this.schoolId+'&classId='+this.classId+"&schoolYear="+vm.schoolYear
              )
              .then(res => {
                if (res.data.code == 10000) {
                  let overViewData = res.data.response
                    this.allCount = overViewData[0].studentTotalCount;
                    this.overCount = overViewData[0].overTestCount;
                    this.excellentCount = overViewData[0].goodCount;
                    this.wellCount = overViewData[0].wellCount;
                    this.passCount = overViewData[0].passCount;
                    this.noPassCount = overViewData[0].notPassCount;
                    this.exemptCount = overViewData[0].exemptCount;
                    this.noTestCount = overViewData[0].needJoinTestCount-overViewData[0].overTestCount;
                }
              })
    },
    getTeacherList() {
      this.$axios
        .get(
          "/v1/testdata/queryActivityStatisticsHisClassDetail?schoolId=" +
            this.schoolId +
            "&classId=" +
            this.classId +
            "&activityId=" +
            this.activityId +
            "&gender=" +
            this.gender +
            "&registerCode=" +
            this.registerCode +
            "&exemptStatus=" +
            this.exemptStatus +
            "&schoolYear=" +
            this.schoolYear
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
            if(list && list.length > 0 ){
                this.getClassTotal(list[0].grade);
            }
            this.scorexAxisData=[];
            this.scoreseriesData=[];
            for (let i = 0; i < list.length; i++) {
              let gender = list[i].gender;
              let grade = list[i].grade;
              this.scorexAxisData.push(list[i].studentName)
              this.scoreseriesData.push(list[i].totalScore)
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
                  }
                }
              }


              if (list[i].haveExempt == "1") {
                list[i].totalScoreLevel = "6";
              }
              if (list[i].totalScoreLevel == "1") {
                this.excellentCount = this.excellentCount + 1;
              } else if (list[i].totalScoreLevel == "2") {
              } else if (list[i].totalScoreLevel == "3") {
              } else if (list[i].totalScoreLevel == "4") {
              } else if (list[i].totalScoreLevel == "5") {
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
              if (list[i].runFiftyEightValue != null) {
                list[i].runFiftyEightValue =
                  Math.floor(list[i].runFiftyEightValue / 60) +
                  "'" +
                  (list[i].runFiftyEightValue % 60);
              }
            }
            this.resultData = list;
            this.drawBar()
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
      "studentManage-schoolTestData-classTestResult-activityId"
    );
    this.classId = sessionStorage.getItem(
      "studentManage-schoolTestData-classTestResult-classId"
    );
    this.gradeName = sessionStorage.getItem(
      "studentManage-schoolTestData-classTestResult-gradeName"
    );
    this.startSchool = sessionStorage.getItem(
      "studentManage-schoolTestData-classTestResult-startSchool"
    );
    this.schoolYear = sessionStorage.getItem(
      "studentManage-schoolTestData-classTestResult-schoolYear"
    );
    this.schoolId = sessionStorage.getItem("schoolId");
    this.getTeacherList();
  }
};
</script>
