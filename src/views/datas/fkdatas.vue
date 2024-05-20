<template>
<div style="display:flex;justify-content: space-between;align-items: center;">
    <el-page-header @back="goBack">
   <template #content>
        <span class="text-large font-600 mr-3"> 防控区数据</span>
   </template>
 </el-page-header>
    <el-button type="success" icon="download" @click="exportClick"> 导出</el-button>
</div>
 <div style="margin-top:10px;" id="table">
    <el-table
    :data="tableData"
    height="500"
    border
    style="width: 100%;" >
    <el-table-column
      prop="adddate"
      label="调查时间"
       align="center">
    </el-table-column>
    <el-table-column
      prop="adduser"
      label="调查人" align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="调查人手机" align="center">
    </el-table-column>
    <el-table-column
      prop="aname"
      label="防控区" align="center">
    </el-table-column>
    <el-table-column
      prop="carea"
      label="调查面积/亩" align="center">
    </el-table-column>
  </el-table>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref,reactive,onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {startLoading,endLoading} from '@/untils/loading'
import XLXS from "xlsx";
import FileSaver from "file-saver";
import { ta } from 'element-plus/es/locale';
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
 //  返回
 const goBack=()=>{
 router.back()
 }
 let tableData=reactive([])
 startLoading()
 axios.get('https://e7luck.cn/hhycc/visual/excelpjarea?pjid='+id).then(res=>{
    tableData.length=0
    let data=res.data.data
        data.forEach(i=> {
           (tableData as any).push(i)
        })
            endLoading()
            
 })
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
