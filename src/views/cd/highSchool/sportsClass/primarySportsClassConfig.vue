<style scoped>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
.mar-l40{margin-left:40px;}
.width120{width:120px;}
@media screen and (max-width: 1650px) {
  .mar-l40{margin-left:15px;}
  .width120{width:100px;}
}
</style>
<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">班级及课程管理</h2>
    </div>
    <div>
      <Card>
        <div  @keydown.enter="querySearch">
          <div class="top-search">
            <div class="left-input">
              <div style="margin:5px 10px;">
                <span style="">年<span style="visibility:hidden">占位</span>级：</span>
                <Select v-model="grade" class="width120">
                  <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
                </Select>
              </div>
              <div style="margin:5px 10px;">
                <span>班级名称：</span>
                <Input v-model="sportsClassName" placeholder="班级名称" class="width120"></Input>
              </div>
              <div style="margin:5px 10px;">
                <span>授课老师：</span>
                <Input v-model="teacherName" placeholder="授课老师" class="width120"></Input>
              </div>
            </div>
            <div class="right-btns">
              <Button type="success" @click="querySearch">查询</Button>
              <Button
                type="success"
                @click="aotoAddStudent"
              >批量导入排课</Button>
              <Button type="success"  @click="exportAllClassPlanPre">教学班课表导出</Button>
              <Button type="success"  @click="getAllSportsClassTX">按行政班生成分班</Button>
              <Button type="success"  @click="exportSportsClass">导入体育课分班</Button>
            </div>
          </div>
        </div>
      </Card>
      <br>
      <div>
      <Card>
        <div style="font-size:18px;height:40px;">
            数据明细
        </div>
        <Row>
          <div>
            <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
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
        </Card>
      </div>
    </div>
    <Modal v-model="allClassPlanStasus" :mask-closable="false" width="360" @on-ok="exportAllClassPlan"
        @on-cancel="cancelexportAllStudent">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>课表导出设置</span>
        </p>
        <div style="text-align:center">
          <span>导出学期：</span>
          <Select v-model="allSemester" size="small" style="width:180px;">
                <Option v-for="item in semesterYearList" :value="item.yearSemester" :key="item.yearSemester">{{ item.semesterName }}</Option>
              </Select>
        </div>
      </Modal>
    <Modal
            v-model="modalTx"
            title="提醒"
            :mask-closable="false"
            @on-ok="modalTxOk"
            @on-cancel="modalTxCancel">
      <div slot="footer">
        <Button type="success" @click="modalTxOk">确定</Button>
        <Button type="success" @click="modalTxCancel">取消</Button>
      </div>
      <div style="text-align:center">
        <span style>分班后，之前的班级信息将清除，是否确定重新分班？</span>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "schoolList",
  data() {
    return {
      modalTx: false,
      allSemester: '',
      loading: false,
      schoolId: "",
      grade:'',
      studentClass:'',
      allClassPlanStasus:false,
      primaryList: [
        {
          grade: "",
          label: "全部"
        },
        {
          grade: 1,
          label: "一年级"
        },
        {
          grade: 2,
          label: "二年级"
        },
        {
          grade: 3,
          label: "三年级"
        },
        {
          grade: 4,
          label: "四年级"
        },
        {
          grade: 5,
          label: "五年级"
        },
        {
          grade: 6,
          label: "六年级"
        }
      ],
      middleList: [
        {
          grade: "",
          label: "全部"
        },
        {
          grade: 7,
          label: "七年级"
        },
        {
          grade: 8,
          label: "八年级"
        },
        {
          grade: 9,
          label: "九年级"
        }
      ],
      highList: [
        {
          grade: "",
          label: "全部"
        },
        {
          grade: 10,
          label: "高一"
        },
        {
          grade: 11,
          label: "高二"
        },
        {
          grade: 12,
          label: "高三"
        }
      ],
      collegeList: [
        {
          grade: "",
          label: "全部"
        },
        {
          grade: 13,
          label: "大一"
        },
        {
          grade: 14,
          label: "大二"
        },
        {
          grade: 15,
          label: "大三"
        },
        {
          grade: 16,
          label: "大四"
        }
      ],
      schoolGradeList: [],
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
      teacherName:'',
      semesterYear: "",
      semesterYearList: [],
      resultColumns: [
        {
          title: "学期",
          key: "yearSemesterName",
          align: "center",
          fixed:"left",
          minWidth:200,
            // render: (h, params) => {
            //   const row = params.row;
            //   const text = this.semesterName;
            //   return h("span", text);
            // }
        },
        {
          title: "年级名称",
          key: "gradeName",
          align: "center",
          minWidth:96,
        },
        {
          title: "班级名称",
          key: "className",
          align: "center",
          minWidth:96,
        },
        {
          title: "授课老师",
          key: "teacherName",
          align: "center",
          minWidth:200,
          render: (h, params) => {
            const row = params.row.teacherName;
            var text="";
            if(row!=null){
              var result = row.split(",");
              for(var i=0;i<result.length;i++){
                text+="<lable style='padding:10px 0;display:inline-block'>"+result[i]+"</lable>"+"</br>";
              }
            }
            return h("div", {
              domProps: {
                innerHTML: text
              }
            });
          }
        },
        {
          title: "学生人数",
          key: "studentNum",
          align: "center",
          minWidth:96,
        },
        {
          title: "上课时间",
          key: "doubleName",
          align: "center",
          minWidth:200,
          render: (h, params) => {
            // console.log("11")
            const row = params.row;
            var text="";
            if(row.list){
              for(var i=0;i<row.list.length;i++){
                if(row.list[i].single=="1"){
                  text+="<lable style='padding:10px 0;display:inline-block'>单周 "+row.list[i].weekName+"&nbsp;&nbsp;&nbsp;第"+row.list[i].singleName+"&nbsp;&nbsp;&nbsp;"+(row.list[i].teacherName!=null?row.list[i].teacherName:"")+"</lable>"
                  text += "</br>";
                }else if(row.list[i].single=="2"){
                  text+="<lable style='padding:10px 0;display:inline-block'>双周 "+row.list[i].weekName+"&nbsp;&nbsp;&nbsp;第"+row.list[i].singleName+"&nbsp;&nbsp;&nbsp;"+(row.list[i].teacherName!=null?row.list[i].teacherName:"")+"</lable>"
                  text += "</br>";
                }else{
                  text+="<lable style='padding:10px 0;display:inline-block'>"+row.list[i].weekName+"&nbsp;&nbsp;&nbsp;第"+row.list[i].singleName+"&nbsp;&nbsp;&nbsp;"+(row.list[i].teacherName!=null?row.list[i].teacherName:"")+"</lable>"
                  text += "</br>";
                }
              }
            }
            // console.log(text)
            return h("div", {
                domProps: {
                  innerHTML: text
                }
              });
            // return h("div", text);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          fixed: "right",
          minWidth:200,
          render: (h, params) => {
            const row = params.row;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.studentManage(row.classId,row.gradeName);
                    }
                  }
                },
                "学生管理"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.classPlan(row.classId);
                    }
                  }
                },
                "排课"
              )
              // ,
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "success"
              //     },
              //     style: {
              //       marginRight: "0px"
              //     },
              //     on: {
              //       click: () => {
              //         this.viewClassTest(row.classId);
              //       }
              //     }
              //   },
              //   "查看考试项目"
              // )
            ]);
          }
        }
      ],
      resultData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      sportsClassName: ''
    };
  },
  methods: {
    modalTxOk(){
      this.getAllSportsClass();
      this.modalTx = false;
    },
    modalTxCancel(){
      this.modalTx = false;
    },
    getAllSportsClassTX(){
      this.getClassIsExist();
    },
    exportSportsClass(){
        var vm=this;
      this.$router.push({ name: "sportsStudentManage" });
    },
    getClassIsExist(){
      var vm = this;
      this.$axios
              .get("/v1/cd/high/sportsclass/getClassIsExist")
              .then(res => {
                if (res.data.code == 10001) {
                  this.modalTx = true;
                }else if(res.data.code == 10000){
                  vm.getAllSportsClass();
                }else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg);
                  }
                }
              });
    },
    getAllSportsClass(){
      var vm = this;
      this.$axios
              .get("/v1/cd/high/sportsclass/getCopyClassInfo")
              .then(res => {
                if (res.data.code == 10000) {
                  vm.$Message.info(res.data.msg);
                  vm.querySearch();
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg);
                  }
                }
              });
    },
    exportAllClassPlanPre(){
        var vm=this;
        vm.allClassPlanStasus=true;
    },
    exportAllClassPlan(){
    var vm = this;
    let url =this.$axios.defaults.baseURL +
      "/v1/cd/high/sportsclass/exportAllCDHighSportsClassPlan?token=" +
      sessionStorage.getItem("token")+'&semesterYear='+vm.allSemester;
    window.open(url);
    },
    cancelexportAllStudent(){
    var vm = this;

    },
    getPrimarySportsClass() {
      var vm = this;
      vm.loading = true;
      let data = {
        "grade":vm.grade,
        "pageNo":vm.pageNum,
        "pageSize": vm.pageSize,
        "semesterYear": vm.semesterYear,
        "sportsClassName": vm.sportsClassName,
        "teacherName": vm.teacherName
      };
      this.$axios
        .post("/v1/cd/high/sportsclass/getSportsClass", data)
        .then(res => {
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
    countSportsClassNum() {
      var vm = this;
       let data = {
        "grade":vm.grade,
        "pageNo":vm.pageNum,
        "pageSize": vm.pageSize,
        "semesterYear": vm.semesterYear,
        "sportsClassName": vm.sportsClassName,
        "teacherName": vm.teacherName
      };
      this.$axios
        .post("/v1/cd/high/sportsclass/getSportsClassNum", data)
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
    viewClassTest(classId){
      var vm=this;
      sessionStorage.setItem(
        "sportsClass-classTestInfo-classId",
        classId
      );
      this.$router.push({ name: "classTestInfo" });
    },
    querySearch() {
      this.pageNum = 1;
      this.pageNo = 1;
      this.search();
    },
    search() {
      var vm = this;
      vm.getPrimarySportsClass();
      vm.countSportsClassNum();
    },
    restore() {
      var vm = this;
      vm.peTypeId = "";
      vm.pageNo = 1;
      vm.pageSize = 10;
      // vm.schoolId = "";
      vm.peClassName = "";
      vm.querySearch();
    },

    cancel() {
      // this.$Message.info('Clicked cancel');
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
        this.querySearch();
      }
    },
    getRecentSemester() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSchoolAllYearSemester").then(res => {
        if (res.data.code == 10000) {
          let dataa = res.data.response
          if(dataa && dataa.length>0){
            vm.semesterYear=dataa[0].yearSemester
            vm.semesterName=dataa[0].semesterName
            vm.allSemester=dataa[0].yearSemester
              if(dataa.length >= 2){
                 if(dataa[0].semesterName.substring(0,4) == dataa[1].semesterName.substring(0,4)){
                    vm.semesterYearList.push(dataa[0]) ;
                    vm.semesterYearList.push(dataa[1]) ;
                 }else{
                    vm.semesterYearList.push(dataa[0]) ;
                 }

              }else{
                vm.semesterYearList.push(dataa[0]) ;
              }
          }

          // vm.semesterYearList.push(res.data.response) ;
          // if(res.data.response){
          //   vm.semesterYear=res.data.response.yearSemester
          //   vm.semesterName=res.data.response.semesterName
          // }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    classPlan(classId) {
      var vm = this;
      sessionStorage.setItem(
        "sportsClass-classPlan-classId",
        classId
      );
      this.$router.push({ name: "classPlanCDHigh" });
    },
    studentManage(classId,gradeName) {
      var vm = this;
      sessionStorage.setItem(
        "sportsClass-sportsStudentClassManage-sportsClassId",
          classId
      );sessionStorage.setItem(
        "sportsClass-sportsStudentClassManage-gradeName",
              gradeName
      );
      this.$router.push({ name: "sportsStudentClassManage" });
    },
    aotoAddStudent() {
      var vm = this;
      this.$router.push({ name: "classPlanExportCDHigh" });
    },
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    vm.getRecentSemester();
    let schoolType = sessionStorage.getItem('schoolType')
    if (sessionStorage.getItem('schoolType')) {
      if ('2' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList)
      }
      if ('3' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList)
      }
      if ('4' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList)
      }
    }

    vm.search();
  }
};
</script>
