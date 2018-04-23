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
        <el-button type="warning" @click="onloadtable1()">发货</el-button>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="formInline.radio" size="mini" @change="onloadtable1">
          <el-radio-button label="">显示历史</el-radio-button>
          <el-radio-button label="2">关闭历史</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="xh" label="商品序号" align="center"> </el-table-column>
        <el-table-column prop="tpurl" label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.tpurl+'?'" alt="0" width="80px" height="80px">
          </template>
        </el-table-column>
        <el-table-column prop="spbh" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="spmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="spdj" label="售价" align="center"> </el-table-column>
        <el-table-column prop="sl" label="数量" align="center"> </el-table-column>
        <el-table-column prop="yhje" label="优惠金额" align="center"> </el-table-column>
        <el-table-column prop="loginName" label="买家" align="center"> </el-table-column>
        <el-table-column prop="zt" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.zt">待付款</span>
            <span v-else>待发货</span>
          </template>
        </el-table-column>
        <el-table-column prop="bz" label="备注" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="getdetl(scope.row)">详情</el-button>
            <el-button type="text" size="mini" @click="onloadtable1()">退单</el-button>
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
        radio: '',
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
  created: function() {
    this.$store.dispatch('getNewDate', this.formInline);
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
        zt: this.formInline.radio,
      }
      console.log(txmxcxData);
      request({ url: 'mall/dd/searchdd.do', method: 'post', data: txmxcxData })
        .then(response => {
          this.loading = false;
          for (var i = 0; i < response.list.length; i++) {
            response.list[i].spdj = this.moneyData(response.list[i].spdj);
            response.list[i].tpurl = this.imgUrl(response.list[i].tpurl);
          }
          this.tableData = response.list;
          this.listQuery.totalCount = response.total;
          console.log(response.data);
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    timeFormat() { //时间格式化yy-mm-dd hh:mm:ss
      if (this.formInline.sj) {
        this.$store.dispatch('timeFormat', this.formInline);
      } else {
        this.$store.dispatch('getNewDate', this.formInline);
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    imgUrl(imgurl) {
      return "http://192.168.1.123:8088" + imgurl;
    },
    getdetl(row) { //           查看详情
      this.row = row;
      this.uploadimagehas = true;
    },
    childchanged(childdata) { //接收子组件参数
      this.uploadimagehas = false;
      this.onloadtable1();
    },
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
