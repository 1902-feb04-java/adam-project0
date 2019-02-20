'use strict';

document.addEventListener("DOMContentLoaded", () => {
    let scheduler = document.getElementById("scheduler");
    let userData = getUserData();
    if (userData === null) {
        alert("Creating new localStorage:userData");
        createNewUserData();
    }
    userData = getUserData();
    scheduler.addEventListener("submit", (e) => {
        let type_of_intervention = document.getElementById("interv").value;
        let type_of_assessment = document.getElementById("assessm").value;
        let length_in_days = document.getElementById("lendays").value;
        let I_start_hour = document.getElementById("Istart").value;
        let I_end_hour = document.getElementById("Iend").value;
        let A_start_hour = document.getElementById("Astart").value;
        let A_end_hour = document.getElementById("Aend").value;
        
        let a = new Assessment(new Date(), length_in_days, I_start_hour, I_end_hour, A_start_hour,
                A_end_hour, [], [], type_of_intervention, type_of_assessment);
        
        // if (result !== null) {
        //     localResults.push(result);
        // } else {
        //     alert("result was null!");
        // }


        userData.assessments.push(a);
        setUserData(userData);
        e.preventDefault();
    })
});
