<template>
  <div style="padding-left:10px;">
      <div>
        <h2 style="margin-top:15px;margin-bottom:13px;">{{activityName}}上报数据明细</h2>
        </div>
      <Card style="margin-top:20px;" :dis-hover="true">
         <Row  type="flex" justify="end" align="middle">
                <Button
                  class="add-button"
                  v-on:click="toExportStudent"
                  type="success"
                >初始数据导入</Button>
                <Button
                  class="add-button"
                  style="margin:0 20px"
                  v-on:click="exportTestData"
                  :disabled="visabled"
                  type="success"
                >导出测试数据</Button>
                 <Button
                  class="add-button"
                  v-on:click="toExportStudentTestData"
                  type="success"
                  :disabled="visabled"
                >导入预上报数据</Button>
                <Button
                  class="add-button"
                  style="margin:0 20px"
                  v-on:click="exportReportStudentTestData"
                  :disabled="haveStudent"
                  type="success"
                >导出上报数据</Button>
                <Button
                  class="add-button"
                  v-on:click="pageToList"
                  type="success"
              >返回</Button>
        </Row>
     </Card>
        <Card style="margin-top:20px;" :dis-hover="true">
          <div >
              <div>
                  <Row>
                      <div>
                          <Table  border :columns="resultColumns" :data="resultData"></Table>
                      </div>
                  </Row>
              </div>
          </div>
        </Card>
    </div>
</template>

<script>
export default {
  name: 'teacherList',
  data() {
    return {
      activityId:'',
      activityName:'',
      submitStatus:'',
      haveStudent:true,
      schoolId:"",
      showModel:false,
      visabled:true,
      resultColumns: [
        {
          title: '学生总人数',
          key: 'totalStudent',
          align: 'center',
          minWidth:100,
        },
        {
          title: '不在校学生人数',
          key: 'notSchoolStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span', params.row.notSchoolStudent?params.row.notSchoolStudent:0)])
          }
        },
        {
          title: '免试人数',
          key: 'exemptStudent',
          align: 'center',
          minWidth:100,
        },
         {
          title: '完成人数/测试总人数',
          key: 'testStudent',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
             var vm=this;
             let row=params.row;
            let finished=row.excellentStudent+row.goodStudent+row.passStudent+row.notPassStudent;
            let totalStudent=row.totalStudent-row.notSchoolStudent-row.exemptStudent
            return h('div', [h('span', finished+"/"+totalStudent)])
          }
        },
        {
          title: '优秀人数',
          key: 'excellentStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.excellentStudent?params.row.excellentStudent:"--")])
          }
        },
         {
          title: '优秀率',
          key: 'showType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.excellentStudent?(100*params.row.excellentStudent/ params.row.testStudent).toFixed(2)+"%":"--")])
          }
        },
        {
          title: '良好人数',
          key: 'goodStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.goodStudent?params.row.goodStudent:"--")])
          }
        },
         {
          title: '良好率',
          key: 'showType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.goodStudent?(100*params.row.goodStudent/ params.row.testStudent).toFixed(2)+"%":"--")])
          }
        },
        {
          title: '及格人数',
          key: 'passStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.passStudent?params.row.passStudent:"--")])
          }
        },
         {
          title: '及格率',
          key: 'showType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.passStudent?(100*params.row.passStudent/ params.row.testStudent).toFixed(2)+"%":"--")])
          }
        },
        {
          title: '不及格人数',
          key: 'notPassStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.notPassStudent?params.row.notPassStudent:"--")])
          }
        },
         {
          title: '不及格率',
          key: 'showType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.notPassStudent?(100*params.row.notPassStudent/ params.row.testStudent).toFixed(2)+"%":"--")])
          }
        },
        {
          title: '优良人数',
          key: 'excellentGoodStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.excellentGoodStudent?params.row.excellentGoodStudent:"--")])
          }
        },
         {
          title: '优良率',
          key: 'showType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.excellentGoodStudent?(100*params.row.excellentGoodStudent/ params.row.testStudent).toFixed(2)+"%":"--")])
          }
        },
        {
          title: '合格人数',
          key: 'allPassStudent',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.allPassStudent?params.row.allPassStudent:"--")])
          }
        },
         {
          title: '合格率',
          key: 'showType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span',params.row.allPassStudent?(100*params.row.allPassStudent/ params.row.testStudent).toFixed(2)+"%":"--")])
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
                      padding:'5px',
                      marginRight:0
                    },
                    on: {
                      click: () => {
                          this.toDetailInfo(params.row.activityId);
                      }
                    }
                  },
                  '查看详情'
                )
              ])
          }
        }
      ],
      resultData: [],
    }
  },
  methods: {
      toExportStudent(){
          var vm=this;
          sessionStorage.setItem('schoolTestDetail-schoolTestStudentExport-activityId',vm.activityId)
        sessionStorage.setItem('schoolTestDetail-schoolTestStudentExport-activityName',vm.activityName)
        sessionStorage.setItem('schoolTestDetail-schoolTestStudentExport-taskType',"3")
        this.$router.push({ name: 'schoolTestStudentExport' })
      },
      exportTestData(){
         var vm=this;
        let url =
        this.$axios.defaults.baseURL +
        '/v1/schoolteststudent/exportStudentTestStatisticalData?activityId='+vm.activityId+'&token=' +sessionStorage.getItem('token')
        window.open(url)
      },
      exportReportStudentTestData(){
         var vm=this;
        let url =
        this.$axios.defaults.baseURL +
        '/v1/schoolteststudent/exportReportStudentTestData?activityId='+vm.activityId+'&token=' +sessionStorage.getItem('token')
        window.open(url)
      },
      toExportStudentTestData(){
         var vm=this;
          sessionStorage.setItem('schoolTestDetail-schoolTestStudentExport-activityId',vm.activityId)
        sessionStorage.setItem('schoolTestDetail-schoolTestStudentExport-activityName',vm.activityName)
        sessionStorage.setItem('schoolTestDetail-schoolTestStudentExport-taskType',"2")
        this.$router.push({ name: 'schoolTestStudentExport' })
      },
      pageToList() {
      //返回
      this.$router.go(-1)
    },
    getActivityYearDetailInfo(activityId){
      var vm=this;
        this.$axios.get('/v1/schoolteststudent/getActivityYearDetailInfo?activityId='+activityId).then(res => {
            if (res.data.code == 10000) {
              let data=res.data.response;
                if(data){
                  this.resultData.push(res.data.response);
                  // vm.visabled=false
                  let testStudent=(data.excellentStudent?data.excellentStudent:0)+(data.goodStudent?data.goodStudent:0)
                  +(data.passStudent?data.passStudent:0)+(data.notPassStudent?data.notPassStudent:0);
                  if(vm.submitStatus=="1"){
                    vm.visabled=true
                  }else{
                    if(testStudent >= data.testStudent && testStudent>0){
                        vm.visabled=false
                    }else{
                      vm.visabled=true
                    }
                  }
                }
                if(data && data.totalStudent && data.totalStudent > 0){
                    vm.haveStudent = false ;
                }else{
                    vm.haveStudent = true ;
                    vm.visabled = true;
                }

                let finished=data.excellentStudent+data.goodStudent+data.passStudent+data.notPassStudent;
                let totalStudent=data.totalStudent-data.notSchoolStudent-data.exemptStudent
                if(finished < totalStudent){
                    vm.visabled = true ;
                }
                
            }
        })
    },
    toDetailInfo(activityId){
      var vm=this;
        sessionStorage.setItem('schoolTest-studebtTestList-activityId',vm.activityId)
        sessionStorage.setItem('schoolTest-studebtTestList-submitStatus',vm.submitStatus)
        this.$router.push({ name: 'studebtTestList' })
    },
  },
  created() {
  },
  mounted() {
      var vm=this;
       vm.activityId = sessionStorage.getItem("schoolTest-schoolTestDetail-activityId");
       vm.activityName = sessionStorage.getItem("schoolTest-schoolTestDetail-activityName");
       vm.submitStatus = sessionStorage.getItem("schoolTest-schoolTestDetail-submitStatus");
       vm.visabled=true
       vm.schoolId=sessionStorage.getItem('schoolId');
       vm.getActivityYearDetailInfo(sessionStorage.getItem("schoolTest-schoolTestDetail-activityId"))
  }
}
</script>