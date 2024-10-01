var c, ctx;
var school_info;
var viewing;

window.onload = async () => {
    //fetch school info (start_time, end_time, rooms, etc..)
    const res = await fetch(window.location.origin + "/fetch_info")
    school_info = await res.json();

    //init schedule canvas
    c = document.querySelector('.schedule-canvas');
    ctx = c.getContext('2d');
    c.width = window.innerWidth - 84;
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
}