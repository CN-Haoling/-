// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var docid = event.docid
  var vdata1 = event.data1
  var vdata2 = event.data2
  try {
    return await db.collection('teams').doc(docid).update({
         data: {
     teamMates:vdata1,
     MateName:vdata2
    },
    })
  } catch (e) {
    console.log(e)
  }
}
//db.collection("teams").doc(id).update({
  //   data: {
  //    teamMates:a,
  //    MateName:name
  //   },
  //   success: res => {
  //     wx.showToast({
  //       title: '入队成功',
  //     })