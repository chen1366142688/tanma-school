<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">推送消息</h2>
    </div>
    <div>
      <Card>
        <div class="top-search" @keydown.enter="querySearch">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>标题：</span>
                    <Input v-model="pushTitle" placeholder="标题" style="width:120px;"></Input>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
                <Button type="success" @click="addBanner">发送消息</Button>
            </div>
        </div>
      </Card>
      <br>
      <div>
      <Card>
        <div style="font-size:18px;height:40px;">
            数据明细
        </div>
        <Row>
          <div style>
            <Table border max-height="530" :loading="loading" :columns="resultColumns" :data="resultData"></Table>
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
        </Card>
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
      pushType: "5",
      pushTypeList: [
        {
          type: "4",
          name: "广播"
        },
        {
          type: "5",
          name: "组播"
        }
      ],
      schoolList: [],
      schoolId: "",
      pushTitle: "",
      resultColumns: [
        {
          title: "标题",
          key: "pushTitle",
          align: "center",
          minWidth:100
        },
        {
          title: "消息类型",
          key: "displayType",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text = row.notifyType == "1" ? "消息" : "消息+弹窗";
            return h("span", text);
          }
        }, 
        {
          title: "消息内容",
          key: "pushText",
          align: "center",
          minWidth:100
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
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            return h("div", [
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
                      this.toDetail(row.pushId);
                    }
                  }
                },
                "详情"
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
    getManagePushList() {
      var vm = this;
      sessionStorage.setItem("pushManage-pageNum",vm.pageNum);
      sessionStorage.setItem("pushManage-pageSize",vm.pageSize);
      sessionStorage.setItem("pushManage-pushTitle",vm.pushTitle);
      vm.loading = true;
      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        pushType: vm.pushType,
        schoolId: vm.schoolId,
        title: vm.pushTitle
      };
      this.$axios.post("/v1/push/getManagePushList", data).then(res => {
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
    countManagePush() {
      var vm = this;

      let data = {
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        pushType: vm.pushType,
        schoolId: vm.schoolId,
        title: vm.pushTitle
      };
      this.$axios.post("/v1/push/countManagePush", data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSchoolList() {
      var vm = this;
      this.$axios.get("/v1/unirun/getSchoolList").then(res => {
        if (res.data.code == 10000) {
          vm.schoolList = res.data.response;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
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
      vm.getManagePushList();
      vm.countManagePush();
    },
    restore() {
      var vm = this;
      vm.pushType = "";
      vm.pageNo = 1;
      vm.pageSize = 10;
      // vm.schoolId = "";
      vm.pushTitle = "";
      vm.querySearch();
    },

    cancel() {
      // this.$Message.info('Clicked cancel');
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
    toDetail(pushId) {
      var vm = this;
      sessionStorage.setItem("pushManage-pushDetail-pushId", pushId);
      this.$router.push({ name: "pushDetail" });
    },
    addBanner() {
      var vm = this;
      sessionStorage.removeItem("pushManage-pushDetail-pushId");
      this.$router.push({ name: "pushDetail" });
    }
  },
  watch: {},
  created() {},
  mounted() {
    var vm = this;
    if(sessionStorage.getItem("pushManage-pageNum") != "" && sessionStorage.getItem("pushManage-pageNum") != undefined){
        vm.pageNum =  Number(sessionStorage.getItem("pushManage-pageNum"))
        vm.pageSize =  Number(sessionStorage.getItem("pushManage-pageSize"))
        if(sessionStorage.getItem("pushManage-pushTitle") != "" && sessionStorage.getItem("pushManage-pushTitle") != undefined){
            vm.pushTitle = sessionStorage.getItem("pushManage-pushTitle");
        }
    }
    vm.getManagePushList();
    vm.countManagePush();
    // vm.getSchoolList();
  }
};
</script>