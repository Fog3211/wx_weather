const day = ["今天", "明天", "后天"];
Page({
    data: {
        day
    },
    onLoad: function() {
        let that = this;
        that.getLocation();
    },
    //获取地理位置
    getLocation: function() {
        let that = this;
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                let latitude = res.latitude
                let longitude = res.longitude
                // console.log("lat:" + latitude + " lon:" + longitude);
                that.getCity(latitude, longitude);
            }
        })
    },

    //获取城市信息
    getCity: function(latitude, longitude) {
        // console.log("lat:" + latitude + " lon:" + longitude);        
        let that = this;
        let url = "https://api.map.baidu.com/geocoder/v2/";
        let params = {
            ak: "0mHfBdqO0Tn7jntMvy45NN5vH8rA1ZDA",
            output: "json",
            location: latitude + "," + longitude
        }
        wx.request({
            url: url,
            data: params,
            success: function(res) {
                // console.log(res);
                let city = res.data.result.addressComponent.city;
                let district = res.data.result.addressComponent.district;
                let street = res.data.result.addressComponent.street;

                that.setData({
                    city,
                    district,
                    street,
                })

                that.getWeahter(city);
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {},
        })
    },


    // //获取天气信息
    getWeahter: function(city) {
        // 预报天气
        let that = this;
        let url_forecast = "https://free-api.heweather.com/s6/weather/forecast";
        let url_now = "https://free-api.heweather.com/s6/weather/now";
        let params = {
            location: city,
            key: "7a6091df18dc436a850e90fe687d0ad4"
        }
        wx.request({
            url: url_forecast,
            data: params,
            success: function(res) {
                // console.log(res);

                let daily_forecast = res.data.HeWeather6[0].daily_forecast;//3天天气预报
                console.log(daily_forecast);
                
                that.setData({
                    daily_forecast
                })
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {},
        })

        //  当前天气
        wx.request({
            url: url_now,
            data: params,
            success: function(res) {
                // console.log(res);
                let tmp = res.data.HeWeather6[0].now.tmp; //温度
                let cond_txt = res.data.HeWeather6[0].now.cond_txt; //实况天气状况描述
                let cond_code = res.data.HeWeather6[0].now.cond_code; //实况天气状况代码
                let qlty = that.getQlty(cond_code);//空气质量
                that.setData({
                    tmp,
                    cond_txt,
                    cond_code,
                    qlty
                })
            },
            fail: function(res) {
                console.log(res);
            },
            complete: function(res) {},
        })
    },
    // 空气质量
    getQlty: function(code) {
        if (0 < code <= 50) {
            return "优";
        } else if (50 < code <= 100) {
            return "良";
        } else if (100 < code <= 150) {
            return "轻度污染";
        } else if (150 < code <= 200) {
            return "中度污染";
        } else if (200 < code <= 300) {
            return "重度污染";
        } else {
            return "严重污染";
        }
    }


})