<template>
  <div class="smain">
    <!-- 左侧表单 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.hybh" style="width: 200px;" placeholder="编号、名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="formInline.splx" placeholder="请选择类型" @change="selesplx">
          <el-option v-for="item in options1" :key="item.value" :label="item.splx" :value="item.id">
          </el-option>
        </el-select>
        <el-select clearable v-model="formInline.sppp" placeholder="请选择品牌">
          <el-option v-for="item in options2" :key="item.value" :label="item.sppp" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 右侧按钮 -->
      <el-form-item>
        <el-button type="warning" @click="onloadtable1()">查询</el-button>
        <!-- <el-button type="warning" @click="uploadimag('','add')">+</el-button> -->
        <el-button type="warning" @click="uploadimag('','add')">自定义的商品添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="stable">
      <!-- @sort-change="sortChange" -->
      <el-table :data="tableData" @sort-change="sortChange" v-loading="loading" style="width:100%">
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="tpurl" label="图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.tpurl" alt="0" width="100%">
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
            <el-button type="text" size="mini" @click="delclick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="row.title" class="upimage" :visible.sync="uploadimagehas" width="60%" style="padding-bottom: 5%;">
      <uploadimage :listrow="row" @dialog1Changed="childchanged($event)"></uploadimage>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
// import uploadimage from './components/UploadImage'
import uploadimage from './components/UploadImage3'

export default {
  components: { uploadimage },
  name: 'txmccx',
  data() {
    return {
      uploadimagehas: false,
      listrow: {},
      formInline: {
        hybh: '',
        sjh: '',
        yhkh: '',
        sj: '',
        splx: '',
        sppp: '',
      },
      options1: [],
      options2: [],
      options3: '',
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
        sppp: '',
        bhmc: this.formInline.hybh
      };
      if (this.formInline.sppp) {
        spglCData.sppp = this.selesplx(this.formInline.sppp, "rain");
      }
      // console.log(spglCData);
      axios.post('http://192.168.1.123:8088/mall/spxx/searchspxx.do', spglCData)
        .then(response => {
          // console.log(response.data);
          this.loading = false;
          for (var i = 0; i < response.data.list.length; i++) {
            response.data.list[i].spsj = this.moneyData(response.data.list[i].spsj);
            response.data.list[i].tpurl = this.imgUrl(response.data.list[i].tpurl);

          }

          this.tableData = response.data.list;
          this.listQuery.totalCount = response.data.total;
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
        axios.post('http://192.168.1.123:8088/mall/spxx/getmaxspbh.do')
          .then(response => {
            this.row = {};
            this.row.spbh = response.data.date;
            this.row.btn = "添加商品";
            this.row.title = "添加商品";
            this.row.options1 = this.options1;
            this.row.remark = "";
          })
          .catch(error => {
            Message.error("error：" + "请检查网络是否连接");
          })
      } else {
        this.row = row;
        this.row.btn = "修改商品";
        this.row.title = "修改商品";
        this.row.options1 = this.options1;
      }
      // console.log(this.row);
      // debugger
      this.uploadimagehas = true;
    },
    onloadtable2(val) { //加载类别品牌
      if (val) { //第二次加载
        var splxData = { splx: val };
      } else { //第一次加载类别
        var splxData = { splx: "" };
      }
      axios.post('http://192.168.1.123:8088/mall/spfl/searchspflbysplx.do?splx=' + splxData.splx)
        .then((response) => {
          if (!val) {
            this.options1 = response.data.data;
          } else {
            this.options2 = response.data.data;
          }
        })
        .catch((error) => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
    selesplx(value, value2) { //解析类别品牌
      if (!value) { return; }

      if (value2 == "rain") {
        var rain = this.options2.find((item) => {
          return item.id === value;
        });
        return rain.sppp;
      }
      this.options3 = this.options1.find((item) => {
        return item.id === value;
      });
      this.onloadtable2(this.options3.splx);
    },

    childchanged(childdata) { //接收子组件参数
      debugger;
      this.uploadimagehas = false;
      this.onloadtable1();
    },
    delclick(row) { //删除商品
      this.$confirm('是否删除该条商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('http://192.168.1.123:8088/mall/spxx/delspxx.do?spbh=' + row.spbh).then((response) => {
            this.$message({ type: 'success', message: '删除成功!' });
            this.onloadtable1(); //刷新数据
          })
          .catch((error) => {
            Message.error("error：" + "请检查网络是否连接");
          })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
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
