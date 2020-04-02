// pages/cart/index.js
/**支付页面功能
 * 1 从缓存中获取购物车的数据 渲染到页面中
 *   checked=true的数据
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    /**获取缓存中的购物车数据 */
    let cart = wx.getStorageSync("cart") || [];

    //过滤没有选择的物品
    cart=cart.filter(v=>v.checked);

    this.setData({ address });


    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } 
    
    this.setData({
      cart,
      totalPrice,
      address,
      totalNum
    });
  
  },
  )
  },
  
  //点击支付事件
  handleItemPay(e){
    wx.showModal({
      title: '咦？_?',
      content: '老板该不会真的想给钱吧？',
    })
  }
})