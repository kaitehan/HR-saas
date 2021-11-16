// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址  /employees
  name: 'employees', // 给模块的一级路由加一个name属性，  这个属性  我们后面会在做权限的时候使用
  component: Layout,
  children: [
    {
      // 二级权限的 path 什么都不写的时候  此时它表示二级路由的默认路由
      path: '', // 这里不用写  什么都不写表示  /employees  不但有布局  Layout  还有  员工主页
      name: 'employees',
      component: () => import('@/views/employees'),
      // 路由信息  其实是一个存放数据的地方  可以放任何内容
      meta: {
        title: '员工管理', // 这里为什么要用 title ? 因为左侧导航读取了这里的title属性
        icon: 'people'
      }
    }, {
      path: 'detail/:id', // ?的含义是表示该参数可传可不传 动态参数  /employee/detail/123  /employee/detail
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '打印管理',
        icon: 'people'
      }
    }
  ]

}
