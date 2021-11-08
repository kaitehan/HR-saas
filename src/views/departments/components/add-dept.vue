<template>
  <el-dialog
    :title="showTitle"
    :visible="isAddShow"
    width="50%"
    :before-close="btnCancel"
  >
    <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addForm.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- .native修饰符 可以获取原生元素的事件 -->
        <el-select v-model="addForm.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="addForm.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartment, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    isAddShow: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称 要去和同级别部门下的部门去比较  有没有重复  如果有相同的则返回 false
      const { depts: res } = await getDepartments()
      let isRepeat = false
      if (this.addForm.id) {
        // 编辑模式
        // 编辑的数据  在数据库里有！！ 同级部门下  部门名称不能和其他部门名称相同
        // 先找同级部门
        isRepeat = res.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 添加模式
        // 去统计目录下 有没有相同部门名称 === value
        isRepeat = res.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下，${value}已存在`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts: res } = await getDepartments()
      let isRepeat = false
      if (this.addForm.id) {
        isRepeat = res.filter(item => item.id !== this.treeNode.id).some(item => item.id === value && value.trim())
      } else {
        isRepeat = res.some(item => item.code === value && value.trim())
      }
      isRepeat ? callback(new Error(`${value}编码已存在`)) : callback()
    }
    return {
      addForm: {
        name: '',
        code: '',
        introduce: '',
        manager: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度为1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []

    }
  },
  computed: {
    showTitle() {
      return this.addForm.id ? '编辑部门' : '添加部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情办法
    async getDepartDetail(id) {
      // props传值是异步的
      this.addForm = await getDepartDetail(id)
      console.log(this.addForm)
    },
    btnOk() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          if (this.addForm.id) {
            await updateDepartments(this.addForm)
          } else {
            await addDepartment({ ...this.addForm, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          // 子组件  update: 固定写法 （update:prop名称，值）
          this.$emit('update:isAddShow', false)
          // 关闭dialog 的时候会 触发el-dialog的关闭事件  所以这里 不需要再 重置 表单数据了
        }
      })
    },
    btnCancel() {
      // 重置数据  因为resetFields  只能重置表单中的数据  非表单上的 比如 编辑中id 不能重置
      this.addForm = {
        name: '',
        code: '',
        introduce: '',
        manager: ''
      }
      this.$emit('update:isAddShow', false)
      // 可以重置数据 只能重置 定义在data中的数据
      this.$refs.addFormRef.resetFields()
    }
  }

}
</script>
<style lang="less" scoped>

</style>
