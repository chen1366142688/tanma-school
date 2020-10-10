<style scoped>
  .configure{
    position: absolute;
    top:14px;
    right:740px;
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
  .sectionNot{
    width:100%;
    height:217px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(0,198,147,1);
  }
  .title{
    width:100%;
    height:46px;
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
    <div style="position:relative">
      <Card>
        <Tabs type="card" :value="selectTabName" @on-click="selectTabs">
          <TabPane :name="grade.gradeId" :label="grade.val" v-for="grade in gradeList" :key="grade.gradeId">
            <div class="one">
              <div class="gradeItem" v-for="item in gradeAllList" :value="item.classId" :key="item.classId">
                <div class="top">{{item.gradeName}}{{item.studentClass}}班</div>
                <div class="sections" v-if="item.itemsNum>0">
                  <p class="title">已选择考核项目</p>
                  <div class="itemsData" v-for="items in item.items" :value="items" :key="items">{{items}}</div>
                </div>
                <div class="sectionNot" v-else>暂无考核项目</div>
                <div class="bottom">考核项目数量：{{item.itemsNum}}</div>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <Button type="success" class="configure" @click="goConfigure">配置</Button>
      </Card>
    </div>
  </div>
</template>


<script>
export default {
  name: "examItemClassList",
  data() {
    return {
      selectTabName:'',
      loading: false,
      gradeList:[],
      gradeAllList:[],
      classTestType:1,
    };
  },
  methods: {
    selectTabs(name){
      console.log(name)
      this.selectTabName = name;
      sessionStorage.setItem('examItemClassList-selectTabName',this.selectTabName);
      this.getexamItemList()
    },
    goConfigure(){
      this.$router.push({ name: 'examItemClassListHealthconfigure' })
    },
    getexamItemList() {
      var vm = this;
      vm.loading = true;
      this.$axios.get(`/v1/examtest/getExamClassList?gradeId=${vm.selectTabName}&classTestType=${vm.classTestType}`,)
        .then(res => {
          vm.loading = false;
        if (res.data.code == 10000) {
          vm.gradeAllList = res.data.response
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
  },
  watch: {
    
  },
  created() {},
  beforeDestroy() {},
  mounted() {
    var vm = this;
    let type = sessionStorage.getItem('schoolType');
    /**1 幼儿园 2小学 3初中 4高中 5大学 6教育局'**/
    if(type == 2){
      vm.gradeList = [
        {val:'一年级',gradeId:'1'},
        {val:'二年级',gradeId:'2'},
        {val:'三年级',gradeId:'3'},
        {val:'四年级',gradeId:'4'},
        {val:'五年级',gradeId:'5'},
        {val:'六年级',gradeId:'6'},
      ]
    }else if(type == 3){
      vm.gradeList = [
        {val:'七年级',gradeId:'7'},
        {val:'八年级',gradeId:'8'},
        {val:'九年级',gradeId:'9'}
      ]
    }else if(type == 4){
      vm.gradeList = [
        {val:'高一',gradeId:'10'},
        {val:'高二',gradeId:'11'},
        {val:'高三',gradeId:'12'}
      ]
    }else{
      console.log("学校类型有误")
    }
    vm.selectTabName = vm.gradeList[0].gradeId;
    sessionStorage.setItem('examItemClassList-selectTabName',vm.selectTabName);
    vm.getexamItemList()
  }
};
</script>