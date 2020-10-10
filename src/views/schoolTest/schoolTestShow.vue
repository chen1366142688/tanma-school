<style>
    
</style>

<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">{{activityName}}</h2>
    </div>
    <div>
        <Form :label-width="100" class="function">
            <Card :dis-hover="true">
                <FormItem label="体测情况：">
                    <Row>
                        <Col span="4">
                            学生总：{{testInfo.allCount}}人
                        </Col>
                        <Col span="4">
                            免试免试：{{testInfo.exemptCount}}人
                        </Col>
                        <Col span="4">
                            需要测试：{{testInfo.allCount-testInfo.exemptCount}}人
                        </Col>
                        <Col span="8" style="color:red">
                            合格率：{{passRate}}%&nbsp;(合格人数/需要测试人数)
                        </Col>
                    </Row>
                 </FormItem>
                <FormItem label="参与情况：">
                    <Row>
                        <Col span="4">
                            未参加：{{testInfo.allCount-testInfo.exemptCount-passOver.beginCount}}人
                        </Col>
                        <Col span="4">
                            已参加测试：{{passOver.beginCount}}人
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="完成情况：">
                    <Row>
                        <Col span="4">
                            完成：{{passOver.overCount}}人
                        </Col>
                        <Col span="4">
                            完成并及格：{{passOver.overPass}}人
                        </Col>
                        <Col span="4">
                            完成不及格：{{passOver.overNotPass}}人
                        </Col>
                        <Col span="4">
                            已参与未完成不及格：{{passOver.notOverNotPass}}人
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="及格情况：">
                    <Row>
                        <Col span="4">
                            及格：{{passOver.passCount}}人
                        </Col>
                        <Col span="4">
                            及格并完成：{{passOver.overPass}}人
                        </Col>
                        <Col span="4">
                            及格未完成：{{passOver.notOverPass}}人
                        </Col>
                        <Col span="4">
                            已参与不及格未完成：{{passOver.notOverNotPass}}人
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="等级情况：">
                    <Row>
                        <Col span="4">
                            优秀数：{{testInfo.excellentCount}}人
                        </Col>
                        <Col span="4">
                            良好数：{{testInfo.wellCount}}人
                        </Col>
                        <Col span="4">
                            及格数：{{testInfo.passCount}}人
                        </Col>
                        <Col span="3">
                            不及格数：{{testInfo.allCount-testInfo.exemptCount-passOver.overCount}}人
                        </Col>
                    </Row>
                </FormItem>
              <!--  <FormItem label="">
                    <Button @click="toTaskList" style="width:100px;float:right" type="success">测试成绩调整</Button>
                </FormItem> -->
            </Card>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Form>   
        <Card style="margin-top:20px;" :dis-hover="true">
        <div style="font-size:20px;height:40px;">
            老师体测人数统计列表
        </div>
        <div :style="{backgroundColor:'#FFFFFF'}">
          <Row>
              <div>
                  <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
              </div>
              <br>
              <div style="float: right;">
                  <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
              </div>
          </Row>
        </div>
    </Card>   
        <div style="margin-top:20px;padding-left:40%;padding-bottom:50px;">
            <Button @click="pageToClassList" style="float:left; margin-right:50px;width:100px" type="success">返回</Button>
        </div>          
</div>
</div>
</template>

<script>
import md5 from 'js-md5';
export default {
    name: 'teacherDetail'
    ,data(){
        return {
            spinShow:true,
            schoolId: '',
            activityId: '',
            activityName: '',
            activityList: [],
            testInfo:{},
            passOver:[],
            passRate:0,
            resultColumns: [
              {
                title: '老师姓名',
                key: 'teacherName',
                align: 'center'
              },
              {
                title: '体测项目',
                key: 'schoolTestName',
                align: 'center',
              },
              {
                title: '体测学生人数',
                key: 'studentCount',
                align: 'center',
              }
            ],
            loading:false,
             resultData:[],
            pageNum: 1,
            pageSize: 10,
            total: 0
        }
    }
    ,methods:{
        querySchoolAllInfo(){
            var vm = this
            this.$axios.get('/v1/testdata/query/school/all/show?schoolId=' + this.schoolId+'&activityId=' + this.activityId)
                .then(res => {
                    vm.spinShow=false;
                if (res.data.code == 10000) {
                    this.testInfo = res.data.response.testInfo;
                    this.passOver = res.data.response.passOver;
                    if(res.data.response.passOver !=null && res.data.response.testInfo != null){
                        this.passRate = (this.passOver.passCount/(this.testInfo.allCount-this.testInfo.exemptCount)*100).toFixed(2);
                    }
                } else {
                    if (res.data.code > 39999) {
                        vm.$Message.info(res.data.msg)
                    }
                }
            })
        },
        pageToClassList(){ //返回
          this.$router.go(-1);  
        },     
        toTaskList(){
            sessionStorage.setItem('schoolTestShow-taskList-activityId',this.activityId);
             this.$router.push({ name: 'testResultTask' })
        }   ,
        queryTeacherTestStudentCount(){
          let activityId = sessionStorage.getItem('schoolTest-schoolTestShowConfig-show-activityId');
          let vm = this;
          this.$axios.get('/v1/testdata/queryTeacherTestStudentCount?activityId='+activityId+'&pageNum='+vm.pageNum+'&pageSize='+vm.pageSize).then(res => {
              if (res.data.code == 10000) {
                vm.total = res.data.response;
              }
          })
        },  
        queryTeacherTestStudentList(){
          var vm = this
          vm.loading = true
          let activityId = sessionStorage.getItem('schoolTest-schoolTestShowConfig-show-activityId');
          this.$axios.get('/v1/testdata/queryTeacherTestStudentList?activityId='+activityId+'&pageNum='+vm.pageNum+'&pageSize='+vm.pageSize).then(res => {
              vm.loading = false
              if (res.data.code == 10000) {
                  vm.resultData = res.data.response
              } else {
                if (res.data.code > 39999) {
                  vm.$Message.info(res.data.msg)
                }
              }
          })
        },
        pageNumChange(value) {
          let _this = this;
          if (this.pageNum != value) {
            _this.pageNum = value
            _this.queryTeacherTestStudentList()
          }
        },
        pageSizechange(value) {
          let _this = this;
          if (this.pageSize != value) {
            _this.pageSize = value
            _this.queryTeacherTestStudentList()
          }
        },         
    }
    ,mounted(){
        this.schoolId=sessionStorage.getItem('schoolId');
        this.activityId = sessionStorage.getItem('schoolTest-schoolTestShowConfig-show-activityId');
        this.activityName = sessionStorage.getItem('schoolTest-schoolTestShowConfig-show-activityName');
        this.querySchoolAllInfo();
        this.queryTeacherTestStudentList(sessionStorage.getItem('schoolTest-schoolTestShowConfig-show-activityId'))
        this.queryTeacherTestStudentCount(sessionStorage.getItem('schoolTest-schoolTestShowConfig-show-activityId'))
    }
    ,watch: {

    }   
};
</script>