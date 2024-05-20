<template>
    <div class="map-page-container" style="width:100%">
      <!-- <SelectArea></SelectArea> -->
      <!-- 描述 -->
      <div class="block" style="z-index:200;margin-left:0.5%;;font-size:6px;background-color: aliceblue;">
              <div style="margin-bottom:5px">
                标记点区分：
              </div>
              <div>
               <img src="@/assets/img/0.png" alt="" style="width:20px;height:20px"><span>:样区标记点</span>
              </div>
              <div>
               <img src="@/assets/img/1.png" alt="" style="width:20px;height:20px"><span>:装置监测标记点</span>
              </div>
              
    </div>
      <!-- 选择框 -->
      <div class="block2"  style="z-index:999;">
        <el-breadcrumb separator-icon="ArrowRight" style="padding:10px;margin:0;margin-left:-18%">
        <el-breadcrumb-item :to="{path:'/projectdetail',query:{id}}">项目详情</el-breadcrumb-item>
      <el-breadcrumb-item >装置数据地图</el-breadcrumb-item>
    </el-breadcrumb>
    <div >
      <el-select placeholder="请选择监测/评估" style="margin-right:1%;width: 10%;" v-model="type">
      <el-option
        v-for="item in types"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select placeholder="请选择防控区" style="margin-right:1%;width: 15%;" v-model="area">
      <el-option
        v-for="item in areas"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select placeholder="请选择显示标记点" style="margin-right:1%;width: 10%;" v-model="point">
      <el-option
        v-for="item in points"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @click="changepoint"
        >
      </el-option>
    </el-select>
    <el-switch
      v-model="showad"
      width="4em"
      active-text="显示地点"
      inactive-text="隐藏地点"
      @change="ifshow"
    />
    <el-button style="margin-left:3%;" type="primary" @click="check">
      查询
    </el-button>
    <el-button style="margin-left:3%;" type="primary" @click="towxmap">查看普通地图</el-button>
    </div>
    </div>
    <!-- 地图 -->
      <el-amap
        :center="center"
        :zoom="zoom"
        @init="init"
        style="width:100%;height:100%"
      >
      <el-amap-layer-satellite></el-amap-layer-satellite>
    </el-amap>
    </div>
    <el-drawer v-model="drawer"  :with-header="true" show-close size="50%" z-index="1000">
      <template #header="{ close, titleId, titleClass }">
      <h5 :id="titleId" :class="titleClass">装置数据：等级:{{grade}} — 装置序号：{{ornum}}</h5>
     
    </template>
      <el-table :data="zdata" height="100%" style="width: 100%;" align="center">
      <el-table-column property="orid" label="序号" width="80"/>
      <el-table-column property="anum" label="数量/头" width="80" />
      <el-table-column property="coldate" label="采集日期" />
      <el-table-column property="lnglat" label="经纬度" width="270"/>
      <el-table-column  label="图片" >
        <template #default="scope">
      <el-image
      style="width: 100px; height: 100px"
      :src="scope.row.imgurl"
      :preview-src-list="[scope.row.imgurl]"
      :initial-index="4"
      fit="cover"
      preview-teleported="true"
      lazy="true"
    />
      </template>
      </el-table-column>
    </el-table>
  </el-drawer>
  </template>

    <script lang="ts" setup>
      import SelectArea from '@/components/common/SelectArea.vue'
      import axios from 'axios'
      import {useRouter} from 'vue-router'
      import {ref,reactive} from "vue";
      const router=useRouter()
      const id=router.currentRoute.value.query.id
      let city=router.currentRoute.value.query.city
      const showad = ref(true)
      const zoom = ref(35);
      const center = ref([116.471354, 39.994257]);
      let drawer=ref(false)
      let map = null;
       let markers=reactive([])
       let dvmarkers=reactive([])
       let yjmarkers=reactive([])
      //  装置数据
       let zdata=reactive([])
      //  等级以及装置序号
      let grade=ref(0)
      let ornum=ref(0)
       interface options{
        label:string
        value:string
       }
       let areas=reactive<options[]>([])
        const types=[
          {
            value:'监测',
            label:'监测'
          },
          {
            value:'评估',
            label:'评估'
          }
        ]
        const points=[
              {value:'样区',label:'样区'},
              {value:'样区+监测点',label:'样区+监测点'}
         ]
        //  查询条件
          let point=ref('样区')
          let area=ref('全部')
          let type=ref('监测')
          // 样区点数组
       let delmarkers=[]
       let nocontents=[]
      //  监测点数组
        let tcpoints=[]
        let yjpoints=[]
        let infoWindow
         // 进入卫星图层
         const towxmap=()=>{
      router.push({path:'/projectdetail/zdatamap',query:{id,city}})
    }
       axios.get('https://e7luck.cn/hhycc/user/listareas?pjid='+id).then(res=>{
       areas.push({value:'全部',label:'全部'})
       let data=res.data.data
       data.forEach(i => {
        areas.push({value:i.id,label:i.aname})
       });
       })
      
      
      const init = (e) => {
       infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
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
        // 绘制点
      axios.get('https://e7luck.cn/hhycc/user/mapdvdata?pid='+id+'&ctype='+1+'&aid='+0).then(res=>{
        console.log(res)
        // 获取样区点
         markers=res.data.data
        //  获取监测点
         markers.forEach(i=>{
         if((i as any).dvdatas!==null){
          (i as any).dvdatas.forEach(j => {
            (dvmarkers as any).push(j)
          });
         }
        
         })
        //  绘制标记点
        // 样区点：
      markers.forEach(function(marker) {
        let lng=(marker as any).lnglat.split(',')[0]
        let lat=(marker as any).lnglat.split(',')[1]
         // 有文本的标记点
            let markerss=new AMap.Marker({
                  map: map,
                  enableHighAccuracy: true, 
                  icon: new AMap.Icon({     
                  image: require('/static/img/0.png'),
                  size: new AMap.Size(25, 25),  //图标大小
                  imageSize: new AMap.Size(25,25),
                }),
              position: [lng,lat],
              offset: new AMap.Pixel(-13, -30)
              });
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
          let img
          if((marker as any).imgurl!==null)
          {
            img=(marker as any).imgurl.split(';');
          }
      
           
         if(img)
          {
               // 设置信息窗体
               (markerss as any).content = `<div>
                <div>样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                <div style="width:100px;height:100px">
                <img src='${(marker as any).imgurl}' style="width:100px;height:100px"/>
                </div>
                <a href="${(marker as any).imgurl}" target='blank'>打开图片</a>
               
                </div>`;
              (markerss as any).on('click', markerClick);
              // 设置标记点文本
              (markerss as any).setLabel({
              direction:'right',
              offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
              content: "<div class='info'>"+`${(marker as any).aname}`+"</div>", //设置文本标注内容
          });
             (nocontent as any).content = `<div>
                <div >样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                <div style="width:100px;height:100px">
                <img src='${img[0]}' style="width:100px;height:100px"/>
                </div>
                <a href="${img[0]}" target='blank'>打开图片</a>
               
                </div>`; 
                (nocontent as any).on('click', markerClick);
          }else{
             // 设置信息窗体
             (markerss as any).content = `<div>
                <div>样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                </div>`;
              (markerss as any).on('click', markerClick);
              // 设置标记点文本
              (markerss as any).setLabel({
              direction:'right',
              offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
              content: "<div class='info'>"+`${(marker as any).aname}`+"</div>", //设置文本标注内容
          });
             (nocontent as any).content = `<div>
                <div >样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                </div>`; 
                (nocontent as any).on('click', markerClick);
          }
                // 设置标记点文本
                //默认初始化不出现信息窗体,打开初始化就出现信息窗体
                // markerss.emit('click', {target: markerss});
                (nocontents as any).push(nocontent);
                (delmarkers as any).push(markerss)
          });
      
      })
        map = e;
        (map as any).setFitView();
      }
      // 信息窗体显示以及关闭
      function markerClick(e) {
              infoWindow.setContent(e.target.content);
              infoWindow.open(map, e.target.getPosition());
          }
      // 标记点显示
      const changepoint=()=>{
        console.log(point.value)
       // 绘制监测点
      if(point.value=='样区+监测点'){
        showad.value=false
        ifshow(showad.value)
        // 踏查点
     dvmarkers.forEach(function(marker) {
        let lng=(marker as any).lnglat.split(',')[0]
        let lat=(marker as any).lnglat.split(',')[1]
         // 有文本的标记点
          let markers=new AMap.Marker({
                  map: map,
                  enableHighAccuracy: true, 
                  icon: new AMap.Icon({     
                  image: require('/static/img/1.png'),
                  size: new AMap.Size(25, 25),  //图标大小
                  imageSize: new AMap.Size(25,25),
                }),
              position: [lng,lat],
              offset: new AMap.Pixel(-13, -30)
              });
              let img
          if((marker as any).imgurl!==null)
          {
            img=(marker as any).imgurl.split(';');
          }
          if(img)
          {
            let item=marker as any
               // 设置信息窗体
               (markers as any).content = `<div>
                <div>工蚁数量：${(marker as any).antnum}</div>
                <div>日期:${(marker as any).acttime}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                <div>技术员电话:${(marker as any).phone}</div>
                <div style="width:100px;height:100px">
                <img src='${img[0]}' style="width:100px;height:100px"/>
                </div>
                <a href="${img[0]}" target='blank'>打开图片</a>
                <button style="width:100px;height:25px;border:1px solid #a0c6f2;background-color:transparent;margin-top:5px" onclick="opendata(${(marker as any).id},${(marker as any).phone})">查看装置数据</button>
                </div>`;
              (markers as any).on('click', markerClick);
          }else{
             // 设置信息窗体
             (markers as any).content = `<div>
              <div>工蚁数量：${(marker as any).antnum}</div>
                <div>日期:${(marker as any).acttime}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                <div>技术员电话:${(marker as any).phone}</div>
                <button style="width:100px;height:25px;border:1px solid #a0c6f2;background-color:transparent;margin-top:5px" onclick="opendata(${(marker as any).antnum})">查看装置数据</button>
                </div>`;
              (markers as any).on('click', markerClick);
          }
          (tcpoints as any).push(markers)
      
          });
      }
      else{
        (map as any).remove(tcpoints);
      }
      }
      const check=()=>{
        showad.value=true
        point.value='样区'
        console.log(point.value,area.value,type.value)
        let types
        let aname=area.value
        if(type.value=='监测'){
          types=1
        }
        if(type.value=='评估'){
          types=4
        }
        if(area.value=='全部'||area.value==''){
          aname='0'
        }
        axios.get('https://e7luck.cn/hhycc/user/mapdvdata?pid='+id+'&ctype='+types+'&aid='+aname).then(res=>{
        console.log(res)
        // 获取样区点
       if(res.data){
        markers=res.data.data;
       }
         (map as any).remove(nocontents);
         (map as any).remove(delmarkers);
         (map as any).remove(tcpoints);
        dvmarkers.length=0;
         nocontents.length=0;
         delmarkers.length=0;
        //  获取监测点
         markers.forEach(i=>{
         if((i as any).dvdatas!==null){
          (i as any).dvdatas.forEach(j => {
            (dvmarkers as any).push(j)
          });
         }
         })
        //  绘制标记点
        // 样区点：
      markers.forEach(function(marker) {
        let lng=(marker as any).lnglat.split(',')[0]
        let lat=(marker as any).lnglat.split(',')[1]
         // 有文本的标记点
            let markerss=new AMap.Marker({
                  map: map,
                  enableHighAccuracy: true, 
                  icon: new AMap.Icon({     
                  image: require('/static/img/0.png'),
                  size: new AMap.Size(25, 25),  //图标大小
                  imageSize: new AMap.Size(25,25),
                }),
              position: [lng,lat],
              offset: new AMap.Pixel(-13, -30)
              });
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
          let img
          if((marker as any).imgurl!==null)
          {
            img=(marker as any).imgurl.split(';');
          }
              (markerss as any).on('click', markerClick);
              // 设置标记点文本
              (markerss as any).setLabel({
              direction:'right',
              offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
              content: "<div class='info'>"+`${(marker as any).aname}`+"</div>", //设置文本标注内容
          });
         if(img)
          {
             // 设置信息窗体
             (markerss as any).content = `<div>
                <div>样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                <div style="width:100px;height:100px">
                <img src='${(marker as any).imgurl}' style="width:100px;height:100px"/>
                </div>
                <a href="${(marker as any).imgurl}" target='blank'>打开图片</a>
                </div>`;
             (nocontent as any).content = `<div>
                <div >样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                <div style="width:100px;height:100px">
                <img src='${img[0]}' style="width:100px;height:100px"/>
                </div>
                <a href="${img[0]}" target='blank'>打开图片</a>
                </div>`; 
                (nocontent as any).on('click', markerClick);
          }else    {
             // 设置信息窗体
             (markerss as any).content = `<div>
                <div>样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                </div>`;
             (nocontent as any).content = `<div>
                <div >样区：${(marker as any).addr}</div>
                <div>防控区:${(marker as any).aname}</div>
                <div>日期：${(marker as any).adddate}</div>
                <div>经纬度:${(marker as any).lnglat}</div>
                </div>`; 
                (nocontent as any).on('click', markerClick);
          }
              // 设置标记点文本
                //默认初始化不出现信息窗体,打开初始化就出现信息窗体
                // markerss.emit('click', {target: markerss});
                (nocontents as any).push(nocontent);
                (delmarkers as any).push(markerss)
          });
      // 信息窗体显示以及关闭
          function markerClick(e) {
              infoWindow.setContent(e.target.content);
              infoWindow.open(map, e.target.getPosition());
          }
      })
      }
      const ifshow=(e)=>{
      if(e){
        // 显示label
        (map as any).add(delmarkers);
        (map as any).remove(nocontents);
      
      }else{
        // 去掉label
        (map as any).add(nocontents);
          (map as any).remove(delmarkers)
      }
      }
      (window as any).opendata=(id,phone)=>{
        drawer.value=true
        console.log(id)
        axios.get('https://e7luck.cn/hhycc/user/dvdata?dvdid='+id+'&phone='+phone).then(res=>{
          console.log(res)
        let data=res.data.data.datas
        grade.value=res.data.data.grade
        ornum.value=res.data.data.ornum
        data.forEach(i => {
          (zdata as any).push(i)
        });
        })
      }
      </script>
  
  <style scoped>
    /* *{
      margin:0;
      padding:0;
    } */
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
    top: 14%;
    left: 2%;
    text-align: left;
  }
    .block2{
   width:80%;
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
    /deep/ .el-table .el-table__cell{
      text-align: center;
    }
    /deep/ .cell{
      text-align: center;
    }
  </style>