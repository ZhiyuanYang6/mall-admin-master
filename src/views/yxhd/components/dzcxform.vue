<template>
  <div class="smain">
    <el-form ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="90px" :inline="true">
      <el-form-item label="商品名称" prop="spbh">
        <el-select style="width:250px" v-model="formline.spbh" filterable placeholder="请选择" @change="queryBySpbh()">
          <el-option v-for="item in splist" :key="item.spbh" :label="item.spmc" :value="item.spbh">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品售价" prop="spsj1">
        <el-input v-model="formline.spsj1" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="折扣" prop="zk">
        <el-input v-model="formline.zk" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="折后价" prop="zhj1">
        <el-input v-model="formline.zhj1" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows=5 style="width:620px" v-model="formline.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" size="small" type="success" @click="submitUpload()">{{listrow.btn}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui';
import request from '@/utils/request'
export default {
  props: ['listrow', "dzcxdatadialog", "splist"],
  data() {
    var validsfk = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      } else {
        // value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    var validzkj = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('折扣不能为空'));
      } else {
        // value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        var result = /^[0-9]$/;
        if (!value) {
          return callback(new Error('折扣不能为空'));
        } else {
          this.formline.zhj1 = this.formline.spsj1 * value / 10;
        }
      }
      setTimeout(() => {
        callback();
      }, 500);
    };
    return {
      formline: {
        spbh: '',
        spmc: '',
        spsj1: '',
        spsj: '',
        zk: '',
        zhj1: '',
        zhj: '',
        remark: '',
        id: '',
      },
      rules2: {
        spbh: [{ validator: validsfk, trigger: 'blur' }],
        spmc: [{ validator: validsfk, trigger: 'blur' }],
        spsj: [{ validator: validsfk, trigger: 'blur' }],
        zk: [{ validator: validzkj, trigger: 'blur' }],
        zhj: [{ validator: validsfk, trigger: 'blur' }],
      },
    }
  },
  created: function() {
    this.initialize();
  },
  watch: {
    dzcxdatadialog: function(data, olddata) {
      if (data) {
        this.initialize();
        this.$refs["formline"].resetFields();
      }
    }
  },
  methods: {
    initialize() { ////////////////////////进入初始化
      console.log(this.listrow);
      if (this.listrow.btn == "修改") {
        this.formline = {
          spbh: this.listrow.spbh,
          spsj1: this.listrow.spsj,
          zk: this.listrow.zk,
          zhj1: this.listrow.zhj,
          remark: this.listrow.remark,
          id: this.listrow.id
        }
      }
    },
    ADSubmit() { //发送参数到父组件 事件名，参数
      this.$emit("dialog1Changed", 0);
    },
    submitUpload() { //表单提交
      var url, type;
      if (this.listrow.btn == "增加") {
        url = "mall/yxhd_zk/addzk.do";
      } else {
        url = "mall/yxhd_zk/updatezk.do";
      }
      this.formline.zhj = this.formline.zhj1 * 100;
      this.formline.spsj = this.formline.spsj1 * 100;
      request({ url: url, method: 'post', data: this.formline }).then((response) => {

        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        this.ADSubmit();
      }).catch((error) => {
        Message.error("error：" + "请检查网络是否连接");
      })
    },
    queryBySpbh(val) {
      this.formline.zk = '';
      this.formline.zhj1 = '';
      request({ url: 'mall/spxx/getspbhmc.do', method: 'post', data: { spbh: this.formline.spbh } })
        .then((response) => {
          this.formline.spsj1 = response.list[0].spsj / 100;
        })
        .catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },

  }
}

</script>
<style scoped>
.subbtn {
  position: relative;
  left: 1100%;
}

</style>
