var app = getApp();
var api = app.globalData.api;
Page({
  data: {
    id:0,
    name:"",
    created_at:"",
    initial_balance:0,
    remark:"",
    type:0,
    picker: ['请选择', '现金', '银行', '支付平台', ' 其它'],
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
  name(e){
    this.setData({
      name:e.detail.value
    })
  },
  remark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  // 选择类型
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
      type:e.detail.value
      
    })
    console.log(this.data.index);
  },
  // 修改数据
  updateAccount(){
    this.showLoading();
    console.log(this.data.type)
    var id = this.data.id;
    wx.request({
      url: api + "api/account/update?id="+id+"&token=" + this.data.token,
      method: "POST",
      data: {
        name: this.data.name,
        // 帐户类型 int 1.现金 2.银行 3.支付平台 4.其它
        type: this.data.type,
        // 备注
        remark: this.data.remark,
        // sort 排序值 int  可空 默认为10
        sort: 1


      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.status == true) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
          })
        } else {
          console.log(res.data);
        }
        this.setData({
          showList: false
        })
        setTimeout(()=>{
          this.back()
        },2000)
      },
    })
  },
  // 页面加载
  onLoad() {
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
    this.showLoading();
    var accountData = (wx.getStorageSync('setAccountData') || [])
    console.log(accountData);
    this.setData({
      name: accountData.name,
      created_at: accountData.created_at,
      initial_balance: accountData.initial_balance,
      remark: accountData.remark,
      type: accountData.type,
      id: accountData.id,
      showLoading: false
    })
  }



})
