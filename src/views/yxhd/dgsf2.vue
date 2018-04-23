<template>
  <div class="smain">
    <h1>递归算法</h1>
    <h3>spfl</h3> {{spfl}}
    <h3>递归后：</h3> {{data}}
  </div>
</template>
<script>
export default {
  name: 'spglchild',
  data() {
    return {
      spfl: [
        { "id": "1", "splx": "可乐", "sppp": "可口可乐", "remark": null, "type": null },
        { "id": "5", "splx": "汽水", "sppp": "芬达", "remark": null, "type": null },
        { "id": "2", "splx": "雪碧", "sppp": "心飞扬雪碧", "remark": null, "type": null },
        { "id": "1", "splx": "可乐", "sppp": "可口可乐", "remark": null, "type": null },
        { "id": "3", "splx": "可乐", "sppp": "百事可乐", "remark": null, "type": null },
        { "id": "5", "splx": "汽水", "sppp": "芬达", "remark": null, "type": null },
        { "id": "6", "splx": "汽水", "sppp": "达芬", "remark": null, "type": null },
        { "id": "2", "splx": "雪碧", "sppp": "心飞扬雪碧", "remark": null, "type": null },
        { "id": "4", "splx": "雪碧", "sppp": "爽口雪碧", "remark": null, "type": null }
      ],
      parentId: 0,
      data: [],
    }
  },
  /**
   * 树状的算法
   * @params list     代转化数组
   * @params parentId 起始节点
   */
  created: function() {
    this.spfl = this.getTrees(this.spfl, this.parentId); //格式化二级树结构
    console.log(this.spfl)
    console.log(this.options2)
  },
  methods: {
    getTrees: function(list) { // 变为树结构
      let items = { value: '', label: "", children: [] };
      let data = [];
      let splx = [];
      for (let i = 0; i < list.length; i++) {
        var aa1 = splx.find((item) => {
          return item === list[i].splx; //list[i].splx;
        });
        if (!aa1) {
          splx.push(list[i].splx);
          items = {
            value: list[i].splx,
            label: list[i].id,
            children: [
              { value: list[i].splx, label: list[i].id, children: [] }
            ]
          }
          data.push(items)
        } else {
          for (let n = 0; n < data.length; n++) {
            if (data[n].value == list[i].splx)
              data[n].children.push({ value: list[i].sppp, label: list[i].id, children: [] })
          }
        };
      }
      // console.log(data);
      return data
    },
  }
}

</script>
<style scoped>


</style>
