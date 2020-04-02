// pages/goods_list/index.js
/**     刷新需求分析
 * 1 用户上滑页面 滚动条触底 开始加载下一页数据
 *  1 找到滚动条触底事件
 *      1 获取总页数    总条数 total
 *          总页数=Math.ceil(总条数/页容量 pagesize)
 *      2 获取当前页码    pagenum
 *      3 判断当前页码是否大于等于总页数
 *  2 判断还有没有下一页数据
 *  3 假如没有下一页 弹出提示
 *  4 假如还有 则加载下一页数据
 *    1 当前页码++
 *    2 重新发送请求
 *    3 数据请求回来 要对data[]数组进行拼接而不是替换
 * 2 下拉刷新页面
 *  1 触发下拉刷新事件 需要在页面json文件开启一个配置
 *  2 重置数据数组
 *  3 重置页码 设置为1
 *  4 重新发送请求
 */


import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goods_list:[]

  },

  handleTbasItemChange(e){
    //1 获取被点击的索引----
    const {index}=e.detail;
    //2 修改源数组-----
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //3 赋值到data中--------
    this.setData({
      tabs
    })
  },

  //商品列表页面的参数-------------
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
    
  },

  //获取商品列表数据--------------------
  getGoodsList(){
    request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/search",data:this.QueryParams
    })
      .then(res => {   

        const total = res.data.message.total;
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
                
        this.setData({
          //拼接数组
          goods_list:[...this.data.goods_list, ...res.data.message.goods]
        });
            
      });
    //关闭下拉刷新的窗口
    wx-wx.stopPullDownRefresh();
  },

 


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  
  //页面上滑 滚动条触底事件
  onReachBottom(){
    //1 判断有无下一页
    if(this.QueryParams.pagenum>=this.totalPages){
      // 无下一页
        wx.showToast({
          title: '没有下一页啦~'
        })
    }else{
      // 有下一页
        this.QueryParams.pagenum++;
        this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    //1 重置数组
    this.setData({
      goods_list: []
    })
    //2 重置页码
    this.QueryParams.pagenum=1;
    //3 重新发送请求
    this.getGoodsList();
  }
})