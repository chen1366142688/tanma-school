 


<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体质健康数据报送</h2>
    </div>
        <Card>
          <div >
              <div>
                  <Row>
                      <div>
                          <Table max-height="800" border :columns="resultColumns" :data="resultData"></Table>
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
        loading:false,
      resultColumns: [
        {
          title: '体测年度',
          key: 'schoolYear',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span', params.row.schoolYear+"年")])
          }
        },
         {
          title: '报送学生总数',
          key: 'reportStudentNum',
          align: 'center',
          minWidth:100,
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
                text = "0";
            }else {
                let all=row.excellentStudent+row.goodStudent+row.passStudent;
                let pass=(all*100/row.finishStudent).toFixed(2);
                text = pass;
            }
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
                text = "0";
            }else {
                let all=row.excellentStudent+row.goodStudent;
                let pass=(all*100/row.finishStudent).toFixed(2);
                text = pass;
            }
            return h('div', text)
          }
        },
        {
          title: '报送状态',
          key: 'reportStatus',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span', params.row.reportStatus=='1'?"已上报":"未上报")])
          }
        },
         {
          title: '报送日期',
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
                      type: 'success',
                      disabled:params.row.commonYear=="1"?false:true
                    },
                    style: {
                      marginRight:'10px',
                      padding:'5px'
                    }, 
                    on: {
                      click: () => {
                          this.toDetailInfo(params.row);
                      }
                    }
                  },
                  '数据报送'
                ),
              ])
          }
        }
      ],
      resultData: [],
    }
  },
  methods: {
    getCountryReportHisList(){
      var vm = this;
      vm.loading=true;
      this.$axios
        .get("/v1/dataReport/getCountryReportHisList")
        .then(function(response) {
          vm.loading=false;
          if (response.data.code == 10000) {
            vm.resultData=response.data.response;
          } else {
            vm.$Message.info(response.data.msg);
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    
    toDetailInfo(testActivity){
        sessionStorage.setItem('nationReport-nationReportDetail-activityId',testActivity.activityId)
        sessionStorage.setItem('nationReport-nationReportDetail-activityName',testActivity.activityName)
        sessionStorage.setItem('nationReport-nationReportDetail-reportStatus',testActivity.reportStatus)
        this.$router.push({ name: 'nationReportDetail' })
    },
  },
  created() {
  },
  mounted() {
     this.schoolId=sessionStorage.getItem('schoolId');
     this.getCountryReportHisList();
  }
}
</script>