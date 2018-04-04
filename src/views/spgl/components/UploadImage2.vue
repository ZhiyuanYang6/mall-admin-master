<template>
  <div style="padding:20px;height: 500px;;">
    <div class="upimage">
      <div class="syeimage box" v-for="item in dataUrl">
        <span class="zzc">
          <i class="el-icon-zoom-in" style="left:35%;color: #ecececd9;"></i>
          <i class="el-icon-delete" style="left:65%;color: #ecececd9;"></i>
        </span>
        <img :src="item.src" style="width:100%;height:100%;border-radius: 10px;" />
      </div>
      <div class="box">
        <input id="id" type="file" @change="handleFileChange" ref="inputer" />
        <label for="id"></label>
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <el-button size="small" type="success" @click="subimage">提交</el-button>
  </div>
</template>
<script>
// import { Message } from 'element-ui';
import axios from 'axios';
export default {
  props: {
    value: {
      default: undefined
    },
  },
  data() {
    return {
      dataUrl: [],
      fileimg: {},
      uploadData: {
        xh: 0,
        spbh: "000033",
        spsj: 3214,
        spmc: "唱歌撒大哥",
        remark: "时代发生的风格",
        flId: "6",
      }
    };
  },
  computed: {

  },
  created: function() {
    // debugger;
    //   this.options1 = this.listrow.options1;
    //   console.log(this.listrow)
  },
  // watch: {
  //   'listrow.options2': function(value, oldvalue) {
  //     console.log(value, oldvalue);
  //   }
  // },
  methods: {
    handleFileChange(e) {
      let inputDOM = this.$refs.inputer;
      this.fileimg = inputDOM.files[0]; // 通过DOM取文件数据
      // this.errText = '';
      // let size = Math.floor(this.file.size / 1024);
      // if (size > 500) {
      //   return false
      // }
      // this.$emit('input', this.file);
      // this.fileName = this.file.name;
      // this.imgPreview(this.file, this.fileName); //显示上传的图片
      this.imgPreview(); //显示上传的图片
      // this.onChange && this.onChange(this.file, inputDOM.value);
    },
    imgPreview() {
      // 看支持不支持FileReader
      if (!this.fileimg || !window.FileReader) return;
      if (/^image/.test(this.fileimg.type)) {
        var reader = new FileReader(); // 创建一个reader
        reader.readAsDataURL(this.fileimg); // 将图片将转成 base64 格式
        reader.onloadend = () => { // 读取成功后的回调
          var listimage = { "src": reader.result, "name": name }
          this.dataUrl.push(listimage);
        }
      }
    },
    subimage() {
      var formdata1 = new FormData();
      if (this.fileimg.type) {
        formdata1.append('file', this.fileimg);
        formdata1.append('xh', this.uploadData.xh);
        formdata1.append('spbh', this.uploadData.spbh);
        formdata1.append('spsj', this.uploadData.spsj);
        formdata1.append('spmc', this.uploadData.spmc);
        formdata1.append('remark', this.uploadData.remark);
        formdata1.append('flId', this.uploadData.flId);
        axios.post('http://192.168.1.123:8088/mall/spxx/addspxx.do', formdata1)
          .then(response => {
            debugger;
            // .then(response) => { //这里的/xapi/upimage为接口  
            // console.log(response.data);
          })
          .catch(error => {
            debugger;
            // Message.error("error：" + "请检查网络是否连接");
          })
      }
    }
  }
}

</script>
<style scoped>
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
  width: 180px;
  height: 200px;
  border: 1px dashed #C0CCDA;
  border-radius: 10px;
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

</style>
