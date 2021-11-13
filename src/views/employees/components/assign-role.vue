<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="btnCancle"
  >
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 要循环的选项 -->
      <!-- label表示要存储的值 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <!-- 底部区域 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancle">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/settings'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 负责存储当前所有角色id
      roleIds: []// 这个数组负责存储  当前用户所拥有的角色id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })// 默认只取十条数据 由于角色数量不多
      // rows 是要循环的记录
      this.list = rows
    },
    // props传值是异步的 所以这里不能用  this.userId
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
      // this.$parent.showRoleDialog = false
      this.$message.success('分配权限成功')
    },
    btnCancle() {
      this.$emit('update:showRoleDialog', false)
      this.roleIds = [] // 重置数组，将他还原成初始状态
    }

  }
}
</script>
