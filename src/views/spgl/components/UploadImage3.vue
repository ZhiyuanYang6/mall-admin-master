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
    <el-button style="margin-right:5%;position: absolute;right: 0;" size="small" type="primary">选取主图</el-button>
    只能上传jpg/png文件，且不超过500kb，主图只能上传1张图片且必传。
    <span>详情图上传</span>
    <hr>
    <div class="upimage" id="upimage" @onmouseenter="mouseImage">
      <div class="syeimage box" v-for="item in detiltp">
        <span class="zzc">
          <i class="el-icon-zoom-in" style="left:35%;color: #ecececd9;"></i>
          <i class="el-icon-delete" style="left:65%;color: #ecececd9;"></i>
        </span>
        <img :src="item.src" style="width:100%;height:100%;border-radius: 10px;" />
      </div>
      <div class="box">
        <input id="id" type="file" @change="handleFileChange" ref="inputer" />
        <label for="id"></label>
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <el-button style="float:right;margin:-5px 3% 0 0;" size="small" type="success" @click="submitUpload('listrow')">{{listrow.btn}}</el-button>
    <span>只能上传jpg/png文件，且不超过500kb，最多上传6张图片。</span>
    <hr>
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
      fileList1: [],
      fileList2: [],
      options1: [],
      options2: [],
      options3: '',
      //图片数据
      xh: 0, //图片序号
      fileimg: [], //上传的图片对象
      detiltp: [], //展示的详情图片
    };
  },
  computed: {
    listrowdata: function() {
      console.log(this.listrow);
      return this.listrow;
    }
  },
  mounted: function() {
    upimage.style.height = "210px";
  },
  methods: {
    getAnswer() {
      console.log(this.listrowdata);
    },
    submitUpload(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.xh) {
            this.$message({ message: '未选择主图', type: 'error' });
          } else {
            if (!this.xh) {
              this.subimage(); //提交表单
              this.ADSubmit(); //返回父组件
            }
          }
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
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
      this.$message({ message: '商品添加成功', type: 'success' });
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
    // ////////////////////////图片上传模块
    handleFileChange(e) { //监听状态改变 
      if (this.fileimg.length >= 3) {
        upimage.style.height = "430px";
      } else {
        upimage.style.height = "210px";
      }
      let inputDOM = this.$refs.inputer;
      this.fileimg.push(inputDOM.files[0]); // 通过DOM取文件数据
      console.log(this.fileimg)
      this.imgPreview(inputDOM.files[0]); //显示上传的图片
    },
    imgPreview(file) { //用base64展现图片
      if (!file || !window.FileReader) return; // 看支持不支持FileReader
      if (/^image/.test(file.type)) {
        var reader = new FileReader(); // 创建一个reader
        reader.readAsDataURL(file); // 将图片将转成 base64 格式
        reader.onloadend = () => { // 读取成功后的回调
          var listimage = { "src": reader.result, "name": name }
          this.detiltp.push(listimage);
        }
      }
    },
    mouseImage(event) {
      console.log("鼠标进入了")
    },
    subimage() { //提交表单
      var formdata1 = new FormData();
      if (this.fileimg.type) {
        formdata1.append('file', this.fileimg);
        formdata1.append('xh', this.xh);
        formdata1.append('spbh', this.listrow.spbh);
        formdata1.append('spsj', this.listrow.spsj);
        formdata1.append('spmc', this.listrow.spmc);
        formdata1.append('remark', this.listrow.remark);
        formdata1.append('flId', this.listrow.flId);
        axios.post('http://192.168.1.123:8088/mall/spxx/addspxx.do', formdata1)
          .then(response => {
            this.xh++;
            debugger;
          })
          .catch(error => {
            debugger;
          })
      }
    }
  }
}

</script>
<style scoped>
hr {
  margin-top: 0;
}


/*自定义的图片上传模块*/

.upimage {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.box {
  position: relative;
  float: left;
  width: 180px;
  height: 200px;
  border: 1px dashed #C0CCDA;
  border-radius: 10px;
  background: #FBFDFF;
}

.upimage .box:hover {
  border: 1px dashed #409EFF;
}

input {
  position: absolute;
  left: -9999px;
}

label {
  /*cursor: pointer;*/
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  cursor: not-allowed;
}

div.box i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: #8c939d;
}

.syeimage {
  border: 1px solid #C0CCDA;
  margin-right: 10px;
  margin-bottom: 10px;
}


.zzc {
  border-radius: 10px;
  background: #0000004d;
  z-index: 11;
  text-align: center;
  font-size: 20px;
  width: 100%;
  height: 100%;
  opacity: 0;
  display: block;
  position: absolute;
}

span.zzc:hover {
  opacity: 1;
}

span.zzc i {
  cursor: pointer;
}

</style>
