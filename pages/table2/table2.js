Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    NavCur: 0,
    data: [
      "日", "月", "年"
    ],
    title:[
      "支出","收入","收支"
    ]
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,

      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  navSelect(e) {
    this.setData({
      NavCur: e.currentTarget.dataset.id,

      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
})