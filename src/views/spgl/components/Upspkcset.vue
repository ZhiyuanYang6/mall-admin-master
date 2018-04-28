<template>
  <div @mouseover="Moveradd()">
    <el-form label-position="left" ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="80px" :inline="true">
      <el-form-item label="商品" prop="spbh">
        <el-select style="width:250px" v-model="formline.spbh" filterable placeholder="请选择">
          <el-option v-for="item in splist" :key="item.spmc" :label="item.spmc" :value="item.spbh">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="pch">
        <el-input v-model="formline.pch" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="进货时间">
        <el-date-picker v-model="formline.sj[0]" type="datetime" style="width:250px;" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="登记人" prop="djr">
        <el-input v-model="formline.djr" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="dw">
        <el-input v-model="formline.dw" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="gg">
        <el-input v-model="formline.gg" style="width:250px;"></el-input><i class="iconfont icon-renminbi"></i>
      </el-form-item>
      <el-form-item label="进货价格" prop="jhjg">
        <el-input v-model.number="formline.jhjg" style="width:242px;"></el-input>元
      </el-form-item>
      <el-form-item label="保质期" prop="bzq">
        <el-input v-model.number="formline.bzq" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="sl">
        <el-input v-model.number="formline.sl" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button size="mini" @click="ADSubmit()" style="padding:9px 25px;" type="info">取消</el-button>
        <el-button size="mini" @click="submitUpload('formline')" style="margin-left:150px; padding:9px 25px;" type="success">{{listrow.btn}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui';
//import axios from 'axios';
import request from '@/utils/request'
export default {
  props: ['listrow', "uploadimagehas", "splist"],
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
      }, 500);
    };
    var validpch = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('批次号不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('商品名称不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 500);
    };
    var validnum = (rule, value, callback) => {
      if (value) {
        setTimeout(() => {
          if (!Number.isInteger(value) && typeof value !== "number") {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 500);
      } else callback();
    };
    return {
      formline: {
        spbh: '',
        pch: '',
        jhsj: '',
        jhjg: '',
        bzq: '',
        sl: '',
        djr: '',
        dw: '',
        gg: '',
        sj: ['', ''],
      },
      rules2: {
        spbh: [{ validator: validspbh, trigger: 'blur' }],
        pch: [{ validator: validpch, trigger: 'blur' }],
        sl: [{ validator: validnum, trigger: 'blur' }],
        bzq: [{ validator: validnum, trigger: 'blur' }],
        jhjg: [{ validator: validnum, trigger: 'blur' }],
      },
      options1: [], //分类表
      options2: [], //品牌表
      options3: '', //分类值
      options4: '', //品牌值
      restaurants: [
        { "value": "对对对三全鲜得得得食（北新泾店）", "spbh": "1" },
        { "value": "对对对Hot得得得 honey 首尔炸鸡（仙霞路）", "spbh": "1" },
        { "value": "对对对新旺角得得得茶餐厅", "spbh": "1" },
        { "value": "对对对泷千家得得得(天山西路店)", "spbh": "1" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "spbh": "1-101" },
        { "value": "贡茶", "spbh": "1" }
      ], //全部商品
      timeout: null, //搜索商品定时器
      onceover: true,
    };
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
          if (typeof this.formline.sj[0] === "object") {
            this.$store.dispatch('timeFormatty', this.formline);
            this.formline.jhsj = this.formline.sj[1];
          }
          // console.log(this.formline)
          if (this.listrow.btn == "添加") {
            var url = "addspkc.do";
          } else {
            var url = "updatespkc.do";
          }
          request({ url: 'mall/spkc/' + url, method: 'post', data: this.formline })
            .then(response => {
              if (response.code == "-1") {
                this.$message({ message: '添加失败：商品批次号已存在', type: 'warning' });
                return;
              }
              this.ADSubmit();
            })
            .catch(error => {
              Message.error("error：" + "请检查网络是否连接");
            })
          this.$message({ message: this.listrow.btn + '成功', type: 'success' });
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
    subimage() { //提交表单

    },
    Moveradd() { ////////////////////////进入初始化
      if (this.onceover) {
        // console.log("开始初始化")
        // console.log(this.listrow.btn == "添加")
        if (this.listrow.btn == "添加") {
          this.formline.sj = ['', '']; //修复时间不重置
          this.$refs["formline"].resetFields();
        } else {
          this.formline = {
            spbh: this.listrow.spbh,
            pch: this.listrow.pch,
            jhsj: this.listrow.jhsj,
            jhjg: this.listrow.jhjg ? (this.listrow.jhjg - 0) * 100 : 0,
            bzq: this.listrow.bzq ? this.listrow.bzq - 0 : 0,
            sl: this.listrow.sl ? this.listrow.sl - 0 : 0,
            djr: this.listrow.djr,
            dw: this.listrow.dw,
            gg: this.listrow.gg,
            sj: [this.listrow.jhsj, ''],
          }
          // console.log(this.listrow)
        }
        this.onceover = false;
      }
    }
  }
}

</script>
<style scoped>
hr {
  margin-top: 5px;
}

.el-form-item {
  margin: 10px 20px;
}

.iconfont {
  height: 60px;
  width: 60px;
}

</style>
