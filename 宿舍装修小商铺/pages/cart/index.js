// pages/cart/index.js

/**
 * 1 获取用户的收货地址
 *  1 绑定点击世间
 *  2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
 * 
 * 2 获取用户对小程序所授予获取地址的权限状态 即确定还是取消 名为scope  （用wx.getSetting获取权限状态，打印查看scope的值）
 *  1 假设用户 点击获取确定 则 scope为true 则直接调用地址api
 *  2 假设取消 则为false
 *  3 假设从来没有调用过收货地址的api，则scope为 undefined  则直接调用地址api
 * 
 * -------------------------------
 * 3 页面加载完毕
 *  1 onShow监听页面
 *  2 获取本地存储中的地址数据
 *  3 把数据设置给data中的一个变量
 * -------------------------------
 * 4 onShow 动态渲染购物车内容
 *  1 获取本地缓存中的购物车数组
 *  2 把购物车数据 填充到data中
 * ------------------------------
 * 5 全选的实现 数据的展示
 *  1 onShow 获取缓存中的购物车数组
 *  2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
 * -----------------------------
 * 6 总价格和总数量
 *  1 都需要商品被选中 才计算
 *  2 获取购物车数组
 *  3 遍历
 *  4 判断商品是否被选中
 *  5 总价格 += 商品的单价 *商品的数量
 *  6 总数量 +=商品数量
 *  7 把计算后的价格和数量都 设置回data中
 * --------------------------------
 * 7 商品的选中
 *  1 绑定change事件
 *  2 获取到被修改的商品对象
 *  3 商品对象的选中状态取反
 *  4 重新填回data中和缓存中
 *  5 重新计算全选 总价格 总数量
 * -------------------------------------
 * 8 全选和反选
 *  1 全选复选框绑定事件 change
 *  2 获取data中 的全选变量 allChecked
 *  3 直接取反 allChecked=！allChecked
 *  4 遍历购物车数组 让里面 商品 选中状态跟随 allChecked改版而改变
 *  5 把购物车数组 和allChecked重新设置回data和购物车缓存中
 * ----------------------------------------
 * 9 商品数量的编辑
 *  1 "+" "-" 按钮 绑定同一个点击事件 区分关键为 自定义属性
 *  2 传递被点击的商品id goods_id
 *  3 获取data中的购物车数组 获取需要修改的商品对象
 *  tip:当购物车 数量=1 的时候 还点击“-” 则弹窗提示（调用api：wx.showModal） 询问用户是否删除
 *  4 直接修改商品对象的数量 num
 *  5 把cart数组 重新设置回 缓存中 和 data中 this.setCart
 * -------------------------------------------
 * 10 结算功能
 *  1 判断有没有收货地址信息
 *  2 判断用户有没有选购商品
 *  3 跳转支付页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];

    /*计算全选
    * every数组方法 会遍历 会接收一个回调函数 那么每一个回调函数都返回true 那么every的值才为true；
    * 只要有一个为false 那么不再执行循环 直接返回false
    * 空数组调用every 返回值也为true
    */
    //const allChecked=cart.length?cart.every(v=>v.checked):false;对这段进行优化


    /*-------封装到setCart中-----------------
    *let allChecked=true;

    //1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空，防止没有物品却返回全选true
    allChecked=cart.length!=0?allChecked:false;

    //2 给data赋值
    this.setData({
      address,
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    ------------------------------------------
     */

    this.setData({address});
    this.setCart(cart);
  },


  //点击 收货地址
  hendleChooseAddress(){
    //1 获取 权限状态
    wx.getSetting({
      success:(result)=>{
        //2 获取权限状态
        const scopeAddress =result.authSetting["scope.address"];
        if(scopeAddress===true||scopeAddress===undefined){
          wx.chooseAddress({
            success:(result1)=>{
              console.log(result1);
              //放缓存
              wx.setStorageSync("address", result1);
            }
          });
        }else{
          //3 用户 以前拒绝过授予权限 则先诱导用户打开授权界面
          wx.openSetting({
            success:(result2)=>{
              //4 可以调用 收货地址代码
              wx.chooseAddress({
                success:(result3)=>{
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
  //商品的选中
  handleItemChange(e){
    //1获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    //2 获取购物车数组
    let {cart}=this.data;
    //3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //4 选中状态取反
    cart[index].checked=!cart[index].checked;
    //5 6 把购物车数据重新设置回data和缓存中
    this.setCart(cart);
  },
  //设置购物车状态 同时 重新计算底部工具栏的数据
  setCart(cart){
    let allChecked= true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
      }else{
        allChecked =false;
      }
    })
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  //商品全选功能
  handleItemAllCheck(){
    //1 获取data中的数据
    let {cart,allChecked}=this.data;
    //2 修改值
    allChecked=!allChecked;
    //3 循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  //商品数量编辑功能
  handleItemNumEdit(e){
    // 1 获取传递来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart}=this.data;
    // 3 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //判断是否执行删除
    if(cart[index].num<=1&&operation===-1){
      //弹窗提示
      wx.showModal({
        title: '提示',
        content: '老板~您确定删除嘛o(╥﹏╥)o',
        success:(res)=>{
          if(res.confirm){
            //数组删除 索引index 1为一个
            cart.splice(index,1);
            this.setCart(cart);
          }else if(res.cancel){
            console.log('用户点击取消')
          }
        }
      })
    }else{
      // 4 进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
    
  },

  //恶搞点击
  handleEmpty(){
    wx.showModal({
      title: '啧',
      content: '东西都不买还乱点什么点？╭(╯^╰)╮',
    })
  },

  //点击 结算
  handlePay(){
    //1 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      wx.showToast({
        title: '这地址呢小笨蛋',
      })
      return;
    }
    //2 判断用户有没有选购商品
    if(totalNum===0){
      wx.showToast({
        title: '购物商品呢傻瓜',
      })
      return;
    }
    //3 跳转 支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})