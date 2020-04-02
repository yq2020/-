/**
 * 
 * 商品收藏功能
 *  1 页面onShow时候 加载缓存中的商品收藏数据
 *  2 判断当前商品是不是被收藏
 *    1 是 则改变页面图标
 *    2 不是
 *  3 点击商品收藏按钮
 *    1 判断该商品是否已经存在于缓存数据/数据库中
 *    2 已经存在 把该商品删除
 *    3 没有存在 则把商品添加到收藏数组中 存入缓存/数据库
 *--------------------------------- 
 */

//使用云开发数据库
const DB=wx.cloud.database().collection("GoodsInfo")

import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    goodsObj2:{},

    isCollect:false
  },
  //商品对象 全局变量
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //onloind换成onShow后 需要获取 options  通过页面栈里面的options
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;

    const {goods_id}=options;
    this.getGoodsDetail(goods_id);

    
  },
  
  
  //获取商品详情数据-----------------------------------------------------------------------------------------------
  getGoodsDetail(goods_id){
    const goodsObj=request({ url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",data:{goods_id}
    }).then(res => {
      this.GoodsInfo = res.data.message;
        console.log(this.GoodsInfo);

        //数据库添加数据
        /*-----------------------------------------
          DB.add({
            data:this.GoodsInfo,
            success(res){
              console.log("添加成功",res)
            },
            fail(res){
              console.log("添加失败",res)
            }
          });

          //查询
           DB.where({goods_id:{goods_id}}).get({
          success(res){
            console.log("查询成功",res);
          }
      });
          ---------------------------------------------
        */
     



      //1 获取缓存中的商品收藏的数组
      let collect = wx.getStorageSync("collect") || [];
      //2 判断当前商品是否被收藏
      let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);


      this.setData({
        goodsObj:{
          goods_name:res.data.message.goods_name,
          goods_price: res.data.message.goods_price,
          //防止部分iPhone手机不支持.webp格式图片
          goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),//正则表达式
          pics: res.data.message.pics
        },
        isCollect
      });
      
    });

  },



  //点击轮播图 放大预览-------------------------------------------------------------
  handlePrevewImage(e){
    //1 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //接收传递过来的URL图片
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls,
    })
  },

  //点击加入购物车------------------------------------------------------------------
  handleCartAdd(){
    //1 获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    //2 判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //3 不存在购物车中 第一次添加
      this.GoodsInfo.num=1;
      //添加后 是否默认选中
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车数据 执行num++
      cart[index].num++;
    }
    //5 吧购物车数据重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '老板大气！',
      icon:'success',
      mask:true
    })
  },

  //点击收藏---------------------------------------------------------------------
  handleCollect(){
    let isCollect=false;
    //1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
  
    /* let collect2=collect2||[];
     let that=this;
     wx.cloud.database().collection("collect").get({
      success(res){
       that.collect =res||[];        
        console.log("查询成功", that.collect);       
      }
    });
   */ 

    //2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);

   /* let index2 = collect2.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    console.log(index2);
    */

    //3 当index！=-1的时候，表示已经收藏过
    
    if(index!==-1){
      //能找到 已经收藏过了
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消成功',
        icon:'success',
        mask:true,
      });
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }

/*
    if (index2 !== -1) {
      //能找到 已经收藏过了
      collect2.splice(index, 1);
      isCollect = false;      
    } else {
      //没有收藏过
      collect2.push(this.GoodsInfo);
      isCollect = true;
    }
*/

    //4 把数组存入缓存中
    wx.setStorageSync("collect", collect);

    /*
    wx.cloud.database().collection("collect").doc("collect").set({
      data: {
        collect: wx.getStorageSync("collect")
        }       
      }).then(res => {
        console.log("添加成功",res)
      }).catch(err => {
        console.error("添加失败",err)
      });
    */

    //5 修改data中的属性 isCollect
      this.setData({
        isCollect
      })
  }

  
})