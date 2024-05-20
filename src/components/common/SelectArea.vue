<template>
    <div class="search" >
    <el-button
      type="primary"
      style="position: absolute;right:35px;top:45px"
      @click="drawer = true"
    >
      选择查询区划
    </el-button>
    <el-drawer
    v-model="drawer"
    title="区划选择"
    direction="rtl"
    size="15%"
  >
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
  </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent,ref } from 'vue';

    let drawer=ref(false)
    interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}
</script>

<style scoped>
.search{
    /* width:100%;
    height:100%;
    text-align: justify; */
    z-index: 99999999999;
    position: relative;
}
.el-tree{
  margin-top:0;
}
</style>
<style lang="less" scoped>
  /deep/ .el-drawer__header{
    text-align: justify;
    margin:0!important
  }
</style>