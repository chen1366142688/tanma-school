<template>
  <div style="padding-left:10px;">
    <Card>
        <Table :loading="tableLoading" border :columns="resultColumns" :data="resultData"></Table>
    </Card>
    <Modal
            v-model="applyWindow"
            title="编辑权限申请"
            @on-ok="submitApply"
            @on-cancel="closeApplyWindow"
            :mask-closable="false"
            :loading="false"
            width="550px"
    >
      <div style="margin-top:10px;">
        <Row>
          <Col span="4">
            <span>编辑数据：</span>
          </Col>
          <Col span="18">
            <RadioGroup v-model="applyData.applyType" @on-change="queryStatus">
              <Radio v-for="item in typeList" :label="item.value">
                {{item.label}}
              </Radio>
            </RadioGroup>
            <p style="color: red" v-if="!reportStatus">该数据还没有完成数据报送，现有数据编辑权限，无需向相关单位申请。</p>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col span="4">
            <span>申请内容：</span>
          </Col>
          <Col span="18">
            <Input v-model="applyData.applyDescribe" placeholder="请输入申请内容" :maxlength="50"/>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "dataFilesManage",
  data() {
    return {
      reportStatus: true,
      tableLoading:false,
      typeList: [
        {
          value: '1',
          label: '体质测试'
        },
        {
          value: '2',
          label: '学科评价'
        }
      ],
      typeList1: [
        {
          value: '1',
          label: '体质测试'
        },
        {
          value: '2',
          label: '学科评价'
        }
      ],
      typeList2: [
        {
          value: '2',
          label: '学科评价'
        }
      ],
      auditList: [
        {
          value: '1',
          label: '教育局'
        },
        {
          value: '2',
          label: '管理平台'
        }
      ],
      applyData:
              {
                auditType: '',
                applyType: '',
                applyDescribe: '',
                applyYearSemester:'',
              },
      applyWindow: false,
      schoolId: '',
      resultColumns: [
        {
          title: '学期',
          key: 'semesterName',
          align: 'center',
          minWidth:100
        },
        {
          title: '学生人数',
          key: 'studentNum',
          align: 'center',
          minWidth:100,
        },
        {
          title: '体测平均成绩',
          key: 'testAllScore',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const text = `${(params.row.yearSemester%2) == 1?'-':params.row.testAllScore <= 0? 0 : (params.row.testAllScore/(params.row.testFinishStudent*100)).toFixed(2)}`
            return h('div', text)
          }
        },
        {
          title: '体测优良率',
          key: 'testGoodRate',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const text = `${(params.row.yearSemester%2) == 1?'-':params.row.testGoodRate == 0? 0 : ((params.row.testGoodRate/params.row.testFinishStudent)*100).toFixed(2)+'%'}`
            return h('div', text)
          }
        },
        {
          title: '体测合格率',
          key: 'testPassRate',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const text = `${(params.row.yearSemester%2) == 1?'-':params.row.testPassRate == 0? 0 : ((params.row.testPassRate/params.row.testFinishStudent)*100).toFixed(2)+'%'}`
            return h('div', text)
          }
        },
        {
          title: '学科评价平均成绩',
          key: 'semesterAllScore',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const text = `${params.row.semesterAllScore == 0? 0 : (params.row.semesterAllScore/(params.row.semesterFinishStudent*100)).toFixed(2)}`
            return h('div', text)
          }
        },
         {
          title: '学科评价优良率',
          key: 'semesterGoodRate',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
             const text = `${params.row.semesterGoodRate == 0? 0 : ((params.row.semesterGoodRate/params.row.semesterFinishStudent)*100).toFixed(2)}%`
             return h('div', text)
           }
        },{
          title: '学科评价合格率',
          key: 'semesterPassRate',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const text = `${params.row.semesterPassRate == 0? 0 : ((params.row.semesterPassRate/params.row.semesterFinishStudent)*100).toFixed(2)}%`
            return h('div', text)
          }
        },{
          title: '状态',
          key: 'reportingStatus',
          align: 'center',
          minWidth:100,
        render: (h, params) => {
          var text="";
          if(params.row.yearSemester%2==0){
            text+="<lable style='display:inline-block;padding:5px 0;'>"+(((params.row.testReportingStatus == '1')&&(params.row.testApplyStatus == '1'))?'体测申请编辑中':(params.row.testReportingStatus == '1')? '体测已上报':'体测未上报')+"</lable>"
            text += "</br>";
            text+="<lable style='display:inline-block;padding:5px 0;'>"+(((params.row.subjectReportingStatus == '1')&&(params.row.subjectApplyStatus == '1'))?'学科评价申请编辑中':(params.row.subjectReportingStatus == '1')? '学科评价已上报' : '学科评价未上报')+"</lable>"
          }else {
            text+="<lable style='display:inline-block;padding:5px 0;'>"+(((params.row.subjectReportingStatus == '1')&&(params.row.subjectApplyStatus == '1'))?'学科评价申请编辑中':(params.row.subjectReportingStatus == '1')? '学科评价已上报' : '学科评价未上报')+"</lable>"
          }

          return h("div", {
            domProps: {
              innerHTML: text
            }
          });

    }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth:300,
          render: (h, params) => {
            return h('div', [
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          margin:'5px 10px',
                          display: ((params.row.testReportingStatus == '0') && (params.row.subjectReportingStatus == '0'))?'none':'inline-block'

                        },
                        on: {
                          click: () => {
                            this.showApplyWindow(params.row);
                          }
                        }
                      },
                      '申请编辑权限'
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          margin:'5px 10px',
                        },
                        on: {
                          click: () => {
                            this.toDataGrade(params.row);
                          }
                        }
                      },
                      '详情'
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success',
                        },
                        style: {
                          margin:'5px 10px',
                        },
                        on: {
                          click: () => {
                            this.toDataReport(params.row);
                          }
                        }
                      },
                      '数据报送'
              )
            ])
          }
        }
      ],
      resultData: [],
    };
  },
  methods: {
    queryStatus () {
      this.$axios.get('/v1/datafiles/querySchoolReportedStatus?dataType=' + this.applyData.applyType + '&yearSemester=' + this.applyData.applyYearSemester).then(res => {
        if (res.data.code == 10000) {
          if (res.data.response.reportedPatriarchStatus == '1') {
            this.applyData.auditType = '2';
            this.reportStatus = true;
          } else if (res.data.response.reportedOrganStatus == '1') {
            this.applyData.auditType = '1';
            this.reportStatus = true;
          } else {
            this.applyData.auditType = '';
            this.reportStatus = false;
          }
        } else {
          this.$Message.info(res.data.msg);
        }
      });
    },
    noticeWindow (type) {
      switch (type) {
        case '2':
          this.$Modal.info({
            title: '未上报提醒',
            content: '您还没有完成数据报送，现有数据编辑权限，无需向相关单位申请。'
          });
          break;
        case '3':
          this.$Modal.info({
            title: '重复申请提醒',
            content: '您已经申请过相同数据的编辑权限，请联系相关单位审批，无需重复申请。'
          });
          break;
      }
    },
    showApplyWindow (item) {
      this.applyWindow = true;
      this.applyData.applyYearSemester = item.yearSemester;
      if(item.yearSemester%2==0){
        this.typeList = this.typeList1
        this.applyData.applyType = ''
      }else {
        this.typeList = this.typeList2
        this.applyData.applyType = '2'
      }
    },
    closeApplyWindow () {
      this.applyWindow = false;
    },
    submitApply () {
      this.$axios.post('/v1/datafiles/saveSchoolSemesterReportedApply', this.applyData).then(res => {
        if (res.data.code == 10000) {
          if (res.data.response == '1') {
            this.applyData.applyDescribe = '';
            // this.queryReportedList(1);
            this.$Message.info('申请成功');
            // alert('申请成功');
          } else if (res.data.response == '2') {
            this.noticeWindow('2');
          } else if (res.data.response == '3') {
            this.noticeWindow('3');
          }
        } else {
          this.$Message.info(res.data.msg);
        }
      });
    },
    toDataReport(row){
      console.log(row)
      var vm=this;
      sessionStorage.setItem("dataFilesManage-educationHistoryReport-yearSemester", row.yearSemester);
      this.$router.push({ name: "educationHistoryReport" });
    },
    toDataGrade(item){
      var vm = this;
      sessionStorage.setItem("dataFilsManage-grade-yearSemester", item.yearSemester);
      sessionStorage.setItem("dataFilsManage-grade-semesterName", item.semesterName);
      sessionStorage.setItem("dataFilsManage-testApplyStatus", item.testApplyStatus);
      sessionStorage.setItem("dataFilsManage-subjectApplyStatus", item.subjectApplyStatus);
      sessionStorage.setItem("dataFilsManage-testReportingStatus", item.testReportingStatus);
      sessionStorage.setItem("dataFilsManage-subjectReportingStatus", item.subjectReportingStatus);
      this.$router.push({ name: "dataFilesGradeInfo" });
    },
    getYearSemesterInfo(){
      this.tableLoading=true;
      this.$axios.get('/v1/datafiles/getYearSemesterInfo?schoolId='+this.schoolId).then(res => {
        this.tableLoading=false;
        if (res.data.code == 10000) {
          this.resultData = res.data.response;
        }
      })
    },
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    this.schoolId=sessionStorage.getItem('schoolId');
    this.getYearSemesterInfo();
  }
};
</script>
