<template>
  <div class="members">
     <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;height:5%;">
    <el-breadcrumb-item :to="{ path: '/projectlist' }">项目列表</el-breadcrumb-item>
    <el-breadcrumb-item>成员管理</el-breadcrumb-item>
  </el-breadcrumb>
    <!-- 新增 -->
  <div class="mainpanel">
    <el-card class="box-card">
      <el-form 
     :model="members" 
      class="demo-form-inline"
   >
   <h3 style="margin-bottom:7%;text-align: center;">新增成员</h3>
    <el-form-item label="姓名：" :rules="{
          required: true,
          message: '请输入姓名',
          trigger: 'blur',
        }" prop="user"> 
      <el-input v-model="members.user" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机：" :rules="{
          required: true,
          message: '请输入手机号',
          trigger: 'blur',
        }" prop="phone">
      <el-input v-model="members.phone" placeholder="请输入手机" maxlength=11 @input="checkphone(members.phone)" >
        <template #suffix v-if="icons==true">
          <el-icon color="green"><SuccessFilled /></el-icon>
        </template>
        <template #suffix v-else-if="icons==false">
          <el-icon color="red"><WarningFilled /></el-icon>
        </template>
        <template #suffix v-else>
          <el-icon><WarningFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" @click="onSubmit" style="width:50%;margin:0 auto">新增</el-button>
    </el-form-item>
  </el-form>
  </el-card>
  
    <!-- 成员 -->
    <el-transfer
     v-model="value" 
     :data="data" 
     :titles="title" 
     filterable 
     :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        @left-check-change="getmember"
       >
      <!-- 底部符号 -->
      <template #left-footer>
        <el-button type="danger"  plain  class="transfer-footer" @click="delmember">移除</el-button>
      </template>
    </el-transfer>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,onMounted,reactive } from 'vue';
import {useRouter} from "vue-router";
import { useStore } from 'vuex';
import axios from 'axios';
import { ElMessage,ElMessageBox} from 'element-plus';
import { startLoading,endLoading } from '@/untils/loading';
export default defineComponent({
 setup(){
  const store=useStore()
  const value = ref([])
  let icons=ref()
  // 检验手机号
  const checkphone=(value)=>{
    if (!(/^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/.test(value))){
      if(value.length==0){
        icons.value=null
      }else{
        icons.value=false
      }
    }else{
      icons.value=true
    }
  }
  onMounted(()=>{
    let panels:any=document.querySelector('.el-transfer')
    let childs=document.querySelectorAll('.el-transfer-panel')
    let btn=document.querySelector('.el-transfer__buttons')
    panels.removeChild(childs[1])
    panels.removeChild(btn)
  })
// 项目成员
const title=reactive(['项目成员'])
interface Option {
  key:number
  label:string
  disabled: boolean
  phone?:string
  adddate?: string
  adduser?: string
  pjid?:number
  id?:number
 
}
const generateData = () => {
  const data: Option[] = []
  return data
}
const data = ref<Option[]>(generateData())
// 新增成员
const members = reactive({
  user: '',
  phone: '',
})
// 显示成员列表
const router = useRouter()
let id=router.currentRoute.value.query.id
let phone=store.state.user.phone
const init=()=>{
  startLoading()
  axios.get('https://e7luck.cn/hhycc/user/listpjmen?phone='+phone+'&pjid='+id).then(res=>{
    if(res.data.data){
      let array = JSON.parse(JSON.stringify(res.data.data).replace(/username/g,"label").replace(/id/g,"key"))
      data.value=array
    }
  setTimeout(() => {
    endLoading()
  }, 500);
})
}
init()
// 新增成员
const onSubmit = () => {
  if(members.user==''&&members.phone==''){
    ElMessage({
    showClose: true,
    message: '信息不能为空！',
    type: 'error',
  })
  }
 else if(members.user!=''&&icons.value==true){
  axios.post('https://e7luck.cn/hhycc/user/addpjmen?mphone='+phone+'&pjid='+id+'&phone='+members.phone+'&username='+members.user).then(res=>{
    console.log(res) 
    if(res.data.status==200){
      ElMessage({
    showClose: true,
    message: '添加成员成功！！',
    type: 'success',
  })
  members.user=''
    members.phone=''
    init()
    }else{
      ElMessage({
    showClose: true,
    message: res.data.msg,
    type: 'warning',
  })
    }
 
  })
  
  
  }else{
    members.user=''
    members.phone=''
    ElMessage({
    showClose: true,
    message: '新增成员失败！',
    type: 'error',
  })
  }
}
// 移除成员
let delitem=''
// 获取被选择的数据
const getmember=(e)=>{

console.log(e)
delitem=e
}

// 删除被选择的数据
const delmember=()=>{
console.log(delitem)
let item=JSON.stringify(delitem).slice(1,-1)
console.log(item)
ElMessageBox.confirm(
          '确定删除此用户?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            axios({
            method:'delete',
            url:'https://e7luck.cn/hhycc/user/delpjmen?ids='+item
          }).then(res=>{
            console.log(res)
            if(res.data.status==200){
              ElMessage({
              showClose: true,
              type: 'success',
              message:'删除成功!',
            })
            }else{
              ElMessage({
              showClose: true,
              type: 'error',
              message:res.data.msg,
            })
            }
          })
          init()
          })
          .catch(() => {
            ElMessage({
              showClose: true,
              type: 'info',
              message:'已取消删除',
            })
          })
}
console.log(value)

    return {
  data,
  value,
  members,
  onSubmit,
  title,
  checkphone,
  icons,
  delmember,
  getmember
    }
  },
})
</script>

<style scoped>

  .members{
    width:100%;
    height:100%;
    margin:0;
    padding:0;
  }
.box-card{
  width:400px;
  height:40%;
  margin:3%;
  margin-left:3%;
  margin-top:3%;
  display:inline-block
}
.transfer-footer {
  margin-left: 15px;
}
.mainpanel{
 height:90%!important;
 margin-left:15%
}
</style>
<style lang="less" scoped>
  /deep/ .el-form {
    margin:0 auto;
    max-width: 80%;
    min-width: 20%;
  }
  /deep/ .el-transfer{
    width:35%;
    height:90%;
    display:inline-block;
  }
  /deep/ .el-transfer-panel{
    height:100%!important;
    width:100%;
  }
  /deep/ .el-transfer-panel__body{
    height:85%!important;
    width:100%;
  }
  /deep/ .el-transfer-panel__filter{
    width:80%;
    margin-left:7%!important;
    .el-input__wrapper{
      border-radius: 20px;
    }
  }
</style> 
