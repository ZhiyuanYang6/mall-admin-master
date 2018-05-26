<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <!-- <el-button type="warning" @click="td()">发货</el-button>
 -->
      </el-form-item>
      <!-- <el-form-item>
  <el-radio-group v-model="formInline.radio" size="mini" @change="onloadtable1">
    <el-radio-button label="1">关闭历史</el-radio-button>
    <el-radio-button label="">显示历史</el-radio-button>
  </el-radio-group>
</el-form-item>
 -->
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <!--    <el-table-column prop="xh" label="商品序号" align="center"> </el-table-column>
        <el-table-column prop="tpurl" label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.tpurl+'?'" alt="0" width="80px" height="80px">
          </template>
        </el-table-column> -->
        <el-table-column prop="spbh" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="spmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="spdj" label="售价" align="center"> </el-table-column>
        <el-table-column prop="spsl" label="数量" align="center"> </el-table-column>
        <el-table-column prop="zje" label="总金额" align="center"> </el-table-column>
        <el-table-column prop="loginName" label="买家" align="center"> </el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"> </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
        </el-table-column>
        <!-- <el-table-column prop="bz" label="备注" align="center"> </el-table-column>
 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="getdetl(scope.row)">详情</el-button>
            <!-- <el-button type="text" size="mini" @click="td()">退单</el-button>
 -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <!-- 订单详情 -->
    <el-dialog title="订单详情" class="upimage" :visible.sync="uploadimagehas" width="70%" style="padding-bottom: 5%;">
      <ddcxDetails :listrow="row" :uploadimagehas="uploadimagehas" @dialog1Changed="childchanged($event)"></ddcxDetails>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'
import ddcxDetails from './components/details'

export default {
  name: 'txmccx',
  components: { ddcxDetails },
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        yhkh: '',
        sj: '',
        sele1: '',
        radio: '1',
      },
      opttxzt: [
        { value: '0', label: '好评' },
        { value: '1', label: '中评' },
        { value: '2', label: '差评' },
        { value: '3', label: '中评改好评' },
        { value: '4', label: '差评改好评' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [{
        ddh: '001',
      }],
      orderBy: '',
      loading: false,
      row: {}, //当前行
      uploadimagehas: false,
    }

  },
  computed: {
    imgurl() {
      return this.$store.state.user.urlImg;
    }
  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable1();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val; //修改每页数据量
      this.onloadtable1();
    },
    handleCurrentChange(val) { //跳转第几页
      this.listQuery.pageNum = val;
      this.onloadtable1();
    },
    sortChange(column) { //服务器端排序
      if (column.order == "ascending") {
        this.orderBy = column.prop + " asc";
      } else if (column.order == "descending") {
        this.orderBy = column.prop + " desc";
      }
      this.onloadtable1();
    },
    onloadtable1() { //查询
      this.timeFormat();
      var txmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
      };
      request({ url: 'mall/dd/searchdd.do', method: 'post', data: txmxcxData }).then(response => {
        this.loading = false;
        for (var i = 0; i < response.list.length; i++) {
          response.list[i].spdj = this.moneyData(response.list[i].spdj);
          response.list[i].spzhj = this.moneyData(response.list[i].spzhj);
          response.list[i].zje = this.moneyData(response.list[i].zje);
          response.list[i].yhje = this.moneyData(response.list[i].yhje);
          response.list[i].zfje = this.moneyData(response.list[i].zfje);
          response.list[i].tpurl = this.imgUrl(response.list[i].tpurl);
          response.list[i].state = this.setState(response.list[i].zt);
          response.list[i].zffs = this.setZffs(response.list[i].zffs);
          if (response.list[i].spzkzt == '0' || response.list[i].spzkzt == null) {
            response.list[i].spzk = '无';
            response.list[i].spzhj = '无';
          }
        }
        this.tableData = response.list;
        this.listQuery.totalCount = response.total;
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      })
    },
    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
      if (this.formInline.sj) {
        this.$store.dispatch('timeFormat', this.formInline);
      } else {
        // this.$store.dispatch('getNewDate', this.formInline);
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    setState(val) {
      if (val == '0') {
        return '待付款';
      } else if (val == '1') {
        return '已付款';
      } else if (val == '2') {
        return '已发货';
      } else if (val == '3') {
        return '已收货';
      } else if (val == '4') {
        return '已完成';
      } else if (val == '5') {
        return '已取消';
      } else {
        return '已退款';
      }
    },
    setZffs(val) {
      if (val == '1') {
        return '微信公众号';
      } else if (val == '2') {
        return '微信App';
      } else if (val == '3') {
        return '支付宝App';
      } else if (val == '4') {
        return '会员余额';
      } else {
        return '';
      }
    },
    imgUrl(imgurl) {
      return this.imgurl + imgurl;
    },
    getdetl(row) { //           查看详情
      this.row = row;
      this.uploadimagehas = true;
    },
    childchanged(childdata) { //接收子组件参数
      this.uploadimagehas = false;
      this.onloadtable1();
    },
    td() {
      Message.warning("功能暂未开通");
      return;
    }
  }
}

</script>
<style scoped>
/**/

.smain {
  padding: 10px;
}

.smainFright {
  position: absolute;
  right: 0;
}

div.el-dialog--center div.el-dialog__body {
  padding-top: 5px;
  padding-bottom: 5px;
}

</style>
