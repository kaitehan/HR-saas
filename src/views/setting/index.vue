<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片区域 -->
      <el-card class="card-class">
        <el-tabs v-model="activeName" class="tabs-class" @tab-click="handleClick">

          <el-tab-pane label="角色管理" name="name">
            <!-- 新增角色 -->
            <el-row>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addRoleBtn">新增角色</el-button>
            </el-row>
            <!-- 表格区域 -->
            <el-table
              :data="list"
              class="table-class"
              style="width: 100%"
              border
              stripe
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                align="center"
                prop="name"
                label="名称"
                width="240"
              />
              <el-table-column
                header-align="center"
                prop="description"
                label="描述"
                width="width"
              />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button type="success" size="mini" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" size="mini" @click="editRoleBtn(row.id)">修改</el-button>
                  <el-button type="danger" size="mini" @click="delRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="prev, pager, next"
                :total="page.total"
                @current-change="changePage"
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
            <el-form :model="formData" label-width="120px" class="form-wrap">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled type="textarea" :rows="3" style="width:400px" />
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!--新增修改 弹框组件 -->
    <el-dialog
      :title="changTitle"
      :visible.sync="showDialogVisible"
      width="50%"
      :before-close="dialogBeforeClose"
    >
      <el-form ref="editRoleFormRef" :rules="RoleRules" :model="role" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.description" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogBeforeClose">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showProDialog"
      width="50%"
      @close="btnCancle"
    >
      <!-- 权限树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="treeRef"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        show-checkbox
        check-strictly
        node-key="id"
        :default-checked-keys="checkedIds"
      />
      <!-- 底部区域 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button type="primary" @click="btnOk">确 定</el-button>
          <el-button @click="btnCancle">取 消</el-button>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, delRole, getRoleDetail, updateRole, addRole, assignPermission } from '@/api/settings'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data: function() {
    return {
      activeName: 'name',
      list: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      formData: {
        // 公司信息
      },
      showDialogVisible: false,
      role: {
        name: '',
        description: ''
      },
      RoleRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      showProDialog: false,
      permData: [],
      defaultProps: {
        // 定义默认显示的字段
        label: 'name',
        children: 'children'
      },
      roleId: '',
      checkedIds: []

    }
  },
  computed: {
    ...mapGetters(['companyId']),
    changTitle() {
      return this.role.id ? '编辑角色' : '添加角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    handleClick() {},
    async getRoleList() {
      // 参数可以多不可以少
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    delRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRole(id)
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async editRoleBtn(id) {
      this.role = await getRoleDetail(id)
      this.showDialogVisible = true
    },
    dialogBeforeClose() {
      // 关闭对话框事件
      this.role = {
        name: '',
        description: ''
      }
      this.showDialogVisible = false
      this.$refs.editRoleFormRef.resetFields()
    },
    updateRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (valid) {
          if (this.role.id) {
            // 编辑角色
            await updateRole(this.role)
            this.$message.success('更新角色成功')
          } else {
            // 添加角色
            await addRole(this.role)
            this.$message.success('添加角色成功')
          }

          this.getRoleList()
          this.showDialogVisible = false
          this.$message.success('更新角色成功')
        } else {
          this.showDialogVisible = false
          this.$message.error('更新角色失败，请稍后再试')
        }
      })
    },
    addRoleBtn() {
      this.showDialogVisible = true
    },
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')// 所有权限点
      // 记录需要修改权限的角色
      this.roleId = id
      // 获取此角色的权限
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的所有权限id
      // console.log(permIds)
      // 将当前角色所拥有的权限id渲染出来
      this.checkedIds = permIds
      this.showProDialog = true
    },
    async btnOk() {
      await assignPermission({ id: this.roleId, permIds: this.$refs.treeRef.getCheckedKeys() })
      this.showProDialog = false
      this.$message.success('分配权限成功')
    },
    btnCancle() {
      this.checkedIds = []
      this.showProDialog = false
    }
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
