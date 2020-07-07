/*
 * @Descripttion: 
 * @version: 
 * @Author: ankeji
 * @Date: 2020-05-25 10:29:06
 * @LastEditors: ankeji
 * @LastEditTime: 2020-05-25 10:30:26
 */
var amapFile = require('./amap-wx.js');//如：..­/..­/libs/amap-wx.js
var key = "9a2f66969fc*******aae6b7dc2";//微信小程序的封装key
const webKey = '5f22ad8db*****cfb65200cc3a';//web端的封装key
var myAmapFun = new amapFile.AMapWX({ key: key });
class Location {
    constructor() {
        this.la1 = 31.14979;
        this.lo1 = 121.12426;
    }
    /**
* @creator 获取POI数据
* @data 2020/04/11
* @return data 附近商家信息
*/
    getPoiAround() {
        myAmapFun.getPoiAround({
            success: function (data) {
                //成功回调
                console.log(data);
                return data;
            },
            fail: function (info) {
                //失败回调
                console.log(info)
            }
        })

    }
    /**
* @creator 获取地址描述数据
* @data 2020/04/11
* @param latitude 纬度
* @param longitude 经度
* @return data 地址信息描述
*/
    getRegeo(latitude, longitude) {
        return new Promise((resolve, reject) => {
            myAmapFun.getRegeo({
                location: latitude ? '' + longitude + ',' + latitude + '' : '',//location的格式为'经度,纬度'
                success: function (data) {
                    //成功回调
                    console.log(data);
                    // return data;
                    resolve(data)
                },
                fail: function (info) {
                    //失败回调
                    console.log(info)
                    reject();
                }
            })
        })

    }
    /**
* @creator 获取输入提示词
* @data 2020/04/11
* @param keywords 输入关键词
* @return data.tips 附近地址信息列表
*/
    getInputtips(keywords) {
        return new Promise((resolve, reject) => {
            myAmapFun.getInputtips({
                keywords: keywords,
                location: '',
                success: function (data) {
                    if (data && data.tips) {
                        // console.log(data);
                        // return data.tips;
                        resolve({ code: 200, data: data, msg: '查询成功!' })
                    }
                },
                fail: function (info) {
                    //失败回调
                    console.log(info)
                    reject({ code: -1, data: [], msg: '查询成功!' });
                }
            })
        })
    }
    /**
* @creator 获取天气信息
* @data 2020/04/11
* @return data   天气信息
*/
    getWeather() {
        myAmapFun.getWeather({
            success: function (data) {
                console.log(data);
                return data;
                //成功回调
            },
            fail: function (info) {
                //失败回调
                console.log(info)
            }
        })
    }
    /**
     * 地理编码（根据地址获取经纬度数据）
     * webService
     */
    getDataByAddress(address, code) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: 'https://restapi.amap.com/v3/geocode/geo',
                method: 'get',
                data: {
                    key: webKey,
                    address: address,
                    city: code
                },
                success: res => {
                    console.log(res);

                    resolve(res);

                },
                fail: err => {
                    reject(err)
                }
            })
        })

    }

    /**
 * @creator 逆地址解析
* @data 2020/04/11
* @param latitude 纬度
* @param longitude 经度
* @return res.data   地址信息描述
*/
    loadCity(latitude, longitude) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: 'https://restapi.amap.com/v3/geocode/regeo',
                data: {
                    key: key,
                    location: longitude + "," + latitude,
                    extensions: "all",
                    s: "rsx",
                    sdkversion: "sdkversion",
                    logversion: "logversion"
                },
                success: function (res) {
                    console.log(res.data);
                    resolve({ code: 200, data: res.data, success: true })
                },
                fail: function (res) {
                    console.log('获取地理位置失败')
                    reject({ code: 300, msg: '用户拒绝授权位置信息', success: false })
                }
            })
        })
    }
    /**
  * @creator 计算距离
  * @data 2019/01/17
  * @desc 由经纬度计算两点之间的距离，la为latitude缩写，lo为longitude
  * @param la1 第一个坐标点的纬度
  * @param lo1 第一个坐标点的经度
  * @param la2 第二个坐标点的纬度
  * @param lo2 第二个坐标点的经度
  * @return (int)s   返回距离(单位千米或公里)
  * @tips 注意经度和纬度参数别传反了，一般经度为0~180、纬度为0~90
  * 具体算法不做解释，有兴趣可以了解一下球面两点之间最短距离的计算方式
  */

    distance(la1, lo1, la2, lo2) {
        if (!la1) {
            return -2;//没有授权定位
        }
        if (!la1 || !lo1 || !la2 || !lo2) {
            return -1;
        }
        var La1 = la1 * Math.PI / 180.0;
        var La2 = la2 * Math.PI / 180.0;
        var La3 = La1 - La2;
        var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        s = s.toFixed(2);
        // console.log(s);
        return s;
    }
}

export { Location };
