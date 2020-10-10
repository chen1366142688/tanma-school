<style>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
<template>
  <div>
    <div>
      <h1>测试成绩调整任务列表</h1>
    </div>
    <div style="margin-top:15px;">
      <Card style="height: 60px;">
          <div class="top-search">
                <div class="left-input">
                    <div style="margin:5px 20px;">
                        <span style="">任务名称：</span>
                        <Input v-model="taskName" size="small" placeholder="任务名称" style="width: 160px;" />
                    </div>
                    <div style="margin:5px 20px;">
                        <span>调整项目：</span>
                        <Select v-model="taskType" size="small" style="width:120px;">
                            <Option v-for="item in taskTypeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>任务状态：</span>
                        <Select v-model="taskStatus" size="small" style="width:120px;">
                            <Option v-for="item in taskStatusList" :value="item.status" :key="item.status">{{ item.name }}</Option>
                        </Select>
                    </div>
                    <div style="margin:5px 20px;">
                        <span>数据状态：</span>
                        <Select v-model="infoStatus" size="small" style="width:120px;">
                            <Option v-for="item in infoStatusList" :value="item.status" :key="item.status">{{ item.name }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="right-btns">
                    <Button type="success" @click="addTask">添加任务</Button>
                    <Button type="success" @click="restore">重置查询条件</Button>
                    <Button type="success" @click="querySearch">查询</Button>
                    <Button type="success" @click="pageToClassList">返回</Button>
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
    <Modal
        v-model="modal1"
        title="选择调整项目"
        :mask-closable="false"
        @on-ok="ok"
        @on-cancel="cancel">
        <span style="margin-left:40px;">调整项目：</span>
        <Select v-model="taskType2" size="small" style="width:140px;">
          <Option v-for="item in taskTypeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
        </Select>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
      loading: false,
      taskType: '',
      taskTypeList: [
        {
          type: '1',
          name: '身高'
        },
        {
          type: '2',
          name: '肺活量'
        },
        {
          type: '3',
          name: '50米跑'
        },
        {
          type: '4',
          name: '坐位体前屈'
        },
        {
          type: '5',
          name: '一分钟跳绳'
        },
        {
          type: '6',
          name: '一分钟仰卧起坐'
        },
        {
          type: '7',
          name: '50米X8往返跑'
        },
        {
          type: '8',
          name: '立定跳远'
        },
        {
          type: '9',
          name: '引体向上'
        },
        {
          type: '10',
          name: '1000米跑'
        },
        {
          type: '11',
          name: '800米跑'
        },
        {
          type: '12',
          name: '体重'
        }
      ],
      taskStatus: '',
      taskStatusList: [
        {
          status: '0',
          name: '未执行'
        },
        {
          status: '1',
          name: '执行中'
        },
        {
          status: '2',
          name: '已执行'
        }
      ],
      infoStatus: '',
      infoStatusList: [
        {
          status: '0',
          name: '失效'
        },
        {
          status: '1',
          name: '有效'
        }
      ],
      taskName: '',
      resultColumns: [
        {
          title: '任务名称',
          key: 'taskName',
          align: 'center',
          minWidth:100
        },
        {
          title: '活动名称',
          key: 'activityName',
          align: 'center',
          minWidth:100
        },
        {
          title: '导入教师',
          key: 'teacherName',
          align: 'center',
          minWidth:100
        },
        
        {
          title: '调整项目',
          key: 'taskType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const text =
              row.taskType == '1'
                ? '身高'
                : row.taskType == '2'
                  ? '肺活量'
                  : row.taskType == '3'
                    ? '50米跑'
                    : row.taskType == '4'
                      ? '坐位体前屈'
                      : row.taskType == '5'
                        ? '一分钟跳绳'
                        : row.taskType == '6'
                          ? '一分钟仰卧起坐'
                          : row.taskType == '7'
                            ? '50米X8往返跑'
                            : row.taskType == '8'
                              ? '立定跳远'
                              : row.taskType == '9'
                                ? '引体向上'
                                : row.taskType == '10'
                                  ? '1000米跑'
                                  : row.taskType == '11'
                                    ? '800米跑'
                                    : row.taskType == '12'
                                      ? '体重'
                                      : '未知'
            return h('div', text)
          }
        },
        {
          title: '调整类型',
          key: 'adjustType',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const color =
              row.adjustType == '2'
                ? 'red'
                : row.adjustType == '1'
                  ? 'green'
                  : 'gray'
            const text =
              row.adjustType == '2'
                ? '降低'
                : row.adjustType == '1'
                  ? '增加'
                  : '未知'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '调整数量',
          key: 'adjustNum',
          align: 'center',
          minWidth:100,
        },
        {
          title: '数据状态',
          key: 'infoStatus',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const color =
              row.infoStatus == '0'
                ? 'red'
                : row.infoStatus == '1'
                  ? 'green'
                  : 'gray'
            const text =
              row.infoStatus == '0'
                ? '失效'
                : row.infoStatus == '1'
                  ? '有效'
                  : '未知'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '任务状态',
          key: 'taskStatus',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            const color =
              row.taskStatus == '0'
                ? 'red'
                : row.taskStatus == '1'
                  ? 'yellow'
                  : 'green'
            const text =
              row.taskStatus == '0'
                ? '未执行'
                : row.taskStatus == '1'
                  ? '执行中'
                  : '已执行'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          minWidth:100
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row

            return h('div', [
              row.infoStatus == '0'
                ? h(
                    'Button',
                    {
                      props: {
                        type: 'success'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.updateInfoStatus(params.row.taskId, '1')
                        }
                      }
                    },
                    '激活'
                  )
                : h(
                    'Button',
                    {
                      props: {
                        type: 'error'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.updateInfoStatus(params.row.taskId, '0')
                        }
                      }
                    },
                    '删除'
                  )
            ])
          }
        }
      ],
      resultData: [],
      modal1:false,
      taskType2:'',
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    getTaskList(activityId) {
      var vm = this
      vm.loading = true
      let data = {
        activityId: activityId,
        infoStatus: vm.infoStatus,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        taskName: vm.taskName,
        taskStatus: vm.taskStatus,
        taskType: vm.taskType
      }
      this.$axios
        .post('/v1/organtestresultEdit/getTaskList', data)
        .then(res => {
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
    querySearch() {
      this.pageNum = 1
      this.pageNo = 1
      this.search()
    },
    search() {
      var vm = this
      let activityId = vm.activityId
      vm.getTaskList(activityId)
      vm.countTaskNum(activityId)
    },
    restore() {
      var vm = this
      // vm.activityId= vm.activityId,
      ;(vm.infoStatus = ''),
        (vm.pageNo = 1),
        (vm.pageSize = 10),
        (vm.taskName = ''),
        (vm.taskStatus = ''),
        (vm.taskType = '')
      vm.search()
    },
    countTaskNum(activityId) {
      var vm = this
      let data = {
        activityId: activityId,
        infoStatus: vm.infoStatus,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        taskName: vm.taskName,
        taskStatus: vm.taskStatus,
        taskType: vm.taskType
      }
      this.$axios
        .post('/v1/organtestresultEdit/countTaskNum', data)
        .then(res => {
          if (res.data.code == 10000) {
            this.total = res.data.response
          } else {
            if (res.data.code > 39999) {
              this.$Message.info(res.data.msg)
            }
          }
        })
    },
    addTask(){
      var vm=this;
      vm.modal1=true
    },
    ok(){
      var vm=this;
      if(vm.taskType2){
        vm.toDetail(vm.activityId,vm.taskType2)
      }else{
        vm.$Message.info("请选择需要调整的类型")
      }
    },
    cancel(){

    },
    toDetail(activityId,taskType) {
      var vm = this
      sessionStorage.setItem(
        'testResultTask-testResultChangeDetail-activityId',
        activityId
      )
      sessionStorage.setItem(
        'testResultTask-testResultChangeDetail-taskType',
        taskType
      )
      this.$router.push({ name: 'testResultChangeDetail' })
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
     pageToClassList() {
      //返回
      this.$router.go(-1)
    },

    updateInfoStatus(taskId, stauts) {
      var vm = this
      this.$axios
        .get(
          '/v1/organtestresultEdit/updateInfoStatus?taskId=' +
            taskId +
            '&status=' +
            stauts
        )
        .then(res => {
          if (res.data.code == 10000) {
            if(res.data.response == '1'){
vm.search()
            }else{
              vm.$Message.info("任务执行中或已执行，无法修改")
            }
            
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg)
            }
          }
        })
    }
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this
    let activityId = sessionStorage.getItem(
      'schoolTestShow-taskList-activityId'
    )
    let schoolType = sessionStorage.getItem('schoolType')

    vm.activityId = activityId
    vm.schoolType = schoolType
    vm.getTaskList(sessionStorage.getItem('schoolTestShow-taskList-activityId'))
    vm.countTaskNum(
      sessionStorage.getItem('schoolTestShow-taskList-activityId')
    )
  }
}
</script>