const app = getApp();
// 得到api
var api = app.globalData.api;
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    login:false,
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    head_img:"",
    token:"",
    nickname:"请登录您的账号",
  },
  attached() {
    // console.log("success")
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        })
      }
    }
    wx.hideLoading()
  },
  methods: {
   
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    // 用户信息修改
    changeUserMessage(){

    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
        current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接      
      })
    },
    login(){
      wx.navigateTo({
        url: "/pages/login/login",
      })
    },
    // 跳转
    accountSetting(){
      wx.navigateTo({
        url: "/pages/accountSetting/accountSetting",
      })
    },
    // 提交意见
    suggestions(){
      // 跳转
      wx.navigateTo({
        url: "/pages/suggestions/suggestions",
      })
    },
    // 退出登录
    exitLogin(){
      // 
      wx.request({
        url: api +'api/user/logout?token='+this.data.token,
        success:(res)=>{
          if(res.data.status==true){
            wx.showToast({
              title: '退出成功',
              icon:'success',
              duration:2000,
            })
            setTimeout(()=>{
              wx.setStorageSync("token", null)
              wx.setStorageSync("logged", false)
              wx.navigateTo({ url: '/pages/index/index', })
            })
          }
          
        }
      })
    },
    // 拿用户信息
    getUserMessage(){
      wx.request({
        url: api + "api/user/profile?token=" + this.data.token,
        success: (res) => {
          // console.log(res.data);
          this.setData({
            head_img: res.data.data.avatar_url,
            nickname: res.data.data.nickname
          });
          // 存入缓存
          var userMessage = {
            head_img: this.data.head_img,
            nickname: this.data.nickname
          }
          wx.setStorageSync("userMessage", userMessage);
          // 取缓存
          // console.log(wx.getStorageSync("userMessage"));
        }
      })
    },
    // 页面刷新
    onShow: function () {
      this.onLoad();
      // console.log("onshow走到");
    },
    // 加载页面时查询token
    onLoad(){
      // 获取token
      app.getToken((token) => {

        this.setData({
          token: token,
        })
        if(this.data.token==null){
          return;
        }
        if (wx.getStorageSync("logged")){
          this.setData({
            login:true
          })
        }
        // console.log(this.data.login)

        this.getUserMessage();
      })
     
      
      
    }
  }
})