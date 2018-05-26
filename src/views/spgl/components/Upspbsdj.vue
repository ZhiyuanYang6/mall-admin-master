<template>
  <div @mouseover="Moveradd()">
    <el-form label-position="left" ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="80px" :inline="true">
      <el-form-item label="商品" prop="goods">
        <el-select style="width:250px" v-model="formline.goods" filterable placeholder="请选择" @change="querykcbyspbh">
          <el-option v-for="item in splist" :key="item.spmc" :label="item.spmc" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="pch">
        <el-select style="width:250px" v-model="formline.pch" filterable placeholder="请选择" @change="querykcbyspbh()">
          <el-option v-for="item in pclist" :key="item.pch" :label="item.pch" :value="item.pch">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登记人" prop="djr">
        <el-input v-model="formline.djr" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="sl">
        <el-input v-model.number="formline.sl" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="dw">
        <!-- <el-input v-model="formline.dw" style="width:250px;"></el-input> -->
        <el-input type="textarea" :rows=5 style="width:620px" v-model="formline.remark"></el-input>
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
import axios from 'axios';
import request from '@/utils/request'
export default {
  props: ['listrow', "uploadimagehas", "splist"],
  data() {
    var validgoods = (rule, value, callback) => {
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
          return callback(new Error('批次号不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 500);
    };
    var validdjr = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('登记人不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('登记人不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 500);
    };
    var validnum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('发货数量不能为空'));
      }
      if (value) {
        setTimeout(() => {
          if (!Number.isInteger(value) && typeof value !== "number") {
            callback(new Error('请输入数字值'));
          } else {
            if (this.vkcsl < value) {
              callback(new Error('报损数量不能超过库存,当前库存数(' + this.vkcsl + ")"));
            }
            callback();
          }
        }, 500);
      } else callback();
    };
    return {
      formline: {
        spbh: '',
        pch: '',
        spmc: '',
        sl: '',
        bz: '',
        lx: '',
        goods: '',
      },
      rules2: {
        spbh: [{ validator: validgoods, trigger: 'blur' }],
        pch: [{ validator: validpch, trigger: 'blur' }],
        sl: [{ validator: validnum, trigger: 'blur' }],
        djr: [{ validator: validdjr, trigger: 'blur' }],
      },
      restaurants: [], //全部商品
      timeout: null, //搜索商品定时器
      onceover: true,
      vkcsl: 0,
      pclist: []
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
            var url = "addspbs.do";
          } else {
            var url = "updatespbs.do";
          }

          var data = {
            spbh: this.formline.spbh,
            spmc: this.formline.goods.spmc,
            pch: this.formline.pch,
            sl: this.formline.sl,
            bz: this.formline.bz,
            djr: this.formline.djr
          }
          console.info(this.data);
          request({ url: 'mall/kcbs/' + url, method: 'post', data: data })
            .then(response => {
              this.ADSubmit();
            })
            .catch(error => {
              Message.error("error：" + "请检查网络是否连接");
            })
          //this.$message({ message: '添加失败：功能暂未开通', type: 'warning' });
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
    Moveradd() { ////////////////////////进入初始化
      if (this.onceover) {
        if (this.listrow.btn == "添加") {
          this.formline.sj = ['', '']; //修复时间不重置
          this.formline = { sprow: '', goods: '', pch: '', lx: '', sl: '', bz: '', spmc: '', sj: ['', ''] };
        } else {
          this.formline = {
            goods: this.listrow.spbh,
            pch: this.listrow.pch,
            sl: this.listrow.sl ? this.listrow.sl - 0 : 0,
            bz: this.listrow.bz,
            spmc: this.listrow.spmc,
            djr: this.listrow.djr
          }
          // console.log(this.listrow)
        }
        this.onceover = false;
      }
    },
    querykcbyspbh(row) {
      if (!!row) {
        this.formline.pch = '';
      };
      this.formline.goods = row ? row.spmc : this.formline.goods;
      this.formline.spbh = row ? row.spbh : this.formline.spbh;
      var data = {
        spbh: this.formline.spbh,
        pch: this.formline.pch
      };
      request({ url: 'mall/spkc/getspkc.do', method: 'post', data: data })
        .then((response) => {
          this.pclist = response.list;
          if (this.pch != "") {
            this.vkcsl = response.list[0].sl;
          }
        })
        .catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
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

</style>
