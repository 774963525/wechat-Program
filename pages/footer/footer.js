Component({

  

  properties: {
    pageId: Number
  },
  data: {
    behaviors: [],
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { },
  moved: function () { },
  detached: function () { },

  methods: {
    getToken(){
      app.getToken((token) => {
        this.setData({
          token: token,
        })
        if (this.data.token == null) {
          this.setData({
            status:false
          })
        }else{
          this.setData({
            status: true
          })
        }
        
      }) 
    }
  }

})
