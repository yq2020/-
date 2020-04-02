/*原生request请求改为promise方式  封装*/

//为了防止异步请求出现效果重叠 每发送一次请求++，做个判断
let requestTimes=0;
export const request=(params)=>{
  requestTimes++;
  //显示 加载中 效果
  wx.showLoading({
    title: '加载中',
    mask:true
  });

  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      //请求成功执行
      success:(result)=>{
        resolve(result);
      },
      //请求失败执行
      fail:(err)=>{
        reject(err);
      },
      //无论请求成功与否都会执行，类似Java捕获异常的final（）
      complete:()=>{
        requestTimes--;
        if (requestTimes===0){
        //关闭正在等待的图标
        wx.hideLoading();
        }
      }
    });
  })
} 


/**

// 封装请求数据接口代码
// 设置请求的条数
let times = 0;
export const request = (params) => {
  //判断url中是否带有/my/ 带上header tooken
  let header = {...params.header};
  if(params.url.includes("/my/")){
    //拼接header 带上Tooken
    header["Autorization"]=wx.getStorageSync("token");
  }

  // 定义公共接口前缀
  const baseUrl = "https://api.zbztb.cn/api/public/v1";
  // 每请求一次加一次
  times++;
  // console.log(times)
  // 发送请求前设置加载中文字
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve, resject) => {
    wx.request({
      ...params,
      // 重新定义url路径
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (err) => {
        resject(err)
      },

      complete: () => {
        times--;
        if (times === 0) {
          wx.hideLoading()
        }
      }
    });

  })
}
 */