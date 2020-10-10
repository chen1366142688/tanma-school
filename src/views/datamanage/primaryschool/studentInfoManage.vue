<style scoped>
  .mar-l40{margin-left:40px;}
  .mar-l20{margin-left:20px;}
  .width120{width:120px;}
  @media screen and (max-width: 1650px) {
    .mar-l40{margin-left:15px;}
    .mar-l20{margin-left:10px;}
    .width120{width:100px;}
  }

</style>
<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">学生管理</h2>
    </div>
    <div>
      <Card>
        <div class="top-search" @keydown.enter="querySearch">
          <div class="left-input">
            <div style="margin:5px 20px;">
              <span>年级：</span>
              <Select v-model="grade" class="width120">
                <Option v-for="item in schoolGradeList" :value="item.grade" :key="item.grade">{{ item.label }}</Option>
              </Select>
            </div>
            <div  style="margin:5px 20px;">
              <span>班级：</span>
              <Select v-model="studentClass" class="width120">
                <Option v-for="(item,index) in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div  style="margin:5px 20px;">
              <span>姓名：</span>
              <Input v-model="studentName" placeholder="学生姓名" class="width120"/>
            </div>
            <div  style="margin:5px 20px;">
              <span>学籍号：</span>
              <Input v-model="registerCode" placeholder="学生学籍号" class="width120"/>
            </div>
            <div  style="margin:5px 20px;">
              <span>状态：</span>
              <Select v-model="transferStatus" class="width120">
                <Option v-for="item in transferList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            </div>
          </div>
          <div class="right-btns">
            <Button type="success"  @click="querySearch">查询</Button>
            <Button type="success" @click="restore">重置查询条件</Button>
            <Button type="success" @click="addStudent">新增学生</Button>
            <Button type="success" @click="inputStudent">学生信息导入</Button>
            <Button type="success" @click="goBack">返回</Button>
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
            <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change='pageNumChange' @on-page-size-change='pageSizechange' show-total show-sizer></Page>
          </div>
        </Row>
        </Card>
      </div>
      <Modal
              v-model="modal1"
              title="提  醒"
              @on-ok="ok">
        <p style="color: red;font-size: 18px">删除学生后，学生的所有数据都将清空，是否确认删除？</p>

      </Modal>
      <Modal
              v-model="modal3"
              title="提  醒"
            >
        <p style="color: red;font-size: 18px">该家长已经存在，姓名为{{oldName}}，是否更改姓名为{{patriarchNew.nickName}}？</p>
        <div slot="footer">
          <Button type="success" size="large" @click="changeName">更改</Button>
          <Button type="success" size="large" @click="notChangeName">延用原姓名</Button>
        </div>
      </Modal>
      <Modal
              v-model="modal4"
              title="提  醒"
              @on-ok="ok">
        <p style="color: red;font-size: 18px">是否确定删除该家长和学生的绑定关系？</p>
        <div slot="footer">
          <Button type="success" size="large" @click="modal4Fb">确定</Button>
          <Button type="success" size="large" @click="modal4FbN">取消</Button>
        </div>
      </Modal>
      <Modal
              v-model="modal2"
              title="家长信息"
              width="800px"
              @on-cancel="cancel"
      >
        <Row v-for="(item,index) in patriarchList" style="margin-top: 10px;">
          <Col span="6">
            <span style="margin-left: 10px;">家长姓名:</span>
            <Label style="margin-left: 5px;">{{item.nickName}}</Label>
<!--            <Input-->
<!--              v-model="item.nickName"-->
<!--               :maxlength="5"-->
<!--               placeholder="请输入姓名"-->
<!--               style="width: 100px"-->
<!--                />-->
          </col>
          <Col span="6">
            <span style="margin-left: 0px;">家长身份:</span>
            <Label style="margin-left: 5px;">{{item.relation}}</Label>
          </col>
            <Col span="7">
            <span style="margin-left: 0px;">电话号码:</span>
            <Label style="margin-left: 5px;">{{item.phoneNum}}</Label>
            </col>
              <Col span="3">
            <Button
                    v-on:click="delPatriarch(index)"
                    type="success"

                    style="background-color:#00c693;margin-left: 15px;"
            >删除</Button>
              </col>
        </Row>
        <Row v-if="addparentStates"  style="margin-top: 10px;">
          <Col span="6">
            <span style="margin-left: 10px;">家长姓名:</span>
             <Input v-model="patriarchNew.nickName" :maxlength="5" placeholder="请输入姓名" style="width: 100px" />
          </col>
          <Col span="6">
            <span style="margin-left: 0px;">家长身份:</span>
            <Select v-model="patriarchNew.relation" class="width120">
              <Option v-for="(item,index) in relationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </col>
          <Col span="7">
            <span style="margin-left: 0px;">电话号码:</span>
            <Input v-model="patriarchNew.phoneNum"  placeholder="请输入电话号码" style="width: 150px" />
          </col>
          <Col span="3">
            <Button
                    v-on:click="savePatriarch('')"
                    type="success"

                    style="background-color:#00c693;margin-left: 15px;"
            >保存</Button>
          </col>
        </Row>
        <Row style=";margin-top: 25px">
          <span v-if="patriarchList.length==0" style="margin-left:10px;margin-top: 25px">暂无家长数据</span>
          <Button
                  v-on:click="addParent()"
                  type="success"
                  style="background-color:#00c693;margin-left: 15px;"
          >新增家长</Button>
        </Row>
        <div slot="footer">
          <Button type="text" size="large" @click="submitFP">取消</Button>
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
      nowIndex: '',
      modal3: false,
      modal4: false,
      oldName: '',
      patriarchNew: {
        nickName: '',
        relation: '',
        phoneNum: ''
      },
      relationList: [
        {
          value: '02',
          label: '母亲'
        },
        {
          value: '03',
          label: '父亲'
        },
        {
          value: '04',
          label: '祖父'
        },
        {
          value: '05',
          label: '祖母'
        },
        {
          value: '06',
          label: '外祖父'
        },
        {
          value: '07',
          label: '外祖母'
        }
      ],
      addparentStates: false,
      patriarchList: [],
      modal2: false,
      loading:false,
      updateUrl: '',
      schoolId: '',
      schoolType: '',
      grade: '',
      primaryList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 1,
          label: '一年级'
        },
        {
          grade: 2,
          label: '二年级'
        },
        {
          grade: 3,
          label: '三年级'
        },
        {
          grade: 4,
          label: '四年级'
        },
        {
          grade: 5,
          label: '五年级'
        },
        {
          grade: 6,
          label: '六年级'
        }
      ],
      middleList: [
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
      highList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 10,
          label: '高一'
        },
        {
          grade: 11,
          label: '高二'
        },
        {
          grade: 12,
          label: '高三'
        }
      ],
      collegeList: [
        {
          grade: "",
          label: '全部'
        },
        {
          grade: 13,
          label: '大一'
        },
        {
          grade: 14,
          label: '大二'
        },
        {
          grade: 15,
          label: '大三'
        },
        {
          grade: 16,
          label: '大四'
        }
      ],
      transferStatus:"",
      transferList:[
        {
          name:"全部",
          value:""
        },
        {
          name:"正常",
          value:"0"
        },
        // {
        //   name:"已转学",
        //   value:"1"
        // },
        // {
        //   name:"非学籍",
        //   value:"2"
        // },
        {
          name:"已停用",
          value:"3"
        },
      ],
      schoolGradeList: [],
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
            const row = params.row
            // const color = row.exemptId != null ? 'green' : 'red'
            const text = row.gender == '1' ? '男' : '女'
            return h('div', text)
          }
        },
        {
          title: '年级',
          key: 'gradeName',
          align: 'center',
          minWidth:100
        },
        {
          title: '班级',
          key: 'studentClass',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row
            // const color = row.exemptId != null ? 'green' : 'red'
            const text = row.studentClass +'班'
            return h('div', text)
          }
        },
        {
          title: '状态',
          key: 'studentClass',
          align: 'center',
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            let text = "正常";
            if(row.transferSchoolStatus == '1'){
                text = "已转学";
            }else if(row.transferSchoolStatus == '2'){
                text = "非学籍";
            }else if(row.transferSchoolStatus == '3'){
                text = "已停用";
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
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
                      this.toDetail(params.row.studentId)
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
                            this.modal1 = true;
                            this.nowStudentId = params.row.studentId;
                          }
                        }
                      },
                      '删除'
              ),
              // h(
              //         'Button',
              //         {
              //           props: {
              //             type: 'success'
              //           },
              //           style: {
              //             marginLeft: '10px'
              //           },
              //           on: {
              //             click: () => {
              //               this.modal2 = true;
              //               this.nowStudentId = params.row.studentId;
              //               this.getChildAndParentInfo();
              //             }
              //           }
              //         },
              //         '家长信息'
              // )
            ])
          }
        }
      ],
      collegeColumns: [
        {
          title: '学生姓名',
          key: 'studentName',
          align: 'center'
          //   minWidth: 250
        },
        {
          title: '学籍号',
          key: 'registerCode',
          align: 'center'
          //   width: 150
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            // const color = row.exemptId != null ? 'green' : 'red'
            const text = row.gender == '1' ? '男' : '女'
            return h('div', text)
          }
        },
        {
          title: '学院',
          key: 'collegeName',
          align: 'center'
          //   width: 150
        },
        {
          title: '专业',
          key: 'majorName',
          align: 'center'
          //   width: 150
        },
        {
          title: '学级',
          key: 'startSchool',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.startSchool+'级'
            return h('div', text)
          }
        },
        {
          title: '班级',
          key: 'studentClass',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.studentClass+'班'
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          //   width: 400,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.toDetail(params.row.studentId)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      resultData: [],
      isCollege: false,
      college: '',
      collegesList: [],
      major: '',
      majorList: [],
      chooseCollege:true,
      collegeName:'',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      nowStudentId: '',
      modal1: false,
      parentStatus: ''
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    cancel () {
      this.addparentStates = false;
    },
    modal4Fb(){
      var vm = this
      this.$axios
              .get('/v1/studentinfo/deleteChildAndParentInfo?patriarchChildrenId=' + this.patriarchList[vm.nowIndex].patriarchChildrenId)
              .then(res => {
                if (res.data.code == 10000) {
                  this.modal4 = false;
                  this.getChildAndParentInfo();
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    modal4FbN(){
      this.modal4 = false
    },
    delPatriarch(index){
      this.nowIndex = index;
      this.modal4 = true;
    },
    changeName(){
      this.savePatriarch('1');
    },
    notChangeName(){
      this.savePatriarch('2');

    },
    savePatriarch(parentStatus){
      var vm = this
      if(!vm.patriarchNew.nickName){
        vm.$Message.info("请输入家长姓名！")
        return;
      }
       if(!vm.patriarchNew.relation){
        vm.$Message.info("请选择家长身份")
        return;
      }
      if(!vm.patriarchNew.phoneNum){
        vm.$Message.info("请输入家长电话！")
        return;
      }

      let data = {
        schoolId: vm.schoolId,
        studentId: vm.nowStudentId,
        nickName: vm.patriarchNew.nickName,
        relation: vm.patriarchNew.relation,
        phoneNum: vm.patriarchNew.phoneNum,
        parentStatus: parentStatus
      }

      this.$axios.post('/v1/studentinfo/saveChildAndParentInfo', data).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          if(res.data.response.code == '50003'){
            vm.oldName = res.data.response.msg;
            vm.modal3 = true;
          }else {
            vm.patriarchNew = {};
            this.addparentStates = false
            this.getChildAndParentInfo();
            vm.modal3 = false;
          }

        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    submitFP(){
      this.modal2 = false;
      this.addparentStates = false;
    },
    addParent(){
      this.addparentStates = true;
    },
    getChildAndParentInfo(){
      var vm = this
      this.$axios
              .get('/v1/studentinfo/getChildAndParentInfo?studentId=' + this.nowStudentId)
              .then(res => {
                if (res.data.code == 10000) {
                  this.patriarchList = res.data.response
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    ok(){
      this.deleteStudent(this.nowStudentId);
    },
    getStudentInfoList(schoolId) {
      var vm = this
      vm.loading=true;
      let data = {
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        registerCode: vm.registerCode,
        schoolId: schoolId,
        studentClass: vm.studentClass,
        studentName: vm.studentName,
        collegeCode: vm.college,
        majorCode: vm.major,
        transferSchoolStatus:vm.transferStatus,
      }


      sessionStorage.setItem('studentInfoManage-getStudentInfoList-pageNum',vm.pageNum);
      sessionStorage.setItem('studentInfoManage-getStudentInfoList-pageSize',vm.pageSize);
      sessionStorage.setItem('studentInfoManage-getStudentInfoList-grade',vm.grade);
      sessionStorage.setItem('studentInfoManage-getStudentInfoList-studentClass',vm.studentClass);
      sessionStorage.setItem('studentInfoManage-getStudentInfoList-studentName',vm.studentName);
      sessionStorage.setItem('studentInfoManage-getStudentInfoList-registerCode',vm.registerCode);
      sessionStorage.setItem('studentInfoManage-getStudentInfoList-transferStatus',vm.transferStatus);

      this.$axios.post('/v1/studentinfo/getStudentInfoList', data).then(res => {
        vm.loading=false;
        if (res.data.code == 10000) {
          vm.resultData = res.data.response
        } else {
          if (res.data.code > 39999) {
          vm.$Message.info(res.data.msg)
          }
        }
      })
    },
    inputStudent(){
      var vm=this;
      sessionStorage.setItem('studentInfoManage-exportTaskManage-taskType',"1")
      this.$router.push({ name: 'exportTaskManage' })
    },
    inputStudentTest(){
       var vm=this;
      sessionStorage.setItem('studentInfoManage-exportTaskManage-taskType',"2")
      this.$router.push({ name: 'exportTaskManage' })
    },
    querySearch(){
      this.pageNum = 1;
      this.pageNo = 1
      this.search();
    },
    search() {
      var vm = this
      let schoolId = vm.schoolId
      vm.getStudentInfoList(schoolId)
      vm.countStudentList(schoolId)
    },
    restore() {
      var vm = this
      vm.grade = ''
      vm.pageNo = 1
      vm.pageSize = 10
      vm.registerCode = ''
      vm.studentClass = ''
      vm.studentName = ''
      vm.college = ''
      vm.major = ''

      let schoolId = vm.schoolId
      vm.getStudentInfoList(schoolId)
      vm.countStudentList(schoolId)
    },

    countStudentList(schoolId) {
      var vm = this
      let data = {
        grade: vm.grade,
        pageNo: vm.pageNum,
        pageSize: vm.pageSize,
        registerCode: vm.registerCode,
        schoolId: schoolId,
        studentClass: vm.studentClass,
        studentName: vm.studentName,
        collegeCode: vm.college,
        majorCode: vm.major,
        transferSchoolStatus:vm.transferStatus,
      }
      this.$axios.post('/v1/studentinfo/countStudentList', data).then(res => {
        if (res.data.code == 10000) {
          this.total = res.data.response
        } else {
          if (res.data.code > 39999) {
          this.$Message.info(res.data.msg)
          }
        }
      })
    },
    toDetail(studentId) {
      var vm = this
      sessionStorage.setItem(
        'studentInfoManage-studentInfoDetail-studentId',
        studentId
      )
      this.$router.push({ name: 'studentInfoDetail'})
    },
    deleteStudent() {
      var vm = this
      this.$axios
              .get('/v1/studentinfo/deleteStudentByStudentId?studentId=' + this.nowStudentId)
              .then(res => {
                if (res.data.code == 10000) {
                  vm.$Message.info(res.data.msg);
                  vm.querySearch();
                } else {
                  if (res.data.code > 39999) {
                    vm.$Message.info(res.data.msg)
                  }
                }
              })
    },
    addStudent(){
      var vm = this
      sessionStorage.removeItem('studentInfoManage-studentInfoDetail-studentId')
      this.$router.push({ name: 'studentInfoDetail' })
    },
    examInfo(studentId){
      var vm = this
      sessionStorage.setItem(
        'studentInfoManage-studentExamInfo-studentId',
        studentId
      )
      this.$router.push({ name: 'studentExamInfo' })
    },
    getSchoolData(schoolId) {
      //编辑时获取场馆数据
      // this.pageTitle = '学校编辑'
      this.$axios
        .get('/v1/school/getSchoolDetail?schoolId=' + schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            console.log(res)
            let data = res.data.response
            this.schoolData = data
            this.schoolName = data.name
          } else {
            if (res.data.code > 39999) {
            this.$Message.info(res.data.msg)
            }
          }
        })
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

    getSchoolCollegeBySchoolId(schoolId) {
      var vm = this
      this.$axios
        .get('/v1/student/getSchoolCollegeBySchoolId?schoolId=' + schoolId)
        .then(res => {
          if (res.data.code == 10000) {
            vm.collegesList = res.data.response
          } else {
            if (res.data.code > 39999) {
                vm.$Message.info(res.data.msg)
            }
          }
        })
    },
    getSchoolMajorBySchoolId(schoolId, collegeCode) {
      var vm = this
      this.$axios
        .get(
          '/v1/student/getSchoolMajorBySchoolId?schoolId=' +
            schoolId +
            '&collegeCode=' +
            collegeCode
        )
        .then(res => {
          if (res.data.code == 10000) {
            vm.majorList = res.data.response
          } else {
            if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg)
            }
          }
        })
    },


  },
  watch: {
    college: function() {
      var vm = this
      vm.getSchoolMajorBySchoolId(vm.schoolId, vm.college)
    },
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
    // vm.updateUrl =this.$axios.defaults.baseURL + '/v1/file/upload?type=excel';
    if (schoolType) {
      vm.resultColumns = vm.normal
      if ('0' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList
          .concat(vm.primaryList)
          .concat(vm.middleList)
          .concat(vm.highList)
          .concat(vm.collegeList)
      }
      // if("1"==schoolType){
      //     vm.schoolGradeList=vm.schoolGradeList.concat(vm.primaryList).concat(vm.middleList).concat(vm.highList).concat(vm.collegeList);
      // }
      if ('2' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList)
      }
      if ('3' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList)
      }
      if ('4' == schoolType) {
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList)
      }
      if ('5' == schoolType) {
        vm.isCollege = true
        vm.resultColumns = vm.collegeColumns
        var date=new Date;
          var year=date.getFullYear();
          var month=date.getMonth()+1;
          // month =(month<10 ? "0"+month:month);
          // var mydate = (year.toString()+month.toString());
          vm.collegeList=[
             {
          grade: 13,
          label: (month>9?year:year-1)+'级'
        },
        {
          grade: 14,
          label: (month>9?year-1:year-2)+'级'
        },
        {
          grade: 15,
          label: (month>9?year-2:year-3)+'级'
        },
        {
          grade: 16,
          label: (month>9?year-3:year-4)+'级'
        }
          ]
        vm.schoolGradeList = vm.schoolGradeList.concat(vm.collegeList)
        vm.getSchoolCollegeBySchoolId(vm.schoolId)
      }
    } else {
      vm.resultColumns = vm.normal
      vm.schoolGradeList = vm.schoolGradeList
        .concat(vm.primaryList)
        .concat(vm.middleList)
        .concat(vm.highList)
        .concat(vm.collegeList)
    }

    let tempPageSize=sessionStorage.getItem('studentInfoManage-getStudentInfoList-pageSize');
    let tempgrade = sessionStorage.getItem('studentInfoManage-getStudentInfoList-grade');
    let tempstudentClass = sessionStorage.getItem('studentInfoManage-getStudentInfoList-studentClass');
    let tempstudentName = sessionStorage.getItem('studentInfoManage-getStudentInfoList-studentName');
    let tempregisterCode = sessionStorage.getItem('studentInfoManage-getStudentInfoList-registerCode');
    let temptransferStatus = sessionStorage.getItem('studentInfoManage-getStudentInfoList-transferStatus');

    let classGrade = sessionStorage.getItem('sportsClass-studentInfoManage-grade');
    let classStudentClass = sessionStorage.getItem('sportsClass-studentInfoManage-studentClass');

    if(sessionStorage.getItem('sportsClass-studentInfoManage-grade') ){
        tempgrade = Number(classGrade);
      }
      if( sessionStorage.getItem('sportsClass-studentInfoManage-studentClass')){
       tempstudentClass = Number(classStudentClass);;
      }

    if(tempPageSize != null && tempPageSize != undefined && tempPageSize > 0 ){
      vm.pageNum = Number(sessionStorage.getItem('studentInfoManage-getStudentInfoList-pageNum'));
      vm.pageSize = Number(sessionStorage.getItem('studentInfoManage-getStudentInfoList-pageSize'));
      if(tempgrade != null && tempgrade != undefined && tempgrade > 0){
        vm.grade = Number(tempgrade);
      }
      if(tempstudentClass != null && tempstudentClass != undefined && tempstudentClass > 0){
        vm.studentClass = Number(tempstudentClass);;
      }
      if(tempstudentName != null && tempstudentName != undefined && tempstudentName != "" ){
        vm.studentName = tempstudentName;
      }
      if(tempregisterCode != null && tempregisterCode != undefined && tempregisterCode != ""){
        vm.registerCode =  tempregisterCode;
      }
      if(temptransferStatus != null && temptransferStatus != undefined && temptransferStatus != ""){
        vm.transferStatus =  temptransferStatus;
      }
    }
    vm.search()
  }
}
</script>
