<template>
  <div>
    <div>
      <h1>{{schoolName}}-体测数据</h1>
    </div>
    <div style="margin-top:15px;">
      <Card>
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>体测学年：</span>
                    <Select v-model="activityId" size="small" style="width:120px;">
                        <Option v-for="item in activityList" :value="item.activityId" :key="item.activityId">{{ item.activityName }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>体测年级：</span>
                    <Select v-model="grade" size="small" style="width:120px;">
                        <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
                <Button v-on:click="pageToList()" type="success">返回</Button>
            </div>
         </div>
      </Card>
      <br>
      <div>
        <Row>
          <div style="">
            <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
          </div>
          <br>
          <div style="float: right;">
            <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
          </div>
        </Row>
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
      showModel11:false,
      showType:"4",
      showTypeList:[
          {itemId:"1",itemName:'测完后可立即查看测试结果'},
          {itemId:"4",itemName:'不允许查看'},
      ],
      subordinateSchoolId:"",
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
          minWidth:100,
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
          minWidth:100,
        },
        {
          title: '班级总人数',
          key: 'allCount',
          align: 'center',
          minWidth:100,
        },
        {
          title: '免试人数',
          key: 'exemptCount',
          align: 'center',
          minWidth:100,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width:150,
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
      schoolName:"",
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    getActivitySingleInfoBySchoolId() {
      var vm = this
      this.$axios.get('/v1/testdata/getActivitySingleInfoBySchoolId?schoolId=' + vm.subordinateSchoolId)
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
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    getClassInfoList() {
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
        schoolId: vm.subordinateSchoolId
      }

      sessionStorage.setItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageNum',vm.pageNum);
      sessionStorage.setItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageSize',vm.pageSize);
      sessionStorage.setItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-grade',vm.grade);
      sessionStorage.setItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-activityId',vm.activityId);
      sessionStorage.setItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-submitStatus',vm.submitStatus);

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
      vm.getClassInfoList()
      vm.countClassList()
    },
    countClassList() {
      var vm = this
      let data = {
        activityId: vm.activityId,
        majorCode: vm.major,
        collegeCode: vm.college,
        submitStatus:vm.submitStatus,
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: vm.subordinateSchoolId
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
      sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-activityId', this.activityId)
      sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-classId', classId)
      sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-gradeName', gradeName)
      sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-startSchool', startSchool)
      sessionStorage.setItem('subordinateSchoolList-subordinateSchoolTestData-subordinateClassTestResult-subordinateSchoolId', this.subordinateSchoolId)
      this.$router.push({ name: 'subordinateClassTestResult' })
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
    vm.subordinateSchoolId =  sessionStorage.getItem('subordinateSchoolList-subordinateSchoolTestData-subordinateSchoolId');
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    if (schoolId) {
        vm.getActivitySingleInfoBySchoolId()
    }
    let schoolType = sessionStorage.getItem('subordinateSchoolList-subordinateSchoolTestData-schoolType');
    this.schoolName = sessionStorage.getItem('subordinateSchoolList-subordinateSchoolTestData-schoolName');
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

    let temppageNum=sessionStorage.getItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageNum');
    let temppageSize = sessionStorage.getItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-pageSize');
    let tempgrade = sessionStorage.getItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-grade');
    let tempactivityId = sessionStorage.getItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-activityId');
    let tempsubmitStatus = sessionStorage.getItem('subordinateSchoolTestData-getOrganDataInfoBySchoolIdAndActivityId-submitStatus');

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