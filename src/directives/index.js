export const imageerror = {
  // 指令对象,会在当前的dom元素插入到结点之后执行
  inserted(dom, options) {
    // options 是指令中变量的解释 其中一个属性叫做 value
    // dom 表示当前指令的作用的dom对象
    // dom 认为就是当前img对象

    // 判断dom.src是否存在
    dom.src = dom.src || options.value

    dom.onerror = function() {
      // 当图片出现异常 的时候 会将指令配置里的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value
    }
  },
  // 该函数同 inserted一样也是一个钩子函数
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件  更新数据完毕后 执行
    // inserted 只会执行一次
    // 组件初始化 一旦更新就不会再进入 inserted 会进入 componentUpdated函数
    dom.src = dom.src || options.value
  }
}

// <img v-imageerror="img" />
//   data(){
//     return{
//       img:'a.png'
//     }
//   }
