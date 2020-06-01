// miniprogram/pages/Teams/myTeam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
teams:[],
myteam:[],
myId: String
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    var isHave=false
    const db = wx.cloud.database()
    await db.collection("teams").get({
      success: res => {
        console.log(res)
        this.setData({
          teams: res.data
        
        })
        var teamdata=res.data
        console.log(res.data)
        
        wx.cloud.callFunction({
          name: 'login',
          complete: res1 =>{
            var myid=res1.result.openid
            var own=[]
            this.setData({
              myId: myid
            
            })
            console.log(myid)
            for(let i=0;i<teamdata.length;i++){
              for(let j=0;j<teamdata[i].teamMates.length;j++)
              if(myid==teamdata[i].teamMates[j]){
                console.log("wd")
                own.push(teamdata[i])
               this.setData({
                 myteam:own


               })
              }

            }
        
        
      
      }})
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '查询记录失败',
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onExit :function(e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    db.collection("teams").doc(id).get({
      success: res => {
        console.log(res)
        console.log(this.data.myId)
        var myid=this.data.myId
        for(let i=0;i<res.data.teamMates.length;i++){
            if(myid== res.data.teamMates[i]){
              var arraymates = res.data.teamMates
              var arrayname =res.data.MateName
              console.log(arrayname)
              arrayname.splice(i,1)
              arraymates.splice(i,1)
              console.log(arrayname)
              wx.cloud.callFunction({
                name:'add',
                data:{
                  docid:id,
                  data1:arraymates,
                  data2:arrayname
                },success:function(res){
                  console.log(res)
                  wx.showToast({
                    title: '离队成功',
                  })
                  
                },fail:function(res){
                  console.log(res)
                }
              })
              
            }

        }
        this.onLoad() //删除成功重新加载
      },
      fail: err => {
        wx.showToast({
          title: '删除失败',
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})