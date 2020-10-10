<style>
</style>
<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">补测管理</h2>
    </div>
    <div>
      <Card>
       <div style="display:flex;">
          <div style="width:62%">
            <span>年级：</span>
            <Input value="全部" disabled style="width: 120px;"/>
          </div>
          <div style="width:38%;">
            <Button v-if="supplementStatus == '2'" disabled type="success">补测进行中</Button>
            <Button v-if="supplementStatus == '3'" disabled type="success">开启补测</Button>
            <Button v-if="supplementStatus != '2' && supplementStatus != '3'" @click="startMessage = true" type="success">开启补测</Button>
          </div>
        </div>
      </Card>
      <Card style="margin-top:20px;">
        <div style="font-size:18px;height:40px;"> 数据概览</div>
        <Row>
          <div>
            <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
          </div>
        </Row>
      </Card>
      <div style="margin-top:20px">
        <Card>
          <div style="font-size:18px;height:40px;"> 数据明细</div>
          <Row>
            <div style="">
              <Table border :loading="loading" :columns="overViewColumns" :data="overViewData"></Table>
            </div>
            <br>
          </Row>
        </Card>
      </div>
    </div>
    <Modal
        title="提示"
        v-model="startMessage"
        @on-ok="smsSend"
        :styles="{top: '300px'}"
        >
        <p>补测开始后系统移动端“体质测试”模块将全部同步为“补测”数据，请确认是否需要开始？</p>
    </Modal>
    <Modal v-model="smsModalStatus" :mask-closable="false" width="420" >
      <p slot="header" style="color:#000;text-align:center">
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
        <Button type="success"  :loading="changeLoading" @click="startSupplement" :disabled="dataTf">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'schoolList',
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
      schoolYear:'',
      schoolId:'',
      loading:false,
      grade:99,
      startMessage:false,
      supplementStatus:"3",
      schoolGradeList:[
        {grade:99,label:'全部'}
      ],
      resultColumns:[
        {
          title: '总人数',
          key: 'studentTotalCount',
          align: 'center',
          minWidth:100
        },
        {
          title: '已完成体测人数/体测总人数',
          key: 'overTestCount',
          align: 'center',
          minWidth:150,
          render: (h, params) => {
            return h('div', params.row.overTestCount+'/'+params.row.needJoinTestCount)
          }
        },
        {
          title: '免试人数',
          key: 'exemptCount',
          align: 'center',
          minWidth:100,
        },
        {
          title: '平均分',
          key: 'averageScore',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            return h('div', params.row.averageScore/100)
          }
        },
        {
          title: '优秀率',
          key: 'goodCount',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.goodCount == 0? params.row.goodCount : Math.floor(params.row.goodCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '良好率',
          key: 'wellCount',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.wellCount == 0? params.row.wellCount : Math.floor(params.row.wellCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '及格率',
          key: 'passCount',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.passCount == 0? params.row.passCount : Math.floor(params.row.passCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '合格率',
          key: 'qualifiedCount',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.qualifiedCount == 0? params.row.qualifiedCount : Math.floor(params.row.qualifiedCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '不及格人数',
          key: 'notPassCount',
          align: 'center',
          minWidth:100
        }
      ],
      resultData:[],
      overViewColumns:[
        {
          title: '年级',
          key: 'grade',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            return h('div', params.row.grade == 1 ? '一年级':
            params.row.grade==2? '二年级':
            params.row.grade ==3?'三年级':
            params.row.grade ==4?'四年级':
            params.row.grade ==5?'五年级':
            params.row.grade ==6?'六年级':
            params.row.grade ==7?'七年级':
            params.row.grade ==8?'八年级':
            params.row.grade ==9?'九年级':
            params.row.grade ==10?'高一':
            params.row.grade ==11?'高二':
            params.row.grade ==12?'高三':'全校')
          }
        },
        {
          title: '班级个数',
          key: 'classCount',
          align: 'center',
          minWidth:90
        },
        {
          title: '总人数',
          key: 'studentTotalCount',
          align: 'center',
          minWidth:90,
        },
        {
          title: '已完成体测人数/体测总人数',
          key: 'overTestCount',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            return h('div', params.row.overTestCount+'/'+params.row.needJoinTestCount)
          }
        },
        {
          title: '免试人数',
          key: 'exemptCount',
          align: 'center',
          minWidth:90,
        },
        {
          title: '平均分',
          key: 'averageScore',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            return h('div', params.row.averageScore/100)
          }
        },
        {
          title: '优秀率',
          key: 'goodCount',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.goodCount == 0? params.row.goodCount : Math.floor(params.row.goodCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '良好率',
          key: 'wellCount',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.wellCount == 0? params.row.wellCount : Math.floor(params.row.wellCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '及格率',
          key: 'passCount',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.passCount == 0? params.row.passCount : Math.floor(params.row.passCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '合格率',
          key: 'qualifiedCount',
          align: 'center',
          minWidth:90,
          render: (h, params) => {
            const row = params.row
            const text = `${params.row.qualifiedCount == 0? params.row.qualifiedCount : Math.floor(params.row.qualifiedCount/params.row.overTestCount*100)}%`
            return h('div', text)
          }
        },
        {
          title: '不及格人数',
          key: 'notPassCount',
          align: 'center',
          minWidth:90,
        }
      ],
      overViewData:[],
      pageNum: 1,
      pageSize: 10,
      total: 0
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
            }else{
              this.isGeting = true;
              this.disable = true;
              this.getCode = this.count-- + 's后重发';
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
      vm.smsModalStatus=true;
    },
    sendSmsCode(){
      var vm = this;
      vm.sendStatus=true;
      this.$axios
        .get("/v1/common/sendSmsForUpdateSensitiveData?name=testSupplement")
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
    pageToList() {
      this.$router.go(-1)
    },
    toDetail(item) {
      var vm = this;
      sessionStorage.setItem("gradeTestData_grade",item.grade);
      this.$router.push({ name: "queryClassList" });
    },
    querySearch(){
      this.pageNum = 1;
      this.pageNo = 1
      // this.search();
    },
    search() {
      var vm = this
      let schoolId = vm.schoolId
    },

    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value
        // this.search()
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value
        this.pageNum = 1;
        // this.search()
      }
    },
    search(){
      this.$axios
        .get(
          `/v1/testdata/queryThisYearActivityGradeList?grade=${this.grade==99?'':this.grade}&schoolId=${this.schoolId}&type=2`
        )
        .then(res => {
          if (res.data.code == 10000) {
            this.resultData = res.data.response;
            if(this.resultData && this.resultData.length > 0){
               this.supplementStatus=this.resultData[0].supplementStatus;
            }
            this.$axios.get(`/v1/testdata/queryThisYearActivityGradeList?grade=${this.grade==99?'':this.grade}&schoolId=${this.schoolId}&type=1`)
              .then(res => {
                if (res.data.code == 10000) {
                  this.overViewData = res.data.response;
                }
              })
          }
        })
    },
    startSupplement(){
      this.$axios.get('/v1/testdata/startSupplement?smsCode='+this.smsCode)
        .then(res => {
           this.errorMsg=""
          if (res.data.code == 10000) {
            this.$Message.info('操作成功！');
            this.smsModalStatus=false;
          }else {
            this.$Message.success(res.data.msg);
            this.errorMsg=res.data.msg
          }
          this.search();
        })
    },
  },
  watch: {

  },
  created() {
  },
  mounted() {
    let vm = this;
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    let SchoolYear = sessionStorage.getItem("historyData_SchoolYear",);
    this.schoolYear = SchoolYear
    this.search()
  }
}
</script>
