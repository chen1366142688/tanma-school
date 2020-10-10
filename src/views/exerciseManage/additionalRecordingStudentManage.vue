<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">课后作业补录</h2>
    </div>
    <div>
      <Card style="height: 110px;">
        <div class="top-search">
            <div class="left-input">
                <div style="margin:5px 20px;">
                    <span style>日期：</span>
                    <DatePicker v-model="dateTime"  :options="options3" :clearable="false" :editable="false" @on-change="StartTimeChange" format="yyyy-MM-dd" type="date" placeholder="日期" style="width: 120px"></DatePicker>
                </div>
                <div style="margin:5px 20px;">
                    <span>年级：</span>
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
                    <span>姓名：</span>
                    <Input v-model="studentName"  placeholder="学生姓名" style="width: 120px;" />
                </div>
            </div>
            <div class="right-btns">
                <Button type="success" @click="querySearch">查询</Button>
            </div>
        </div>
      </Card>
      <br />
      <Card>
        <div style="font-size:18px;height:40px;">
            数据明细
            <div style="left:1400px;position:absolute;top:16px;">
            <Button type="success" @click="allComplete" :disabled="completeDisabled">一键完成</Button>
            <Button type="success" @click="allCancle" :disabled="completeDisabled">一键取消</Button>
          </div>
        </div>
        <Row>
          <div>
            <Table border max-height="550" :loading="loading" :columns="resultColumns" :data="resultData"></Table>
          </div>
        </Row>
     </Card>
    </div>
    <Modal v-model="giveStatus" :closable="false" width="420"  :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>锻炼时长</span>
      </p>
      <div style="text-align:center">
          <Input style="width: 180px;" v-model="exerciseTime" size="small" placeholder="分钟" />分钟
      </div>
      <div slot="footer">
        <Button type="success"  @click="cancle" >取消</Button>
        <Button type="success"  :loading="changeLoading" @click="updateStudentCompleteStatus">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "schoolList",
  data() {
    return {
      changeStudent:'',
       options3: {
                    disabledDate (date) {
                        return date && date.valueOf() >(Date.now() - 86400000) ;
                    }
                },
      giveStatus:false,
      changeLoading:false,
      loading: false,
      schoolId: "",
      schoolType: "",
      dateTime:'',
      grade: "",
      primaryList: [
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
      middleList: [
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
      highList: [
        {
          grade: 10,
          label: "高一"
        },
        {
          grade: 11,
          label: "高二"
        },
        {
          grade: 12,
          label: "高三"
        }
      ],
      schoolGradeList: [],
      studentClass:1,
      classList: [
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
      studentName: "",
      resultColumns: [
        {
          title: "学生姓名",
          key: "studentName",
          align: "center",
          minWidth:100
        },
        {
          title: "学籍号",
          key: "registerCode",
          align: "center",
          minWidth:100
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          minWidth:100,
          render: (h, params) => {
            const row = params.row;
            const text = row.gender == "1" ? "男" : "女";
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
            // const color = row.exemptId != null ? 'green' : 'red'
            const text = row.gradeName + row.studentClass + "班";
            return h("div", text);
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 240,
          render: (h, params) => {
                        const param = params.row;
                        if(param.afterClassChoose == '1'){
                           return h("div", "免试");
                        }else{
                          return h('i-switch',
                                {
                                    props: {
                                    type: 'primary',
                                    value:param.completeStatus === '1',
                                    disabled:this.completeDisabled
                                    }
                                    ,slots:{
                                        open:'有效',
                                        close:'无效'
                                    }
                                    ,on: {
                                        'on-change': (status) => {
                                            if(status){
                                                param.completeStatus= '1'
                                            }else{
                                                param.completeStatus= '0'
                                            }
                                            this.changeOperatorStatus(param);
                                        }
                                    }
                                }
                                ,[
                                    h('span',{props: {slot: 'open'}},'有效'),
                                    h('span',{props: {slot: 'close'}},'无效')
                                ]
                            );
                        }

                    }
        }
      ],
      resultData: [],
      exerciseTime:'',
      studentList:[],
      completeType:'1',
      completeDisabled:true,
      oneKeyFinish:false,
    };
  },
  methods: {
    getAdditionalRecordingStudentByDay() {
      var vm = this;
      sessionStorage.setItem('additionalRecordingStudentManage-grade',vm.grade);
      sessionStorage.setItem('additionalRecordingStudentManage-studentClass',vm.studentClass);
      sessionStorage.setItem('additionalRecordingStudentManage-dateTime',vm.dateTime);
      sessionStorage.setItem('additionalRecordingStudentManage-studentName',vm.studentName);
      vm.loading = true;
      this.$axios
        .get("/v1/familyexerciseanalyze/getAdditionalRecordingStudentByDay?dateTime="+vm.dateFormat("yyyy-mm-dd",vm.dateTime)+"&gradeId="+vm.grade+"&studentClass="+vm.studentClass+
        "&studentName="+vm.studentName)
        .then(res => {
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
    cancle(){
      var vm=this;
      this.giveStatus=false;
      if(vm.studentList.length==1 && !vm.oneKeyFinish){
        for(let i=0;i<vm.studentList.length;i++){
        vm.studentList[i].completeStatus=vm.studentList[i].completeStatus=="1"?"0":"1"
      }
      }
    },
    changeOperatorStatus(student){
      var vm=this;
      vm.oneKeyFinish=false;
      vm.completeType=student.completeStatus=="1"?"1":"2"
      if(vm.completeType=="1"){
        vm.studentList=[];
        vm.studentList.push(student);
        vm.exerciseTime='';
        vm.giveStatus=true;
      }else{
        vm.studentList=[];
        vm.studentList.push(student);
        vm.updateStudentCompleteStatus()
      }

    },
    allComplete(){
      var vm=this;
      vm.exerciseTime='';
      vm.completeType="1";
      vm.studentList=vm.resultData;
      vm.oneKeyFinish=true;
      vm.giveStatus=true;
    },
    allCancle(){
      var vm=this;
      vm.completeType="2";
      vm.studentList=vm.resultData;
      vm.updateStudentCompleteStatus()
      // vm.giveStatus=true;
    },
    updateStudentCompleteStatus() {
     var vm = this;
     var re = /^\d+(?=\.{0,1}\d+$|$)/;
      if(vm.completeType=="1" && (!vm.exerciseTime || !re.test(vm.exerciseTime))){
        vm.$Message.info("请输入正确的锻炼时长！");
        return;
      }
      if(vm.studentList.length<1){
        vm.$Message.info("当前没有学生需要补录！");
        return;
      }

      vm.changeLoading=true;
      vm.loading = true;
      let data={
        "exerciseTime":vm.exerciseTime? vm.exerciseTime*1000*60:0,
        completeType:vm.completeType,
        "list": vm.studentList}
      this.$axios
        .post("/v1/familyexerciseanalyze/updateStudentCompleteStatus",data)
        .then(res => {
          vm.loading = false;
          vm.search();
          vm.giveStatus=false;
          vm.changeLoading=false;
          if (res.data.code == 10000) {
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
      vm.getAdditionalRecordingStudentByDay();
    },
    StartTimeChange(e){

    },
   dateFormat(fmt, date) {
    let ret;
    const opt = {
        "y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
  },
  watch: {
    dateTime:function(){
      var vm=this;
      console.log(vm.dateTime)
      console.log(new Date)
      if(vm.dateFormat("yyyy-mm-dd",new Date(vm.dateTime))>=vm.dateFormat("yyyy-mm-dd",new Date)){
        vm.completeDisabled=true
      }else{
        if(vm.resultData.length<1){
          vm.completeDisabled=true
        }else{
          vm.completeDisabled=false
        }
      }
    },
    resultData:function(){
      var vm=this;
      if(vm.dateFormat("yyyy-mm-dd",new Date(vm.dateTime))>=vm.dateFormat("yyyy-mm-dd",new Date)){
        vm.completeDisabled=true
      }else{
        if(vm.resultData.length<1){
          vm.completeDisabled=true
        }else{
          vm.completeDisabled=false
        }
      }
    }

  },
  created() {
    //  this.getProvinceList();
  },
  mounted() {
    //    0 未知类型 1 幼儿园 2小学 3初中 4高中5大学
    var vm = this;
    vm.dateTime=new Date- 86400000;
    vm.dateTime =new Date(vm.dateTime);
    let schoolId = sessionStorage.getItem("schoolId");
    vm.schoolId = schoolId;
    let schoolType = sessionStorage.getItem("schoolType");
    vm.schoolType = schoolType;
    if ("2" == schoolType) {
      vm.schoolGradeList = vm.schoolGradeList.concat(vm.primaryList);
      vm.grade=1
    }
    if ("3" == schoolType) {
      vm.schoolGradeList = vm.schoolGradeList.concat(vm.middleList);
      vm.grade=7
    }
    if ("4" == schoolType) {
      vm.schoolGradeList = vm.schoolGradeList.concat(vm.highList);
      vm.grade=10
    }

    let  grade = sessionStorage.getItem('additionalRecordingStudentManage-grade');
    let  studentClass = sessionStorage.getItem('additionalRecordingStudentManage-studentClass');
    let  studentName = sessionStorage.getItem('additionalRecordingStudentManage-studentName');
    let dateTime=sessionStorage.getItem('additionalRecordingStudentManage-dateTime');
    // console.log(dateTime)

    if(grade != null && grade != "" && grade != undefined && grade > 0){
        vm.grade = Number(grade);
    }
    // if(dateTime != null && dateTime != "" && dateTime != undefined ){
    //     vm.dateTime =new Date(dateTime);
    // }
    if(studentClass != null && studentClass != "" && studentClass != undefined && studentClass > 0){
        vm.studentClass = Number(studentClass);
    }

    if(studentName != null && studentName != "" && studentName != undefined ){
        vm.studentName = studentName;
    }
    vm.search();
  }
};
</script>
