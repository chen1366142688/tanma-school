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
       <h2 v-if="taskType=='1'">学生信息导入</h2>
      <h2 v-if="taskType=='2'">体测信息导入</h2>
    </div>
    <div style="margin-top:15px;">
      <Card :dis-hover="true">
          <div class="top-search">
              <div class="left-input">
                    <div style="margin:5px 20px;">
                        <span>任务名称：</span>
                        <Input v-model="taskName" size="small" placeholder="任务名称" style="width: 160px;"/>
                    </div>
                </div>
                <div class="right-btns">
                    <Upload
                        ref="upload"
                        :show-upload-list="false"
                        :on-success="handleSuccess"
                        :format="['xls','xlsx']"
                        :max-size="20480"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        :multiple="false"
                        name="muFiles"
                        type="select"
                        :action="updateUrl"
                        style="display: inline-block;margin-right:40px;"
                        >
                        <Button type="success" v-if="taskType=='1'">导入学生信息</Button>
                        <Button type="success" v-if="taskType=='3'">导入学生信息</Button>
                        <Button type="success" v-if="taskType=='2'">导入体测信息</Button>
                    </Upload>
                    <Button type="success" @click="querySearch">查询</Button>
                    <Button type="success" @click="exportPrimarySchoolTestModel">导出模板</Button>
                    <Button @click="pageToList" type="success">返回</Button>
                </div>
          </div>
      </Card>
      <br>
      <div>
        <Row>
          <div style>
            <Table border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
          </div>
          <br>
          <div style="float: right;">
            <Page
              :total="total"
              :current="pageNum"
              :page-size="pageSize"
              @on-change="pageNumChange"
              @on-page-size-change="pageSizechange"
              show-total
              show-sizer
            ></Page>
          </div>
        </Row>
      </div>
      <Modal v-model="exportStatus" :mask-closable="false" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>温馨提示</span>
        </p>
        <div style="text-align:center">
          <span style>导入中，请稍等</span>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "schoolList",
  data() {
    return {
      loading: false,
      exportStatus: false,
      updateUrl: "",
      schoolType: "",
      activityId:'',
      activityName:'',
      taskName: "",
      taskType:"1",
      resultColumns: [
        {
          title: "任务名称",
          key: "taskName",
          align: "center"
        },
        {
          title: "导入人员",
          key: "teacherName",
          align: "center"
        },
        {
          title: "导入数量",
          key: "exportNum",
          align: "center"
        },
        {
          title: "已处理数量",
          key: "dealNum1",
          align: "center",
          render: (h, params) => {
            var vm=this;
             const row = params.row;
             let text=vm.taskType=="3"?row.dealNum1:row.dealNum
            return h("div",text );
          }
        },
        {
          title: "错误数据数量",
          key: "errorNum1",
          align: "center",
          render: (h, params) => {
             var vm=this;
             const row = params.row;
             let text=vm.taskType=="3"?row.errorNum1:row.errorNum
            return h("div",text );
          }
        },
        {
          title: "导入状态",
          key: "taskStatus",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.taskStatus == "0"
                ? "red"
                : row.taskStatus == "1"
                ? "yellow"
                : row.taskStatus == "2"
                ? "green"
                :"black";
            const text =
              row.taskStatus == "0"
                ? "未执行"
                : row.taskStatus == "1"
                ? "执行中"
                : row.taskStatus == "2"
                ? "执行完成"
                : "数据出错";
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "导入时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
            width: 400,
          render: (h, params) => {
             const row = params.row;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    disabled:(row.taskStatus=='2' && (this.taskType=="3"?(row.errorNum1>0):(row.errorNum>0))) ?false:true
                  },
                  style: {
                    marginRight: "5px",
                    width:"120px",
                  },
                  on: {
                    click: () => {
                      this.exportPrimaryTestErrorData(params.row.schoolTestTaskId);
                    }
                  }
                },
                "导出错误数据"
              ),h(
                "Button",
                {
                  props: {
                    type: "success",
                    // disabled:(row.taskStatus=='2' && row.errorNum>0) ?false:true
                  },
                  style: {
                    // marginRight: "5px",
                    width:"120px",
                  },
                  on: {
                    click: () => {
                      this.refreshStatus();
                    }
                  }
                },
                "刷新任务状态"
              )
            ]);
          }
        }
      ],
      resultData: [],
      modal2: false,
      chooseCollege: true,
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1)
    },
    refreshStatus(){
        var vm=this;
        vm.search();
    },
    exportPrimaryTestErrorData(taskId) {
      var vm = this;
      let url =this.$axios.defaults.baseURL +
        "/v1/schoolteststudent/exportPrimaryTestErrorData?taskId=" +taskId +"&taskType="+vm.taskType+
        "&token=" +
        sessionStorage.getItem("token");
      window.open(url);
    },
    exportPrimarySchoolTestModel() {
      var vm = this;
      let url =this.$axios.defaults.baseURL +
        "/v1/schoolteststudent/exportPrimarySchoolTestModel?taskType="+vm.taskType+"&token=" +
        sessionStorage.getItem("token");
      window.open(url);
    },
    handleSuccess(res, file) {
      var vm = this;
      console.log(res)
      vm.exportStatus = false;
      if (res.code == 10000) {
        if (res.response.code == 1) {
          vm.$Message.info("导入成功");
          vm.modal2 = false;
          vm.search();
        } else {
          vm.$Message.info("文件为空，导入失败");
        }
      } else {
        vm.$Message.info("导入失败，请稍后再试");
      }
    },
    handleFormatError(file) {
      this.exportStatus = false;
      this.$Notice.warning({
        title: "格式错误",
        desc: "该文件格式错误，请检查后重试"
      });
    },
    handleMaxSize(file) {
      this.exportStatus = false;
      this.$Notice.warning({
        title: "文件超大",
        desc: "该文件超大了"
      });
    },
    handleBeforeUpload(file) {
      var vm = this;
      vm.exportStatus = true;
      return true;
    },
    getSchoolStudentTaskList(activityId,taskType) {
      var vm = this;
      vm.loading = true;
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        taskName: vm.taskName,
        activityId:activityId,
        taskType:taskType
      };
      this.$axios.post("/v1/schoolteststudent/getSchoolStudentTaskList", data).then(res => {
        vm.loading = false;
        if (res.data.code == 10000) {
          vm.resultData = res.data.response;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    countSchoolStudentTaskList(activityId,taskType) {
      var vm = this;
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        taskName: vm.taskName,
        activityId:activityId,
        taskType:taskType
      };
      this.$axios.post("/v1/schoolteststudent/countSchoolStudentTaskList", data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    querySearch() {
      this.pageNum = 1;
      this.pageNo = 1;
      this.search();
    },
    search() {
      var vm = this;
      let schoolId = vm.schoolId;
      vm.getSchoolStudentTaskList(vm.activityId,vm.taskType);
      vm.countSchoolStudentTaskList(vm.activityId,vm.taskType);
    },
    restore() {
      var vm = this;
      vm.pageNum = 1;
      vm.pageSize = 10;
      vm.taskName = "";
      vm.search();
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
        this.pageNum = value;
        this.search();
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value;
        this.pageNum = 1;
        this.search();
      }
    },


  },
  watch: {

  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    var vm = this;
    let schoolId = sessionStorage.getItem("schoolId");
    let schoolType = sessionStorage.getItem("schoolType");
    vm.activityId = sessionStorage.getItem("schoolTestDetail-schoolTestStudentExport-activityId");
    vm.activityName = sessionStorage.getItem("schoolTestDetail-schoolTestStudentExport-activityName");
    vm.taskType = sessionStorage.getItem("schoolTestDetail-schoolTestStudentExport-taskType");
    if(sessionStorage.getItem("schoolTestDetail-schoolTestStudentExport-taskType")=="3"){
      vm.updateUrl =
      this.$axios.defaults.baseURL +
      "/v1/schoolteststudent/file/upload/importTestReportStudentInfo?activityId="+vm.activityId+"&activityName="+vm.activityName+
      "&token=" +
      sessionStorage.getItem("token");
    }else{
      vm.updateUrl =
      this.$axios.defaults.baseURL +
      "/v1/schoolteststudent/file/upload/addPrimarySchoolTestTaskInfo?activityId="+vm.activityId+"&activityName="+vm.activityName+"&taskType=" +vm.taskType+
      "&token=" +
      sessionStorage.getItem("token");
    }

    vm.schoolId = schoolId;
    vm.schoolType = schoolType;
    vm.search()
  }
};
</script>
