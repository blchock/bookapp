import Vue from 'vue';
let Com = {};
/**
* 
* blob二进制 to base64
**/
Com.blobToDataURI = (blob, callback) => {
  var reader = new FileReader();
  reader.onload = function (e) {
      callback(e.target.result);
  }
  reader.readAsDataURL(blob);
}

/**
  * base64  to blob二进制
  */
Com.dataURItoBlob = (dataURI) => {
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
  var byteString = atob(dataURI.split(',')[1]); //base64 解码
  var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  var intArray = new Uint8Array(arrayBuffer); //创建视图

  for (var i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], {type: mimeString});
}

// 格式化时间 用法: this.Com.fmtDate("yyyy-MM-dd hh:mm:ss",time,"server"); "yyyy年MM月dd日(hh时mm分ss秒) 第q季度"
Com.fmtDate = (fmt, time, timeType) => {
  if(time === undefined) return "";
  let date = time; // ，默认是js的Date对象
  if(timeType === "server") { // 2018-12-13T00:00:00
      date = {
          getFullYear : () => time.slice(0,4),
          getMonth : () => time.slice(5,7) - 1,
          getDate : () => time.slice(8,10),
          getHours : () => time.slice(11,13),
          getMinutes : () => time.slice(14,16),
          getSeconds : () => time.slice(17,19),
          getMilliseconds : () => 0 // 服务器未提供
      }
  } else if(timeType === "timestamp") {
      date = new Date(time);
  }
  let o = {
      "M+" : date.getMonth()+1,                 //月份   
      "d+" : date.getDate(),                    //日   
      "h+" : date.getHours(),                   //小时   
      "m+" : date.getMinutes(),                 //分   
      "s+" : date.getSeconds(),                 //秒   
      "q+" : Math.floor((date.getMonth()+3)/3), //季度   
      "S"  : date.getMilliseconds()             //毫秒   
  };
  if(/(y+)/.test(fmt))   
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));   
  for(var k in o)   
  if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;
}

Com.getFileName = (text) => {
  var pattern = /\.{1}[a-z]{1,}$/;
  if (pattern.exec(text) !== null) {
      return (text.slice(0, pattern.exec(text).index));
  } else {
      return text;
  }
}

Vue.prototype.Com = Com;
export default Com;

