<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.bhmc" style="width: 400px;" placeholder="商品编号、名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="formInline.radio" size="mini" @change="onloadtable1">
          <el-radio-button label="">显示历史</el-radio-button>
          <el-radio-button label="1">关闭历史</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item style="float: right;">
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="onloadtable1()">上架</el-button>
        <el-button type="warning" @click="onloadtable1()">下架</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="spbh" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="spmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="spsj" label="售价" align="center"> </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='0'">
              无效
            </span>
            <span v-else>
              有效
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="bq" label="标签" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bq=='0'">
              新品
            </span>
            <span v-if="scope.row.bq=='1'">
              热销
            </span>
            <span v-if="scope.row.bq=='2'">
              推荐
            </span>
            <span v-if="scope.row.bq=='3'">
              优惠
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sjsj" label="上架时间" align="center"> </el-table-column>
        <el-table-column prop="xjsj" label="下架时间" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini" v-if="!scope.row.status" @click="delclick(scope.row,1, '恢复')">恢复</el-button>
            <el-button type="text" size="mini" v-else @click="delclick(scope.row,0,'删除')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'txmccx',
  data() {
    return {
      formInline: {
        bhmc: '',
        sjh: '',
        yhkh: '',
        sj: '',
        sele1: '',
        radio: '',
      },
      opttxzt: [
        { value: '0', label: '类型1' },
        { value: '1', label: '类型2' },
        { value: '2', label: '类型3' },
        { value: '3', label: '类型4' }
      ],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [{
        name: '001',
      }],
      orderBy: '',
      loading: false,
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
        bhmc: this.formInline.bhmc,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        status: this.formInline.radio,
      }
      console.log(txmxcxData);
      request({ url: 'mall/spsxj/searchspsxj.do', method: 'post', data: txmxcxData })
        .then(response => {
          this.loading = false;
          for (var i = 0; i < response.list.length; i++) {
            response.list[i].spsj = this.moneyData(response.list[i].spsj);
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
    delclick(row, has, zt) { //删除商品
      this.$confirm('是否' + zt + '该条商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delparam = {
          spbh: row.spbh,
          status: has
        }
        request({ url: 'mall/spsxj/delspxx.do', method: 'post', data: delparam }).then((response) => {
            this.$message({ type: 'success', message: zt + '成功!' });
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
