/**
 * 1 输入框绑定值 改变事件 input事件
 *  1 获取输入框的值
 *  2 合法性判断
 *  3 检验通过 把输入框的值 发送到后台
 *  4 返回的数据打印到页面上
 * 2 防抖 （防止输入值每变化一次都搜索） 
 */

import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,
    //输入框的值
    inputvalue:'',
    
  },

//输入框的值 改变 触发的事件
  handleInput(e){
    //1 获取输入框的值
    const {value}=e.detail;
    //检验合法性
    if(!value.trim()){
      //值不合法
      this.setData({
        isFocus:false,
      })
      return;
    }
    this.setData({
      isFocus: true
    })
  //请求数据 使用定时器
  clearTimeout(this.timeId);
  this.timeId=setTimeout(()=>{
      this.search(value);    
    
  },1000);
    
  },
  
  //发送请求
  search(query){
    const res = request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch",data:{query}
      }).then(res=>{
        console.log(res.data.message);
        

        if (res.data.message.length == 0) {
          this.setData({
            goods: [{
              goods_name: '无搜索结果'
            }]
          })
        }else{
          this.setData({
            goods: res.data.message
          });
        }
        
      })
  },

  //取消事件
  handleClear(){
    this.setData({
      isFocus:false,
      goods:[],
      inputvalue:''
    })
  }

})