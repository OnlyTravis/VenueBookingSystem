var c, ctx;
var school_info;
var viewing;

const main = async () => {
    //fetch school info (start_time, end_time, rooms, etc..)
    const res = await fetch(window.location.origin + "/fetch_info")
    school_info = await res.json();

    //init schedule canvas
    c = document.querySelector('.schedule-canvas');
    ctx = c.getContext('2d');
    c.width = window.innerWidth*0.8 - 40;
    c.height = 50+school_info.rooms.length*60;

    //set numeric form of school times
    school_info.school_open_num = timeToNumber(school_info.school_open)
    school_info.school_close_num = timeToNumber(school_info.school_close)

    //draw schedule
    viewing = new Date();
    drawScheduleBG();
    updateRecordDisplay(viewing);

    //change viewing date
    document.querySelector('.schedule-date-yesterday').onclick = () => {
        viewing.setDate(viewing.getDate()-1);
        updateRecordDisplay(viewing);
    }
    document.querySelector('.schedule-date-tomorrow').onclick = () => {
        viewing.setDate(viewing.getDate()+1);
        updateRecordDisplay(viewing);
    }

    //set default input value, range
    const date_input = document.querySelector('.date-input')
    date_input.valueAsDate = new Date();
    document.querySelector('.form .from-time').min = school_info.school_open;
    document.querySelector('.form .from-time').max = school_info.school_close;
    document.querySelector('.form .to-time').min = school_info.school_open;
    document.querySelector('.form .to-time').max = school_info.school_close;
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

function validateForm() {
    const from_time = timeToNumber(document.querySelector('.from_time').value);
    const to_time = timeToNumber(document.querySelector('.to_time').value);
    if (from_time > to_time) {
        alert("Please Enter a valid time.")
        return false;
    }

    return confirm("Are you sure you want to submit this request?\n(Student's request requires teacher's confirmation)");
}

main();