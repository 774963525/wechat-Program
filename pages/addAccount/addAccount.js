
var app = getApp();
var api = app.globalData.api;
Page({
  data:{
    // 1.现金 2.银行 3.支付平台 4.其它
    index:0,
    name:"",
    picker: ['请选择','现金', '银行', '支付平台', ' 其它'],
    initial_balance:0,
    sort:1,
    textareaAInput:"",
    showLoading: false,
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
  onLoad() {
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
      
    })
    console.log(this.data.index);
  },
  name(e){
    this.setData({
      name: e.detail.value.trim()
    })
  },
  // 初始值
  initial_balance(e){
    this.setData({
      initial_balance: e.detail.value.trim()

    }) 
  },
  // 备注
  textareaAInput(e){
    this.setData({
      textareaAInput: e.detail.value.trim()

    }) 
   
  },

  // 新增账户 
  addAccount(){ 

    if (this.data.name==''){
      wx.showModal({
        content: "账本名不能为空",
        showCancel: false,
      })
      return

    } else if (this.data.index == 0) {
      wx.showModal({
        content: "请账本选择类型",
        showCancel: false,
      })
      return

    }

    this.showLoading();
    wx.request({
      url: api+"api/account/create?token="+this.data.token,
      method: "POST",
      data: {
        name: this.data.name,
        // 帐户类型 int 1.现金 2.银行 3.支付平台 4.其它
        type: this.data.index,
        // 初始值
        initial_balance: this.data.initial_balance,
        // 备注
        remark: this.data.textareaAInput,
        // sort 排序值 int  可空 默认为10
        sort: this.data.sort


      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.status == true) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2500,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2500)
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            success(res) {
              console.log(res);
            }
          })
          return
        }
        this.setData({
          showList: false
        })
      }
    })
    
  }


})
