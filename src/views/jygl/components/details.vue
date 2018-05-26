<template>
  <div class="smain">
    <el-card class="box-card img" :body-style="{padding:'5px'}">
      <img :src="listrow.tpurl"></img>
    </el-card>
    <el-card class="box-card sp" :body-style="{padding:'5px'}">
      <span class="title">商品</span>
      <el-table size="mini" :data="tableData1" class="table1" border>
        <el-table-column prop="spmc" label="名称" align="center"> </el-table-column>
        <el-table-column prop="spdj" sortable='custom' label="单价" align="center"> </el-table-column>
        <el-table-column prop="spsl" label="数量" align="center"> </el-table-column>
        <el-table-column prop="spzk" label="折扣" align="center">
        </el-table-column>
        <el-table-column prop="spzhj" label="折后价" align="center">
        </el-table-column>
        <el-table-column prop="zje" label="总金额" align="center"></el-table-column>
        <el-table-column prop="zfje" label="支付金额" align="center"></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card md" :body-style="{padding:'5px'}">
      <span class="title">订单详情</span>
      <div class="mdList mdLeft">
        <p><span>订单号</span><span class="fr">{{mdlist.ddh}}</span></p>
        <p><span>订单状态</span><span class="fr">{{mdlist.state}}</span></p>
        <p><span>总金额</span><span class="fr">{{mdlist.zje}}</span></p>
        <p><span>优惠金额</span><span class="fr">{{mdlist.yhje}}</span></p>
        <p><span>积分</span><span class="fr">{{mdlist.jf}}</span></p>
        <p><span>红包</span> <span class="fr">{{mdlist.hb}}</span></p>
        <p><span>卡卷</span><span class="fr">{{mdlist.kj}}</span></p>
      </div>
      <div class="mdList">
        <p><span>支付金额</span><span class="fr">{{mdlist.zfje}}</span></p>
        <p><span>支付时间</span><span class="fr">{{mdlist.zfsj}}</span></p>
        <p><span>支付方式</span><span class="fr">{{mdlist.zffs}}</span></p>
        <p><span>发货单号</span><span class="fr">{{mdlist.fhdh}}</span></p>
        <p><span>收货地址</span><span class="fr">{{mdlist.memberShdz}}</span></p>
        <p><span>收件人电话</span><span class="fr">{{mdlist.phone}}</span></p>
        <p><span>快递公司</span><span class="fr">{{mdlist.kdgs}}</span></p>
        <div class="bombtn">
          <el-button class="btn" type="primary" :disabled="listrow.zt!=1" @click="dialogVisible=true">发货</el-button>
          <!-- <el-button class="btn" type="primary" :disabled="listrow.zt==4||listrow.zt==5||listrow.zt==6||listrow.zt==0" @click="tdsubmit()">退单</el-button>
 -->
        </div>
      </div>
    </el-card>
    <!-- 修发货-->
    <el-dialog title="订单发货" :visible.sync="dialogVisible" width="50%" append-to-body>
      <el-form ref="formline" :model="formline" status-icon size="small" class="formsty" label-width="60px" :inline="true">
        <el-form-item label="批次号">
          <el-select style="width:200px" v-model="formline.pch" filterable placeholder="请选择" @change="getjhj()">
            <el-option v-for="item in pclist" :key="item.pch" :label="item.pch" :value="item.pch">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进货价">
          <el-input v-model="formline.jhj" disabled style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="subbtn" size="small" type="success" @click="submitUpload()">确认</el-button>
          </el-form-it>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import request from '@/utils/request'
export default {
  props: ['listrow', "uploadimagehas"],
  data() {
    return {
      tableData1: [],
      mdlist: {},
      dialogVisible: false,
      formline: {
        zjt: '',
        pch: '',
        jhj: '',
      },
      options: '',
      pclist: [],
    }
  },
  created: function() {
    this.initialize();
  },
  watch: {
    uploadimagehas: function(data, olddata) {
      if (data) {
        this.initialize();
      }
    },
    dialogVisible: function(data, olddata) {
      if (data) {
        var spkc = {
          spbh: this.listrow.spbh,
          sl: this.listrow.sl,
        }
        request({ url: 'mall/spkc/getspkc.do', method: 'post', data: spkc }).then((response) => {
          this.pclist = response.list;

        }).catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
      }
    }
  },
  methods: {
    tdsubmit() {
      if (this.listrow.zt == 1) {
        this.$confirm('订单是否确认退单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.thload(this.listrow.zt, '2');
        }).catch(() => {
          this.$message({ type: 'info', message: "已取消退单" });
        });
        return;
      }
      this.$confirm('当前状态可以进行换货，是否进行换货操作?关闭进行退货操作', '提示', {
        confirmButtonText: '我要换货',
        cancelButtonText: '继续退货',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false
      }).then(() => { ///////////////////换货
        // request({ url: 'mall/ggw/delggw.do', method: 'post', data: {} }).then((response) => {
        this.thload(this.listrow.zt, '1');
        //console.info(this.listrow);
        // }).catch((error) => {
        // Message.error("error：" + "请检查网络是否连接");
        // });
      }).catch(() => {
        this.thload(this.listrow.zt, '0');
      });
    },
    getjhj() {
      var spkc = {
        spbh: this.listrow.spbh,
        sl: this.listrow.sl,
        pch: this.formline.pch,
      }
      request({ url: 'mall/spkc/getspkc.do', method: 'post', data: spkc }).then((response) => {
        debugger;
        this.formline.jhj = response.list[0].jhjg / 100;
      }).catch((error) => {
        Message.error("error：" + "请检查网络是否连接");
      })

    },
    thload(zt, shzt) { ///////////////退单
      if (shzt == 1) {
        this.listrow.zje = this.listrow.zje * 100;
        this.listrow.shzt = '1';
        var dd = this.listrow;
      } else {
        var dd = {
          zt: zt,
          shzt: shzt,
          ddh: this.listrow.ddh,
          spbh: this.listrow.spbh,
          sl: this.listrow.sl
        };
      }
      request({ url: 'mall/dd/updateddbytd.do', method: 'post', data: dd }).then((response) => {
        var type;
        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        // this.initialize();
        this.ADSubmit();
      }).catch((error) => {
        this.$message({ message: '未知错误,请联系管理员', type: 'error' });
        this.ADSubmit();
      });
    },
    submitUpload() { ////////////////发货
      var dd = {
        zt: this.listrow.zt,
        ddh: this.listrow.ddh,
        spbh: this.listrow.spbh,
        sl: this.listrow.sl,
        pch: this.formline.pch,
        spmc: this.listrow.spmc
      };
      request({ url: 'mall/dd/updateddbyfh.do', method: 'post', data: dd }).then((response) => {
        var type;
        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        this.dialogVisible = false;
        this.ADSubmit();
      }).catch((error) => {
        Message.error("error：" + "请检查网络是否连接");
      })
    },
    initialize() { ////////////////////////进入初始化
      this.tableData1 = [];
      this.tableData1.push(this.listrow);
      console.log("-------" + this.tableData1);
      this.mdlist = this.listrow;
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    zffsData(zffs) {
      if (zffs == 1) {
        return '微信公众号';
      } else if (zffs == 2) {
        return '微信App'
      } else if (zffs == 3) {
        return '支付宝App'
      } else {
        return '会员余额'
      }
    },
    ADSubmit() { //发送参数到父组件 事件名，参数
      this.$emit("dialog1Changed", 0);
    },
  },
}

</script>
<style scoped>
.title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #696E76;
  border-bottom: 1px solid #B6BCCC;
}

p {
  margin: 5px;
}

.fr {
  float: right;
}

div.img {
  position: absolute;
  top: 72px;
  right: 30px;
  width: 250px;
  /*height: 202px;*/
}

div.el-card__body {
  padding: 5px;
}

img {
  width: 100%;
}

div.sp {
  width: 73%;
  position: relative;
  top: 0;
  left: -10px
}



div.md {
  width: 100%;
  position: relative;
  top: 100px;
  left: -10px;
  margin-bottom: 100px;
}

div.md .mdList {
  width: 30%;
  float: left;
  margin-left: 20%
}

div.md div.mdLeft {
  margin-left: 5%;
}

.bombtn .btn {
  padding: 10px 25px;
  font-size: 12px;
  margin: 5px 20px;
}

.bombtn {
  position: relative;
  top: 0;
  right: -300px;
}

.formsty {
  padding-top: 20px;
}

</style>
