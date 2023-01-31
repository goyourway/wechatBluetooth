//index.js
//获取应用实例
const app = getApp()

// !!!!（不必弄懂）111
function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}


Page({
  data: {
    //蓝牙设备是否连接
    IsBleConnected: false,
    //选中的蓝牙设备
    ChosenBleDevice: "",
  
    //蓝牙设备列表
    BleDeviceList: [],
    //蓝牙服务列表
    BleServiceList: [],
    //蓝牙特征值列表
    BleCharacteristicList: [],

    //用于wxml自定义下拉框使用
    select: []
  },


/*
  函数：scanBleDevices
  功能：打开蓝牙适配器，扫描蓝牙设备

*/
  scanBleDevices: function () {

    //打开了蓝牙适配器
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log("openBluetoothAdapter successfully")

        //开始蓝牙搜索
        wx.startBluetoothDevicesDiscovery({
          success: (res) => {
            console.log("startBluetoothDevicesDiscovery successfully")
            
            //搜索到了设备
            wx.onBluetoothDeviceFound((res) => {
              res.devices.forEach(device => {
                
                if (!device.name && !device.localName) { return }
                
                //判断设备是否存在于变量BleDeviceList中
                const foundDevices = this.data.BleDeviceList
                //若存在，则ExistNumber为数组下标，若不存在，则为-1
                const ExistNumber = inArray(foundDevices, 'deviceId', device.deviceId)

                //data用于存储新发现的device
                const data = {}

                //根据ExistNumber将获取到的设备加入数组BleDeviceList的不同位置
                if (ExistNumber === -1) {
                  data[`BleDeviceList[${foundDevices.length}]`] = device
                } else {
                  data[`BleDeviceList[${ExistNumber}]`] = device
                }
                this.setData(data)

              })
            })

          },
        })
      },
    })


  },


/*
  函数：createBleConnection
  功能：选择一个已发现的设备并建立连接

*/
  createBleConnection: function (e) {
    //console.log(e.currentTarget.dataset)
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name

    //进行蓝牙连接
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          //....
          ChosenBleDevice: deviceId,//蓝牙连接，给全局变量ChosenBleDevice赋值
          IsBleConnected: true,//蓝牙连接，给全局变量IsBleConnected赋值
          name,//蓝牙连接，给全局变量name赋值
          deviceId//蓝牙连接，给全局变量deviceId赋值
        })

        //调用函数，获取设备的服务
        this.getBleServicesAndCharacteristics(deviceId)

      },
    })
    //停止搜索蓝牙
    wx.stopBluetoothDevicesDiscovery()
  },

  //关闭蓝牙连接
  closeBleConnection: function (e) {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      //初始化全局变量
      ChosenBleDevice: "",
      IsBleConnected: false,
     
      BleServiceList: [],
      BleCharacteristicList: []
    })
  },

/*
  函数：getBleServicesAndCharacteristics
  功能：获取蓝牙服务及每一服务的特征值

*/
  getBleServicesAndCharacteristics: function (deviceId) {

    //获取蓝牙服务
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        this.setData({
          BleServiceList: res.services
        })
        console.log("services: ", res.services)

        var blecharacteristic = new Array();
        var selecttemp = new Array();

        //循环：针对每一服务获取特征值  
        for (let i = 0; i < res.services.length; i++) {
          let servicetemp = res.services[i];
          console.log("serviceid:!!   ", res.services[i].uuid)

          //获取特征值  
          wx.getBLEDeviceCharacteristics({
            deviceId: this.data.ChosenBleDevice,
            serviceId: res.services[i].uuid,
            success: (res) => {
              console.log('getBLEDeviceCharacteristics success', res.characteristics)

              //循环：对每一特征值开启通知监听
              for (let j = 0; j < res.characteristics.length; j++) {
                let item = res.characteristics[j]
                if (item.properties.notify || item.properties.indicate) {

                  //对特征值开启通知监听
                  wx.notifyBLECharacteristicValueChange({
                    deviceId: this.data.ChosenBleDevice,
                    serviceId: servicetemp.uuid,
                    characteristicId: item.uuid,
                    state: true,
                    success: function (res) { console.log("open notify successfully") },
                  })
                }
              }



              //自定义下拉框默认：false隐藏，true显示。
              selecttemp.push(false);
              blecharacteristic.push(res.characteristics)

              this.setData({
                BleCharacteristicList: blecharacteristic,
                select: selecttemp
              })

            },
          })
        }
      },
    })
  },


/*
  函数：gotobleCharacteristicConnectedPage
  功能：将deviceId、serviceId、characteristic传出到app.globalData，并跳转到bleCharacteristicConnected页面：准备对特征值进行读写。

*/
  gotobleCharacteristicConnectedPage: function (e) {

    console.log(e.currentTarget.dataset)

    //将设备、服务、特征值传到app，供其他页面调用
    app.globalData.deviceId = this.data.ChosenBleDevice;
    app.globalData.serviceId = e.currentTarget.dataset.serviceId;
    app.globalData.characteristic = e.currentTarget.dataset.characteristic;

    wx.navigateTo({
      url: '/pages/bleCharacteristicConnected/bleCharacteristicConnected',
    })

  },

  //实现了下拉框效果
  bindshowMsg: function (e) {

    console.log(e.currentTarget.dataset.selectId);
    let index = e.currentTarget.dataset.selectId
    this.setData({
      ['select[' + index + ']']: !this.data.select[index]
    })

    console.log("select :  ", this.data.select)
  },


  //和服务器传输的页面，暂时不用了解
  gotowechatHttpsTest: function () {
    wx.navigateTo({
      url: '/pages/wechatHttpsTest/wechatHttpsTest',
    })
  }


})
