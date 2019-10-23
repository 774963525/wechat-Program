const app = getApp()
var api = app.globalData.api;
Page({
  data: {
    num: 0,
    modalName: "",
    date:'',
    year:"",
    month:"",
    page_id:0,
    income:'0',
    income1:'.00',
    pay:"0",
    point:'.',
    pay1:".00",
    accountList:[],
    idList:[],
    choose:0,
    showList:[],
    token:'',
    bookIdList:[]

  },
  goLogin(){
    wx.navigateTo({ url: '/pages/goLogin/goLogin', })
  },

  onLoad: function (options) {
    // 获取token
    app.getToken((token)=>{
      this.setData({
        token :token,
      })
      if(this.data.token==null){
        return
      }
      // 调方法 获取账户
      this.getAccountList();

      this.getIndexData();
      
      

    }) 
    // swiper设置高度
    var that = this;
    that.setData({
      navH: app.globalData.navHeight
    })
    // 获取时间
    this.getDate();
    // 显示账单记录
    this.showTransactionRecord();
  },
  // 首页数据接口
  getIndexData(){
    wx.request({
      url: api + "api/view/home?token=" + this.data.token,
      success: (res) => {
        // console.log(res.data);
        var year = res.data.data.account.month.split("-")[0]
        var month = res.data.data.account.month.split("-")[1]
        var income = res.data.data.account.in.split(".")[0]
        var income1 = res.data.data.account.in.split(".")[1]
        var pay = res.data.data.account.out.split(".")[0]
        var pay1 = res.data.data.account.out.split(".")[1]
        this.setData({
          month: month,
          year: year,
          income: income,
          income1: income1,
          pay: pay,
          pay1: pay1,

        });
      
      }
    })
  },
  onShow:function(){
    this.onLoad();
    // console.log("onshow走到");
  },
  // 返回上一页
  navBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  navHome: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  // 时间方法
  time(t) {
    if (t < 10) {
      return "0" + t;
    } else {
      return t;
    }
  },
  getDate(){
    // 创建日期 例如 "2016-10-13" date 
    var d = new Date();
    var year = d.getFullYear();
    var month = this.time(d.getMonth() + 1);
    var day = this.time(d.getDate());
    var hour = this.time(d.getHours());
    var minute = this.time(d.getMinutes());
    var second = this.time(d.getSeconds());
    this.setData({
      year: year,
      month:month
    })
  },
  // 点击获取账户信息并弹窗
  showModal(e) {
    this.getAccountList();
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 获取账户列表
  getAccountList(){
    // 调用接口
    wx.request({
      url: api + "api/account?token=" + this.data.token,
      success: (res) => {
        console.log(res.data.data);
        let content = res.data.data;
        let i = 0;
        var arr = [];
        var arr_id = [];
        var arr_bookId = [];
   
        for (i = 0; i < content.length; i++) {
          arr.push(content[i].name);
          arr_id.push(content[i].id);
          
        }
        this.setData({
          accountList: arr,
          idList: arr_id,
          id: content[0].id
       
        })
        console.log("-------------------")
        console.log(this.data.id)
        // onLOAD里获取默认id以后发送给显示页面 
        this.showTransactionRecord(this.data.id);
        // 获取acoountList的长度
        var num = this.data.accountList.length;
        this.setData({
          num: num,
        })

      }
    })
    
  },
  // 隐藏弹窗
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 页面跳转
  goAccountSetting(){
    wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })
    console.log(0);
  },
  // 
  goPrivateAccount(){
    console.log(1);
    wx.navigateTo({ url: '/pages/privateAccount/privateAccount', })
    
    
  },
  goCalendar() {
    console.log("2");

    wx.navigateTo({ url: "/pages/calendar/calendar", })

  },
  goTable1() {
    wx.navigateTo({ url: '/pages/picTable/picTable', })
    console.log(3);
  },
  goTable2() {
   
    wx.navigateTo({ url: "/pages/table2/table2", })
    console.log(4);
  },
  goTable3() {
   
    console.log(5);
  },
 
  // 时间切换
  bindDateChange: function (e) {
    
    var time = e.detail.value;
    var year =time.split("-")[0];
    var month = time.split("-")[1];
   
    this.setData({
      // date: e.detail.value
      year:year,
      month:month,
    })
    console.log(this.data.year + "-" + this.data.month)
    this.showTransactionRecord();
    
    // this.onLoad();
  },
  // 跳转界面
  goIndex() {
    console.log(1);
    this.setData({
      pageNum:1
    })
  },
  goTable() {
    this.data.page_id = 1;
    wx.navigateTo({ url: "/pages/index/index", })
    
  },
  goTop() {
    console.log(3);
    this.setData({
      pageNum: 3
    })
  },
  // 点击侧边栏选项切换账本且变色
  // 默认id为0
  getAccountId(e){
    console.log(e);
    // console.log(e.currentTarget.dataset.id);
    // console.log(e.currentTarget.dataset.choose);
    this.setData({
      id: e.currentTarget.dataset.id,
      choose: e.currentTarget.dataset.choose
    })


    // 将账户id存入缓存
    var accountId ={
      id:this.data.id
    }
    
    
    this.showTransactionRecord();
    wx.setStorageSync('accountId', accountId);
    // console.log(wx.getStorageSync('accountId'))
  },
  // 获得单条详情
  getSingle(e){
    // record_id
    console.log("id为")
    var id = e.currentTarget.dataset.choose2;
    console.log(id);
    let token = app.globalData.token
    console.log(token)
    wx.request({
      url: api + 'api/record/detail?id=' + id + '&token=' + this.data.token,
      success:(res)=>{

        console.log(res.data.data)
        
        var singleDetail = res.data.data;
          
        // wx.setStorageSync('bookId', this.data.bookIdList);
        // console.log("缓存里的是")
        // console.log(this.data.bookIdList);

        // 存缓存
        wx.setStorageSync('singleDetail', singleDetail);
        wx.navigateTo({ url: "/pages/setSingleRecord/setSingleRecord", })
      }
    })

  },
  // 获取交易记录
  showTransactionRecord(){
    var day = "01"
    var day2 = "31"
    wx.request({
      url: api + 'api/record/real?token=' + this.data.token,
      method: "POST",
      data: {
        // 开始时间
        begin_date: this.data.year + "-" + this.data.month + '-' + day,
        // 结束时间
        end_date: this.data.year + "-" + this.data.month + '-' + day2,
        // 缓存里拿
        account_id:this.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
       
        console.log(res)
        if(res.data.status == true){
         
          console.log(res.data.data.list);
       
          this.setData({
            showList: res.data.data.list
          })
          console.log(this.data.showList);
        }
      }
    })
  }
 
  
})
