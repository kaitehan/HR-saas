<template>
  <div>
    <!-- 给action一个 # 号 可以阻止报错 -->
    <el-upload list-type="picture-card" :limit="1" action="#" :http-request="upload" :before-upload="beforeUpload" :on-change="changeFile" :on-preview="preview" :file-list="fileList" :class="{disabled: fileComputed }" :on-remove="handleRemove">
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px" />

    <el-dialog width="25%" :visible.sync="dialogVisible" title="图片管理">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>

</template>
<script>
// 引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
// 实例化cos
const cos = new COS({
  SecretId: 'AKIDaz81dy2qNeeOr3yc18NDo8', // 错误
  SecretKey: '3qMbYGiupTqxnLdeOKHy'// 错误

})
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      currentImageId: '',
      fileList: [],
      percent: 0, // 当前的百分比
      showPercent: false // 是否显示进度条
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    },
    // 不能用push  这个钩子函数会在上传文件时调用两次
    changeFile(file, fileList) {
      // 添加文件、上传成功和上传失败时都会被调用
      // file是当前文件
      // fileList 是新的文件列表
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList.map(item => item)
      // 当上传失败时 传进来的数据 是一个空数组
      // 如果完成上传动作 第一次进入 和第二次进去的fileList  的长度都是1  应该都有数据
      // 上传成功 =》 数据才能进来 =》 腾讯云
    },
    beforeUpload(file) {
      // console.log(file)
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentImageId = file.uid
      this.showPercent = true
      return true
    },
    // 进行上传操作
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        cos.putObject({
          // 上传到腾讯云 =>  哪个存储桶 哪个地域的存储桶 文件 格式 名称 回调函数
          Bucket: 'htgl-1308255842', // 存储桶名称
          Region: 'ap-nanjing', // 地域名称
          Key: params.file.name, // 文件名称
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 存储类型
          onProgress: (params) => {
            // console.log(params)
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // console.log(err || data)
          // data中有一个statusCode === 200 的上传成功状态
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功，要获取成功的返回地址
          //  fileList 才能显示到上传组件上 此时我们要将filelist中的数据的URL地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 找到文件列表中uid  等于刚记录下来的 uid
              if (item.uid === this.currentImageId) {
                return { url: 'http://' + data.Location, upload: true }
                // upload 为 true 表示这张图片已经上传完毕  这个属性要为我们后期应用的时候做标记
                // 点击保存按钮 => 图片有大有小 => 上传速度有快有慢 => 要根据有没有这个upload这个标记来决定是否去保存
              }
              return item
            })
            // 关闭进度条
            // 延时1秒 让用户能看到上传过程
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)

            // 将上传成功的地址 回写到了fileList中  fileList变化  => upload组件  就会根据fileList的变化而去渲染视图
          }
        })
      }
    }
  }

}
</script>
<style >
.disabled .el-upload--picture-card{
  display: none;

}

</style>
