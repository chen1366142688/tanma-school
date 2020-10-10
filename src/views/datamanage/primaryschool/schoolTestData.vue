<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测数据管理</h2>
    </div>
    <div>
      <Card>
       <div class="top-search">
          <div class="left-input">
            <span>体测年级：</span>
            <Select v-model="grade" style="width:120px;">
              <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
            </Select>
         </div>
         <div class="right-btns">
              <Button type="success"  @click="querySearch">查询</Button>
              <Button type="success"   @click="showTypeChange(0,2)">按筛选条件设置家长端查看权限</Button>
              <Button type="warning"   @click="exportSchoolTestData">导出EXCEL</Button>
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
            <Table border :loading="loading" max-height="600"   :columns="resultColumns" :data="resultData"></Table>
          </div>
          <br>
          <div style="float: right;">
            <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
          </div>
        </Row>
        </Card>
      </div>
    </div>
    <Modal
            v-model="showModel11"
            :title="showActivityName"
            @on-ok="saveShowType"
            @on-cancel="canncelShowType">
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
      showActivityName:"体测结果查看类型",
      showType:"4",
      showTypeList:[
          {itemId:"1",itemName:'测完后可立即查看测试结果'},
          {itemId:"4",itemName:'不允许查看'},
      ],
      showTypeChangeType:'',
      schoolId: '',
      activityId: '',
      activityName: '',
      activityList: [],
      schoolType: '',
      grade: '',
      submitTypeList:[
        {
          typeId:"",
          typeName:"全部"
        },
        {
          typeId:1,
          typeName:"锁定"
        },
        {
          typeId:0,
          typeName:"未锁定"
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
      registerCode: '',
      studentName: '',
      resultColumns: [
        {
          title: '学级',
          key: 'grade',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.grade=="1"?"一年级":row.grade=="2"?"二年级":row.grade=="3"?"三年级":row.grade=="4"?"四年级":row.grade=="5"?"五年级":row.grade=="6"?"六年级":row.grade=="7"?"七年级":row.grade=="8"?"八年级":row.grade=="9"?"九年级":row.grade=="10"?"高一":row.grade=="11"?"高二":row.grade=="12"?"高三":'年级'
            return h('div', text)
          }
        },
        {
          title: '班级',
          key: 'gradeName',
          align: 'center',
        },
        {
          title: '班级总人数',
          key: 'allCount',
          align: 'center',
        },
        {
          title: '免试人数',
          key: 'exemptCount',
          align: 'center',
        },
        {
          title: '学生查看体测结果类型',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.showType=='1'?"测完后可立即查看测试结果":params.row.showType=='2'?"上报后查看测试结果":params.row.showType=='3'?"上报后才能查看上报测试结果":"不允许查看")])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:340,
          render: (h, params) => {
            const row = params.row
             return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'success'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.toDetail(row.classId,row.gradeName,row.startSchool);
                      }
                    }
                  },
                  '详情'
                ),
               h(
                  'Button',
                  {
                    props: {
                      type: 'success'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                         this.showTypeChange(row.classId,"1");
                      }
                    }
                  },
                  '修改查看类型'
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
      submitStatus:"",
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    submitChange(classId,type){
      let vm = this;
      this.$axios.get('/v1/testdata/test/class?classId=' + classId+'&activityId=' + this.activityId+'&submitStatus=' + type)
      .then(res => {
        if (res.data.code == 10000) {
            vm.$Message.info("操作成功！");
            vm.getClassInfoList(vm.schoolId)
            vm.countClassList(vm.schoolId)
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    getActivitySingleInfoBySchoolId() {
      var vm = this
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: vm.schoolId
      }
      this.$axios.get('/v1/testdata/getActivitySingleInfoBySchoolId?schoolId=' + vm.schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            vm.activityList = res.data.response
            if (vm.activityList.length > 0) {
              vm.activityId = vm.activityList[0].activityId
              vm.activityName = vm.activityList[0].activityName
            }
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getClassInfoList(schoolId) {
      this.loading=true;
      var vm = this
      let data = {
        activityId: vm.activityId,
        majorCode: vm.major,
        collegeCode: vm.college,
        submitStatus:vm.submitStatus,
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId
      }

      sessionStorage.setItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageNum',vm.pageNum);
      sessionStorage.setItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageSize',vm.pageSize);
      sessionStorage.setItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-grade',vm.grade);
      sessionStorage.setItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-activityId',vm.activityId);
      sessionStorage.setItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-submitStatus',vm.submitStatus);

      this.$axios.post('/v1/testdata/getOrganDataInfoBySchoolIdAndActivityId', data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.resultData = res.data.response
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
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
      vm.getClassInfoList(schoolId)
      vm.countClassList(schoolId)
    },
    restore() {
      var vm = this
      // vm.activityId= vm.activityId,
      vm.grade = ''
      vm.pageNo = 1
      vm.pageSize = 10
      vm.registerCode = ''
      vm.studentClass = ''
      vm.studentName = ''
      vm.college = ''
      vm.major = ''
      vm.testTypeId=""
      vm.submitStatus=""

      let schoolId = vm.schoolId
      vm.getClassInfoList(schoolId)
      vm.countClassList(schoolId)
    },
    countClassList(schoolId) {
      var vm = this
      let data = {
        activityId: vm.activityId,
        majorCode: vm.major,
        collegeCode: vm.college,
        submitStatus:vm.submitStatus,
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId
      }
      this.$axios.post('/v1/testdata/countDataListNumByActivityId',data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    toDetail(classId,gradeName,startSchool) {
      sessionStorage.setItem('studentManage-schoolTestData-classTestResult-activityId', this.activityId)
      sessionStorage.setItem('studentManage-schoolTestData-classTestResult-classId', classId)
      sessionStorage.setItem('studentManage-schoolTestData-classTestResult-gradeName', gradeName)
      sessionStorage.setItem('studentManage-schoolTestData-classTestResult-startSchool', startSchool)
      this.$router.push({ name: 'classTestResult' })
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
    exportSchoolTestData() {
      var vm=this;
      let schoolId=vm.schoolId;
      let activityId=vm.activityId;
      let type=sessionStorage.getItem('schoolType')=="2"?"2":"5";
      let url =
        this.$axios.defaults.baseURL +
        '/v1/testdata/exportSchoolTestData?schoolId=' +
        schoolId +
        '&activityId=' +
        activityId +
        '&type=' +
        type +
        '&token=' +
       sessionStorage.getItem('token')+'&grade='+vm.grade+'&submitStatus='+vm.submitStatus
      window.open(url)
    },
    exportSchoolTestDataChange() {
      var vm=this;
      let schoolId=vm.schoolId;
      let activityId=vm.activityId;
      let type=5;
      let url =
        this.$axios.defaults.baseURL +
        '/v1/testdata/exportSchoolTestDataChange?schoolId=' +
        schoolId +
        '&activityId=' +
        activityId +
        '&type=' +
        type +
        '&token=' +
        sessionStorage.getItem('token')+'&grade='+vm.grade+'&submitStatus='+vm.submitStatus
      window.open(url)
    },

    lockAllByParams(type) {
      this.loading=true;
      var vm = this
      let data = {
        activityId: vm.activityId,
        majorCode: vm.major=='999'?'':vm.major,
        collegeCode: vm.college=='999'?'':vm.college,
        submitStatus:vm.submitStatus=='999'?'':vm.submitStatus,
        grade: vm.grade=='999'?'':vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: vm.schoolId,
        lockType:type
      }
      this.$axios.post('/v1/testdata/lockAllByParams', data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.$Message.info('全部锁定成功')
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
    },
    showTypeChange(classId,type){
        var vm=this;
        vm.classId=classId;
        vm.showTypeChangeType=type;
        vm.showModel11=true
    },
    saveShowType(){
        this.loading=true;
      var vm = this
      if(vm.showTypeChangeType=='1'){
        vm.changeShowTypeByClass(vm.classId);
        return false;
      }

      let data = {
        activityId: vm.activityId,
        majorCode: vm.major=='999'?'':vm.major,
        collegeCode: vm.college=='999'?'':vm.college,
        submitStatus:vm.submitStatus=='999'?'':vm.submitStatus,
        grade: vm.grade=='999'?'':vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: vm.schoolId,
        showType:vm.showType
      }
      this.$axios.post('/v1/testdata/changeShowTypeByParams', data)
        .then(res => {
          this.loading=false;
          if (res.data.code == 10000) {
            this.$Message.info("修改成功")
            vm.search();
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
    },
    canncelShowType(){

    },
    changeShowTypeByClass(classId){
      let vm = this;
      this.$axios.get('/v1/testdata/changeShowTypeByClassId?classId=' + classId+'&activityId=' + this.activityId+'&type=' + vm.showType)
      .then(res => {
        if (res.data.code == 10000) {
            vm.$Message.info("操作成功！");
            vm.search();
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
          }
        }
      })
    },
  },
  watch: {
    activityId: function() {
      var vm = this
      if (vm.activityId) {
        vm.search();
      }
    },
    college:function(){
      var vm=this;
      vm.getSchoolMajorBySchoolId(vm.schoolId,vm.college);
    }
  },
  created() {
  },
  mounted() {
   
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    if (schoolId) {
        vm.getActivitySingleInfoBySchoolId()
    }
    let schoolType = sessionStorage.getItem('schoolType')
    if (schoolType) {
      if ('0' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList)
          .concat(vm.collegeList)
      }
      if ('2' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList)
      }
      if ('3' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList)
      }
      if ('4' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList)
      }

    let temppageNum=sessionStorage.getItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageNum');
    let temppageSize = sessionStorage.getItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageSize');
    let tempgrade = sessionStorage.getItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-grade');
    let tempactivityId = sessionStorage.getItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-activityId');
    let tempsubmitStatus = sessionStorage.getItem('schoolTestData-getOrganDataInfoBySchoolIdAndActivityId-submitStatus');

    if(temppageSize != null && temppageSize != undefined && temppageSize > 0 ){
      vm.pageNum = Number(temppageNum);
      vm.pageSize = Number(temppageSize);
      if(tempgrade != null && tempgrade != undefined && tempgrade > 0){
        vm.grade = Number(tempgrade);
      }
      if(tempactivityId != null && tempactivityId != undefined && tempactivityId > 0){
        vm.activityId = Number(tempactivityId);;
      }
      if(tempsubmitStatus != null && tempsubmitStatus != undefined && tempsubmitStatus != "" ){
        vm.submitStatus = Number(tempsubmitStatus);
      }
    }
      if ('5' == schoolType) {
        vm.isCollege = true
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
        vm.getSchoolCollegeBySchoolId(vm.schoolId)
      }
    } else {
      vm.schoolGradeList = vm.schoolGradeList
        .concat(vm.primaryList)
        .concat(vm.middleList)
        .concat(vm.highList)
        .concat(vm.collegeList)
    }
  }
}
</script>