<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.bhmc" style="width: 150px;" placeholder="编号、名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-cascader placeholder="请选择品牌类型" ref="options1" :options="options1" v-model="formInline.flid" :show-all-levels="false" clearable> </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="formInline.sj" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']">
        </el-date-picker>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="uploadimag('','add')">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%">
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <!-- <el-table-column prop="ddh" label="订单号" width="170px" align="center"> </el-table-column> -->
        <el-table-column prop="tpurl" label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.tpurl" alt="0" width="80px" height="80px">
          </template>
        </el-table-column>
        <el-table-column prop="spbh" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="spmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="splx" label="类型" align="center"> </el-table-column>
        <el-table-column prop="sppp" label="品牌" align="center"> </el-table-column>
        <el-table-column prop="pch" label="批次号" align="center"> </el-table-column>
        <el-table-column prop="sl" label="数量" align="center"> </el-table-column>
        <el-table-column prop="djr" label="登记人" align="center"> </el-table-column>
        <el-table-column prop="bz" label="说明" align="center"> </el-table-column>
        <!--   <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="zwktff">修改</el-button>
            <el-button type="text" size="mini" @click="zwktff">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <el-dialog class="upimage" :title="row.title" :visible.sync="uploadimagehas" width="56%" style="padding-bottom: 5%;">
      <Upspbsdj :splist="splist" :listrow="row" :uploadimagehas="uploadimagehas" @dialog1Changed="childchanged($event)"></Upspbsdj>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'
import Upspbsdj from './components/Upspbsdj'

export default {
  components: { Upspbsdj },
  name: 'txmccx',
  data() {
    return {
      formInline: {
        bhmc: '',
        flid: [],
        sj: '',
      },
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      orderBy: '',
      loading: false,
      options1: [],
      uploadimagehas: false,
      row: '', //当前行或添加行
      splist: [], //所有商品信息
    }
  },
  computed: {
    imgurl() {
      return this.$store.state.user.urlImg
    }
  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable1();
    this.onloadtable2();
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
      this.timeFormat();
      var txmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        bhmc: this.formInline.bhmc,
        flid: this.formInline.flid[1] ? this.formInline.flid[1] : '',
        startDate: this.formInline.startTime,
        endDate: this.formInline.endTime,
      }
      // console.log(txmxcxData);
      request({ url: 'mall/kcbs/searchkcbs.do', method: 'post', data: txmxcxData })
        .then(response => {
          // console.log(response.data);
          this.loading = false;
          for (var i = 0; i < response.list.length; i++) {
            response.list[i].tpurl = this.imgurl + response.list[i].tpurl;
            response.list[i].djr = response.list[i].djr ? response.list[i].djr : "未设置";
            response.list[i].bz = response.list[i].bz ? response.list[i].bz : "未设置";
          }
          this.tableData = response.list;
          this.listQuery.totalCount = response.total;
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    onloadtable2(val) { //查询类别品牌
      request({ url: 'mall/spfl/searchspflbysplx.do', method: 'post', data: {} })
        .then((response) => {
          this.$store.dispatch('getTrees', response.data)
          this.options1 = response.data.treedata;
        })
        .catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    onloadtable3(val) { //查询所有商品
      request({ url: 'mall/spkc/getspkc.do', method: 'post', data: {} })
        .then((response) => {
          // console.log(response.data.data);
          this.splist = response.list;
        })
        .catch((error) => {
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
    delclick(row, has, zt) { //删除库存
      this.$confirm('是否' + zt + '该条库存信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delData = {
          pch: row.pch,
          spbh: row.spbh,
          zt: has
        }
        request({ url: 'mall/spkc/delspkc.do', method: 'post', data: delData }).then((response) => {
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
    uploadimag(row, add) { // 添加、修改 库存
      if (add) {
        this.row = {};
        this.row.btn = "添加";
        this.row.title = "添加报损登记";
      } else {
        this.row = row;
        this.row.showzt = true;
        this.row.btn = "修改";
        this.row.title = "修改报损登记";
        this.row.options1 = this.options1;
        // console.log(this.row)
      }
      this.uploadimagehas = true;
    },
    childchanged(childdata) { //接收子组件参数
      this.uploadimagehas = false;
      this.onloadtable1();
    },
    zwktff() {
      Message.warning("功能暂未开通");
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
