<template>
  <div>
    <div>
      <h1>项目标准</h1>
    </div>
    <div style="margin-top:15px;">
      <Card>
        <div>
          <span>项目名称：</span>
          <Input v-model="examItemName" size="small" placeholder="项目名称" style="width:160px;"></Input>
          
          <Button type="success" style="margin-left:80px;" @click="querySearch">查询</Button>
          <!-- <Button type="success" style="margin-left:50px;" @click="restore">重置查询条件</Button>
          <Button type="success" style="margin-right:100px;float:right" @click="addExam">添加测试项目</Button> -->
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
      examItemName: "",
      resultColumns: [
        {
          title: "项目名称",
          key: "examItemName",
          align: "center"
        },
        {
          title: "项目创建时间",
          key: "createTime",
          align: "center"
        },
        
        {
          title: "使用次数",
          key: "useTime",
          align: "center"
          // width: 100
        },
        {
          title: "排序序号",
          key: "sortIndex",
          align: "center"
        },
        {
          title: "项目类型",
          key: "examItemType",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = row.examItemType == "1" ? "健康知识" : "运动技能";
            return h("span", text);
          }
        },
        {
          title: "是否启用",
          key: "enableStatus",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const text = row.enableStatus == "1" ? "已启用" : "已停用";
            const color = row.enableStatus == "1" ? "green" : "red";
            return h("Tag",
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
          title: "操作",
          key: "action",
          align: "center",
          // width: 300,
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
                      this.toDetail(row.examItemId);
                    }
                  }
                },
                "查看标准"
              ),
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
    getExamList() {
      var vm = this;
      vm.loading = true;
      let data = {
        examItemName: vm.examItemName,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize
      };

      sessionStorage.setItem('examStandardManage-getExamList-pageNum',vm.pageNum);
      sessionStorage.setItem('examStandardManage-getExamList-pageSize',vm.pageSize);
      sessionStorage.setItem('examStandardManage-getExamList-examItemName',vm.examItemName);

      this.$axios.post("/v1/exam/getExamList", data).then(res => {
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
    countExamList() {
      var vm = this;

       let data = {
        examItemName: vm.examItemName,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize
      };
      this.$axios.post("/v1/exam/countExamList", data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response;
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    updateExamEnableStatus(examItemId,type) {
      var vm = this;
      this.$axios.get("/v1/exam/updateExamEnableStatus?examItemId="+examItemId+"&type="+type).then(res => {
        if (res.data.code == 10000) {
        //   
        vm.search();
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
      vm.getExamList();
      vm.countExamList();
    },
    restore() {
      var vm = this;
      vm.pushType = "";
      vm.pageNo = 1;
      vm.pageSize = 10;
     vm.examItemName='';
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
    toDetail(examItemId) {
      var vm = this;
      sessionStorage.setItem("examStandardManage-examStandardDetail-examItemId", examItemId);
      this.$router.push({ name: "examStandardDetail" });
    },
    
  },
  watch: {
    
  },
  created() {},
  mounted() {
    var vm = this;
    let tempPageSize=sessionStorage.getItem('examStandardManage-getExamList-pageSize');
    let temppageNum= sessionStorage.getItem('examStandardManage-getExamList-pageNum');
    let tempexamItemName = sessionStorage.getItem('examStandardManage-getExamList-examItemName');

    if(tempPageSize != null && tempPageSize != undefined && tempPageSize > 0 ){
      vm.pageNum = Number(temppageNum);
      vm.pageSize = Number(tempPageSize);
      if(tempexamItemName != null && tempexamItemName != undefined && tempexamItemName != ""){
        vm.examItemName =  tempexamItemName;
      }
    }
    vm.search();
  }
};
</script>