
var app = getApp()
var api = app.globalData.api;
Page({
  data: {
    // 编辑呗点击后改为其他数字 金额和备注变为可写
    change: 0
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({

      url: "pages/bookSetting/bookSetting"
    })
  },
  
  // 对象
  bookName(e) {
    // console.log(e.detail.value.trim())
    this.setData({
      bookName: e.detail.value.trim()
    })
  },
  // 修改账户
  edit() {

    this.setData({
      change: 1
    })
    wx.showToast({
      title: '请修改账户名',
      icon: 'none',
      duration: 2000,
    })
    setTimeout( ()=>{
      this.onLoad();
    },1500)
    // console.log(this.data.change)
    

  },
  // 保存修改
  save() {

    var id = this.data.singleDetail.id;
    // 如果是underfined要赋值
    
    console.log(id);
    wx.request({
      url: api + 'api/book/update?token=' + this.data.token,
      method: "POST",
      data: {
        book_id: id,
        book_name: "" + this.data.bookName
       
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.status) {
          console.log(res.data)
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(()=>{
            this.back()
          
          },1000)
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
      }

    })
    this.setData({
      change: 0
    })
  },
  
  onLoad() {

    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
    // 从缓存拿取数据
    wx.getStorage({
      key: 'bookSingle',
      success: (res) => {
        this.setData({
          singleDetail: res.data
        })
        console.log(this.data.singleDetail)
        
      },
    })
  }




})
