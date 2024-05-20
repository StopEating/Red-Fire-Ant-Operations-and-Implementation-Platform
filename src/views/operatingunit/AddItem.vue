<template>
  <div class="itemform">
    <!-- <div style="margin-bottom:10px;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
        <el-breadcrumb-item >项目管理</el-breadcrumb-item>
    <el-breadcrumb-item>新增项目</el-breadcrumb-item>
  </el-breadcrumb>
    </div> -->
    <el-form
    size="large"
    :model="form"
    :inline="true"
    class="form"
    label-width="130px"
    style="width:80%"
    ref="formRef"
  >
    <el-form-item label="项目名称：" >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="项目负责人：" >
      <el-input v-model="form.user" />
    </el-form-item>
    <el-form-item label="负责人手机：" >
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item label="承担单位：" >
      <el-input v-model="form.uniname" />
    </el-form-item>
    <el-form-item label="项目起止日期：" >
      <el-date-picker
        v-model="form.starttime"
        type="date"
        placeholder="项目开始日期"
        value-format="YYYY-MM-DD"
        size="default"
        style="display:inline-block;width:45%"
      />
      <span style="margin:3%">-</span>
      <el-date-picker
        v-model="form.endtime"
        type="date"
        placeholder="项目结束日期"
        size="default"
        value-format="YYYY-MM-DD"
        style="display:inline-block;width:45%"
      />
    </el-form-item>
    <el-form-item label="实施区划：" >
        <el-select v-model="shi" clearable placeholder="请选择" >
    <el-option
      v-for="item in city"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.lebel"
    />
  </el-select>
  <el-select v-model="qu" clearable placeholder="请选择" >
    <el-option
      v-for="item in child"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.lebel"
      @click="showchild(item.cityid)"
    />
  </el-select>
  <el-select v-model="xian" clearable placeholder="请选择">
    <el-option
      v-for="item in children"
      :key="item.cityid"
      :label="item.lebel"
      :value="item.lebel"
    />
  </el-select>
    </el-form-item>
    <el-form-item label="药剂名称：" >
        <el-input v-model="form.psname" />
    </el-form-item>
    <el-form-item label="生产企业：" >
        <el-input v-model="form.pscompany" />
    </el-form-item>
    <el-form-item label="主要成分：" >
        <el-input v-model="form.pscomposi" />
    </el-form-item>
    <el-form-item label="农药登记证：" >
        <el-input v-model="form.pscdcode" />
    </el-form-item>
    <el-form-item label="农药生产许可证：" >
        <el-input v-model="form.pslccode" />
    </el-form-item>
    <el-form-item label="产品标准号：" >
        <el-input v-model="form.pssdcode" />
    </el-form-item>
   
  </el-form>
  <el-form-item  style="margin:0 auto" > <div style="text-align:center;margin:0 auto">
  <el-button type="primary" @click="submit()">新增项目</el-button>
 </div>
</el-form-item>

  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted,ref } from 'vue';
import { reactive} from 'vue'
import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

export default defineComponent({
 setup(){
        const form= reactive({
        name: '',
        user: '',
        code:'4402',
        phone: '',
        pscompany:'',
        alias:'',
        psname:'',
        pscomposi:'',
        uniname:'',
        starttime:'',
        endtime:'',
        pscdcode:'',
        pslccode:'',
        pssdcode:'',
        adphone:''
    })
    const store=useStore()
    let shi=ref('')
  let qu=ref('')
  let xian=ref('')
  form.adphone=store.state.user.phone
interface option{
   cityid:string
   lebel:string
}
// 韶关市
 const city=reactive<option[]>([])
//  韶关一级区划
const child=reactive<option[]>([])
// 韶关二级
const children=reactive<option[]>([])
    onMounted(()=>{
    axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+4402).then(res=>{
      console.log(res)
      let cityid=res.data.data.cityid ;
      let lebel=res.data.data.lebel;
      city.push({cityid,lebel})
    let childs=res.data.data.children
    childs.forEach(i => {
      child.push(i)
    });
    })
})  
const showchild=(e)=>{
  console.log(e)
  axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+e).then(res=>{
      console.log(res)
      let childs=res.data.data.children
      childs.forEach(i => {
      children.push(i)
    });
    console.log(children)
    })
}
const submit=() => {
  form.alias=shi.value+'-'+qu.value+'-'+xian.value
  for(var key in form)
{
if(form[key]==='')
{
  ElMessage({
    showClose: true,
    message: '新增项目失败! 表单内容不能留空,请检查!',
    type: 'warning',
  })
  return false
}
}
  let data=qs.stringify(JSON.parse(JSON.stringify(form)))
  console.log(data)
axios.post('https://e7luck.cn/hhycc/user/addproject?data='+data).then(res=>{
  console.log(res)
  if(res.data.status==200){
    ElMessage({
    showClose: true,
    message: '新增项目成功!',
    type: 'success',
  })
  }else{
    ElMessage({
    showClose: true,
    message: res.data.msg,
    type: 'error',
  })
  }
})
}
            return {
                form,
                city,
                child,
                showchild,
                children,
                submit,
                shi,
                qu,
                xian,
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
<style lang="less" scoped>
/deep/ .el-select{
  width:32%;
  margin-right: 1%;
  display: inline-block;
}
</style>
