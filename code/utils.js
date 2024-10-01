module.exports = {
    timeToNumber: (time) => {
        const temp = time.split(":");
        var number = 0;
        for (let i = 0; i < 2; i++) {//first: hour, second: minutes
            if (temp[i][0] === "0") {
                number += (i === 0)?JSON.parse(temp[i][1])*60:JSON.parse(temp[i][1]);
            } else {
                number += (i === 0)?JSON.parse(temp[i])*60:JSON.parse(temp[i]);
            }
        }
        return number;
    },
    timeToString: (time) => {
        return `${`${Math.floor(time/60)}`.length == 1?`0${Math.floor(time/60)}`:Math.floor(time/60)}:${(`${time%60}`.length == 1)?`0${time%60}`:time%60}`;
    },    
    stringToNumber: (string) => {
        var num = -1;
        try {
            num = JSON.parse(string);
        } catch {

        }
        return num;
    }
}