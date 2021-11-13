<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools show-before>
        <!-- 左侧显示总记录数 -->
        <!-- <span slot="before">共有16条记录</span> -->
        <template v-slot:before>
          <span>共有{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入  excel导出  新增员工 -->
        <template v-slot:after>
          <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="exportData">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog= true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 放置表格和分页 -->
      <el-card>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="list" border>
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像" width="120px" align="center">
            <template v-slot="{row}">
              <img
                v-imageerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius:50%;width:100px;height:100px;padding:10px"
                @click="showQrcode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="mobile" label="手机号" sortable="" />
          <!-- 利用格式化属性 format  来对数据进行格式化 -->
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <!-- 通过作用域插槽 + 过滤器来对数据进行格式化 -->
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template slot-scope="scope">
              <!-- 将时间格式化 -->
              {{ scope.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template v-slot="scope">
              <el-switch
                :value="scope.row.enableState===1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            layout="prev, pager, next"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      width="25%"
    >
      <!-- 二维码区域 -->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配组件 -->
    <assign-role ref="assignRoleRef" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工 的枚举对象
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import Qrcode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 分页改变页码时触发
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    // row  行数据
    // colum 列属性
    // cellValue  单元格数据
    // index
    formatEmployment(row, column, cellValue, index) {
      // 要去找cellValue所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    delEmployee(id) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployee(id)
        this.getEmployeeList()
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
    exportData() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出EXCEL
      import('@/vendor/Export2Excel').then(async excel => {
        // excel 是引入文件的导出对象
        // 导出  header从哪来？
        // data 从哪来
        // Object.keys(headers) 表头
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(rows, headers)
        // 复杂表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        // 合并单元格
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工列表',
          autoWidth: true,
          bookType: 'xlsx',
          multiHeader, // 复杂表头
          merges// 合并选项
        })
        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['李四', 3000], ['张三', 2000]],
        //   filename: '员工信息表',
        //   autoWidth: true,
        //   bookType: 'xlsx'
        // })
        // [{username:'张三',mobile:13455556666}] => [[]] 需要
        // 要转化 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    // [{}] => [[]]
    formatJson(data, headers) {
      return data.map(item => {
        // item 是一个对象 {mobile:13135353333,username:'张三'}
        // 要转成 ["手机号","姓名",...]
        return Object.keys(headers).map(obj => {
          if (headers[obj] === 'timeOfEntry' || headers[obj] === 'correctionTime') {
            return formatDate(item[headers[obj]])
          } else if (headers[obj] === 'formOfEmployment') {
            // return item[headers[obj]] === 1 ? '正式' : '非正式'
            const res = EmployeeEnum.hireType.find(x => x.id === item[headers[obj]])
            return res ? res.value : '未知'
          }
          return item[headers[obj]]
        })
        // ['13135353333','张三']
      })
      // 精简代码
      // return data.map(item => Object.keys(headers).map(obj => item[headers[obj]]))
    },
    showQrcode(url) {
      if (url) {
        this.showCodeDialog = true // 数据更新了  但是弹层不会立即出现  页面的渲染是异步的！！！
        this.$nextTick(() => {
          Qrcode.toCanvas(this.$refs.myCanvas, url) // 将地址转换为二维码
          // 如果转化的二维码后面信息  是一个地址的话  就会跳转到改地址  如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRoleRef.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }

}
</script>

<style>

</style>
