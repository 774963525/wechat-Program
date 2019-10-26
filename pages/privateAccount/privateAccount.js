var app = getApp();
var api = app.globalData.api;
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    NavCur: 0,
    type: 1,
    text: [
      "支出", "收入"
    ],
    tabName: [
      ["cuIcon-profile", "餐饮"], ["cuIcon-profile", "日用"], ["cuIcon-profile", "交通"], ["cuIcon-profile", "购物"], ["cuIcon-profile", "购物"]
    ],
    tabName2: [
      ["cuIcon-profile", "交通"], ["cuIcon-profile", "购物"],
    ],
    num: 0,
    num2: 0,
    showLoading: false

  },
  showLoading() {
    this.setData({
      showLoading: true
    })
    wx.showToast({
      title: '加载中',
      mask: true,
      icon: 'loading'
      
    })
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,


    })
    this.getBook();
    // console.log(this.data.TabCur);

  },
  delete(e){
    this.showLoading();
    // 获取到发送来的id
    // console.log(e.currentTarget.dataset.id);
    wx.request({
      url: api + 'api/category/delete?id=' + e.currentTarget.dataset.id+'&token='+this.data.token,
      success: (res) => {
        if (res.data.status) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
          })
          setTimeout(() =>{

            this.onLoad()
          }, 1500)
        }
        showLoading: false
      }
    })
  },
  name(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },
  submit(){
    this.addName();
  },
  addName() {
    wx.request({
      url: api + 'api/category/create?token=' + this.data.token,
      method: "POST",
      data: {
        type: (this.data.TabCur) + 1,
        name: this.data.name,
        parent_id: 0,
        sort: 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if(res.data.status){
          wx.showToast({
            title: '增加成功',
            icon: 'success',
            duration: 2000,
          })
          // setTimeout(function(){
          //   var that = this;
          //   this.hideModal()
          // },2000)
        }
        this.hideModal()
        this.onLoad();
      }
    })
  },
  // ListTouch计算方向
  ListTouchMove(e) {
        this.setData({
          ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
        })
      },
      ListTouchStart(e) {
        this.setData({
          ListTouchStart: e.touches[0].pageX
        })
      },
      // ListTouch计算滚动
      ListTouchEnd(e) {
        if(this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
    ListTouchDirection: null
  })
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
  // 获取收入或支出类别
  getBook(){
    this.showLoading();
    console.log(this.data.TabCur)
    wx.request({
      url: api + 'api/category?token=' + this.data.token,
      method: "POST",
      data: {
        type: (this.data.TabCur) + 1,
        dataType: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data) {
          this.setData({
            categoryList: res.data.data
          })
        }
        this.setData({
          showList: false
        })
      }
      
    })
  },
  // 页面加载默认界面
  onLoad() {
    // 循环遍历tabName数组
    // var num = this.data.tabName.length;
    //  this.setData({
    //    num:num,
    //  })
    // var num2 = this.data.tabName2.length;
    // this.setData({
    //   num2: num2,
    // })

    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
      this.getBook();
    })




  }

})