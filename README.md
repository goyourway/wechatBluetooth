# index.js
## 全局变量

```
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
```
---
## 主要函数
* scanBleDevices: function () 
    > wx.openBluetoothAdapter()

    > wx.startBluetoothDevicesDiscovery()

    > wx.onBluetoothDeviceFound()
* createBleConnection: function (e) 
    > wx.createBLEConnection

    > this.getBleServicesAndCharacteristics(deviceId)

    > wx.stopBluetoothDevicesDiscovery()

* closeBleConnection: function(e)
    > wx.closeBLEConnection()

* getBleServicesAndCharacteristics: function (deviceId)
    > wx.getBLEDeviceServices()
    > > wx.getBLEDeviceCharacteristics()

* gotobleCharacteristicConnectedPage: function(e)

* bindshowMsg: function (e)


# bleCharacteristicConnected.js
## 全局变量

```
data: {

   deviceId: "",//蓝牙设备id
   serviceId: "",//蓝牙服务id
   characteristic: "",//蓝牙特征值id

   notifyValueString: "",//监听特征值的变化（监听时自动读取），文本格式，待修改
   notifyValueChange: [],//监听特征值的变化（监听时自动读取），待修改

   readContent: "",//读取错误码（手动读取）
   writeContent: "",//需要写入（发送）的内容

  },
```

## 主要函数
* onLoad: function(options)
    > this.onNotifyValueChange()

* onNotifyValueChange:function()
    > wx.onBLECharacteristicValueChange((characteristic) => {}


* strToHexCharCode:function(str)
    > hexCharCodeToStr:function(hexCharCodeStr)

* readData:function()
    > wx.readBLECharacteristicValue({})

* changeWriteContent: function (e)


* writeData:function ()
    > wx.writeBLECharacteristicValue({})

***
## 其中微信自带蓝牙相关函数如下

   ### wx.openBluetoothAdapter()

   ### wx.startBluetoothDevicesDiscovery()

   ### wx.onBluetoothDeviceFound()

   ### wx.createBLEConnection

   ### wx.stopBluetoothDevicesDiscovery()

   ### wx.closeBLEConnection()

   ### wx.getBLEDeviceServices()

   ### wx.getBLEDeviceCharacteristics()

   ### wx.onBLECharacteristicValueChange((characteristic) => {}

   ### wx.readBLECharacteristicValue({})

   ### wx.writeBLECharacteristicValue({})

