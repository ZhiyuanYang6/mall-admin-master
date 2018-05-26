<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 300px;" placeholder="商品编号、名称"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item style="float: right;">
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="updatagg('','add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <!--         <el-radio-group v-model="formInline.radio" size="mini" @change="onloadtable1">
          <el-radio-button label="1">关闭历史</el-radio-button>
          <el-radio-button label="">显示历史</el-radio-button>
        </el-radio-group> -->
        <el-switch v-model="formInline.radio" active-text="历史记录" @change="onloadtable1"></el-switch>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="spbh" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="spmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="spsj" label="售价" align="center"> </el-table-column>
        <el-table-column prop="zhj" label="折后价" align="center"> </el-table-column>
        <el-table-column prop="zk" label="折扣率" align="center"> </el-table-column>
        <el-table-column prop="sxsj" label="开始时间" align="center"> </el-table-column>
        <el-table-column prop="xxsj" label="结束时间" align="center"> </el-table-column>
        <el-table-column prop="zt" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.zt=='1'">有效 </span>
            <span v-else>无效</span>
          </template>
        </el-table-column>
        <el-table-column prop="bz" label="说明" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.zt=='0'">已删除</span>
            <el-button type="text" size="mini" v-if="scope.row.zt=='1'" @click="updatagg(scope.row)">修改</el-button>
            <!--  <el-button type="text" size="mini" v-if="scope.row.zt=='0'" @click="delclick(scope.row,1, '恢复')">恢复</el-button> -->
            <el-button type="text" size="mini" v-if="scope.row.zt=='1'" @click="delclick(scope.row,0,'删除')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <!-- 修改，添加 弹框-->
    <el-dialog :title="row.title" class="upimage" :visible.sync="dzcxdatadialog" width="57%" style="padding-bottom: 5%;">
      <dzcxform :splist="splist" :listrow="row" :dzcxdatadialog="dzcxdatadialog" @dialog1Changed="childchanged($event)"></dzcxform>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'
import dzcxform from './components/dzcxform'
export default {
  name: 'txmccx',
  components: { dzcxform },
  data() {
    return {
      formInline: {
        hybh: '',
        sjh: '',
        yhkh: '',
        sj: '',
        sele1: '',
        radio: false,
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
      row: {},
      dzcxdatadialog: false,
      splist: [], //所有商品信息
    };

  },
  created: function() {
    this.onloadtable1();
    this.onloadtable3();
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
      var txmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        zt: this.formInline.radio ? '' : 1,
        bhmc: this.formInline.hybh
      }
      console.log(txmxcxData);
      request({ url: 'mall/yxhd_zk/searchzk.do', method: 'post', data: txmxcxData })
        .then(response => {
          console.log(response.data);
          this.loading = false;
          for (var i = 0; i < response.list.length; i++) {
            if (response.list[i].zhj != null) {
              response.list[i].zhj = this.moneyData(response.list[i].zhj);
            }
            if (response.list[i].spsj != null) {
              response.list[i].spsj = this.moneyData(response.list[i].spsj);
            }
          }
          this.tableData = response.list;
          this.listQuery.totalCount = response.total;
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    onloadtable3(val) { //查询所有商品
      request({ url: 'mall/spxx/getspbhmc.do', method: 'post', data: {} })
        .then((response) => {
          this.splist = response.list;
        })
        .catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },

    delclick(row, has, zt) { //删除商品
      var delparam = {
        id: row.id,
        zt: has
      }
      console.log(delparam == { id: row.id, zt: has });
      this.$confirm('是否' + zt + '该条商品打折信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'mall/yxhd_zk/updatezk.do', method: 'post', data: { id: row.id, zt: has } }).then((response) => {
            this.$message({ type: 'success', message: zt + '成功!' });
            this.onloadtable1(); //刷新数据
          })
          .catch((error) => {
            Message.error("error：" + "请检查网络是否连接");
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' + zt });
      });
    },
    updatagg(row, val) {
      if (val == 'add') {
        this.row.title = '增加优惠活动';
        this.row.btn = '增加';
      } else {
        this.row = row;
        this.row.title = '修改优惠活动';
        this.row.btn = '修改';
      }
      this.dzcxdatadialog = true;
    },
    childchanged(childdata) { //接收子组件参数
      this.dzcxdatadialog = false;
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
