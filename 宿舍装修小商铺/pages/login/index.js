// pages/login/index.js
Page({
//获取用户讯息
  handleGetUserInfo(e){
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
     wx.navigateBack({
       delta:1
     });
  }

})