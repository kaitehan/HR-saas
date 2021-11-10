<template>
  <el-dialog
    title="添加员工"
    :visible="showDialog"
    width="50%"
    @close="handleClose"
  >
    <el-row class="form-class">
      <el-form ref="formRef" :rules="formRules" :model="formData" label-width="120px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择聘用形式">
            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" v-loading="loading" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
          <el-tree
            v-if="showTree"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            @node-click="selectNode"
          />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker v-model="formData.correctionTime" style="width:50%" type="date" placeholder="请选择日期" />
        </el-form-item>
      </el-form>
    </el-row>

    <el-row slot="footer" type="flex" justify="center">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addEmployee">确 定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  // 模板中的数据，只能来源于 props data computed
  // 其他来源的数据必须放到上述的三个属性中
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { parrern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '请选择聘用形式', trigger: 'change' }
        ],
        workNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' }
        ]
      },
      treeData: [],
      defaultProps: {
        label: 'name'
      },
      showTree: false,
      loading: false

    }
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      // depts是一个数组  他需要转化为树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.showTree = true
      this.loading = false
    },
    selectNode(data, node, component) {
      // 树形结构的点击事件
      // data  点击节点的数据对象
      // node  节点对应的node节点属性
      // component 节点对应的组件对象
      console.log(arguments)
      this.formData.departmentName = data.name
      this.showTree = false
    },
    handleClose() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formRef.resetFields()
      this.$emit('update:showDialog', false)
    },
    async addEmployee() {
      try {
        await this.$refs.formRef.validate()
        await addEmployee(this.formData)// 调用新增接口
        // 通知父组件 更新数据
        // this.$parent  //父组件的实例
        this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        // this.$emit('update:showDialog', false)
        this.$parent.showDialog = false
        this.$message.success('添加员工成功')
      } catch (err) {
        console.log(err)
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.form-class{
  padding-left: 80px;
}
</style>
