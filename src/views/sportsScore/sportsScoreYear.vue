<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体育分值查询</h2>
    </div>
    <div>
      <Card>
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span style>年级：</span>
                    <Select v-model="grade"  style="width:120px;">
                        <Option
                        v-for="item in schoolGradeList"
                        :value="item.grade"
                        :key="item.grade"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>班级：</span>
                    <Select v-model="studentClass"  style="width:120px;">
                        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>性别：</span>
                    <Select v-model="gender"  style="width:120px;">
                        <Option
                        v-for="item in genderList"
                        :value="item.itemId"
                        :key="item.itemId"
                        >{{ item.itemName }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>姓名：</span>
                    <Input v-model="studentName"  placeholder="学生姓名" style="width: 120px;" />
                </div>
                <div style="margin:5px 20px;">
                    <span>学籍号：</span>
                    <Input v-model="registerCode"  placeholder="学生学籍号" style="width: 120px;" />
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="search">查询</Button>
                <!-- <Button type="success" @click="exportData">导出EXCEL</Button> -->
            </div>
        </div>
      </Card>
      <br/>
      <!-- <Card> -->
        <div>
          <Row>
            <div style>
              <Table border max-height="530"  :loading="loading" :columns="resultColumns" :data="resultData"></Table>
            </div>
          </Row>
        </div>
        <br>
        <div style="float: right;">
          <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
        </div>
      <!-- </Card> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
      loading:false,
      schoolId: '',
      schoolType: '',
      grade: '',
       schoolGradeList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 7,
          label: '七年级'
        },
        {
          grade: 8,
          label: '八年级'
        },
        {
          grade: 9,
          label: '九年级'
        }
      ],
      gender:"",
      genderList:[
        {
          itemId:"",
          itemName:"全部"
        },
        {
          itemId:"1",
          itemName:"男"
        },
        {
          itemId:"2",
          itemName:"女"
        }
      ],
      resultColumns: [
        {
          title: "姓名",
          key: "studentName",
          align: "center",
          width:120
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          width:150
        },
        {
          title: "性别",
          key: "studentName",
          align: "center",
          width:70,
          render: (h, params) => {
            const row = params.row;
            const text = row.gender == '1'?"男":"女";
            return h("span", text);
          }
        },
        {
          title: "班级",
          key: "grade",
          align: "center",
          width:120,
          render: (h, params) => {
            const row = params.row;
            const text = row.gradeId == "1" ?'一年级':row.gradeId == "2" ?'二年级':row.gradeId == "3" ?'三年级':row.gradeId == "4" ?'四年级':
            row.gradeId == "5" ?'五年级':row.gradeId == "6" ?'六年级':row.gradeId == "7" ?'七年级':row.gradeId == "8" ?'八年级':row.gradeId == "9" ?'九年级':
            row.gradeId == "10" ?'高一':row.gradeId == "11" ?'高二':row.gradeId == "12" ?'高三':'';
            return h("span",row.gradeId ?(text+row.studentClass+"班"):"" );
          }
        },
        {
          title: "七年级",
          key: "finishCount",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let score=0;
            if(null !=row.testScore && null !=row.healthScore){
              if(row.testScore>=90){
                score+=1;
              }else if(row.testScore>=80 && row.testScore<90){
                score+=0.75;
              }else if(row.testScore>=60 && row.testScore<80){
                score+=0.5;
              }else{
                score+=0.25;
              }

              if(row.healthScore>=90){
                score+=2;
              }else if(row.healthScore>=80 && row.healthScore<90){
                score+=1.5;
              }else if(row.healthScore>=60 && row.healthScore<80){
                score+=1;
              }else{
                score+=0.5;
              }
            }
            return h("span", score? score+"分":"-");
          }
        },
        {
          title: "八年级",
          key: "actionScore",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let score=0;
            if(null !=row.testScore1 && null !=row.healthScore1){
              if(row.testScore1>=90){
                score+=1;
              }else if(row.testScore1>=80 && row.testScore1<90){
                score+=0.75;
              }else if(row.testScore1>=60 && row.testScore1<80){
                score+=0.5;
              }else{
                score+=0.25;
              }

              if(row.healthScore1>=90){
                score+=2;
              }else if(row.healthScore1>=80 && row.healthScore1<90){
                score+=1.5;
              }else if(row.healthScore1>=60 && row.healthScore1<80){
                score+=1;
              }else{
                score+=0.5;
              }
            }
            return h("span", score? score+"分":"-");
          }
        },
        {
          title: "九年级",
          key: "healthScore",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let score=0;
            if(null !=row.testScore2 && null !=row.healthScore2){
              if(row.testScore2>=90){
                score+=2;
              }else if(row.testScore2>=80 && row.testScore2<90){
                score+=1.5;
              }else if(row.testScore2>=60 && row.testScore2<80){
                score+=1;
              }else{
                score+=0.5;
              }

              if(row.healthScore2>=90){
                score+=2;
              }else if(row.healthScore2>=80 && row.healthScore2<90){
                score+=1.5;
              }else if(row.healthScore2>=60 && row.healthScore2<80){
                score+=1;
              }else{
                score+=0.5;
              }
            }
            return h("span",score? score+"分":"-");
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width:100,
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
                      this.toDetail(row);
                    }
                  }
                },
                "详情"
              ),
            ]);
          }
        }
      ],
      resultData:[],

      studentClass: '',
      classList: [
        {
          value: "",
          label: '全部'
        },
        {
          value: 1,
          label: '1班'
        },
        {
          value: 2,
          label: '2班'
        },
        {
          value: 3,
          label: '3班'
        },
        {
          value: 4,
          label: '4班'
        },
        {
          value: 5,
          label: '5班'
        },
        {
          value: 6,
          label: '6班'
        },
        {
          value: 7,
          label: '7班'
        },
        {
          value: 8,
          label: '8班'
        },
        {
          value: 9,
          label: '9班'
        },
        {
          value: 10,
          label: '10班'
        },
        {
          value: 11,
          label: '11班'
        },
        {
          value: 12,
          label: '12班'
        },
        {
          value: 13,
          label: '13班'
        },
        {
          value: 14,
          label: '14班'
        },
        {
          value: 15,
          label: '15班'
        },
        {
          value: 16,
          label: '16班'
        },
        {
          value: 17,
          label: '17班'
        },
        {
          value: 18,
          label: '18班'
        },
        {
          value: 19,
          label: '19班'
        },
        {
          value: 20,
          label: '20班'
        },
        {
          value: 21,
          label: '21班'
        },
        {
          value: 22,
          label: '22班'
        },
        {
            value: 23,
            label: '23班'
        },
        {
            value: 24,
            label: '24班'
        },
        {
            value: 25,
            label: '25班'
        }
      ],
      registerCode: '',
      studentName: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  },
  methods: {
    countClassSportsScoreList() {
      var vm = this
      let data = {
          grade:vm.grade,
          studentClass:vm.studentClass,
          studentName:vm.studentName,
          registerCode:vm.registerCode,
          gender:vm.gender,
          pageNo:vm.pageNum,
          pageSize:vm.pageSize
      };
      this.$axios.post('/v1/semesterScore/countClassSportsScoreList',data).then(res => {
        if (res.data.code == 10000) {
              vm.total=res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    getClassSportsScoreList() {
      var vm = this
      vm.resultData=[];
      let data = {
          grade:vm.grade,
          studentClass:vm.studentClass,
          studentName:vm.studentName,
          registerCode:vm.registerCode,
          gender:vm.gender,
          pageNo:vm.pageNum,
          pageSize:vm.pageSize
      };
      this.$axios.post('/v1/semesterScore/getClassSportsScoreList',data).then(res => {
        if (res.data.code == 10000) {
              vm.resultData=(res.data.response)
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    search(){
      var vm=this;
      vm.getClassSportsScoreList();
      vm.countClassSportsScoreList();
    },
    toDetail(row){
        sessionStorage.setItem('sportsScoreYear-sportsScoreYearDetail-studentId',row.studentId)
        sessionStorage.setItem('sportsScoreYear-sportsScoreYearDetail-studentName',row.studentName)
        sessionStorage.setItem('sportsScoreYear-sportsScoreYearDetail-registerCode',row.registerCode)
        sessionStorage.setItem('sportsScoreYear-sportsScoreYearDetail-gradeId',row.gradeId)
        sessionStorage.setItem('sportsScoreYear-sportsScoreYearDetail-studentClass',row.studentClass)
        sessionStorage.setItem('sportsScoreYear-sportsScoreYearDetail-gender',row.gender)
        this.$router.push({name: 'sportsScoreYearDetail'})
    },
    pageNumChange(value) {
      //页码改变方法处理
      if (this.pageNum != value) {
          this.pageNum = value
          this.search(1)
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
    exportData(){
      var vm=this;
      // console.log(vm.selectYear)
      let url =
        this.$axios.defaults.baseURL +
        '/v1/semesterScore/exportStudentSportsScoreList?grade='+vm.grade+'&studentClass='+vm.studentClass+
        '&gender='+vm.gender+'&studentName='+vm.studentName+'&registerCode='+vm.registerCode+'&token=' +
        sessionStorage.getItem('token')
        window.open(url)
    }

  },
  watch: {
  },
  created() {
  },
  mounted() {
  //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    let schoolType = sessionStorage.getItem('schoolType')
    vm.schoolType=schoolType;
    vm.search();
  }
}
</script>
