<template>
  <div style="margin-left:15px;">
    <div>
      <h1>体育课班级详情</h1>
    </div>
        <Card style="margin-top:15px">
          <Form :label-width="140" class="function">
            <FormItem label="班级名称：" class="functionItem">
              <Input v-model="sportsClassName" size="small" placeholder="体育课班级名称" style="width:600px;"></Input>
            </FormItem>
            <FormItem label="授课老师：" class="functionItem">
              <Select  v-model="teacherId" size="small" style="width:120px;">
                <Option  v-for="item in teacherList" :value="item.teacherId" :key="item.teacherId">{{ item.name }}</Option>
              </Select>
            </FormItem>
             <FormItem label="所属校区：" class="functionItem">
              <Select  v-model="campusCode" size="small" style="width:120px;">
                <Option  v-for="item in campusList" :value="item.campusCode" :key="item.campusCode">{{ item.campusName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="课程编号：" class="functionItem">
              <Input v-model="sportsClassCode" size="small" placeholder="课程编号" style="width:600px;"></Input>
            </FormItem>
            <FormItem label="类型：" class="functionItem">
              <Select v-model="sportsClassTypeId" size="small" style="width:180px;">
                <Option
                  v-for="item in peTypeList"
                  :value="item.sportsClassTypeId"
                  :key="item.sportsClassTypeId"
                >{{ item.sportsClassTypeName }}</Option>
              </Select>

              <!-- <Checkbox v-model="sportsClassTypeStatus" style="margin-left:30px">新增类型</Checkbox>
              <Input
                :disabled="!sportsClassTypeStatus"
                v-model="sportsClassTypeName"
                size="small"
                placeholder="类型名称"
                style="width:200px;"
              ></Input> -->
            </FormItem>
            <FormItem label="学期：" class="functionItem">
              <Select :disabled="true" v-model="semesterYear" size="small" style="width:120px;">
                <Option  v-for="item in semesterYearList" :value="item.yearSemester" :key="item.yearSemester">{{ item.semesterName }}</Option>
              </Select>
            </FormItem>
            <!-- <FormItem label="体育课简介：" class="functionItem">
              <Input
                type="textarea"
                v-model="remark"
                size="small"
                placeholder="简介"
                style="width:600px;"
              ></Input>
            </FormItem> -->
            <FormItem label="学生人数：" class="functionItem">
              <Input
                :disabled="disTf"
                v-model="studentNum"
                size="small"
                placeholder="学生人数"
                style="width:600px;"
              ></Input>
            </FormItem>
          </Form>
        </Card>
        <div style="margin-top:10px;padding-left:40%">
          <Button
            @click="pageToList"
            style="float:left; margin-right:50px;width:100px"
            type="success"
          >返回</Button>
          <div style="width:20px;"></div>
          <Button style="float:left;width:100px" @click="baseSubmit" type="success">保存</Button>
        </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      sportsClassId: "",
      sportsClassName: "",
      sportsClassTypeId: "",
      peTypeList: [],
      sportsClassTypeStatus: false,
      sportsClassTypeName: "",
      remark: "",
      studentNum: "",
      disTf: true,
      semesterYear:'',
      semesterYearList:[],
      sportsClassCode:'',
      teacherId:'',
      teacherList:[],
      campusCode:'',
      campusList:[],
    };
  },
  watch: {}, //以V-model绑定数据时使用的数据变化监测
  created: function() {},
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    getSportsClassInfo(peClassId) {
      var vm = this;
      this.$axios
        .get("/v1/sports/class/getSportsClassInfo?sportsClassId=" + peClassId+'&semesterYear='+vm.semesterYear)
        .then(function(response) {
          // console.log(response)
          let data = response.data.response;
          vm.sportsClassName = data.sportsClassName;
          vm.sportsClassTypeId = data.sportsClassTypeId;
          vm.remark = data.remark;
          vm.studentNum = data.studentNum;
          vm.semesterYear=data.semesterYear;
          vm.teacherId=data.teacherId;
          vm.sportsClassCode=data.sportsClassCode;
          vm.campusCode=data.campusCode
          
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getSportClassTypeList() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSportClassTypeList").then(res => {
        if (res.data.code == 10000) {
          // let all={
          //     peTypeId:999,
          //     peTypeName:'全部',
          //     schoolId:vm.schoolId
          // }
          //  vm.peTypeList.push(all);
          // vm.peTypeList =vm.peTypeList.concat(res.data.response) ;
          vm.peTypeList = res.data.response;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    baseSubmit() {
      var vm = this;
      if (!vm.sportsClassName) {
        vm.$Message.error("请填写体育课名称");
        return false;
      }
      if (!vm.teacherId) {
        vm.$Message.error("请选择授课教师");
        return false;
      }
      if (!vm.campusCode) {
        vm.$Message.error("请选择校区");
        return false;
      }
      if (vm.sportsClassTypeStatus) {
        if (!vm.sportsClassTypeName) {
          vm.$Message.error("请输入新增类型的名称");
          return false;
        }
      } else {
        if (!vm.sportsClassTypeId) {
          vm.$Message.error("请选择体育课类型");
          return false;
        }
      }
      if (!vm.semesterYear) {
        vm.$Message.error("请选择所属学期");
        return false;
      }
      // if (!vm.remark) {
      //   vm.$Message.error("请输入简介");
      //   return false;
      // }
      // if (vm.remark && vm.remark.length>50) {
      //   vm.$Message.error("简介不能超过50字");
      //   return false;
      // }

      if (!vm.sportsClassCode) {
        vm.$Message.error("请输入课程编码");
        return false;
      }
      if (vm.sportsClassCode && vm.sportsClassCode.length>50) {
        vm.$Message.error("课程编码不能超过50字");
        return false;
      }


      let data = {
        "remark": vm.remark,
        "schoolId": vm.schoolId,
        "semesterYear": vm.semesterYear,
        "sportsClassId": vm.sportsClassId,
        "sportsClassName": vm.sportsClassName,
        "sportsClassTypeId": vm.sportsClassTypeId,
        "sportsClassTypeName": vm.sportsClassTypeName,
        "sportsClassTypeStatus": vm.sportsClassTypeStatus? "2" : "1",
        "studentNum": vm.studentNum,
        campusCode:vm.campusCode,
        sportsClassCode:vm.sportsClassCode,
        teacherId:vm.teacherId
      };
      this.$axios
        .post("/v1/sports/class/upsertSportsClass", data)
        .then(function(response) {
          console.log(response);
          if (response.data.response == "1") {
            vm.$Message.info("提交成功");
            vm.$router.go(-1);
          } else {
            vm.$Message.info("提交失败");
          }
        })
        .catch(function(response) {
          console.log(response);
          vm.$Message.info("提交失败");
        });
    },
    getSemesterList(peClassId) {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSchoolAllYearSemester").then(res => {
        if (res.data.code == 10000) {
          vm.semesterYearList =res.data.response ;
          if(res.data.response){
            vm.semesterYear=res.data.response[0].yearSemester
            if(peClassId){
                vm.getSportsClassInfo(peClassId);
            }
          }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSchoolTeacherList() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSchoolTeacherList").then(res => {
        if (res.data.code == 10000) {
          vm.teacherList =res.data.response ;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    getSchoolAllCampus() {
      var vm = this;
      this.$axios.get("/v1/sports/class/getSchoolAllCampus").then(res => {
        if (res.data.code == 10000) {
          vm.campusList =res.data.response ;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
  },
  mounted() {
    var vm = this;
    let sportsClassId = sessionStorage.getItem("sportsClass-sportsClassInfo-sportsClassId");
    vm.sportsClassId = sportsClassId;
    vm.getSportClassTypeList();
    vm.getSchoolTeacherList();
    vm.getSchoolAllCampus();
    vm.getSemesterList(sessionStorage.getItem("sportsClass-sportsClassInfo-sportsClassId"));
  },
  destroyed() {}
};
</script>
