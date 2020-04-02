// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 2,
        value: "关注的商品",
        isActive: false
      },
      {
        id: 3,
        value: "我的足迹",
        isActive: false
      }
    ],
    collect:[]
  },

onShow(){
  const collect=wx.getStorageSync("collect")||[];

 
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { type } = currentPage.options;
    this.changeTitleByIndex(type - 1);
  
  this.setData({
    collect
  });
},


  //组件切换
  handleTbasItemChange(e) {
    //1 获取被点击的索引----
    const { index } = e.detail;
    //2 修改源数组-----
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //3 赋值到data中--------
    this.setData({
      tabs
    })
  },

  //根据标题索引激活选中
  changeTitleByIndex(index) {
    // 获取tabs
    const { tabs } = this.data
    tabs.forEach((e, i) => i === index ? e.isActive = true : e.isActive = false);
    // 把tabs的值重新赋值
    this.setData({
      tabs
    })
  },

  
})