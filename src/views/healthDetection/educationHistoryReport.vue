<template>
  <div style="padding-left:10px;">
      <div>
        <h2 style="margin-top:15px;margin-bottom:13px;">数据报送</h2>
        </div>
      <Card style="margin-top:20px;" :dis-hover="true">
         <Row  type="flex" justify="end" align="middle">
                <Button
                  class="add-button"
                  style="margin:0 20px"
                  v-on:click="educationReportPre"
                  :disabled="edcationDisabled"
                  type="success"
                >报送给教育局</Button>
                 <Button
                  class="add-button"
                  style="margin:0 20px"
                  v-on:click="parentReport"
                  type="success"
                  :disabled="parentDisabled"
                >报送给家长</Button>
                <Button
                  class="add-button"
                  style="margin:0 20px"
                  v-on:click="pageToList"
                  type="success"
              >返回</Button>
        </Row>
     </Card>
        <Card style="margin-top:20px;" :dis-hover="true">
          <div >
              <p>当前数据</p>
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
              <p>历史报送记录</p>
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
              v-model="EducationNotice"
              title="数据报送"
              width="400px"
      >
        <div>
            <p>数据报送给教育局端后，系统数据将被锁定，无法更改，若需更改，需教育局端开启编辑权限，是否确定报送。</p>
        </div>
        <div slot="footer">
            <Button type="text" size="large" :loading="loading" @click="batchScore">提交</Button>
          <Button type="text" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
      <Modal
              v-model="parentNotice"
              title="学科评价数据报送"
              width="400px"
      >
        <div>
            <p>报送给教育局端后，系统数据将被锁定，无法更改，若需更改，需教育局端开启编辑权限，是否确定报送。</p>
        </div>
        <div slot="footer">
            <Button type="text" size="large" :loading="loading" @click="parentReport">提交</Button>
          <Button type="text" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
      <Modal
              v-model="noticeModal"
              title="提醒"
              width="400px"
      >
        <Row style="margin-top: 10px;">
          <Col span="24">
            <span style="margin-left: 20px;">请先将数据上报到教育局端，然后再推送给家长。</span>
          </col>
          </Row>
        <div slot="footer">
            <Button type="text" size="large" @click="cancel">知道了</Button>
        </div>
      </Modal>
      <Modal
            title="成绩计算中"
            v-model="createSemesterScore"
            :closable="false"
            cancel-text=""
            :mask-closable="false">
      <p><Progress :percent="typeScore" status="active"></Progress></p>
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
      noticeModal:false,
      EducationNotice:false,
      parentNotice:false,
      edcationDisabled:false,
      parentDisabled:false,
      statiscalFirst:[
        {
          title: '报送学期',
          key: 'exemptStudent',
          align: 'center',
          minWidth:100,
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
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span', params.row.notSchoolStudent?params.row.notSchoolStudent:0)])
          }
        },
        {
          title: '学校总人数',
          key: 'totalStudent',
          align: 'center',
          minWidth:100,
        },
         {
          title: '体测免试人数',
          key: 'testExemptStudent',
          align: 'center',
          minWidth:100,
        },
        {
          title: '体测完成人数/体测总人数',
          key: 'testFinishStudent',
          align: 'center',
          minWidth:100,
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
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.testFinishStudent){
                text=row.testFinishStudent>0?((row.testTotalScore/row.testFinishStudent/100).toFixed(2)):'0.00';
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span', params.row.notSchoolStudent?params.row.notSchoolStudent:0)])
          }
        },
        {
          title: '学校总人数',
          key: 'totalStudent',
          align: 'center',
          minWidth:100,
        },
        {
          title: '学科评价完成/考核总人数',
          key: 'passStudent',
          align: 'center',
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
        },
        {
          title: '报送项目',
          key: 'reportType',
          align: 'center',
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
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
          minWidth:100,
           render: (h, params) => {
               const row = params.row;
            let text = "";
            if(!row.finishStudent){
                text = "0%";
            }else {
                let all=row.excellentStudent+row.goodStudent;
                let pass=(!row.finishStudent?0:(all*100/row.finishStudent).toFixed(2));
                text = pass+"%";
            }
            return h('div', text)
          }
        },
        {
          title: '合格率',
          key: 'activityExplain',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
               const row = params.row;
            let text = "";
            if(!row.finishStudent){
                text = "0%";
            }else {
                let all=row.excellentStudent+row.goodStudent+row.passStudent;
                let pass=(!row.finishStudent?0:(all*100/row.finishStudent).toFixed(2));
                text = pass+"%";
            }
            return h('div', text)
          }
        },
        {
          title: '报送时间',
          key: 'reportTime',
          align: 'center',
          minWidth:100,
        },
        {
          title: '报送人',
          key: 'teacherName',
          align: 'center',
          minWidth:100,
        },
        {
          title: '状态',
          key: 'reportStatus',
          align: 'center',
          minWidth:100,
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
      cancel(){
          var vm=this;
          vm.EducationNotice=false;
          vm.parentNotice=false;
          vm.noticeModal=false;
      },
      educationReportPre(){
          var vm=this;
          vm.EducationNotice=true
      },
      parentReportPre(){
          var vm=this;
          vm.parentNotice=true;
      },
      toDetailInfo(detail){
          var vm=this;
          sessionStorage.setItem('educationHistoryReport-studentSubjectHisReportDetail-yearSemester',sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"))
        this.$router.push({ name: 'studentSubjectHisReportDetail' })
      },
      pageToList() {
      //返回
      this.$router.go(-1)
        },
    getEducationNowStatiscalInfo(yearSemester){
      var vm=this;
      vm.resultData=[]
        this.$axios.get('/v1/dataReport/getEducationNowStatiscalInfo?yearSemester='+yearSemester).then(res => {
            if (res.data.code == 10000) {
              let data=res.data.response;
                if(data.testTotalStudent==0 || data.subjectTotalStudent==0){
                     vm.edcationDisabled=true;
                }else{
                    vm.edcationDisabled=false;
                }
                data.yearSemester=Number(yearSemester)
                if(data.yearSemester%2==0){
                   data.schoolYear=Number(yearSemester.substring(0,4))
                }else{
                    data.schoolYear=(Number(yearSemester.substring(0,4))-1)
                }
                   vm.resultData.push(data);

            }
        })
    },
    getEducationReportHisList(yearSemester){
      var vm = this;
      this.$axios
        .get("/v1/dataReport/getEducationReportHisList?yearSemester="+yearSemester)
        .then(function(response) {
          if (response.data.code == 10000) {
            vm.resultDataHis=response.data.response;
            if(response.data.response && response.data.response.length>0){
                vm.parentDisabled=false;
            }
          } else {
            vm.$Message.info(response.data.msg);
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    bothReport(){
      var vm=this;
      vm.loading=true
      let data=vm.resultData[0]
      data.reportsType="2"
        this.$axios.post('/v1/dataReport/bothReport',data).then(res => {
          vm.loading=false;
            if (res.data.code == 10000) {
                if(res.data.response.code=="1"){
                  vm.EducationNotice=false
                    vm.$Message.info("上报成功");
                    this.getEducationNowStatiscalInfo(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"))
                this.getEducationReportHisList(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"));
                }else{
                    vm.$Message.info(res.data.response.msg);

                }
            }else{
                vm.$Message.info("上报失败");
            }
        })
    },
    parentReport() {
      this.loading=true
      this.$axios.get("/v1/dataReport/parentReport?reportType=1&yearSemester="+sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester")).then((res) => {
        this.loading=false;
        if (res.data.code == 10000) {
            if(res.data.response.code=="2"){
                this.noticeModal=true;
            }else{
                this.$Message.info("上报成功");
                this.parentNotice=false
                this.getEducationNowStatiscalInfo(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"))
                this.getEducationReportHisList(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"));
            }
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },

   batchScore(){
      this.typeScore=0;
      this.createSemesterScore = true;
      this.$axios.get("/v1/datafiles/insertNewStudent?yearSemester="+sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester")).then(res => {
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
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsExamScore?yearSemester="+sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester")).then(res => {
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
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsHomeworkScore?yearSemester="+sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester")).then(res => {
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
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsLearnScore?yearSemester="+sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester")).then(res => {
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
      this.$axios.get("/v1/datafiles/batchInsertStudentSemesterSportsScore?yearSemester="+sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester")).then(res => {
        if (res.data.code == 10000) {
            this.typeScore = 100;
            this.createSemesterScore = false;
            this.bothReport()
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
       vm.edcationDisabled=true;
       vm.parentDisabled=true;
       vm.schoolId=sessionStorage.getItem('schoolId');
       if(Number(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"))%2==0){
           vm.resultColumns=vm.statiscalFirst;
       }else{
           vm.resultColumns=vm.statiscalSecond;
       }
       vm.getEducationNowStatiscalInfo(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"))
       vm.getEducationReportHisList(sessionStorage.getItem("dataFilesManage-educationHistoryReport-yearSemester"));
  }
}
</script>
