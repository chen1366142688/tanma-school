<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">考核管理</h2>
    </div>
    <div>
      <Card >
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>年级：</span>
                    <Select v-model="grade"  style="width:120px;">
                        <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>班级：</span>
                    <Select v-model="studentClass"  style="width:120px;">
                        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
                <Button type="success" @click="exportSchoolTestData">导出EXCEL</Button>
            </div>
         </div>
      </Card>
      <br>
      <div>
        <Row>
          <div style="">
            <Table border max-height="550" :loading="loading" :columns="resultColumns" :data="resultData"></Table>
          </div>
          <br>
          <div style="float: right;">
            <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
          </div>
        </Row>
      </div>
    </div>
    <Modal
            v-model="showModel11"
            :title="showActivityName"
            @on-ok="saveShowType"
            @on-cancel="canncelShowType">
            <div style="padding-top:20px;padding-bottom:5px;color:red;">体测结果查看类型：</div>
            <Select v-model="showType">
                <Option v-for="item in showTypeList" :value="item.itemId" :key="item.itemId">{{ item.itemName }}</Option>
            </Select>
        </Modal>
  </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
      loading:false,
      showModel11:false,
      updateUrl: '',
      schoolId: '',
      schoolType: '',
      grade: '',
      classTestName:'',
      examItemName:'',
      primaryList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: "1",
          label: '一年级'
        },
        {
          grade: "2",
          label: '二年级'
        },
        {
          grade: "3",
          label: '三年级'
        },
        {
          grade: "4",
          label: '四年级'
        },
        {
          grade: "5",
          label: '五年级'
        },
        {
          grade: "6",
          label: '六年级'
        }
      ],
      middleList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: "7",
          label: '七年级'
        },
        {
          grade: "8",
          label: '八年级'
        },
        {
          grade: "9",
          label: '九年级'
        }
      ],
      highList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: "10",
          label: '高一'
        },
        {
          grade: "11",
          label: '高二'
        },
        {
          grade: "12",
          label: '高三'
        }
      ],
      schoolGradeList: [],
      studentClass: '',
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
      registerCode: '',
      studentName: '',
      submitStatus:"",
      onshowInfo:false,
      submitStatusList:[
        {
          value:"",
          label:"全部"
        },
        {
          value:"1",
          label:"已锁定"
        },
        {
          value:"0",
          label:"未锁定"
        }
      ],
      semesterType:"",
      semesterYearList:[
         
      ],
      resultColumns: [
        {
          title: '年级',
          key: 'grade',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            let gradeName = row.gradeId==1?"一年级":row.gradeId==2?"二年级":row.gradeId==3?"三年级":row.gradeId==4?"四年级":row.gradeId==5?"五年级":row.gradeId==6?"六年级":row.gradeId==7?"七年级":row.gradeId==8?"八年级":row.gradeId==9?"九年级":row.gradeId==10?"高一":row.gradeId==11?"高二":row.gradeId==12?"高三":""
            return h('div', gradeName+" ("+row.startSchool+'级)')
          }
        },
        {
          title: '班级',
          key: 'studentClass',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            return h('div',row.studentClass+'班')
          }
        },
        {
          title: '班级总人数',
          key: 'totalStudent',
          align: 'center',
          minWidth:100
        },
        {
          title: '考核完成度',
          key: 'testPercent',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            const row = params.row
            return h('div',row.testPercent+'%')
          }
        },
        {
          title: '平均成绩',
          key: 'averageScore',
          align: 'center',
          minWidth:100,
        },
        {
          title: '优秀率',
          key: 'excellentPercent',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            const row = params.row
            return h('div',row.excellentPercent+'%')
          }
        },
        {
          title: '良好率',
          key: 'goodPercent',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            const row = params.row
            return h('div',row.goodPercent+'%')
          }
        },
        {
          title: '及格率',
          key: 'passPercent',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            const row = params.row
            return h('div',row.passPercent+'%')
          }
        },
        {
          title: '不及格率',
          key: 'notPassPercent',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            const row = params.row
            return h('div',row.notPassPercent?row.notPassPercent+'%':'0')
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toDetail(params.row.classId,params.row.gradeId,params.row.studentClass)
                    }
                  }
                },
                '详情'
              ),
            ])
          }
        }
      ],
      resultData: [],
      itemId:"",
      itemList:[],
      showActivityName:"测试结果查看",
      showType:"1",
      showTypeList:[
          {itemId:"2",itemName:'不可查看'},
          {itemId:"1",itemName:'可查看'}
      ],
      singleClassId:'',
      showTypeChangeType:'',
      pageNum: 1,
      studentClass:'',
      classTestType:"1",
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    getStudentInfoList(schoolId) {
      var vm = this
      vm.loading=true;
      vm.onshowInfo=false;
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-pageNum',vm.pageNum);
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-pageSize',vm.pageSize);
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-submitStatus',vm.submitStatus);
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-grade',vm.grade);
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-studentClass',vm.studentClass);
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-itemId',vm.itemId);
      sessionStorage.setItem('studentExamManage1-queryExamSemesterClassList-semesterType',vm.semesterType);

      let data={
        "classTestName": vm.classTestName,
        "examItemName":vm.examItemName,
        "gradeId": vm.grade,
        "pageNo":vm.pageNum,
        "pageSize": vm.pageSize,
        "studentClass": vm.studentClass,
        classTestType:vm.classTestType
      }

      this.$axios.post('/v1/examschool/getStudentClassTestList',data).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          vm.resultData = res.data.response
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    querySearch(){
      this.pageNum = 1;
      this.pageNo = 1
      this.search();
    },
    search() {
      var vm = this
      let schoolId = vm.schoolId
      vm.getStudentInfoList(schoolId)
      vm.countStudentList(schoolId)
    },
    restore() {
      var vm = this
      vm.grade = ''
      vm.pageNo = 1
      vm.pageSize = 10
      vm.registerCode = ''
      vm.studentClass = ''
      vm.studentName = ''
      vm.college = ''
      vm.major = ''

      let schoolId = vm.schoolId
      vm.getStudentInfoList(schoolId)
      vm.countStudentList(schoolId)
    },
   
    countStudentList(schoolId) {
      var vm = this
       let data={
        "classTestName": vm.classTestName,
        "examItemName":vm.examItemName,
        "gradeId": vm.grade,
        "pageNo":vm.pageNum,
        "pageSize": vm.pageSize,
        "studentClass": vm.studentClass,
        classTestType:vm.classTestType
      }
      this.$axios.post('/v1/examschool/countStudentClassTestList',data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    toDetail(classId,gradeId,studentClass) {
      var vm = this
      sessionStorage.setItem( 'examAchievement1-classExamManage1-classId',classId)
      sessionStorage.setItem( 'examAchievement1-classExamManage1-gradeId',gradeId)
      sessionStorage.setItem( 'examAchievement1-classExamManage1-studentClass',studentClass)
      sessionStorage.setItem( 'examAchievement1-classExamManage1-classTestType',vm.classTestType)
      this.$router.push({ name: 'classExamManage1' })
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value
        this.search()
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value
        this.pageNum = 1;
        this.search()
      }
    },
    getItemList() {
      var vm = this
      this.$axios.get('/v1/examschool/queryExamItemListBySchoolType?schoolType=' + this.schoolType )
        .then(res => {
          if (res.data.code == 10000) {
            vm.itemList = res.data.response
            if(vm.itemList != null && vm.itemList.length >0){
                if(vm.itemId == "" || vm.itemId == null || vm.itemId == undefined){
                  vm.itemId = vm.itemList[0].examItemId;
                }else{
                  vm.itemId = Number(vm.itemId);
                }
                vm.getSchoolAllYearSemester();
            }
          } else {
            if (res.data.code > 39999) {
                vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    lockExamByExamItemId(singleClassId,type,examItemId) {
      var vm = this
      let data={
        "classId": singleClassId,
        "examItemId":examItemId,
        "semesterYear": vm.semesterType,
        "type": type
      };
      this.$axios.post('/v1/studentexam/lockExamByExamItemId',data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.$Message.info('锁定成功')
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
    },
    lockAllExamByParams(type) {
      var vm = this
      let data={
        "classId": vm.studentClass,
        "examItemId":vm.itemId,
        "gradeId": vm.grade,
        "lockStatus": vm.submitStatus,
        "semesterYear": vm.semesterType,
        "type": type
      };
      this.$axios.post('/v1/studentexam/lockAllExamByParams',data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.$Message.info('锁定成功')
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
    },
    showTypeChange(singleClassId,type){
        var vm=this;
        vm.singleClassId=singleClassId;
        vm.showTypeChangeType=type;
        vm.showModel11=true
    },
    updateShowType(singleClassId) {
      var vm = this
      let data={
        "classId":singleClassId,
        "examItemId": vm.itemId,
        "semesterYear":vm.semesterType,
        "type": vm.showType
      };
      this.$axios.post('/v1/studentexam/updateShowType',data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.$Message.info('修改成功')
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
    },
    updateShowTypeByParams() {
      var vm = this
      let data={
        "classId": vm.studentClass,
        "examItemId":vm.itemId,
        "gradeId": vm.grade,
        "lockStatus": vm.submitStatus,
        "semesterYear": vm.semesterType,
        "type": vm.showType
      };
      this.$axios.post('/v1/studentexam/updateShowTypeByParams',data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.$Message.info('修改成功')
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
    },
    saveShowType(){
      var vm = this
      if(vm.showTypeChangeType=='1'){
        vm.updateShowType(vm.singleClassId);
      }else{
        vm.updateShowTypeByParams();
      }
    },
    canncelShowType(){

    },
    exportSchoolTestData() {
      var vm=this;
      let url =
        this.$axios.defaults.baseURL +
        '/v1/examschool/exportClassTestData?studentClass='+vm.studentClass+
        '&gradeId=' +vm.grade+
        '&classTestType=' +vm.classTestType+
        '&token=' +sessionStorage.getItem('token')
      window.open(url)
    },
    getSchoolAllYearSemester() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSchoolAllYearSemester").then(res => {
        if (res.data.code == 10000) {
          vm.semesterYearList =res.data.response ;
          if(res.data.response){
            vm.semesterType=res.data.response[0].yearSemester
            vm.search();
          }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
  },
  // watch: {
  //   grade: function() {
  //     var vm = this
  //     if(vm.grade == ""){
  //         vm.classList=[];
  //     }else{
  //         vm.getSchoolClassList(vm.schoolId, vm.grade)
  //     }
  //   },
  // },
  created() {
     
  },
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    let schoolType = sessionStorage.getItem('schoolType')
    vm.schoolType=schoolType;
    if ('2' == schoolType) {
      vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList)
    }
    if ('3' == schoolType) {
      vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList)
    }
    if ('4' == schoolType) {
      vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList)
    }

    vm.onshowInfo=true;

    let tempPageSize=sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-pageSize');
    let temppageNum= sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-pageNum');
    let tempsubmitStatus = sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-submitStatus');
    let tempgrade = sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-grade');
    let tempstudentClass = sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-studentClass');
    let tempexamItemId = sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-itemId');
    let tempsemesterType = sessionStorage.getItem('studentExamManage1-queryExamSemesterClassList-semesterType');

    if(tempPageSize != null && tempPageSize != undefined && tempPageSize > 0 ){
      vm.pageNum = Number(temppageNum);
      vm.pageSize = Number(tempPageSize);
      if(tempsubmitStatus != null && tempsubmitStatus != undefined && tempsubmitStatus != ""){
        vm.submitStatus =  tempsubmitStatus;
      }
      if(tempgrade != null && tempgrade != undefined && tempgrade != ""){
        vm.grade =  tempgrade;
      }
      if(tempstudentClass != null && tempstudentClass != undefined && tempstudentClass != "" && tempstudentClass > 0){
        vm.studentClass =  Number(tempstudentClass);
      }
      if(tempexamItemId != null && tempexamItemId != undefined && tempexamItemId != ""){
        vm.itemId =  tempexamItemId;
      }
      if(tempsemesterType != null && tempsemesterType != undefined && tempsemesterType != ""){
        vm.semesterType =  tempsemesterType;
      }
    }
    // this.getItemList();
    vm.search();
  }
}
</script>