<template>
  <div class="smain" @mouseover="Moveradd()">
    <el-form ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="90px" :inline="true">
      <el-form-item label="广告名称" prop="ggmc">
        <el-input v-model="formline.ggmc" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows=5 style="width:620px" v-model="formline.remark"></el-input>
      </el-form-item>
    </el-form>
    <span>广告图</span>
    <hr>
    <input id="zt" type="file" @change="handleFileChange('zt')
" ref="inputerzt" />
    <!-- 添加按钮 -->
    <div class="imgdiv">
      <div class="box">
        <label for="zt"></label>
        <img :src="detilgg.src" :class="{'ztimg':true,'ztimgshow':listrow.showzt}" />
        <i class="el-icon-plus"></i>
      </div>
      <!-- 展现的base64图片 -->
      <!-- <div> -->
      <!-- <img :src="detilzt.src" :class="{'ztimg':true,'ztimgshow':listrow.showzt}" /> -->
      <!-- <div class="tpmc"> -->
      <!-- <p>{{detilzt.name}}</p> -->
      <!-- </div> -->
      <!-- </div> -->
      <div class="tpbtn">
        <span style="margin-left:-100px">只能上传jpg/png文件，且不超过500kb。</span>
        <el-button style="float: right;margin-right:50px" size="small" type="success" @click="submitUpload('formline')">{{listrow.btn}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  props: ['listrow', "uploadimagehas"],
  data() {
    var validsfk = (rule, value, callback) => {
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
      }, 400);
    };
    return {
      formline: {
        endDate: "结束时间",
        ggmc: "",
        ggurl: "",
        remark: '',
        startDate: "开始日期",
        sj: "",
        ggid: "",
      },
      rules2: {
        ggwzb: [{ validator: validsfk, trigger: 'blur' }],
        ggmc: [{ validator: validsfk, trigger: 'blur' }],
        ggwlx: [{ validator: validsfk, trigger: 'blur' }],
        ggwmc: [{ validator: validsfk, trigger: 'blur' }],
        sj: [{ validator: validsfk, trigger: 'blur' }],
      },
      onceover: false,
      detilgg: [], //展示图
      ggtpsize: '',
      zt: ''
    }
  },
  created: function() { //创建组件初始化
    this.onceover = true;
  },
  watch: {
    uploadimagehas: function(data, olddata) {
      if (data) {
        // debugger;
        console.log("uploadimagehas：" + data)
        this.onceover = data;
      }
    }
  },
  methods: {
    Moveradd() { ////////////////////////创建后进入组件初始化
      if (this.onceover) {

        this.onceover = false;
        console.log(this.listrow);
        if (this.listrow.btn == "添加") {} else {
          this.formline = {
            ggmc: this.listrow.ggmc,
            remark: this.listrow.remark,
            ggurl: this.listrow.ggurl,
            ggid: this.listrow.id
          }
          this.detilgg = [];
          this.detilgg.src = this.listrow.ggurl;
          this.zt = this.detilgg;
          this.listrow.showzt = true;
        }
      }
    },

    ADSubmit() { //发送参数到父组件 事件名，参数
      this.onceover = true;
      this.$emit("dialog1Changed", 0);
    },
    handleFileChange(value) { //监听状态改变 
      if (value == "zt") {
        var inputDOM = this.$refs.inputerzt;
        this.zt = inputDOM.files[0];
        if (this.imgvalidator(inputDOM.files[0])) return;
        this.imgPreview(inputDOM.files[0], value); //显示上传的图片
      }
    },
    imgPreview(file, value) { //用base64展现图片
      if (!file || !window.FileReader) return; // 看支持不支持FileReader
      if (/^image/.test(file.type)) {
        var reader = new FileReader(); // 创建一个reader
        reader.readAsDataURL(file); // 将图片将转成 base64 格式
        reader.onloadend = () => { // 读取成功后的回调
          var listimage = { "src": reader.result, "name": file.name }
          if (value == "zt") {
            this.listrow.showzt = true;
            this.detilgg = listimage;
            this.ggtpsize = file.size;
          }
        }
      }
    },
    imgvalidator(file) { //图片验证规则
      if (!file) {
        this.$message({ message: '选择图片为空', type: 'warning' });
        return false;
      } else if (file.size / 1024 > 500) { ///////////////////////////设置图片上传大小
        this.$message({ message: '图片不能超过500KB', type: 'warning' });
        return true;
      } else {
        return false;
      }
    },
    submitUpload(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var url;
          if (this.listrow.btn == "修改") {
            url = "updategg.do";
          } else {
            url = "addgg.do";
          }
          if (this.detilgg == "") { this.$message({ message: '未选择主图', type: 'warning' }); return }
          this.subimage(this.zt, url);
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }

      })
    },
    subimage(file, url) {
      var formdata1 = new FormData();
      formdata1.append('file', file);
      formdata1.append('ggmc', this.formline.ggmc);
      formdata1.append('ggdx', this.ggtpsize);
      formdata1.append('remark', this.formline.remark);
      formdata1.append('id', this.formline.ggid);
      console.log("-------------" + formdata1);
      request({ url: 'mall/gg/' + url, method: 'post', data: formdata1 }).then(response => {
          var type;
          if (response.code == "1") {
            type = 'success';
          } else {
            type = 'warning';
          }
          this.$message({ message: response.msg, type: type });
          this.ADSubmit(); //返回父组件
          return;
        })
        .catch((error) => {
          this.$message({ message: '未知错误,请联系管理员', type: 'error' });
          this.ADSubmit(); //返回父组件
          console.log(error);
        })
    }
  },
}

</script>
<style scoped>
.imgdiv {
  height: 150px;
}

.tpbtn {
  position: relative;
  top: 120px;
}

input {
  position: absolute;
  left: -9999px;
}

.ztimg {
  position: absolute;
  transition: opacity 2s, top 1s;
  opacity: 0;
  top: -60px;
  left: -1px;
  width: 100px;
  height: 100px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

div img.ztimgshow {
  opacity: 1;
  top: -1px;
  z-index: 1;
}


.ztsz {
  position: relative;
  height: 180px;
}

div.tpmc {
  position: relative;
  top: 40px;
  left: 150px;
}

.box {
  position: relative;
  float: left;
  width: 100px;
  height: 100px;
  border: 1px dashed #C0CCDA;
  border-radius: 5px;
  background: #FBFDFF;
}

div.box i {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: #8c939d;
}

.upimage .box:hover {
  border: 1px dashed #409EFF;
}


label {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

</style>
