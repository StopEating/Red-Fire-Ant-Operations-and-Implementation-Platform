<template>
    <div class="map-page-container" style="width:100%">
      <div class="block" style="z-index:99999;">
        <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> 样区边界管理 </span>
    </template>
  </el-page-header>
  <el-select placeholder="请选择类型" style="margin-left:20%;width: 10%;" v-model="stype" clearable @change="changefkq">
    <el-option
      key="监测"
      label="监测"
      value="1"
      >
    </el-option>
    <el-option
      key="防控"
      label="防控"
      value="2"
      >
    </el-option>
  </el-select>
  <el-select placeholder="请选择防控区" style="margin-left:2%;width: 15%;" v-model="area" clearable>
    <el-option
      v-for="item in areas"
      :key="item.value"
      :label="item.label"
      :value="item.label"
      @click="getyarea(item.value)"
      >
    </el-option>
  </el-select>
  
  <el-select placeholder="请选择样区" style="margin-left:2%;width: 15%;" v-model="yarea" clearable>
    <el-option
      v-for="item in yareas"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      @click="drawold(item.value)"
      >
    </el-option>
  </el-select>
  <!-- <span style="margin-left:5%">面积：</span>亩 -->
      </div>
    <!-- 地图 -->
    <div style="width:75%;height:99%;display:inline-block;margin:0;padding:0" >
        <el-amap
        :center="center"
        :zoom="zoom"
        @init="init"
        style="display: flex"
      >
      <el-amap-layer-satellite></el-amap-layer-satellite>
    </el-amap>
    </div>
    <!-- 右边显示 -->
    <div style="width:25%;height:99%;background-color:#f4f4f4;display: inline-block;margin:0;padding:0;overflow: hidden;">
    <div style="margin-top:10px">
        新边界点选择:
        <ul style="padding-left:2em;font-size: 10px;">
            <li>点击开始：开始画边界，左侧地图上点击开始采集边界点，双击结束采集</li>
            <li style="line-height: 30px;">点击停止：结束画边界</li>
            <li>点击重置：重新画边界</li>
        </ul>
    </div>
<div style="width:100%;height:5%;text-align: center;padding-top:20px">

  <el-button plain type="primary" @click="start">开始</el-button>
    <el-button type="danger" plain @click="end">停止</el-button>
    <el-button type="warning" plain @click="reset">重置</el-button>
    <!-- <el-button type="primary" plain>对比</el-button> -->
</div>
<el-card shadow="always" class="card" placeholder="新选择的边界点存放区">
    <div class="item" >
       <template v-if="paths.length>0">
        <span v-for="item in paths" :key="item" style="margin-left:2px">
                {{item}}
        </span>
       </template>
       <template v-else>
       <span>{{item}}</span>
       </template>
    </div>
</el-card>
   <div style="text-align: center;">
    <el-input v-model="areameasure" class="w-50 m-2" placeholder="Please Input" style="width:200px;margin:0 auto;margin-bottom: 5px;margin-top:15px"/>亩
    <el-button type="primary" @click="calarea" style="display:block;margin: 0 auto;">计算新边界面积</el-button>
<el-button type="success" style="display:block;margin:0 auto;margin-top: 20px;" @click="save"> 更新保存</el-button>

</div>
    </div>
   
    </div>
  </template>
  <script lang="ts" setup>
      import axios from 'axios'
      import {useRouter} from 'vue-router'
  import {ref,reactive,onMounted} from "vue";
  import { ElMessage } from 'element-plus'
import { startLoading,endLoading } from '@/untils/loading';

  const router=useRouter()
  const id=router.currentRoute.value.query.id
  let city=router.currentRoute.value.query.city
  
  const zoom = ref(35);
const center = ref([116.471354, 39.994257]);
let item=ref('新选择的边界点存放区')
let paths=reactive([])
// 面积
let areameasure=ref(0)
  let map = null;
   interface options{
    label:string
    value:string
   }
   let area=ref('')
   let areas=reactive<options[]>([])
    let yarea=ref('')
    let stype=ref('1')
   let yareas=reactive<options[]>([])
  let mouseTool
  let bjyqs=[]//样区边界
 let bjyqspy=reactive([])//防控边界数组
//  防控边界数组
  let bjyqsarea:any[]=[]
  let bjfks=[]//样区边界
 let bjfkspy=reactive([])//防控边界数组
//  防控边界数组
  let bjfksarea:any[]=[]
// 样区点
let markers=reactive([])
let nocontents=reactive([])
let fkqname=ref('')
const changefkq=()=>{
  area.value=''
  yarea.value=''
}
//   获取防控区
   axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
    console.log(res)
   let data=res.data.data
   data.forEach(i => {
    areas.push({value:i.id,label:i.aname})
   });
//    areas.push({value:'全部',label:'全部'})
   })
//    获取样区
const getyarea=(aname)=>{
  // 存储防控区名称
  fkqname.value=aname
    axios.get('https://e7luck.cn/hhycc/user/addrs?pjid='+id+'&aid='+aname+'&ptype='+stype.value).then(res=>{
      console.log(res)
        yareas.length=0
        yarea.value=''
   let data=res.data.data.list
   console.log(data)
 if(data){
  data.forEach(i => {
    yareas.push({value:i.pid,label:i.addr})
   });
 }
    })
}
  //  返回
  const goBack=()=>{
  router.back()
  }
  const init = (e) => {
    // 绘制边界
    AMap.plugin('AMap.DistrictSearch', function () {
    // 创建行政区查询对象
    var district = new AMap.DistrictSearch({
      // 返回行政区边界坐标等具体信息
      extensions: 'all',
      // 设置查询行政区级别为 区 
      level: 'district'
    })
    let alias
  if(city?.includes('-')){
    alias=city
    city=alias.split('-')[1]
  }
    district.search(city, function(status, result) {
      // 获取边界信息
      var bounds = result.districtList[0].boundaries
      var polygons = []
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
         //生成行政区划polygon
         var polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 5,
          path: bounds[i],
          fillOpacity: 0.4,
          fillColor: '#f2dad8',
          strokeColor: 'red'
         })
          e.add(polygon)
       }
       // 地图自适应
       (map as any).setFitView();
     }
   })

  })
    map = e;
    AMap.plugin(["AMap.MouseTool"],function () {
         mouseTool = new AMap.MouseTool(map);
    });
    (map as any).setFitView();
  }
  const start=()=>{
    draw()
  }
  let overlays = [];
  let mappath=[];
  let pois=[];
  let endpy=[];
  let measure=[];
  function draw(){
    paths.length=0
    mouseTool.polygon({
              fillColor:'#00b0ff',
              strokeColor:'#80d8ff'
              //同Polygon的Option设置
            });
            // 绘制时计算面积
            // mouseTool.measureArea({
            //     fillColor:'#00b0ff',
            //   strokeColor:'#80d8ff'
            //   //同 Polygon 的 Option 设置
            // });
    mouseTool.on('draw',function(e:any){
        // mappath=[]
        pois=[];
        measure=[];
        overlays=[];
       let lnglats=[];
       (mappath as any).push(e.obj)
        let path=e.obj.getPath()
        path.forEach(i => {
           let lng= i.lng;
           let lat= i.lat;
          //  显示到文本框中
            (overlays as any).push(lng+','+lat+';');
            (lnglats as any).push([lng,lat]);
            // 为了计算面积
           ( measure as any).push([lng,lat]);
            // 为了停止画图时回显多边形
           (pois as any).push(lnglats)
        });
        ElMessage({
      message: '您已完成边界绘制，如若继续绘制将保留最后一个多边形',
      type: 'warning',
    })
    }) ;
  }
//   结束画图
let realVal
let areame
let polnglat
   const end=()=>{
    polnglat= measure;
    paths.length=0;
    overlays.forEach(i => {
        paths.push(i)
    });
    // 计算面积
  areame = Math.round(AMap.GeometryUtil.ringArea(measure))/667;
    // 截取当前数据到小数点后两位 （四舍五入）
    realVal = parseFloat((areame as any)).toFixed(2)

    mouseTool.close(true)//会将原本画的多边形去除
    overlays=[]
    endpy=[]
    // 回显多边形
    for (var i = 0, l =pois.length; i < l; i++) {
         //生成行政区划polygon
         var polygon = new AMap.Polygon({
          map: map,
          path:pois[i],
          strokeWeight: 2,
          fillOpacity: 0.8,
          fillColor:'#c7d2e7',
          strokeColor:'#80d8ff'
         });
        (endpy as any).push(polygon);
          (map as any).add(polygon)
       }

   }
  //  计算面积
   const calarea=()=>{
    // 计算面积
      areame = Math.round(AMap.GeometryUtil.ringArea(measure))/667;
        // 截取当前数据到小数点后两位 （四舍五入）
      realVal = parseFloat((areame as any)).toFixed(2)
      areameasure.value=realVal as any 
   }
// 清除覆盖物/重置 将数组清空
   const reset=()=>{
   ( map as any).remove(mappath);
   (map as any).remove(endpy)
   mappath=[]
   overlays=[]
   pois=[]
   endpy=[]
   measure=[]
   paths.length=0
   }

// 调用接口
const save=()=>{
  console.log(yarea.value)
    if(area.value==''||yarea.value==''){
      ElMessage.error('请先选择所要管理边界的防控区以及样区')
    }else if(polnglat==undefined){
      ElMessage.error('请先确定已有新画边界或已停止点击停止')
    }else{
    let polnglats=polnglat.join(';')
    // 计算面积接口
    // axios.get('https://e7luck.cn/hhycc/user/calarea?lnglats='+polnglats).then(res=>{
    //   console.log(res)
    // })
    // 存储边界
      axios.post('https://e7luck.cn/hhycc/user/udpointdt?id='+yarea.value+'&lanlats='+polnglats+'&carea='+realVal).then(res=>{
        console.log(res)
        reset()
        drawold(yarea.value)
        ElMessage({
        message: '管理该样区边界成功！',
        type: 'success',
      })
    })
    }
    
   
}
// 绘制防控区旧边界
const drawold=(pid)=>{
 startLoading();
 reset()
  axios.get('https://e7luck.cn/hhycc/user/fkguijis?pjid='+id+'&ctype='+2+'&aid='+fkqname.value+'&pid='+pid).then(res=>{
    console.log(res);
    (map as any).remove(bjfkspy);
    (map as any).remove(bjyqspy);
   bjfkspy=[]
   bjfksarea=[]
   bjyqsarea=[]
   bjyqspy=[]
   
   bjyqs=[]
   bjfks=[]
  if(res.data.data!==null){
    let data=res.data.data
    bjyqs=data.bjyqs
    bjfks=data.bjfks
    // 样区边界
    bjyqs.forEach( gj=>{
      let lnglats=[];
      (gj as any)=(gj as any).split(';');
      (gj as any).forEach( i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          ( lnglats as any).push(lnglat)
         
      })
      bjyqsarea.push(lnglats)
      console.log(bjyqsarea)
        for(var j=0;j<bjyqsarea.length;j++){
          console.log(bjyqsarea[j])
      let bezierCurve = new AMap.Polygon({
            path:bjyqsarea[j],
            isOutline: true,
            fillColor: 'transparent',
            borderWeight: 1,
            strokeColor: "#e02fff",  
            strokeOpacity: 1,
            strokeWeight: 2,
            // 线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 10],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        });
        (bjyqspy as any).push(bezierCurve);
        (map as any).add(bezierCurve);
        }
    })
    // 防控区边界
     // 样区边界
    bjfks.forEach( gj=>{
      let lnglats=[];
      (gj as any)=(gj as any).split(';');
      (gj as any).forEach( i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          ( lnglats as any).push(lnglat)
      })
       bjfksarea.push(lnglats)
        for(var j=0;j<bjfksarea.length;j++){
          console.log(bjfksarea[j])
      let bezierCurve = new AMap.Polygon({
            path:bjfksarea[j],
            isOutline: true,
            fillColor: 'transparent',
            borderWeight: 1,
            strokeColor: "blue",  
            strokeOpacity: 1,
            strokeWeight: 2,
            // 线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 10],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        });
        (bjfkspy as any).push(bezierCurve);
        (map as any).add(bezierCurve);
        }
    })

  }
endLoading()
})
// 样区点
axios.get('https://e7luck.cn/hhycc/user/mapfkdata?pid='+id+'&ctype='+2+'&aid='+fkqname.value).then(res=>{
  (map as any).remove(nocontents);
  nocontents.length=0
if(res.data.data!==null){
    // 获取样区点
   if(1){
    markers=res.data.data.arrs
  }
  //  获取监测点
//   //  绘制标记点
//   // 样区点：
markers.forEach(function(marker) {
  if((marker as any).addr==yarea.value){
    let lng=(marker as any).lnglat.split(',')[0]
  let lat=(marker as any).lnglat.split(',')[1]
   // 有文本的标记点
        // 无文本的标记点
        let nocontent=new AMap.Marker({
            map: map,
            icon: new AMap.Icon({     
            image: require('/static/img/2.png'),
            size: new AMap.Size(25, 25),  //图标大小
            imageSize: new AMap.Size(25,25),
          }),
        position: [lng,lat],
        offset: new AMap.Pixel(-13, -30)
        });
        (nocontents as any).push(nocontent)
    }
 else{
  let lng=(marker as any).lnglat.split(',')[0]
  let lat=(marker as any).lnglat.split(',')[1]
   // 有文本的标记点
        // 无文本的标记点
        let nocontent=new AMap.Marker({
            map: map,
            icon: new AMap.Icon({     
            image: require('/static/img/0.png'),
            size: new AMap.Size(25, 25),  //图标大小
            imageSize: new AMap.Size(25,25),
          }),
        position: [lng,lat],
        offset: new AMap.Pixel(-13, -30)
        });
        (nocontents as any).push(nocontent)
  }

    })

}
})
}
  </script>
  
  <style scoped>
    li{
        list-style: none;
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
    .map-page-container{
      width: 100%;
      height:100%;
      position:relative;
      top:0;
      left:0;
    }
    .block{
      position: absolute;
    left: 2%;
    text-align: left;
    width:80%
  }

   .icon{
    width:20px;
    height:20px;
    -webkit-border-radius: 50% 50% 50% 0;
      border-radius: 50% 50% 50% 0;
    background: green;
      border:1px solid white;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
      margin:5px;
      display: inline-block;
      vertical-align: middle;
  }
.card{
    width:95%;
    height:50%;
    overflow-y: auto;
    margin:0 auto;
    margin-top:8px;
    word-break: break-all;
}
.item{
    font-size: 10px;
}
  </style>
  <style lang="less" scoped>
    /deep/ .el-main{
      width:50%!important;
    }
    /deep/.el-select-dropdown__list{
        padding: 0 32px 0 20px!important;
    }
  </style>