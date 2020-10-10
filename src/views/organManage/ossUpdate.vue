<style>
</style>

<template>
  <div class="systemBaseConfigClass" style="padding-left:10px;">
    <div class="oss_file">
      <input type="file" :id="id" @change="doUpload"  multiple="multiple"/>
      <img :src="url" alt="">
    </div>
  </div>
</template>

<script>
import OSS from 'ali-oss'
export default {
  name: "oss",
  data() {
    return {
      client: null,
      overTimes:0,
      percentage: 0,
      id: 'upload',
      url:'',
    };
  },
  methods: {
    doUpload () {
        const _this = this;
        const urls = [];
        this.$axios.get('/v1/file/getOssFileUploadToken',).then((result) => {
          console.log(result);
          this.overTimes = result.overTimes;
          this.bucket = result.bucket;
          const client = new OSS.Wrapper(
          {
              region: result.region,
              accessKeyId: result.accessKeyId,
              accessKeySecret: result.accessKeySecret,
              bucket: result.bucket,
              stsToken: result.securityToken
          })
         _this.percentage = 0;
          const files = document.getElementById(_this.id)
          if (files.files) {
            const fileLen = document.getElementById(_this.id).files
            let resultUpload = ''
            for (let i = 0; i < fileLen.length; i++) {
              const file = fileLen[i]
              // 随机命名
              let random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop()
              // 上传
              client.multipartUpload(random_name, file, {
                progress: function* (percentage, cpt) {
                  // 上传进度
                  _this.percentage = percentage
                }
              }).then((results) => {
                // 上传完成
                const url = `http://${_this.bucket}.oss-cn-hangzhou.aliyuncs.com/`+ results.name; 
                _this.$store.dispatch("changeUrl", _this.url);
                 _this.url = url; console.log(url); }).catch((err) => { console.log(err) }) 
                 } 
          } 
      }) 
    }, 

    // 随机生成文件名  
    random_string(len) { 　　
      len = len || 32; 　　
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 　　
      var maxPos = chars.length; 　　
      var pwd = ''; 　　
      for (let i = 0; i < len; i++) { 　　
        pwd += chars.charAt(Math.floor(Math.random() * maxPos)); 
        } 
        return pwd;
    } 
},
  mounted() {
  }
};
</script>
