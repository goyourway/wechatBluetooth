
Page({

  /**
   * 页面的初始数据
   */
  data: {
    e: "",
    n: "",
    k: "",
    c:""
   
  },



  testRequest: function (e) {
    console.log(e.detail.value)
    console.log("send request...")
    wx.request({
      url: 'https://www.zustdamo.top/Xiaochuang/wechatHttpsTest',
      data: e.detail.value,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res);
        this.setData({
          c:res.data.c
        })
      }
      
    })
    
    
  },


  testjson:function(){

    var a = "{\"sensor\":123,\"time\":1351824120}";
    var json = JSON.parse(a);
    console.log(json)

  }

})