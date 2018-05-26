<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!--  <el-form-item>
        <el-select v-model="formInline.pjdj" filterable placeholder="类型" style="width:150px;">
          <el-option v-for="item in opttxzt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 200px;" placeholder="会员名称/电话"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-select v-model="formInline.zt" filterable placeholder="请选择提现状态" style="width:150px;">
          <el-option v-for="item in opttxzt" :key="item.value" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column prop="ddh" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="spmc" label="宝贝标题" align="center"> </el-table-column>
        <el-table-column prop="loginName" label="买家" align="center"> </el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center"> </el-table-column>
        <!-- <el-table-column prop="pjdj" label="类型" align="center">
  <template slot-scope="scope">
    <span v-if="scope.row.pjdj=='0'">
              好评
            </span>
    <span v-if="scope.row.pjdj=='1'">
              中评
            </span>
    <span v-if="scope.row.pjdj=='2'">
              差评
            </span>
    <span v-else>
            </span>
  </template>
</el-table-column>
 -->
        <el-table-column prop="tkyy" label="原因" align="center"> </el-table-column>
        <!-- <el-table-column prop="tkje" label="退款金额" align="center"> </el-table-column> -->
        <el-table-column prop="zt" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.zt==='0'">
             未审核
            </span>
            <span v-else-if="scope.row.zt==='1'">
             审核通过
            </span>
            <span v-else>审核未通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="bz" label="备注" align="center"> </el-table-column>
        <el-table-column prop="shrid" label="客服" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" :disabled="scope.row.zt!=='0'" v-if="scope.row.fwlx==='0'" @click="th(scope.row,0,'退货')">退货</el-button>
            <el-button type="text" size="mini" :disabled="scope.row.zt!=='0'" v-if="scope.row.fwlx==='1'" @click="th(scope.row,1,'换货')">换货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <el-dialog :visible.sync="dialog1" title="订单详情" center>
      <span>订单详情</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog2=true">退货</el-button>
       </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog2" title="换货信息" center>
      <span>换货信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Returns()">换货</el-button>
       </span>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      dialog1: false,
      dialog2: false,
      formInline: {
        hybh: '',
        sjh: '',
        yhkh: '',
        sj: '',
        pjdj: '',
        zt: ''
      },
      opttxzt: [],
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
    }

  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable1();
    this.gettxzt();
  },
  methods: {
    Returns() {
      this.dialog2 = false;
    },
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
        hybh: this.formInline.hybh,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        pjdj: this.formInline.pjdj,
        fwlx: '1',
        zt: this.formInline.zt,
      }
      console.log(txmxcxData);
      request({ url: 'mall/sh/searchsh.do', method: 'post', data: txmxcxData })
        .then(response => {
          this.loading = false;
          this.tableData = response.list;
          this.listQuery.totalCount = response.total;
          console.log(response.data);
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    gettxzt() {
      request({ url: 'mall/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 6 } }).then((response) => {
        this.loadbtn = false;
        this.opttxzt = response.data;
        console.log(this.optlx);
      }).catch((err) => {
        this.loading = false
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
    th(row, has, zt) {
      this.$confirm(zt + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'mall/sh/thh.do', method: 'post', data: row }).then(response => {
            var type;
            if (response.code == "1") {
              type = 'success';
            } else {
              type = 'warning';
            }
            this.$message({ message: response.msg, type: type });
            this.onloadtable1(); //刷新数据
          })
          .catch((error) => {
            Message.error("error：" + "请检查网络是否连接");
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' + zt });
      });
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
