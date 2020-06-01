// miniprogram/pages/Teams.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teams: [],
    users: [],
    info:null,
    avatarUrl:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var name
    const db = wx.cloud.database()
    
    db.collection("teams").get({
      success: res => {
        this.setData({
          teams: res.data
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
  goSet: function() {
    wx.navigateTo({
      url: '../Teams/set',
    })

  },
  onDel: function(e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database();
    db.collection("teams").doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onLoad() //删除成功重新加载
      },
      fail: err => {
        wx.showToast({
          title: '删除失败',
        })
      }
    })
    console.log(id)
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
              wx.showToast({
                title: '你已经在队内了,入队失败',
              })

            }
          }
          
        })
      }
    })
    
    
    

  },
  goget: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'add',
      // 传给云函数的参数
      
      success: function(res) {
        console.log(res) // 3
      },
      fail: console.error
    })

  },
  onUpdate: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Teams/set?id=' + id,
    })
  }
})