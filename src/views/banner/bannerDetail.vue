<style>
.demo-upload-list {
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
    <div style="margin-left:15px;">
        <Tabs type="card">

            <TabPane label="轮播图详情">
                <Card>
                    <Form :label-width="100" class="function">

                        <FormItem label="轮播名称：" class="functionItem">
                            <Input v-model="bannerName" size="small" placeholder="轮播图名称" style="width:180px;"></Input>
                        </FormItem>
                        <FormItem label="跳转状态：" class="functionItem">
                            <Select v-model="herfStatus" size="small" style="width:180px;">
                                <Option v-for="item in herfList" :value="item.status" :key="item.status">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="轮播类型：" class="functionItem">
                            <Select v-model="bannerType" size="small" style="width:180px;">
                                <Option v-for="item in bannerTypeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="排序：" class="functionItem">
                            <Input v-model="bannerSort" size="small" placeholder="排序" style="width:180px;"></Input>
                        </FormItem>
                        <FormItem label="跳转地址：" class="functionItem">
                            <Input v-model="herfUrl" size="small" placeholder="跳转地址" style="width:180px;"></Input>
                        </FormItem>
                        <FormItem label="启用状态：" class="functionItem">
                            <RadioGroup v-model="enableStatus">
                                <Radio label="1">启用</Radio>
                                <Radio label="2">关闭</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="轮播图片：" class="functionItem">
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
                            <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" name="muFiles" :action="updateUrl" style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="View Image" v-model="visible">
                                <img :src="imgUrl" v-if="visible" style="width: 100%">
                            </Modal>
                        </FormItem>
                    </Form>
                </Card>
                <div style="margin-top:10px;text-align:center">
                    <Button @click="pageToList" type="success" style="margin-right:50px;">返回</Button>
                    <Button @click="baseSubmit" type="success">提交结果</Button>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      updateUrl: '',
      bannerId: '',
      bannerName: '',
      herfStatus: '',
      herfList: [
        {
          status: '1',
          label: '跳转'
        },
        {
          status: '2',
          label: '不跳转'
        }
      ],
      bannerType: '',
      bannerTypeList: [
        {
          type: '1',
          name: '宣传图'
        },
        {
          type: '2',
          name: '广告'
        }
      ],
      bannerSort: '',
      enableStatus: '1',
      herfUrl: '',
      imgUrl: '',
      photos: [],
      visible: false,
      defaultList: []
    }
  },
  watch: {}, //以V-model绑定数据时使用的数据变化监测

  created: function() {},
  methods: {
    pageToList() {
      //返回
      this.$router.go(-1)
    },
    getBannerBaseInfoByBannerId(bannerId) {
      var that = this
      this.$axios
        .get('/v1/banner/getBannerBaseInfoByBannerId?bannerId=' + bannerId)
        .then(function(response) {
          console.log(response)
          let data = response.data.response
          //   console.log(data)
          that.bannerName = data.bannerName ? data.bannerName : ''
          that.bannerSort = data.bannerSort ? data.bannerSort : ''
          that.bannerType = data.bannerType ? data.bannerType : ''
          that.enableStatus = data.enableStatus ? data.enableStatus : ''
          that.herfStatus = data.herfStatus ? data.herfStatus : ''
          that.imgUrl = data.imgUrl ? data.imgUrl : ''
          that.herfUrl = data.jumpUrl ? data.jumpUrl : ''
          if (data.imgUrl) {
            let param = {
              name: new Date().getTime(),
              url: data.imgUrl,
              status: 'finished'
            }
            that.photos.push(param)
          }
        })
        .catch(function(response) {
          console.log(response)
        })
    },
    baseSubmit() {
      var that = this

      let data = {
        bannerId: that.bannerId,
        bannerName: that.bannerName,
        bannerSort:that.bannerSort,
        bannerType: that.bannerType,
        enableStatus: that.enableStatus,
        herfStatus: that.herfStatus,
        imgUrl: that.imgUrl,
        jumpUrl: that.herfUrl,
        schoolId: sessionStorage.getItem('schoolId')
      }
      this.$axios
        .post('/v1/banner/upsertBannerInfo', data)
        .then(function(response) {
          console.log(response)
          if (response.data.response == '1') {
            that.$Message.info('提交成功')
            // that.$router.go(-1) 
          } else {
            that.$Message.info('提交失败')
          }
        })
        .catch(function(response) {
          console.log(response)
          that.$Message.info('提交失败')
        })
    },

    handleView(item) {
      var vm = this
      vm.visible = true
      console.log(item)
      vm.visiUrl = item.url
    },
    handleRemove(file) {
      var vm = this
      const photos = vm.photos
      photos.splice(photos.indexOf(file), 1)
    },
    handleSuccess(res, file) {
      var vm = this
      vm.photos = []
      file.url = res.response[0]
      vm.imgUrl = res.response[0]
      vm.photos.push(file)
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '图片格式错误',
        desc: '图片 ' + file.name + ' 格式错误, 请检查'
      })
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '图片大小超出限制',
        desc: '图片  ' + file.name + '大小超出限制'
      })
    },
    handleBeforeUpload() {
      var vm = this
      const check = this.photos.length < 2
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传一张照片'
        })
      }
      return check
    }
  },
  mounted() {
    var vm = this
    vm.updateUrl =
      this.$axios.defaults.baseURL + '/v1/file/upload?type=manage_img'
    let bannerId = sessionStorage.getItem('baseConfig-bannerManage-bannerId')
    vm.bannerId = bannerId
    if (bannerId) {
      vm.getBannerBaseInfoByBannerId(bannerId)
    }
  },
  destroyed() {
    // tinymce.get('articleEditor').destroy();
  }
}
</script>
