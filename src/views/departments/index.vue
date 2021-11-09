<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree :data="departs" :props="defaultProps">
          <!-- 传入内容 插槽内容  会循环多次  和节点数量相同 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- .sync修饰符 可以省略父组件的监听和方法，直接将值赋给isAddDialogShow
      是 【子组件中 $emit(事件名)  父组件中 @事件名】  的语法糖
     -->
    <add-dept ref="addDeptRef" :is-add-show.sync="isAddDialogShow" :tree-node="node" @addDepts="getDepartments" />

  </div>
</template>

<script>

import TreeTools from './components/tree-tools.vue'
import AddDept from '@/views/departments/components/add-dept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: { TreeTools, AddDept },
  data() {
    return {
      company: { name: '荣成鑫鑫企业有限公司', manager: '负责人' },
      defaultProps: {
        label: 'name'
      },
      departs: [],
      isAddDialogShow: false,
      node: null,
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: res.companyManager, id: '' }
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
      // this.departs = {res.depts}
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.isAddDialogShow = true
      this.node = node
    },
    editDepts(node) {
      this.isAddDialogShow = true
      this.node = node
      this.$refs.addDeptRef.getDepartDetail(node.id)
    }
  }

}
</script>

<style>
.tree-card{
  overflow: auto;
  padding: 30px 140px;
  font-size: 16px;
}
</style>
