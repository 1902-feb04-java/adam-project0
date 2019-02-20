'use strict';

// get skeleton results from assessment
// document.addEventListener("DOMContentLoaded", () => {
//     let assessment = document.getElementById("assessment");
//     let userData = getUserData();
//     if (userData === null) {
//         alert("Creating new localStorage:userData");
//         createNewUserData();
//         let userData = getUserData();
//     } 
//     assessment.addEventListener("submit", (e) => {
//         let result = document.getElementById("assessment-result").value;
        
//         // if (result !== null) {
//         //     localResults.push(result);
//         // } else {
//         //     alert("result was null!");
//         // }

//         //testing
//         userData.assessment_results.push(result);
//         setUserData(userData);
//         e.preventDefault();
//     })
// });

//  SART!  Using d3.js for animations
let produceSARTSequence = function(len=260, nogo_total=18) {
    let nogo_char = "3";
    let go_chars = ["0","1","2","4","5","6","7","8","9"];
    
    // this solution doesn't produce sequences uniformly randomly, but it's quick.
    // produce a full sequence of go characters first.
    let outputChars = new Array();
    for (let i=0;i<len;i++) {
        outputChars.push(go_chars[Math.floor(Math.random()*(go_chars.length))])
    }
    // then pick positions for the 3s, dropping all positions nearby as future options
    let nogoPositions = new Array();
    for (let i=0;i<len;i++) {nogoPositions.push(i)};
    for (let i=0;i<nogo_total;i++) {
        let index = Math.floor(Math.random()*(nogoPositions.length));
        let position = nogoPositions[index];
        outputChars[position] = "3";
        nogoPositions.splice(Math.max(0, index-3), 7);
    }

    // now font sizes
    let font_sizes = [48,72,94,100,120];
    let outputFonts = new Array();
    for (let i=0;i<len;i++) {
        outputFonts.push(font_sizes[Math.floor(Math.random()*(font_sizes.length))]);
    };

    let outArray = new Array();
    for (let i=0;i<len;i++) {
        outArray.push({
            char : outputChars[i],
            fontSize : outputFonts[i],
            nogo : outputChars[i] === nogo_char
        });
    };

    return outArray;
}


