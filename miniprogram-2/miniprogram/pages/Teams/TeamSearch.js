// miniprogram/pages/Teams/TeamSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teams:[],
    iden:String,
    nameen:String,
    gameen:String

  },

  /**
   * 生命周期函数--监听页面加载
   */

    onLoad: function(options) {
      const db = wx.cloud.database()
      db.collection("teams").get({
        success: res => {
          this.setData({
            teamTosearch: res.data
          })
        },
        fail: err => {
          wx.showToast({
            icon: "none",
            title: '查询记录失败',
          })
        }
      })
    },
  
    onSearch:async function(e){


    },
comfirmid: function(e) {
      const db = wx.cloud.database() //打开数据库连接
      let tid

      tid = e.detail.value.iden
      console.log(tid)
      db.collection("teams").where({
        teamId:tid
       
      }).get({
        success:res=>{
          console.log(tid)
          console.log(res)
          this.setData({
            teams: res.data
          })
          console.log(this.data.teams)
        }

      })

    },
    comfirmGame: function(e) {
      const db = wx.cloud.database() //打开数据库连接
      let tgame

      tgame = e.detail.value.gameen
      console.log(tgame)
      db.collection("teams").where({
        game:tgame
       
      }).get({
        success:res=>{
          console.log(tgame)
          console.log(res)
          this.setData({
            teams: res.data
          })
          console.log(this.data.teams)
        }

      })

    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onJoin: function(e){
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    var a=null
    var userinfo=null
    var name
    var myname=null
    
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                info: res.userInfo
              })
              myname=res.userInfo.nickName
            }
          })
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      complete: res1 => {
        console.log(res1.result)
        userinfo=res1.result.openid
        console.log(id)
        console.log('callFunction test result: ', userinfo)
        
        db.collection("teams").doc(id).get({
          success:res2=>{
            var flag = false
            console.log("进入判断之前")

            console.log(res2)
            console.log(flag)
            console.log("1")
            
            a=res2.data.teamMates
            console.log(a.length)
            name=res2.data.MateName           
           
            console.log(a)
            console.log(name)
            console.log(userinfo)
            
            
            for (var i=0;i<a.length;i++){
              console.log("判断环境")
              
              if(a[i] === userinfo)
                {console.log("判断重复")
                  flag=true
                  console.log(flag)
                  break
                }
                

            }
            console.log(myname)
            name.push(myname)
            a.push(userinfo)
            console.log(a)
            if(flag ===false){//到云函数调用
              wx.showToast({
                title: '入队成功',
              })
              wx.cloud.callFunction({
                name:'add',
                data:{
                  docid:id,
                  data1:a,
                  data2:name
                },success:function(res){
                  console.log(res)
                },fail:function(res){
                  console.log(res)
                }
              })
              this.onLoad()
            // db.collection("teams").doc(id).update({
            //   data: {
            //    teamMates:a,
            //    MateName:name
            //   },
            //   success: res => {
            //     wx.showToast({
            //       title: '入队成功',
            //     })
                
            //   },
            //   fail: err => {
            //     wx.showToast({
            //       title: '修改失败',
            //     })
            //   }
            // })
          }
            else if(flag===true){
              wx.showModal({
                title: '你已经在队内了,入队失败',
              })

            }
          }
          
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
  swiperTab: function (e) {

    this.setData({
        currentTab: e.detail.current,
        teams:[]
    }); 
},

//点击切换
clickTab: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
        return false;
    } else {
        this.setData({
            currentTab: e.target.dataset.current,
            teams:[]
            
        })
    }
}
})