<template>
    <div style="display:flex;justify-content: space-between;align-items: center;">
        <el-page-header @back="goBack">
       <template #content>
            <span class="text-large font-600 mr-3"> 防控点数据</span>
       </template>
     </el-page-header>
    <div style="margin-right: 20px;">
     <el-select v-model="ctype" class="m-2" placeholder="Select" style="width:100px;margin-right:20px">
    <el-option
    v-for="item in ctypes"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-button type="primary" icon="search" @click="check"> 查询</el-button>
        <el-button type="success" icon="download" @click="exportClick"> 导出</el-button>
    </div>
    </div>
     <div style="margin-top:10px;" id="table">
        <el-table
        :data="tableData"
        height="500"
        border
        style="width: 100%;" >
        <el-table-column
          prop="acttime"
          label="创建时间"
           align="center">
        </el-table-column>
        <el-table-column
          prop="cuser"
          label="工作人员" align="center">
        </el-table-column>
        <el-table-column
          prop="cphone"
          label="工作人员手机" align="center">
        </el-table-column>
        <el-table-column
          prop="carea"
          label="工作面积/亩" align="center">
        </el-table-column>
        <el-table-column
          prop="pesticide"
          label="药剂名称" align="center">
        </el-table-column>
        <el-table-column
      label="图片" align="center">
      <template #default="scope" >
        <div style="display: flex; align-items: center" v-if="scope.row.imgurl!==null">
            <el-image style="width:80px;height:80px;"
            :src="scope.row.imgurl.split(';')[0]"  
            :preview-src-list="scope.row.imgurl.split(';')"
            preview-teleported
            />
        </div>
        <div style="display: flex; align-items: center" v-else>
            <el-image style="width:80px;height:80px;"
            :src="scope.row.imgurl"  
            :preview-src-list="scope.row.imgurl"
            preview-teleported
            />
        </div>
      </template>
    </el-table-column>
      </el-table>
      
      </div>
    </template>
    
    <script lang="ts" setup>
    import axios from 'axios';
    import table2excel from 'js-table2excel';
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
    const ctype = ref('2')
    const ctypes = [
    {
        value: '2',
        label: '防控',
    },
    {
        value: '3',
        label: '回防',
    },
    ]
    // 导出excel表
    const exportClick = () => {
      // 设置当前日期
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let name = year + "" + month + "" + day;
            /** column数据的说明 */
			//1.title为column的标题
			//2.key为column对应的key
			//3.type默认是text，若为图片格式type为image , 并且可以设置图片的宽高
            
                let column = [
		        {
		          title: '调查时间', 
		          key: 'acttime',
		          type: 'text'
		        },
                {
		          title: '调查人', 
		          key: 'cuser',
		          type: 'text'
		        },
                {
		          title: '调查人手机', 
		          key: 'cphone',
		          type: 'text'
		        },
                {
		          title: '经纬度', 
		          key: 'lnglat',
		          type: 'text'
		        }, {
		          title: '工作面积/亩', 
		          key: 'carea',
		          type: 'text'
		        },{
		          title: '药剂名称', 
		          key: 'pesticide',
		          type: 'text'
		        },
		        {
                  title: '图片',
		          key: 'imgurl',
		          type: 'text',
		        },
		      ]
              table2excel(column,tableData, name)    //生成Excel表格，自动下载
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
     axios.get('https://e7luck.cn/hhycc/visual/excelfkdata?pjid='+id+'&ctype='+ctype.value).then(res=>{
        tableData.length=0
        let data=res.data.data
            data.forEach(e=> {
                if(e.sgtype==1){
                    e.sgtype="绿化带"
                  }else if(e.sgtype==2){
                    e.sgtype='公园'
                  }else if(e.sgtype==3){
                    e.sgtype='堤坝'
                  }else if(e.sgtype==4){
                    e.sgtype='农地'
                  }else if(e.sgtype==5){
                    e.sgtype='果园'
                  }else if(e.sgtype==6){
                    e.sgtype='鱼塘塘基'
                  }else if(e.sgtype==7){
                    e.sgtype='村庄'
                  }else if(e.sgtype==8){
                    e.sgtype='其他'
                  }else if(e.sgtype==9){
                    e.sgtype='林地'
                  }else if(e.sgtype==10){
                    e.sgtype='学校'
                  }else if(e.sgtype==11){
                    e.sgtype='住宅'
                  }else if(e.sgtype==12){
                    e.sgtype='景区'
                  }
                  if(e.ptype=='1'){
                        e.ptype='监测'
                    }else if(e.ptype=='2'){
                        e.ptype='防控'
                    }
                if(!e.carea){e.carea=0}
               (tableData as any).push(e)
            })
                endLoading()
                
     })
    // 查询
    const check=()=>{
        startLoading()
        tableData.length=0
        axios.get('https://e7luck.cn/hhycc/visual/excelfkdata?pjid='+id+'&ctype='+ctype.value).then(res=>{
        tableData.length=0
        let data=res.data.data
            data.forEach(e=> {
                if(e.sgtype==1){
                    e.sgtype="绿化带"
                  }else if(e.sgtype==2){
                    e.sgtype='公园'
                  }else if(e.sgtype==3){
                    e.sgtype='堤坝'
                  }else if(e.sgtype==4){
                    e.sgtype='农地'
                  }else if(e.sgtype==5){
                    e.sgtype='果园'
                  }else if(e.sgtype==6){
                    e.sgtype='鱼塘塘基'
                  }else if(e.sgtype==7){
                    e.sgtype='村庄'
                  }else if(e.sgtype==8){
                    e.sgtype='其他'
                  }else if(e.sgtype==9){
                    e.sgtype='林地'
                  }else if(e.sgtype==10){
                    e.sgtype='学校'
                  }else if(e.sgtype==11){
                    e.sgtype='住宅'
                  }else if(e.sgtype==12){
                    e.sgtype='景区'
                  }
                  if(e.ptype=='1'){
                e.ptype='监测'
                    }else if(e.ptype=='2'){
                        e.ptype='防控'
                    }
                    if(!e.carea){e.carea=0}
               (tableData as any).push(e)
            })
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
    :v-deep .el-table .el-table__cell{
        z-index:0;
        position: normal !important;;
    }
    .demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
    </style>
    