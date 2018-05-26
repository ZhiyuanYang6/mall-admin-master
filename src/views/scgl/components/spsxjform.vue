<template>
  <div class="smain">
    <el-form ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="90px" :inline="true">
      <el-form-item label="广告编号" prop="ggid">
        <el-input v-model="formline.ggid" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="广告名称" prop="ggmc">
        <el-input v-model="formline.ggmc" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="广告位编号" prop="ggwid">
        <el-input v-model="formline.ggwid" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="广告位名称" prop="ggwmc">
        <el-input v-model="formline.ggwmc" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="sj">
        <el-input v-model="formline.sj" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subbtn" size="small" type="success" @click="submitUpload('formline')">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['listrow', "spsxjdatadialog"],
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
        ggid: "",
        ggmc: "",
        ggurl: "广告图片",
        ggwid: "",
        ggwmc: "",
        startDate: "开始日期",
        sj: "",
      },
      rules2: {
        ggid: [{ validator: validsfk, trigger: 'blur' }],
        ggmc: [{ validator: validsfk, trigger: 'blur' }],
        ggwid: [{ validator: validsfk, trigger: 'blur' }],
        ggwmc: [{ validator: validsfk, trigger: 'blur' }],
        sj: [{ validator: validsfk, trigger: 'blur' }],
      },
      onceover: false,
    }
  },
  created: function() {
    this.initialize();
  },
  watch: {
    spsxjdatadialog: function(data, olddata) {
      if (data) {
        this.$refs["formline"].resetFields();
        this.initialize();
      }
    }
  },
  methods: {
    initialize() { ////////////////////////进入初始化
      console.log(this.listrow);
    },
    ADSubmit() { //发送参数到父组件 事件名，参数
      this.onceover = true;
      this.$emit("dialog1Changed", 0);
    },
  },

}

</script>
<style scoped>
.subbtn {
  position: relative;
  top: 40px;
  left: 500%;
}

</style>
