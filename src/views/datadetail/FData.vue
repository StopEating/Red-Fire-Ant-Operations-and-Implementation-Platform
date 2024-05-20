<template>
  <div class="jd">
      <el-page-header  @back="goBack"> 
  <template #breadcrumb>
    <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
      <el-breadcrumb-item>
        项目列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        项目详情
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        实施数据
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        数据详情
      </el-breadcrumb-item>
    </el-breadcrumb>
  </template>
  <template #content>
    <span class="text-large font-600 mr-3">防控数据详情 </span>
  </template>
</el-page-header>
<el-backtop target=".jd" :right="100" :bottom="100"></el-backtop>
<el-descriptions class="margin-top" :column="3" size="small" border v-for="(item,index) in fk" :key="index" style="margin-top:10px">
<template v-slot:extra>
   <!-- @click="deletepointdata(item.id,1,index)" -->
  <el-button type="danger" round size="small" @click="deletepointdata(item.id,4,index)">删除</el-button>
</template>
<el-descriptions-item >
  <template v-slot:label>
    防控时间
  </template>
  {{item.acttime}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
  工作人员
  </template>
  {{item.cuser}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   手机
  </template>
  {{item.cphone}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
    位置坐标
  </template>
  {{item.lnglat}}
 <!-- <img style="width:100px;height:100px;"  :src="e" v-for="e in youjiimg[index]" preview="1" > -->
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   防控方式
  </template>
  <template v-if="item.ftype==1">
蚁巢环施
</template>
<template v-else>
  区域撒播
</template>
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   防控面积
  </template>
  {{item.carea}}亩
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   防控用药量
  </template>
  {{item.pesinum}}克
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   防控图片
  </template>
  <template v-if="item.imgurl[0]==null">
    <el-empty description="没有图片噢~" />
  </template>
   <template v-else>
    <!-- <img style="width:100px;height:100px" :src="item.imgurl.split(';')[0]||item.imgurl" preview="1" > -->
    <el-image
      style="width: 100px; height: 100px"
      :src="item.imgurl[0]"
      :preview-src-list="item.imgurl"
      :initial-index="4"
      fit="cover"
    />
   </template>
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   施药轨迹
  </template>
    <span style="cursor:pointer;" class="gjmap" @click="togjmap(item.ftype,item.id,item.lnglat)"> 轨迹图<el-icon><DArrowRight /></el-icon></span>
</el-descriptions-item>
</el-descriptions> 
<div class="demo-pagination-block">
     <el-pagination
     v-model:currentPage="currentPage"
     :page-size="size"
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
import { defineComponent,reactive,ref } from 'vue';
import { useRouter } from 'vue-router';
import {startLoading,endLoading} from '@/untils/loading'
import axios from 'axios';
import { ElMessage,ElMessageBox} from 'element-plus';

    const currentPage = ref(1)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const total=ref(0)
    const size=5
  const router=useRouter()
  const id=router.currentRoute.value.query.id
  const pjid=router.currentRoute.value.query.pjid
  const city=router.currentRoute.value.query.city
  interface fk{
  acttime:string
  carea:string
  cphone:string
  ctype:number
  cuser:string
  ftype:number
  id:number
  imgurl:any
  lnglat:string
  lnglats:string
  pesticide:string
  pid:number
  pesinum:number
}
// 防控/回防

let fk=reactive<fk[]>([])
  const goBack=()=>{
  router.back()
  }

  // 分页
  const handleCurrentChange = (val:number) => {
    let num=(val-1)*5
        init(num)
}

// 默认显示数据
startLoading()
const init=(num=0)=>{
  axios.get('https://e7luck.cn/hhycc/user/pointdata?pid='+id+"&type="+2+"&child="+0+"&ctype="+2+'&start='+num+'&rows='+5).then(res=>{
  console.log(res)

  let data=res.data.rows
  total.value=res.data.total
fk.length=0
  if(data){
    data.forEach((i)=> {

if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
        i.imgurl=i.imgurl.split(';')
        }else{
          i.imgurl=[i.imgurl]
        }
        if(i.carea==''){
          i.carea=0
        }
        (fk as any).push(i)
  })
  setTimeout(() => {
  endLoading()
  }, 500);
  }
})
}
init()
 // 删除
 const deletepointdata=(id,e,index)=>{
    ElMessageBox.confirm(
    '确定删除此数据?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
  axios({
  method:'delete',
  url:'https://e7luck.cn/hhycc/user/delpointdt?pid='+id+'&type='+e
}).then(res=>{
  console.log(res)
  if(res.data.status==200){
    ElMessage({
    showClose: true,
    message: '删除成功！',
    type: 'success',
  })
      fk.splice(index,1)
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
        type: 'info',
        message: '取消删除',
      })
    })

  }
// 轨迹图
const togjmap=(ftype,id,lnglat)=>{
  if(ftype==1){
    ElMessage({
    showClose: true,
    message: '蚁巢环绕方式无轨迹图！！',
    type: 'warning',
  })
  }
 else{
router.push({path: '/map/gjmap',query: {id,lnglat,city,pjid}})
 }
}
</script>

<style scoped>
  .gjmap:hover{
    color:rgb(84, 191, 234)
  }
  .demo-pagination-block {
  margin-top: 10px;
  height: 30px;
  width:100%

}
.tabs{
  margin-bottom: 20px;
 
}
.jd{
  height: 100%; 
overflow-x: hidden;
}
</style>
<style lang="less" scoped>
    /deep/ .el-empty{
    width:100px;
    height:100px
  }
  /deep/ .el-empty__image svg{
    width:90px;
    height:90px
  }
  /deep/ .el-empty__description{
    margin:0;
  }
  /deep/ .el-empty__description p{
    font-size: small;
  }
</style>
