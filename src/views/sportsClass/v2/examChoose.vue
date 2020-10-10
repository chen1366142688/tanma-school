<template>
  <div style="margin-left:15px;">
    <div>
      <h1>选择考试项目：</h1>
    </div>
    <Card style="margin-top:15px">
      <h3>运动技能：</h3>
      <Form :label-width="140" class="function">
        <FormItem label="" class="functionItem">
          <CheckboxGroup v-model="sportsList">
            <Checkbox :label="item.examItemId "  v-for="item , aindex in sportsListAllList">{{item.examItemName  }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top:15px">
      <h3>健康知识：</h3>
      <Form :label-width="140" class="function">
        <FormItem label="" class="functionItem">
          <CheckboxGroup v-model="healthList">
            <Checkbox :label="item.examItemId " v-for="item , bindex in healthAllList">{{item.examItemName  }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Card>
    <div style="margin-top:10px;text-align:center">
      <Button @click="pageToList" style="margin-right:50px;width:100px" type="success">返回</Button>
      <Button style="width:100px" @click="baseSubmit" type="success">保存</Button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      sportsClassId: "",
      sportsListAllList:[],
      sportsList:[],
      healthAllList:[],
      healthList:[],
      schoolId:''
    };
  },
  watch: {}, //以V-model绑定数据时使用的数据变化监测
  created: function() {},
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    getCollegeAllExam(peClassId) {
      var vm = this;
      this.$axios
        .get(
          "/v1/collegeexam/getCollegeAllExam" 
        )
        .then(function(response) {
          // console.log(response)
          let data = response.data.response;
         console.log(data)
         vm.sportsListAllList=data.sportsList?data.sportsList:[];
         vm.healthAllList=data.healthList?data.healthList:[]
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getCollegeChooseExam(sportsClassId) {
      var vm = this;
      this.$axios.get("/v1/collegeexam/getCollegeChooseExam?sportsClassId="+sportsClassId).then(response => {
        if (response.data.code == 10000) {
             let data = response.data.response;
             vm.sportsList=data.sportsList?data.sportsList:[];
             vm.healthList=data.healthList?data.healthList:[];
        } else {
          if (response.data.code > 39999) {
            vm.$Message.info(response.data.msg);
          }
        }
      });
    },
    baseSubmit() {
      var vm = this;
      
    //   if (vm.sportsClassCode && vm.sportsClassCode.length > 50) {
    //     vm.$Message.error("课程编码不能超过50字");
    //     return false;
    //   }

      let data = {
  "healthList": vm.healthList,
  "schoolId":vm.schoolId,
  "sportsClassId":sessionStorage.getItem(
      "sportsClass-examChoose-sportsClassId"
    ),
  "sportsList": vm.sportsList
};
      this.$axios
        .post("/v1/collegeexam/upsertCollegeChooseExam", data)
        .then(function(response) {
          console.log(response);
          if (response.data.response.code == "1") {
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
    }
  },
  mounted() {
    var vm = this;
    let sportsClassId = sessionStorage.getItem(
      "sportsClass-examChoose-sportsClassId"
    );
    vm.sportsClassId = sportsClassId;
    vm.getCollegeAllExam();
    vm.getCollegeChooseExam(sessionStorage.getItem(
      "sportsClass-examChoose-sportsClassId"
    ));
  },
  destroyed() {}
};
</script>
