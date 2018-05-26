<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.bhmc" style="width: 400px;" placeholder="商品编号、名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="formInline.status" size="mini" @change="onloadtable1">
          <el-radio-button label="1">已上架</el-radio-button>
          <el-radio-button label="2">已下架</el-radio-button>
          <el-radio-button label="0">未上架</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item style="float: right;">
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <el-button type="warning" @click="spsxjsubmit('sj')">上架</el-button>
        <el-button type="warning" @click="spsxjsubmit()">下架</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading" style="width:100%" border>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="spbh" label="商品编号" align="center"> </el-table-column>
        <el-table-column prop="spmc" label="标题" align="center"> </el-table-column>
        <el-table-column prop="spsj" label="售价" align="center"> </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='2'">已下架</span>
            <span v-if="scope.row.status=='1'">已上架</span>
            <span v-if="scope.row.status=='0'">未上架</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.bq=='0'">新品</span>
            <span v-if="scope.row.bq=='1'">热销</span>
            <span v-if="scope.row.bq=='2'">推荐</span>
            <span v-if="scope.row.bq=='3'">优惠</span>
          </template> -->
          <template slot-scope="scope">
            <el-select v-model="scope.row.bq" placeholder="请选择" @change="bqseleopt(scope.row.bq,scope.row)">
              <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column v-if="tableData[0].status=='1'" prop="sjsj" label="上架时间" align="center"> </el-table-column>
        <el-table-column v-if="tableData[0].status=='2'" prop="xjsj" label="下架时间" align="center"> </el-table-column>
        <!-- <el-table-column label="操作" align="center"> -->
        <!-- <template slot-scope="scope"> -->
        <!-- <el-button type="text" size="mini" @click="updatagg(scope.row)">修改</el-button> -->
        <!-- <el-button type="text" size="mini" v-if="!scope.row.status" @click="delclick(scope.row,1, '恢复')">恢复</el-button> -->
        <!-- <el-button type="text" size="mini" v-else @click="delclick(scope.row,0,'删除')">删除</el-button> -->
        <!-- </template> -->
        <!-- </el-table-column> -->
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
    <!--   <el-dialog title="修改商品上下架" class="upimage" :visible.sync="spsxjdatadialog" width="57%" style="padding-bottom: 5%;">
      <spsxjform :listrow="row" :spsxjdatadialog="spsxjdatadialog" @dialog1Changed="childchanged($event)"></spsxjform>
    </el-dialog> -->
  </div>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'
// import spsxjform from './components/spsxjform'
import { getSession } from '@/utils/auth'
export default {
  // components: { spsxjform },
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
        status: '1'
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
      options: '',
      spdatasxj: '', //已选择的上下架行
    }

  },
  created: function() {
    this.$store.dispatch('getNewDate', this.formInline);
    this.onloadtable1();
    this.getmemberlevel();
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
    getmemberlevel() {
      request({ url: 'mall/dic/getalldicbyparentcode.do', method: 'post', data: { parentCode: 7 } }).then((response) => {
        this.loadbtn = false;
        this.options = response.data;
        console.log(this.optlx);
      }).catch((err) => {
        this.loading = false
      })
    },
    bqseleopt(val, row) { //修改标签
      console.log(val, row);
      row.bq = val;
      request({ url: 'mall/spsxj/updatespsxj.do', method: 'post', data: row }).then(response => {
        var type;
        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        this.onloadtable1(); //刷新数据
      }).catch(error => {
        Message.error("error：" + "请检查网络是否连接");
      })
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
        status: this.formInline.status,
      }
      request({ url: 'mall/spsxj/searchspsxj.do', method: 'post', data: txmxcxData }).then(response => {
        this.loading = false;
        for (var i = 0; i < response.list.length; i++) {
          response.list[i].spsj = this.moneyData(response.list[i].spsj);
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
        this.$store.dispatch('getNewDate', this.formInline);
        this.formInline.startTime = "";
        this.formInline.endTime = "";
      }
    },
    moneyData(money) { //不能用过滤器，很难受 金额
      return (money / 100).toFixed(2)
    },
    handleSelectionChange(val) {
      this.spdatasxj = val;
    },
    spsxjsubmit(val) { //商品上下架
      console.log(this.spdatasxj); //以选中的上下商品
      var url, type;
      if (val == 'sj') {
        url = "mall/spsxj/addspsxj.do";
      } else {
        url = "mall/spsxj/delspsxj.do";
      }
      request({ url: url, method: 'post', data: this.spdatasxj }).then((response) => {
        if (response.code == "1") {
          type = 'success';
        } else {
          type = 'warning';
        }
        this.$message({ message: response.msg, type: type });
        this.onloadtable1(); //刷新数据
      }).catch((error) => {
        Message.error("error：" + "请检查网络是否连接");
      })

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
