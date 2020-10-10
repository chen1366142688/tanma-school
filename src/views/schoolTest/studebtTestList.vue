<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">学生测试信息</h2>
    </div>
      <div>
        <div>
          <Card>
            <div class="top-search">
                <div class="left-input">
                    <div style="margin:5px 20px;">
                        <span>年级：</span>
                        <Select v-model="grade"  style="width:120px;">
                            <Option
                                v-for="item in schoolGradeList"
                                :value="item.grade"
                                :key="item.grade"
                            >{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>班级：</span>
                        <Select v-model="studentClass"  style="width:120px;">
                            <Option
                                v-for="item in classList"
                                :value="item.value"
                                :key="item.value"
                            >{{ item.label }}</Option>
                        </Select>
                    </div>
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
                        <span>等级：</span>
                        <Select v-model="scoreLevel"  style="width:120px;">
                            <Option
                                v-for="item in scoreLevelList"
                                :value="item.typeId"
                                :key="item.typeId"
                            >{{ item.typeName }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>姓名：</span>
                        <Input v-model="studentName" placeholder="学生姓名" style="width: 120px;"/>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>学籍号：</span>
                        <Input v-model="registerCode" placeholder="学生学籍号" style="width: 120px;"/>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>是否免试：</span>
                        <Select v-model="exemptStatus" style="width:120px;">
                            <Option
                                v-for="item in exemptStatusType"
                                :value="item.typeId"
                                :key="item.typeId"
                            >{{ item.typeName }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="right-btns">
                    <Button v-on:click="search()" type="success">查询</Button>
                    <Button v-on:click="restore()" type="success">重置查询条件</Button>
                    <!-- <Button v-on:click="exportSchoolTestData" type="success">导出EXCEL</Button> -->
                    <Button v-on:click="pageToList" type="success">返回</Button>
                </div>
            </div>
         </Card>
        </div>
        <Card style="margin-top:20px;" >
          <div style="font-size:18px;height:40px;">
            数据明细
        </div>
          <div>
            <Row>
              <div>
                <Table border max-height="570" :columns="resultColumns" :data="resultData"></Table>
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
        </Card>
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
      submitStatus:"",
      visabled:true,
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
      studentName:'',
      grade:'',
      schoolGradeList:[],
      classId: "",
      studentClass:"",
      classList: [
        {
          value: "",
          label: '全部'
        },
        {
          value: 1,
          label: '1班'
        },
        {
          value: 2,
          label: '2班'
        },
        {
          value: 3,
          label: '3班'
        },
        {
          value: 4,
          label: '4班'
        },
        {
          value: 5,
          label: '5班'
        },
        {
          value: 6,
          label: '6班'
        },
        {
          value: 7,
          label: '7班'
        },
        {
          value: 8,
          label: '8班'
        },
        {
          value: 9,
          label: '9班'
        },
        {
          value: 10,
          label: '10班'
        },
        {
          value: 11,
          label: '11班'
        },
        {
          value: 12,
          label: '12班'
        },
        {
          value: 13,
          label: '13班'
        },
        {
          value: 14,
          label: '14班'
        },
        {
          value: 15,
          label: '15班'
        },
        {
          value: 16,
          label: '16班'
        },
        {
          value: 17,
          label: '17班'
        },
        {
          value: 18,
          label: '18班'
        },
        {
          value: 19,
          label: '19班'
        },
        {
          value: 20,
          label: '20班'
        },
        {
          value: 21,
          label: '21班'
        },
        {
          value: 22,
          label: '22班'
        },
        {
            value: 23,
            label: '23班'
        },
        {
            value: 24,
            label: '24班'
        },
        {
            value: 25,
            label: '25班'
        }
      ],
      primaryList:[
        {grade: 99,label:'全部'},
        {grade: 1,label:'一年级'},
        {grade: 2,label:'二年级'},
        {grade: 3,label:'三年级'},
        {grade: 4,label:'四年级'},
        {grade: 5,label:'五年级'},
        {grade: 6,label:'六年级'},
      ],
      middleList:[
        {grade: 99,label:'全部'},
        {grade: 7,label:'七年级'},
        {grade: 8,label:'八年级'},
        {grade: 9,label:'九年级'},
      ],
      highList:[
        {grade: 99,label:'全部'},
        {grade:10,label:'高一'},
        {grade: 11,label:'高二'},
        {grade: 12,label:'高三'},
      ],
      scoreLevel:"",
      scoreLevelList:[
        {
          typeId: "",
          typeName: "全部"
        },
        {
          typeId: "1",
          typeName: "优秀"
        },
        {
          typeId: "2",
          typeName: "良好"
        },
        {
          typeId: "3",
          typeName: "及格"
        },
        {
          typeId: "4",
          typeName: "不及格"
        }
      ],
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
      cdMiddleSchoolColumns:[
        {
          title: "姓名",
          key: "studentName",
          align: "center",
          width: 100,
          fixed:'left',
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
          width: 300
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
                params.row.haveExempt=="1"?"":params.row.height != null ? params.row.height + "cm" : ""
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
                params.row.haveExempt=="1"?"":params.row.weight != null ? params.row.weight + "kg" : ""
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
                params.row.haveExempt=="1"?"":params.row.vitalCapacityValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runFiftyValue != null
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
                params.row.haveExempt=="1"?"":params.row.standingJumpValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.sitAndReachValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runEightHundredValue != null
                  ? params.row.runEightHundredValue + "m‘s“"
                  : ""
              )
            ]);
          }
        },
        {
          title: "一分钟仰卧起坐(女)",
          key: "oneMinuteSitUpValue",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.oneMinuteSitUpValue != null
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
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runThousandValue != null
                  ? params.row.runThousandValue + "m‘s“"
                  : ""
              )
            ]);
          }
        },
        {
          title: "引体向上(男)",
          key: "pullUpsValue",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
               params.row.haveExempt=="1"?"": params.row.pullUpsValue != null
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
                width: 150,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+row.leftVision+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+row.rightVision+"</div>"
                        }else{
                          text="未测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
                            }
                        });
                    }
                },
                {
                title: '串镜',
                key: 'createTime',
                width: 200,
                align: 'center',
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+(row.leftMirror=="0"?"正常":row.leftMirror=="1"?"正片上升、负片下降":row.leftMirror=="-1"?"正片下降、负片上升":row.leftMirror=="2"?"其他":row.leftMirror=="9"?"未测试":"--")+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightMirror=="0"?"正常":row.rightMirror=="1"?"正片上升、负片下降":row.rightMirror=="-1"?"正片下降、负片上升":row.rightMirror=="2"?"其他":row.rightMirror=="9"?"未测试":"--")+"</div>"
                        }else{
                          text="未测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
                            }
                        });
                    }
                },
                {
                title: '屈光不正',
                key: 'createTime',
                align: 'center',
                width: 150,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;' >&nbsp;&nbsp;左眼："+(row.leftLight=="0"?"正常":row.leftLight=="1"?"近视":row.leftLight=="2"?"远视":row.leftLight=="3"?"其他":"未测试")+"</div>"
                            text+='<div  style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightLight=="0"?"正常":row.rightLight=="1"?"近视":row.rightLight=="2"?"远视":row.rightLight=="3"?"其他":"未测试")+"</div>"
                        }else{
                          text="未测试"
                        }

                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
                            }
                        });
                    }
                },
        {
          title: "总得分",
          key: "totalScore",
          align: "center",
          width: 65,
          render: (h, params) => {
            if (params.row.totalScoreLevel == "5") {
              return h("div", [h("span", "--")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.haveExempt=="1"?"":params.row.totalScore != null
                    ? params.row.totalScore + "分"
                    : ""
                )
              ]);
            }
          }
        },
        {
          title: "等级",
          key: "totalScoreLevel",
          align: "center",
          width: 70,
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
                  : "--"
              )
            ]);
          }
        },
        {
          title: "测试分值",
          key: "totalScoreLevel",
          align: "center",
          width: 65,
          render: (h, params) => {
            if(params.row.grade==7){
              return h("div", [
              h(
                "span",
                params.row.totalScoreLevel == "6"
                  ? ""
                  : params.row.totalScoreLevel == "1"
                  ? "1"
                  : params.row.totalScoreLevel == "2"
                  ? "0.75"
                  : params.row.totalScoreLevel == "3"
                  ? "0.5"
                  : params.row.totalScoreLevel == "4"
                  ? "0.25"
                  : "--"
              )
            ]);
            }else if(params.row.grade==8){
              return h("div", [
                h(
                  "span",
                  params.row.totalScoreLevel == "6"
                    ? ""
                    : params.row.totalScoreLevel == "1"
                    ? "1"
                    : params.row.totalScoreLevel == "2"
                    ? "0.75"
                    : params.row.totalScoreLevel == "3"
                    ? "0.5"
                    : params.row.totalScoreLevel == "4"
                    ? "0.25"
                    : "--"
                )
              ]);
            }else if(params.row.grade==9){
              return h("div", [
                h(
                  "span",
                  params.row.totalScoreLevel == "6"
                    ? ""
                    : params.row.totalScoreLevel == "1"
                    ? "2"
                    : params.row.totalScoreLevel == "2"
                    ? "1.5"
                    : params.row.totalScoreLevel == "3"
                    ? "1"
                    : params.row.totalScoreLevel == "4"
                    ? "0.5"
                    : "--"
                )
              ]);
            }
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
          fixed:'right',
          render: (h, params) => {
              var vm=this;
            if (params.row.totalScoreLevel == "6") {
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      disabled:vm.visabled
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
                          params.row.grade,
                           params.row.startSchool
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
      primaryColumns: [
        {
          title: "姓名",
          key: "studentName",
          align: "center",
          width: 100,
          fixed:'left',
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
             h("span", params.row.gender == "1" ? "男" :params.row.gender == "2" ? "女" : params.row.gender)
            ]);
          }
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          width: 300
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
                params.row.haveExempt=="1"?"":params.row.height != null ? params.row.height + "cm" : ""
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
                params.row.haveExempt=="1"?"":params.row.weight != null ? params.row.weight + "kg" : ""
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
                params.row.haveExempt=="1"?"":params.row.vitalCapacityValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runFiftyValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.sitAndReachValue != null
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
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.oneMinuteSitUpValue != null
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
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.oneMinuteRopeSkippingValue != null
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
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
               params.row.haveExempt=="1"?"": params.row.runFiftyEightValue != null
                  ? params.row.runFiftyEightValue + "s"
                  : ""
              )
            ]);
          }
        },
        {
                title: '裸眼视力',
                key: 'resultValue',
                align: 'center',
                width: 200,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+row.leftVision+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+row.rightVision+"</div>"
                        }else{
                          text="未测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
                            }
                        });
                    }
                },
                {
                title: '串镜',
                key: 'createTime',
                width: 200,
                align: 'center',
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        console.log(row.leftVision);
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+(row.leftMirror=="0"?"正常":row.leftMirror=="1"?"正片上升、负片下降":row.leftMirror=="-1"?"正片下降、负片上升":row.leftMirror=="2"?"其他":row.leftMirror=="9"?"未测试":"--")+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightMirror=="0"?"正常":row.rightMirror=="1"?"正片上升、负片下降":row.rightMirror=="-1"?"正片下降、负片上升":row.rightMirror=="2"?"其他":row.rightMirror=="9"?"未测试":"--")+"</div>"
                        }else{
                          text="未测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML:params.row.haveExempt=="1"?"": text
                            }
                        });
                    }
                },
                {
                title: '屈光不正',
                key: 'createTime',
                align: 'center',
                width: 200,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;' >&nbsp;&nbsp;左眼："+(row.leftLight=="0"?"正常":row.leftLight=="1"?"近视":row.leftLight=="2"?"远视":row.leftLight=="3"?"其他":"未测试")+"</div>"
                            text+='<div  style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightLight=="0"?"正常":row.rightLight=="1"?"近视":row.rightLight=="2"?"远视":row.rightLight=="3"?"其他":"未测试")+"</div>"
                        }else{
                          text="未测试"
                        }

                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
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
              return h("div", [h("span", "--")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.haveExempt=="1"?"":params.row.totalScore != null
                    ? params.row.totalScore + "分"
                    : ""
                )
              ]);
            }
          }
        },
        {
          title: "等级",
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
                  : "--"
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
          fixed:"right",
          render: (h, params) => {
              var vm=this;
            if (params.row.totalScoreLevel == "6") {
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      disabled:vm.visabled?vm.visabled:params.row.studentId?false:true
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
                          params.row.grade,
                           params.row.startSchool
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
          width: 100,
          fixed:'left',
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h("span", params.row.gender == "1" ? "男" :params.row.gender == "2" ? "女" : params.row.gender)
            ]);
          }
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          width: 300
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
                params.row.haveExempt=="1"?"":params.row.height != null ? params.row.height + "cm" : ""
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
                params.row.haveExempt=="1"?"":params.row.weight != null ? params.row.weight + "kg" : ""
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
                params.row.haveExempt=="1"?"":params.row.vitalCapacityValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runFiftyValue != null
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
                params.row.haveExempt=="1"?"":params.row.standingJumpValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.sitAndReachValue != null
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
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runEightHundredValue != null
                  ? params.row.runEightHundredValue + "m‘s“"
                  : ""
              )
            ]);
          }
        },
        {
          title: "一分钟仰卧起坐(女)",
          key: "oneMinuteSitUpValue",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.oneMinuteSitUpValue != null
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
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                params.row.haveExempt=="1"?"":params.row.runThousandValue != null
                  ? params.row.runThousandValue + "m‘s“"
                  : ""
              )
            ]);
          }
        },
        {
          title: "引体向上(男)",
          key: "pullUpsValue",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
               params.row.haveExempt=="1"?"": params.row.pullUpsValue != null
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
                width: 200,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+row.leftVision+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+row.rightVision+"</div>"
                        }else{
                          text="未测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
                            }
                        });
                    }
                },
                {
                title: '串镜',
                key: 'createTime',
                width: 200,
                align: 'center',
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;'>&nbsp;&nbsp;左眼："+(row.leftMirror=="0"?"正常":row.leftMirror=="1"?"正片上升、负片下降":row.leftMirror=="-1"?"正片下降、负片上升":row.leftMirror=="2"?"其他":row.leftMirror=="9"?"未测试":"--")+"</div>"
                            text+='<div style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightMirror=="0"?"正常":row.rightMirror=="1"?"正片上升、负片下降":row.rightMirror=="-1"?"正片下降、负片上升":row.rightMirror=="2"?"其他":row.rightMirror=="9"?"未测试":"--")+"</div>"
                        }else{
                          text="未测试"
                        }
                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
                            }
                        });
                    }
                },
                {
                title: '屈光不正',
                key: 'createTime',
                align: 'center',
                width: 200,
                render: (h, params) => {
                        const row = params.row;
                        var text="";
                        if(row.leftVision && row.rightVision){
                          text+="<div style='text-align:left;' >&nbsp;&nbsp;左眼："+(row.leftLight=="0"?"正常":row.leftLight=="1"?"近视":row.leftLight=="2"?"远视":row.leftLight=="3"?"其他":"未测试")+"</div>"
                            text+='<div  style="text-align:left;">&nbsp;&nbsp;右眼：'+(row.rightLight=="0"?"正常":row.rightLight=="1"?"近视":row.rightLight=="2"?"远视":row.rightLight=="3"?"其他":"未测试")+"</div>"
                        }else{
                          text="未测试"
                        }

                        return h("div", {
                            domProps: {
                            innerHTML: params.row.haveExempt=="1"?"":text
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
              return h("div", [h("span", "--")]);
            } else {
              return h("div", [
                h(
                  "span",
                  params.row.haveExempt=="1"?"":params.row.totalScore != null
                    ? params.row.totalScore + "分"
                    : ""
                )
              ]);
            }
          }
        },
        {
          title: "等级",
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
                  : "--"
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
          fixed:'right',
          render: (h, params) => {
              var vm=this;
            if (params.row.totalScoreLevel == "6") {
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      disabled:vm.visabled?vm.visabled:params.row.studentId?false:true
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
                          params.row.grade,
                          params.row.startSchool
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
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
       pageToList() {
      //返回
      this.$router.go(-1)
      } ,
    toClassTestDetail(studentId, studentName, registerCode, gender,gradeId ,startSchool) {
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
        this.studentClass+"班"
      );
      sessionStorage.setItem(
        "studentManage-schoolTestData-classTestResult-classTestDetail-startSchool",
        startSchool
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
    restore() {
      var vm = this
      vm.activityId= vm.activityId,
      vm.grade = 99
      vm.pageNum = 1
      vm.pageSize = 10
      vm.registerCode = ''
      vm.studentClass = ""
      vm.gender=""
      vm.studentName = ''
      vm.college = ''
      vm.major = ''
      vm.testTypeId=""
      vm.submitStatus=""
      vm.exemptStatus=""
      let schoolId = vm.schoolId
      vm.search()
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
    search(){
      var vm=this;

      sessionStorage.setItem("studebtTestList-grade",vm.grade);
      sessionStorage.setItem("studebtTestList-studentClass",vm.studentClass);
      sessionStorage.setItem("studebtTestList-gender",vm.gender);
      sessionStorage.setItem("studebtTestList-exemptStatus",vm.exemptStatus);
      sessionStorage.setItem("studebtTestList-registerCode",vm.registerCode);
      sessionStorage.setItem( "studebtTestList-studentName",vm.studentName);
      sessionStorage.setItem("studebtTestList-pageNum",vm.pageNum);
      sessionStorage.setItem( "studebtTestList-pageSize",vm.pageSize);
      sessionStorage.setItem( "studebtTestList-scoreLevel",vm.scoreLevel);
      vm.getStudentTestResultListReport();
      vm.getStudentTestResultListReportCount();
    },
    getStudentTestResultListReport() {
        var vm=this;
      this.$axios
        .get(
          "/v1/testdata/getStudentTestResultListReport?schoolId=" +
            this.schoolId +
            "&gender=" +
            this.gender +
            "&registerCode=" +
            this.registerCode +
            "&exemptStatus=" +
            this.exemptStatus+
            "&grade=" +
            (this.grade==99?"":this.grade)+
            "&pageNo=" +
            this.pageNum+
            "&pageSize=" +
            this.pageSize+
            "&studentClass=" +
            this.studentClass+
             "&studentName=" +
            this.studentName +
            "&scoreLevel=" +
            this.scoreLevel+
             "&activityId=" +
            vm.activityId
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
    },
    getStudentTestResultListReportCount() {
        var vm=this;
      this.$axios
        .get(
          "/v1/testdata/getStudentTestResultListReportCount?schoolId=" +
            this.schoolId +
            "&gender=" +
            this.gender +
            "&registerCode=" +
            this.registerCode +
            "&exemptStatus=" +
            this.exemptStatus+
            "&grade=" +
            (this.grade==99?"":this.grade)+
            "&pageNo=" +
            this.pageNum+
            "&pageSize=" +
            this.pageSize+
            "&studentClass=" +
            this.studentClass+
             "&studentName=" +
            this.studentName +
            "&scoreLevel=" +
            this.scoreLevel+
             "&activityId=" +
            vm.activityId
        )
        .then(res => {
          if (res.data.code == 10000) {
            this.total = res.data.response;
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg);
            }
          }
        });
    },
    exportSchoolTestData() {
      var vm=this;
      let schoolId=vm.schoolId;
      let activityId=vm.activityId;
      let type=5;
      let url =
        this.$axios.defaults.baseURL +
        '/v1/testdataexport/exportStudentData?schoolId='+
            this.schoolId +
            "&gender=" +
            this.gender +
            "&registerCode=" +
            this.registerCode +
            "&exemptStatus=" +
            this.exemptStatus+
            "&grade=" +
            this.grade+
            "&pageNo=" +
            this.pageNum+
            "&pageSize=" +
            this.pageSize+
            "&studentClass=" +
            this.studentClass+
             "&studentName=" +
            this.studentName +
            "&scoreLevel=" +
            this.scoreLevel +
            "&activityId=" +
            vm.activityId+
        '&token=' +
       sessionStorage.getItem('token')
      window.open(url)
    },
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
    let schoolDistrict = sessionStorage.getItem('schoolDistrict')
    if (schoolType == "2") {
      vm.resultColumns = vm.primaryColumns;
    }else if('3' == schoolType && schoolDistrict == '1000'){
      vm.resultColumns = vm.cdMiddleSchoolColumns;
    } else {
      vm.resultColumns = vm.highSchoolColumns;
    }

    if (schoolType) {
        if ('0' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList)
      }
        if ('2' == schoolType) {
          vm.schoolGradeList = vm.primaryList
        }
        if ('3' == schoolType) {
          vm.schoolGradeList = vm.middleList
        }
        if ('4' == schoolType) {
          vm.schoolGradeList = vm.highList
        }
      }

      vm.activityId=sessionStorage.getItem("schoolTest-studebtTestList-activityId")
    vm.submitStatus=sessionStorage.getItem("schoolTest-studebtTestList-submitStatus")

    if( sessionStorage.getItem("schoolTest-schoolTestDetail-submitStatus")=="1"){
          vm.visabled=true
      }else{
          vm.visabled=false
      }


    if(sessionStorage.getItem("studebtTestList-grade")){
      this.grade =Number(sessionStorage.getItem("studebtTestList-grade")) ;
    }else{
      vm.grade = vm.schoolGradeList[0].grade;
    }

    if(sessionStorage.getItem("studebtTestList-studentClass")){
      this.studentClass = Number(sessionStorage.getItem("studebtTestList-studentClass"));
    }else{
      vm.studentClass = vm.classList[0].value;
    }

    if(sessionStorage.getItem("studebtTestList-gender")){
      this.gender = sessionStorage.getItem("studebtTestList-gender");
    }

    if(sessionStorage.getItem("studebtTestList-exemptStatus")){
      this.exemptStatus = sessionStorage.getItem("studebtTestList-exemptStatus");
    }

    if(sessionStorage.getItem("studebtTestList-registerCode")){
      this.registerCode = sessionStorage.getItem("studebtTestList-registerCode");
    }

    if(sessionStorage.getItem( "studebtTestList-studentName")){
      this.studentName = sessionStorage.getItem( "studebtTestList-studentName");
    }

    if(sessionStorage.getItem("studebtTestList-pageNum")){
      this.pageNum = Number(sessionStorage.getItem("studebtTestList-pageNum"));
    }

    if(sessionStorage.getItem( "studebtTestList-pageSize")){
      this.pageSize = Number(sessionStorage.getItem( "studebtTestList-pageSize"));
    }

    if(sessionStorage.getItem( "studebtTestList-scoreLevel")){
      this.scoreLevel = sessionStorage.getItem( "studebtTestList-scoreLevel");
    }

    this.schoolId = sessionStorage.getItem("schoolId");
    this.search();
  }
};

</script>
