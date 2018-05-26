<template>
  <div class="smain">
    <el-tabs tab-position="left" type="border-card" style="height: 200px;">
      <el-tab-pane v-for="item in tabsdata" :key="item.value" :label="item.label">
        <el-button v-for="itemChild in item.children" :key="itemChild.value" type="success">{{itemChild.label}}</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'txmccx',
  data() {
    return {
      tabsdata: [],
    }
  },
  created: function() {
    this.onloadtable();
    // this.onloadtable();
  },
  methods: {
    onloadtable() { //查询
      var sppfldata = {
        splx: '',
      };
      request({ url: 'mall/spfl/searchspflbysplx.do', method: 'post', data: sppfldata })
        .then(response => {
          this.$store.dispatch('getTrees', response.data);
          this.tabsdata = response.data.treedata;
          console.log(this.tabsdata)
        })
        .catch(error => {
          Message.error("error：" + "请检查网络是否连接");
        })
    },
  }
}

</script>
<style scoped>
.smain {
  padding: 10px;
}

</style>
