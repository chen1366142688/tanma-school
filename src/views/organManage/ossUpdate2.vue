<style scoped>
  .oss_file{
    width:100%;
    height:100%;
  }
  .oss_file input{
    width:100%;
    height:100%;
  }
  .oss_file img{
    width:200px;
    height:200px;
  }
</style>

<template>
    <div class="oss_file">
      <input type="file" :id="id" @change="doUpload"  multiple="multiple"/>
      <img :src="url" alt="">
    </div>
</template>

<script>
import OSS from 'ali-oss'

export default {
  name: "ossUpdate",
  props: {
    
  },
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
        var timestamp = (new Date()).valueOf();
        //上次请求STS的时间和当前时间的时间差
        let second = parseInt((timestamp - localStorage.getItem('overTimes')) / 1000/60);
        this.$axios.get('/v1/file/getOssFileUploadToken',).then((result) => {
          this.overTimes = result.data.response.overTimes;
          localStorage.setItem('overTimes',result.data.response.overTimes)
          this.bucket = result.data.response.bucket;
          let info = {
              region: result.data.response.region,
              accessKeyId: result.data.response.accessKeyId,
              accessKeySecret: result.data.response.accessKeySecret,
              stsToken: result.data.response.securityToken,
              bucket: result.data.response.bucket,
              secure:true
          }
          let client = new OSS(info);
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
                  console.log(percentage);
                  // 上传进度
                  _this.percentage = percentage
                }

              }).then((results) => {
                  console.log(results);
                  // this.url = results.res.requestUrls[0]
                 }).catch((err) => { console.log(err) }) 
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
