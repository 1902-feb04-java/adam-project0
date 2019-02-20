'use strict';

// Functions relating to working with dates, both obtaining them
// and comparing them to user results
let CURRENT_DATE = new Date();

//WINDOW_DATE is the day that stores hour data for schedules -- day doesn't matter
let setWithinDayTimeToZero = function(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
let WINDOW_DATE = setWithinDayTimeToZero(new Date(0));

let createSchedule = function(startDate, numDaysToAdd) {
    // for now let's create a schedule as an array with date objects,
    // one date object for each day, at 12 noon UTC I suppose.
    if (!(startDate instanceof Date)) {
        alert("startDate is not a Date object");
    };
    // if (typeof(numDaysToAdd) !== "number") {
    //     alert("numDaysToAdd is not type number");
    // };

    let schedule = [];
    let firstDay = new Date(startDate);
    firstDay.setUTCHours(12);
    firstDay.setUTCMinutes(0);
    firstDay.setUTCSeconds(0);
    firstDay.setUTCMilliseconds(0);
    schedule.push(firstDay);
 
    for (let i=1; i<=numDaysToAdd; i++) {
        let nextDay = new Date(firstDay);
        nextDay.setDate(nextDay.getDate() + i);
        schedule.push(nextDay);
    }

    return schedule;
}

let isSameDay = function(date1, date2) {
    if (date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()) {
            return true;
        } else {
            return false;
        }
};

let isInWindow = function(timeWindow, currentTime = new Date()) {
    let lowerTime = new Date(currentTime);
    lowerTime.setHours(timeWindow[0].getHours());
    lowerTime.setMinutes(timeWindow[0].getMinutes());
    lowerTime.setSeconds(timeWindow[0].getSeconds());
    let upperTime = new Date(currentTime);
    upperTime.setHours(timeWindow[1].getHours());
    upperTime.setMinutes(timeWindow[1].getMinutes());
    upperTime.setSeconds(timeWindow[1].getSeconds());

    if (lowerTime < currentTime && currentTime < upperTime) {
        return true;
    } else {
        return false;
    }
};

let getIndexOfDay = function(date, schedule) {
    // returns first index of a Date object in schedude on the same day
    // as date
    for (let i=0; i<schedule.length; i++) {
        if (isSameDay(date, schedule[i])) {return i;}
        };
    return -1;
};

let createTimeWindow = function(lowerHour, upperHour, base_date=WINDOW_DATE) {
    base_date = setWithinDayTimeToZero(base_date);
    let window = new Array(0);
    let lower = new Date(base_date);
    let upper = new Date(base_date);
    lower.setHours(lowerHour);
    upper.setHours(upperHour);
    window.push(lower);
    window.push(upper);
    return window;
}








// Functions relating to the storage and retrieval of user data
// for now, keep the single user data in local storage with key:
let USER_DATA_KEY = "userdata";

function Assessment(start_date, length_in_days, intervention_start_time,
                            intervention_end_time, assessment_start_time, assessment_end_time,
                            intervention_results, assessment_results, intervention_name,
                            assessment_name) {
    this.schedule = createSchedule(start_date, length_in_days);
    this.intervention_time_window = createTimeWindow(intervention_start_time,
                                                    intervention_end_time);
    this.assessment_time_window = createTimeWindow(assessment_start_time,
                                                    assessment_end_time);
    this.intervention_results = intervention_results;
    this.assessment_results = assessment_results;
    this.intervention_name = intervention_name;
    this.assessment_name = assessment_name;
    }

let DEMO_ASSESSMENT = new Assessment(new Date(2019,1,1,12,0,0,0), 13, 5, 9, 11, 2,
    [true, false, true, true, false, false, true, false, false, false, true, false, false, true],
    [0.9, 0.9, 0.96, 0.88, 0.96, 0.87, 0.9, 1, 0.9, 0.94, 0.95, 0.88, 0.9, 0.95],
    "breakfast", "SART")

let User = function(name, assessments) {
    this.name = name;
    this.assessments = assessments;
};

let createNewUserData = function() {
    let userData = new User(window.prompt("Username"), []);
    return setUserData(userData);
}

let getUserData = function() {
    let result = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    let user = result;
    if (user === null) return user;
    if (user.assessments.length === 0) return user;
    for (let i=0; i<user.assessments[0].schedule.length; i++) {
        user.assessments[0].schedule[i] = new Date(result.assessments[0].schedule[i]);
    };
    for (let i=0; i<user.assessments[0].intervention_time_window.length; i++) {
        user.assessments[0].intervention_time_window[i] = new Date(result.assessments[0].intervention_time_window[i]);
    };
    for (let i=0; i<user.assessments[0].assessment_time_window.length; i++) {
        user.assessments[0].assessment_time_window[i] = new Date(result.assessments[0].assessment_time_window[i]);
    };
    return user;
}

let setUserData = function(userData) {
    try {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}



// Functions relating to compliance tracking

let checkDate = function(userData) {
    let current_date = new Date();
    let index = getIndexOfDay(current_date, userData.assessments[0].schedule);
    if (index === -1) return [];
    let out = new Array();
    if (userData.assessments[0].assessment_results[index] === undefined) out.push("assessment");
    if (userData.assessments[0].intervention_results[index] === undefined) out.push("intervention");
    return out;
}

let checkSchedule = function() {
    let userData;
    try {
        userData = getUserData();
        userData.assessments[0].assessment_end_time;
    } catch (e) {
        console.log(e);
        return false;
    }

    let needed = checkDate(userData);
    console.log(needed);
    if (needed.length === 0) return false;

    let current_timestamp = new Date();

    if (needed.includes("intervention") && isInWindow(userData.assessments[0].intervention_time_window, current_timestamp)) {
        if (Math.random() > 0.5) {
            alert("According to your current assessment, you should do intervention : breakfast today!");
            userData.assessments[0].intervention_results.push(true);
        } else {
            alert("According to your current assessment, you should NOT do intervention : breakfast today!");
            userData.assessments[0].intervention_results.push(false);
        }
        setUserData(userData);
    }
    if (needed.includes("assessment") && isInWindow(userData.assessments[0].assessment_time_window, current_timestamp)) {   
        alert("It's time to run your assessment -- head over to the SART tab!");
    };

}

let checkSaveAssessment = function(a_result) {
    let userData;
    try {
        userData = getUserData();
        userData.assessments[0].assessment_end_time;
    } catch (e) {
        console.log(e);
        return false;
    }

    let needed = checkDate(userData);
    console.log(needed);
    if (needed.length === 0) return false;

    let current_timestamp = new Date();

    if (needed.includes("intervention") && isInWindow(userData.assessments[0].intervention_time_window, current_timestamp)) {
        if (Math.random() > 0.5) {
            alert("According to your current assessment, you should do intervention : breakfast today!");
            userData.assessments[0].intervention_results.push(true);
        } else {
            alert("According to your current assessment, you should NOT do intervention : breakfast today!");
            userData.assessments[0].intervention_results.push(false);
        }
        setUserData(userData);
    }
    if (needed.includes("assessment") && isInWindow(userData.assessments[0].assessment_time_window, current_timestamp)) {   
        userData.assessments[0].assessment_results.push(a_result);
        setUserData(userData);
    };

}




