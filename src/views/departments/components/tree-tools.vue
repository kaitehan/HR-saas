<template>
  <el-row class="item-wrap">
    <el-col class="left-wrap">
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row class="right-wrap">
        <el-col class="managerClass">{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown trigger="click" @command="operateDepts">
            <!-- 内容 -->
            <span class="operate-wrap">操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
    <!-- 右侧内容 -->
  </el-row>
</template>
<script>
import { delDepartment } from '@/api/departments'

export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      // 点击 编辑、新增、删除 时触发
      if (type === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('确定要删除该部门吗？').then(() => {
          return delDepartment(this.treeNode.id)
        }).then(() => {
          this.$message.success('删除成功！')
          // 只需要等到成功的时候，调用了接口进行删除操作， 现在需要去更新视图
          this.$emit('delDepts') // 触发自定义事件
        })
      }
    }
  }

}
</script>

<style lang="scss" scoped>
// type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%"
.item-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: 100%;
  .left-wrap{
    min-width: 300px;
  }

}
.managerClass{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.right-wrap{
  display: flex;
  justify-content: flex-end;
  min-width: 140px;
}
.operate-wrap{
  font-size: 16px;
  min-width: 80px;
}
</style>
