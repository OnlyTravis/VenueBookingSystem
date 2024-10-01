async function updateRecordDisplay(date) {
    //fetch records
    const records = await getRecords(date);
    console.log(records)

    //delete all existing records display to update
    const schedule_container = document.querySelector('.records-container');
    schedule_container.innerHTML = '';

    //display new records
    records.forEach((record) => {
        const div = generateRecordElement(record);
        schedule_container?.appendChild(div);
    });

    //update schedule date display 
    document.querySelector('.schedule-date').innerText = date.toDateString();
}

const generateRecordElement = (record) => {
    const record_ele = document.createElement('a');
    record_ele.setAttribute('href', `${window.location.origin}/view_booking/${record.record_id}`);
    record_ele.classList.add("record");

    record_ele.setAttribute('style', `
        top: ${50 + school_info.rooms.findIndex((room) => room === record.room)*60}px;
        left: ${(record.from_time - school_info.school_open_num) / (school_info.school_close_num - school_info.school_open_num) * (c.width - 120) + 70}px; 
        width: ${(record.to_time - record.from_time) / (school_info.school_close_num - school_info.school_open_num) * (c.width - 120) - 4}px;`
    );

    const tooltip = document.createElement('div');
    tooltip.classList.add("tooltip")

    const title = document.createElement('span');
    title.classList.add('tooltip-title');
    title.innerText = record.title;
    const author = document.createElement('span');
    author.classList.add('tooltip-author');
    author.innerText = `booked by: ${record.author} | From ${timeToString(record.from_time)} to ${timeToString(record.to_time)}`;

    tooltip.append(title);
    tooltip.append(document.createElement('br'));
    tooltip.append("(Click to see more)")
    tooltip.append(document.createElement('br'));
    tooltip.append(author);

    record_ele.appendChild(tooltip);

    return record_ele;
}

async function getRecords(date) {
    return new Promise(async (res, rej) => {
        const response = await fetch(window.location.origin + `/fetch_records?date=${date.toDateString()}`);
        const records = await response.json();
        res(records);
    })
}

function dateToString(date) {
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
}

function timeToNumber(time) {
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
}

function timeToString(time) {
    return `${`${Math.floor(time/60)}`.length == 1?`0${Math.floor(time/60)}`:Math.floor(time/60)}:${(`${time%60}`.length == 1)?`0${time%60}`:time%60}`;
}

function drawScheduleBG() {
    ctx.font = "20px serif";
    ctx.drawLine = (x1, y1, x2, y2) => {
        ctx.beginPath()
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    ctx.drawTimeLine = (time) => {
        const x = ((time - school_info.school_open_num) / (school_info.school_close_num - school_info.school_open_num)) * (c.width - 120) + 70;
        ctx.drawLine(x, 50, x, c.height);
        ctx.textAlign = "center";
        ctx.fillText(timeToString(time), x, 30);
    }

    //Rooms vertical line
    ctx.strokeStyle = "#000000"
    ctx.drawLine(0, 50, c.width, 50);

    //Draw rooms
    ctx.textAlign = "center";
    ctx.strokeStyle = "#777777"
    school_info.rooms.forEach((room, i) => {
        ctx.fillText(room, 35, 50+60*i + 35);
        ctx.drawLine(0, 50+60*i, c.width, 50+60*i)
    })

    //Draw all background lines
    const start_time = Math.ceil(school_info.school_open_num/30)*30;
    const end_time = Math.floor(school_info.school_close_num/30)*30;

    for (let time = start_time; time <= end_time; time += 30) {
        ctx.strokeStyle = "#777777"
        ctx.drawTimeLine(time);
    }
}