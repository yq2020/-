// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    //被收藏的商品数量
    collectNums:0
  },

  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    const collect=wx.getStorageSync("collect")||[];
    this.setData({userinfo,collectNums:collect.length});
  },



  //获取登录信息
  handleGetUserInfo(e) {
    const { userInfo } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    const userinfo = wx.getStorageSync("userinfo");
    this.setData({ userinfo });
  },

  //点击 收货地址
  hendleChooseAddress() {
    //1 获取 权限状态
    wx.getSetting({
      success: (result) => {
        //2 获取权限状态
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1);
              //放缓存
              wx.setStorageSync("address", result1);
            }
          });
        } else {
          //3 用户 以前拒绝过授予权限 则先诱导用户打开授权界面
          wx.openSetting({
            success: (result2) => {
              //4 可以调用 收货地址代码
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3);
                  //放缓存
                  wx.setStorageSync("address", result3);
                }
              })
            }
          })
        }
      }
    })
  },

  //关于我们点击事件
  handleabout(){
    wx.showModal({
      title: '关于我',
      content: '宇麒，牛逼！',
    })
  }
})