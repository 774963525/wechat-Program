Page({
  data: {
    phoneNumber: "",
    picCode: "",
    key: "",
    url: "",
    mailCode: "",
    username: "",
    password: "",
    // 注册成功
    success:"0",
    check:0,
  },
  back() {
    // wx.navigateTo({ url: '/pages/user/user', })
    
    // // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  // 获得手机号码
  phoneNumber(e) {
    // console.log(e.detail.value.trim());
    this.data.phoneNumber = e.detail.value.trim();
  },
  // 发送验证码
  sendPicCode() {
    wx.request({
      url: "http://jizhang-api-dev.it266.com/api/captcha",
      success: (res) => {
        console.log(res.data);
        this.setData({
          key: res.data.data.key,
          url: res.data.data.url
        });
      }
    })
  },
  // 获得图片验证码表单
  picCode(e) {
    // console.log(e.detail.value.trim());
    this.data.picCode = e.detail.value.trim();
  },
  // 发送手机短信验证码
  sendMailCode() {
    wx.request({
      url: "http://jizhang-api-dev.it266.com/api/sms/verify",
      method: "POST",
      data: {
        //         mobile 手机号码
        //  captcha_code 图形验证码, 默认传入空字符串即可。当频繁调用时, 此字段启用
        //  captcha_key    图形验证码key, 默认传入空字符串即可。调用`api/captcha`接口得到

        mobile: this.data.phoneNumber,
        captcha_code: this.data.picCode,
        captcha_key: this.data.key,

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      // 13162793171
      success: (res) => {
        console.log(res.data);
        if (res.data.status != false) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            success(res) {
              console.log(res);
            }
          })
          setTimeout(() => {
            this.setData({
              check: 1
            })
          }, 1000)
          
        }

      },
    })
  },
  // 获取手机验证码
  mailCode(e) {
    this.data.mailCode = e.detail.value.trim();
  },
  // 用户名
  username(e) {

    this.data.username = e.detail.value.trim();
  },
  // 密码
  password(e) {

    this.data.password = e.detail.value.trim();
  },
  // 提交表单
  submit(){
    wx.request({
                    url:"http://jizhang-api-dev.it266.com/api/user/register",
      method: "POST",
      data: {
        mobile:this.data.phoneNumber,
        verify: this.data.mailCode,
        password: this.data.password,
        nickname: this.data.username
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.status != false) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          // 存放token
          // app.globalData.token = res.data.data.token;
          this.setData({
            success:"1"
          })

          
        } else {
          console.log(res.data.data);
        }
      },
    })
  },
  goLogin(){
    wx.navigateTo({
      url: "/pages/login/login", })
    
  }






})