<template>
  <!-- </el-card> -->
  <div class="smain" @mouseover="initialize()">
    <el-form ref="form" class="addsublime" label-width="100px" :inline="true" :model="form">
      <el-form-item label="订单号">
        <el-input v-model="form.ddh" style="width:250px;" readonly></el-input>
      </el-form-item>
      <el-form-item label="退款金额">
        <el-input v-model="form.tkje" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="买家姓名" prop="paw">
        <el-input v-model="form.loginName" style="width:250px;" readonly></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="apaw">
        <el-input v-model="form.phone" style="width:250px;" readonly></el-input>
      </el-form-item>
      <!-- <el-form-item label="支付方式">
  <el-input v-model="form.showzffs" style="width:250px;" readonly></el-input>
</el-form-item>
<el-form-item label="处理人">
  <el-input v-model="form.showzffs" style="width:250px;" readonly></el-input>
</el-form-item>
 -->
      <el-form-item label="备注" prop="apaw">
        <el-input type="textarea" :rows=5 style="width:610px;" v-model="form.bz"></el-input>
      </el-form-item>
      <el-form-item style="width:250px;">
      </el-form-item>
      <el-form-item>
        <el-button size="mini " type="success " round class="passbtn " @click="rzsubmit(1, 'success') ">审核通过</el-button>
        <el-button style="margin-left: 30px" type="danger " size="mini " round @click="rzsubmit(2, 'warning') ">审核不通过</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['listrow'],
  data() {
    return {
      form: {
        ddh: '',
        tkje: '',
        loginName: '',
        phone: '',
        bz: '',
        zffs: '',
        showzffs: '',
      },
      table: [],
    };

  },
  watch: {
    dialogdelVisible: function(data, olddata) {
      if (data) {
        this.$refs["formline "].resetFields();
        this.initialize();
      }
    }
  },
  methods: {
    created: function() {
      this.initialize();
    },
    initialize() {
      this.form.ddh = this.listrow.ddh;
      this.form.tkje = this.listrow.tkje;
      this.form.loginName = this.listrow.loginName;
      this.form.phone = this.listrow.phone;
      this.form.zffs = this.listrow.zffs;
    },
    ADSubmit() {
      this.onceover = true;
      console.log(this.listrow);
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
    rzsubmit(val) {
      this.listrow.tkje = this.form.tkje * 100;
      this.listrow.bz = this.form.bz;
      this.listrow.zt = val;
      var url;
      if (this.listrow.zffs == '4') {
        url = 'mall/sh/memberrefund.do'
      } else {
        url = 'mall/sh/otherrefund.do'
      }
      request({ url: url, method: 'post', data: this.listrow }).then((response) => {
        var type;
        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        this.ADSubmit();
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接 " });
      })
    },
    resetForm(formName) {
      this.$emit("dialog1Changed ", 0); //发送参数到父组件 事件名，参数
    },
  },
}

</script>
<style scoped>
/*scoped*/

.zlmain {
  position: relative;
  height: 300px;
  top: 20px;
}

.fr {
  float: right;
}

hr {
  margin-top: -20px;
}

div.del {
  float: left;
  width: 50%;
  padding: 10px 0;
}

div.del p {
  float: left;
  margin: 5px;
  width: 100%;
}

.passbtn {
  padding: 10px 30px;
}

.smain {}

.el-input {
  width: 300px;
}

.subbtn {
  margin: 0 40px;
}

.el-select {
  width: 300px;
}

</style>
