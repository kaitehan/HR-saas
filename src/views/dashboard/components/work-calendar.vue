<template>
  <!-- 工作日历 -->
  <div class="work-calendar-class">
    <!-- 年 月 -->
    <el-row type="flex" justify="end">
      <!-- 年份   用组件给定一个日期  日期获取年，年获取前五年 + 后五年-->
      <el-select v-model="currentYear" size="small" style="width:120px" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :value="item" />
      </el-select>
      <!-- 月份 -->
      <el-select v-model="currentMonth" size="small" style="width:120px;margin-left:10px" @change="dateChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <!-- date 是当前单元格的如期 data是对象，对象里有要显示的day -->
      <template slot="dateCell" slot-scope="{date,data}">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  filters: {
    getDay(date) {
      const day = date.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      yearList: [],
      currentYear: null,
      currentMonth: null,
      currentDate: null
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    // 快速生成数组的方法
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentYear - 5)
    // 钩子函数执行完成后
    this.dateChange()
  },
  methods: {
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }

}
</script>
<style  scoped>

  /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
/deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }

</style>
