<template>
  <div class="list">
    <!-- <div style="margin-bottom:10px;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
      <el-breadcrumb-item >项目管理</el-breadcrumb-item>
    <el-breadcrumb-item >项目列表</el-breadcrumb-item>
  </el-breadcrumb>
    </div> -->
    <el-form :inline="true" :model="listform" class="demo-form-inline" size="small" style="margin-left:2%;">
      <el-form-item>
      <el-input v-model="listform.itemname" placeholder="输入项目关键字查询" />
    </el-form-item>
    <el-form-item >
      <el-input v-model="listform.companyname" placeholder="输入单位名称关键字查询" />
    </el-form-item>
    <el-form-item>
      <el-select v-model="listform.date" placeholder="立项年份查询">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="primary">重置</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" style="width:90%;text-align:left;margin:5px auto!important;margin-left:2%!important;">
    <!-- <el-table-column prop="alias" label="项目区划" width="100" /> -->
    <el-table-column prop="name" label="项目名称" width="250" />
    <el-table-column prop="user" label="项目负责人" width="150" />
    <el-table-column prop="uniname" label="项目承担单位" width="240" />
    <el-table-column prop="adddate" label="立项日期" width="150" />
    <el-table-column label="管理操作" width="300" style="text-align:center">
      <template #default="scope">
        <el-button size="small" @click="projectdetail(scope.row.id)">项目详情</el-button>
        <el-button size="small" @click="membermanage(scope.row.id)">成员管理</el-button>
        <template v-if="type==0">
          <el-button size="small" @click="modifyitem(scope.row.id)">修改</el-button>
          <el-button size="small" type="danger" @click="del(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </template>
       
    </el-table-column>

  </el-table>
  <div class="demo-pagination-block">
     <el-pagination
     v-model:currentPage="currentPage"
      page-size="10"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
      style="width:30%;margin:0 auto"
    />
  </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent,reactive,ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios'
import {startLoading,endLoading} from '@/untils/loading'
import { ElMessage,ElMessageBox} from 'element-plus';
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  init((val-1)*10)
}
const currentPage = ref(1)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const total=ref()
  const store=useStore()
  const router=useRouter()
  let type=store.state.user.type
   const tableData=ref([])
   let phone=store.state.user.phone
   startLoading()
      const init=(start=0,rows=10)=>{
        console.log(start,rows)
        axios.get('https://e7luck.cn/hhycc/user/listproject?phone='+phone+'&start='+start+'&rows='+rows).then(res=>{
          console.log(res)
          total.value=res.data.total
          tableData.value=res.data.rows
          setTimeout(() => {
            endLoading()
          }, 500);
        })
      }
      init()
      const listform= reactive({
        itemname: '',
        companyname: '',
        date:''
        })
        const projectdetail=(id)=>{
        router.push({path:'/projectdetail',query:{id}})
        }
        const membermanage=(id)=>{
        router.push({
                    path: "/membermanage",
                    query: {id}
                    })
        }
        const modifyitem=(id)=>{
      router.push({path:'/operatingunit/modifyitem',query:{id}})
        }
        const del=(index,id)=>{
          // ElMessageBox({}, appContext)
          ElMessageBox.confirm(
          '确定删除此项目?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            axios({
            method:'delete',
            url:'https://e7luck.cn/hhycc/user/delproject?id='+id
          }).then(res=>{
            console.log(res)
            if(res.data.status==200){
              ElMessage({
                showClose: true,
                message: '删除成功!',
                type: 'success',
              })
          tableData.value.splice(index,1)
            }else{
              ElMessage({
                showClose: true,
                message: res.data.msg,
                type: 'error',
              })
            }
          })
          })
          .catch(() => {
            ElMessage({
              showClose: true,
              type: 'info',
              message:'已取消删除',
            })
          })
         
        }

</script>

<style scoped>
  .demo-pagination-block {
  margin-top: 10px;
  height: 30px;
  width:100%;
}
.demo-form-inline{
    justify-content:space-between;
    margin-top:20px;
}
</style>
<style lang="less" scoped>
/deep/ .el-table__inner-wrapper::before{
  width:0
}
</style>
