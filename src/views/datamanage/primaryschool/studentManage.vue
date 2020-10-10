<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">免试管理</h2>
    </div>
    <div>
      <Card>
        <div  @keydown.enter="querySearch" class="top-search">
          <div class="left-input">
            <div style="margin:5px 10px;">
              <span>年<span style="visibility: hidden;">占位</span>级：</span>
              <Select v-model="grade" style="width:120px;">
                <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
              </Select>
            </div>
            <div style="margin:5px 10px;">
              <span>班<span style="visibility: hidden;">占位</span>级：</span>
              <Select v-model="studentClass" style="width:120px;">
                <Option v-for="(item,index) in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div style="margin:5px 10px;">
              <span >是否免试：</span>
              <Select v-model="testTypeId"  style="width:120px;">
                <Option v-for="item in testTypeList" :value="item.typeId" :key="item.typeId">{{ item.typeName }}</Option>
              </Select>
            </div>
            <div style="margin:5px 10px;">
              <span>姓<span style="visibility: hidden;">占位</span>名：</span>
              <Input v-model="studentName"  placeholder="学生姓名" style="width: 120px;" />
            </div>
            <div style="margin:5px 10px;">
              <span>学籍号<span style="visibility:hidden">占</span>：</span>
              <Input v-model="registerCode"  placeholder="学生学籍号" style="width: 120px;" />
            </div>
          </div>
          <div class="right-btns">
            <Button type="success"  @click="querySearch">查询</Button>
            <Button type="success" @click="exportData">导出EXCEL</Button>
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
          <div style="">
            <Table border :loading="loading" max-height="530" :columns="resultColumns" :data="resultData"></Table>
          </div>
          <br>
          <div style="float: right;">
            <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
          </div>
        </Row>
         </Card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'schoolList',
  data() {
    return {
      loading:false,
      schoolId: '',
      activityId: '',
      activityName: '',
      activityList: [],
      schoolType: '',
      grade: '',
      testTypeId:"",
      testTypeList:[
        {
          typeId:2,
          typeName:"全部"
        },
        {
          typeId:1,
          typeName:"免试"
        },
        {
          typeId:0,
          typeName:"未免试"
        }
      ],
      primaryList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 1,
          label: '一年级'
        },
        {
          grade: 2,
          label: '二年级'
        },
        {
          grade: 3,
          label: '三年级'
        },
        {
          grade: 4,
          label: '四年级'
        },
        {
          grade: 5,
          label: '五年级'
        },
        {
          grade: 6,
          label: '六年级'
        }
      ],
      middleList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 7,
          label: '七年级'
        },
        {
          grade: 8,
          label: '八年级'
        },
        {
          grade: 9,
          label: '九年级'
        }
      ],
      highList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 10,
          label: '高一'
        },
        {
          grade: 11,
          label: '高二'
        },
        {
          grade: 12,
          label: '高三'
        }
      ],
      collegeList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 13,
          label: '大一'
        },
        {
          grade: 14,
          label: '大二'
        },
        {
          grade: 15,
          label: '大三'
        },
        {
          grade: 16,
          label: '大四'
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
      resultColumns: [],
      normal: [
        {
          title: '学生姓名',
          key: 'studentName',
          align: 'center'
          //   minWidth: 250
        },
        {
          title: '学籍号',
          key: 'registerCode',
          align: 'center'
          //   width: 150
        },
        {
          title: '年级',
          key: 'gradeName',
          align: 'center'
          //   width: 150
        },
        {
          title: '班级',
          key: 'studentClass',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            // const color = row.exemptId != null ? 'green' : 'red'
            const text = row.studentClass +'班'
            return h('div', text)
          }
        },
        {
          title: '是否免试',
          key: 'exemptId',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.exemptId != null ? 'green' : 'red'
            const text = row.exemptId != null ? '免试' : '需测试'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '免试类型',
          key: 'exemptType',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.exemptType == '1' ? '疾病' :row.exemptType == '2' ? '残疾' : ''
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          //   width: 400,
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
                      this.toDetail(params.row.studentId)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      collegeColumns: [
        {
          title: '学生姓名',
          key: 'studentName',
          align: 'center'
          //   minWidth: 250
        },
        {
          title: '学籍号',
          key: 'registerCode',
          align: 'center'
          //   width: 150
        },
        {
          title: '学院',
          key: 'collegeName',
          align: 'center'
          //   width: 150
        },
        {
          title: '专业',
          key: 'majorName',
          align: 'center'
          //   width: 150
        },
        {
          title: '学级',
          key: 'startSchool',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.startSchool+'级'
            return h('div', text)
          }
        },
        {
          title: '班级',
          key: 'studentClass',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.studentClass+'班'
            return h('div', text)
          }
        },
        {
          title: '是否免试',
          key: 'exemptId',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.exemptId != null ?  'red':'green'
            const text = row.exemptId != null ? '免试' : '需测试'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '免试类型',
          key: 'exemptType',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            console.log( row.exemptType == '1')
            const text = row.exemptType == '1' ? '疾病' :row.exemptType == '2' ? '残疾' : ''
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          //   width: 400,
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
                      this.toDetail(params.row.studentId)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      resultData: [],
      isCollege: false,
      college: '',
      collegesList: [],
      major: '',
      majorList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    getActivitySingleInfoBySchoolId(schoolId) {
      var vm = this
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId
      }
      this.$axios
        .get(
          '/v1/testdata/getActivitySingleInfoBySchoolId?schoolId=' + schoolId
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.activityList = res.data.response
            if (vm.activityList.length > 0) {
              vm.activityId = vm.activityList[0].activityId
              vm.activityName = vm.activityList[0].activityName
              // if (vm.activityList[0].activityId) {
              //   vm.getStudentInfoList(schoolId)
              //   vm.countStudentList(schoolId)
              // }
            }
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getStudentInfoList(schoolId) {
      var vm = this
      vm.loading=true;
      let data = {
        activityId: vm.activityId,
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        registerCode: vm.registerCode,
        schoolId: schoolId,
        studentClass: vm.studentClass,
        studentName: vm.studentName,
        collegeCode: vm.college,
        majorCode: vm.major,
        testTypeId:vm.testTypeId
      }


      sessionStorage.setItem('studentManage-getStudentInfoList-pageNum',vm.pageNum);
      sessionStorage.setItem('studentManage-getStudentInfoList-pageSize',vm.pageSize);
      sessionStorage.setItem('studentManage-getStudentInfoList-grade',vm.grade);
      sessionStorage.setItem('studentManage-getStudentInfoList-studentClass',vm.studentClass);
      sessionStorage.setItem('studentManage-getStudentInfoList-testTypeId',vm.testTypeId);
      sessionStorage.setItem('studentManage-getStudentInfoList-studentName',vm.studentName);
      sessionStorage.setItem('studentManage-getStudentInfoList-registerCode',vm.registerCode);

      this.$axios.post('/v1/student/getStudentInfoList', data).then(res => {
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


      // vm.activityId= vm.activityId,
      vm.grade = ''
      vm.pageNum = 1
      vm.pageSize = 10
      vm.registerCode = ''
      vm.studentClass = ''
      vm.studentName = ''
      vm.college = ''
      vm.major = ''
      vm.testTypeId=""

      let schoolId = vm.schoolId
      vm.getStudentInfoList(schoolId)
      vm.countStudentList(schoolId)
    },
    countStudentList(schoolId) {
      var vm = this
      let data = {
        activityId: vm.activityId,
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        registerCode: vm.registerCode,
        schoolId: schoolId,
        studentClass: vm.studentClass,
        studentName: vm.studentName,
         collegeCode: vm.college,
        majorCode: vm.major,
        testTypeId:vm.testTypeId
      }
      this.$axios.post('/v1/student/countStudentList', data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    toDetail(studentId) {
      var vm = this
      let data = {
        "activityId": vm.activityId,
        "grade": vm.grade,
        "pageNo": vm.pageNum,
        "pageSize": vm.pageSize,
        "registerCode": vm.registerCode,
        "schoolId": vm.schoolId,
        "studentClass": vm.studentClass,
        "studentName": vm.studentName
      }
      sessionStorage.setItem('studentManage-studentExemptDetail-activityId', vm.activityId)
      sessionStorage.setItem('studentManage-studentExemptDetail-studentId', studentId)
      this.$router.push({ name: 'studentExemptDetail' })
    },
    getSchoolData(schoolId) {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      this.$axios
        .get('/v1/school/getSchoolDetail?schoolId=' + schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            console.log(res)
            let data = res.data.response
            this.schoolData = data
            this.schoolName = data.name
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
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

    getSchoolCollegeBySchoolId(schoolId) {
      var vm = this
      this.$axios
        .get('/v1/student/getSchoolCollegeBySchoolId?schoolId=' + schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            vm.collegesList = res.data.response
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getSchoolMajorBySchoolId(schoolId,collegeCode) {
      var vm = this
      this.$axios
        .get('/v1/student/getSchoolMajorBySchoolId?schoolId=' + schoolId+'&collegeCode='+collegeCode)
        .then(res => {
          if (res.data.code == 10000) {
            vm.majorList = res.data.response
          } else {
            if (res.data.code > 39999) {
                vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    exportData(){
      var vm = this
      if(typeof(vm.college) == "undefined"){
        vm.college="";
      }
      if(typeof(vm.grade) == "undefined"){
        vm.grade="";
      }
      if(typeof(vm.major) == "undefined"){
        vm.major="";
      }
      if(typeof(vm.registerCode) == "undefined"){
        vm.registerCode="";
      }

      if(typeof(vm.testTypeId) == "undefined"){
        vm.testTypeId="";
      }
      if(typeof(vm.studentClass) == "undefined"){
        vm.studentClass="";
      }
      if(typeof(vm.studentName) == "undefined"){
        vm.studentName="";
      }

      let url =
        this.$axios.defaults.baseURL +
        '/v1/studentexemptexport/exportSchoolTestData?schoolId='+vm.schoolId+
        '&activityId='+vm.activityId+
        '&collegeCode='+vm.college+
        '&grade='+vm.grade+'&majorCode='+vm.major+'&registerCode='+vm.registerCode+'&testTypeId='+vm.testTypeId+
        '&studentClass='+vm.studentClass+ '&studentName='+vm.studentName+ '&schoolType=1&token=' +
        sessionStorage.getItem('token')
        window.open(url)
      // vm.postExcelFile(data,url);
    },
  },
  watch: {
    activityId: function() {
      var vm = this
      if (vm.activityId) {
        vm.search();
        // vm.getOrganDataInfoBySchoolIdAndActivityId(vm.activityId)
        // vm.getLastDataCreateTime(vm.activityId)
      }
    },
    college:function(){
      var vm=this;
      vm.getSchoolMajorBySchoolId(vm.schoolId,vm.college);
    }
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    // let data = sessionStorage.getItem('studentManage-studentExemptDetail-data')
    // console.log(data.schoolId)
    // if (data) {
    //   // vm.schoolId = data.schoolId

    //   sessionStorage.removeItem('studentManage-studentExemptDetail-data')
    // } else {


    // }
     let schoolId = sessionStorage.getItem('schoolId')
      vm.schoolId = schoolId
      if (schoolId) {
        vm.getActivitySingleInfoBySchoolId(schoolId)
      }
// console.log(vm.schoolId)
    let schoolType = sessionStorage.getItem('schoolType')
    if (schoolType) {
      vm.resultColumns = vm.normal
      if ('0' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList)
          .concat(vm.collegeList)
      }
      // if("1"==schoolType){
      //     vm.schoolGradeList=vm.schoolGradeList.concat(vm.primaryList).concat(vm.middleList).concat(vm.highList).concat(vm.collegeList);
      // }
      if ('2' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList)
      }
      if ('3' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList)
      }
      if ('4' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList)
      }


    let tempPageSize=sessionStorage.getItem('studentManage-getStudentInfoList-pageSize');
    let tempgrade = sessionStorage.getItem('studentManage-getStudentInfoList-grade');
    let tempstudentClass = sessionStorage.getItem('studentManage-getStudentInfoList-studentClass');
    let tempstudentName = sessionStorage.getItem('studentManage-getStudentInfoList-studentName');
    let tempregisterCode = sessionStorage.getItem('studentManage-getStudentInfoList-registerCode');
    let temptestTypeId = sessionStorage.getItem('studentManage-getStudentInfoList-testTypeId');

    if(tempPageSize != null && tempPageSize != undefined && tempPageSize > 0 ){
      vm.pageNum = Number(sessionStorage.getItem('studentManage-getStudentInfoList-pageNum'));
      vm.pageSize = Number(sessionStorage.getItem('studentManage-getStudentInfoList-pageSize'));
      if(tempgrade != null && tempgrade != undefined && tempgrade > 0){
        vm.grade = Number(tempgrade);
      }
      if(tempstudentClass != null && tempstudentClass != undefined && tempstudentClass > 0){
        vm.studentClass = Number(tempstudentClass);;
      }
      if(tempstudentName != null && tempstudentName != undefined && tempstudentName != "" ){
        vm.studentName = tempstudentName;
      }
      if(tempregisterCode != null && tempregisterCode != undefined && tempregisterCode != ""){
        vm.registerCode =  tempregisterCode;
      }
      if(temptestTypeId != null && temptestTypeId != undefined && temptestTypeId != ""){
        vm.testTypeId =  Number(temptestTypeId);
      }
    }

      if ('5' == schoolType) {
        vm.isCollege = true
        vm.resultColumns = vm.collegeColumns

         var date=new Date;
          var year=date.getFullYear();
          var month=date.getMonth()+1;
          // month =(month<10 ? "0"+month:month);
          // var mydate = (year.toString()+month.toString());
          vm.collegeList=[
             {
          grade: 13,
          label: (month>9?year:year-1)+'级'
        },
        {
          grade: 14,
          label: (month>9?year-1:year-2)+'级'
        },
        {
          grade: 15,
          label: (month>9?year-2:year-3)+'级'
        },
        {
          grade: 16,
          label: (month>9?year-3:year-4)+'级'
        }
          ]

        vm.schoolGradeList = vm.schoolGradeList.concat(vm.collegeList)
        // vm.getSchoolMajorBySchoolId(vm.schoolId)
        vm.getSchoolCollegeBySchoolId(vm.schoolId)
      }
    } else {
      vm.resultColumns = vm.normal
      vm.schoolGradeList = vm.schoolGradeList
        .concat(vm.primaryList)
        .concat(vm.middleList)
        .concat(vm.highList)
        .concat(vm.collegeList)
    }
  }
}
</script>
