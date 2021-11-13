<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格区域 -->
      <el-table border>
        <el-table-column
          align="center"
          prop="prop"
          label="名称"
          width="width"
        />
        <el-table-column
          align="center"
          prop="prop"
          label="标识"
          width="width"
        />
        <el-table-column
          align="center"
          prop="prop"
          label="描述"
          width="width"
        />
        <el-table-column
          align="center"
          prop="prop"
          label="操作"
          width="width"
        >
          <el-button type="text">添加</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
