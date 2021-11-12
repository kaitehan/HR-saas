<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="formRef" label-width="120px" :rules="rules" :model="userInfo" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" type="password" style="width:300px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置内容 -->
            <!-- vuejs中 内置了一个组件  component  可以是任何组件 -->
            <!-- <user-info /> -->
            <component :is="UserComponent" />
            <!-- is必须是变量 -->
            <!-- 动态组件  可以根据 is 绑定的组件名称来  切换组件 -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置内容 -->
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserComponent: 'user-info',
      JobComponent: 'job-info',
      userId: this.$route.params.id, // 直接将路由参数中的id赋值给data中的属性
      userInfo: {
        username: '',
        password2: '' // 为什么加password2  因为读取出来的password是密文
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 9, message: '长度在 6 到 9 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
      this.$refs.formRef.validate().then(async() => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('修改用户信息成功')
      })
    }

  }

}
</script>
<style lang="scss" scoped>

</style>
