<style>
    
</style>

<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">体测数据分析</h2>
    </div>
    <div>
        <Form :label-width="100" class="function">
            <Card>
                <div class="top-search">
                    <div class="left-input">
                        <div style="margin:5px 20px;">
                            <span>年级：</span>
                            <Select v-model="grade"  style="width:120px;">
                                <Option
                                v-for="item in schoolGradeList"
                                :value="item.gradeId"
                                :key="item.gradeId"
                                >{{ item.gradeName }}</Option>
                            </Select>
                        </div>
                        <div style="margin:5px 20px;">
                            <span>班级：</span>
                            <Select v-model="studentClass" style="width:120px;">
                                <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class="right-btns">
                        <Button type="success"   @click="querySearch">查询</Button>
                    </div>
                </div>
          </Card>
          </br>
          <Card>
                <div style="font-size:18px;height:40px;">
                    数据概览
                </div>
                <FormItem label="体测情况：">
                    <Row>
                        <Col span="4">
                            学生总：{{testInfo.allCount}}人
                        </Col>
                        <Col span="4">
                            免试：{{testInfo.exemptCount}}人 
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
            </Card>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Form>  
        </br>
        <Card>
        <div style="font-size:18px;height:40px;">
            数据分析
        </div>
        <div :style="{backgroundColor:'#FFFFFF'}">
          <Row :style="{textAlign:'center'}">
            <div id="myChart1" :style="{width: '40%', height: '400px', marginTop: '50px',display: 'inline-block'}"></div>
            <div id="myChart2" :style="{width: '40%', height: '400px', marginTop: '50px',display: 'inline-block'}"></div>
          </Row>
        </div>
        </Card>
     </br>
        <Card>
        <div style="font-size:18px;height:40px;">
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
        <div style="width:100%;height:50px"></div>      
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
            myChart1:null,
            option1:{},
            myChart2:null,
            option2:{},
            loading: false,
            resultColumns: [
              {
                title: '老师姓名',
                key: 'teacherName',
                align: 'center',
                minWidth:100
              },
              {
                title: '体测项目',
                key: 'schoolTestName',
                align: 'center',
                minWidth:100,
              },
              {
                title: '体测学生人数',
                key: 'studentCount',
                align: 'center',
                minWidth:100,
              }
            ],
            grade: 999,
      schoolGradeList: [],
      studentClass: 999,
      classList: [
        {
          value: 999,
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
        }
      ],
            resultData:[],
            pageNum: 1,
            pageSize: 10,
            total: 0
        }
    }
    ,methods:{
        querySearch(){
            this.querySchoolAllInfo();
        },
        queryActivityTest(){
          this.$axios.get('/v1/testdata/list/test/activity?schoolId='+this.schoolId).then(res => {
              if (res.data.code == 10000) {
                //   this.resultData = res.data.response;
                  this.activityName = res.data.response[0].activityName
                  this.activityId = res.data.response[0].activityId
                  this.querySchoolAllInfo();
              }
          })
        },
        querySchoolAllInfo(){
            var vm = this
            this.$axios.get('/v1/testdata/query/school/all/show?schoolId=' + this.schoolId+'&activityId=' +( this.activityId|| '')+'&gradeId='+(vm.grade==999?'':vm.grade)+'&studentClass='+(vm.studentClass==999?'':vm.studentClass))
                .then(res => {
                    vm.spinShow=false;
                if (res.data.code == 10000) {
                    this.testInfo = res.data.response.testInfo;
                    this.passOver = res.data.response.passOver;
                    this.passRate = 0;
                    if(this.passOver == null){
                        this.passOver = {
                            beginCount: 0,
                            notOverNotPass: 0,
                            notOverPass: 0,
                            overCount: 0,
                            overNotPass: 0,
                            overPass: 0,
                            passCount: 0
                        };
                    }
                    if(res.data.response.passOver !=null && res.data.response.testInfo != null){
                        this.passRate = (this.passOver.passCount/(this.testInfo.allCount-this.testInfo.exemptCount)*100).toFixed(2);
                    }
                    this.queryTeacherTestStudentCount()
                    this.drawGenSLine()
                    this.drawGenSLine2()
                } else {
                    if (res.data.code > 39999) {
                        vm.$Message.info(res.data.msg)
                    }
                }
            })
        },     
        toTaskList(){
            sessionStorage.setItem('schoolTestShow-taskList-activityId',this.activityId);
             this.$router.push({ name: 'testResultTask' })
        },
        drawGenSLine() {
          var vm = this;
          vm.myChart1 = this.$echarts.init(document.getElementById("myChart1"));
          vm.option1 = {
              title : {
                  text: '体测情况图形分布',
                  subtext: '',
                  x:'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} :  {d}%"
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  data: ['免试人数','完成人数','未参加人数','已参加未完成人数']
              },
              series : [
                  {
                      name: '占比',
                      type: 'pie',
                      radius : '55%',
                      center: ['50%', '50%'],
                      data:[
                          {value:vm.testInfo.exemptCount, name:'免试人数'},  
                          {value:vm.passOver.overCount, name:'完成人数'},
                          {value:vm.testInfo.allCount-vm.testInfo.exemptCount-vm.passOver.beginCount, name:'未参加人数'},
                          {value:vm.passOver.beginCount-vm.passOver.overCount, name:'已参加未完成人数'}
                      ],
                      itemStyle: {
                          emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          },
                        //   normal:{
                        //     color:function(params) {
                        //     var colorList = [          
                        //            '#119670', '#f8c31d', '#ff9639', '#ff9639','#ff9639', '#b5c263', '#ed3c46'
                        //         ];
                        //         return colorList[params.dataIndex]
                        //       }
                        //   }
                      }
                  }
              ]
          };
          vm.myChart1.setOption(vm.option1)
        },  
        drawGenSLine2() {
          var vm = this;
          vm.myChart2 = this.$echarts.init(document.getElementById("myChart2"));
          vm.option2 = {
              title : {
                  text: '等级情况图形分布',
                  subtext: '',
                  x:'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {d}%"
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  data: ['优秀数','良好数','及格数','不及格数']
              },
              series : [
                  {
                      name: '占比',
                      type: 'pie',
                      radius : '55%',
                      center: ['50%', '50%'],
                      data:[
                          {value:vm.testInfo.excellentCount, name:'优秀数',itemStyle:{}},     
                          {value:vm.testInfo.wellCount, name:'良好数'},
                          {value:vm.testInfo.passCount, name:'及格数'},
                          {value:vm.testInfo.allCount-vm.testInfo.exemptCount-vm.passOver.overCount, name:'不及格数'}
                      ],
                      itemStyle: {
                          emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          },
                        //   normal:{
                        //     color:function(params) {
                        //     var colorList = [          
                        //             '#119670', '#f8c31d', '#ff9639', '#ff9639','#ff9639', '#b5c263', '#ed3c46'
                        //         ];
                        //         return colorList[params.dataIndex]
                        //       }
                        //   }
                      }
                  }
              ]
          };
          vm.myChart2.setOption(vm.option2)
        },  
        queryTeacherTestStudentCount(){
            // console.log("!11111")
          let vm = this;
          this.$axios.get('/v1/testdata/queryTeacherTestStudentCount?activityId='+this.activityId+'&gradeId='+(vm.grade==999?'':vm.grade)+'&studentClass='+(vm.studentClass==999?'':vm.studentClass)).then(res => {
              if (res.data.code == 10000) {
                vm.total = res.data.response;
                  vm.queryTeacherTestStudentList()
              }
          })
        },     
        queryTeacherTestStudentList(){
          var vm = this
          vm.loading = true
          this.$axios.get(`/v1/testdata/queryTeacherTestStudentList?activityId=${vm.activityId}&pageNum=${vm.pageNum}&pageSize=${vm.pageSize}`+'&gradeId='+(vm.grade==999?'':vm.grade)+'&studentClass='+(vm.studentClass==999?'':vm.studentClass)).then(res => {
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
        getStartYearList() {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      this.$axios.get("/v1/school/getStartYearList").then(res => {
        if (res.data.code == 10000) {
          //   console.log(res);
          let data = res.data.response;
          let all = {
            gradeId: 999,
            gradeName: "全部"
          };
          this.schoolGradeList.push(all);
          this.schoolGradeList = this.schoolGradeList.concat(data);

          // this.schoolName = data.name
        } else {
          if (res.data.code > 39999) {
            this.$Message.info(res.data.msg);
          }
        }
      });
    },
    }
    ,mounted(){
        this.schoolId=sessionStorage.getItem('schoolId');
        this.queryActivityTest();
        this.getStartYearList() ;
    }
    ,watch: {

    }   
};
</script>