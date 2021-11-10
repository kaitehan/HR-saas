<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>
<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // header中的数据是中文 results数据也是中文
      // 新增员工的属性是一致的
      //   username: 姓名,
      //   mobile: 手机号,
      //   formOfEmployment: 聘用形式,
      //   workNumber: 工号,
      //   departmentName: 部门,
      //   timeOfEntry: 入职日期,
      //   correctionTime: 转正日期
      // 如果是导入员工
      // ,
      //   '部门': 'departmentName',
      //   '聘用形式': 'formOfEmployment'
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }

      var newArray = results.map(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 由于后端接口  限制了  不能是字符串  要求转化时间类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样才能入库
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        return userInfo
      })
      console.log(newArray)
      await importEmployee(newArray) // 接收一个数组
      this.$message.success('导入数据成功')
      this.$router.back()
    },
    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
