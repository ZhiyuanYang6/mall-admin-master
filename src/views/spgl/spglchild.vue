<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 200px;" placeholder="编号、名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-cascader placeholder="请选择品牌类型" ref="options1" :options="options1" v-model="formInline.flid" :show-all-levels="false" clearable> </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="formInline.radio" size="mini" @change="onloadtable1">
          <el-radio-button label="">显示历史</el-radio-button>
          <el-radio-button label="1">关闭历史</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="uploadimag('','add')">添加商品</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%">
        <el-table-column type="index" width="100" label="序号" align="center"> </el-table-column>
        <el-table-column prop="tpurl" label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.tpurl+'?'" alt="0" width="80px" height="80px">
          </template>
        </el-table-column>
        <el-table-column prop="spbh" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="spmc" label="商品名称" align="center"> </el-table-column>
        <el-table-column prop="splx" label="商品类型" align="center"> </el-table-column>
        <el-table-column prop="sppp" label="商品品牌" align="center"> </el-table-column>
        <el-table-column prop="spsj" sortable='custom' label="售价" align="center"> </el-table-column>
        <el-table-column prop="remark" label="说明" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini">详情</el-button>
            <el-button type="text" size="mini" @click="uploadimag(scope.row)">修改</el-button>
            <el-button type="text" size="mini" v-if="!scope.row.status" @click="delclick(scope.row,1, '恢复')">恢复</el-button>
            <el-button type="text" size="mini" v-else @click="delclick(scope.row,0,'删除')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="row.title" class="upimage" :visible.sync="uploadimagehas" width="57%" style="padding-bottom: 5%;">
      <uploadimage :listrow="row" :uploadimagehas="uploadimagehas" @dialog1Changed="childchanged($event)"></uploadimage>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import request from '@/utils/request'

import { Message } from 'element-ui'
// import uploadimage from './components/UploadImage'
import uploadimage from './components/UploadImage'

export default {
  components: { uploadimage },
  name: 'spglchild',
  data() {
    return {
      uploadimagehas: false,
      listrow: {},
      formInline: {
        hybh: '',
        sjh: '',
        yhkh: '',
        sj: '',
        flid: [],
        radio: ''
      },
      options1: [],
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100,
      },
      tableData: [],
      orderBy: '',
      loading: false,
      row: {},
    }

  },
  created: function() {
    this.onloadtable2();
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
      var spglCData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        flid: this.formInline.flid[1] ? this.formInline.flid[1] : '',
        status: this.formInline.radio,
        bhmc: this.formInline.hybh
      };
      request({ url: 'mall/spxx/searchspxx.do', method: 'post', data: spglCData }).then(response => {
          this.loading = false;
          for (var i = 0; i < response.list.length; i++) {
            response.list[i].spsj = this.moneyData(response.list[i].spsj);
            response.list[i].tpurl = this.imgUrl(response.list[i].tpurl);
          }
          this.tableData = response.list;
          this.listQuery.totalCount = response.total;
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },

    moneyData(money) { //不能用过滤器，很难受 金额
      return (parseFloat(money) / 100).toFixed(2);
    },
    imgUrl(imgurl) {
      return "http://192.168.1.123:8088" + imgurl;
    },
    uploadimag(row, add) { //           添加、修改 商品
      if (add) {
        this.row = {};
        this.row.btn = "添加商品";
        this.row.title = "添加商品";
        this.row.options1 = this.options1;
        this.row.remark = "";
        this.row.xqtpurl = [];
        this.row.tpurl = '';
        this.row.showzt = false;
        this.row.flid = [];
        request({ url: 'mall/spxx/getmaxspbh.do', method: 'post', data: {} }).then(response => {
          this.row.spbh = response.list;
        })
      } else {
        this.row = row;
        this.row.showzt = true;
        this.row.btn = "修改商品";
        this.row.title = "修改商品";
        this.row.options1 = this.options1;
      }
      // console.log(this.row);
      // debugger
      this.uploadimagehas = true;
    },
    onloadtable2(val) { //加载类别品牌
      request({ url: 'mall/spfl/searchspflbysplx.do', method: 'post', data: {} }).then(response => {
        debugger;
        this.$store.dispatch('getTrees', response.data);
        this.options1 = response.data.treedata; //添加树结构
      })
    },

    childchanged(childdata) { //接收子组件参数
      // debugger;
      this.uploadimagehas = false;
      this.onloadtable1();
    },
    delclick(row, has, zt) { //删除商品
      var spxx = {
        spbh: row.spbh,
        status: has
      }
      this.$confirm('是否' + zt + '该条商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({ url: 'mall/spxx/delspxx.do', method: 'post', data: spxx }).then(response => {
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
