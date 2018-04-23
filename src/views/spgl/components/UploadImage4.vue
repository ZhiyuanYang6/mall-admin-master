<template>
  <div @click="selesplx('',1)">
    <el-form ref="listrow" :model="listrow" status-icon :rules="rules2" size="small" label-width="80px" :inline="true">
      <el-form-item label="商品编号" prop="spbh">
        <el-input v-model="listrow.spbh" style="width:215px;"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="spmc">
        <el-input v-model="listrow.spmc" style="width:215px;"></el-input>
      </el-form-item>
      <el-form-item label="商品售价" prop="spsj">
        <el-input v-model.number="listrow.spsj" style="width:215px;"></el-input>
      </el-form-item>
      <el-form-item label="分类品牌" prop="sppp">
        <el-select clearable v-model="listrow.splx" placeholder="请选择类型" @change="selesplx">
          <el-option v-for="item in options1" :key="item.value" :label="item.splx" :value="item.id">
          </el-option>
        </el-select>
        <el-select clearable v-model="listrow.sppp" placeholder="请选择品牌">
          <el-option v-for="item in options2" :key="item.value" :label="item.sppp" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :rows=5 style="width:600px;" v-model="listrow.remark"></el-input>
      </el-form-item>
    </el-form>
    <span>主图上传</span>
    <hr>
    <el-upload class="upload-demo" ref="upload1" action="http://192.168.1.123:8088/mall/spxx/addspxx.do" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false" list-type="picture" :limit="1" :data="uploadData" :before-upload="beforeloadsub" :on-exceed="exceedsub" :file-list="fileList1" :on-change="haschange">
      <el-button slot="trigger" style="margin-right:5%;position: absolute;right: 0;" size="small" type="primary">选取主图</el-button>
      <!-- <i class="el-icon-plus"></i> -->
      <div slot="tip" class="el-upload__tip" style="float: left;margin: 20px 0 10px 5px;width: 99%;">
        只能上传jpg/png文件，且不超过500kb，主图只能上传1张图片且必传。
      </div>
    </el-upload>
    <span>详情图上传</span>
    <hr>
    <el-upload class="upload-demo" ref="upload2" action="http://192.168.1.123:8088/mall/spxx/addspxx.do" :on-preview="handlePreview" :auto-upload="false" list-type="picture-card" :multiple="true" :limit="6" :data="uploadData" :before-upload="beforeloadsub" :on-exceed="exceedsub" :file-list="fileList2">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div slot="tip" class="el-upload__tip" style="margin: 10px 0 10px 5px;">
      <el-button style="float:right;margin:-5px 3% 0 0;" size="small" type="success" @click="submitUpload('listrow')">{{listrow.btn}}</el-button>
      <span>只能上传jpg/png文件，且不超过500kb，最多上传6张图片。</span>
    </div>
    <hr>
    <!-- on-exceed文件超出个数限制时的钩子 -->
    <!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 -->
    <!-- on-remove  文件列表移除文件时的钩子 -->
    <!-- before-upload上传图片之前 -->
    <!-- auto-uoload是否自动上传 -->
    <!-- on-success上传成功 -->
    <!-- on-preview 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据 -->
    <!-- on-remove  文件列表移除文件时的钩子 -->
    <!-- on-change  文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 -->
    <!-- multiple 可以选择多个文件-->
  </div>
</template>
<script>
import { Message } from 'element-ui';
import axios from 'axios';

export default {
  props: ['listrow'],
  data() {
    var validspbh = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商品编号不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('商品编号不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    var validspmc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('商品名称不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('商品名称不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    var validspsj = (rule, value, callback) => {
      value = parseFloat(value);
      if (!value) {
        return callback(new Error('商品售价不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      }, 1000);
    };
    var validsppp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('品牌分类不能为空'));
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    return {
      has: false,
      a: 1,
      formline: {
        spbh: '',
        spmc: '',
        remark: '',
        sppp: '',
        xh: '',
      },

      rules2: {
        spbh: [{ validator: validspbh, trigger: 'blur' }],
        spmc: [{ validator: validspmc, trigger: 'blur' }],
        spsj: [{ validator: validspsj, trigger: 'blur' }],
        sppp: [{ validator: validsppp, trigger: 'blur' }],
      },
      uploadData: { spbh: 0, xh: -1 },
      fileList1: [],
      fileList2: [],
      options1: [],
      options2: [],
      options3: '',
    };
  },
  computed: {
    listrowdata: function() {
      console.log(this.listrow);
      return this.listrow;
    }
  },
  // created: function() {
  //   debugger;
  //   this.options1 = this.listrow.options1;
  //   console.log(this.listrow)
  // },
  // watch: {
  //   'listrow.options2': function(value, oldvalue) {
  //     console.log(value, oldvalue);
  //   }
  // },
  methods: {
    getAnswer() {
      console.log(this.listrowdata);
    },
    submitUpload(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.uploadData.remark = this.listrow.remark;
          this.uploadData.spbh = this.listrow.spbh;
          this.uploadData.spmc = this.listrow.spmc;
          this.uploadData.spsj = this.listrow.spsj;
          this.uploadData.flId = this.listrow.sppp;
          if (!this.has) {
            this.$message({ message: '未选择主图', type: 'error' });
          } else {
            if (this.has) {
              this.$refs.upload1.submit();
              this.$refs.upload2.submit();
              this.ADSubmit();
              this.$message({ message: '商品添加成功', type: 'success' });
            }
          }
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    handleRemove(file, fileList) { //删除事件
      this.has = false;
    },
    handlePreview(file) { //点击选中图片
      // console.log(file);
    },
    beforeloadsub(file) { //提交前
      this.uploadData.xh++;
      console.log(this.uploadData);
      debugger;
      this.has = true;
    },
    exceedsub(files, fileList) {
      this.$message({ message: '主图只能上传1张,详情图最多上传6张', type: 'warning' });
    },
    haschange(file, fileList) { //状态改变
      this.has = true;
    },
    // 分类
    onloadtable2(val) { //品牌
      var splxData = { sppp: val };
      axios.post('http://192.168.1.123:8088/mall/spfl/searchspflbysplx.do?splx=' + splxData.sppp)
        .then((response) => {
          this.options2 = response.data.data;
        })
        .catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },

    selesplx(value, add) { //解析类别品牌
      if (add) {
        this.options1 = this.listrow.options1;
        return;
      }
      if (!value) { return; }
      this.options3 = this.listrow.options1.find((item) => {
        return item.id === value;
      });
      this.onloadtable2(this.options3.splx);
    },

    ADSubmit() {
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    }
  }
}

</script>
<style scoped>
hr {
  margin-top: 0;
}

</style>
