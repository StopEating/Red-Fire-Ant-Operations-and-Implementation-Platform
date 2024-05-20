<template>
    <el-page-header @back="goBack">
   <template #content>
     <span class="text-large font-600 mr-3"> 防控面积按样区汇总 </span>
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
 <!-- 选择防控区 -->
 <el-select v-model="qu" clearable placeholder="请选择防控区" style="width:15%">
   <el-option
     v-for="item in qus"
     :key="item.value"
     :label="item.label"
     :value="item.value"
     @click="getzhen(item.value)"
   />
 </el-select>
 <!-- 选择样区 -->
 <el-select v-model="zhen" clearable placeholder="请选择样区" style="width:15%">
   <el-option
     v-for="item in zhens"
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
   <el-table-column prop="aname" label="防控区"/>
   <el-table-column prop="aarea" label="防控区面积（亩）" />
   <el-table-column prop="addr" label="样区" />
   <el-table-column prop="sgtype" label="生境" />
   <el-table-column prop="sarea" label="样区面积（亩）" />
   <el-table-column prop="harea" label="防控区面积（蚁巢环施）（亩）" />
   <el-table-column prop="qarea" label="防控区面积（区域撒播）（亩）" />
   <el-table-column prop="hqarea" label="总防控区面积（亩）" />
 </el-table>
</div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref,reactive,Component } from 'vue';
import { ElMessage } from 'element-plus';
import {startLoading,endLoading} from '@/untils/loading'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
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

// 选择区县
let qus=reactive<option[]>([])
let qu=ref('')
// 选择镇街
let zhens=reactive<option[]>([])
let zhen=ref('')
let datas=reactive([])
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
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }if(index==1||index==4){
      sums[index]=''
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = ` ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          let num=prev*1 + curr*1
         num= parseFloat(num as any).toFixed(2) as any
          return num
          // parseFloat((prev + curr) as any).toFixed(2)
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ' '
    }
  })
return sums
}
// 获取防控区
axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
   console.log(res)
   let data=res.data.data
   data.forEach(i => {
      (qus as any).push({value:i.id,label:i.aname})
   });
//    axios.get('https://e7luck.cn/hhycc/region/showbyparent?cityid='+440233).then(res=>{
//    console.log(res)
//    let data=res.data.data.children
//    data.forEach(i => {
//    (zhens as any).push({value:i.cityid,label:i.lebel})

//    });
//    console.log(qus)
// })
})
// 获取镇街
const getzhen=(city)=>{
   zhen.value=''
   zhens.length=0
   axios.get(' https://e7luck.cn/hhycc/user/addrs?pjid='+id+'&aid='+city+'&ptype='+type.value).then(res=>{
   console.log(res)
   let data=res.data.data.list
   data.forEach(i => {
   (zhens as any).push({value:i.addr,label:i.addr})

   });
})
}
startLoading()
axios.get('https://e7luck.cn/hhycc/visual/fksaarea?pjid='+id+'&ctype='+type.value+'&aid='+0+'&addr='+zhen.value).then(res=>{
       console.log(res)
       let data=res.data.data
       datas.length=0
       data.forEach(i=> {
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
            if(i.aname!=='统计'){
            ( datas as any).push(i)
          }
       });
       console.log(datas)
       endLoading()
   })
// 查询
const check=()=>{
  startLoading()
    console.log(qu.value)
    console.log(zhen.value)
   axios.get('https://e7luck.cn/hhycc/visual/fksaarea?pjid='+id+'&ctype='+type.value+'&aid='+qu.value+'&addr='+zhen.value).then(res=>{
       console.log(res)
       let data=res.data.data
       datas.length=0
       data.forEach(i=> {
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
          if(i.aname!=='统计'){
            ( datas as any).push(i)
          }
       });
       endLoading()
   })
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
