<template>
  <div class="smain" @mouseover="Moveradd()">
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
    </el-form>
    <span>广告图</span>
    <hr>
    <input id="zt" type="file" @change="handleFileChange('zt')" ref="inputerzt" />
    <!-- 添加按钮 -->
    <div class="imgdiv">
      <div class="box">
        <label for="zt"></label>
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
        console.log(this.listrow)
      }
    },
  },
  ADSubmit() { //发送参数到父组件 事件名，参数
    this.onceover = true;
    this.$emit("dialog1Changed", 0);
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

.box {
  position: relative;
  float: left;
  width: 100px;
  height: 120px;
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
