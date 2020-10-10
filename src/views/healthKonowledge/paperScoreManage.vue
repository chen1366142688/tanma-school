<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">成绩</h2>
    </div>
    <div>
      <Card>
        <div class="top-search" @keydown.enter="querySearch">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span>年<span style="visibility:hidden">班级</span>级：</span>
                    <Select v-model="grade" style="width:120px;">
                        <Option
                        v-for="item in schoolGradeList"
                        :value="item.grade"
                        :key="item.grade"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>班<span style="visibility:hidden">班级</span>级：</span>
                    <Select v-model="studentClass" style="width:120px;">
                        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>录入状态：</span>
                    <Select v-model="entryStatus" style="width:120px;">
                        <Option
                        v-for="item in entryStatusList"
                        :value="item.entryStatus"
                        :key="item.entryStatus"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
            </div>
        </div>
      </Card>
      <br />
      <div>
        <Row>
          <div style>
            <Table
              border
              max-height="580"
              :loading="loading"
              :columns="resultColumns"
              :data="resultData"
            ></Table>
          </div>
          <br />
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
  name: "paperScoreManage",
  data() {
    return {
      loading: false,
      grade: 99,
      schoolGradeList: [],
      entryStatus: 0,
      entryStatusList: [
        { entryStatus: 0, label: "全部" },
        { entryStatus: 1, label: "已完成" },
        { entryStatus: 2, label: "未完成" }
      ],
      studentClass: 99,
      classList: [
        {
          value: 99,
          label: "全部"
        },
        {
          value: 1,
          label: "1班"
        },
        {
          value: 2,
          label: "2班"
        },
        {
          value: 3,
          label: "3班"
        },
        {
          value: 4,
          label: "4班"
        },
        {
          value: 5,
          label: "5班"
        },
        {
          value: 6,
          label: "6班"
        },
        {
          value: 7,
          label: "7班"
        },
        {
          value: 8,
          label: "8班"
        },
        {
          value: 9,
          label: "9班"
        },
        {
          value: 10,
          label: "10班"
        },
        {
          value: 11,
          label: "11班"
        },
        {
          value: 12,
          label: "12班"
        },
        {
          value: 13,
          label: "13班"
        },
        {
          value: 14,
          label: "14班"
        },
        {
          value: 15,
          label: "15班"
        },
        {
          value: 16,
          label: "16班"
        },
        {
          value: 17,
          label: "17班"
        },
        {
          value: 18,
          label: "18班"
        },
        {
          value: 19,
          label: "19班"
        },
        {
          value: 20,
          label: "20班"
        },
        {
          value: 21,
          label: "21班"
        },
        {
          value: 22,
          label: "22班"
        },
        {
          value: 23,
          label: "23班"
        },
        {
          value: 24,
          label: "24班"
        },
        {
          value: 25,
          label: "25班"
        }
      ],
      primaryList: [
        { grade: 99, label: "全部" },
        { grade: 1, label: "一年级" },
        { grade: 2, label: "二年级" },
        { grade: 3, label: "三年级" },
        { grade: 4, label: "四年级" },
        { grade: 5, label: "五年级" },
        { grade: 6, label: "六年级" }
      ],
      middleList: [
        { grade: 99, label: "全部" },
        { grade: 7, label: "七年级" },
        { grade: 8, label: "八年级" },
        { grade: 9, label: "九年级" }
      ],
      highList: [
        { grade: 99, label: "全部" },
        { grade: 10, label: "高一" },
        { grade: 11, label: "高二" },
        { grade: 12, label: "高三" }
      ],
      diffcultyId: 0,
      diffcultytList: [],
      paperContent: "",
      resultColumns: [
        {
          title: "年级",
          key: "gradeId",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text = row.gradeId==1?"一年级":row.gradeId==2?"二年级":row.gradeId==3?"三年级":row.gradeId==4?"四年级":row.gradeId==5?"五年级":row.gradeId==6?"六年级":
            row.gradeId==7?"七年级":row.gradeId==8?"八年级":row.gradeId==9?"九年级":
            row.gradeId==10?"高一":row.gradeId==11?"高二":row.gradeId==12?"高三":"未知";
            return h("div", text);
          }
        },
        {
          title: "班级",
          key: "studentClass",
          align: "center",
          minWidth:100,
           render: (h, params) => {
            const row = params.row;
            const text = row.studentClass + "班";
            return h("div", text);
          }
        },
        {
          title: "录入状态",
          key: "entryStatus",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text = row.entryStatus=="1"?"已完成":"未完成";
            return h("div", text);
          }
        },
        {
          title: "完成人数/考试总人数",
          key: "entryStatusInfo",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text = row.entryStudent+"/"+row.totalStudent;
            return h("div", text);
          }
        },
        {
          title: "免试人数",
          key: "exemptStudent",
          align: "center",
          minWidth:100,
          render: (h, params) => {
              return h('div', (null != params.row.exemptStudent?params.row.exemptStudent : 0));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success"
                  },
                  style: {
                    margin: "5px 10px"
                  },
                  on: {
                    click: () => {
                      this.toClassResults(params.row.gradeId,params.row.studentClass,params.row.classId,params.row.paperId);
                    }
                  }
                },
                "查看详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success"
                  },
                  style: {
                    margin: "5px 10px"
                  },
                  on: {
                    click: () => {
                      this.$axios.get('/v1/subjectReport/querySchoolReportedStatus?dataType=2').then(res => {
                        if (res.data.code === 10000) {
                          let {editStatus} = res.data.response
                          if (editStatus === '1') {
                            this.toEntryResults(params.row.gradeId,params.row.studentClass,params.row.classId,params.row.paperId);
                          } else {
                            this.$Modal.info({
                              title: '提醒',
                              okText: '知道了',
                              closable: false,
                              content: '<p>数据已报送给教育局，无法编辑数据，若需编辑，请联系学校管理员，申请编辑权限</p>'
                          });
                          }
                        }
                      })
                    }
                  }
                },
                "录入成绩"
              )
            ]);
          }
        }
      ],
      resultData: [
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    querySearch() {
      this.pageNum = 1;
      this.pageNo = 1;
      this.search();
    },
    search() {
      var vm = this;
      vm.getHealthyScoreGradeClassList();
      vm.countHealthyScoreGradeClassList();
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
    getHealthyScoreGradeClassList() {
      var vm = this;
      this.$axios
        .get("/v1/healthyScore/getHealthyScoreGradeClassList?gradeId="+(vm.grade==99?"":vm.grade)+"&studentClass="+(vm.studentClass==99?"":vm.studentClass)+
        "&entryStatus="+vm.entryStatus+"&pageNo="+vm.pageNum+"&pageSize="+vm.pageSize)
        .then(function(response) {
          let data = response.data.response;
          vm.resultData = data ? data : [];
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    countHealthyScoreGradeClassList() {
      var vm = this;
      this.$axios
        .get("/v1/healthyScore/countHealthyScoreGradeClassList?gradeId="+(vm.grade==99?"":vm.grade)+"&studentClass="+(vm.studentClass==99?"":vm.studentClass)+
        "&entryStatus="+vm.entryStatus)
        .then(function(response) {
          let data = response.data.response;
          vm.total = data ;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    toClassResults(gradeId,studentClass,classId,paperId) {
      sessionStorage.setItem("paperScoreManage-paperClassResults-gradeId",gradeId);
      sessionStorage.setItem("paperScoreManage-paperClassResults-studentClass",studentClass);
      sessionStorage.setItem("paperScoreManage-paperClassResults-classId",classId);
      sessionStorage.setItem("paperScoreManage-paperClassResults-paperId",paperId);
      this.$router.push({ name: "paperClassResults" });
    },
    toEntryResults(gradeId,studentClass,classId,paperId) {
      sessionStorage.setItem("paperScoreManage-paperEntryResults-gradeId",gradeId);
      sessionStorage.setItem("paperScoreManage-paperEntryResults-studentClass",studentClass);
      sessionStorage.setItem("paperScoreManage-paperEntryResults-classId",classId);
      sessionStorage.setItem("paperScoreManage-paperEntryResults-paperId",paperId);
      this.$router.push({ name: "paperEntryResults" });
    }
  },
  created() {},
  mounted() {
    var vm = this;
    let schoolType = sessionStorage.getItem("schoolType");
    if (schoolType) {
      if ("0" == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList);
      }
      if ("2" == schoolType) {
        vm.schoolGradeList = vm.primaryList;
      }
      if ("3" == schoolType) {
        vm.schoolGradeList = vm.middleList;
      }
      if ("4" == schoolType) {
        vm.schoolGradeList = vm.highList;
      }
    }
    vm.search();
  }
};
</script>


