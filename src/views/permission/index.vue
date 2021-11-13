<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格区域 -->
      <el-table border :data="list" row-key="id">
        <el-table-column
          prop="name"
          label="名称"
          width="width"
        />
        <el-table-column
          align="center"
          prop="code"
          label="标识"
          width="width"
        />
        <el-table-column
          align="center"
          prop="description"
          label="描述"
          width="width"
        />
        <el-table-column
          align="center"
          prop="prop"
          label="操作"
          width="width"
        >
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPromission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑弹层 -->
    <el-dialog
      :title="showText"
      :visible.sync="showDialog"
      @close="btnCancle"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" width="50%">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <!-- 当值为1时激活 -->
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" style="width:90%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button @click="btnCancle">取 消</el-button>
          <el-button type="primary" @click="btnOk">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入标识', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确认删除该权限吗').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    addPermission(type, pid) {
      // 访问权的type=1  按钮操作的权 type=2
      // pid  表示当前数据的父节点的标识
      // 记录当前的类型和父标识
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOk() {
      this.$refs.formRef.validate().then(() => {
        // 校验成功
        if (this.formData.id) {
          return this.editPromission(this.formData) // 编辑接口
        } else {
          return addPermission(this.formData) // 新增接口
        }
      }).then(() => {
        // 添加成功
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancle() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
      this.$refs.formRef.resetFields()
    },
    async editPromission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }

  }

}
</script>

<style>

</style>
