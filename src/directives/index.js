export const imageerror = {
  // 指令对象,会在当前的dom元素插入到结点之后执行
  inserted(dom, options) {
    // options 是指令中变量的解释 其中一个属性叫做 value
    // dom 表示当前指令的作用的dom对象
    // dom 认为就是当前img对象
    dom.onerror = function() {
      // 当图片出现异常 的时候 会将指令配置里的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value
    }
  }
}

// <img v-imageerror="img" />
//   data(){
//     return{
//       img:'a.png'
//     }
//   }
