<style>
.demo-upload-list {
  display: inline-block;
  width: 160px;
  height: 160px;
  text-align: center;
  line-height: 160px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
<template>
  <div style="padding-left:10px;">
  <div>
    <h2 style="margin-top:15px;margin-bottom:13px;">考核项目配置</h2>
  </div>
    <Card :dis-hover="true">
      <div style='font-size:20px;line-height:40px;margin-bottom:10px;'  >项目名称：{{classTestName}}</div>
      <Tabs type="card">
        <TabPane :label="item.examItemName" v-for="(item,index) in examList">
          <Form :label-width="150" >
            <FormItem label="项目类型：" >
              <p style="width:700px;">{{item.examItemType==1?"按成绩得分":item.examItemType==2?"直接打分":item.examItemType==3?"占比打分":"等级得分"}}</p>
            </FormItem>
            <FormItem label="考核占比：" v-if="item.examItemType==3">
              <p style="width:700px;">{{item.examItemPercent}} %</p>
            </FormItem>
            <FormItem v-if="(item.testMethodsRemark != null && item.testMethodsRemark != '' ) || (item.methodList != null && item.methodList.length > 0 )" label="测试方法：" >
              <p v-if="item.testMethodsRemark != null && item.testMethodsRemark != ''" style="width:700px;">{{item.testMethodsRemark}}</p>
              <div v-if="item.methodList != null && item.methodList.length > 0">
                <div v-for="image ,indexm in item.methodList" style="display: inline-block">
                  <div v-if="indexm==0">
                    <div class="demo-upload-list">
                      <img :src="image.pictureAddr" v-if="image.resourceType==1" />
                      <video :src="image.pictureAddr" v-else controls="controls"></video>
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(image)"></Icon>
                      </div>
                    </div>
                  </div>
                  <div v-if="indexm>0" style="margin-left:80px;">
                    <div class="demo-upload-list">
                      <img :src="image.pictureAddr" v-if="image.resourceType==1" />
                      <video :src="image.pictureAddr" v-else ></video>
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(image)"></Icon>
                      </div>
                    </div>
                  </div>
                  <p  v-if="indexm==0" style="text-align: center;">{{image.pictureRemark}}</p>
                  <p v-if="indexm>0" style="text-align: center;margin-left:80px;">{{image.pictureRemark}}</p>
                </div>
              </div>
            </FormItem>
            <FormItem v-if="(item.testRequireRemark != null && item.testRequireRemark != '') || (item.requireList != null && item.requireList.length >0)" label="测试要求：" >
              <p v-if="item.testRequireRemark != null && item.testRequireRemark != ''" style="width:700px;">{{item.testRequireRemark}}</p>
              <div v-if="item.requireList != null && item.requireList.length >0" >
                <div v-for="image ,indexm in item.requireList" style="display: inline-block">
                  <div v-if="indexm==0">
                    <div class="demo-upload-list">
                      <img :src="image.pictureAddr" v-if="image.resourceType==1" />
                      <video :src="image.pictureAddr" v-else controls="controls"></video>
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(image)"></Icon>
                      </div>
                    </div>
                  </div>
                  <div v-if="indexm>0" style="margin-left:80px;">
                    <div class="demo-upload-list">
                      <img :src="image.pictureAddr" v-if="image.resourceType==1" />
                      <video :src="image.pictureAddr" v-else ></video>
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(image)"></Icon>
                      </div>
                    </div>
                  </div>
                  <p  v-if="indexm==0" style="text-align: center;">{{image.pictureRemark}}</p>
                  <p v-if="indexm>0" style="text-align: center;margin-left:80px;">{{image.pictureRemark}}</p>
                </div>
              </div>
            </FormItem>
            <FormItem v-if="(item.testStandardRemark != '' && item.testStandardRemark != null) || (item.standardVOS.length > 0)" label="达标测试评分标准：" >
              <p v-if="item.testStandardRemark != '' && item.testStandardRemark != null" style="width:700px;">{{item.testStandardRemark}}</p>
              <div v-if=" item.standardVOS.length > 0" >
                <Row>
                  <div style>
                    <Table border  :columns="resultColumns" :data="item.standardVOS"></Table>
                  </div>
                </Row>
              </div>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
   <Card  :dis-hover="true"> 
      <div >
          <div style="height:46px;width:100%;line-height:46px;font-size:16px;padding-left:10px;">
              选择考试班级
          </div>
          <div style="padding-top:10px;">
            <div  style="line-height:40px;"  v-for="grade in gradeList">
              <div style="float:left;text-align:right;width:100px;" v-if="grade.list != null && grade.list.length>0" >{{grade.gradeName}}：</div>
              <div style="margin-left:100px;">
                <CheckboxGroup v-model="classIds" v-if="grade.list != null && grade.list.length>0" >
                  <Checkbox :label="item.classId" v-for="item in grade.list" style="margin-left:20px;">
                    {{item.studentClass}}班
                    <Button type="success" size="small" style="margin-left:10px;" @click="viewDetail(grade.gradeName,item.studentClass,item.classId)" >已选项目</Button>
                    </Checkbox>
                </CheckboxGroup>
              </div>
            </div>
        </div>
      </div>
        <div style="padding-bottom:40px;margin-left:45%;margin-top:10px;">
    <Button type="success" @click="baseSubmit" >保存</Button>
    <Button type="success" @click="goback" style="margin-left:40px">返回</Button>
  </div>
    </Card>

    <Modal title="预览" v-model="visible">
      <img :src="viewUrl" v-if="resourceType==1" style="width: 100%" />
                    <video :src="viewUrl" v-else controls="controls"  style="width: 100%">
                    </video>
    </Modal>
    <Modal v-model="modal2" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <span>{{modal2Title}}</span>
        </p>
        <div v-if="testClassListTf">
              <h4 style="margin-left:0px;">运动技能</h4>
                    <p style="margin-left:20px;margin-top:20px;" v-if="skillTf">
                      <div style="width:60px;float:left;text-align:right">男生：</div>
                      <div  style="margin-left:60px">
                          <div style="margin-left:20px;" v-for="item in testClassList" v-if="item.gender == 1 && item.classTestType==2">{{item.classTestName}}</div>
                      </div>
                    </p>
                    <p style="margin-left:20px;margin-top:20px;" v-if="!skillTf">
                      <span>暂无考试内容</span>
                    </p>
                    <p style="margin-left:20px;margin-top:20px;" v-if="skillTf">
                      <div style="width:60px;float:left;text-align:right">女生：</div>
                      <div  style="margin-left:60px">
                          <div style="margin-left:20px;" v-for="item in testClassList" v-if="item.gender == 2 && item.classTestType==2">{{item.classTestName}}</div>
                      </div>
                      
                    </p>
            <h4 style="margin-left:0px;margin-top:20px;">健康知识</h4>
                     <p style="margin-left:20px;margin-top:20px;" v-if="knowledgeTf">
                      <div style="width:60px;float:left;text-align:right">男生：</div>
                      <div  style="margin-left:60px">
                        <div style="margin-left:20px;" v-for="item in testClassList" v-if="item.gender == 1 && item.classTestType==1">{{item.classTestName}}</div>
                      </div>
                    </p>
                    <p style="margin-left:20px;margin-top:20px;" v-if="knowledgeTf">
                      <div style="width:60px;float:left;text-align:right">女生：</div>
                      <div  style="margin-left:60px">
                        <div style="margin-left:20px;" v-for="item in testClassList" v-if="item.gender == 2 && item.classTestType==1">{{item.classTestName}}</div>
                      </div>
                    </p>
                     <p style="margin-left:20px;margin-top:20px;" v-if="!knowledgeTf">
                      <span>暂无考试内容</span>
                    </p>
        </div>
        <div v-if="!testClassListTf">
              <h4 style="margin-left:20px;">运动技能</h4>
                    <p style="margin-left:20px;margin-top:20px;">
                      <span>暂无考试内容</span>
                    </p>
                    
            <h4 style="margin-left:20px;margin-top:20px;">健康知识</h4>
                     <p style="margin-left:20px;margin-top:20px;">
                      <span>暂无考试内容</span>
                    </p>
                   
        </div>
        <div slot="footer">
            <Button type="success" size="large" long @click="cancle">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "test",
  data() {
    return {
      modal2:false,
      modal2Title:'',
      visible: false,
      viewUrl: "",
      classTestId: "",
      classTestName: "",
      disabled: false,
      examList: [],
      classIds: [],
      gradeList: [],
      resourceType:'1',
      primary:[
        {
          title: "得分等级",
          key: "standardName",
          align: "center",
          fixed: "left",
          width: 100
        },
        {
          title: "一年级男",
          key: "x1b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "一年级女",
          key: "x1g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "二年级男",
          key: "x2b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "二年级女",
          key: "x2g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "三年级男",
          key: "x3b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "三年级女",
          key: "x3g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "四年级男",
          key: "x4b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "四年级女",
          key: "x4g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "五年级男",
          key: "x5b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "五年级女",
          key: "x5g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "六年级男",
          key: "x6b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "六年级女",
          key: "x6g",
          align: "center",
          width: 140,
          type: "html"
        },
      ],
      middle:[
        {
          title: "得分等级",
          key: "standardName",
          align: "center",
          fixed: "left",
          width: 100
        },
        {
          title: "七年级男",
          key: "c1b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "七年级女",
          key: "c1g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "八年级男",
          key: "c2b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "八年级女",
          key: "c2g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "九年级男",
          key: "c3b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "九年级女",
          key: "c3g",
          align: "center",
          width: 140,
          type: "html"
        },
      ],
      high:[
        {
          title: "得分等级",
          key: "standardName",
          align: "center",
          fixed: "left",
          width: 100
        },
        {
          title: "高一男",
          key: "g1b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "高一女",
          key: "g1g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "高二男",
          key: "g2b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "高二女",
          key: "g2g",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "高三男",
          key: "g3b",
          align: "center",
          width: 140,
          type: "html"
        },
        {
          title: "高三女",
          key: "g3g",
          align: "center",
          width: 140,
          type: "html"
        },
      ],
      college:[
        {
          title: "得分等级",
          key: "standardName",
          align: "center",
          fixed: "left",
          width: 100
        },
        {
          title: "大学男",
          key: "d1b",
          align: "center",
          width: 140,
          type: "html"
        },

        {
          title: "大学女",
          key: "d1g",
          align: "center",
          width: 140,
          type: "html"
        },
      ],
      resultColumns: [],
      testClassList:[],
      testClassListTf:false,
      skillTf:false,
       knowledgeTf:false,
       	examItemType:[
        {
          name:"按成绩得分",
          value:"1"
        },
        {
          name:"直接打分",
          value:"2"
        },
        {
          name:"占比打分",
          value:"3"
        },
        {
          name:"等级得分",
          value:"4"
        },
      ],
    };
  },
  watch: {}, //以V-model绑定数据时使用的数据变化监测

  methods: {
     handleView (file) {
                var vm=this;
                // console.log(file)
                vm.viewUrl=file.pictureAddr;
                vm.resourceType=file.resourceType;
                vm.visible=true;
            },
    getClassTestDetail(classTestId) {
      var vm = this;
      this.$axios
        .get("/v1/examtest/getClassTestDetail?classTestId=" + classTestId)
        .then(function(response) {
          // console.log(response);
          let detailInfo = response.data.response;
          vm.classTestName = detailInfo.classTestName;
          vm.examList = detailInfo.examList ? detailInfo.examList : [];
          vm.classIds = detailInfo.classIds ? detailInfo.classIds : [];
          vm.gradeList = detailInfo.gradeList ? detailInfo.gradeList : [];
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getClassTestClassInfo(classId) {
      var vm = this;
      this.$axios
        .get("/v1/examtest/getClassTestClassInfo?classId=" + classId)
        .then(function(response) {
          let detailInfo = response.data.response;
          vm.testClassList = detailInfo ? detailInfo : [];
          if(detailInfo && detailInfo.length>0){
            vm.testClassListTf=true;
            vm.skillTf=false;
             vm.knowledgeTf=false;
            for(var i=0;i<detailInfo.length;i++){
                if(detailInfo[i].classTestType==2){
                  vm.skillTf=true
                }else{
                  vm.knowledgeTf=true;
                }
            }

          }else{
            vm.testClassListTf=false
          }
          vm.modal2=true
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    viewDetail(gradeName,studentClass,classId){
      var vm=this;
      vm.testClassList=[];
      vm.modal2Title=gradeName+'、'+studentClass+'班考核项目';
      vm.getClassTestClassInfo(classId);
    },
    cancle(){
      var vm=this;
      vm.modal2=false;
    },
    baseSubmit() {
      var vm = this;
      let data = {
        "classIds": vm.classIds,
        "classTestId": vm.classTestId
      };
      this.$axios
        .post("/v1/examtest/upsertTestClassIds", data)
        .then(function(response) {
          // console.log(response);
          if (response.data.code == 10000) {
            let numCode = response.data.response.code;
            if (numCode == "1") {
              vm.$Message.info("保存成功！");
              // vm.getClassTestDetail(vm.classTestId);
            } else {
              vm.$Message.error(response.data.response.msg);
            }
          } else {
            vm.$Message.info("保存失败！");
          }
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    goback() {
      this.$router.go(-1);
    }
  },
  mounted() {
    var vm = this;
    if(sessionStorage.getItem("schoolType")==2){
      vm.resultColumns=vm.primary;
    }
    if(sessionStorage.getItem("schoolType")==3){
      vm.resultColumns=vm.middle;
    }
    if(sessionStorage.getItem("schoolType")==4){
      vm.resultColumns=vm.high;
    }
    if(sessionStorage.getItem("schoolType")==5){
      vm.resultColumns=vm.college;
    }
    vm.classTestId = sessionStorage.getItem("examItemManage1-examItemDetail1-classTestId" );
    vm.getClassTestDetail( sessionStorage.getItem("examItemManage1-examItemDetail1-classTestId") );
  },
  destroyed() {
    var vm = this;
  }
};
</script>