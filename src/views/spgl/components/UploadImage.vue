<template>
  <div @mouseover="Moveradd()">
    <el-form ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="80px" :inline="true">
      <el-form-item label="商品编号" prop="spbh">
        <el-input v-model="formline.spbh" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="spmc">
        <el-input v-model="formline.spmc" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="商品售价" prop="spsj">
        <el-input v-model.number="formline.spsj" style="width:242px;"></el-input><i class="iconfont icon-renminbi"></i>
      </el-form-item>
      <el-form-item label="分类品牌" prop="flid">
        <el-cascader placeholder="请选择品牌类型" ref="options1" style="width:250px;" :options="options1" v-model="formline.flid" :show-all-levels="false" clearable> </el-cascader>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :rows=5 style="width:600px;" v-model="formline.remark"></el-input>
      </el-form-item>
    </el-form>
    <div class="ztsz">
      <span>主图上传</span>
      <hr>
      <input id="zt" type="file" @change="handleFileChange('zt')" ref="inputerzt" />
      <el-button style="margin-right:5%;position: absolute;right: 0;" size="small" type="primary">
        <label for="zt"></label>选取主图</el-button>
      只能上传jpg/png文件，且不超过500kb，主图只能上传1张图片且必传。
      <div>
        <img :src="detilzt.src" :class="{'ztimg':true,'ztimgshow':listrow.showzt}" />
        <div class="tpmc">
          <p>{{detilzt.name}}</p>
        </div>
      </div>
    </div>
    <span>详情图上传</span>
    <hr>
    <div class="upimage" id="upimage">
      <div class="syeimage box" v-for="(item ,index) in detiltp">
        <span class="zzc">
        <i class="el-icon-delete"  @click="deleqxt(index)" style="left:50%;color: #ecececd9;"></i>
        </span>
        <img :src="item.src" style="width:100%;height:100%;border-radius:4px;" />
      </div>
      <div class="box">
        <input id="id" type="file" @change="handleFileChange" ref="inputer" />
        <label for="id"></label>
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <el-button style="float:right;margin:-5px 3% 0 0;" size="small" type="success" @click="submitUpload('formline')">{{listrow.btn}}</el-button>
    <span>只能上传jpg/png文件，且不超过500kb，最多上传6张图片。</span>
    <hr>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui';
//import axios from 'axios';

export default {
  props: ['listrow', "uploadimagehas"],
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
      }, 400);
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
      }, 400);
    };
    var validspsj = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error('商品售价不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value) && typeof value !== "number") {
          callback(new Error('请输入数字值'));

        } else {
          if (value <= 0) {
            callback(new Error('商品必须大于0'));
          }
          callback();
        }
      }, 400);
    };
    var validflid = (rule, value, callback) => {
      if (typeof value[1] !== "string") {
        return callback(new Error('分类品牌未选择'));
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      formline: {
        spbh: '',
        spmc: '',
        remark: '',
        flid: [],
        xh: '',
      },
      rules2: {
        spbh: [{ validator: validspbh, trigger: 'blur' }],
        spmc: [{ validator: validspmc, trigger: 'blur' }],
        spsj: [{ validator: validspsj, trigger: 'blur' }],
        flid: [{ validator: validflid, trigger: 'blur' }],
      },
      fileList1: [],
      options1: [], //品牌分类
      //图片数据
      xh: 0, //图片序号
      xhadd: [], //已有的图片序号
      fileimg: [], //上传的详情图对象
      detiltp: [], //展示的详情图片
      detilzt: [], //展示的主图
      zt: "", //上传的主图
      onceover: true,
      detilxh: [], //已存在的序号
      upmaxxh: [], //上传的序号
    };

  },
  mounted: function() {
    upimage.style.height = "140px";
  },
  watch: {
    uploadimagehas: function(data, olddata) {
      if (data) {
        this.onceover = data;
      }
    }
  },
  methods: {
    submitUpload(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.listrow.btn == "修改商品") {
            this.updatespxx({}, '', maxxh);
            var maxxh = (this.fileimg.length + 1).toString();
            if (typeof this.zt.src !== "string") {
              this.updatespxx(this.zt, "0", maxxh);
            }
            for (var i = 0; i < this.fileimg.length; i++) {
              if (typeof this.fileimg[i].src !== "string") {
                this.xh = 0;
                for (var n = 0; n < this.xhadd.length; n++) { //获取不重复的xh序号
                  var xhxthas = this.xhadd.find((item) => {
                    return item == this.xh.toString();
                  });
                  if (xhxthas) {
                    this.xh++;
                  }
                }
                console.log(this.xhadd);
                this.updatespxx(this.fileimg[i], this.xh, maxxh);
                this.xhadd.push(this.xh.toString());
              }
            }
          } else { /////////////////////////////添加商品
            if (this.zt == "") { this.$message({ message: '未选择主图', type: 'warning' }); return }
            this.subimage(this.zt, '', this.xh, this.fileimg.length);
            for (var i = 0; i < this.fileimg.length; i++) {
              this.xh++;
              this.subimage(this.fileimg[i], i, this.xh, this.fileimg.length);
            }
          }
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    ADSubmit() {
      this.onceover = true;
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
    // ////////////////////////图片上传模块
    handleFileChange(value) { //监听状态改变 
      if (value == "zt") {
        var inputDOM = this.$refs.inputerzt;
        this.zt = inputDOM.files[0];
      } else {
        if (this.fileimg.length >= 6) { ////////////////////////////////////设置图片上传张数
          this.$message({ message: '主图只能上传1张,详情图最多上传6张', type: 'warning' });
          return;
        }
        var inputDOM = this.$refs.inputer;
        if (inputDOM.files[0].size / 1024 > 500) { ///////////////////////////设置图片上传大小
          this.$message({ message: '商品图片不能超过500KB', type: 'warning' });
          return;
        }
        this.fileimg.push(inputDOM.files[0]); // 通过DOM取文件数
      }
      if (inputDOM.files[0].size / 1024 > 500) { ///////////////////////////设置图片上传大小
        this.$message({ message: '商品图片不能超过500KB', type: 'warning' });
        return;
      }
      this.imgPreview(inputDOM.files[0], value); //显示上传的图片
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
            this.detilzt = listimage;
          } else {
            this.detiltp.push(listimage);

            this.upmaxxh = ["0"]; //初始化上传的数组序号
            for (var n = 0; n < this.detiltp.length; n++) {
              var addxhup = this.detiltp[n].xh;
              this.upmaxxh.push(addxhup);
            }
            for (var i = 0; i < this.upmaxxh.length; i++) { //获取不重复的xh序号
              var xhxthas = this.upmaxxh.find((item) => {
                return item == i.toString();
              });
              if (!xhxthas) {
                this.detiltp[this.detiltp.length - 1].xh = i.toString();
                this.upmaxxh[this.upmaxxh.length - 1] = i.toString();
                console.log(this.upmaxxh);
                return;
              }
            }
          }
        }
      }
    },
    deleqxt(index) { //////////////////////删除元素
      if (this.listrow.btn = "修改商品") {
        this.fileimg.splice(index, 1);
        this.detiltp.splice(index, 1);
        this.xhadd.splice(index + 1, 1);
      } else {
        this.fileimg.splice(index, 1);
        this.detiltp.splice(index, 1);
      }
    },
    subimage(file, index, xh, length) { //提交表单
      console.log(this.formline);
      console.log(this.fileimg);
      var formdata1 = new FormData();
      formdata1.append('file', file);
      formdata1.append('xh', xh);
      formdata1.append('spbh', this.formline.spbh);
      formdata1.append('spsj', this.formline.spsj);
      formdata1.append('spmc', this.formline.spmc);
      formdata1.append('remark', this.formline.remark);
      formdata1.append('flId', this.formline.flid[1] ? this.formline.flid[1] : '');
      console.log(formdata1);
      request({ url: 'mall/spxx/addspxx.do', method: 'post', data: formdata1 }).then(response => {
          if (response.code == "-1") {
            this.$message({ message: '添加失败：商品编号已添加', type: 'warning' });
            return;
          }
          if (xh == length || length == 0) {
            this.ADSubmit(); //返回父组件
            this.$message({ message: '商品添加成功', type: 'success' });
          }
        })
        .catch((error) => {
          this.$message({ message: '商品添加失败添加失败', type: 'error' });
          this.ADSubmit(); //返回父组件
          console.log(error);
        })
    },
    Moveradd() { ////////////////////////进入初始化
      if (this.onceover) {
        console.log(this.listrow)
        this.maxtpsl = this.listrow.xqtpurl.length + 1;
        this.formline.spmc = this.listrow.spmc; //商品名称
        this.options1 = this.listrow.options1; //品牌类别
        this.formline.remark = this.listrow.remark; //商品备注

        this.formline.spsj = this.listrow.spsj ? ((this.listrow.spsj - 0) * 100).toFixed() - 0 : 0; //(parseFloat(this.listrow.spsj) * 100).toFixed(); //商品售价
        this.fileimg = []; //商品详情图初始化
        this.detilzt = []; //商品详情图初始化
        this.detiltp = []; //商品主图初始化
        this.zt = []; //商品主图初始化
        this.xh = 0; //序号初始化
        if (this.listrow.tpurl) { //如果是修改则录入参数 
          this.formline.flid = ['', this.listrow.flId]; //品牌分类
          console.log(this.formline.flid);
          this.xhadd = ["0"];
          for (var i = 0; i < this.listrow.xqtpurl.length; i++) { //添加展示的详情图
            var src = this.listrow.xqtpurl[i].split(",")[0];
            var xh = this.listrow.xqtpurl[i].split(",")[1];
            var itemxqimg = { "src": "http://192.168.1.123:8088" + src, "xh": xh };
            this.detiltp.push(itemxqimg);
            this.xhadd.push(xh);
            this.fileimg.push(itemxqimg); //添加上传的详情图
          }
          this.detilzt.src = this.listrow.tpurl; //展示的主图
          this.detilzt.name = this.listrow.tpmc; //展示的主图名称
          this.zt = this.detilzt; //添加上传的主图
        } else { //如果是添加则更新
          this.options2 = [];
          this.formline.flid = ['', ''];
        }
        clearInterval(dsqspmc);
        var dsqspmc = setTimeout(() => { //修复商品编号可能获取不到
          this.formline.spbh = this.listrow.spbh; //商品编号
        }, 100);

        this.onceover = false;
      }
    },
    updatespxx(file, xh, maxxh) { //修改商品
      if (this.upmaxxh.length = 0) {
        var upmaxxh = this.upmaxxh.join(",");
      } else {

        var upmaxxh = this.xhadd.join(",")
      }
      if (typeof this.zt.src !== "string") {
        upmaxxh = upmaxxh.replace("0,", "");
      }
      // console.log(upmaxxh)
      var formdata1 = new FormData();
      formdata1.append('file', file);
      formdata1.append('xh', xh);
      formdata1.append('spbh', this.formline.spbh);
      formdata1.append('spsj', this.formline.spsj);
      formdata1.append('spmc', this.formline.spmc);
      formdata1.append('remark', this.formline.remark);
      formdata1.append('flId', this.formline.flid[1] ? this.formline.flid[1] : '');
      formdata1.append('maxXh', upmaxxh);
      request({ url: 'mall/spxx/updatespxx.do', method: 'post', data: formdata1 }).then(response => {
          if (xh == '') {
            this.$message({ message: '商品修改成功', type: 'success' });
          }
          if (this.xhadd.length == this.detiltp.length + 1) {
            this.$message({ message: '商品修改成功', type: 'success' });
            this.ADSubmit(); //返回父组件   
          }
        })
        .catch((error) => {
          this.$message({ message: '商品修改失败', type: 'error' });
          this.ADSubmit(); //返回父组件
          console.log(error);
        })
    },
  }
}

</script>
<style scoped>
hr {
  margin-top: 5px;
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
  width: 100px;
  height: 120px;
  border: 1px dashed #C0CCDA;
  border-radius: 5px;
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
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  /*cursor: not-allowed;*/
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

.ztimg {
  position: absolute;
  transition: opacity 2s, top 1s;
  opacity: 0;
  top: 0px;
  width: 100px;
  height: 100px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

div img.ztimgshow {
  opacity: 1;
  top: 65px;
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

.iconfont {
  height: 60px;
  width: 60px;
}

</style>
