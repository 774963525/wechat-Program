 const app = getApp();
 Page({
   data: {
     phoneNumber: "",
     password: "",
   },
   register() {
     wx.navigateTo({
       url: '/pages/register/register',
     })
   },
   back() {
     wx.navigateTo({
       url: '/pages/index/index',
     })

     // 返回上一层
     // wx.navigateBack({
     //   delta: 1
     // })
   },
   phoneNumber(e) {
     this.data.phoneNumber = e.detail.value.trim();
   },
   fogetPass() {
     wx.navigateTo({
       url: "/pages/foget/foget",
     })
   },
   password(e) {

     this.data.password = e.detail.value.trim();
   },
   login() {
     // console.log(this.data.phoneNumber);
     // console.log(this.data.password);
     wx.request({
       url: "http://jizhang-api-dev.it266.com/api/user/token/mobile",
       method: "POST",
       data: {
         mobile: this.data.phoneNumber,
         password: this.data.password,
         captcha_code: "",
         captcha_key: "",

       },
       header: {
         "Content-Type": "application/x-www-form-urlencoded"
       },
       success: (res) => {
         console.log(res.data);
         if (res.data.status != false) {
           wx.showToast({
             title: '登录成功',
             icon: 'success',
             duration: 2000,
           })
           var token = res.data.data.token;
           // 存放token
           wx.setStorage({
             key: 'token',
             data: token,
           })
           wx.setStorageSync("logged", true)

           setTimeout(function() {
             wx.navigateTo({
               url: "/pages/index/index",
             })
           }, 2000)
         } else if (this.data.phoneNumber == "") {
           wx.showModal({
             title: '错误',
             content: "账号不能为空",
           })
           return

         } else if (this.data.password == "") {
           wx.showModal({
             title: '错误',
             content: "密码不能为空",
           })
           return

         } else {
           wx.showModal({
             title: '错误',
             content: res.data.data,

           })
           this.setData({
             password: ""
           })
           return
         }
       },

     })
   }





 })