
var app = getApp();

// 得到api
var api = app.globalData.api;

Page({
  data: {
    accountList: [],
    num: 0,
    idList: [],
    token: "",
    modalName:'',
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
  // 获取账簿列表
  getBookList() {
    this.showLoading();
    wx.request({
      url: api + 'api/book?token=' + this.data.token,
      success: (res) => {
        console.log(res.data);
        var bookListInfosList = []
        if (res.data.status) {
          bookListInfosList.push(res.data.data)
          this.setData({
            bookListInfosList: bookListInfosList
          })
          // console.log(this.data.bookListInfosList);
        } else {
          console.log(res);
          return
        }
        this.setData({
          showList: false
        })
        // console.log(this.data.bookListInfo)
      }
    })
  },
  // 查看book详情
  bookDetail(e){
    // console.log(e.target.dataset.id);
    var id = e.target.dataset.id;
    wx.request({
      url: api + 'api/book/detail?token=' + this.data.token,
      method:"POST",
      data:{
        book_id:id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.status) {
         this.setData({
           bookDetail: res.data.data
         })
        //  缓存
          wx.setStorageSync('bookSingle', this.data.bookDetail)
          wx.navigateTo({ url: "/pages/setSingleBook/setSingleBook", })
        //  console.log(this.data.bookDetail);
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
  },

  // 删除账簿
  delBook(e){
    console.log(api)
    console.log(this.data.token)
    console.log(e.target.dataset.id);
    var id = e.target.dataset.id;
    // 调方法
    wx.request({
      url: api+'api/book/delete?token='+this.data.token,
      method:"POST",
      data:{
        book_id:id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:(res)=>{
        if (res.data.status == true) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(()=>{
            this.onLoad();
          },1000)
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
        
      }
    })
  },
  // 删除账户
  delAccount(e) {
    // 需要获取账户id
    console.log(e.target.dataset.id);
    var id = e.target.dataset.id;
    // 调方法
    wx.request({
      url: api + "api/account/delete?id=" + id + "&token=" + this.data.token,
      success: (res) => {
        console.log(res.data);
        if (res.data.status == true) {
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
  // 跳转到新增账簿
  addBook(){
    wx.navigateTo({ url: "/pages/addBook/addBook", })
  },
  onShow: function () {
    this.onLoad();


  },
  onLoad() {
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
      this.getBookList();
      //  this.showAllAccount();
      //  
    })


  }


})
