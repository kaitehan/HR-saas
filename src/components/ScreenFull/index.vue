<template>
  <!-- 因为要布局  所以此处设置为块元素 -->
  <div>
    <svg-icon style="color:#fff;width:20px;height:20px" icon-class="fullscreen" @click="changeScreen" />
  </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      // document.documentElement.requestFullscreen()// 这是原生方式
      if (!screenfull.isEnabled) {
        this.$message.warning('当前全屏功能不可用')
        return
      }

      screenfull.toggle()
    }
  }

}
</script>
<style lang="scss" scoped>

</style>
