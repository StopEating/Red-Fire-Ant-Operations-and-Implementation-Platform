<template>
    <div class="map-page-container" style="width:100%">
      <div class="block" style="z-index:99999;">
        <el-page-header @back="goBack">
          <template #title>
              <span>返回</span>
          </template>
    <template #content>
      <span class="text-large font-600 mr-3"> 防控轨迹图 </span>
    </template>
  </el-page-header>
  <el-button style="margin-left:3%;padding:5px" type="primary" @click="towxmap">查看卫星地图</el-button>
      </div>
    <!-- 地图 -->
      <el-amap
        :center="center"
        :zoom="zoom"
        @init="init"
        style="width:100%;height:100%"
      >
      
    </el-amap>
    </div>
  </template>
  <script lang="ts" setup>
      import axios from 'axios'
      import {useRouter} from 'vue-router'
  import {ref,reactive} from "vue";
  const router=useRouter()
  const id=router.currentRoute.value.query.id
  const pjid=router.currentRoute.value.query.pjid
  const lnglat=router.currentRoute.value.query.lnglat
  let city=router.currentRoute.value.query.city
  let pois=(lnglat as any).split(',')
  const zoom = ref(25);
  const center = ref(pois);
  let jsys:any[]=[]
  let ygs:any[]=[]
  let map = null;
   interface options{
    label:string
    value:string
   }
   let areas=reactive<options[]>([])
   console.log(typeof lnglat)
     // 进入卫星图层
  const towxmap=()=>{
    router.push({path:'/wmap/wgjmap',query:{id,city,lnglat}})
  }
   axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
   let data=res.data.data
   data.forEach(i => {
    areas.push({value:i.id,label:i})
   });
   areas.push({value:'全部',label:'全部'})
   })
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
          fillColor: 'pink',
          strokeColor: 'red'
         })
          e.add(polygon)
       }
       // 地图自适应
       (map as any).setFitView();
     }
   })
  })
  axios.get('https://e7luck.cn/hhycc/user/fkguiji?pid='+id+'&pjid='+pjid).then(res=>{
    console.log(res)
    res.data.data.jsys.forEach(i => {
        let lnglats=[]
        i.lnglats=i.lnglats.split(';')
        i.lnglats.forEach(i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          ( lnglats as any).push(lnglat)
        });
        jsys.push(lnglats)

      console.log(jsys)
       
    });
    res.data.data.ygs.forEach(i => {
        let lnglats=[]
        i.lnglats=i.lnglats.split(';')
        i.lnglats.forEach(i => {
            let lng=i.split(',')[0]*1
            let lat=i.split(',')[1]*1
           let lnglat:any[]=[lng,lat];
          ( lnglats as any).push(lnglat)
        });
        ygs.push(lnglats)

    });
    // 员工轨迹
    for(var i=0;i<ygs.length;i++){
            var bezierCurve = new AMap.BezierCurve({
            path:ygs[i],
            isOutline: true,
            outlineColor: '#ffeeff',
            borderWeight: 3,
            strokeColor: "#3366FF", 
            strokeOpacity: 1,
            strokeWeight: 6,
            // 线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 10],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        })
        e.add(bezierCurve);
        }
    // 技术人员轨迹
    for(var i=0;i<jsys.length;i++){
        console.log(jsys[i])
            var bezierCurves = new AMap.BezierCurve({
            path:jsys[i],
            isOutline: true,
            // 外边颜色
            outlineColor: 'green',
            borderWeight: 3,
            // 填充颜色
            strokeColor: "#3366FF", 
            strokeOpacity: 1,
            // 粗细
            strokeWeight: 6,
            // 线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 10],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        })
        e.add(bezierCurves);
        }
    })
  
 
    // var path = [//每个弧线段有两种描述方式
    //       [116.37, 39.91],//起点
    //       //第一段弧线
    //       [116.380298, 39.907771],//控制点，途经点
    //       //第二段弧线
    //       [116.385298, 39.907771],//控制点，途经点//弧线段有两种描述方式1
    //       //第四段弧线
    //       [116.423857, 39.889498]
    //       //控制点，控制点，途经点，每段最多两个控制点
    //   ];
    //   console.log(path[1])
//       var path1 = [//每个弧线段有两种描述方式
//           [116.37, 40.91],//起点
//           //第一段弧线
//           [116.380298, 40.907771, 116.38,40.90],//控制点，途经点
//           //第二段弧线
//           [116.385298,40.907771, 116.40, 40.90],//控制点，途经点//弧线段有两种描述方式1
//           //第三段弧线
//           [//弧线段有两种描述方式2
//             [116.392872, 40.887391],//控制点
//             [116.40772,40.909252],//控制点
//             [116.41, 40.89]//途经点
//           ],
//           //第四段弧线
      
//       ];
//   let path2=[path,path1]
//       for(var i=0;i<path2.length;i++){
//         var bezierCurve = new AMap.BezierCurve({
//           path: path2[i],
//           isOutline: true,
//           outlineColor: '#ffeeff',
//           borderWeight: 3,
//           strokeColor: "#3366FF", 
//           strokeOpacity: 1,
//           strokeWeight: 6,
//           // 线样式还支持 'dashed'
//           strokeStyle: "solid",
//           // strokeStyle是dashed时有效
//           strokeDasharray: [10, 10],
//           lineJoin: 'round',
//           lineCap: 'round',
//           zIndex: 50,
//       })
  
//       e.add(bezierCurve);
//       }
    map = e;
    (map as any).setFitView();
  }
  

  
  </script>
  
  <style scoped>

    *{
      margin:0;
      padding:0;
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
  }
    .block2{
    position: absolute;
    top: 2%;
    padding-left:15%
   /* left: 28%; */
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
  </style>
  <style lang="less" scoped>
    /deep/ .el-main{
      width:50%!important;
    }
  </style>