<template>
    <el-page-header @back="goBack">
   <template #content>
     <span class="text-large font-600 mr-3"> 防控面积按生境汇总 </span>
   </template>
 </el-page-header>
 <div class="selec">
  
   <!--选择采集方式  -->
   <el-select v-model="type" clearable placeholder="请选择采集方式" style="width:8%">
   <el-option
     v-for="item in types"
     :key="item.value"
     :label="item.label"
     :value="item.value"
   />
 </el-select>
 <!-- 默认选择韶关 -->
 <el-select v-model="city" clearable placeholder="请选择" style="width:10%">
   <el-option
     v-for="item in citys"
     :key="item.value"
     :label="item.label"
     :value="item.value"
   />
 </el-select>
 <!-- 选择区/县 -->
 <el-select v-model="qu" clearable placeholder="请选择区县" style="width:15%" @change="getzhen(qu)">
   <el-option
     v-for="item in qus"
     :key="item.value"
     :label="item.label"
     :value="item.value"
   />
 </el-select>
 <!-- 选择镇/街 -->
 <el-select v-model="zhen" clearable placeholder="请选择镇街" style="width:15%">
   <el-option
     v-for="item in zhens"
     :key="item.value"
     :label="item.label"
     :value="item.value"
   />
 </el-select>
 <el-select v-model="sgtype" clearable placeholder="生境" style="width:10%">
   <el-option
     v-for="item in sgtypes"
     :key="item.value"
     :label="item.label"
     :value="item.value"
   />
 </el-select>
 <el-button  type="primary" plain @click="check">
   查询
 </el-button>
<el-button type="success" icon="download" @click="exportClick"> 导出</el-button>

 </div>
<div id="table" style="height:80%">
    <el-table :data="datas" style="width: 100%;margin-top:2%;height: 100%;" show-summary :summary-method="getSummaries">
   <el-table-column prop="name" label="村/社区" />
   <el-table-column prop="sgtype" label="生境"/>
   <el-table-column prop="sarea" label="样区面积（亩）" />
   <el-table-column prop="qarea" label="防控面积（区域撒播）（亩）" />
   <el-table-column prop="harea" label="防控面积（蚁巢环施）（亩）" />
   <el-table-column prop="hqarea" label="总防控面积（亩）" />
 </el-table>
</div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref,reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import {startLoading,endLoading} from '@/untils/loading'
import XLXS from "xlsx";
import FileSaver from "file-saver";
const state = reactive({
  excelTitle: "表格标题1",
});
// 导出excel表
const exportClick = () => {
  // 设置当前日期
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let name = year + "" + month + "" + day;
  // 导出文件名
  const filename = state.excelTitle;
  // 通过id，获取导出的表格数据
  const wb = XLXS.utils.table_to_book(document.getElementById("table"), {
    raw: true,
  });
  const wbout = XLXS.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: "application/octet-stream",
      }),
      name + ".xlsx"
    );
  } catch (e) {
    console.log(e);
  }
  return wbout;
}
const router=useRouter()
// 项目id
const id=router.currentRoute.value.query.id
interface option{
   value:string
   label:string
}
//采集方式
const types=[
       {value:2,label:'防控'},
       {value:3,label:'回防'}
]
let type=ref(2)
// 选择城市
const citys=[
{value:'韶关',label:'韶关'}
]
let city=ref('韶关')
// 选择区县
let qus=reactive<option[]>([])
let qu=ref('4402')
// 选择镇街
let zhens=reactive<option[]>([])
let zhen=ref('4402')
// 表格数据
let datas=reactive([])
// 生境
let sgtypes=reactive([
{
      label: '全部',
      value:0
           
    },
    {
      label: '绿化带',
      value:1
           
    },{
        label:'公园',
        value:2
          
    },{
        label:'堤坝',
        value:3
           
    },{
        label: '农地',
        value:4
         
    },{
        label:'果园',
        value:5
           
    },{
       label: '鱼塘塘基',
       value:6
           
    },{
        label:'村庄',
        value:7
           
    },{
       label: '林地',
       value:9
         
    },{
        label:'学校',
        value:10
          
    },{
        label:'住宅',
        value:11
         
    },{
        label:'景区',
        value:12
    },{
       label: '其他',
       value:8
          
    },
])
let sgtype=ref(0)
 //  返回
 const goBack=()=>{
 router.back()
 }
 interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
// 汇总函数
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums:any[]= []
  sums[0] = '合计'
  sums[2]=0
  sums[3]=0
  sums[4]=0
  sums[5]=0
let datas=data.filter(i=>i.name=='汇总')
 if(datas.length!==0){
    datas.forEach(i=>{
        sums[2]=sums[2]*1+i.sarea*1;
        sums[3]=sums[3]*1+i.qarea*1;
        sums[4]=sums[4]*1+i.harea*1;
        sums[5]=sums[5]*1+i.hqarea*1;
  })
 }
 else{
    data.forEach(i=>{
        sums[2]=parseFloat((sums[2]*1+i.sarea*1 as any)).toFixed(2)
        sums[3]=parseFloat((sums[3]*1+i.qarea*1 as any)).toFixed(2)
        sums[4]=parseFloat((sums[4]*1+i.harea*1 as any)).toFixed(2)
        sums[5]=parseFloat((sums[5]*1+i.hqarea*1 as any)).toFixed(2)
  })
 }
  return sums
}
// // 初始化全部街道
startLoading()
        axios.get('https://e7luck.cn/hhycc/visual/fksgarea?code='+4402+'&pjid='+id+'&ctype='+type.value+'&sgtype='+0).then(res=>{
       let data=res.data.data
       datas.length=0
       data.forEach(i=> {
           if(i.code!==zhen.value){
            if(i.sgtype==1){
                i.sgtype='绿化带'
            }if(i.sgtype==2){
                i.sgtype='公园'
            }if(i.sgtype==3){
                i.sgtype='堤坝'
            }if(i.sgtype==4){
                i.sgtype='农地'
            }if(i.sgtype==5){
                i.sgtype='果园'
            }if(i.sgtype==6){
                i.sgtype='鱼塘塘基'
            }if(i.sgtype==7){
                i.sgtype='村庄'
            }if(i.sgtype==8){
                i.sgtype='其他'
            }if(i.sgtype==9){
                i.sgtype='林地'
            }if(i.sgtype==10){
                i.sgtype='学校'
            }if(i.sgtype==11){
                i.sgtype='住宅'
            }if(i.sgtype==12){
                i.sgtype='景区'
            }
            if(i.sgtype==undefined){
                i.name='汇总'
            }
          (datas as any).push(i)
           }
           
       });
       endLoading()
   })
// 获取区县
axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+4402).then(res=>{
   console.log(res)

   let data=res.data.data.children;
   (qus as any).push({value:'4402',label:'全部'})
   data.forEach(i => {
      (qus as any).push({value:i.cityid,label:i.lebel})
   });

})
// 初始化镇街数据为区县
axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+4402).then(res=>{
   console.log(res)
   let data=res.data.data.children;
   (zhens as any).push({value:'4402',label:'全部'})
   data.forEach(i => {
   (zhens as any).push({value:i.cityid,label:i.lebel})

   });
})
// 获取镇街
const getzhen=(cityid)=>{
   zhen.value=''
   zhens.length=0
   axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+cityid).then(res=>{
   console.log(res)
   let data=res.data.data.children;
  
    (zhens as any).push({value:cityid,label:'全部'})
   data.forEach(i => {
   (zhens as any).push({value:i.cityid,label:i.lebel})

   });
})
}
// 查询
const check=()=>{
  
    if(zhen.value==''){
        ElMessage.error('请先选择镇/街')
    }else{
      startLoading()
        if(sgtype.value=='' as any){
            sgtype.value=0
        }
        axios.get('https://e7luck.cn/hhycc/visual/fksgarea?code='+zhen.value+'&pjid='+id+'&ctype='+type.value+'&sgtype='+sgtype.value).then(res=>{
       let data=res.data.data
       datas.length=0
       data.forEach(i=> {
           if(i.code!==zhen.value){
            if(i.sgtype==1){
                i.sgtype='绿化带'
            }if(i.sgtype==2){
                i.sgtype='公园'
            }if(i.sgtype==3){
                i.sgtype='堤坝'
            }if(i.sgtype==4){
                i.sgtype='农地'
            }if(i.sgtype==5){
                i.sgtype='果园'
            }if(i.sgtype==6){
                i.sgtype='鱼塘塘基'
            }if(i.sgtype==7){
                i.sgtype='村庄'
            }if(i.sgtype==8){
                i.sgtype='其他'
            }if(i.sgtype==9){
                i.sgtype='林地'
            }if(i.sgtype==10){
                i.sgtype='学校'
            }if(i.sgtype==11){
                i.sgtype='住宅'
            }if(i.sgtype==12){
                i.sgtype='景区'
            }
            if(i.sgtype==undefined){
                i.name='汇总'
            }
          (datas as any).push(i)
           }
           
       });
       endLoading()
   })
    }
   
}
</script>

<style scoped lang="less">
.selec{
   width:100%;
   text-align: center;
   padding-top:2%;
   .el-select{
       margin-left:2%
   }
   .el-button{
       margin-left:2%;
   }
}

</style>
