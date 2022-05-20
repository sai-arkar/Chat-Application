const moment = require("moment");

function getTime(){
     console.log(moment().format("h:mm:ss A"));
}

setInterval(() => {
     getTime()
}, 2000);















// const conversation = [
//      { senderId: 's1', receiverId: 'r1' },
//      { senderId: "s1", receiverId: "r2" },
//      { senderId: "r1", receiverId: "s2" },
//      { senderId: "r2", receiverId: "s2" }
// ];
// let newSenderId = "r1";
// let newReceiverId = "s1";

// const result = conversation.find( (conv) => (newSenderId === conv.senderId || newSenderId === conv.receiverId) && (newReceiverId === conv.senderId || newReceiverId ===  conv.receiverId) );

// console.log(result);

// if(result === undefined){
//   conversation.push({senderId: newSenderId, receiverId: newReceiverId});
// }
// console.log(conversation);



// // sender s1, s2, s3
// let conversation = [
//      { senderId: 's1', receiverId: 'r1' },
//      { senderId: "s1", receiverId: "r2" },
//      { senderId: "r1", receiverId: "s2" },
//      { senderId: "r2", receiverId: "s2" }
// ];
// let newSenderId = "s1";
// let newReceiverId = "r1";

// let result = conversation.find((conv)=>{ conv.senderId == 's1'});

// console.log(result);



// // const inventory = [
// //   {name: 's1', quantity: 2},
// //   {name: 's2', quantity: 0},
// //   {name: 's3', quantity: 5}
// // ];

// // const result = inventory.find( (result) => result.name === 's1' );

// // console.log(result) // { name: 'cherries', quantity: 5 }
