//引入mitt
import mitt from "mitt";

//调用mitt,得到emitter，emitter能绑定事件，触发事件
const emitter = mitt()


// //绑定事件
// emitter.on('test1',()=>{
//     console.log('test1被调用了')
// })
// emitter.on('test2',()=>{
//     console.log('test2被调用了')
// })

// //每隔1s触发test1和test2事件
// setInterval(()=>{
//     emitter.emit('test1')
//     emitter.emit('test2')
// },1000)

// //5s后解绑test1
// setTimeout(()=>{
//     // emitter.off('test1')
//     //清空事件
//     emitter.all.clear()
// },5000)
//暴露emitter
export default emitter