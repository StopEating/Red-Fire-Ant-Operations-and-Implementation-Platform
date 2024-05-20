<template>
  <div class="itemform">
    <div style="margin-bottom:10px;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
    <el-breadcrumb-item :to="{ path: '/projectlist' }">项目列表</el-breadcrumb-item>
    <el-breadcrumb-item>项目修改</el-breadcrumb-item>
  </el-breadcrumb>
    </div>
    <el-form
    size="large"
    :model="des.form"
    :inline="true"
    class="form"
    label-width="130px"
    style="width:80%"
  >
    <el-form-item label="项目名称：">
      <el-input v-model="des.form.name" />
    </el-form-item>
    <el-form-item label="项目负责人：">
      <el-input v-model="des.form.user" />
    </el-form-item>
    <el-form-item label="负责人手机：">
      <el-input  v-model="des.form.phone"/>
    </el-form-item>
    <el-form-item label="承担单位：">
      <el-input v-model="des.form.uniname" />
    </el-form-item>
    <el-form-item label="项目起止日期：">
      <el-date-picker
        v-model="des.form.starttime"
        type="date"
        placeholder="项目开始日期"
        value-format="YYYY-MM-DD"
        size="default"
        style="display:inline-block;width:45%"
      />
      <span style="margin:3%">-</span>
      <el-date-picker
        v-model="des.form.endtime"
        type="date"
        placeholder="项目结束日期"
        size="default"
        value-format="YYYY-MM-DD"
        style="display:inline-block;width:45%"
      />
    </el-form-item>
    <el-form-item label="实施区划：">
        <el-select v-model="shi" clearable placeholder="请选择" style="width:30%">
    <el-option
      v-for="item in shis"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.lebel"
    />
  </el-select>
  <el-select v-model="qu" clearable placeholder="请选择" style="width:30%" >
    <el-option
      v-for="item in qus"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.cityid"
      @click="getxian(item.cityid,item.lebel)"
    />
  </el-select>
  <el-select v-model="xian" clearable placeholder="请选择" style="width:30%" >
    <el-option
      v-for="item in xians"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.lebel"
    />
  </el-select>
    </el-form-item>
    <el-form-item label="药剂名称：">
        <el-input v-model="des.form.psname" />
    </el-form-item>
    <el-form-item label="生产企业：">
        <el-input v-model="des.form.pscompany" />
    </el-form-item>
    <el-form-item label="主要成分：">
        <el-input v-model="des.form.pscomposi" />
    </el-form-item>
    <el-form-item label="农药登记证：">
        <el-input v-model="des.form.pscdcode" />
    </el-form-item>
    <el-form-item label="农药生产许可证：">
        <el-input v-model="des.form.pslccode" />
    </el-form-item>
    <el-form-item label="产品标准号：">
        <el-input v-model="des.form.pssdcode" />
    </el-form-item>
    <el-form-item label="立项日期：">
        <el-input v-model="des.form.adddate" disabled/>
    </el-form-item>
   
  </el-form>
  <div style="text-align:center">
    <el-button type="primary" @click="submit">保存修改</el-button>
  </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent,ref } from 'vue';
import { reactive} from 'vue'
import { useRouter } from 'vue-router';
import { startLoading,endLoading } from '@/untils/loading';
import { useStore } from 'vuex';
import qs from 'qs'
import { ElMessage } from 'element-plus';
export default defineComponent({
  
 setup(){
  const store=useStore()
  const router=useRouter()
  let shi=ref('')
  let qu=ref('')
  let xian=ref('')
   let phone=store.state.user.phone
  let id=router.currentRoute.value.query.id
  let newphone=ref('')
    const des=reactive({form:{
    adddate:'',
    addduser:'',
    alias:'',
    code:'',
    endtime:'',
    id:'',
    name:'',
    phone:'',
    pscompany:'',
    pscomposi:'',
    psname:'',
    starttime:'',
    uniname:'',
    yearold:'',
    user:'',
    pscdcode:'',
    pslccode:'',
    pssdcode:'',
    oldphone:'',
    constphone:''
  }})
  interface options{
    cityid:string
    lebel:string
  }
  let shis=reactive<options[]>([{cityid:'4402',lebel:'韶关市'}])
    let qus=reactive<options[]>([])
    let xians=reactive<options[]>([])
  //  回显项目信息
  const init=()=>{
    axios.get('https://e7luck.cn/hhycc/user/listproject?phone='+phone+'&start=0&rows=9').then(res=>{
      startLoading()
      console.log(res)
      let data=res.data.rows
         const forms= data.filter(i=>{
            return i.id==id
          })
          des.form=(forms[0])
        setTimeout(() => {
          endLoading()
        }, 500);
        shi.value=des.form.alias.split('-')[0]
        qu.value=des.form.alias.split('-')[1]
        xian.value=des.form.alias.split('-')[2]
    })
  }
  init()
     // 获取区级列表
    axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+4402).then(res=>{
      let data=res.data.data.children
      data.forEach(i=>{
        qus.push(i)
      })
    })
    // 获取县级列表
    const getxian=(e,i)=>{
      qu.value=i
      console.log(e,i)
      axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+e).then(res=>{
      xians.length=0
      let data=res.data.data.children
      data.forEach(i=>{
        xians.push(i)
      })
    })
    }
    const submit=()=>{
      des.form.alias=shi.value+'-'+qu.value+'-'+xian.value
      if(des.form.oldphone==des.form.phone){
        des.form.phone=''
      }
      let data=qs.stringify(JSON.parse(JSON.stringify(des.form)))
      axios.post('https://e7luck.cn/hhycc/user/udproject',data).then(res=>{
        if(res.data.status==200){
        des.form.phone=des.form.oldphone
          ElMessage({
          showClose: true,
          message: '修改成功！',
          type: 'success',
        })
        }else{
          ElMessage({
          showClose: true,
          message: res.data.msg,
          type: 'error',
        })
        }
        init()
      })
    }
            return {
               qus,
                des,
                shi,
                qu,
                xian,
                shis,
                getxian,
                xians,
                submit,
                newphone
            }
        },
})
</script>

<style scoped>
.itemform{
    margin:0;
    padding:0;
}

.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin:50px auto
}

.el-form--inline .el-form-item {
  flex: 1 0 40%;
  align-items: center;
}
.el-form-item{
  max-width:460px;
}
</style>
