// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/salarys', // 路由地址  /salarys
  name: 'salarys', // 给模块的一级路由加一个name属性，  这个属性  我们后面会在做权限的时候使用
  component: Layout,
  children: [
    {
      // 二级权限的 path 什么都不写的时候  此时它表示二级路由的默认路由
      path: '', // 这里不用写  什么都不写表示  /salarys  不但有布局  Layout  还有  员工主页
      component: () => import('@/views/salarys'),
      // 路由信息  其实是一个存放数据的地方  可以放任何内容
      meta: {
        title: '工资', // 这里为什么要用 title ? 因为左侧导航读取了这里的title属性
        icon: 'money'
      }
    }
  ]

}
