var app = getApp();

// 得到api
var api = app.globalData.api;
Page({
  data: {
    imgList:[],
    userMessage:{}
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  // 选择图片并上传
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }

        // 获得地址
        var picUrl = res.tempFilePaths[0]
        this.picUpload(picUrl);
       
      }
    });
  },
  picUpload(picUrl){
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
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除吗？',
      cancelText: '再想想',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  nickname(e) {
    console.log(e.detail.value.trim());
    this.setData({
      nickname: e.detail.value.trim()
    })
    
  },
  // 提交
  submit() {
    wx.request({
      url: api + 'api/user/profile/update?token=' + this.data.token,
      method: "POST",
      data: {
        nickname: this.data.nickname,
        avatar: this.data.fileKey
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
        }


      }
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
    // 拿缓存里的数据
    this.setData({
      nickname: wx.getStorageSync("userMessage").nickname
    })
    // console.log(this.data.nickname);
  }




})