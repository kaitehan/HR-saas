<template>
  <div class="dashboard-container">
    <page-tools show-before>
      <!-- 插槽除了slot='name'   还可以使用v-slot-->
      <template v-slot:before>
        <span slot="before"> hahah</span>
      </template>

      <el-button slot="after" type="primary" size="small">导入excel</el-button>
    </page-tools>
    <UploadExcel />
    <ImageUpload />
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
