<style>
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
</style>
<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">班级及课程管理</h2>
    </div>
    <div style="margin-top:15px;">
      <Card>
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>体育类型：</span>
                    <Select v-model="sportsClassTypeId" size="small" style="width:120px;">
                        <Option v-for="item in peTypeList" :value="item.sportsClassTypeId" :key="item.sportsClassTypeId">{{ item.sportsClassTypeName }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>班级名称：</span>
                    <Input v-model="peClassName" size="small" placeholder="体育课名称" style="width:160px;"></Input>
                </div>
                <div style="margin:5px 20px;">
                    <span>授课老师：</span>
                    <Input v-model="teacherName" size="small" placeholder="授课老师" style="width:160px;"></Input>
                </div>
                <div style="margin:5px 20px;">
                    <span>学期：</span>
                    <Select v-model="semesterYear" size="small" style="width:120px;">
                        <Option v-for="item in semesterYearList" :value="item.yearSemester" :key="item.yearSemester">{{ item.semesterName }}</Option>
                    </Select>
                </div>
            </div>
            <!-- <Button type="success" style="margin-left:50px;" @click="restore">重置查询条件</Button> -->
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
                <Button type="success" @click="aotoAddStudent">批量导入分班数据</Button>
                <Button type="success" @click="addBanner">新增体育课班级</Button>
            </div>
        </div>
      </Card>
      <br>
      <div>
        <Row>
          <div style>
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
      schoolId: "",
      sportsClassTypeId: "",
      peTypeList: [],
      peClassName: "",
      teacherName:'',
      semesterYear:'',
      semesterYearList:[],
      resultColumns: [
        {
          title: "班级名称",
          key: "sportsClassName",
          align: "center",
          minWidth:100
        },
        {
          title: "体育类型",
          key: "sportsClassTypeName",
          align: "center",
          minWidth:100,
        //   render: (h, params) => {
        //     const row = params.row;
        //     const text = row.displayType == "1" ? "通知" : "消息";
        //     return h("span", text);
        //   }
        },
        {
          title: "课程编码",
          key: "sportsClassCode",
          align: "center",
          minWidth:100,
        },
        {
          title: "授课老师",
          key: "teacherName",
          align: "center",
          minWidth:100,
        },
        {
          title: "所属校区",
          key: "campusName",
          align: "center",
          minWidth:100,
        },
        {
          title: "成员人数",
          key: "studentNum",
          align: "center",
          minWidth:100,
        },
        {
          title: "上课时间",
          key: "doubleName",
          align: "center",
          minWidth:100,
          // type:"html",
          render: (h, params) => {
            // console.log("11")
            const row = params.row;
            var text="";
            if(row.list){
              for(var i=0;i<row.list.length;i++){
                if(row.list[i].single=="1"){
                  text+="<lable>单周 "+row.list[i].weekName+" "+row.list[i].singleName+"</lable>"
                  text += "</br>";
                }else if(row.list[i].single=="2"){
                  text+="<lable>双周 "+row.list[i].weekName+" "+row.list[i].singleName+"</lable>"
                  text += "</br>";
                }else{
                  text+="<lable>"+row.list[i].weekName+" "+row.list[i].singleName+"</lable>"
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
        // {
        //   title: "描述",
        //   key: "remark",
        //   align: "center"
        // },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth:100,
          // fixed: "right",
          width: 480,
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
                      this.toDetail(row.sportsClassId);
                    }
                  }
                },
                "详情"
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
                      this.studentManage(row.sportsClassId);
                    }
                  }
                },
                "成员管理"
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
                      this.classPlan(row.sportsClassId);
                    }
                  }
                },
                "排课"
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
                      this.examItemChoose(row.sportsClassId);
                    }
                  }
                },
                "配置考试项目"
              )
            ]);
          }
        }
      ],
      resultData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    getSportsClassList() {
      var vm = this;
      vm.loading = true;
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        sportsClassName: vm.sportsClassName,
        sportsClassTypeId: vm.sportsClassTypeId,
        schoolId: vm.schoolId,
        teacherName:vm.teacherName,
        "semesterYear": vm.semesterYear
      };
      this.$axios.post("/v1/sports/class/getSportsClassList", data).then(res => {
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
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        sportsClassName: vm.sportsClassName,
        sportsClassTypeId: vm.sportsClassTypeId,
        schoolId: vm.schoolId,
        teacherName:vm.teacherName,
        "semesterYear": vm.semesterYear
      };
      this.$axios.post("/v1/sports/class/countSportsClassNum", data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSportClassTypeList() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSportClassTypeList").then(res => {
        if (res.data.code == 10000) {
            let all={
                sportsClassTypeId:'',
                sportsClassTypeName:'全部',
                schoolId:vm.schoolId
            }
             vm.peTypeList.push(all);
          vm.peTypeList =vm.peTypeList.concat(res.data.response) ;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSemesterList() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSchoolAllYearSemester").then(res => {
        if (res.data.code == 10000) {
          vm.semesterYearList =res.data.response ;
          if(res.data.response){
            vm.semesterYear=res.data.response[0].yearSemester
            vm.search();
          }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    querySearch() {
      this.pageNum = 1;
      this.pageNo = 1;
      this.search();
    },
    search() {
      var vm = this;
      vm.getSportsClassList();
      vm.countSportsClassNum();
    },
    restore() {
      var vm = this;
      vm.peTypeId = '';
      vm.pageNo = 1;
      vm.pageSize = 10;
      // vm.schoolId = "";
      vm.peClassName = '';
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
    classPlan(sportsClassId){
      var vm = this;
      sessionStorage.setItem("sportsClass-classPlan-sportsClassId", sportsClassId);
      this.$router.push({ name: "classPlan" });
    },
    studentManage(sportsClassId){
      var vm = this;
      sessionStorage.setItem("sportsClass-sportsStudentClassManage-sportsClassId", sportsClassId);
      this.$router.push({ name: "sportsStudentClassManage" });
    },
    aotoAddStudent(){
      var vm = this;
      sessionStorage.setItem("sportsClass-sportsStudentManage-sportsClassId", "");
      this.$router.push({ name: "sportsStudentManage" });
    },
    toDetail(sportsClassId) {
      var vm = this;
      sessionStorage.setItem("sportsClass-sportsClassInfo-sportsClassId", sportsClassId);
      this.$router.push({ name: "sportsClassInfo" });
    },
    addBanner() {
      var vm = this;
      sessionStorage.removeItem("sportsClass-sportsClassInfo-sportsClassId");
      this.$router.push({ name: "sportsClassInfo" });
    },
    relevancy(peClassId){
       var vm = this;
      sessionStorage.setItem("sportsClass-relevancy-peClassId",peClassId);
      this.$router.push({ name: "relevancy" });
    },
    examItemChoose(sportsClassId){
      var vm = this;
      sessionStorage.setItem("sportsClass-examChoose-sportsClassId",sportsClassId);
      this.$router.push({ name: "examChoose" });
    }
   
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    
    vm.getSportClassTypeList();
    vm.getSemesterList();
    // vm.getSchoolList();
    
  }
};
</script>