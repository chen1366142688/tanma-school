
<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体育课成员分组</h2>
    </div>
    <div>
      <!-- <h2>手动分组</h2> -->
      <Card style="width:45%;float:left;">
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span style="">年级：</span>
                    <Select v-model="grade" size="small" style="width:120px;">
                        <Option
                        v-for="item in schoolGradeList"
                        :value="item.startYear"
                        :key="item.startYear"
                        >{{ item.startName }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>班级：</span>
                    <Select v-model="studentClass" size="small" style="width:120px;">
                        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>姓名：</span>
                    <Input v-model="studentName" size="small" placeholder="学生姓名" style="width: 120px;"/>
                </div>
                <div style="margin:5px 20px;">
                    <span >学籍号：</span>
                    <Input v-model="registerCode" size="small" placeholder="学生学籍号" style="width: 120px;"/>
                </div>
                <div style="margin:5px 20px;">
                    <span>分组情况:</span>
                    <Select v-model="joinStatus" size="small" style="width:120px;">
                        <Option v-for="item in joinList" :value="item.type" :key="item.type">{{ item.name }}</Option>
                    </Select>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
                <Button type="success" @click="bathadd">批量加入</Button>
            </div>
        </div>
        <!-- <div style="margin-top: 15px;">
          <span style="margin-left:0px;">分组情况:</span>
          <Select v-model="joinStatus" size="small" style="width:120px;">
            <Option v-for="item in joinList" :value="item.type" :key="item.type">{{ item.name }}</Option>
          </Select>
          <Button type="success" style="margin-left:40px;" @click="querySearch">查询</Button>
          <Button type="success" style="margin-left:40px;" @click="bathadd">批量加入</Button>
        </div> -->
        <br>
        <div>
          <Row>
            <div style>
              <Table border max-height="560"  ref="selection" :loading="loading" :columns="resultColumns" :data="resultData" @on-selection-change="data1Change"></Table>
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
      <Card style="width:6%; float:left;height:726px">
        <Icon type="arrow-swap" size="80" style="margin-top:330px;margin-left:10px;" color="grey"></Icon>
       </Card>
      <Card style="width:45%; float:left;">
        <div>
          <!-- <span>学期：</span>
          <Select v-model="semesterYear" size="small" style="width:120px;">
                <Option v-for="item in semesterYearList" :value="item.yearSemester" :key="item.yearSemester">{{ item.semesterName }}</Option>
              </Select>
          <span>成员分组：</span>
          <Select v-model="peClassId" size="small" style="width:120px;">
            <Option
              v-for="item in peClassList"
              :value="item.peClassId"
              :key="item.peClassId"
            >{{ item.peClassName }}</Option>
          </Select>

          <Button type="success" style="margin-left:80px;" @click="querySearch2">查询</Button> -->
          <!-- <Button type="success" style="margin-left:0px;" @click="bathdelete">批量移出</Button> -->
          <!-- <Button type="success" style="margin-left:80px;" @click="baseSubmit">保存</Button> -->
        </div>
        <p ><h1 style="margin-top:0px;">{{peClassName}}--学生：</h1></p>
        <br>
        <p style="height: 40px;">
            <Button type="success" style="margin-right:28px;float:right" @click="bathdelete">批量移出</Button>
        </p>
        <div>
          <Row>
            <div style="margin-top:11px">
              <Table   max-height="560"  border ref="selection"  :loading="loading2" :columns="resultColumns2" :data="resultData2" @on-selection-change="data2Change"></Table>
            </div>
          </Row>
        </div>
      </Card>
    </div>

    <Modal v-model="exportStatus" :mask-closable="false" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>温馨提示</span>
        </p>
        <div style="text-align:center">
          <span style>导入中，请稍等</span>
        </div>
        <div slot="footer"></div>
      </Modal>

      <Modal v-model="allStudentStasus" :mask-closable="false" width="360" @on-ok="exportAllStudent"
        @on-cancel="cancelexportAllStudent">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>温馨提示</span>
        </p>
        <div style="text-align:center">
          <span>导出的学期：</span>
          <Select v-model="allSemester" size="small" style="width:120px;">
                <Option v-for="item in semesterYearList" :value="item.yearSemester" :key="item.yearSemester">{{ item.semesterName }}</Option>
              </Select>
        </div>
        <!-- <div slot="footer"></div> -->
      </Modal>
  </div>
</template>

<script>
export default {
  name: "schoolList",
  data() {
    return {
      loading: false,
      loading2: false,
      isCollege: true,
      allStudentStasus:false,
      allSemester:'',
      semesterYear:'',
      semesterYearList:[],
      schoolId: "",
      exportAllNum:0,
      exportSuccessNum:0,
      exportFailNum:0,
      failTf:true,
      peClassId: "",
      peClassName:'',
      college: "",
      collegesList: [],
      major: "",
      majorList: [],
      grade: 999,
      schoolGradeList: [],
      studentClass: 999,
      classList: [
        {
          value: 999,
          label: "全部"
        },
        {
          value: 1,
          label: "1班"
        },
        {
          value: 2,
          label: "2班"
        },
        {
          value: 3,
          label: "3班"
        },
        {
          value: 4,
          label: "4班"
        },
        {
          value: 5,
          label: "5班"
        },
        {
          value: 6,
          label: "6班"
        },
        {
          value: 7,
          label: "7班"
        },
        {
          value: 8,
          label: "8班"
        },
        {
          value: 9,
          label: "9班"
        },
        {
          value: 10,
          label: "10班"
        },
        {
          value: 11,
          label: "11班"
        },
        {
          value: 12,
          label: "12班"
        },
        {
          value: 13,
          label: "13班"
        },
        {
          value: 14,
          label: "14班"
        },
        {
          value: 15,
          label: "15班"
        },
        {
          value: 16,
          label: "16班"
        },
        {
          value: 17,
          label: "17班"
        },
        {
          value: 18,
          label: "18班"
        },
        {
          value: 19,
          label: "19班"
        }
      ],
      registerCode: "",
      studentName: "",
      joinStatus: "0",
      joinList: [
        {
          type: "999",
          name: "全部"
        },
        {
          type: "1",
          name: "已分组"
        },
        {
          type: "0",
          name: "未分班"
        }
      ],
      peClassList: [],
      selectAll1:false,
      selectAll2:false,
      selectAllList1:[],
      selectAllList2:[],
      exportStatus:false,
      updateUrl:'',
      resultColumns: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
          title: "学生姓名",
          key: "studentName",
          align: "center",
          minWidth:100
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          minWidth:100
        },
        {
          title: "性别",
          key: "gender",
          width: 60,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = row.gender == "1" ? "男" : "女";
            return h("span", text);
          }
        },
        {
          title: "基本信息",
          key: "baseInfo",
          align: "center",
          minWidth:100
        },
        {
          title: "分组情况",
          key: "joinStatus",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text =
              row.joinStatus == "1"
                ? row.className
                : row.joinStatus == "2"
                ? "待确认"
                : "未分组";

            const color =  row.joinStatus == "1"
                ? "green"
                : row.joinStatus == "2"
                ? "yellow"
                : "red"

            return h(
              // 'Tag',
              // {
              //   props: {
              //     type: 'dot',
              //     color: color
              //   }
              // },
              "span",
              text
            )
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth:100,
          // fixed: "right",
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
                      this.addStudent(row);
                    }
                  }
                },
                "加入组"
              )
            ]);
          }
        }
      ],
      resultData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      resultColumns2: [
        {
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
          title: "学生姓名",
          key: "studentName",
          align: "center",
          minWidth:100
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          minWidth:100
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text = row.gender == "1" ? "男" : "女";
            return h("span", text);
          }
        },
        {
          title: "基本信息",
          key: "baseInfo",
          align: "center",
          minWidth:100
        },
        // {
        //   title: "是否参加体育课",
        //   key: "joinStatus",
        //   align: "center",
        //   render: (h, params) => {
        //     const row = params.row;
        //     const text =
        //       row.joinStatus == "1"
        //         ? "已分班"
        //         : row.joinStatus == "2"
        //         ? "待确认"
        //         : "未分班";

        //     const color =  row.joinStatus == "1"
        //         ? "green"
        //         : row.joinStatus == "2"
        //         ? "yellow"
        //         : "red"

        //     return h(
        //       'Tag',
        //       {
        //         props: {
        //           type: 'dot',
        //           color: color
        //         }
        //       },
        //       text
        //     )
        //   }


        // },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth:100,
          // fixed: "right",
          render: (h, params) => {
            const row = params.row;
            // console.log(params)
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
                      this.removestudent(row,params.index);
                    }
                  }
                },
                "移出组"
              )
            ]);
          }
        }
      ],
      resultData2: [],
      pageNum2: 1,
      pageSize2: 200,
      total2: 0
    };
  },
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    getSportsClassStudentInfo() {
      var vm = this;
      vm.loading = true;
      let data = {
        collegeCode: vm.college == "999" ? "" : vm.college,
        grade: vm.grade == "999" ? "" : vm.grade,
        joinStatus: vm.joinStatus == "999" ? "" : vm.joinStatus,
        majorCode: vm.major == "999" ? "" : vm.major,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        registerCode: vm.registerCode,
        schoolId: vm.schoolId,
        studentClass: vm.studentClass == 999 ? "" : vm.studentClass,
        studentName: vm.studentName,
        "semesterYear": vm.semesterYear
      };
      this.$axios.post("/v1/sports/class/getSportsClassStudentInfo", data).then(res => {
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
    countSportsClassStudentNum() {
      var vm = this;
      let data = {
        collegeCode: vm.college == "999" ? "" : vm.college,
        grade: vm.grade == "999" ? "" : vm.grade,
        joinStatus: vm.joinStatus == "999" ? "" : vm.joinStatus,
        majorCode: vm.major == "999" ? "" : vm.major,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        registerCode: vm.registerCode,
        schoolId: vm.schoolId,
        studentClass: vm.studentClass == 999 ? "" : vm.studentClass,
        studentName: vm.studentName
      };
      this.$axios.post("/v1/sports/class/countSportsClassStudentNum", data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSportsClassStudent() {
      var vm = this;
      vm.loading2 = true;
      let data = {
        pageNo: vm.pageNum2,
        pageSize: vm.pageSize2,
        sportsClassId: vm.peClassId,
        schoolId: vm.schoolId
      };
      this.$axios.post("/v1/sports/class/getSportsClassStudent", data).then(res => {
        vm.loading2 = false;
        if (res.data.code == 10000) {
          vm.resultData2 = res.data.response;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    countSportsClassStudentInfoNum() {
      var vm = this;
      let data = {
        pageNo: vm.pageNum2,
        pageSize: vm.pageSize2,
        sportsClassId: vm.peClassId,
        schoolId: vm.schoolId
      };
      this.$axios.post("/v1/sports/class/countSportsClassStudentInfoNum", data).then(res => {
        if (res.data.code == 10000) {
          this.total2 = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    baseSubmit() {
      var vm = this;
      // console.log(vm.resultData2);
      var vm = this;
      vm.loading = true;
      let data = {
        list: vm.resultData2,
        sportsClassId: vm.peClassId,
        schoolId: vm.schoolId,
        yearSemester:vm.semesterYear
      };
      // console.log(data);
      // return
      this.$axios.post("/v1/sports/class/upsertSportsClassStudent", data).then(res => {
        vm.loading = false;
        if (res.data.code == 10000) {
          // vm.$Message.info("保存成功");
          vm.search();
          vm.search2();
          vm.selectAllList1=[];
          vm.selectAllList2=[];
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
    querySearch2() {
      this.pageNum2 = 1;
      this.pageNo2 = 1;
      this.search2();
    },
    search() {
      var vm = this;
      vm.getSportsClassStudentInfo();
      vm.countSportsClassStudentInfoNum();
    },
    search2() {
      var vm = this;
      vm.getSportsClassStudent();
      vm.countSportsClassStudentNum();
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
    bathadd(){
        var vm = this;
        let havetf=false;
        let addtf=false;
        if(!vm.peClassId){
          // console.log("!1111")
           vm.$Message.info("当前还未创建班级！");
           return false;
        }
        // vm.baseSubmit();
        if(!vm.selectAllList1 || vm.selectAllList1.length<1){
            vm.$Message.info("当前还未选中未分班的学生！");
           return false;
        }
        for (let i = 0; i < vm.selectAllList1.length; i++) {
          let student=vm.selectAllList1[i];
          for(let j=0;j<vm.resultData2.length;j++){
            if (student.studentId == vm.resultData2[j].studentId) {
              havetf=true;
            }
          }
          if (havetf) {
            // vm.$Message.info("该学生已添加");
          } else {
            addtf=true;
            student.joinStatus = "2";
            vm.resultData2.push(student);
            let s2 = student;
          this.$set(vm.resultData, i, s2);
          }
          havetf=false;
        }
        if(addtf){
          vm.baseSubmit();
        }else{

        }
    },

    addStudent(student) {
      var vm = this;
        let havetf=false;
        // if( student.joinStatus=='1'){
        //    vm.$Message.info("该学生已参加了");
        //    return false;
        // }
        if(!vm.peClassId){
           vm.$Message.info("当前还未创建班级！");
           return false;
        }
        for (let i = 0; i < vm.resultData2.length; i++) {
          // console.log(student.studentId == vm.resultData[i].studentId);
          if (student.studentId == vm.resultData2[i].studentId ) {
            havetf=true;
          }
        }
        if (havetf) {
          vm.$Message.info("该学生已在该班了");
        } else {
          student.joinStatus = "2";
          vm.resultData2.push(student);
          vm.baseSubmit();
      }
    },
    bathdelete(){
      var vm = this;
      let changtf=false;
      if(!vm.peClassId){
           vm.$Message.info("当前还未创建班级！");
           return false;
        }
        if(!vm.selectAllList2 || vm.selectAllList2.length<1){
            vm.$Message.info("当前还未选中已分班的学生！");
           return false;
        }
      for(let i=0;i<vm.selectAllList2.length;i++){
        let student=vm.selectAllList2[i];

        for(let j=0;j<vm.resultData2.length;j++){
          if (student.studentId == vm.resultData2[j].studentId) {
            // console.log(j)
            changtf=true;
               vm.resultData2.splice(j, 1);
          }
        }
      }
      if(changtf){
        vm.baseSubmit();
      }
    } ,
    removestudent(student,index) {
      var vm = this;
      if(!vm.peClassId){
           vm.$Message.info("当前还未创建班级！");
           return false;
        }
      for (let i = 0; i < vm.resultData.length; i++) {
        // console.log(student.studentId == vm.resultData[i].studentId);
        if (student.studentId == vm.resultData[i].studentId) {
          let s2 = vm.resultData[i];
          s2.joinStatus =s2.joinStatus=="1"?"2": "0";
          this.$set(vm.resultData, i, s2);
        }
      }
      vm.resultData2.splice(index, 1);
      vm.baseSubmit();
    },
    data1Change(selection){
      var vm=this;
      console.log(selection)
      if(selection && selection.length>0){
        vm.selectAll1=true;
        console.log("1")
        vm.selectAllList1=selection;
      }else{
        vm.selectAll1=false
      }
    },
    data2Change(selection){
      var vm=this;
      console.log(selection)
      if(selection && selection.length>0){
        vm.selectAll2=true;
        vm.selectAllList2=selection;
      }else{
        vm.selectAll2=false
      }
    },

    handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
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
        this.pageNum = 1;
        this.pageSize = value;
        this.querySearch();
      }
    },
    pageNumChange2(value) {
      //页码改变方法处理
      if (this.pageNum2 != value) {
        this.pageNum2 = value;
        this.search2();
      }
    },
    pageSizechange2(value) {
      //页面大小改变方法处理
      if (this.pageSize2 != value) {
        this.pageSize2 = value;
        this.pageNum2 = 1;
        this.querySearch2();
      }
    },
     handleSuccess(res, file) {
      var vm = this;
      // console.log(res)
      vm.exportStatus = false;
      if (res.code == 10000) {
        if (res.response == 1) {
          vm.$Message.info("导入成功");
          vm.modal2 = false;
          vm.getSportsClassSingleInfo();
          vm.getExportInfo();
          //  vm.getSemesterList();
          // vm.search();
        } else {
          vm.$Message.info("文件为空，导入失败");
        }
      } else {
        vm.$Message.info("导入失败，请稍后再试");
      }
    },
    handleFormatError(file) {
      this.exportStatus = false;
      this.$Notice.warning({
        title: "格式错误",
        desc: "该文件格式错误，请检查后重试"
      });
    },
    handleMaxSize(file) {
      this.exportStatus = false;
      this.$Notice.warning({
        title: "文件超大",
        desc: "该文件超大了"
      });
    },
    handleBeforeUpload(file) {
      // console.log(file)
      // const check = this.uploadList.length < 5;
      // if (!check) {
      //     this.$Notice.warning({
      //         title: 'Up to five pictures can be uploaded.'
      //     });
      // }
      // return check;
      var vm = this;
      vm.exportStatus = true;
      return true;
    },
    getSportsClassSingleInfo() {
      //编辑时获取场馆数据
       var vm=this;
      this.$axios.get("/v1/sports/class/getSportsClassSingleInfo?semesterYear="+vm.semesterYear).then(res => {

        if (res.data.code == 10000) {
          this.peClassList = res.data.response;
          if(sessionStorage.getItem("sportsClass-sportsStudentClassManage-sportsClassId")){
             vm.getInfoByKey(sessionStorage.getItem("sportsClass-sportsStudentClassManage-sportsClassId"));
          }else{
            this.peClassId=res.data.response[0].peClassId;
            vm.peClassName=vm.peClassList[0].peClassName
          }
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    getInfoByKey(sportsClassId) {
      var vm = this;
      this.$axios
        .get("/v1/sports/class/getInfoByKey?sportsClassId=" + sportsClassId)
        .then(res => {
          vm.loading = false;
          if (res.data.code == 10000) {
            let data = res.data.response;
           vm.yearSemester=data.yearSemester;
           vm.peClassId=data.sportsClassId;
           vm.peClassName=data.sportsClassName
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    getStartYearList() {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      this.$axios.get("/v1/school/getStartYearList").then(res => {
        if (res.data.code == 10000) {
          //   console.log(res);
          let data = res.data.response;
          let all = {
            startYear: 999,
            startName: "全部"
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
    getSchoolCollegeBySchoolId(schoolId) {
      var vm = this;
      this.$axios
        .get("/v1/student/getSchoolCollegeBySchoolId?schoolId=" + schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            let all = {
              collegeCode: "999",
              collegeName: "全部"
            };
            // vm.collegesList = res.data.response
            vm.collegesList.push(all);
            vm.collegesList = vm.collegesList.concat(res.data.response);
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    getSchoolMajorBySchoolId(schoolId, collegeCode) {
      var vm = this;
      this.$axios
        .get(
          "/v1/school/queryMajorList?schoolId=" +
            schoolId +
            "&collegeCode=" +
            collegeCode
        )
        .then(res => {
          if (res.data.code == 10000) {
            // vm.majorList = res.data.response
            vm.majorList = [];
            let all = {
              majorCode: "999",
              majorName: "全部"
            };
            vm.majorList.push(all);
            vm.majorList = vm.majorList.concat(res.data.response);
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    getExportInfo() {
      var vm=this;
      this.$axios.get("/v1/studentpe/getExportInfo").then(res => {
        if (res.data.code == 10000) {
          let data=res.data.response;
          vm.exportAllNum=data.exportNum;
          vm.exportSuccessNum=data.dealSuccessNum;
          vm.exportFailNum=data.dealFailNum ;
          if(data.dealFailNum>0){
            vm.failTf=false
          }
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    exportPeErrorData() {
      var vm = this;
      let url =this.$axios.defaults.baseURL +
        "/v1/studentpe/exportPeErrorData?token=" +
        sessionStorage.getItem("token");
      window.open(url);
    },
    exportAllStudentPre(){
        var vm=this;
        vm.allStudentStasus=true;
    },
    exportAllStudent(){
      var vm = this;
      let url =this.$axios.defaults.baseURL +
        "/v1/studentpe/exportAllStudent?token=" +
        sessionStorage.getItem("token")+'&semesterYear='+vm.allSemester;
      window.open(url);
    },
    cancelexportAllStudent(){

    },
    getSemesterList() {
      var vm = this;
      this.$axios.get("/v1/studentpe/getSemesterList").then(res => {
        if (res.data.code == 10000) {
          vm.semesterYearList =res.data.response ;
          if(res.data.response){
            vm.semesterYear=res.data.response[0].yearSemester
            vm.search();
            vm.getSportsClassSingleInfo();
          }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    getRecentSemester() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getRecentSemester").then(res => {
        if (res.data.code == 10000) {
          vm.semesterYearList =vm.semesterYearList.push(res.data.response) ;
          if(res.data.response){
            vm.semesterYear=res.data.response.yearSemester
            vm.search();
            vm.getSportsClassSingleInfo();
          }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
  },
  watch: {
    college: function() {
      var vm = this;
      if (vm.college) {
        vm.getSchoolMajorBySchoolId(vm.schoolId, vm.college);
      }
    },
    peClassId: function() {
      var vm = this;
      vm.search2();
      for(let i=0;i<vm.peClassList.length;i++){
        if(vm.peClassId==vm.peClassList[i].peClassId){
          vm.peClassName=vm.peClassList[i].peClassName
        }
      }
    },
    semesterYear:function(){
       var vm = this;
       vm.peClassId='';
       vm.peClassName='';
       vm.getSportsClassSingleInfo();
    }
  },
  created() {},
  mounted() {
    var vm = this;

    if(sessionStorage.getItem("sportsClass-sportsStudentClassManage-sportsClassId")){
            this.peClassId=Number(sessionStorage.getItem("sportsClass-sportsStudentClassManage-sportsClassId"));
          }
    vm.isCollege = true;
    vm.getStartYearList();

    vm.getSchoolCollegeBySchoolId(vm.schoolId);
    vm.getExportInfo();
    // vm.getSemesterList();
    vm.getRecentSemester();
    vm.updateUrl =
      this.$axios.defaults.baseURL +
      "/v1/sports/class/file/upload/peExport?schoolId=" +
      sessionStorage.getItem("schoolId") +
      "&token=" +
      sessionStorage.getItem("token");
  }
};
</script>
