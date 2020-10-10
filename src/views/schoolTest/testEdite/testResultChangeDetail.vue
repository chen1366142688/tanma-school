<style>
</style>

<template>
    <div>
        <div>
            <h1>{{activityName}}--{{testItemName}}</h1>
        </div>
        <div style="margin-top:15px;">
            <Form :label-width="100" class="function" style="display: -webkit-box">
                <Card v-if="testItemId==1" style="width: 50%;">
                    <FormItem label="">
                        <p>
                            <h2 style="">未修改</h2>
                        </p>
                        <p>
                            <span>总人数：{{totalNum}}</span>
                            <span style="margin-left:20px;">未测试人数：{{notTestNum}}</span>
                            <span style="margin-left:20px;"> 免试人数：{{exemptNum}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="2米以上：">
                        <span>{{over100}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(100)">增加</Button>
                        <Button type="success" size="small" @click="reduce(100)">减少</Button>
                    </FormItem>
                    <FormItem label="1.8-2.0米：">
                        <span>{{nintyTo100}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(90)">增加</Button>
                        <Button type="success" size="small" @click="reduce(90)">减少</Button>
                    </FormItem>
                    <FormItem label="1.6-1.8米：">
                        <span>{{eightyTo90}}</span>
                       <Button type="success" style="margin-left:140px;" size="small" @click="add(80)">增加</Button>
                        <Button type="success" size="small" @click="reduce(80)">减少</Button>
                    </FormItem>
                    <FormItem label="1.4-1.6米：">
                        <span>{{seventyTo80}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(70)">增加</Button>
                        <Button type="success" size="small" @click="reduce(70)">减少</Button>
                    </FormItem>
                    <FormItem label="1.0-1.4米：">
                        <span>{{sixtyTo70}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(60)">增加</Button>
                        <Button type="success" size="small" @click="reduce(60)">减少</Button>
                    </FormItem>
                    <FormItem label="1米以下：">
                        <span>{{below60}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(0)">增加</Button>
                        <Button type="success" size="small" @click="reduce(0)">减少</Button>
                    </FormItem>
                </Card>
                <Card v-if="testItemId==1" style="width: 50%;">
                    <FormItem label="">
                        <p>
                            <h2 style="">修改后</h2>
                        </p>
                        <p>
                            <span>总人数：{{totalNumb}}</span>
                            <span style="margin-left:20px;">未测试人数：{{notTestNumb}}</span>
                            <span style="margin-left:20px;"> 免试人数：{{exemptNumb}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="2米以上：">
                        <span>{{over100b}}</span>
                    </FormItem>
                    <FormItem label="1.8-2.0米：">
                        <span>{{nintyTo100b}}</span>
                    </FormItem>
                    <FormItem label="1.6-1.8米：">
                        <span>{{eightyTo90b}}</span>
                    </FormItem>
                    <FormItem label="1.4-1.6米：">
                        <span>{{seventyTo80b}}</span>
                    </FormItem>
                    <FormItem label="1.0-1.4米：">
                        <span>{{sixtyTo70b}}</span>
                    </FormItem>
                    <FormItem label="1米以下：">
                        <span>{{below60b}}</span>
                    </FormItem>
                </Card>
                <Card v-if="testItemId==12" style="width: 50%;">
                    <FormItem label="">
                        <p>
                            <h2 style="">未修改</h2>
                        </p>
                        <p>
                            <span>总人数：{{totalNum}}</span>
                            <span style="margin-left:20px;">未测试人数：{{notTestNum}}</span>
                            <span style="margin-left:20px;"> 免试人数：{{exemptNum}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="70KG以上：">
                        <span>{{over100}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(100)">增加</Button>
                        <Button type="success" size="small" @click="reduce(100)">减少</Button>
                    </FormItem>
                    <FormItem label="60-70KG：">
                        <span>{{nintyTo100}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(90)">增加</Button>
                        <Button type="success" size="small" @click="reduce(90)">减少</Button>
                    </FormItem>
                    <FormItem label="50-60KG：">
                        <span>{{eightyTo90}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(80)">增加</Button>
                        <Button type="success" size="small" @click="reduce(80)">减少</Button>
                    </FormItem>
                    <FormItem label="40-50KG：">
                        <span>{{seventyTo80}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(70)">增加</Button>
                        <Button type="success" size="small" @click="reduce(70)">减少</Button>
                    </FormItem>
                    <FormItem label="30-40KG：">
                        <span>{{sixtyTo70}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(60)">增加</Button>
                        <Button type="success" size="small" @click="reduce(60)">减少</Button>
                    </FormItem>
                    <FormItem label="30KG以下：">
                        <span>{{below60}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(0)">增加</Button>
                        <Button type="success" size="small" @click="reduce(0)">减少</Button>
                    </FormItem>
                </Card>
                <Card v-if="testItemId==12" style="width: 50%;">
                    <FormItem label="">
                        <p>
                            <h2 style="">修改后</h2>
                        </p>
                        <p>
                            <span>总人数：{{totalNumb}}</span>
                            <span style="margin-left:20px;">未测试人数：{{notTestNumb}}</span>
                            <span style="margin-left:20px;"> 免试人数：{{exemptNumb}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="70KG以上：">
                        <span>{{over100b}}</span>
                    </FormItem>
                    <FormItem label="60-70KG：">
                        <span>{{nintyTo100b}}</span>
                    </FormItem>
                    <FormItem label="50-60KG：">
                        <span>{{eightyTo90b}}</span>
                    </FormItem>
                    <FormItem label="40-50KG：">
                        <span>{{seventyTo80b}}</span>
                    </FormItem>
                    <FormItem label="30-40KG：">
                        <span>{{sixtyTo70b}}</span>
                    </FormItem>
                    <FormItem label="30KG以下：">
                        <span>{{below60b}}</span>
                    </FormItem>
                </Card>
                <Card v-if="testItemId!=12 && testItemId!=1" style="width: 50%;">
                    <FormItem label="">
                        <p>
                            <h2 style="">未修改</h2>
                        </p>
                        <p>
                            <span>总人数：{{totalNum}}</span>
                            <span style="margin-left:20px;">未测试人数：{{notTestNum}}</span>
                            <span style="margin-left:20px;"> 免试人数：{{exemptNum}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="100分以上：">
                        <span>{{over100}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(100)">增加</Button>
                        <Button type="success" size="small" @click="reduce(100)">减少</Button>
                    </FormItem>
                    <FormItem label="90-100分：">
                        <span>{{nintyTo100}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(90)">增加</Button>
                        <Button type="success" size="small" @click="reduce(90)">减少</Button>
                    </FormItem>
                    <FormItem label="80-90分：">
                        <span>{{eightyTo90}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(80)">增加</Button>
                        <Button type="success" size="small" @click="reduce(80)">减少</Button>
                    </FormItem>
                    <FormItem label="70-80分：">
                        <span>{{seventyTo80}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(70)">增加</Button>
                        <Button type="success" size="small" @click="reduce(70)">减少</Button>
                    </FormItem>
                    <FormItem label="60-70分：">
                        <span>{{sixtyTo70}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(60)">增加</Button>
                        <Button type="success" size="small" @click="reduce(60)">减少</Button>
                    </FormItem>
                    <FormItem label="60分以下：">
                        <span>{{below60}}</span>
                        <Button type="success" style="margin-left:140px;" size="small" @click="add(0)">增加</Button>
                        <Button type="success" size="small" @click="reduce(0)">减少</Button>
                    </FormItem>
                </Card>
                <Card v-if="testItemId!=12 && testItemId!=1" style="width: 50%;">
                    <FormItem label="">
                        <p>
                            <h2 style="">修改后</h2>
                        </p>
                        <p>
                            <span>总人数：{{totalNumb}}</span>
                            <span style="margin-left:20px;">未测试人数：{{notTestNumb}}</span>
                            <span style="margin-left:20px;"> 免试人数：{{exemptNumb}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="100分以上：">
                        <span>{{over100b}}</span>
                    </FormItem>
                    <FormItem label="90-100分：">
                        <span>{{nintyTo100b}}</span>
                    </FormItem>
                    <FormItem label="80-90分：">
                        <span>{{eightyTo90b}}</span>
                    </FormItem>
                    <FormItem label="70-80分：">
                        <span>{{seventyTo80b}}</span>
                    </FormItem>
                    <FormItem label="60-70分：">
                        <span>{{sixtyTo70b}}</span>
                    </FormItem>
                    <FormItem label="60分以下：">
                        <span>{{below60b}}</span>
                    </FormItem>
                </Card>
            </Form>
            <div style="margin-top:20px;padding-left:40%;padding-bottom:50px;">
                <Button @click="pageToClassList" style="float:left; margin-right:50px;width:100px" type="success">返回</Button>
            </div>
        </div>
        <Modal
        v-model="modal1"
        title="创建任务"
        :mask-closable="false"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form>
        <FormItem label="任务名称：">
                        <Input v-model="taskName" size="small"  style="width:180px;" placeholder="请输入任务名称"></Input></p>
                    </FormItem>
                     <FormItem label="调整数量：">
                       <Input v-model="adjustNum" size="small" style="width:180px;" placeholder="输入需调整的数量"></Input>
                    </FormItem>
        </Form>
    </Modal>
    </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'teacherDetail',
  data() {
    return {
        modal1:false,
      schoolId: '',
      activityId: '',
      activityName: '',
      testItemId: '',
      testItemName: '',
      below60: 0,
      eightyTo90: 0,
      nintyTo100: 0,
      over100: 0,
      seventyTo80: 0,
      sixtyTo70: 0,
      below60b: 0,
      eightyTo90b: 0,
      nintyTo100b: 0,
      over100b: 0,
      seventyTo80b: 0,
      sixtyTo70b: 0,
      totalNum: 0,
      notTestNum: 0,
      exemptNum: 0,
       totalNumb: 0,
      notTestNumb: 0,
      exemptNumb: 0,
      taskName:'',
      adjustNum:'',
      adjustType:'',
      startEnd:'',
    }
  },
  methods: {
    getStudentScoreInfo(activityId, testItemId) {
      var vm = this
      this.$axios
        .get(
          '/v1/organtestresultEdit/getStudentScoreInfo?activityId=' +
            activityId +
            '&testItemId=' +
            testItemId
        )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response
            vm.over100 = data.over100
            vm.nintyTo100 = data.nintyTo100
            vm.eightyTo90 = data.eightyTo90
            vm.seventyTo80 = data.seventyTo80
            vm.sixtyTo70 = data.sixtyTo70
            vm.below60 = data.below60
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getStudentEditScoreInfo(activityId, testItemId) {
      var vm = this
      this.$axios
        .get(
          '/v1/organtestresultEdit/getStudentEditScoreInfo?activityId=' +
            activityId +
            '&testItemId=' +
            testItemId
        )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response
            vm.over100b = data.over100
            vm.nintyTo100b = data.nintyTo100
            vm.eightyTo90b = data.eightyTo90
            vm.seventyTo80b = data.seventyTo80
            vm.sixtyTo70b = data.sixtyTo70
            vm.below60b = data.below60
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getActivityAndTestItemInfo(activityId, testItemId) {
      var vm = this
      this.$axios
        .get(
          '/v1/organtestresultEdit/getActivityAndTestItemInfo?activityId=' +
            activityId +
            '&testItemId=' +
            testItemId
        )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response
            vm.activityName = data.activityName
            vm.testItemName = data.testItemName
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getStudentNumInfo(activityId, testItemId) {
      var vm = this
      this.$axios
        .get(
          '/v1/organtestresultEdit/getStudentNumInfo?activityId=' +
            activityId +
            '&testItemId=' +
            testItemId
        )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response
            vm.totalNum = data.totalStudent ? data.totalStudent : 0
            vm.notTestNum = data.notTestStudent ? data.notTestStudent : 0
            vm.exemptNum = data.exemptStudent ? data.exemptStudent : 0
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getStudentNumInfoChange(activityId, testItemId) {
      var vm = this
      this.$axios
        .get(
          '/v1/organtestresultEdit/getStudentNumInfoChange?activityId=' +
            activityId +
            '&testItemId=' +
            testItemId
        )
        .then(res => {
          if (res.data.code == 10000) {
            let data = res.data.response
            vm.totalNumb = data.totalStudent ? data.totalStudent : 0
            vm.notTestNumb = data.notTestStudent ? data.notTestStudent : 0
            vm.exemptNumb = data.exemptStudent ? data.exemptStudent : 0
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    pageToClassList() {
      //返回
      this.$router.go(-1)
    },
    add(type){
        var vm=this;
        vm.modal1=true;
        vm.adjustType="1";
        vm.startEnd=type;
    },
    reduce(type){
 var vm=this;
        vm.modal1=true;
        vm.adjustType="2";
        vm.startEnd=type;
    },
    ok(){
      var vm=this;
      if(!vm.taskName){
vm.$Message.info("请填写任务名称")
return;
      }
      if(!vm.startEnd){
vm.$Message.info("前输入调整的数量")
return;
      }
      this.$axios
        .get(
          '/v1/organtestresultEdit/addTask?activityId='+vm.activityId+'&taskName='+vm.taskName+'&taskType='+vm.testItemId+'&adjustType='+vm.adjustType+
          '&adjustNum='+vm.adjustNum+'&startEnd='+vm.startEnd
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.$Message.info("提交成功")
            vm.adjustType="";
        vm.startEnd='';
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    cancel(){

    },
  },
  mounted() {
    var vm = this
    vm.schoolId = sessionStorage.getItem('schoolId')
    vm.activityId = sessionStorage.getItem(
      'testResultTask-testResultChangeDetail-activityId'
    )
    vm.testItemId = sessionStorage.getItem(
      'testResultTask-testResultChangeDetail-taskType'
    )
    // this.querySchoolAllInfo()
    vm.getStudentScoreInfo(
      sessionStorage.getItem(
        'testResultTask-testResultChangeDetail-activityId'
      ),
      sessionStorage.getItem('testResultTask-testResultChangeDetail-taskType')
    )
    vm.getStudentEditScoreInfo(
      sessionStorage.getItem(
        'testResultTask-testResultChangeDetail-activityId'
      ),
      sessionStorage.getItem('testResultTask-testResultChangeDetail-taskType')
    )
    vm.getActivityAndTestItemInfo(
      sessionStorage.getItem(
        'testResultTask-testResultChangeDetail-activityId'
      ),
      sessionStorage.getItem('testResultTask-testResultChangeDetail-taskType')
    )
    vm.getStudentNumInfo(
      sessionStorage.getItem(
        'testResultTask-testResultChangeDetail-activityId'
      ),
      sessionStorage.getItem('testResultTask-testResultChangeDetail-taskType')
    )
    vm.getStudentNumInfoChange( sessionStorage.getItem(
        'testResultTask-testResultChangeDetail-activityId'
      ),
      sessionStorage.getItem('testResultTask-testResultChangeDetail-taskType'))
  },
  watch: {}
}
</script>