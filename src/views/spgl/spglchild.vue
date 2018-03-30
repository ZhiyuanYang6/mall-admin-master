<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 120px;" placeholder="编号、名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.sele1" filterable placeholder="类型" style="width:150px;">
          <el-option v-for="item in opttxzt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.yhkh" style="width: 120px;" placeholder="品牌"></el-input>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="uploadimag()">+</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%" border>
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="name" label="图片" align="center"> </el-table-column>
        <el-table-column prop="phone" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="title" label="标题" align="center"> </el-table-column>
        <el-table-column prop="txzt" label="类型" align="center"> </el-table-column>
        <el-table-column prop="bankCard" label="品牌" align="center"> </el-table-column>
        <el-table-column prop="ddh" sortable='custom' label="售价" align="center"> </el-table-column>
        <el-table-column prop="bankNo" label="说明" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini">详情</el-button>
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="商品添加" class="upimage" :visible.sync="uploadimagehas" width="70%">
      <uploadimage></uploadimage>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
import uploadimage from './components/UploadImage'

export default {
  components: { uploadimage },
  name: 'txmccx',
  data() {
    return {
      uploadimagehas: false,
      formInline: {
        hybh: '',
        sjh: '',
        yhkh: '',
        sj: '',
        sele1: '',
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
        title: '标题一',
      }],
      orderBy: '',
      loading: false,
    }

  },
  created: function() {
    // this.$store.dispatch('getNewDate', this.formInline);
    // this.onloadtable1();
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val; //修改每页数据量
      // this.onloadtable1();
    },
    handleCurrentChange(val) { //跳转第几页
      this.listQuery.pageNum = val;
      // this.onloadtable1();
    },
    sortChange(column) { //服务器端排序
      if (column.order == "ascending") {
        this.orderBy = column.prop + " asc";
      } else if (column.order == "descending") {
        this.orderBy = column.prop + " desc";
      }
      // this.onloadtable1();
    },
    onloadtable1() { //查询
      this.timeFormat();
      var txmxcxData = {
        orderBy: this.orderBy,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        hybh: this.formInline.hybh,
        sjh: this.formInline.sjh,
        yhkh: this.formInline.yhkh,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        txzt: this.formInline.txzt,
      }
      console.log(txmxcxData);
      axios.post('http://192.168.1.127:8082/card/withdrawDetail/withdrawDetailQueryPageList.do', txmxcxData)
        .then(response => {
          this.loading = false;
          for (var i = 0; i < response.data.list.length; i++) {
            response.data.list[i].je = this.moneyData(response.data.list[i].je);
          }
          this.tableData = response.data.list;
          this.listQuery.totalCount = response.data.total;
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
    uploadimag() {
      this.uploadimagehas = true;
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
