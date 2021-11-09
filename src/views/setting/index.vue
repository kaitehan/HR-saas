<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片区域 -->
      <el-card class="card-class">
        <el-tabs v-model="activeName" class="tabs-class" @tab-click="handleClick">

          <el-tab-pane label="角色管理" name="name">

            <el-row>
              <el-button type="primary" icon="el-icon-plus" size="small">新增角色</el-button>
            </el-row>
            <!-- 表格区域 -->
            <el-table
              class="table-class"
              style="width: 100%"
              border
              stripe
            >
              <el-table-column
                label="序号"
                width="120"
              />
              <el-table-column
                label="名称"
                width="240"
              />
              <el-table-column
                label="描述"
                width="width"
              />
              <el-table-column label="操作">
                <el-button type="success" size="small">分配权限</el-button>
                <el-button type="primary" size="small">修改</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                layout="prev, pager, next"
                :total="50"
              />
            </el-row>

          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="name1">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form ref="form" label-width="120px" class="form-wrap">
              <el-form-item label="公司名称">
                <el-input disabled style="width:400px" placeholder="" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width:400px" placeholder="" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input disabled style="width:400px" placeholder="" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width:400px" placeholder="" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input disabled type="textarea" :rows="3" style="width:400px" placeholder="" />
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      activeName: 'name'
    }
  }, methods: {
    handleClick() {}
  }
}
</script>

<style lang="scss" scoped>
.form-wrap{
  margin-top: 50px ;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.card-class{
  padding: 50px;
  .table-class{
    margin-top: 20px;
  }
}

</style>
