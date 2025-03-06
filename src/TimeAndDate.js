const getFormattedDate = () =>{
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length> 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day: "0" + day

    return month + "/" + day + "/" + year
}

const getFormattedTime = () =>{
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();

    const time = today.getHours() + ":" + minutes


    return time
}

export const time = getFormattedTime()

export const todayDate = getFormattedDate(); 