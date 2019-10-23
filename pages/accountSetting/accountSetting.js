
var app = getApp(); 

// 得到api
var api = app.globalData.api;

Page({
  data:{
    accountList:[],
    num:0,
    idList:[],
    token:"",
  },
  back() {
    // wx.navigateTo({ url: '/pages/index/index', })
  
    // 返回上一层
    wx.navigateBack({
      delta: 1
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
    if (this.data.ListTouchDirection == 'left') {
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

  //查看账户详情
  accountDetail(e){
    // 需要获取账户id
    // console.log(e.target.dataset.id);
    var id = e.target.dataset.id;
    this.onShow();
    wx.request({
      url: api + 'api/account/detail?id=' + id +"&token="+this.data.token,
      success: (res) => {
        this.onShow();
        console.log(res.data);
        if (res.data.status == true) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          // 将数据存入缓存
          var accountData = {
            // 账户名
            name: res.data.data.name,
            // 账户创建时间
            created_at: res.data.data.created_at,
            // 初始值
            initial_balance: res.data.data.initial_balance,
            // 备注
            remark: res.data.data.remark,
            // 类别
            type: res.data.data.type,
            id:id,
          }
          wx.setStorageSync('setAccountData', accountData);
          // 跳转详情页
          wx.navigateTo({ url: "/pages/accountDetail/accountDetail", })
        }
      }

    })

  }, 

  // 删除账户
  delAccount(e){
    // 需要获取账户id
    console.log(e.target.dataset.id);
    var id = e.target.dataset.id;
    // 调方法
    wx.request({
      url: api + "api/account/delete?id=" + id + "&token=" + this.data.token,
      success: (res) => {
        console.log(res.data);
        if(res.data.status==true){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
        }
        this.onLoad();
        // let i = 0;
        // // 将名字和id存入
        // var arr = [];
        // var arr_id = [];
        // for (i = 0; i < content.length; i++) {
        //   arr.push(content[i].name);
        //   arr_id.push(content[i].id);

        }
       
      
    })

  },
  // 跳转到新增账户
  addAccount(){
    
    wx.navigateTo({ url: "/pages/addAccount/addAccount", })
  },
  // 获取账户信息
  showAllAccount() {


    // 调用接口
    wx.request({
      url: api + "api/account?token=" + this.data.token,
      success: (res) => {
       
        console.log(res.data.data);
        let content = res.data.data;
        let i = 0;
        // 将名字和id存入
        var arr = [];
        var arr_id = [];
        for (i = 0; i < content.length; i++) {
          arr.push(content[i].name);
          arr_id.push(content[i].id);
        }
        this.setData({
          accountList: arr,
          idList:arr_id
        })
        // console.log(this.data.idList);
        // 获取acoountList的长度

        var num = this.data.accountList.length;
        this.setData({
          num: num,
        })
        // console.log("num值为" + this.data.num);
        // console.log(this.data.accountList[0]);
      }
    })
  },
  onShow: function () {
    this.onLoad();
    

  },
  onLoad(){
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
     this.showAllAccount();
      
    })
    
   
  }
  
 
})
