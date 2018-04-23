const date = {
  mutations: {
    DATEFORMATE: (state, date) => { //时间格式化yy-mm-dd hh:mm:ss
      var sy = date.sj[0].getFullYear();
      var sm = date.sj[0].getMonth();
      var sd = date.sj[0].getDate();
      var sh = date.sj[0].getHours();
      var si = date.sj[0].getMinutes();
      var ss = date.sj[0].getSeconds();
      var ey = date.sj[1].getFullYear();
      var em = date.sj[1].getMonth();
      var ed = date.sj[1].getDate();
      var eh = date.sj[1].getHours();
      var ei = date.sj[1].getMinutes();
      var es = date.sj[1].getSeconds();
      date.startTime = sy + "-" + (sm + 1 < 10 ? '0' + (sm + 1) : sm + 1) + "-" + (sd < 10 ? '0' + sd : sd) + " " + (sh < 10 ? '0' + sh : sh) + ":" + (si < 10 ? '0' + si : si) + ":" + (ss < 10 ? '0' + ss : ss);
      date.endTime = ey + "-" + (em + 1 < 10 ? '0' + (em + 1) : em + 1) + "-" + (ed < 10 ? '0' + ed : ed) + " " + (eh < 10 ? '0' + eh : eh) + ":" + (ei < 10 ? '0' + ei : ei) + ":" + (es < 10 ? '0' + es : es);
      // console.log(date);
    },
    DATEFORMATETY: (state, date) => { //时间格式化通用yy-mm-dd hh:mm:ss
      var sy = date.sj[0].getFullYear();
      var sm = date.sj[0].getMonth();
      var sd = date.sj[0].getDate();
      var sh = date.sj[0].getHours();
      var si = date.sj[0].getMinutes();
      var ss = date.sj[0].getSeconds();
      var ey = date.sj[0].getFullYear();
      date.sj[1] = sy + "-" + (sm + 1 < 10 ? '0' + (sm + 1) : sm + 1) + "-" + (sd < 10 ? '0' + sd : sd) + " " + (sh < 10 ? '0' + sh : sh) + ":" + (si < 10 ? '0' + si : si) + ":" + (ss < 10 ? '0' + ss : ss);
      // console.log(date.setdate);
    },
    NEW_DATE: (state, date) => { //当天时间
      var nnewDate = new Date();
      var y = nnewDate.getFullYear();
      var m = nnewDate.getMonth();
      var d = nnewDate.getDate();
      var snewDate = new Date(y, m, d);
      date.sj = [snewDate, nnewDate];
      // console.log(date);
    },
    GETTREE: (state, data) => { //格式化树结构
      let items = { value: '', label: "", children: [] };
      let data1 = [];
      let splx = [];
      for (let i = 0; i < data.list.length; i++) {
        var aa1 = splx.find((item) => {
          return item === data.list[i].splx;
        });
        if (!aa1) {
          splx.push(data.list[i].splx);
          items = {
            value: data.list[i].id,
            label: data.list[i].splx,
            children: [
              { "value": data.list[i].id, "label": data.list[i].sppp, }
            ]
          }
          data1.push(items)
        } else {
          for (let n = 0; n < data1.length; n++) {
            // console.log(data1[n])
            if (data1[n].label == data.list[i].splx)
              data1[n].children.push({ value: data.list[i].id, label: data.list[i].sppp })
          }
        }
      }
      data.treedata
 = data1;
    }
  },

  actions: {
    timeFormat({ commit }, date) {
      commit('DATEFORMATE', date);
    },
    timeFormatty({ commit }, date) { //通用
      commit('DATEFORMATETY', date);
    },
    getNewDate({ commit }, date) { //当天时间
      commit('NEW_DATE', date);
    },
    getTrees({ commit }, date) { //格式化树结构
      commit('GETTREE', date);
    },
  }

}

export default date
