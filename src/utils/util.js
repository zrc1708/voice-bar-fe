Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
}

class readings {
    constructor(){
        this.date = new Date().Format("yyyy-MM-dd")
        this.map = new Map()
    }
    add(id){
        this.date = new Date().Format("yyyy-MM-dd")
        // console.log(id);

        // console.log(this.map.get(id));

        console.log(this.map.get(id));
            console.log(this.date);
            console.log(new Date().Format("yyyy-MM-dd"));

        if(this.map.get(id)==undefined){
            // 没阅读过
            // console.log(this.map.get(id));
            console.log('阅读+');
            this.map.set(id,this.date)
        }else if(this.map.get(id) !== this.date){
            // console.log(this.map.get(id));
            // console.log(this.date);
            console.log('阅读++');
            this.map.set(id,this.date)
        }else{
            console.log('不能');
            return
        }
    }
    clear(){
        this.map = new Map()
    }
}

let reading = new readings()

export default reading