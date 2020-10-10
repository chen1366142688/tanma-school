<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

<template>
  <div style="padding-left:10px;">
    <div>
      <h2 style="margin-top:15px;margin-bottom:13px;">学生免试详情</h2>
    </div>
                <Card>
                    <Form :label-width="100" class="function">

                        <FormItem label="学生姓名：" class="functionItem">
                            <span style="margin-left:4px;">{{studentName}}</span>
                        </FormItem>
                        <FormItem label="学籍号：" class="functionItem">
                            <span style="margin-left:4px;">{{registerCode}}</span>
                        </FormItem>
                        <FormItem label="学年测试：" class="functionItem">
                            <span style="margin-left:4px;">{{activityName}}</span>
                        </FormItem>
                        <FormItem label="年级：" class="functionItem">
                            <span style="margin-left:4px;">{{startSchool}}级</span>
                        </FormItem>
                        <FormItem label="班级：" class="functionItem">
                            <span style="margin-left:4px;">{{studentClass}}班</span>
                        </FormItem>
                        <FormItem label="性别：" class="functionItem">
                            <span style="margin-left:4px;">{{gender=='1'?'男':'女'}}</span>
                        </FormItem>
                        <FormItem label="免试状态：" class="functionItem">
                            <RadioGroup v-model="exemptStatus" >
                                <Radio label="需测试"></Radio>
                                <Radio label="免试"></Radio>
                            </RadioGroup>
                        </FormItem>
                         <FormItem label="免试类型：" class="functionItem" v-if="exemptTf">
                           <Select v-model="exemptType" size="small" style="width:180px;">
                                <Option v-for="item in exemptTypeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="免试说明：" class="functionItem" v-if="exemptTf">
                             <Input v-model="remark" type="textarea" :autosize="{minRows: 4,maxRows: 8}" style="width:750px;" />
                        </FormItem>
                        <FormItem label="相关证明：" class="functionItem" v-if="exemptTf">
                             <div class="demo-upload-list" v-for="item in photos">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                ref="upload"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleSuccess"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUpload"
                                multiple
                                type="drag"
                                name="muFiles"
                                :action="updateUrl"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="" v-model="visible" ok-text="关闭" cancel-text="">
                                <img :src="visiUrl" v-if="visible" style="width: 100%">
                            </Modal>
                        </FormItem>
                    </Form>
                </Card>
               <div style="margin-top:10px;padding-left:40%">
                <Button @click="pageToList" style="float:left; margin-right:50px;width:100px" type="success">返回</Button>
                <div style="width:20px;" ></div>
                <Button  style="float:left;width:100px" @click="baseSubmit"   type="success">保存</Button>
             </div>
             <Modal
                v-model="modal1"
                title="温馨提示"
                @on-ok="ok"
                @on-cancel="cancel">
                <p>是否删除该图片？</p>
            </Modal>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
        modal1:false,
        updateUrl:'',
        activityId:'',
        studentId:'',
      studentName:'',
      registerCode:'',
      activityName:'',
      gradeName:'',
      startSchool:'',
      studentClass:'',
      majorName:'',
      gender:'',
      exemptStatus:'',
      exemptTf:false,
      exemptTypeList:[
          {
              type:"1",
              name:"疾病"
          },
          {
              type:"2",
              name:"残疾"
          }
      ],
      exemptType:'1',
      remark:'',
      photos:[],
      defaultList:[],
      visible:false,
      visiUrl:'',
      canSubmit:false,
      deleteFile:{},
    }
  },
  watch: {
      exemptStatus:function(){
          var vm=this;
         vm.exemptTf= vm.exemptStatus == '免试' ? true : false;
         vm.canSubmit= vm.exemptStatus == '免试' ? false : true;
      },
  }, //以V-model绑定数据时使用的数据变化监测

  created: function() {},
  methods: {
    pageToList(){ //返回
        this.$router.go(-1);
    },
    getStudentExemptDetail(activityId,studentId) {
      var that = this
      this.$axios
        .get(
          '/v1/student/getStudentExemptDetail?activityId='+activityId+'&studentId='+studentId
        )
        .then(function(response) {
          //   console.log(response)
          let data = response.data.response
          //   console.log(data)
          that.studentName = data.studentName ? data.studentName : '';
          that.registerCode = data.registerCode ? data.registerCode : '';
          that.activityName = data.activityName ? data.activityName : '';
          that.gradeName = data.gradeName ? data.gradeName : '';
          that.startSchool = data.startSchool ? data.startSchool : '';
          that.studentClass = data.studentClass ? data.studentClass : '';
          that.majorName = data.majorName ? data.majorName : '';
          that.gender = data.gender ? data.gender : '';
          that.exemptType = data.exemptType ? data.exemptType : '';
          that.exemptStatus = data.exemptId ? '免试' : '需测试';
          that.remark = data.remark ;
          that.photos = data.photos ? data.photos : [];
          if(that.photos){
             var list=[];

              for(let i=0;i<that.photos.length;i++){
                  let param={
                      name:new Date().getTime(),
                      url:that.photos[i],
                      status:"finished"
                  }
                  list.push(param);
              }
              that.photos=list;
          }
        //   that.studentAge = data.studentAge ? data.studentAge : ''
        })
        .catch(function(response) {
          console.log(response)
        })
    },
    baseSubmit() {
      var that = this

      let list=that.photos;
      let arr=[];
      if(list){
          for(let i=0;i<list.length;i++){
              arr.push(list[i].url)
          }
      }
      let haveExempt = that.exemptStatus == '免试'?"1":"0";
      if(haveExempt=='1'){
        if(that.exemptType == "" || that.exemptType==null){
            that.$Message.info("请选择免试类型！")
            return false;
        }
        if(that.remark == "" || that.remark==null){
            that.$Message.info("请填写免试说明！")
            return false;
        }
        if(arr.length <= 0 ){
            that.$Message.info("请上传相关证明材料图片！")
            return false;
        }
      }
      let data={
        "activityId": that.activityId,
        "exemptType":that.exemptType,
        "photos": arr,
        "remark": that.remark,
        "studentId": that.studentId,
        "haveExempt":haveExempt
      }
      this.$axios
        .post(
          '/v1/student/upsertExemptDetail',data
        )
        .then(function(response) {
        //   console.log(response)
          if(response.data.response=='1'){
              that.$Message.info("提交成功")
              that.$router.go(-1);
          }else{
              that.$Message.info("提交失败")
          }
        })
        .catch(function(response) {
          console.log(response)
          that.$Message.info("提交失败")
        })
    },


    handleView (item) {
                var vm=this;
                vm.visible = true;
                // console.log(item)
                vm.visiUrl=item.url
            },
            handleRemove (file) {
                var vm=this;
                vm.deleteFile=file;
                vm.modal1=true;

            },
            ok () {
                var vm=this;
                const photos = vm.photos;
                photos.splice(photos.indexOf(vm.deleteFile), 1);
            },
            cancel () {
            },
            handleSuccess (res, file) {
                var vm=this;
                // console.log(res)
                // console.log(file)
                file.url=res.response[0];

                vm.photos.push(file)

            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片格式错误',
                    desc: '图片 ' + file.name + ' 格式错误, 请检查'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '图片大小超出限制',
                    desc: '图片  ' + file.name + '大小超出限制'
                });
            },
            handleBeforeUpload () {
                const check = this.photos.length < 10;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传十张照片'
                    });
                }
                return check;
            }
  },
  mounted() {
    var vm = this;
    vm.updateUrl =this.$axios.defaults.baseURL + '/v1/file/upload?type=manage_img';
    let activityId = sessionStorage.getItem(
      'studentManage-studentExemptDetail-activityId'
    );
    let studentId=sessionStorage.getItem("studentManage-studentExemptDetail-studentId");
    vm.studentId=studentId;
    vm.activityId=activityId;
    vm.getStudentExemptDetail(activityId,studentId);

  },
  destroyed() {
    // tinymce.get('articleEditor').destroy();
  }
}
</script>
