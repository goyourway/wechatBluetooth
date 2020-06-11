const app = getApp()

// !!!!（不必弄懂）
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例    !!!!（不必弄懂）
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}


Page({

  /**
   * 页面的初始数据
   */
  data: {

    deviceId: "",//蓝牙设备id
    serviceId: "",//蓝牙服务id
    characteristic: "",//蓝牙特征值id


    notifyValueString: "",//监听特征值的变化（监听时自动读取），文本格式，待修改
    notifyValueChange: [],//监听特征值的变化（监听时自动读取），待修改

    readContent: "",//读取错误码（手动读取）
    writeContent: "",//需要写入（发送）的内容


  },


  /**
   * 生命周期函数--监听页面加载
   * 将app.globalData中的数据取出
   */
  onLoad: function (options) {

    console.log("before: "+ this.data.deviceId);
    this.setData({
      deviceId: app.globalData.deviceId,
      serviceId: app.globalData.serviceId,
      characteristic: app.globalData.characteristic,
  
    })
    console.log("after: "+this.data.deviceId);
    console.log("after: " + this.data.characteristic);

    //调用函数,开启监听
    this.onNotifyValueChange();

  },


/*
  函数：onNotifyValueChange
  功能：监听蓝牙特征值的变化，将变化的值赋给notifyValueChange和notifyValueString

*/
  onNotifyValueChange:function(){
    
    //定义新数组，作为赋值给全局变量的中间变量
    var newnotifyValueChange = new Array();
    var newnotifyValueString = "";

    //开启监听特征值
    wx.onBLECharacteristicValueChange((characteristic) => {

      //打印监听的部分信息
      console.log(characteristic.value)//buffer（2进制信息）
      console.log(ab2hex(characteristic.value))//16进制的信息

      /*
      ab2hex(): 2进制->16进制
      this.hexCharCodeToStr(): 16进制->字符串
      newnotifyValueChange.push(): 将转换后的字符串加入newnotifyValueChange数组
      */
      newnotifyValueChange.push(this.hexCharCodeToStr(ab2hex(characteristic.value)))

      /*
      ab2hex(): 同上
      this.hexCharCodeToStr(): 同上
      newnotifyValueString.concat(): 将转换后的字符串拼接到newnotifyValueString字符串
      */
      newnotifyValueString = newnotifyValueString.concat(this.hexCharCodeToStr(ab2hex(characteristic.value)))


      //赋值给全局变量
      this.setData({
        notifyValueChange: newnotifyValueChange,
        notifyValueString: newnotifyValueString
      })
    })

  },


/*
  函数: strToHexCharCode
  功能：ASCII码转16进制

*/
  strToHexCharCode:function(str) {
    if(str === "") {
    return "";
  } else {

    var hexCharCode = [];
    //hexCharCode.push("0x");
    for (var i = 0; i < str.length; i++) {
      hexCharCode.push((str.charCodeAt(i)).toString(16));
    }

    console.log(hexCharCode)
    return hexCharCode.join("");
  }
},

/*
  函数: hexCharCodeToStr
  功能：十六进制转ASCII码

*/
  hexCharCodeToStr:function(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    if(len % 2 !== 0) {
    alert("存在非法字符!");
    return "";
  }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
    }
    console.log("hex to ascii", resultStr);
  return resultStr.join("");
 },


/*
  函数：readData
  功能：手动读取蓝牙数据(错误码errCode)

*/
  readData:function(){

    wx.readBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: this.data.characteristic.uuid,
      success: (res) => {
        console.log(res)
        this.setData({
          readContent: res.errCode

        })
      },
    })
  },

  
/*
  函数：changeWriteContent()
  @ e :变量，为wxml页面触发此函数的标签属性
  功能：手动读取蓝牙数据(错误码errCode)

*/
  changeWriteContent: function (e) {

    this.setData({
      writeContent: e.detail.value
    })
  },

/*
  函数：writeData()
  功能：写入(发送)蓝牙数据

*/
  writeData:function () {

    var hex = this.strToHexCharCode(this.data.writeContent)
    //把16进制的数转成buffer类型
    let buffer = this.hexStringToArrayBuffer(hex);
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: this.data.characteristic.uuid,
      value: buffer,

      success: (res) => {
        console.log("success",buffer)
      },
      complete:(res)=> {
        console.log("complete", res.errCode)
      }
    })
  },


/*               !!!!（不必弄懂）
  函数：hexStringToArrayBuffer()
  功能：16进制（文本形式）->buffer(2进制)

*/
  hexStringToArrayBuffer: function (str) {
    if (!str) {
      return new ArrayBuffer(0);
    }
    var newstr;
    if (str.length % 2 != 0) {
      newstr = '0'.concat(str)
    } else {
      newstr = str
    }
    var buffer = new ArrayBuffer(newstr.length / 2);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = newstr.length; i < len; i += 2) {
      let code = parseInt(newstr.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    return buffer;
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})