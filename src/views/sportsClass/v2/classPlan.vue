<template>
  <div style="margin-left:15px;">
    <div>
      <h1>体育课排课</h1>
    </div>
        <Card style="margin-top:15px">
          <Form :label-width="140" class="function">
            <FormItem label="是否是单双周：" class="functionItem">
              <RadioGroup v-model="singleStatus">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
            </FormItem>
            <FormItem label="日期选择：" class="functionItem" v-if="!singleTf">
             <CheckboxGroup v-model="singleWeek" @on-change="singleChange">
                <Checkbox :label="1">星期一</Checkbox>
            <Checkbox :label="2">星期二</Checkbox>
            <Checkbox :label="3">星期三</Checkbox>
            <Checkbox :label="4">星期四</Checkbox>
            <Checkbox :label="5">星期五</Checkbox>
            <Checkbox :label="6">星期六</Checkbox>
            <Checkbox :label="7">星期天</Checkbox>
            </CheckboxGroup>
            </FormItem>
            <FormItem label="单周：" class="functionItem"  v-if="singleTf">
             <CheckboxGroup v-model="singleWeek" @on-change="singleChange">
                <Checkbox :label="1">星期一</Checkbox>
            <Checkbox :label="2">星期二</Checkbox>
            <Checkbox :label="3">星期三</Checkbox>
            <Checkbox :label="4">星期四</Checkbox>
            <Checkbox :label="5">星期五</Checkbox>
            <Checkbox :label="6">星期六</Checkbox>
            <Checkbox :label="7">星期天</Checkbox>
            </CheckboxGroup>
            </FormItem>
            <FormItem label="双周：" class="functionItem"  v-if="singleTf">
             <CheckboxGroup v-model="doubleWeek" @on-change="doubleChange">
               <Checkbox :label="1">星期一</Checkbox>
            <Checkbox :label="2">星期二</Checkbox>
            <Checkbox :label="3">星期三</Checkbox>
            <Checkbox :label="4">星期四</Checkbox>
            <Checkbox :label="5">星期五</Checkbox>
            <Checkbox :label="6">星期六</Checkbox>
            <Checkbox :label="7">星期天</Checkbox>
            </CheckboxGroup>
            </FormItem>
            <FormItem :label="item.weekDayName+'：'" class="functionItem" v-for="item in singleList"  v-if="!singleTf">
              <Select  v-model="item.lessonInfo" size="small" style="width:120px;">
                <Option  v-for="lession in lessonList" :value="lession.value" :key="lession.value">{{ lession.name }}</Option>
              </Select>
            </FormItem>
             <FormItem :label="'单周'+item.weekDayName+'：'" class="functionItem" v-for="item in singleList"  v-if="singleTf">
              <Select  v-model="item.lessonInfo" size="small" style="width:120px;">
                <Option  v-for="lession in lessonList" :value="lession.value" :key="lession.value">{{ lession.name }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="'双周'+item.weekDayName+'：'" class="functionItem" v-for="item in doubleList"  v-if="singleTf">
              <Select  v-model="item.lessonInfo" size="small" style="width:120px;">
                <Option  v-for="lession in lessonList" :value="lession.value" :key="lession.value">{{ lession.name }}</Option>
              </Select>
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
      singleStatus:'0',
      singleTf:false,
      singleWeek:[],
      doubleWeek:[],
      singleList:[],
      doubleList:[],
      lessonList:[
          {
              value:"1",
              name:"1、2节"
          },
           {
              value:"2",
              name:"3、4节"
          },
           {
              value:"3",
              name:"5、6节"
          },
           {
              value:"4",
              name:"7、8节"
          }
      ],
      first:false,
    };
  },
  watch: {
    singleStatus:function(){
      var vm=this;

      if(!vm.first){
        vm.singleWeek=[];
        vm.doubleWeek=[];
        vm.singleList=[];
        vm.doubleList=[];
      }
      vm.first=true;
      if(vm.singleStatus=="1"){
          vm.singleTf=true;
      }else{
          vm.singleTf=false;
      }
    }
  }, //以V-model绑定数据时使用的数据变化监测
  created: function() {},
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    singleChange(e){
        var vm=this;
        console.log(e)
        var list=[];
        for(var i=0;i<e.length;i++){
            
            let weekDay=e[i];
            let name=e[i]==1?"星期一":e[i]==2?"星期二":e[i]==3?"星期三":e[i]==4?"星期四":e[i]==5?"星期五":e[i]==6?"星期六":"星期天";

            let vo={
                weekDayName:name,
                weekDay:weekDay,
                lessonInfo:"1"
            }
            list.push(vo)
        }
        vm.singleList=list;
    },
    doubleChange(e){
        var vm=this;
        console.log(e)
         var list=[];
        for(var i=0;i<e.length;i++){
            
            let weekDay=e[i];
            let name=e[i]==1?"星期一":e[i]==2?"星期二":e[i]==3?"星期三":e[i]==4?"星期四":e[i]==5?"星期五":e[i]==6?"星期六":"星期天";

            let vo={
                weekDayName:name,
                weekDay:weekDay,
                lessonInfo:"1"
            }
            list.push(vo)
        }
        vm.doubleList=list;
    },
    getClassPlanInfo(sportsClassId) {
      var vm = this;
      vm.first=true;
      this.$axios
        .get("/v1/sports/class/getClassPlanInfo?sportsClassId="+sportsClassId)
        .then(function(response) {
          // console.log(response)
          let data = response.data.response;
          vm.singleStatus = data.singleStatus;
          vm.doubleList = data.doubleList?data.doubleList:[];
          vm.doubleWeek = data.doubleWeek?data.doubleWeek:[];
          vm.singleList = data.singleList?data.singleList:[];
          vm.singleWeek=data.singleWeek?data.singleWeek:[];
          vm.sportsClassId=data.sportsClassId;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    
    baseSubmit() {
      var vm = this;
      // if (!vm.sportsClassName) {
      //   vm.$Message.error("请填写体育课名称");
      //   return false;
      // }

      let data = {
        "doubleList": vm.doubleList,
        "doubleWeek":vm.doubleWeek,
        "singleList": vm.singleList,
        "singleStatus": vm.singleStatus,
        "singleWeek": vm.singleWeek,
        "sportsClassId": vm.sportsClassId
      };
      this.$axios
        .post("/v1/sports/class/upsertClassPlan", data)
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
    },
  },
  mounted() {
    var vm = this;
    let sportsClassId = sessionStorage.getItem("sportsClass-classPlan-sportsClassId");
    vm.sportsClassId = sportsClassId;
    if(sessionStorage.getItem("sportsClass-classPlan-sportsClassId")){
        vm.getClassPlanInfo(sessionStorage.getItem("sportsClass-classPlan-sportsClassId"));
    }
    
  },
  destroyed() {}
};
</script>
