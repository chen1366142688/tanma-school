<style>
    .class-photo-list{
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 115px;
        border: 1px solid transparent;      
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .class-photo-list img{
        width: 100%;
        height: 100%;      
    }
    .class-photo-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .class-photo-list:hover .class-photo-list-cover{
        display: block;
    }
    .class-photo-list-cover i{
        color: #fff;
        font-size: 25px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
<template>
  <div style="margin-left:15px;">
        <div>
            <h1>消息发送</h1>
        </div>
        <Card style="margin-top:15px;">
          <Form :label-width="140" class="function">
            <FormItem label="提醒方式：" class="functionItem">
              <Select :disabled="disTf" v-model="notifyType" size="small" style="width:180px;">
                <Option
                  v-for="item in notifyTypeList"
                  :value="item.type"
                  :key="item.type"
                  :disabled="disTf"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="标题：" class="functionItem">
              <Input :maxlength="12" 
                :disabled="disTf"
                v-model="pushTitle"
                size="small"
                placeholder="标题"
                style="width:200px;"
              ></Input> 不超过12个字
            </FormItem>
            <FormItem label="内容：" class="functionItem">
              <Input :maxlength="100"  
                type="textarea"
                :disabled="disTf"
                v-model="pushText"
                size="small"
                placeholder="内容"
                style="width:600px;"
              ></Input> 不超过100个字
            </FormItem>
            <FormItem label="消息图片：" class="functionItem" v-if="imgUrl != '' || !disTf">
                    <div  class="class-photo-list" v-if="imgUrl!=''" :style="imgStyle">
                            <img style="width: 120px;height:120px;" :src="imgUrl" >
                            <div class="class-photo-list-cover">                                           
                                <Icon type="ios-eye-outline" @click.native="handleView(imgUrl)"></Icon>
                            </div>
                    </div>
                    <Upload v-if="!disTf"  ref="upload"
                            :show-upload-list="false"
                            :on-success="uploadFileSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="80048"
                            :action="updateUrl"
                            name="muFiles"
                            type="drag"
                            style="display: inline-block;width:100px;">
                        <div  style="width: 100px;height:100px;line-height: 115px;">
                            <Icon  type="ios-cloud-upload-outline" size="35"></Icon>上传图片
                        </div>
                    </Upload>
                    <font v-if="!disTf" style="color:red;">推荐图片尺寸宽高比：16:6</font>                                                   
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
          <Button
            style="float:left;width:100px"
            @click="baseSubmit"
            type="success"
            v-if="!disTf"
          >发送</Button>
        </div>
    <Modal title="预览图片" cancel-text="" v-model="previewStatus" >
          <img :src="previewUrl" v-if="previewStatus" :style="imgStyle"/>
    </Modal>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      pushId: "",
      schoolId: "",
      pushType: "5",
      imgStyle:{
        width:'120px',
        height:'120px'
      },
      pushTypeList: [
        {
          type: "4",
          name: "广播"
        },
        {
          type: "5",
          name: "组播"
        }
      ],
      displayType: "",
      displayList: [
        {
          type: "1",
          name: "通知"
        },
        {
          type: "2",
          name: "消息"
        }
      ],
      notifyType:"1",
      notifyTypeList: [
        {
          type: "1",
          name: "消息"
        },
        {
          type: "5",
          name: "消息+弹窗"
        }
      ],
      pushTicker: "",
      pushTitle: "",
      pushText: "",
      androidBackData: "",
      iosBackData: "",
      disTf: false,
      groupTf:false,
      organtf:true,
      imgUrl:'',
      previewStatus : false,
      updateUrl:"",
    };
  },
  watch: {
  }, //以V-model绑定数据时使用的数据变化监测
  created: function() {},
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1);
    },
    uploadFileSuccess(response, file, fileList){//上传图片
      this.imgUrl  = response.response[0];
    },
    handleView (url) { //预览图片
      this.previewUrl = url;
      this.previewStatus = true;
    },
    getPushDetail(pushId) {
      var vm = this;
      this.$axios
        .get("/v1/push/getPushDetail?pushId=" + pushId)
        .then(function(response) {
          let data = response.data.response;
          vm.schoolId=data.schoolId;
          vm.pushType=data.pushType;
          vm.displayType=data.displayType;
          vm.pushTicker=data.pushTicker;
          vm.pushTitle=data.pushTitle;
          vm.pushText=data.pushText;
          vm.androidBackData=data.androidBackData;
          vm.iosBackData=data.iosBackData;
          vm.notifyType = data.notifyType;
          vm.imgUrl = data.imgUrl;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    getSchoolList() {
      var vm = this;
      this.$axios.get("/v1/unirun/getSchoolList").then(res => {
        if (res.data.code == 10000) {
          vm.schoolList = res.data.response;
        } else {
          if (res.data.code > 39999) {
            vm.$Message.info(res.data.msg);
          }
        }
      });
    },
    baseSubmit() {
      var vm = this;
      if (!vm.pushText) {
        vm.$Message.error("请输入推送内容");
        return false;
      }
      if (!vm.pushTitle) {
        vm.$Message.error("请输入推送标题");
        return false;
      }
      vm.pushTicker = vm.pushTitle;
     
      let data = {
        aliasType: "xiaoma",
        displayType: 1,
        pushId: vm.pushId,
        pushText: vm.pushText,
        pushTicker:vm.pushTicker,
        pushTitle: vm.pushTitle,
        pushType:5,
        sendType:1,
        notifyType:vm.notifyType,
        contentType:1,
        url:'',
        imgUrl:vm.imgUrl,
        schoolId: vm.schoolId
      };
      this.$axios
        .post("/v1/push/upsertPushDetail", data)
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
    }
  },
  mounted() {
    var vm = this;
    let pushId = sessionStorage.getItem("pushManage-pushDetail-pushId");
    vm.updateUrl=vm.$axios.defaults.baseURL+"/v1/file/upload?type=manage_img"; 
    vm.pushId = pushId;
    // vm.getSchoolList();
    if(pushId){
      vm.getPushDetail(pushId);
      vm.disTf=true;
    }
  },
  destroyed() {}
};
</script>
