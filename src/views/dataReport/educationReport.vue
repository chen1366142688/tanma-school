<template>
  <div style="padding-left:10px;">
      <div>
        <h2 style="margin-top:15px;margin-bottom:13px;">教育局端数据报送</h2>
        </div>
      <Card style="margin-top:20px;" :dis-hover="true">
         <Row  type="flex" justify="end" align="middle">
                <Button
                  class="add-button"
                  style="margin:0 20px"
                  v-on:click="testReportPre"
                  :disabled="testDisabled"
                  type="success"
                >体质健康数据报送</Button>
                 <Button
                  class="add-button"
                  v-on:click="subjectReportPre"
                  type="success"
                  :disabled="subjectDisabled"
                >学科评价数据报送</Button>
        </Row>
     </Card>
        <Card style="margin-top:20px;" :dis-hover="true">
          <div >
              <div style="font-size:18px;height:40px;">当前数据</div>
              <div>
                  <Row>
                      <div>
                          <Table  border :columns="resultColumns" :data="resultData"></Table>
                      </div>
                  </Row>
              </div>
          </div>
        </Card>
        <Card style="margin-top:20px;" :dis-hover="true">
          <div >
              <div style="font-size:18px;height:40px;">历史报送记录</div>
              <div>
                  <Row>
                      <div>
                          <Table  border :columns="resultColumnsHis" :data="resultDataHis"></Table>
                      </div>
                  </Row>
              </div>
          </div>
        </Card>
         <Modal
              v-model="testNotice"
              title="体质测试数据报送"
              width="400px"
      >
        <div>
            <p>体质测试数据报送给教育局端后，系统数据将被锁定，无法更改，若需更改，需教育局端开启编辑权限，是否确定报送。</p>
        </div>
        <div slot="footer">
            <Button type="text" size="large" :loading="loading" @click="testReport">提交</Button>
          <Button type="text" size="large"  @click="cancel">取消</Button>
        </div>
      </Modal>
      <Modal
              v-model="subjectNotice"
              title="学科评价数据报送"
              width="400px"
      >
        <div>
            <p>学科评价数据报送给教育局端后，系统数据将被锁定，无法更改，若需更改，需教育局端开启编辑权限，是否确定报送。</p>
        </div>
        <div slot="footer">
            <Button type="text" size="large" :loading="loading" @click="batchScore">提交</Button>
          <Button type="text" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
export default {
  name: 'teacherList',
  data() {
    return {
      typeScore: 0,
      createSemesterScore: false,
      schoolId:"",
      loading:false,
      testNotice:false,
      subjectNotice:false,
      testDisabled:false,
      subjectDisabled:false,
      statiscalFirst:[
        {
          title: '报送学期',
          key: 'exemptStudent',
          align: 'center',
          render: (h, params) => {
             var vm=this;
             let row=params.row;
             let text="";
             if(row.yearSemester%2==0){
                 text=row.schoolYear+"第一学期"
             }else{
                 text=row.schoolYear+"第二学期"
             }
            return h('div', text)
          }
        },
        {
          title: '不在校学生',
          key: 'notSchoolStudent',
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.notSchoolStudent?params.row.notSchoolStudent:0)])
          }
        },
        {
          title: '学校总人数',
          key: 'totalStudent',
          align: 'center',
        },
         {
          title: '体测免试人数',
          key: 'testExemptStudent',
          align: 'center',
        },
        {
          title: '体测完成人数/体测总人数',
          key: 'testFinishStudent',
          align: 'center',
          render: (h, params) => {
               const row = params.row;
            let text = "";
            if(row.testTotalStudent){
                text=row.testFinishStudent+"/"+row.testTotalStudent;
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
         {
          title: '体测平均分',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.testFinishStudent){
                text=(row.testTotalScore/row.testFinishStudent/100).toFixed(2);
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
        {
          title: '体测优良率',
          key: 'goodStudent',
          align: 'center',
          render: (h, params) => {
           const row = params.row;
            let text = "";
            if(row.testFinishStudent){
                let all=row.testExcellentStudent+row.testGoodStudent;
                text=(all*100/row.testFinishStudent).toFixed(2)+"%";
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
         {
          title: '体测合格率',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.testFinishStudent){
                let all=row.testExcellentStudent+row.testGoodStudent+row.testPassStudent;
                text=(all*100/row.testFinishStudent).toFixed(2)+"%";
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
        {
          title: '学科评价完成/考核总人数',
          key: 'passStudent',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.subjectTotalStudent){
                text=row.subjectFinishStudent+"/"+row.subjectTotalStudent;
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
         {
          title: '学科评价平均分',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.subjectFinishStudent){
                text=(row.subjectTotalScore/row.subjectFinishStudent/100).toFixed(2);
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
        {
          title: '学科评价优良率',
          key: 'notPassStudent',
          align: 'center',
          render: (h, params) => {
           const row = params.row;
            let text = "";
            if(row.subjectFinishStudent){
                let all=row.subjectExcellentStudent+row.subjectGoodStudent;
                text=(all*100/row.subjectFinishStudent).toFixed(2)+"%";
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
         {
          title: '学科评价合格率',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
           const row = params.row;
            let text = "";
            if(row.subjectFinishStudent){
                let all=row.subjectExcellentStudent+row.subjectGoodStudent+row.subjectPassStudent;
                text=(all*100/row.subjectFinishStudent).toFixed(2)+"%";
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
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
                          this.toDetailInfo(params.row);
                      }
                    }
                  },
                  '查看详情'
                )
              ])
          }
        }
      ],
      statiscalSecond:[
        {
          title: '报送学期',
          key: 'exemptStudent',
          align: 'center',
          render: (h, params) => {
             var vm=this;
             let row=params.row;
             let text="";
             if(row.yearSemester%2==0){
                 text=row.schoolYear+"第一学期"
             }else{
                 text=row.schoolYear+"第二学期"
             }
            return h('div', text)
          }
        },
        {
          title: '不在校学生',
          key: 'notSchoolStudent',
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.notSchoolStudent?params.row.notSchoolStudent:0)])
          }
        },
        {
          title: '学校总人数',
          key: 'totalStudent',
          align: 'center',
        },
        {
          title: '学科评价完成/考核总人数',
          key: 'passStudent',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.subjectTotalStudent){
                text=row.subjectFinishStudent+"/"+row.subjectTotalStudent;
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
         {
          title: '学科评价平均分',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.subjectFinishStudent){
                text=(row.subjectTotalScore/row.subjectFinishStudent/100).toFixed(2);
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
        {
          title: '学科评价优良率',
          key: 'notPassStudent',
          align: 'center',
          render: (h, params) => {
           const row = params.row;
            let text = "";
            if(row.subjectFinishStudent){
                let all=row.subjectExcellentStudent+row.subjectGoodStudent;
                text=(all*100/row.subjectFinishStudent).toFixed(2)+"%";
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
         {
          title: '学科评价合格率',
          key: 'showType',
          align: 'center',
          render: (h, params) => {
           const row = params.row;
            let text = "";
            if(row.subjectFinishStudent){
                let all=row.subjectExcellentStudent+row.subjectGoodStudent+row.subjectPassStudent;
                text=(all*100/row.subjectFinishStudent).toFixed(2)+"%";
            }else{
               text= "--"
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
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
                          this.toDetailInfo(params.row);
                      }
                    }
                  },
                  '查看详情'
                )
              ])
          }
        }
      ],
      resultColumns: [],
      resultData: [],
      resultColumnsHis: [
        {
          title: '报送学期',
          key: 'exemptStudent',
          align: 'center',
          render: (h, params) => {
             var vm=this;
             let row=params.row;
             let text="";
             if(row.yearSemester%2==0){
                 text=row.schoolYear+"第一学期"
             }else{
                 text=row.schoolYear+"第二学期"
             }
            return h('div', text)
          }
        },
         {
          title: '报送学生',
          key: 'reportStudentNum',
          align: 'center',
        },
        {
          title: '报送项目',
          key: 'reportType',
          align: 'center',
          render: (h, params) => {
               const row = params.row;
            let text = "";
           text=row.reportType=="1"?"体质测试":"学科评价"
            return h('div', text)
          }
        },
         {
          title: '完成人数/总人数',
          key: 'activityExplain',
          align: 'center',
           render: (h, params) => {
               const row = params.row;
            let text = row.finishStudent+"/"+row.reportStudentNum;
            return h('div', text)
          }
        },
        {
          title: '平均分',
          key: 'activityExplain',
          align: 'center',
           render: (h, params) => {
               const row = params.row;
            let text =!row.finishStudent?0: (row.totalScore/row.finishStudent/100).toFixed(2);
            return h('div', text)
          }
        },
        {
          title: '优良率',
          key: 'activityExplain',
          align: 'center',
           render: (h, params) => {
               const row = params.row;
            let text = "";
            if(!row.finishStudent){
                text = "0%";
            }else {
                let all=row.excellentStudent+row.goodStudent;
                let pass=(all*100/row.finishStudent).toFixed(2)+"%";
                text = pass;
            }
            return h('div', text)
          }
        },
        {
          title: '合格率',
          key: 'activityExplain',
          align: 'center',
           render: (h, params) => {
               const row = params.row;
            let text = "";
            if(!row.finishStudent){
                text = "0%";
            }else {
                let all=row.excellentStudent+row.goodStudent+row.passStudent;
                let pass=(all*100/row.finishStudent).toFixed(2)+"%";
                text = pass;
            }
            return h('div', text)
          }
        },
        {
          title: '报送时间',
          key: 'reportTime',
          align: 'center',
        },
        {
          title: '报送人',
          key: 'teacherName',
          align: 'center',
        },
        {
          title: '状态',
          key: 'reportStatus',
          align: 'center',
           render: (h, params) => {
               const row = params.row;
            let text = row.reportStatus=="1"?"报送成功":row.reportStatus=="0"?"数据处理中":"报送失败";
            return h('div', text)
          }
        },
      ],
      resultDataHis: [],
    }
  },
  methods: {
    testReportPre(){
      var vm=this;
      vm.testNotice=true;
    },
    subjectReportPre(){
      var vm=this;
      vm.subjectNotice=true;
    },
      cancel(){
          var vm=this;
          vm.testNotice=false;
          vm.subjectNotice=false;
      },
      toDetailInfo(detail){
          var vm=this;
          sessionStorage.setItem('educationReport-studentSubjectReportDetail-yearSemester',detail.yearSemester)
        this.$router.push({ name: 'studentSubjectReportDetail' })
      },
      pageToList() {
      //返回
      this.$router.go(-1)
        },
    getEducationNowStatiscalInfo(){
      var vm=this;
      vm.resultData=[]
        this.$axios.get('/v1/dataReport/getEducationNowStatiscalInfo').then(res => {
            if (res.data.code == 10000) {
              let data=res.data.response;
                if(data.yearSemester%2==0){
                    vm.testDisabled=false;
                }else{
                    vm.testDisabled=true;
                }
                if(data.testTotalStudent==0){
                     vm.testDisabled=true;
                }
                if(data.subjectTotalStudent==0){
                    vm.subjectDisabled=true;
                }else{
                    vm.subjectDisabled=false;
                }
                vm.resultData.push(data);
            }
        })
    },
    getEducationReportHisList(){
      var vm = this;
      this.$axios
        .get("/v1/dataReport/getEducationReportHisList?yearSemester=")
        .then(function(response) {
          if (response.data.code == 10000) {
            vm.resultDataHis=response.data.response;
          } else {
            vm.$Message.info(response.data.msg);
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    testReport(){
      var vm=this;
      vm.loading=true;
      let data=vm.resultData[0]
      data.reportsType="2"
        this.$axios.post('/v1/dataReport/testReport',data).then(res => {
          vm.loading=false;
            if (res.data.code == 10000) {
                if(res.data.response.code=="1"){
                  vm.testNotice=false;
                    vm.$Message.info("上报成功");
                    vm.getEducationNowStatiscalInfo()
       vm.getEducationReportHisList();
                }else{
                    vm.$Message.info(res.data.response.msg);
                }
            }else{
                vm.$Message.info("上报失败");
            }
        })
    },
    subjectReport(){
      var vm=this;
      vm.loading=true;
      let data=vm.resultData[0]
      data.reportsType="2"
        this.$axios.post('/v1/dataReport/subjectReport',data).then(res => {
          vm.loading=false;
            if (res.data.code == 10000) {
              if(res.data.response.code=="1"){
                vm.subjectNotice=false;
                    vm.$Message.info("上报成功");
                    vm.getEducationNowStatiscalInfo()
       vm.getEducationReportHisList();
                }else{
                    vm.$Message.info(res.data.response.msg);
                }
            }else{
                vm.$Message.info("上报失败");
            }
        })
    },
   
   batchScore(){
      this.typeScore=0;
      this.createSemesterScore = true;
      this.$axios.get("/v1/datafiles/insertNewStudent?yearSemester="+sessionStorage.getItem("yearSemester")).then(res => {
        if (res.data.code == 10000) {
          this.batchScore1();
          this.typeScore = 20;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    batchScore1(){
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsExamScore?yearSemester="+sessionStorage.getItem("yearSemester")).then(res => {
        if (res.data.code == 10000) {
          this.batchScore2();
          this.typeScore = 40;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    batchScore2(){
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsHomeworkScore?yearSemester="+sessionStorage.getItem("yearSemester")).then(res => {
        if (res.data.code == 10000) {
          this.batchScore3();
          this.typeScore = 60;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    batchScore3(){
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsLearnScore?yearSemester="+sessionStorage.getItem("yearSemester")).then(res => {
        if (res.data.code == 10000) {
          this.batchScore4();
          this.typeScore = 80;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    batchScore4(){
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsScore?yearSemester="+sessionStorage.getItem("yearSemester")).then(res => {
        if (res.data.code == 10000) {
            this.typeScore = 100;
            this.createSemesterScore = false;
            this.subjectReport()
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
  },
  created() {
  },
  mounted() {
      var vm=this;
       vm.testDisabled=true;
       vm.subjectDisabled=true;
       vm.schoolId=sessionStorage.getItem('schoolId');
       if(Number(sessionStorage.getItem("yearSemester"))%2==0){
           vm.resultColumns=vm.statiscalFirst;
       }else{
           vm.resultColumns=vm.statiscalSecond;
       }
       vm.getEducationNowStatiscalInfo()
       vm.getEducationReportHisList();
  }
}
</script>