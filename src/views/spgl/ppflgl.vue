<template>
  <div class="smain">
    <el-card class="box-card carddl" :body-style="{ padding: '5px 10px' }">
      <div slot="header" class="clearfix">
        <span>分类</span>
        <el-button style=" padding: 3px;margin-left:40%;" @click="setstartu('添加')" type="text">添加</el-button>
        <el-button style=" padding: 3px;" type="text" @click="setstartu('修改')">修改</el-button>
      </div>
      <el-table :show-header="false" highlight-current-row @current-change="selectdl" :data="dllist" style="width:100%; cursor:pointer;">
        <el-table-column prop="label"></el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card cardxl" :body-style="{ padding: '5px 10px' }">
      <div slot="header" class="clearfix">
        <span>品牌</span>
        <el-button style="float:right; padding: 3px;margin-left:20px;" type="text" @click="setstartuxl('添加')">添加品牌</el-button>
      </div>
      <el-table ref="multipleTable" :data="pptable" v-loading="loading" style="width:100%;cursor:pointer;" border>
        <el-table-column prop="id" label="分类品牌编号" align="center"> </el-table-column>
        <el-table-column prop="splx" label="商品分类" align="center"> </el-table-column>
        <el-table-column prop="sppp" label="分类品牌" align="center"> </el-table-column>
        <el-table-column prop="remark" label="商品备注" align="center"> </el-table-column>
        <!-- <el-table-column prop="type" label="商品类型" align="center"> </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="setstartuxl(scope.row)" type="text">修 改</el-button>
            <el-button @click="deletetype(scope.row,'xl')" type="text">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.totalCount">
      </el-pagination>
    </el-card>
    <!-- 分类添加修改 -->
    <el-dialog :title="showdldialog.title" :visible.sync="dialogflVisible" width="40%">
      <fladdsetform :listrow="showdldialog" :dialogdlVisible="dialogflVisible" @dialog1Changed="childchanged($event)"></fladdsetform>
    </el-dialog>
    <!-- 品牌添加修改 -->
    <el-dialog :title="row.title" :visible.sync="dialogppVisible" width="35%">
      <ppaddsetform :listrow="row" :dialogppVisible="dialogppVisible" @dialog1Changed="childchanged($event)"></ppaddsetform>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import fladdsetform from './components/fladdsetform'
import ppaddsetform from './components/ppaddsetform'
export default {
  components: { fladdsetform, ppaddsetform },
  name: 'hyzlgl',
  data() {
    return {
      dialogflVisible: false, //分类
      dialogppVisible: false, //品牌
      dllist: [], //分类data
      pptable: [], //品牌data
      listQuery: {
        pageSize: 10, //默认每页的数据量
        currentPage: 1, //当前页码
        pageNum: 1, //查询的页码
        totalCount: 100, //总页数
      },
      flppdata: '',
      loading: true,
      orderBy: '',
      row: {}, //选中行
      showdldialog: {}, //分类修改
    }
  },
  created: function() {
    this.onloadtableflpp({ splx: '' });
    this.onloadtablefl({ splx: '' });
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val; //修改每页数据量
      this.onloadtable();
    },
    handleCurrentChange(val) { //跳转第几页
      this.listQuery.pageNum = val;
      this.onloadtable();
    },
    setstartu(lx) { //添加、修改分类
      this.showdldialog.btn = lx;
      if (lx == "添加") { //选择分类修改
        this.showdldialog.title = "添加分类";
      } else {
        this.showdldialog.title = "修改分类";
        if (!this.showdldialog.currentdlRow) return this.$message({ type: 'warning', message: "未选择分类" });
      }
      this.dialogflVisible = true;
    },
    setstartuxl(lx) { //添加、修改小品牌
      if (lx == "添加") { //选择品牌修改
        if (!this.showdldialog.currentdlRow)
          return this.$message({ type: 'warning', message: "未选择分类" });
        this.row.btn = lx;
        this.row.title = "添加品牌";
        request({ url: "mall/spfl/searchspflbysplx.do", method: 'post', data: { splx: this.showdldialog.currentdlRow.label, id: this.showdldialog.currentdlRow.value } }).then((response) => {
          this.row.splx = response.data.list[0].splx;
          this.dialogppVisible = true;
        }).catch((err) => {
          this.$message({ type: 'error', message: "请检查网络连接" });
        });
        this.row.currentdlRow = this.showdldialog.currentdlRow;
      } else {
        console.log(lx);
        this.row = lx;
        this.row.title = "修改品牌";
        this.row.btn = "修改";
        this.dialogppVisible = true;
      }
    },

    sortChange(column) { //服务器端排序
      if (column.order == "ascending") {
        this.orderBy = column.prop + " asc";
      } else if (column.order == "descending") {
        this.orderBy = column.prop + " desc";
      }
      this.onloadtable();
    },
    onloadtableflpp(val) { //查询品牌
      val.pageNum = this.listQuery.pageNum;
      val.pageSize = this.listQuery.pageSize;
      request({ url: 'mall/spfl/searchbyflid.do', method: 'post', data: val }).then(response => {
        this.loading = false;
        this.pptable = response.list;
        this.listQuery.totalCount = response.total;
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接" });
      });
    },
    onloadtablefl(val) { //查询分类
      request({ url: 'mall/spfl/searchspflbysplx.do', method: 'post', data: val }).then(response => {
        this.$store.dispatch('getTrees', response.data);
        this.flppdata = response.data.treedata; //添加树结构
        this.dllist = this.flppdata;
      }).catch((err) => {
        this.$message({ type: 'error', message: "请检查网络连接" });
      });
    },
    deletetype(val, type) { //删除品牌
      this.$confirm('此操作将删除品牌 [ ' + val.id + ' ]  ,  是否继续?', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        request({ url: 'mall/spfl/delspfl.do', method: 'post', data: { flId: val.id, splx: val.splx } }).then((response) => {
          var type;
          if (response.code == "1") {
            type = 'success';
          } else if (response.code == "2") {
            this.showdldialog.currentdlRow = "";
            this.onloadtablefl();
          } else {
            type = 'warning';
          }
          this.onloadtableflpp({ splx: '' });
          this.$message({ message: response.msg, type: type });
          // if (response.code == "1") {
          //   this.onloadtableflpp();
          //   this.$message({ type: 'success', message: response.msg });
          // } else if (code == '2') { //该分类没有品牌，初始化分类
          //   this.showdldialog.currentdlRow = "";
          //   this.onloadtablefl();
          // } else {
          //   this.$message({ type: 'error', message: response.msg });
          // }
        }).catch((err) => {
          this.$message({ type: 'error', message: "请检查网络连接" });
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    childchanged(childdata) { //接收子组件参数
      this.dialogflVisible = false;
      this.dialogppVisible = false;
      this.onloadtableflpp({ splx: '' });
      this.onloadtablefl({ splx: '' });
    },
    selectdl(val) { //选择分类
      this.showdldialog.currentdlRow = val ? val : this.showdldialog.currentdlRow;
      this.onloadtableflpp({ splx: this.showdldialog.currentdlRow.label });
    }
  }
}

</script>
<style scoped>
/*scoped*/

.smain {
  padding: 10px;
  overflow: hidden;
}

div.clearfix {
  /*padding: 10px 20px;*/
}

.carddl {
  /*position: absolute;*/
  /*top: 93px;*/
  /*width: 23%;*/
  float: left;
  width: 22%;
}

.cardxl {
  /*position: relative;*/
  /*left: 350px;*/
  /*width: 70%;*/
  position: relative;
  left: 1%;
  width: 77%;
  padding: 5px;
}

.dllist {
  padding: 5px 0;
}

</style>
