<style>
    
</style>

<template>
<div>
    <div>
        <h1>跑步标准设置</h1>
    </div>
    <div style="margin-top:15px;">
                <Form ref="unirunInfo" :model="unirunInfo" :label-width="180">
                    <Card>
                    <FormItem label="男生标准：">
                        <Row> 
                            <Col span="20"> 
                            <Label>单次跑步时长限制：</Label>
                            <Input v-model="unirunInfo.boyOnceTimeMin" placeholder="最小时间"  style="width:100px" :maxlength="255" /> 
                            至&nbsp;
                            <Input v-model="unirunInfo.boyOnceTimeMax" placeholder="最大时间"  style="width:100px" :maxlength="255" />
                            &nbsp;分钟
                            </Col>
                        </Row> 
                        <Row style="margin-top:5px;"> 
                            <Col span="20"> 
                            <Label>单次跑步距离限制：</Label>
                            <Input v-model="unirunInfo.boyOnceDistanceMin" placeholder="最小公里"  style="width:100px" :maxlength="255" /> 
                            至&nbsp;
                            <Input v-model="unirunInfo.boyOnceDistanceMax" placeholder="最大公里"  style="width:100px" :maxlength="255" />
                            &nbsp;公里
                            </Col>
                        </Row>
                        <Row style="margin-top:30px;"> 
                            <Col span="20"> 
                            <Label>本学期最少跑步距离：</Label>
                            <Input v-model="unirunInfo.boyAllRunDistance" placeholder="最少公里"  style="width:100px;" :maxlength="255" /> 
                            &nbsp;公里
                            </Col>
                        </Row>
                        <Row style="margin-top:5px;"> 
                            <Col span="20"> 
                            <Label>本学期最少跑步次数：</Label>
                            <Input v-model="unirunInfo.boyAllRunTime" placeholder="最少次数"  style="width:100px" :maxlength="255" /> 
                            &nbsp;次
                            </Col>
                        </Row>
                    </FormItem>
                    </Card>
                     <Card>
                    <FormItem label="女生标准：">
                       <Row> 
                            <Col span="20"> 
                            <Label>单次跑步时长限制：</Label>
                            <Input v-model="unirunInfo.girlOnceTimeMin" placeholder="最小时间"  style="width:100px" :maxlength="255" /> 
                            至&nbsp;
                            <Input v-model="unirunInfo.girlOnceTimeMax" placeholder="最大时间"  style="width:100px" :maxlength="255" />
                            &nbsp;分钟
                            </Col>
                        </Row> 
                        <Row style="margin-top:5px;"> 
                            <Col span="20"> 
                            <Label>单次跑步距离限制：</Label>
                            <Input v-model="unirunInfo.girlOnceDistanceMin" placeholder="最小公里"  style="width:100px" :maxlength="255" /> 
                            至&nbsp;
                            <Input v-model="unirunInfo.girlOnceDistanceMax" placeholder="最大公里"  style="width:100px" :maxlength="255" />
                            &nbsp;公里
                            </Col>
                        </Row>
                        <Row style="margin-top:30px;"> 
                            <Col span="20"> 
                            <Label>本学期最少跑步距离：</Label>
                            <Input v-model="unirunInfo.girlAllRunDistance" placeholder="最少公里"  style="width:100px;" :maxlength="255" /> 
                            &nbsp;公里
                            </Col>
                        </Row>
                        <Row style="margin-top:5px;"> 
                            <Col span="20"> 
                            <Label>本学期最少跑步次数：</Label>
                            <Input v-model="unirunInfo.girlAllRunTime" placeholder="最少次数"  style="width:100px" :maxlength="255" /> 
                            &nbsp;次
                            </Col>
                        </Row>
                    </FormItem>     
                     </Card>     
                      <Card>
                    <FormItem label="跑步有效起止日期：">
                        <Row> 
                           <Col span="20"> 
                            <Label>上半年：</Label>
                            <Select v-model="firstSemesterDateStart_month" placeholder="月" style="width:60px">
                                <Option v-for="item in months" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            月
                            <Select v-model="firstSemesterDateStart_day" placeholder="日" style="width:60px">
                                <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            日
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至
                            <Select v-model="firstSemesterDateEnd_month"  @on-change="semesterDateEndChange"  placeholder="月" style="width:60px;margin-left:20px;">
                                <Option v-for="item in months" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            月
                            <Select v-model="firstSemesterDateEnd_day" placeholder="日" style="width:60px">
                                <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            日
                            </Col>
                        </Row> 
                        <Row style="margin-top:5px;"> 
                            <Col span="20"> 
                            <Label>下半年：</Label>
                            <Select v-model="secondSemesterDateStart_month"  @on-change="semesterDateEndChange"  placeholder="月" style="width:60px">
                                <Option v-for="item in months" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            月
                            <Select v-model="secondSemesterDateStart_day" placeholder="日" style="width:60px">
                                <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            日<font style="color:red;" >{{showyearS}}</font>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至
                            <Select v-model="secondSemesterDateEnd_month" @on-change="semesterDateEndChange" placeholder="月" style="width:60px;margin-left:20px;">
                                <Option v-for="item in months" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            月
                            <Select v-model="secondSemesterDateEnd_day" placeholder="日" style="width:60px">
                                <Option v-for="item in days" :value="item.value" :key="item.value">{{ item.name }}</Option>
                            </Select>
                            日
                            <font style="color:red;" >{{showyear}}</font>
                            </Col>
                        </Row>
                    </FormItem>     
                     </Card>     
                    <Row>
                        <div style="margin-top:10px;padding-left:46%">
                            <Button  style="float:left;width:100px" @click="saveSchoolStandard"  type="success">保存</Button>
                        </div>    
                    </Row>                                                                                                        
            </Form>
    </div>
</div>
</template>

<script>

import md5 from 'js-md5';

export default {
    name: 'organInfo'
    ,data(){
        return {
            unirunInfo:{
                schoolId:'',
                boyOnceTimeMin:"",
                boyOnceTimeMax:"",
                boyOnceDistanceMin:"",
                boyOnceDistanceMax:"",
                boyAllRunDistance:"",
                boyAllRunTime:"",
                girlOnceTimeMin:"",
                girlOnceTimeMax:"",
                girlOnceDistanceMin:"",
                girlOnceDistanceMax:"",
                girlAllRunDistance:"",
                girlAllRunTime:"",
                firstSemesterDateStart:"",
                firstSemesterDateEnd:"",
                secondSemesterDateStart:"",
                secondSemesterDateEnd:"",
                vocalVerifyTime:"",
            },
            months:[
                {name:'1',value:'01'},
                {name:'2',value:'02'},
                {name:'3',value:'03'},
                {name:'4',value:'04'},
                {name:'5',value:'05'},
                {name:'6',value:'06'},
                {name:'7',value:'07'},
                {name:'8',value:'08'},
                {name:'9',value:'09'},
                {name:'10',value:'10'},
                {name:'11',value:'11'},
                {name:'12',value:'12'}
            ],
            days:[
                {name:'1',value:'01'},
                {name:'2',value:'02'},
                {name:'3',value:'03'},
                {name:'4',value:'04'},
                {name:'5',value:'05'},
                {name:'6',value:'06'},
                {name:'7',value:'07'},
                {name:'8',value:'08'},
                {name:'9',value:'09'},
                {name:'10',value:'10'},
                {name:'11',value:'11'},
                {name:'12',value:'12'},
                {name:'13',value:'13'},
                {name:'14',value:'14'},
                {name:'15',value:'15'},
                {name:'16',value:'16'},
                {name:'17',value:'17'},
                {name:'18',value:'18'},
                {name:'19',value:'19'},
                {name:'20',value:'20'},
                {name:'21',value:'21'},
                {name:'22',value:'22'},
                {name:'23',value:'23'},
                {name:'24',value:'24'},
                {name:'25',value:'25'},
                {name:'26',value:'26'},
                {name:'27',value:'27'},
                {name:'28',value:'28'},
                {name:'29',value:'29'},
                {name:'30',value:'30'},
                {name:'31',value:'31'}
            ],
            firstSemesterDateStart_month:"",
            firstSemesterDateStart_day:"",
            firstSemesterDateEnd_month:"",
            firstSemesterDateEnd_day:"",
            secondSemesterDateStart_month:"",
            secondSemesterDateStart_day:"",
            secondSemesterDateEnd_month:"",
            secondSemesterDateEnd_day:"",
            showyear:"",
            showyearS:""
        }
    }
    ,methods:{
        semesterDateEndChange(){
            if(this.secondSemesterDateEnd_month < this.secondSemesterDateStart_month || this.secondSemesterDateEnd_month < this.firstSemesterDateEnd_month){
                this.showyear="(次年)";
            }else{
                this.showyear="";
            }
            if(this.secondSemesterDateStart_month < this.firstSemesterDateEnd_month){
                this.showyearS="(次年)";
            }else{
                this.showyearS="";
            }
        },
        querySchoolStandard(){
            this.$axios.get("/v1/unirun/query/runStandard?schoolId="+sessionStorage.getItem('schoolId')).then(res => {
               if(res.data.code==10000){
                    this.unirunInfo = res.data.response;
                    console.log(this.unirunInfo);
                    if(this.unirunInfo.firstSemesterDateStart != null){
                        if(this.unirunInfo.firstSemesterDateStart.split('-').length > 1){
                            this.firstSemesterDateStart_month=this.unirunInfo.firstSemesterDateStart.split('-')[0];
                            this.firstSemesterDateStart_day=this.unirunInfo.firstSemesterDateStart.split('-')[1];
                        }
                        if(this.unirunInfo.firstSemesterDateEnd.split('-').length > 1){
                            this.firstSemesterDateEnd_month=this.unirunInfo.firstSemesterDateEnd.split('-')[0];
                            this.firstSemesterDateEnd_day=this.unirunInfo.firstSemesterDateEnd.split('-')[1];
                        }
                        if(this.unirunInfo.secondSemesterDateStart.split('-').length > 1){
                            this.secondSemesterDateStart_month=this.unirunInfo.secondSemesterDateStart.split('-')[0];
                            this.secondSemesterDateStart_day=this.unirunInfo.secondSemesterDateStart.split('-')[1];
                        }
                        if(this.unirunInfo.secondSemesterDateEnd.split('-').length > 1){
                            this.secondSemesterDateEnd_month=this.unirunInfo.secondSemesterDateEnd.split('-')[0];
                            this.secondSemesterDateEnd_day=this.unirunInfo.secondSemesterDateEnd.split('-')[1];
                        }
                    }
               }
             });
        },
        saveSchoolStandard(){
            var reg = /^[0-9]*$/;
            var regs = /^[0-9]+(.[0-9]{2})?$/;
            if(!reg.test(this.unirunInfo.boyOnceTimeMin )
               || !reg.test(this.unirunInfo.boyOnceTimeMax)
               || !reg.test(this.unirunInfo.boyAllRunTime)
               || !reg.test(this.unirunInfo.girlOnceTimeMin)
               || !reg.test(this.unirunInfo.girlOnceTimeMax)
               || !reg.test(this.unirunInfo.girlAllRunTime)
               || !regs.test(this.unirunInfo.boyOnceDistanceMin)
               || !regs.test(this.unirunInfo.boyOnceDistanceMax)
               || !regs.test(this.unirunInfo.boyAllRunDistance)
               || !regs.test(this.unirunInfo.girlOnceDistanceMin)
               || !regs.test(this.unirunInfo.girlOnceDistanceMax)
               || !regs.test(this.unirunInfo.girlAllRunDistance)){
                this.$Message.error("分钟和次数请输入大于0 的整数，里程可以输入2位小数！");
                return false;
            }
            if(this.firstSemesterDateStart_month == ""
                 || this.firstSemesterDateStart_day == "" 
                 || this.firstSemesterDateEnd_month == "" 
                 || this.firstSemesterDateEnd_day == "" 
                 || this.secondSemesterDateStart_month == "" 
                 || this.secondSemesterDateStart_day == "" 
                 || this.secondSemesterDateEnd_month == "" 
                 || this.secondSemesterDateEnd_day == "" ){
                this.$Message.error("请选择跑步有效起止日期。");
                return false;
            }
            this.unirunInfo.firstSemesterDateStart=this.firstSemesterDateStart_month+'-'+this.firstSemesterDateStart_day;
            this.unirunInfo.firstSemesterDateEnd=this.firstSemesterDateEnd_month+'-'+this.firstSemesterDateEnd_day;
            this.unirunInfo.secondSemesterDateStart=this.secondSemesterDateStart_month+'-'+this.secondSemesterDateStart_day;
            this.unirunInfo.secondSemesterDateEnd=this.secondSemesterDateEnd_month+'-'+this.secondSemesterDateEnd_day;
            this.$axios.post("/v1/unirun/save/runStandard",this.unirunInfo).then(res => {
               if(res.data.code==10000){
                    this.$Message.success('保存成功！');
               }else{
                    this.$Message.success(res.data.msg);
               }
             });
        }          
    }    
    ,mounted(){
         this.querySchoolStandard();
    }  
};
</script>