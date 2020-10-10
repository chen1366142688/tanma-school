<style scoped>
  .width120{width:120px;}
</style>
<template>
  <div style="padding-left:10px;" class="student-info-manage">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">报送学生管理</h2>
    </div>
    <div>
      <Card>
        <div  class="top-search" @keydown.enter="querySearch">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span style="" >年级：</span>
                    <Select v-model="gradeCode" class="width120">
                        <Option v-for="item in gradeCodeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>班级：</span>
                    <Select v-model="classCode" class="width120">
                        <Option v-for="(item,index) in classCodeList" :value="item.classCode" :key="item.classCode">{{ item.className }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span >姓名：</span>
                    <Input v-model="studentName" placeholder="学生姓名" class="width120"/>
                </div>
                <div style="margin:5px 20px;">
                    <span>性别：</span>
                    <Select v-model="gender" class="width120">
                        <Option v-for="(item,index) in genderList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </div>
                <div style="margin:5px 20px;">
                    <span>状态：</span>
                    <Select v-model="studentStatus" class="width120">
                        <Option v-for="item in innerSchoolList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </div>
            </div>
            <div class="right-btns">
                <Button type="success"  @click="querySearch">查询</Button>
                <Button type="success"  @click="createReportStudentBySchool">按系统当前数据生成</Button>
                <Button type="success"  @click="importStudent">导入学籍数据</Button>
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
          <div>
            <Table max-height="520" border :loading="loading" :columns="resultColumns" :data="resultData"></Table>
          </div>
          <br>
          <div style="float: right;">
            <Page :total="total" :current="pageNo" :page-size="pageSize" @on-change='pageNoChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
          </div>
        </Row>
        </Card>
      </div>
      <Modal
              v-model="deleteModel"
              title="提  醒"
              @on-ok="delectOk">
        <p style="color: red;font-size: 18px">确认删除该学生？</p>
      </Modal>

      <Modal
              v-model="studentEditModel"
              title="学生信息编辑"
              width="400px"
              @on-cancel="cancel"
      >
        <Row style="margin-top: 10px;">
          <Col span="24">
            <span style="margin-left: 20px;">姓名:</span>
            <Input v-model="changeStudentName" placeholder="姓名" class="width120"/>
          </col>
          </Row>
          <Row style="margin-top: 10px;">
          <Col span="24">
            <span style="margin-left: 20px;">学籍号:</span>
            <Input v-model="changeRegisterCode" placeholder="学籍号" class="width120"/>
          </col>
          </Row>
          <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">性别:</span>
            <Select v-model="changeGender" class="width120">
              <Option v-for="(item,index) in genderListChange" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">出生日期:</span>
            <DatePicker v-model="changeBirthday" :clearable="false" :editable="false"  @on-change="sportStartTimeChange" format="yyyy-MM-dd" type="date" placeholder="出生日期" style="width: 120px"></DatePicker>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">民族编号:</span>
            <Select v-model="changeNationCode" class="width120">
              <Option v-for="(item,index) in nationList" :value="item.nationalityCode" :key="item.nationalityCode">{{ item.nationalityName }}</Option>
            </Select>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">年级编号:</span>
           <Select v-model="changeGradeCode" class="width120">
              <Option v-for="(item,index) in gradeCodeListChange" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
            </Select>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">班级编号:</span>
            <Select v-model="changeClassCode" class="width120">
              <Option v-for="(item,index) in classCodeListChange" :value="item.classCode" :key="item.classCode">{{ item.classCode }}</Option>
            </Select>
            </col>
        </Row>
        <div slot="footer">
            <Button type="text" size="large" @click="editOk">提交</Button>
          <Button type="text" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
      <Modal
              v-model="addModel"
              title="添加学生至学校"
              width="400px"
              @on-cancel="cancel"
      >
        <Row style="margin-top: 10px;">
          <Col span="24">
            <span style="margin-left: 20px;">姓名:</span>
            <Input :disabled="true" v-model="changeStudentName" placeholder="姓名" class="width120"/>
          </col>
          </Row>
          <Row style="margin-top: 10px;">
          <Col span="24">
            <span style="margin-left: 20px;">学籍号:</span>
            <Input :disabled="true" v-model="changeRegisterCode" placeholder="学籍号" class="width120"/>
          </col>
          </Row>
          <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">性别:</span>
            <Input :disabled="true" v-model="changeGender" placeholder="学籍号" class="width120"/>
            <!-- <Select v-model="changeGender" class="width120">
              <Option :disabled="true" v-for="(item,index) in genderListChange" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select> -->
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">出生日期:</span>
            <DatePicker :disabled="true" v-model="changeBirthday" :clearable="false"   @on-change="sportStartTimeChange" format="yyyy-MM-dd" type="date" placeholder="出生日期" style="width: 120px"></DatePicker>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">民族编号:</span>
            <Select :disabled="true" v-model="changeNationCode" class="width120">
              <Option :disabled="true" v-for="(item,index) in nationList" :value="item.nationalityCode" :key="item.nationalityCode">{{ item.nationalityName }}</Option>
            </Select>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">年级:</span>
           <Select v-model="changeGradeId" class="width120">
              <Option v-for="(item,index) in gradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
            </Select>
            </col>
        </Row>
        <Row style="margin-top: 10px;">
            <Col span="24">
            <span style="margin-left: 20px;">班级:</span>
            <Select v-model="changeStudentClass" class="width120">
              <Option v-for="(item,index) in classList" :value="item.classId" :key="item.classId">{{ item.studentClassName }}</Option>
            </Select>
            </col>
        </Row>
        <div slot="footer">
            <Button type="text" size="large" @click="addOk">提交</Button>
          <Button type="text" size="large" @click="cancel">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'schoolList',
  data() {
    return {
        deleteModel:false,
        studentEditModel:false,
        addModel:false,
        studentInfo:{},
        changeStudentName:'',
        changeRegisterCode:'',
        changeGender:'',
        changeBirthday:'',
        changeNationCode:'',
        changeGradeCode:'',
        changeClassCode:'',
        changeGradeId:'',
        changeStudentClass:'',
      loading:false,
      schoolId: '',
      schoolType: '',
      gradeCode: '',
      gradeCodeList:[],
      gradeCodeListChange:[],
       primaryList: [
        {
          grade: '999',
          label: '全部'
        },
        {
          grade: '11',
          label: '一年级'
        },
        {
          grade: '12',
          label: '二年级'
        },
        {
          grade: '13',
          label:'三年级'
        },
        {
          grade: '14',
          label: '四年级'
        },
        {
          grade: '15',
          label: '五年级'
        },
        {
          grade: '16',
          label: '六年级'
        }
      ],
      middleList: [
        {
          grade: "999",
          label: '全部'
        },
        {
          grade: '21',
          label: '七年级'
        },
        {
          grade: '22',
          label: '八年级'
        },
        {
          grade: '23',
          label: '九年级'
        }
      ],
      primaryListChange: [
        {
          grade: '11',
          label: '11'
        },
        {
          grade: '12',
          label: '12'
        },
        {
          grade: '13',
          label:'13'
        },
        {
          grade: '14',
          label: '14'
        },
        {
          grade: '15',
          label: '15'
        },
        {
          grade: '16',
          label: '16'
        }
      ],
      middleListChange: [
        {
          grade: '21',
          label: '21'
        },
        {
          grade: '22',
          label: '22'
        },
        {
          grade: '23',
          label: '23'
        }
      ],
      classCode: '',
      classCodeList:[],
      classCodeListChange:[],
      studentName: '',
      gender:'',
      genderList:[
          {
              name:'全部',
              value:'999'
          },
          {
              name:'男',
              value:'1'
          },
          {
              name:'女',
              value:'2'
          },
      ],
      genderListChange:[

          {
              name:'男',
              value:'1'
          },
          {
              name:'女',
              value:'2'
          },
      ],
      studentStatus:'',
      innerSchoolList:[
          {
              name:'全部',
              value:'999'
          },
          {
              name:'在校',
              value:'1'
          },
          {
              name:'不在校',
              value:'2'
          },
      ],
      resultColumns: [],
      normal: [
        {
          title: '学生姓名',
          key: 'studentName',
          align: 'center',
          minWidth:100
        },
        {
          title: '学籍号',
          key: 'registerCode',
          align: 'center',
          minWidth:100
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let text = row.gender == '1'?"男":row.gender == '2'?"女":row.gender;
            return h('div', text)
          }
        },
        {
          title: '出生日期',
          key: 'birthday',
          align: 'center',
          minWidth:100
        },
        {
          title: '民族编号',
          key: 'nationCode',
          align: 'center',
          minWidth:100
        },
        {
          title: '年级编号',
          key: 'gradeCode',
          align: 'center',
          minWidth:100
        },
        {
          title: '班级编号',
          key: 'classCode',
          align: 'center',
          minWidth:100,
        },
        {
          title: '班级名称',
          key: 'className',
          align: 'center',
          minWidth:100,
        },
        {
          title: '状态',
          key: 'innerSchool',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let text = "";
            if(row.innerSchool == '1'){
                text = "在校";
            }else {
                text = "不在校";
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 350,
          render: (h, params) => {
              const row = params.row;
            return h('div', row.innerSchool == '1'?[
              h(
                'Button',
                {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      this.editStudent(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                      'Button',
                      {
                        props: {
                          type: 'success'
                        },
                        style: {
                          marginLeft: '10px'
                        },
                        on: {
                          click: () => {
                              this.deleteStudent(params.row)
                          }
                        }
                      },
                      '删除'
              ),
            ]:[
                h(
                      'Button',
                      {
                        props: {
                          type: 'success'
                        },
                        style: {
                          marginLeft: '10px'
                        },
                        on: {
                          click: () => {
                               this.addStudent(params.row)
                          }
                        }
                      },
                      '添加到学校'
              ),
            ]

            )
          }
        }
      ],
      resultData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      primaryGradeList: [
        {
          grade: 1,
          label: "一年级"
        },
        {
          grade: 2,
          label: "二年级"
        },
        {
          grade: 3,
          label: "三年级"
        },
        {
          grade: 4,
          label: "四年级"
        },
        {
          grade: 5,
          label: "五年级"
        },
        {
          grade: 6,
          label: "六年级"
        }
      ],
      middleGradeList: [
        {
          grade: 7,
          label: "七年级"
        },
        {
          grade: 8,
          label: "八年级"
        },
        {
          grade: 9,
          label: "九年级"
        }
      ],
      gradeId:'',
      gradeList:[],
        nationList:[],
        classList:[]
    }
  },
  methods: {
      editStudent(student){
        var vm=this;
        vm.studentInfo=student;
        console.log(student)
        vm.changeStudentName=student.studentName;
        vm.changeRegisterCode=student.registerCode;
        vm.changeGender=student.gender;
        vm.changeBirthday=student.birthday;
        vm.changeNationCode=student.nationCode;
        vm.changeGradeCode=student.gradeCode;
        vm.changeClassCode=student.classCode;
        vm.studentEditModel=true
    },
    deleteStudent(student) {
      var vm = this
      vm.studentInfo=student;
      vm.deleteModel=true;
    },
    addStudent(student){
        var vm=this;
        vm.studentInfo=student;
        vm.changeStudentName=student.studentName;
        vm.changeRegisterCode=student.registerCode;
        vm.changeGender=student.gender;
        vm.changeBirthday=student.birthday;
        vm.changeNationCode=student.nationCode;
        vm.changeGradeCode=student.gradeCode;
        vm.changeClassCode=student.classCode;
        vm.addModel=true
    },
    cancel () {
        var vm=this;
        vm.deleteModel=false;
        vm.studentEditModel=false;
        vm.addModel=false;
    },
    ok(){
      this.deleteStudent(this.nowStudentId);
    },
    delectOk(){
        var vm=this;
        vm.deleteStudentFunction();
    },
    editOk(){
        var vm=this;
        vm.updateReportStudentInfo()
    },
    addOk(){
        var vm=this;
        let student=vm.studentInfo;
        vm.changeStudentName=student.studentName;
        vm.changeRegisterCode=student.registerCode;
        vm.changeGender=student.gender;
        vm.changeBirthday=student.birthday;
        vm.changeNationCode=student.nationCode;
        vm.updateStudentInfo();
    },
    sportStartTimeChange(date,type){
      var vm=this;
        vm.changeBirthday=date
    },
    getReportStudentList(){
      var vm = this
      vm.loading=true;
      sessionStorage.setItem('reportStudentManage-studentName',vm.studentName);
      sessionStorage.setItem('reportStudentManage-gradeCode',vm.gradeCode);
      sessionStorage.setItem('reportStudentManage-gender',vm.gender);
      sessionStorage.setItem('reportStudentManage-classCode',vm.classCode);
      sessionStorage.setItem('reportStudentManage-studentStatus',vm.studentStatus);
      sessionStorage.setItem('reportStudentManage-pageNo',vm.pageNo);
      sessionStorage.setItem('reportStudentManage-pageSize',vm.pageSize);
      this.$axios
              .get('/v1/dataReport/getReportStudentList?schoolId=1&studentName='+vm.studentName+'&gradeCode='+(vm.gradeCode=='999'?'':vm.gradeCode)+
              '&gender='+(vm.gender=='999'?'':vm.gender)+'&classCode='+(vm.classCode=='999'?'':vm.classCode)+
              '&studentStatus='+(vm.studentStatus=='999'?'':vm.studentStatus)+'&pageNo='+vm.pageNo+'&pageSize=' + vm.pageSize)
              .then(res => {
                  vm.loading=false;
                if (res.data.code == 10000) {
                  this.resultData = res.data.response
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    countReportStudentList(){
      var vm = this
      this.$axios
              .get('/v1/dataReport/countReportStudentList?schoolId=1&studentName='+vm.studentName+'&gradeCode='+(vm.gradeCode=='999'?'':vm.gradeCode)+
              '&gender='+(vm.gender=='999'?'':vm.gender)+'&classCode='+(vm.classCode=='999'?'':vm.classCode)+
              '&studentStatus='+(vm.studentStatus=='999'?'':vm.studentStatus))
              .then(res => {
                if (res.data.code == 10000) {
                  this.total = res.data.response
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    getReportStudentClassCodeList(gradeCode,type){
      var vm = this
      this.$axios
              .get('/v1/dataReport/getReportStudentClassCodeList?schoolId=1&gradeCode='+gradeCode)
              .then(res => {
                  this.classCodeList=[]
                if (res.data.code == 10000) {
                    let data= res.data.response;
                    if(type=="1"){
                        let all= {
                             classCode:'999',
                             className:'全部',
                            };
                           this.classCodeList.push(all);
                           for(let i=0;i<data.length;i++){
                             data[i].className=Number(data[i].classCode.substring(data[i].classCode.length-2,data[i].classCode.length))+"班"
                           }
                        this.classCodeList =this.classCodeList.concat(data)
                        this.classCode="999"
                    }else{
                        this.classCodeListChange =data
                    }

                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    getGradeClassSingleInfo(gradeId) {
      var vm = this;
      this.$axios
        .get("/v1/exercisecombo/getGradeClassSingleInfo?gradeId=" + gradeId)
        .then(function(response) {
          vm.classList=[];
          let data = response.data.response;
          vm.classList=data
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getNationList() {
      var vm = this;
      this.$axios
        .get("/v1/common/getNationList")
        .then(function(response) {
          let data = response.data.response;
          vm.nationList=data
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
          "y+": date.getFullYear().toString(),        // 年
          "M+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
      };
      return fmt;
    },
    updateReportStudentInfo(){
      var vm = this
      console.log(vm.changeBirthday)
      console.log(typeof vm.changeBirthday)
      let data={
        "birthday":typeof vm.changeBirthday=="string"?vm.changeBirthday.replace("-","/"): vm.dateFormat("yyyy/MM/dd",vm.changeBirthday),
        "classCode": vm.changeClassCode,
        "gender": vm.changeGender,
        "gradeCode": vm.changeGradeCode,
        "nationCode": vm.changeNationCode,
        "registerCode": vm.changeRegisterCode,
        "reportStudentId": vm.studentInfo.reportStudentId,
        "studentId": vm.studentInfo.studentId,
        "studentName": vm.changeStudentName,
        }
        console.log(data)
        // return
      this.$axios.post('/v1/dataReport/updateReportStudentInfo',data)
              .then(res => {
                if (res.data.code == 10000) {
                  vm.$Message.info(res.data.msg)
                  vm.studentEditModel=false;
                  vm.search()
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    deleteStudentFunction(){
      var vm = this
      this.$axios
              .get('/v1/dataReport/deleteStudent?reportStudentId='+vm.studentInfo.reportStudentId)
              .then(res => {
                if (res.data.code == 10000) {
                  vm.$Message.info(res.data.msg)
                  vm.deleteModel=false;
                  vm.search()
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    updateStudentInfo() {
      var vm = this;
      if (
        !vm.changeStudentName ||
        vm.changeStudentName == null ||
        vm.changeStudentName == "" ||
        vm.changeStudentName.trim() == ""
      ) {
        vm.$Message.info("学生姓名不能为空！");
        return false;
      }
      if (
        !vm.changeRegisterCode ||
        vm.changeRegisterCode == null ||
        vm.changeRegisterCode == "" ||
        vm.changeRegisterCode.trim() == ""
      ) {
        vm.$Message.info("学生学籍号不能为空！");
        return false;
      }

      if (vm.changeGender == null || vm.changeGender == "") {
        vm.$Message.info("请选择性别！");
        return false;
      }
      if (vm.changeGradeId == null || vm.changeGradeId == "") {
        vm.$Message.info("请选择年级！");
        return false;
      }
      if (vm.changeStudentClass == null || vm.changeStudentClass == "") {
        vm.$Message.info("请选择班级！");
        return false;
      }
      vm.changeStudentName = vm.changeStudentName.trim();
      vm.changeRegisterCode = vm.changeRegisterCode.trim();
      let data = {
        auditStatus: "1",
        birthday: vm.changeBirthday,
        classId: vm.changeStudentClass,
        gender: vm.changeGender,
        grade: vm.changeGradeId,
        nationCode: vm.changeNationCode,
        registerCode: vm.changeRegisterCode,
        studentName: vm.changeStudentName,
        transferSchoolStatus: "0"
      };
      this.$axios.get(`/v1/subjectReport/querySchoolReportedStatus?dataType=2`).then(res => {
        if (res.data.code === 10000) {
          let {editStatus} = res.data.response
          if (editStatus === '1') { // 可编辑
            this.$axios.post("/v1/studentinfo/updateStudentInfo", data).then(function(res) {
                if (res.data.code == 10000) {
                  if (res.data.response.code == 1) {
                    vm.$Message.info(res.data.response.msg);
                    vm.addModel=false;
                    vm.search();
                  } else {
                    vm.$Message.info(res.data.response.msg);
                  }
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg);
                  }
                }
              })
              .catch(function(response) {
                console.log(response);
              });
          } else { // 不可编辑
            this.$Modal.info({
              title: '提醒',
              okText: '知道了',
              closable: false,
              content: '<p>数据已报送给教育局，无法编辑数据，若需编辑，请联系学校管理员，申请编辑权限</p>',
            });
            return false
          }
        }
      })
    },
    querySearch(){
      this.pageNo = 1;
      this.pageNo = 1
      this.search();
    },
    search() {
      var vm = this
      vm.getReportStudentList()
      vm.countReportStudentList()
    },
    createReportStudentBySchool(){
        var vm = this
      this.$axios
              .get('/v1/dataReport/createReportStudentBySchool?schoolId=1&yearSemester='+sessionStorage.getItem('yearSemester')+'&wasNow=0')
              .then(res => {
                if (res.data.code == 10000) {
                   vm.$Message.info(res.data.msg)
                   vm.search()
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    importStudent() {
      var vm = this
      sessionStorage.setItem('studentSubjectHisReportDetail-importStudentInfo-yearSemester',sessionStorage.getItem('yearSemester'))
      sessionStorage.setItem('schoolTestDetail-importStudentInfo-taskType',"3")
      console.log(sessionStorage.getItem('yearSemester'))
      this.$router.push({ name: 'importStudentInfo' })
    },

    pageNoChange(value) {
      //页码改变方法处理
      if (this.pageNo != value) {
        this.pageNo = value
        this.search()
      }
    },
    pageSizechange(value) {
      //页面大小改变方法处理
      if (this.pageSize != value) {
        this.pageSize = value
        this.pageNo = 1;
        this.search()
      }
    },
  },
  watch: {
   gradeCode:function(){
       var vm=this;
      //  vm.classCode='全部';
       if(vm.gradeCode && vm.gradeCode != '999'){

           vm.getReportStudentClassCodeList(vm.gradeCode,"1")
       }else{
           let   data=[
                            {
                             classCode:'999',
                             className:'全部',
                            }
                        ]
                  this.classCodeList =data;
                  this.classCode="999";
                  console.log(this.classCodeList)
       }
   },
   changeGradeCode:function(){
       var vm=this;
    //    vm.changeClassCode='';
       vm.getReportStudentClassCodeList(vm.changeGradeCode,"2")
   },
   changeGradeId:function(){
       var vm=this;
       vm.getGradeClassSingleInfo(vm.changeGradeId);
   }
  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
  //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this
    let schoolId = sessionStorage.getItem('schoolId')
    vm.schoolId = schoolId
    let schoolType = sessionStorage.getItem('schoolType')
    vm.schoolType=schoolType;
    if (schoolType) {
      vm.resultColumns = vm.normal
      if ('0' == schoolType) {
        vm.gradeCodeList = vm.gradeCodeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
      }
      if ('2' == schoolType) {
          vm.gradeList = vm.gradeList.concat(vm.primaryGradeList)
        vm.gradeCodeList = vm.gradeCodeList.concat(vm.primaryList)
        vm.gradeCodeListChange = vm.gradeCodeListChange.concat(vm.primaryListChange)
      }
      if ('3' == schoolType) {
          vm.gradeList = vm.gradeList.concat(vm.middleGradeList)
        vm.gradeCodeList = vm.gradeCodeList.concat(vm.middleList)
        vm.gradeCodeListChange = vm.gradeCodeListChange.concat(vm.middleListChange)
      }
    } else {
      vm.resultColumns = vm.normal
      vm.schoolGradeList = vm.schoolGradeList
        .concat(vm.primaryList)
        .concat(vm.middleList)
        .concat(vm.highList)
        .concat(vm.collegeList)
    }

    let studentName=sessionStorage.getItem('reportStudentManage-studentName');
    let gradeCode=  sessionStorage.getItem('reportStudentManage-gradeCode');
    let gender=  sessionStorage.getItem('reportStudentManage-gender');
    let classCode=  sessionStorage.getItem('reportStudentManage-classCode');
    let studentStatus=  sessionStorage.getItem('reportStudentManage-studentStatus');
    let pageNo=  sessionStorage.getItem('reportStudentManage-pageNo');
    let pageSize=  sessionStorage.getItem('reportStudentManage-pageSize');


    if(studentName != null && studentName != undefined && studentName != "" ){
        vm.studentName = studentName;
    }
    if(gradeCode != null && gradeCode != undefined && gradeCode != "" ){
        vm.gradeCode = gradeCode;
    }else{
        vm.gradeCode='999'

    }
    if(gender != null && gender != undefined && gender != "" ){
        vm.gender = gender;
    }else{
        vm.gender='999'
    }
    if(classCode != null && classCode != undefined && classCode != "" ){
        vm.classCode = classCode;
    }else{
        vm.classCode='999'
    }
    if(studentStatus != null && studentStatus != undefined && studentStatus != "" ){
        vm.studentStatus = studentStatus;
    }else{
        vm.studentStatus='999'
    }
      if(pageNo != null && pageNo != undefined && pageNo > 0){
        vm.pageNo = Number(pageNo);;
      }
       if(pageSize != null && pageSize != undefined && pageSize > 0){
        vm.pageSize = Number(pageSize);;
      }

    vm.search()
    vm.getNationList();
  }
}
</script>
