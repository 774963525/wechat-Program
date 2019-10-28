var app = getApp();
var api = app.globalData.api;
// 图片key数组
var keyList = [];

Page({
  data: {
    // tab选择
    TabCur: 0,
    choose:-1,
    scrollLeft: 0,
    NavCur: 0,
    text: [
      "收入", "支出"
    ],
    tabName: [
      ["cuIcon-profile", "餐饮"], ["cuIcon-profile", "日用"], ["cuIcon-profile", "交通"], ["cuIcon-profile", "购物"]],
    tabId: [],
    num: 0,
    num2: 0,
    picker:[],
    date: '2018-12-25',
    //----------------------------------------
    total_money:0,
    money:0,
    account_id:"",
    category_id:0,
    company_name:"",
    remark:"",
    image_keys:[],
    // 图片列表
    imgList: [],
    modalName: '',
    // 文件key
    keyList:[],
    showLoading: false
  },
  back() {
    // 返回失效?
    // wx.navigateTo({ url: '/pages/index/index', })

    // // 返回上一层
    // console.log(1)
    // console.log(getCurrentPages())


    wx.navigateBack({
      delta: 0
    })
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
  // tab的不同 查不同的数据
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
    this.showSelectTab()
    

  },
  // 显示选择的tab
  showSelectTab(){
    var type = this.data.TabCur + 1

    wx.request({
      url: api + 'api/category?token=' + this.data.token,
      method: "POST",
      data: {
        type: type,
        dataType: 1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        var arr = res.data.data
        var arr_id = [];
        var arr_name = [];
        for (var i = 0; i < arr.length; i++) {
          arr_id.push(arr[i].id);
          arr_name.push(arr[i].name)

        }
        console.log(arr_id);
        console.log(arr_name);
        this.setData({
          tabName: arr_name,
          tabId: arr_id
        })

      }
    })
  },
  navSelect(e) {
    this.setData({
      NavCur: e.currentTarget.dataset.id,

      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
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
  // 选择类型
  chooseType(e){
    // console.log(e.currentTarget.dataset.choose);
    this.setData({
      choose: e.currentTarget.dataset.choose
    })
    console.log("类型:"+this.data.TabCur+"  0是支出,1是收入")
    console.log(this.data.choose);

  },// 显示弹框
  showModal(e) {
    // 查看可以选择的所有账户
    this.showAllAccount();
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 获取账户信息
  showAllAccount() {
    // 调用接口
    wx.request({
      url: api + "api/account?token=" + this.data.token,
      success: (res) => {

        console.log(res.data.data);
        let accountList = []
        let accountNameList = [];
        accountList.push(res.data.data);
        console.log(accountList[0]) 
        for (var i = 0; i < accountList[0].length;i++){
          accountNameList.push(accountList[0][i].name)
        }
        console.log(accountNameList)
        this.setData({
          picker: accountNameList,
          accountList:accountList[0]
        })
        // console.log(this.data.accountList)

        // var num = this.data.accountList.length;
        // this.setData({
        //   num: num,
        // })

      }
    })
  },
  // 隐藏弹框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res)
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
        // console.log(res.tempFilePaths[0])

        // console.log(api);
        // console.log(token)
        wx.uploadFile({
          url: api + 'api/upload/image?token=' + this.data.token,
          filePath: picUrl,
          name: 'file',
          header: {
            "Content-Type":"multipart/form-data"
          },
          formData:null,
          success:(res)=>{
            var keyS = JSON.parse(res.data)
            var key = keyS.data.file.fileKey
            

            // 推入数组
            keyList.push(key);
            console.log(keyList)
            this.setData({
              keyList: keyList
            })
          }
          
        })
      }
    })
  },
  // 删除图片
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.keyList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            keyList: this.data.keyList
          })
        }
      }
    })
  },
  // 显示大图
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 记账金额 total_money
  total_money(e) {
    this.setData({
      total_money: e.detail.value.trim()
    })
   
  },
  // 实付 money
  money(e) {
    this.setData({
      money: e.detail.value.trim()
    }) 
  },
  // 交易对象 company_name
  company_name(e) {
    this.setData({
      company_name: e.detail.value.trim()
    })
  },
  // 备注 company_name
  remark(e) {
    this.setData({
      remark: e.detail.value.trim()
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
  // 选择器选择
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
    // 获取账户选择的下标 index
  },
  // 时间变化
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 添加交易记录
  addRecord(){
    
    // 记账金额 total_money
    console.log("记账金额"+this.data.total_money);
    // 实付 money
    console.log("金额" + this.data.money);
    // 帐户id account_id 全局中
    // console.log("账户id")
    // console.log(this.data.accountList[this.data.index].id);
    // 类别id category_id
    console.log("类别id")
    console.log(this.data.tabId[[this.data.choose]]);
    // 日期 date
    // console.log(this.data.date);
    // 交易对象 company_name
    // console.log("交易对象" + this.data.company_name);
    // 备注 remark
    // console.log("备注" + this.data.remark);
    // 图片key,如果有多个,用逗号分隔 (使用图片上传接口得到key) 允许为空 image_keys
    // console.log("key列表值为")
    // console.log(this.data.keyList)  

    if (this.data.index == undefined){
      wx.showModal({
        title: '错误',
        content: "请选择账户",
      })
      return
    } else if (this.data.total_money==0){
      wx.showModal({
        title: '错误',
        content: "记账金额不能为空",
      })
      return
    } else if (this.data.money==0){
      wx.showModal({
        title: '错误',
        content: "实付金额不能为空",
      })
      return
    }
    else{
    // 记账
      this.showLoading();
      wx.request({
        url: api + 'api/record/create?token=' + this.data.token,
        method: "POST",
        data: {
          total_money: this.data.total_money,
          // 实际
          money: this.data.money,
          // 账户id
          account_id: this.data.accountList[this.data.index].id,
          category_id: this.data.tabId[this.data.choose],
          date:this.data.date,
          company_name: this.data.company_name,
          remark: this.data.remark,
          image_keys: this.data.keyList
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          // console.log(res.data);
          if(res.data.status==true){
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
            })
            this.hideModal();
          }else{
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
  },



  // 页面加载默认界面
  onLoad() {
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
      if(token == null||token ==''){
        wx.navigateTo({ url: '/pages/goLogin/goLogin', })
        return 
      }
      this.showSelectTab()  
      
      
    })
    // 创建日期 例如 "2016-10-13" date 
    var d = new Date();
    var year = d.getFullYear();
    var month = this.time(d.getMonth() + 1);
    var day = this.time(d.getDate());
    var hour = this.time(d.getHours());
    var minute = this.time(d.getMinutes());
    var second = this.time(d.getSeconds());
    this.setData({
      date: year + "-" + month + "-" + day
    })
   
    // 获取
   

    
  }

})