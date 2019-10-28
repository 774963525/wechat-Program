var app = getApp();

// 得到api
var api = app.globalData.api;
Page({
  data: {
    showLoading: false
  },
  showLoading() {
    this.setData({
      showLoading: true
    })
    wx.showToast({
      title: '加载中',
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
 
  picUpload(picUrl) {
    wx.uploadFile({
      url: api + 'api/upload/image?token=' + this.data.token,
      filePath: picUrl,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: null,
      success: (res) => {

        var fileKey = JSON.parse(res.data).data.file.fileKey

        if (!JSON.parse(res.data).status) {
          wx.showModal({
            title: '错误',
            content: '这是一个错误弹窗',
            success(res) {
              console.log(res);
            }
          })
          return
        }
        this.setData({
          fileKey: fileKey
        })
        // console.log("-------------")
        // console.log(this.data.fileKey);


      }

    })
  },
 

  oldPassword(e) {
    
    this.setData({
      oldPassword: e.detail.value.trim()
    })

  },
  newPassword(e) {
    
    this.setData({
      newPassword: e.detail.value.trim()
    })

  },
  newPassword2(e) {
    
    this.setData({
      newPassword2: e.detail.value.trim()
    })

  },
  // 提交
  submit() {
    console.log(this.data.newPassword)
    console.log(this.data.newPassword2)
    console.log(this.data.oldPassword)
    if (this.data.newPassword != this.data.newPassword2){
      wx.showModal({
        title: '错误',
        content: '两次密码错误,请重试',
        showCancel:true
      })
      return
    } else if (this.data.newPassword == undefined || this.data.newPassword2 == undefined || this.data.oldPassword == undefined){
      wx.showModal({
        title: '错误',
        content: '密码不能为空',
        showCancel:true
      })
      return
    }else{
      this.showLoading();
      wx.request({
        url: api + 'api/user/password?token=' + this.data.token,
        method: "POST",
        data: {
          password: this.data.oldPassword,
          new_password: this.data.newPassword

        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.status) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2500,
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2500)
          } else {
            console.log(res.data)
            wx.showModal({
              title: '错误',
              content: res.data.data,
              success(res) {
                console.log(res);
              }
            })
          }
          this.setData({
            showList: false
          })
         


        }
      })
    }
    
  },
  onLoad() {
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
    // 拿缓存里的数据
    this.setData({
      nickname: wx.getStorageSync("userMessage").nickname
    })
    // console.log(this.data.nickname);
  }




})