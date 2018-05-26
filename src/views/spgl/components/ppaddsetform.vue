<template>
  <div>
    <el-form ref="form" class="addsublime" :rules="rules2" style="padding:30px 10px 10px 0;" :model="form" label-width="80px">
      <!-- <el-form-item label="品牌编号">
  <el-input v-model="form.flid"></el-input>
</el-form-item>
 -->
      <el-form-item label="分类名称">
        <el-input v-model="form.splx" readonly></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" prop="xldm">
        <el-input v-model="form.sppp"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" type="warning" @click="addXlInfo('form')">{{listrow.btn}}</el-button>
        <el-button class="subbtn" type="warning" @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['listrow', "dialogppVisible"],
  data() {
    var validxldm = (rule, value, callback) => {

      setTimeout(() => { callback(); }, 400);
    };

    return {
      form: {
        flid: '',
        splx: '',
        sppp: '',
        remark: '',
      },
      rules2: { xldm: [{ validator: validxldm, trigger: 'blur' }], },

    }
  },
  watch: {
    dialogppVisible: function(data, olddata) {
      if (data) {
        this.initialize();
      } else {
        this.$refs['form'].resetFields(); //重置表单
      }
    }
  },
  created: function() {
    this.initialize();
  },
  methods: {
    addXlInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var url, data;
          if (this.listrow.btn == "修改") {
            url = "mall/spfl/updatespfl.do";
            data = {
              id: this.form.flid,
              splx: this.form.splx,
              sppp: this.form.sppp,
              remark: this.form.remark,
            }
          } else {
            url = "mall/spfl/addspfl.do";
            data = {
              id: this.form.flid,
              splx: this.form.splx,
              sppp: this.form.sppp,
              remark: this.form.remark,
            }
          }
          // var param = { parentName: this.form.dlmc, parentCode: this.form.dlcode, code: this.form.xldm, name: this.form.xlmc, remark: this.form.bz };
          request({ url: url, method: 'post', data: data }).then((response) => {
            if (response.code == "1") {
              this.$message({ type: 'success', message: response.msg });
            } else {
              this.$message({ type: 'error', message: response.msg });
            }
            this.resetForm('from');
          }).catch((err) => {
            this.$message({ type: 'error', message: "请检查网络连接" });
          });
        } else {
          this.$message({ message: '表单验证未通过', type: 'error' });
          return false;
        }
      });
    },
    initialize() { ////////////////////////进入初始化
      if (this.listrow.btn == "修改") {
        this.form = { flid: this.listrow.id, splx: this.listrow.splx, sppp: this.listrow.sppp, remark: this.listrow.remark };
      } else {
        this.form = { flid: '', splx: this.listrow.splx, sppp: '', remark: '', dlcode: this.listrow.currentdlRow.parentCode, xldm: this.listrow.xldm };
      }
    },
    resetForm(formName) {
      this.$emit("dialog1Changed", 0); //发送参数到父组件 事件名，参数
    },
  },
}

</script>
<style scoped>
/*scoped*/

.smain {
  padding: 10px;
}

div.el-input {
  width: 300px;
  margin-right: 20px;
}

div.el-textarea {
  width: 300px;
}

.subbtn {
  float: right;
  margin-right: 80px;
}

.el-form,
.addsublime {
  padding: 20px 0;
}

</style>
