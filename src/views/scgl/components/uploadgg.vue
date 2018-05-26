<template>
  <div class="smain">
    <el-form ref="formline" :model="formline" status-icon :rules="rules2" size="small" label-width="90px" :inline="true">
      <el-form-item label="广告名称" prop="ggid">
        <el-select style="width:250px" v-model="formline.ggid" filterable placeholder="请选择" @change="imgxr">
          <el-option v-for="item in gglist" :key="item.ggmc" :label="item.ggmc" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位名称" prop="ggwmc">
        <el-input v-model="formline.ggwmc" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="广告位类型" prop="ggwlx">
        <el-input v-model="formline.ggwlx" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="广告位组别" prop="ggwzb">
        <el-input v-model="formline.ggwzb" style="width:250px;"></el-input>
      </el-form-item>
      <el-form-item label="播放日期">
        <el-date-picker style="width:605px" v-model="formline.sj" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="播放时间">
        <template>
          <el-time-select style="width:300px" placeholder="起始时间" v-model="formline.startTime" :picker-options="{   start: '08:30',   step: '00:15',   end: '18:30' }">
          </el-time-select>
          <el-time-select style="width:300px" placeholder="结束时间" v-model="formline.endTime" :picker-options="{  start: '08:30',  step: '00:15',  end: '18:30',  minTime: startTime}">
          </el-time-select>
        </template>
      </el-form-item>
      <el-form-item label="备注" prop="ggwbz">
        <el-input type="textarea" :rows=5 style="width:605px" v-model="formline.ggwbz"></el-input>
      </el-form-item>
      <el-form-item label="广告图">
        <div class="imglabe">
          <div class="box">
            <input id="slt" type="file" ref="inputerzt" />
            <label for="slt"></label>
            <img :src="formline.ggurl" :class="{'ztimg':true,'ztimgshow':listrow.showzt}" />
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 发布按钮 -->
    <div class="tpbtn">
      <el-button style="float: right;margin-right:50px" size="small" type="success" @click="submitUpload()">{{listrow.btn}}</el-button>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  props: ['listrow', "uploadimagehas", "gglist"],
  data() {

    return {
      formline: {
        endDate: "",
        ggid: "",
        ggwid: '',
        ggmc: "",
        ggurl: "",
        ggwid: "",
        ggwzb: '',
        ggwmc: "",
        ggwbz: '',
        ggwlx: '',
        sj: ['', ''],
        // startDate: "",
        // endDate: "",
        startTime: '',
        endTime: '',
        sj: "",
        startdate: '',
        enddate: ''
      },
      rules2: {

      },
      startTime: '',
      endTime: '',
    }
  },
  created: function() {
    this.initialize();
  },
  watch: {
    uploadimagehas: function(data, olddata) {
      if (data) {
        // this.$refs["formline"].resetFields();
        this.initialize();
      }
    }
  },
  methods: {
    imgxr(val) {
      let imgurl = this.gglist.find(item => { return item.id == val; })
      this.formline.ggurl = this.$store.state.user.urlImg + imgurl.ggurl;
      this.listrow.showzt = true;
    },
    submitUpload() { //表单提交
      var url;
      if (this.listrow.btn == "修改") {
        url = "mall/ggw/updateggw.do";
      } else {
        url = "mall/ggw/addggw.do";
      }
      this.formline.startdate = this.formline.sj[0];
      this.formline.enddate = this.formline.sj[1];
      this.formline.ggwbz = this.formline.ggwbz ? this.formline.ggwbz : '';
      this.formline.ggwlx = this.formline.ggwlx ? this.formline.ggwlx : '';
      request({ url: url, method: 'post', data: this.formline }).then(response => {
        var type;
        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        this.ADSubmit(); //返回父组件
        return;
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      })
    },
    ADSubmit() { //发送参数到父组件 事件名，参数
      this.$emit("dialog1Changed", 0);
    },
    initialize() { ////////////////////////进入初始化
      if (this.listrow.btn == "发布") {
        this.formline = { endDate: "", ggid: "", ggmc: "", ggurl: "", ggwid: "", ggwmc: "", sj: ['', ''], startTime: '', endTime: '', sj: "", };
        this.listrow.showzt = false;
      } else {
        this.formline = {
          ggid: this.listrow.ggid,
          ggwmc: this.listrow.ggwmc,
          ggwzb: this.listrow.ggwzb,
          ggwbz: this.listrow.ggwbz,
          ggwlx: this.listrow.ggwlx,
          startTime: this.listrow.startTime,
          endTime: this.listrow.endTime,
          ggurl: this.listrow.ggurl,
          ggwid: this.listrow.ggwid,
          sj: [this.listrow.startDate, this.listrow.endDate]
        }
        this.listrow.showzt = true;

      }
    },
  },
}

</script>
<style scoped>
.tpbtn {
  position: relative;
  top: -40px;
}

input {
  position: absolute;
  left: -9999px;
}

.ztimg {
  position: absolute;
  opacity: 0;
  top: -60px;
  left: -2px;
  width: 121px;
  height: 121px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  z-index: 10;
  /*transition: opacity 2s, top 1s;*/
}

div img.ztimgshow {
  opacity: 1;
  top: -1px;
}

.box {
  position: relative;
  float: left;
  width: 120px;
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
  z-index: 1;
}

</style>
