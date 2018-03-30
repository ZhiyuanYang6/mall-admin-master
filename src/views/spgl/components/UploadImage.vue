<template>
  <div>
    <el-form ref="form" :model="formline" size="small" label-width="80px" :inline="true">
      <el-form-item label="商品编号">
        <el-input v-model="formline.name" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="formline.name" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="formline.name" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="formline.name" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="售价">
        <el-input v-model="formline.name"></el-input>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" :rows=5 style="width:600px;" v-model="formline.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" style="position: relative;top: 80px"> 保存</el-button>
      </el-form-item>
    </el-form>
    <span>主图上传</span>
    <hr>
    <el-upload class="upload-demo" ref="upload1" action="http://192.168.1.123:8088/mall/sptp/addsptp.do" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" list-type="picture" :limit="1" :data="uploadData" :before-upload="beforeloadsub" :on-exceed="exceedsub">
      <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
      <!-- <i class="el-icon-plus"></i> -->
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="has">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，主图只能上传1张图片且只有上传主图后才能上传详情图。</div>
    </el-upload>
    <span>详情图上传</span>
    <hr>
    <el-upload class="upload-demo" ref="upload2" action="http://192.168.1.123:8088/mall/sptp/addsptp.do" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" list-type="picture-card" :multiple="true" :limit="6" :data="uploadData" :before-upload="beforeloadsub" :on-exceed="exceedsub">
      <!-- <el-button slot="trigger" size="small" type="primary">选取图片</el-button> -->
      <i class="el-icon-plus"></i>
    </el-upload>
    <div slot="tip" class="el-upload__tip">
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="!this.has">上传到服务器</el-button>
      <span>只能上传jpg/png文件，且不超过500kb，最多上传6张图片。</span>
    </div>
    <!-- on-exceed文件超出个数限制时的钩子 -->
    <!-- http-request	覆盖默认的上传行为，可以自定义上传的实现 -->
    <!-- on-remove	文件列表移除文件时的钩子 -->
    <!-- before-upload上传图片之前 -->
    <!-- auto-uoload是否自动上传 -->
    <!-- on-success上传成功 -->
    <!-- on-preview	点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据 -->
    <!-- on-remove	文件列表移除文件时的钩子 -->
    <!-- on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 -->
    <!-- multiple 可以选择多个文件-->
  </div>
</template>
<script>
import { Message } from 'element-ui';

export default {
  data() {
    return {
      has: false,
      formline: {
        spbh: '',
        title: '',
        type: '',
        brand: '',
        spbh: '',
      },
      uploadData: { spbh: 0, xh: -1 },
      fileList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ]
    };
  },
  methods: {
    submitUpload() {
      if (!this.has) {
        this.$refs.upload1.submit();
      }
      this.$refs.upload2.submit();
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) { //点击选中图片
      // console.log(file);
    },
    beforeloadsub(file) { //提交前
      this.uploadData.xh++;
      this.has = true;
    },
    exceedsub(files, fileList) {
      console.log(this.has)
      if (!this.has) {
        this.$message({ message: '主图只能上传1张图片', type: 'warning' });
      }
      this.$message({ message: '最多上传6张图片', type: 'warning' });
    }
  }
}

</script>
<style scoped>
hr {
  margin-top: 0;
}

</style>
