<template>
  <div>
    <!-- 页头 -->
    <div style="margin-bottom:10px;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;">
      <el-breadcrumb-item >项目列表</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/projectdetail',query:{id}}">项目详情</el-breadcrumb-item>
    <el-breadcrumb-item >实施数据</el-breadcrumb-item>
  </el-breadcrumb>
    </div>
    
    <!-- 查询重置 -->
    <el-form :inline="true" :model="listform" class="demo-form-inline" size="default">
      <el-form-item>
        <el-select v-model="listform.area" placeholder="防控区" @change="turnarea">
        <el-option :key="item.value" :label="item.label" v-for="item in fkarea" :value="item.value"/>
        <!-- <el-option label="Zone two" value="beijing" /> -->
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
        v-model="adddate"
        type="date"
        placeholder="选择时间"
        size="default"
        value-format="YYYY-MM-DD"
      />
      </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="checkdata">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>

  <!-- 折叠面板 -->
  <el-collapse v-model="activeName" >

<el-collapse-item 
v-for="(item,index) in tableData" :name="index" style="position:relative" :key="index">

<template v-slot:title  >
<span class="titlespan">[{{item.sgtype}}]</span> 
<span class="titlespan">[ {{item.adddate}}]</span> 
<span class="titlespan"> {{item.aname}}</span> 
<span class="titlespan">{{item.addr}} </span>
<span class="titlespan">{{item.alias}}</span>
 <el-button type="danger" icon="Delete" circle style="position:absolute;right:60px" size="small" @click.stop.prevent=openCollapse(item.id,index)></el-button>

</template>
<div style="margin-bottom:20px;margin-left:15px">
  数据详情：
<template v-if="ptype=='1'">
  <el-button size="small" @click="dating('监测',item.id)">监测</el-button>
<el-button size="small" @click="dating('评估',item.id)">评估</el-button>
</template>
<template v-else>
<el-button size="small" @click="dating('防控',item.id)">防控</el-button>
<el-button size="small" @click="dating('回防',item.id)">回防</el-button>
</template>
</div >

<el-descriptions class="margin-top" :column="3" size="small" border >

<el-descriptions-item >
  <template v-slot:label >
    日期时间
  </template>
  {{item.adddate}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label >
    创建人
  </template>
  {{item.adduser}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   手机
  </template>
  
  {{item.phone}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
    生境类型
  </template>
  {{item.sgtype}}
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
   样区面积
  </template>
  {{item.carea}}亩
</el-descriptions-item>
<el-descriptions-item>
  <template v-slot:label>
  所在村委
  </template>
  {{item.alias}}
</el-descriptions-item>
 <el-descriptions-item>
  <template v-slot:label>
    位置坐标
  </template>
 {{item.lnglat}}
</el-descriptions-item>
<el-descriptions-item >
  <template v-slot:label>
    生境图片
  </template>
  <template v-if="item.imgurl==null">
    <el-empty description="没有图片噢~" />
  </template>
   <template v-else>
    <el-image
      style="width: 100px; height: 100px"
      :src="item.imgurl[0]"
      :preview-src-list="item.imgurl"
      :initial-index="4"
      fit="cover"
    />
    <!-- <img style="width:100px;height:100px" :src="item.imgurl.split(';')[0]||item.imgurl" preview="1" > -->
   </template>
</el-descriptions-item>

</el-descriptions>

</el-collapse-item>
</el-collapse>
<div class="demo-pagination-block">
     <el-pagination
     v-model:currentPage="currentPage"
      :small="small"
      :disabled="disabled"
      page-size="10"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
      style="width:50%;margin:0 auto"
    />
  </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent,reactive,ref ,watch,onActivated,onMounted} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import {startLoading,endLoading} from '@/untils/loading'
import { ElMessage} from 'element-plus';

const handleCurrentChange = (val: number) => {
  init((val-1)*10)
  localStorage.setItem('page',currentPage.value as any)
}
const currentPage = ref(1)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const total=ref()
  let adddate=ref('')
  const router = useRouter()
   const route = useRoute()
  const store=useStore()
  // 项目id
let id=router.currentRoute.value.query.id
let pjid=router.currentRoute.value.query.id
let city=router.currentRoute.value.query.city
let ptype=router.currentRoute.value.query.ptype
  let activeName=ref('')
  let type=ref(1)
  // 详情类型接口
  interface option{
    adddate:string
    addr:string
    adduser:string
    alias:string
    aname:string
    carea:string
    id:number
    imgurl:any
    lnglat:string
    phone:string
    pjid:number
    sgtype:number
  }
  interface fkareas{
    label:string;
    value:string
  }
  
  let tableData=reactive<option[]>([])
      // 防控区
      let fkarea=reactive<fkareas[]>([])
      // 表单
      const listform= reactive({
        area: '',
        grabtype: '',
        type:'',
        mode:''
        })
    // 获取防控区
    const showarea=()=>{
      axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
        res.data.data.forEach(i=>{
          (fkarea as any).push({label:i.aname,value:i.id})

        })
      })
    }
    // 防控区发生变化
    const turnarea=(e)=>{
      console.log(e)
    }
    // 数据列表
      const init=(start=0,rows=10)=>{
        tableData.length=0
        startLoading()
        axios.get('https://e7luck.cn/hhycc/user/projectdata?pid='+id+'&start='+start+'&rows='+rows+'&aid='+0+'&ptype='+ptype).then(res=>{
         console.log(res)
      let data=res.data.rows
      total.value=res.data.total
      data.forEach((i,index)=> {
      if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
      i.imgurl=i.imgurl.split(';')
      }else{
        i.imgurl=[i.imgurl]
      }
        if(i.sgtype==1){
          i.sgtype='绿化带'
        } 
      if(i.sgtype==2){
          i.sgtype='公园'
        } if(i.sgtype==3){
          i.sgtype='堤坝'
        } if(i.sgtype==4){
          i.sgtype='农地'
        } if(i.sgtype==5){
          i.sgtype='果园'
        } if(i.sgtype==6){
          i.sgtype='鱼塘塘基'
        } if(i.sgtype==7){
          i.sgtype='村庄'
        } if(i.sgtype==8){
          i.sgtype='其他'
        } if(i.sgtype==9){
          i.sgtype='林地'
        } if(i.sgtype==10){
          i.sgtype='学校'
        } if(i.sgtype==11){
          i.sgtype='住宅'
        } if(i.sgtype==12){
          i.sgtype='景区'
        }
        (tableData as any).push(i)
        route.meta.data=tableData
      })
      localStorage.setItem("table",JSON.stringify(data))
      localStorage.setItem('total',JSON.stringify(res.data.total))
      console.log(data)
      endLoading()
    })

      }
      showarea()

  // 查询
  const checkdata=()=>{
    startLoading()
    if(listform.area==''&&adddate.value==''){
      init()
    }
   else{
     // console.log(listform.area,id,adddate.value)
     axios.get('https://e7luck.cn/hhycc/user/projectdata?pid='+id+'&aid='+listform.area+'&adddate='+adddate.value+'&start='+0+'&rows='+10+'&ptype='+ptype).then(res=>{
      let data=res.data.rows;
      total.value=res.data.total
      tableData.length=0
      data.forEach((i,index)=> {
      if(i.imgurl!==null&&i.imgurl.indexOf(';')!==-1){
      i.imgurl=i.imgurl.split(';')
      }else{
        i.imgurl=[i.imgurl]
      }
        if(i.sgtype==1){
          i.sgtype='绿化带'
        } 
      if(i.sgtype==2){
          i.sgtype='公园'
        } if(i.sgtype==3){
          i.sgtype='堤坝'
        } if(i.sgtype==4){
          i.sgtype='农地'
        } if(i.sgtype==5){
          i.sgtype='果园'
        } if(i.sgtype==6){
          i.sgtype='鱼塘塘基'
        } if(i.sgtype==7){
          i.sgtype='村庄'
        } if(i.sgtype==8){
          i.sgtype='其他'
        } if(i.sgtype==9){
          i.sgtype='林地'
        } if(i.sgtype==10){
          i.sgtype='学校'
        } if(i.sgtype==11){
          i.sgtype='住宅'
        } if(i.sgtype==12){
          i.sgtype='景区'
        }
        (tableData as any).push(i)
      })
      endLoading()
    })
   }
   
  }
  // 重置
  const reset=()=>{
    listform.area=''
    adddate.value=''
    tableData.length=0
    init()
  }
  // 数据详情
  const dating=(e,id)=>{
console.log(e)
if(e=='监测'){
  router.push({path:'/datadetail/jdata',query:{id}})
}
if(e=='防控'){
  router.push({path:'/datadetail/fdata',query:{id,city,pjid}})
}
if(e=='回防'){
  router.push({path:'/datadetail/hdata',query:{id,city,pjid}})
}
if(e=='评估'){
  router.push({path:'/datadetail/pdata',query:{id}})
}
  }
  // 删除
  const openCollapse=(pid,index)=>{
console.log(pid)
axios({
method: 'delete',
url: 'https://e7luck.cn/hhycc/user/delpoint?pid='+pid,
}).then(res=>{
  console.log(res)
  if(res.data.status==200){
    ElMessage({
    showClose: true,
    message: '删除成功！',
    type: 'success',
  })
  tableData.splice(index,1)
  }else{
    ElMessage({
    showClose: true,
    message: res.data.msg,
    type: 'error',
  })
  }
})
// axios.delete('https://e7luck.cn/hhycc/user/delpoint?pid='+pid).then(res=>{
//   console.log(res)
// })
  }
  onMounted(()=> {
    console.log(route.meta.data)
    if(route.meta.isKeepAlive)
      {
        let pagedata=localStorage.getItem('page');
        (currentPage.value as any)=(pagedata as any)*1;
        console.log(pagedata)
        init(((pagedata as any)-1)*10)
        return
      }
  init()// 获取列表数据
})


</script>

<style scoped>
.titlespan{
  margin-left:15px;
}
.demo-form-inline{
margin-top:1%;
margin-bottom: 1%;
margin-left:2%;
}
.demo-pagination-block {
  margin-top: 10px;
  height: 30px;
  width:100%

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
  /deep/ .el-descriptions__label{
    text-align: left; 
    width: 100px!important;   
   word-break: break-all  
  }
  /deep/ .el-descriptions__body table tbody tr td{
    text-align: center;
    font-weight: 600;
    height: 40px;
    width: 50px!important;
    word-break: keep-all
  }
</style>
