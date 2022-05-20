const moment = require("moment");

exports.getTime = ()=>{
     return (moment().format("h:mm:ss A"));
}