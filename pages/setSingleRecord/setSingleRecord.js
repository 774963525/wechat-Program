
var app = getApp()
var api = app.globalData.api;
Page({
  data: {
    // 编辑呗点击后改为其他数字 金额和备注变为可写
    change:0
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })
    
    // 返回上一层
    wx.navigateBack({
      
      url:"pages/index/index"
    })
  },
  // 显示大图
  ViewImage(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      
      urls: this.data.original,
      current: this.data.original[e.currentTarget.dataset.url]
     
    });
  },
  money(e){
    
    this.setData({
      money: e.detail.value.trim()
    })
  },
  mark(e){

    console.log(e.detail.value.trim())
    this.setData({
      mark: e.detail.value.trim()
    })
  },
  // 对象
  company(e){
    console.log(e.detail.value.trim())
    this.setData({
      company: e.detail.value.trim()
    })
  },
  // 修改账户
  edit(){
    
    this.setData({
      change:1
    })
    // console.log(this.data.change)
    this.onLoad();
    
  },
  // 保存修改
  save(){

    var id = this.data.id;
    // 如果是underfined要赋值
    if (this.data.money == undefined ){
      this.setData({
        money:this.data.total_money
      })
    } if(this.data.mark == undefined){
      this.setData({
        mark: this.data.remark
      })
    } if(this.data.company == undefined){
      this.setData({
        company: this.data.company_name
      })
    }
    console.log(this.data.company);
    console.log(this.data.remark);
    console.log(this.data.money);
    // console.log(this.data.money)
    wx.request({
      url: api+'api/record/update?id='+id+'&token='+this.data.token,
      method: "POST",
      data: {
        total_money: Number(this.data.money),
        company_name: ""+this.data.company,
        remark: ""+this.data.mark
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:(res)=>{
        if(res.data.status){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
        }else{
          console.log(res.data)
        }
      }

    })
    this.setData({
      change: 0
    })
  },
  // 删除
  delete(){

    var id = this.data.id;
    wx.request({
      url: api +'api/record/delete?id='+id+'&token='+this.data.token,
      success:(res)=>{
        console.log(res.data)
        if(res.data.status){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          this.back();
        }else{
          console.log(res.data);
        }
      }
    })
  },
  onLoad(){

    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
    // 从缓存拿取数据
    wx.getStorage({
      key: 'singleDetail',
      success: (res) => {
        console.log(res.data)
        // console.log("1:   ")
        // console.log(res.data.category_name)
        // console.log("2:   ")
        // console.log(res.data.user_nickname)
        // console.log("3:   ")
        // console.log(res.data.type_string)
        // console.log("4:   ")
        // console.log(res.data.paid_money)
        // console.log("5:   ")
        // console.log(res.data.remark)
        // console.log("6:   ")
        // console.log(res.data.items[0].account_name)
        // console.log("7:   ")
        // console.log(res.data.items[0].images[0].thumbnail)
        // console.log("8:   ")
        // console.log(res.data.items[0].images[0].original)
        var thumbnail = []
        var original=[]
        // 图片有几张
        var img_len = res.data.items[0].images.length
        for(var i = 0;i<img_len;i++){
          thumbnail.push(res.data.items[0].images[i].thumbnail)
          original.push(res.data.items[0].images[i].original)
        }
        // console.log(thumbnail);
        this.setData({
          // 记录id
          id: res.data.id,
          // 交易对象
          company_name: res.data.company_name,
          // "办公费"
          category_name:res.data.category_name,
          // 用户 EE
          user_nickname: res.data.user_nickname,
          //收入/支出
          type_string: res.data.type_string,
          // 金额
          total_money: res.data.total_money,
          // 备注
          remark: res.data.remark,
          // 日期
          date:res.data.date,
          // 账本名
          account_name : res.data.items[0].account_name,
          // 图片 缩略图
          thumbnail: thumbnail,
          // 原图
          original: original,
        })
        console.log(this.data.thumbnail)
      },
    })
  }




})
