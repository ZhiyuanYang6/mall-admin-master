<template>
  <div>
    <el-form ref="form" :rules="rules2" class="addsublime" style="padding:30px 10px 10px 0;" :model="form" label-width="80px">
      <el-form-item label="分类名称" prop="dlmc">
        <el-input v-model="form.dlmc"></el-input>
        <el-button class="subbtn" type="warning" @click="addDlInfo('form')">{{listrow.btn}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: ['listrow', "dialogdlVisible"],
  data() {
    var validdlmc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('分类名称不能为空'));
      } else {
        value = value.replace(/(^\s*)|(\s*$)/g, ''); //去首尾空格
        if (!value) {
          return callback(new Error('分类名称不能为空'));
        }
      }
      setTimeout(() => {
        callback();
      }, 400);
    };
    return {
      form: {
        dlmc: '',
      },
      rules2: {
        dlmc: [{ validator: validdlmc, trigger: 'blur' }],
      },
    };
    var olddlmcL = '';
  },
  watch: {
    dialogdlVisible: function(data, olddata) {
      this.$refs['form'].resetFields();
      this.initialize();
    }
  },
  created: function() {
    this.initialize();
  },
  methods: {
    addDlInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var url, dataDl;
          if (this.listrow.btn == "修改") {
            url = "mall/spfl/updatespfl.do";
            dataDl = {
              splx: this.form.dlmc,
              oldsplx: this.olddlmcL
            };
          } else {
            url = "mall/spfl/addspfl.do";
            dataDl = {
              splx: this.form.dlmc,
            };
          }
          request({ url: url, method: 'post', data: dataDl }).then((response) => {
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
        this.form = { dlmc: this.listrow.currentdlRow.label, dlcode: this.listrow.currentdlRow.value };
        this.olddlmcL = this.listrow.currentdlRow.label;
      } else {
        this.form = { dlmc: '' };
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

.el-form,
.addsublime {
  padding: 20px 0;
}

</style>
