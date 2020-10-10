<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测合格率调整</h2>
    </div>
    <div>
      <Card>
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>活动名称：</span>
                    <Select v-model="activityId"  style="width:120px;">
                        <Option
                        v-for="item in activityList"
                        :value="item.activityId"
                        :key="item.activityId"
                        >{{ item.activityName }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>任务状态：</span>
                    <Select v-model="taskStatus"  style="width:120px;">
                        <Option
                        v-for="item in taskStatusList"
                        :value="item.type"
                        :key="item.type"
                        >{{ item.name }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>教师名称：</span>
                    <Select v-model="teacherId"  style="width:120px;">
                        <Option
                        v-for="item in teacherList"
                        :value="item.teacherId"
                        :key="item.teacherId"
                        >{{ item.name }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>任务名称：</span>
                    <Input v-model="taskName"  placeholder="任务名称" style="width:120px;"></Input>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
                <Button type="success" @click="addBanner">新增任务</Button>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "schoolList",
  data() {
    return {
      loading: false,
      activityId: "",
      activityList: [],
      schoolId: "",
      taskName: "",
      taskStatus: "",
      taskStatusList: [
        {
          type: "999",
          name: "全部"
        },
        {
          type: "1",
          name: "未执行"
        },
        {
          type: "2",
          name: "执行中"
        },
        {
          type: "3",
          name: "已执行"
        },
        {
          type: "4",
          name: "暂停中"
        },
        {
          type: "5",
          name: "已失效"
        }
      ],
      teacherId: "",
      teacherList: [],
      serachTf: false,
      resultColumns: [
        {
          title: "任务名称",
          key: "taskName",
          align: "center",
          minWidth:100
        },
        {
          title: "活动名称",
          key: "activityName",
          align: "center",
          minWidth:100
        },
        {
          title: "创建人",
          key: "teacherName",
          align: "center",
          minWidth:100
        },
        {
          title: "及格率(%)",
          key: "passRate",
          align: "center",
          minWidth:100
        },
        {
          title: "任务状态",
          key: "taskStatus",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            // 1未执行，2执行中，3已执行，4暂停中，5已失效
            const color =
              row.taskStatus == "1"
                ? "red"
                : row.taskStatus == "2"
                ? "yellow"
                : row.taskStatus == "3"
                ? "green"
                : row.taskStatus == "4"
                ? "gray"
                : "gray";
            const text =
              row.taskStatus == "1"
                ? "未执行"
                : row.taskStatus == "2"
                ? "执行中"
                : row.taskStatus == "3"
                ? "已执行"
                : row.taskStatus == "4"
                ? "暂停中"
                : "已失效";
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
          title: "创建时间",
          key: "createTime",
          align: "center",
          minWidth:100
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 300,
          render: (h, params) => {
            const row = params.row;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    disabled: row.taskStatus == "3" ? false : true
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.exportChangeData(row.changeTaskId);
                    }
                  }
                },
                "导出"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.toDetail(row.changeTaskId);
                    }
                  }
                },
                "详情"
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
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    refreshStatus(){
        var vm=this;
        vm.search();
    },
    getTaskList(schoolId) {
      var vm = this;
      vm.loading = true;
      let data = {
        activityId: vm.activityId=='999'?'':vm.activityId,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId,
        taskName: vm.taskName,
        taskStatus: vm.taskStatus=='999'?'':vm.taskStatus,
        teacherId: vm.teacherId=='999'?'':vm.teacherId
      };
      this.$axios.post("/v1/changtask/getTaskList", data).then(res => {
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
    countTaskNum(schoolId) {
      var vm = this;
      let data = {
        activityId: vm.activityId=='999'?'':vm.activityId,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        schoolId: schoolId,
        taskName: vm.taskName,
        taskStatus: vm.taskStatus=='999'?'':vm.taskStatus,
        teacherId: vm.teacherId=='999'?'':vm.teacherId
      };
      this.$axios.post("/v1/changtask/countTaskNum", data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSchoolTeacherList() {
      var vm = this;
      this.$axios.get("/v1/changtask/getSchoolTeacherList").then(res => {
        if (res.data.code == 10000) {
          // vm.teacherList = res.data.response;
          let all = {
              teacherId: 999,
              name: "全部"
            };
            vm.teacherList.push(all);
            vm.teacherList = vm.teacherList.concat(res.data.response);
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    getActivitySingleInfoBySchoolId() {
      var vm = this;
      this.$axios
        .get(
          "/v1/testdata/getActivitySingleInfoBySchoolId?schoolId=" + sessionStorage.getItem("schoolId")
        )
        .then(res => {
          if (res.data.code == 10000) {
            // vm.activityList = res.data.response;
            let all = {
              activityId: 999,
              activityName: "全部"
            };
            vm.activityList.push(all);
            vm.activityList = vm.activityList.concat(res.data.response);
          } else {
            if (res.data.code > 39999) {
              vm.$Message.info(res.data.msg);
            }
          }
        });
    },
    querySearch() {
      var vm = this;
      this.pageNum = 1;
      this.pageNo = 1;
      vm.serachTf = true;
      this.search();
    },
    search() {
      var vm = this;
      let schoolId = vm.schoolId;
      if (vm.serachTf) {
        sessionStorage.setItem(
          "scoreChangeManage-querySearch-activityId",
          vm.activityId
        );
        sessionStorage.setItem(
          "scoreChangeManage-querySearch-taskName",
          vm.taskName
        );
        sessionStorage.setItem(
          "scoreChangeManage-querySearch-taskStatus",
          vm.taskStatus
        );
        sessionStorage.setItem(
          "scoreChangeManage-querySearch-pageNo",
          Number(vm.pageNum)
        );
        sessionStorage.setItem(
          "scoreChangeManage-querySearch-pageSize",
          Number(vm.pageSize)
        );
        sessionStorage.setItem(
          "scoreChangeManage-querySearch-teacherId",
          vm.teacherId
        );
      }
      vm.getTaskList(schoolId);
      vm.countTaskNum(schoolId);
    },
    restore() {
      var vm = this;
      vm.activityId = "";
      vm.pageNo = 1;
      vm.pageSize = 10;
      vm.taskName = "";
      vm.teacherId = "";
      vm.taskStatus = "";
      vm.serachTf = false;
      vm.querySearch();
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
        this.querySearch();
      }
    },
    toDetail(changeTaskId) {
      var vm = this;
      sessionStorage.setItem(
        "scoreChangeManage-scoreChangeDetail-changeTaskId",
        changeTaskId
      );
      this.$router.push({ name: "scoreChangeDetail" });
    },
    addBanner() {
      var vm = this;
      sessionStorage.removeItem(
        "scoreChangeManage-scoreChangeDetail-changeTaskId"
      );
      this.$router.push({ name: "scoreChangeDetail" });
    },
    exportChangeData(taskId) {
      var vm = this;
      let url =
        this.$axios.defaults.baseURL +
        "/v1/changtask/exportChangeData?taskId=" +
        taskId +
        "&token=" +
        sessionStorage.getItem("token");

      window.open(url);
    }
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    let schoolId = sessionStorage.getItem("schoolId");
    vm.schoolId = schoolId;
    if (sessionStorage.getItem("clubConfigurationManage-querySearch-pageNo")) {
      vm.activityId = sessionStorage.getItem(
        "scoreChangeManage-querySearch-activityId"
      );
      vm.taskName = sessionStorage.getItem(
        "scoreChangeManage-querySearch-taskName"
      );
      vm.taskStatus = sessionStorage.getItem(
        "scoreChangeManage-querySearch-taskStatus"
      );
      vm.pageNum = Number(
        sessionStorage.getItem("scoreChangeManage-querySearch-pageNo")
      );
      vm.pageSize = Number(
        sessionStorage.getItem("scoreChangeManage-querySearch-pageSize")
      );
      vm.teacherId = sessionStorage.getItem(
        "scoreChangeManage-querySearch-teacherId"
      );
      vm.getTaskList(sessionStorage.getItem("schoolId"));
      vm.countTaskNum(sessionStorage.getItem("schoolId"));
    } else {
      vm.getTaskList(sessionStorage.getItem("schoolId"));
      vm.countTaskNum(sessionStorage.getItem("schoolId"));
    }
    vm.getActivitySingleInfoBySchoolId();
    vm.getSchoolTeacherList();
  }
};
</script>