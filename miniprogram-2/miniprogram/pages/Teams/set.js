// miniprogram/pages/Teams/set.js


  /**
   * 生命周期函数--监听页面加载
   */
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      team: [],
      selectArray: [{
        "id": "10",
        "text": "Dota2"
    }, {
        "id": "21",
        "text": "CSGO"
    },{
      "id": "30",
      "text": "英雄联盟"
  },{
    "id": "41",
    "text": "王者荣耀"
}
  ],
     gname: String,
     userid: String,
     info:null,
     
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      if (options.id) {
        const db = wx.cloud.database();
        db.collection("teams").where({
          _id: options.id
        }).get({
          success: res => {
            this.setData({
              team: res.data[0] //返回的是一个数组，取第一个
            })
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    },
    comfirm: function(e) {
      const db = wx.cloud.database() //打开数据库连接
      let team = e.detail.value
      
      console.log(e.detail)
      console.log("开始comfirm")
      if (team.id == "") { //id等于空是新增数据
        console.log("开始add")
        var myname
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
                  console.log(res.userInfo)
                }
              })
            }
          
        
        db.collection("teams").get ({
          success: res1=>{
            var isUsed= false;
            let teamdata = res1.data;
            console.log("调试data")
            console.log(teamdata.length)
            console.log(teamdata)
            console.log("调试")
            console.log(team.iden)
            for(var i=0;i<teamdata.length;i++){
              console.log("for")
              console.log(teamdata[i].teamId)
              console.log(team.iden)
              if(teamdata[i].teamId===team.iden){
                isUsed=true
                console.log(isUsed)
                break
              }
            }
            if(isUsed===false)
            { this.add(db, team) 
            
  
          }
          else{
            wx.showToast({
              title: 'id被占用',
              icon: 'loading',
              duration: 2000
            })


            

          }
        }
  
       })
      }
       })

       
      } else {
        this.update(db, team) //修改记录
      }
    },
 
     add:async function(db, team) {
     var flag=this.isused

     
     
     console.log("add数据库")
    
      db.collection("teams").add(
        {
        
        data: {
          name: team.name,
          game: this.gname,
          teamId: team.iden,
          teamMates: [],
          MateName:[],
        },
        
        success: res => {
          console.log("新增记录成功")
          wx.showToast({
            title: '新增记录成功',
          })
          wx.navigateTo({
            url: '../Teams/Teams',
          })
          
        },
        fail: err => {
          wx.showToast({
            title: '新增失败',
            icon: 'fail',
          })
        }
      })
    
    },
    update: function(db, team) {
      db.collection("teams").doc(team.id).update({
        data: {
          name: team.name,
          game: team.game,
          teamId: team.iden,
        },
        success: res => {
          wx.showToast({
            title: '修改记录成功',
          })
          wx.navigateTo({
            url: '../Teams/Teams',
          })
        },
        fail: err => {
          wx.showToast({
            title: '修改失败',
          })
        }
      })
    },
   
    getDate:function(e){
      var a = e.detail.text
      console.log(a)
      this.gname=a
  }
  
  })