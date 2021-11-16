<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 显示图表 -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale==='en'" command="en">En</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(type) {
      // 设置类型  先写入到cookie中
      Cookie.set('language', type) // 写入Cookie缓存
      // 改变当前的多语言
      this.$i18n.locale = type // 将当前的多语言类型改变对应的类型
      this.$message.success('切换多语言成功')
    }
  }

}
</script>
<style lang="scss" scoped>

</style>
