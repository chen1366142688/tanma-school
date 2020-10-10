 


<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测成绩上报</h2>
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
        <Modal
            v-model="showModel"
            :title="showActivityName"
            @on-ok="saveShowType"
            @on-cancel="canncelShowType">
            <div style="padding-bottom:5px;color:red;">体测数据上报状态：</div>
            <Select v-model="submitType">
                <Option v-for="item in submitList" :value="item.itemId" :key="item.itemId">{{ item.itemName }}</Option>
            </Select>
            <div style="padding-top:20px;padding-bottom:5px;color:red;">体测结果查看类型：</div>
            <Select v-model="selectShowType">
                <Option v-for="item in showTypeList" :value="item.itemId" :key="item.itemId">{{ item.itemName }}</Option>
            </Select>
        </Modal>
        <Modal v-model="showModel1" :mask-closable="false" :closable="false" width="360" >
       
        <div style="">
          <p slot="header" style="text-align:center;font-size:20px;">
          请确定是否已完成体测上报工作
        </p>
        <div style="text-align:center;margin-top:20px;">
          <Button type="success"   @click="highSchoolReportEducation">是</Button>
          <Button type="success" style="margin-left:20px;"   @click="canncelShowType" >否</Button>
        </div>
        </div>
        <div slot="footer">
               <p slot="header" style="text-align:center">
                注意：点击“是”系统将锁定本年度所有体测数据，无法再对数据进行任何修改。
              </p>
          </div>
      </Modal>
      <Modal v-model="smsModalStatus" :mask-closable="false" width="420" >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>短信验证</span>
      </p>
      <div style="">
          <p style="margin-left:40px;margin-top:10px;"><span >短信验证码：</span>
          <Input v-model="smsCode" size="small" placeholder="请输入短信验证码" style="width: 180px;"/>
          <!-- <Button type="success" size="small"   style="margin-left:10px;" :disabled="sendStatus"  @click="sendSmsCode" >发送</Button> -->
          <Button type="success" size="small"  :disabled="disable" :class="{ codeGeting:isGeting }" @click="getVerifyCode">{{getCode}}</Button>
          </p>
          <span style="margin-left:40px;color:red">{{errorMsg}}</span>
      </div>
      <div slot="footer">
        <Button type="success"  @click="cancle" >取消</Button>
        <Button type="success"  :loading="changeLoading" @click="saveShowType" :disabled="dataTf">保存</Button>
      </div>
    </Modal>
    </div>
</template>

<script>
export default {
  name: 'teacherList',
  data() {
    return {
      getCode:'获取验证码',
          isGeting:false,
          count:300,
          disable:false,
      smsModalStatus:false,
      dataTf:true,
      changeLoading:false,
      smsCode:'',
      sendStatus:false,
      errorMsg:'',
      activityId:'',
      schoolId:"",
      showModel:false,
      showModel1:false,
      showActivityName:"",
      selectShowType:"",
      submitType:"",
      showTypeList:[
          {itemId:"1",itemName:'测完后可立即查看测试结果'},
          {itemId:"2",itemName:'上报后查看测试结果'},
          {itemId:"3",itemName:'上报后才能查看上报测试结果'},
          {itemId:"4",itemName:'不允许查看'},
      ],
      submitList:[
          {itemId:"0",itemName:'未上报'},
          {itemId:"1",itemName:'已上报'},
      ],
      resultColumns: [
        {
          title: '体测年度',
          key: 'activityExplain',
          align: 'center',
          minWidth:100
        },
         {
          title: '上报学生总数',
          key: 'studentNum',
          align: 'center',
          minWidth:100,
        },
         {
          title: '合格率',
          key: 'activityExplain',
          align: 'center',
          minWidth:100,
           render: (h, params) => {
            return h('div', [h('span', params.row.passStudent?(100*params.row.passStudent/params.row.studentNum).toFixed(2)+"%":"--")])
          }
        },
        {
          title: '上报状态',
          key: 'submitStatus',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', [h('span', params.row.reportStatus=='1'?"已上报":"未上报")])
          }
        },
         {
          title: '上报日期',
          key: 'createTime',
          align: 'center',
          minWidth:100,
        },
         {
          title: '上报人',
          key: 'reportName',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            if(params.row.submitStatus=='1'){
                return h('div', [h('span', params.row.reportName?params.row.reportName:"系统管理员")])
            }else{
                return h('div', [h('span','')])
            }
          }
        },
        //  {
        //   title: '学生查看体测结果类型',
        //   key: 'showType',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('div', [h('span', params.row.showType=='1'?"测完后可立即查看测试结果":params.row.showType=='2'?"上报后查看测试结果":params.row.showType=='3'?"上报后才能查看上报测试结果":"不允许查看")])
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
              return h('div', [
                // h(
                //   'Button',
                //   {
                //     props: {
                //       type: 'success'
                //     },
                //     style: {
                //       marginRight:'10px',
                //       padding:'5px'
                //     }, 
                //     on: {
                //       click: () => {
                //           this.toDetailInfo(params.row.activityId,params.row.activityName,params.row.submitStatus);
                //       }
                //     }
                //   },
                //   '查看详情'
                // ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'success',
                      disabled: params.row.editorStatus == "0" ?true:false
                    },
                    style: {
                      padding:'5px'
                    },
                    on: {
                      click: () => {
                         this.changeShowType(params.row.activityId,params.row.activityName,params.row.showType,params.row.submitStatus);
                      }
                    }
                  },
                  '是否上报'
                )
              ])
          }
        }
      ],
      resultData: [],
    }
  },
  methods: {
    getVerifyCode(){
          var countDown = setInterval(()=>{
            if(this.count < 1){
              this.isGeting = false;
              this.disable = false;
              this.getCode = '获取验证码';
              this.count = 300;
              clearInterval(countDown);
              // console.log(this.count)
            }else{
              this.isGeting = true;
              this.disable = true;
              this.getCode = this.count-- + 's后重发';
              console.log(this.count)
            }
          },1000);
          this.$once('hook:beforeDestroy', () => {
        clearInterval(countDown);
      })
          this.sendSmsCode();
        },
    cancle(){
      var vm=this;
      vm.smsModalStatus=false;
    },
    smsSend(){
      var vm=this;
      vm.showModel1=false;
      vm.smsModalStatus=true;
    },
    sendSmsCode(){
      var vm = this;
      vm.sendStatus=true;
      this.$axios
        .get("/v1/common/sendSmsForUpdateSensitiveData?name=testReport")
        .then(function(response) {
          // console.log(response)
          if (response.data.code == 10000) {
            vm.$Message.info("发送成功，请注意接收");
            vm.dataTf=false;
            vm.errorMsg="发送成功，请注意接收"
          } else {
            vm.$Message.info(response.data.msg);
             vm.dataTf=true;
            vm.errorMsg=response.data.msg
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    queryActivityTest(){
        this.$axios.get('/v1/testdata/getTestActivitylist?schoolId='+this.schoolId).then(res => {
            if (res.data.code == 10000) {
                this.resultData = res.data.response;
            }
        })
    },
    changeShowType(activityId,showActivityName,showType,submitType){
        this.showActivityName=showActivityName+' - 学生体测设置';
        this.activityId=activityId;
        this.showModel1=true;
        this.selectShowType = showType;
        this.submitType = submitType;
    },
    canncelShowType(){
      this.showModel1=false
    },
    saveShowType(){
        this.$axios.get('/v1/testdata/save/test/activity?activityId='+this.activityId+'&schoolId='+this.schoolId+'&showType='+'&submitStatus=1&smsCode='+this.smsCode).then(res => {
          this.showModel1=false;
          this.errorMsg=""
            if (res.data.code == 10000) {
              this.smsModalStatus=false;
                this.$Message.info('保存成功！');
            }else{
                 this.$Message.success(res.data.msg);
                 this.errorMsg=res.data.msg
            }
            this.queryActivityTest();
        })
    },
    highSchoolReportEducation(){
        this.$axios.get('/v1/testdata/highSchoolReportEducation?activityId='+this.activityId+'&schoolId='+this.schoolId).then(res => {
          this.showModel1=false;
          this.errorMsg=""
            if (res.data.code == 10000) {
              this.smsModalStatus=false;
                this.$Message.info('上报成功！');
            }else{
                 this.$Message.success(res.data.msg);
                 this.errorMsg=res.data.msg
            }
            this.queryActivityTest();
        })
    },
    toDetailInfo(activityId,activityName,submitStatus){
        sessionStorage.setItem('schoolTest-schoolTestDetail-activityId',activityId)
        sessionStorage.setItem('schoolTest-schoolTestDetail-activityName',activityName)
        sessionStorage.setItem('schoolTest-schoolTestDetail-submitStatus',submitStatus)
        this.$router.push({ name: 'schoolTestDetail' })
    },
  },
  created() {
  },
  mounted() {
     this.schoolId=sessionStorage.getItem('schoolId');
     this.queryActivityTest();
  }
}
</script>