
<style scoped>
  .itemTitle{
    font-size:18px;
    font-weight:bold;
    color:rgba(81,90,110,1);
    border-right:1px solid #DDD;
  }
  .openBtn{
    width:60px;
    height:20px;
    background:rgba(0,198,147,1);
    border-radius:5px;
    font-size:14px;
    color:rgba(255,255,255,1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top:20px;
  }
  .imgData{
    display: flex;
    flex-wrap: wrap;
  }
  .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
}
.fade-enter, .fade-leave-active {
      opacity: 0
}
.one{
    display:flex;
    flex-wrap: wrap;
  }
  .gradeItem{
    width:300px;
    height:300px;
    border:1px solid rgba(191, 201, 206, 1);
    margin:22px 7px;
    border-radius:5px 5px 0px 0px;
    text-align: center;
  }
  .top{
    width:100%;
    height:41px;
    background:rgba(240,240,240,1);
    border-bottom:1px solid rgba(191, 201, 206, 1);
    border-radius:5px 5px 0px 0px;
    line-height: 42px;
    font-size:18px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(81,90,110,1);
  }
  .sections{
    width:100%;
    height:217px;
    overflow-y: auto;
  }
  .title{
    width:100%;
    height:36px;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(0,198,147,1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom:8px;
  }
  .itemsData{
    width:100%;
    height:30px;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:500;
    color:#515A6E;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bottom{
    width:100%;
    height:40px;
    background:rgba(240,240,240,1);
    border-top:1px solid rgba(191, 201, 206, 1);
    line-height: 41px;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(81,90,110,1);
  }
</style>
<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">考核项目配置</h2>
    </div>
      <Tabs type="card" :value="selectTabName" @on-click="selectTabs">
        <TabPane :name="grade.gradeId" :label="grade.val" v-for="grade in gradeList" :key="grade.gradeId">
          <div  v-if="gradeData.gradeId==grade.gradeId" v-for="gradeData,indexa in allData">
          <Card v-if="gradeData.list" v-for="classTestInfo,indexb in gradeData.list" style="margin-top:10px;" :dis-hover="true">
            <Row >
              <Col span="4" class="itemTitle">
                <div>{{classTestInfo.classTestName}}</div>
                <div class="openBtn" @click="openOrCloseFun(classTestInfo,indexa,indexb)">{{classTestInfo.open?'收起':'展开'}} <Icon style="margin-left:5px" size="8" color='#FFF' :type="classTestInfo.open?'arrow-up-b':'arrow-down-b'"></Icon></div>
              </Col>
              <Col span="20" style="display:flex;padding-left:20px">
                <Checkbox
                  :value="classTestInfo.checkAll"
                  @click.prevent.native="handleCheckAll(classTestInfo,indexa,indexb)"
                  style="border:1px solid #DCDEE2;padding:3px 0 0 5px;margin:10px;display:inline-block;min-width:60px;height:27px"
                >全部</Checkbox>
                <CheckboxGroup v-model="classTestInfo.classIds"   style="display:inline-block">
                    <span style="border:1px solid #DCDEE2;padding:0 0 3px 10px;margin:10px;display:inline-block;"
                      v-for="item,indexc in classTestInfo.list" :key="item.classId">
                      <Checkbox :label="item.classId" :value="item.selectTf"  @click.native="checkGroup(classTestInfo,indexa,indexb,indexc)">{{item.studentClass}}班 </Checkbox></span>
                </CheckboxGroup>
              </Col>
            </Row>
            <Row  style="margin-top:10px;">
              <transition name="fade">
              <Tabs  type="card" v-if="classTestInfo.open" transiton="fade">
                  <TabPane :name="detailInfo.examItemName" :label="detailInfo.examItemName" v-for="detailInfo in classTestInfo.detail" :key="detailInfo.examItemId">
                    <div>
                      <p style="margin-top:15px" v-html="'测试场地：'+detailInfo.testPlaceRemark"></p>
                      <div class="imgData" v-if="detailInfo.placeList.length >0 && detailInfo.placeList[0].resourceType == 1">
                        <img width='88' height='88' style="margin:10px 15px" :src="imgItem.pictureAddr" alt="" v-for="imgItem in detailInfo.placeList" :key="imgItem.classTestId">
                      </div>
                      <div class="imgData" v-if="detailInfo.placeList.length >0 && detailInfo.placeList[0].resourceType == 2">
                        <video width='88' height='88' :src="imgItem.pictureAddr" v-for="imgItem in detailInfo.placeList" :key="imgItem.classTestId"></video>
                      </div>
                    </div>
                    <div>
                      <p style="margin-top:15px" v-html="'测试方法：'+detailInfo.testMethodsRemark"></p>
                      <div class="imgData" v-if="detailInfo.methodList.length >0 && detailInfo.methodList[0].resourceType == 1">
                        <img width='88' height='88' style="margin:10px 15px" :src="imgItem.pictureAddr" alt="" v-for="imgItem in detailInfo.methodList" :key="imgItem.classTestId">
                      </div>
                      <div class="imgData" v-if="detailInfo.methodList.length >0 && detailInfo.methodList[0].resourceType == 2">
                        <video width='88' height='88' :src="imgItem.pictureAddr" v-for="imgItem in detailInfo.methodList" :key="imgItem.classTestId"></video>
                      </div>
                    </div>
                    <div>
                      <p style="margin-top:15px" v-html="'评分标准：'+detailInfo.testStandardRemark"></p>
                    </div>
                  </TabPane>
              </Tabs>
            </transition>
            </Row>
            </Card>
            <Card style="margin-top:20px;" :dis-hover="true">
            <div v-if="gradeData.selectList.length>0">已选择班级考核项目</div>
            <div class="one">
              <div class="gradeItem" v-for="item,indexd in gradeData.selectList" :value="item.gradeName" :key="indexd">
                <div class="top">{{item.gradeName}}</div>
                <div class="sections">
                  <p class="title">已选择考核项目</p>
                  <div class="itemsData" v-for="selectedItem in item.list" :value="selectedItem" :key="selectedItem">{{selectedItem}}</div>
                </div>
                <div class="bottom">考核项目数量：{{item.list.length}}</div>
              </div>
            </div>
          </Card>
          </div>
        </TabPane>
      </Tabs>
    <div style="margin-top:10px;padding-left:45%">
      <Button type="success" style="margin-right:40px;" @click="goback" >返回</Button>
      <Button type="success" style="margin-right:40px;" @click="baseSubmit" >保存</Button>
    </div>
  </div>
</template>

<script>

export default {
  name: "examItemConfigure",
  data() {
    return {
      selectTabName:'',
      classTestType:"1",
      loading: false,
      gradeList:[],
      allDataDe:[],
      allData:[],
      allSelectList:[],
    };
  },
  methods: {
    openOrCloseFun(data,indexa,indexb){
      let vm = this;
      let open=data.open;
      open=!open;
      if(open){
        vm.loading = true;
          this.$axios.get('/v1/examtest/getExamItemsByClassTestId?classTestId='+data.classTestId)
            .then(res => {
              vm.loading = false;
              if (res.data.code == 10000) {
                let params=res.data.response
                vm.allData[indexa].list[indexb].detail=params;
                vm.allData[indexa].list[indexb].open=open;
                vm.allData=vm.allData.slice(0)
              } else {
                if (res.data.code > 39999) {
                  vm.$Message.info(res.data.msg);
                }
              }
            });
      }else{
        vm.allData[indexa].list[indexb].open=false;
        vm.allData=vm.allData.slice(0)
      }
    },
    handleCheckAll (classTestInfo,indexa,indexb) {
      console.log(classTestInfo)
      var vm=this;
      let allData=vm.allData;
      let tf=classTestInfo.checkAll;
      tf=!tf;
      classTestInfo.classIds=[];
      classTestInfo.checkAll=tf;
      for(let i=0;i<classTestInfo.list.length;i++){
        classTestInfo.list[i].selectTf=tf;
        if(tf){
          classTestInfo.classIds.push(classTestInfo.list[i].classId)
          for(let x=0;x<allData[indexa].selectList.length;x++){
                    if(classTestInfo.list[i].classId==allData[indexa].selectList[x].classId){
                      allData[indexa].selectList[x].list.push(classTestInfo.classTestName)
                    }
                  }
        }else{
           for(let x=0;x<allData[indexa].selectList.length;x++){
                    if(classTestInfo.list[i].classId==allData[indexa].selectList[x].classId){
                      allData[indexa].selectList[x].list.remove(classTestInfo.classTestName)
                    }
                  }

        }
      }
      vm.allData[indexa].list.splice(indexb,1,classTestInfo);
    },
    checkGroup(classTestInfo,indexa,indexb,indexc){
      var vm=this;
      // console.log(classTestInfo)
      let allData=vm.allData;
      let tf=classTestInfo.list[indexc].selectTf;
      tf=!tf;
      if(tf){
        classTestInfo.classIds.push(classTestInfo.list[indexc].classId)

        for(let x=0;x<allData[indexa].selectList.length;x++){
                    if(classTestInfo.list[indexc].classId==allData[indexa].selectList[x].classId){
                      allData[indexa].selectList[x].list.push(classTestInfo.classTestName)
                    }
                  }
      }else{
        classTestInfo.classIds.remove(classTestInfo.list[indexc].classId);

        for(let x=0;x<allData[indexa].selectList.length;x++){
                    if(classTestInfo.list[indexc].classId==allData[indexa].selectList[x].classId){
                      allData[indexa].selectList[x].list.remove(classTestInfo.classTestName)
                    }
                  }
      }
      console.log(classTestInfo.classIds)
      classTestInfo.list[indexc].selectTf=tf;
          if(classTestInfo.classIds.length==classTestInfo.list.length){
             classTestInfo.checkAll=true;
           }else{
            classTestInfo.checkAll=false;
           }
      vm.allData[indexa].list.splice(indexb,1,classTestInfo);
    },
    checkAllGroupChange (classIds) {
      var vm=this;

    },
    selectTabs(name){
      this.selectTabName = name;
      // this.getexamItemList(this.selectTabName)
    },
    getAllGradeClassTestList() {
      var vm = this;
      vm.loading = true;
      this.$axios.get(`v1/examtest/getAllGradeClassTestList?classTestType=${vm.classTestType}`)
        .then(res => {
          vm.loading = false;
        if (res.data.code == 10000) {
          let data=res.data.response;
         vm.allDataDe=data;
         if(data){
           vm.dealData();
         }
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
   dealData(){
     var vm=this;
     console.log(vm.allDataDe)
     for(let i=0;i<vm.allDataDe.length;i++){
       let gradeInfo=vm.allDataDe[i];
       gradeInfo.selectList=[];
       if(gradeInfo.list){
         if(gradeInfo.list.length ){
           for(let k=0;k<gradeInfo.list[0].list.length;k++){
                let classInfo=gradeInfo.list[0].list[k];
                let selectInfo={
                  classId:classInfo.classId,
                  gradeName:(classInfo.grade==1?"一年级":classInfo.grade==2?"二年级":classInfo.grade==3?"三年级":classInfo.grade==4?"四年级":
                  classInfo.grade==5?"五年级":classInfo.grade==6?"六年级":classInfo.grade==7?"七年级":classInfo.grade==8?"八年级":classInfo.grade==9?"九年级":
                  classInfo.grade==10?"高一":classInfo.grade==11?"高二":classInfo.grade==12?"高三":"")+classInfo.studentClass+"班",
                  list:[]
                }
                gradeInfo.selectList.push(selectInfo)
              }
         }
         for(let j=0;j<gradeInfo.list.length;j++){
           let classTestInfo=gradeInfo.list[j];
           classTestInfo.open=false;
            classTestInfo.classIds=[];

            if(classTestInfo.list){
              for(let k=0;k<classTestInfo.list.length;k++){
                let classInfo=classTestInfo.list[k];

                if(classInfo.selectStatus=="1"){
                  classInfo.selectTf=true
                  classTestInfo.classIds.push(classInfo.classId)
                  for(let x=0;x<gradeInfo.selectList.length;x++){
                    if(classInfo.classId==gradeInfo.selectList[x].classId){
                      gradeInfo.selectList[x].list.push(classTestInfo.classTestName)
                    }
                  }

                }else{
                  classInfo.selectTf=false
                }
           }
           if(classTestInfo.classIds.length==classTestInfo.list.length){
             classTestInfo.checkAll=true;
           }else{
            classTestInfo.checkAll=false;
           }
            }
         }
       }
       vm.allData.push(vm.allDataDe[i])
     }

   },
    baseSubmit(){
      let vm =  this;

      let list=[];
      if(vm.allData){
        for(let i=0;i<vm.allData.length;i++){
        let gradeInfo=vm.allData[i];

        if(gradeInfo){
          for(let j=0;j<gradeInfo.list.length;j++){
              let classInfo=gradeInfo.list[j];

              // if(classInfo.classIds.length>0){
                let aa={
                  classTestId:classInfo.classTestId,
                  classIds:classInfo.classIds
                }
                console.log(gradeInfo)
                list.push(aa);
              // }

          }
        }
      }
      }

      let data = {
        "list": list,
        "schoolId": sessionStorage.getItem('schoolId')
      }

      console.log(data);
      // return
      // data.list = arr2
      this.$axios.post('v1/examtest/upsertStudentClassSelect',data)
        .then(res => {
          if (res.data.code == 10000) {
              if(res.data.response.code=="1"){
              vm.$Message.info("保存成功！");
              vm.goback();
            }else{
              vm.$Message.info(res.data.response.msg);
            }
          } else {
            vm.$Message.info("保存失败！");
          }
        })
    },
    goback() {
        this.$router.go(-1);
      },
  },
  watch: {

  },
  created() {},
  beforeDestroy() {},
  mounted() {
    var vm = this;
    let type = sessionStorage.getItem('schoolType');
    if(type == 2){
      vm.gradeList = [
        {val:'一年级',gradeId:'1'},
        {val:'二年级',gradeId:'2'},
        {val:'三年级',gradeId:'3'},
        {val:'四年级',gradeId:'4'},
        {val:'五年级',gradeId:'5'},
        {val:'六年级',gradeId:'6'},
      ]
      // for(let val of vm.gradeList){vm.getexamItemList(val.gradeId)}
    }else if(type == 3){
      vm.gradeList = [
        {val:'七年级',gradeId:'7'},
        {val:'八年级',gradeId:'8'},
        {val:'九年级',gradeId:'9'}
      ]
      // for(let val of vm.gradeList){vm.getexamItemList(val.gradeId)}
    }else if(type == 4){
      vm.gradeList = [
        {val:'高一',gradeId:'10'},
        {val:'高二',gradeId:'11'},
        {val:'高三',gradeId:'12'}
      ]
      // for(let val of vm.gradeList){vm.getexamItemList(val.gradeId)}
    }else{
      console.log("学校类型有误")
    }
    vm.selectTabName = vm.gradeList[0].gradeId;
    vm.getAllGradeClassTestList();
  }
};
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
    }
    return -1;
    };
Array.prototype.remove = function(val) {
var index = this.indexOf(val);
if (index > -1) {
this.splice(index, 1);
}
};
</script>
