// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { type } = currentPage.options;
    this.changeTitleByIndex(type - 1);
  },

  
})