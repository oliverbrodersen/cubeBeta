var l = ["Y", "R", "G"],
    list = ["yello", "re", "gree"],
    hands = ["L", "R"],
    compliments = ["Great job!", "Great!", "So close!", "Well done!", "So fast!", "Super", "Keep on going!", "You've got it!"],
    i = 0,
    iOld = i,
    down = false,
    verify,
    verified = false,
    counter,
    count = 0,
    started = false,
    times = [],
    timesDate = [],
    timesRanked = [],
    axis = [],
    hold = false,
    profileId = "",
    undo = [],
    timesChart,
    cubeLists = [],
    step,
    closeTimeout,
    currentCube = "",
    incognito = false,
    addTimeOpen = false,
    profileOpen = false,
    iconSelected = "",
    deleteList = false,
    cubeIcons = [
        ["2x2","2x2","Standart cube"],
        ["3x3","3x3","Standart cube"],
        ["4x4","4x4","Standart cube"],
        ["5x5","5x5","Standart cube"],
        ["6x6","6x6","Standart cube"],
        ["7x7","7x7","Standart cube"],
        ["8x8","8x8","Standart cube"],
        ["9x9","9x9","Standart cube"],
        ["10x10","10x10","Standart cube"],
        ["11x11","11x11","Standart cube"],
        ["12x12","12x12","Standart cube"],
        ["14x14","14x14","Standart cube"],
        ["16x16","16x16","Standart cube"],
        ["Pyraminx 2x2","pyraminx2x2","Pyraminx"],
        ["Pyraminx","pyraminx3x3","Pyraminx"],
        ["Master Pyraminx","pyraminx4x4","Pyraminx"],
        ["Professor Pyraminx","pyraminx5x5","Pyraminx"],
        ["Megaminx 2x2","megaminx2x2","Megaminx"],
        ["Megaminx 3x3","megaminx3x3","Megaminx"],
        ["Gigaminx","megaminx5x5","Megaminx"],
        ["Mirror cube 3x3","mirror3x3","Other"],
        ["Skewb","skewb","Other"],
        ["Ivy cube","ivy","Other"],
        ["Square-1","square-1","Other"],
        ["Special","special","Other"],
        ["Blind","blind","Discipline"],
        ["One Handed","one-hand","Discipline"]],
    introArray = [
        "<div id='process'></div><h7 class='next' onclick='introForward()'>Next</h7><h7 class='skip' onclick='introReset()'>Skip</h7>Hey, welcome to the Speedcubing timing assistant! This site will help keep track of solve times and display the data for you.",
        "<div id='process'></div><h7 class='next' onclick='introForward()'>Next</h7><h7 class='skip' onclick='introReset()'>Skip</h7>To save your data, make sure you sign in with your Google account! This keeps the data safe and available on any device!",
        "<div id='process'></div><h7 class='next' onclick='introForward()'>Next</h7><h7 class='skip' onclick='introReset()'>Skip</h7><div style='font-size: 34px'>How to use the timer </br></div></br> Then your cube is scrambled and ready, place it in front of you and press down any button. When you are ready to start, let go of the keyboard and imidietly start solving. </br> When your cube is solved, rapidly press any button to stop and save the time. If you dont want the score to effect your statistics, you can remove the time by pressing the <span style='color: red;'>x</span> next to the time. </br> "];

function introForward(c) {
    $("#intro").css("visibility", "visible");
    if (c)
        step = c;
    if (!step) {
        step = 0;
    }
    else {
        if (step === introArray.length - 1)
            $(".next").text("Last");
        if (step === introArray.length)
            introReset();
        if (step === 1)
            $(".g-signin2").css("z-index", "999999").css("transform", "scale(1.3)");
        else
            $(".g-signin2").css("z-index", "100").css("transform", "scale(1)");
        $("#introMessage").html(introArray[step]);
    }
    step++;
    $("#process").css("width", step / introArray.length * 100 + "%");
}
function introReset() {
    $("#intro").css("visibility", "hidden");
    $("#introMessage").html(introArray[0]);
    $(".next").text("Next");
    step = undefined;
}

function displayScramble() {
    cube.reset();
    let i, scramble = cube.scramble(), len = scramble.length, result = "";
    for (i = 0; i < len; i += 5) {
        // Only allow a line break every 5 moves
        result += scramble.slice(i, i + 5).join("&nbsp;") + " ";
    }
    document.getElementById("scrabble").innerHTML = result;
}

function onSignIn(googleUser) {
    $(".g-signin2").addClass("hidden");
    const profile = googleUser.getBasicProfile();
    console.log(profile);
    $("#DisplayInfo").append("<h8 id='pName'><span>Full name:</span> " + profile.getName() + " </br></h8><h8 id='pMail'><span>E-mail:</span> " + profile.getEmail() + "</br></h8>");
    $("#profile").css("background-image", "url(" + profile.getImageUrl() + ")").css("visibility", "visible").css("background-size", "cover");
    profileId = profile.getId();
    profileOpen = false;
    toggleProfile(false);
    //Empty times display
    $("#TimesCont").text("");
    times = [];
    timesRanked = [];
    timesChart.data.labels = [];
    timesChart.data.datasets[0].data = [];
    timesChart.clear();
    getCubes(profileId);
    timesRanked.sort(function (a, b) { return a - b });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        //Empty times display
        $("#TimesCont").text("");
        toggleProfile(true);
        u_mail = "";
        times = [];
        timesRanked = [];
        for (let j = 0; j < cubeLists.length; j++) {
            $("#cube" + j).remove();
        }
        cubeLists = [];
        dataUpdate(true);
        timesChart.data.labels = [];
        timesChart.data.datasets[0].data = [];
        timesChart.clear();
        $(".g-signin2").removeClass("hidden");
        MicroModal.close('modal-1');
    });
}
//Color
function colorShift(c, v) {
    if (c === "red")
        i = 0
    else if (c == "green")
        i = 1
    else
        i = 2

    if (v == true)
        verified = true;

    iOld = i;
    if (i == 2)
        i = 0;
    else
        i++;
    for (var j = 0; j < 2; j++) {
        document.getElementById("hand" + hands[j] + l[i]).className = "show";
        document.getElementById("left" + hands[j]).style.background = "var(--" + list[iOld] + ")";

        if (i == 0)
            document.getElementById("hand" + hands[j] + l[2]).className = "hide";
        else if (i == 1)
            document.getElementById("hand" + hands[j] + l[0]).className = "hide";
        else
            document.getElementById("hand" + hands[j] + l[1]).className = "hide";

    }
}
function activeCube(c){
    if (!deleteList){
        if($("#activeCube").css("top") !== "0px"){
            $("#activeCube").css("top", "0px");
        }
        if(c == "Incognito"){
            incognito = true;
            $(".active").removeClass("active");
            $("#incognito").addClass("active");
            //Empty times display
            $("#TimesCont").text("");
            times = [];
            timesRanked = [];
            timesChart.data.labels = [];
            timesChart.data.datasets[0].data = [];
            dataUpdate(true);
            timesChart.clear();
        }
        else if(!$("#cube" + c).hasClass("active")){
            incognito = false;
            $(".active").removeClass("active");
            $("#cube" + c).addClass("active");
            currentCube = cubeLists[parseInt(c)][0];
            downloadTasks(profileId, currentCube, true);
        }
        if(c !== "Incognito")
            c = cubeLists[c][1];

        $("#activeCube").stop().animate({top: "-170px"}, 500, "swing", function() {
            $("#activeCube").text(c).animate({top: "0px"}, 500, "swing");
            if(c == "Incognito")
                $("#activeCube").addClass("isIncognito");
            else
                $("#activeCube").removeClass("isIncognito");
        });
    }
    else{
        deleteModal(parseInt(c));
    }
}
$(document).ready(function () {
    if (Cookies.get("back") !== "1") {
        Cookies.set('back', '1', { expires: 31 });
        introForward();
    }
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
        document.title = "Local hosted cube";
        cubeLists = [
            ["aaa","2x2","2x2"],
            ["bbb","3x3","3x3"],
            ["ccc","4x4","4x4"],
            ["ddd","5x5","5x5"],
            ["eee","6x6","6x6"],
            ["fff","7x7","7x7"],
            ["ggg","8x8","8x8"],
            ["hhh","9x9","9x9"],
            ["iii","10x10","10x10"],
            ["jjj","11x11","11x11"],
            ["kkk","12x12","12x12"],
            ["lll","14x14","14x14"],
            ["mmm","16x16","16x16"],
            ["mdmm","16x16","16x16"]
        ];
        for (let j = 0; j < cubeLists.length; j++) {
            $('#myCubesList').prepend( '<div id="cube' + j + '" class="cubeList" onclick="activeCube(' + j + ');"><img src="cube/' + cubeLists[j][2] + '.png"><p>' + cubeLists[j][1] + '</p></div>');
        }
        currentCube = cubeLists[0][0];

        for (let i = 0; i < 25; i++) {
            const rnd = Math.floor(Math.random() * 4000) + 4000;
            times.push(rnd);
            timesRanked.push(rnd);
            timesDate.push(moment().subtract(25 - i, 'days').format("MMM Do"));
        }
        timesRanked.sort(function (a, b) { return a - b });
        $("#profile").css("visibility", "visible");
        $("#activeCube").text("3x3").animate({top: "0px"}, 500, "swing");
        console.log("Displaying times wich are randomly generated here:")
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    timesChart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: "Solving times",
                backgroundColor: 'rgba(239,216,18,.2)',
                borderColor: 'rgb(239,216,18)',
                data: [],
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            hover: {
              mode: 'label'
            },
            scales: {
              xAxes: [{
                display: false,
                gridLines: {
                  display: true
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: 'Time'
                },
                ticks: {
                  callback: function(label, index, labels) {
                    var str = toMin(parseInt(label));
                    str = str.substring(0, str.length-3);
                    return str + "s";
                  }
                },
                gridLines: {
                  display: true
                }
              }]
            }
          }
    });

    $("body").keydown(function (event) {
        //Press to init start
        if (down == false && hold == false && event.keyCode !== 18 && event.keyCode !== 17 && addTimeOpen == false) {
            $("#timer").text("0:00.00");
            $("#undo").css("top", "-45px");
            $("#message").text("");
            down = true;
            colorShift("red");
            $("#highscore").remove();
            $("#highscoreB").remove();
            $("#progress").addClass("anim");
            verify = setTimeout(colorShift, 1000, "green", true)
        }
        //Press to init stop
        if (started) {
            hold = true;
            setTimeout(resume, 500);
            started = false;
            clearInterval(counter);
            colorShift("yellow");
            verified = false;
            times.push(count);
            timesRanked.push(count);
            timesRanked.sort(function (a, b) { return a - b });
            if (count < timesRanked[4] && count >= timesRanked[0] && times.length > 5) {
                $("#message").html("<span class='mount'></span>" + compliments[Math.floor(Math.random() * compliments.length)]);
                if (count <= timesRanked[0]){
                    $("#body").prepend("<div id='highscoreB'>New best!</div><div id='highscore'>New best!</div>");
                    const mount = document.querySelector('.mount');
                    confetti(mount);
                }
            }
            addTime(count, undefined, undefined,  moment().format("MMM Do"));
            if(!incognito){
                //make php request for post of data
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", "upload.php?q=" + count + "&e=" + profileId + "&d=" + moment().format("MMM Do"), true);
                xmlhttp.onerror = function() { // only triggers if the request couldn't be made at all
                    console.log(`Network Error`);
                };
                xmlhttp.send();
            }

        }
        //Exit and sumbit when entering numbers for maunal input
        if (addTimeOpen == true && event.keyCode == 27){
            addTimeOpen = false;
            $("#add").html("+").css("color","var(--color)");
            $("#input").css("width", "0px").css("border-bottom", "0px solid var(--color)").val("").blur();
        }
        if (addTimeOpen == true && event.keyCode == 13){
            manualAdd($("#input").val());
        }
        //if profile is open and ESC is pressed, close
        if (!profileOpen && event.keyCode == 27)
            toggleProfile();
    });
    $("body").keyup(function (event) {
        //Detect premature keyup ind verification
        if (verified == false) {
            clearTimeout(verify);
            down = false;
            colorShift("green");
            colorShift("yellow");
            $("#progress").removeClass("anim");
        }
        //start
        else {
            startTimer();
        }
    });

    for (let i = 0; i < times.length; i++) {
        addTime(times[i], i + 1, undefined, timesDate[i]);
    }

    document.getElementById("scrabble").addEventListener("click", displayScramble);

    dataUpdate();
    displayScramble();
    setTimeout(function(){
        $("#loaderCont").addClass("loadOver");
        setTimeout(function () { $("#loaderCont").remove(); }, 1000);}, 2000);

    toggleProfile();
});


//Start timer         
function startTimer() {
    counter = setInterval(timer, 10);
    started = true;
    count = 0;
}
//running timer
function timer() {
    count++;
    $("#timer").text(toMin(count));
}
function manualAdd(count){
    if(count == ""){
        if($("#add").html() == "+"){
            addTimeOpen = true;
            $("#add").html("X").css("color","var(--re)").css("font-size", "20px").css("margin", "22px 3px");
            $("#input").css("width", "100px").css("border-bottom", "1px solid var(--color)").focus();
        }
        else{
            addTimeOpen = false;
            $("#add").html("+").css("color","var(--color)").css("font-size", "28px").css("margin", "15px 5px");
            $("#input").css("width", "0px").css("border-bottom", "0px solid var(--color)").val("").blur();
        }
    }
    else if(toSek(count) !== false){
        count = toSek(count);
        times.push(count);
        timesDate.push(moment().format("MMM Do"));
        timesRanked.push(count);
        timesRanked.sort(function (a, b) { return a - b });
        addTime((count), undefined, undefined,  moment().format("MMM Do"));
        if(!incognito){
            //make php request for post of data
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "upload.php?q=" + count + "&e=" + profileId + "&d=" + moment().format("MMM Do"), true);
            xmlhttp.send();
        }
        addTimeOpen = false;
        $("#add").html("+").css("color","var(--color)");
        $("#input").css("width", "0px").css("border-bottom", "0px solid var(--color)").val("").blur();
    }
}
function inputType(t){        
    t = toSek(t);
    if(!t){
        $('#add').html("X").css('color','var(--re)').css("font-size", "20px").css("margin", "22px 3px");
    }
    else{
        $('#add').html("✓").css('color','var(--gree)').css("font-size", "20px").css("margin", "20px 3px");
    }
}
function isNum(value) {
    return /^-{0,1}\d+$/.test(value);
}
//Timestamp to Millisec
function toSek(t){
    //accepted times should be formatted as
    //min:sek.millisek
    var timeReturn;
    if(isNum(t))
        timeReturn = parseInt(t);
    else if(t.length > 5){
        var timeM = t.split(":");
        var sekM = timeM[1].split(".");
        timeReturn = (parseInt(timeM[0]) * 6000) + (parseInt(sekM[0])*100) + parseInt(sekM[1]);
    }
    else if(t.length > 3){
        var timeM = t.split(".");
        if(timeM.length > 1)
            timeReturn = (parseInt(timeM[0]) * 100) + parseInt(timeM[1]);
        else{
            timeM = t.split(":");
            timeReturn = (parseInt(timeM[0]) * 6000) + (parseInt(timeM[1]) * 100);
        }
        
    }
    if(timeReturn > 0)
        return timeReturn;
    else
        return false;
}
//Miliseconds to timestamp
function toMin(s) {
    var min = Math.floor(s / 6000);
    var sec = Math.floor((s - (6000 * min)) / 100);
    var mili = Math.floor(s - (sec * 100 + min * 6000));
    //Set 0 infront of int if <10
    if (sec.toString().length < 2)
        sec = "0" + sec;
    if (mili.toString().length < 2)
        mili = "0" + mili;

    if (s > 0) {
        if (min > 0)
            return min + ":" + sec + "." + mili;
        else
            return sec + "." + mili;

    }
    else {
        return ""
    }
}

//Reanable timer to prevent early pass
function resume() {
    hold = false;
}
function addTime(c, i, z, t) {
    if (i == undefined)
        i = times.length;

    axis.push(i);
    addData(timesChart, axis[i - 1], times[i - 1]);
    $('#TimesCont').prepend('<div id="' + i + '" class="times" data-time="' + t + '"><h6><span>' + i + '</span>' + toMin(c) + '</h6><input type="button" class="delete" value="✖" onclick="deleteInt(' + c + ')"></div>');
    if (z !== false)
        checkLow();
}

function checkLow() {
    //Checks ranked list and finds nr 1 and 2 to then find id for normal list and add or delete "best" class
    var a = times.indexOf(timesRanked[0]) + 1,
        b = times.indexOf(timesRanked[1]) + 1;
    $(".best").removeClass("best");
    $("#" + a).addClass("best");
    dataUpdate();
}

function downloadTasks(str, indexTable, newTable) {
    var nArray = [], isDifferent;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(newTable){
                //Empty times display
                $("#TimesCont").text("");
                times = [];
                timesRanked = [];
                timesChart.data.labels = [];
                timesChart.data.datasets[0].data = [];
                timesChart.clear();
                dataUpdate(true);
            }
            var per = this.responseText.slice(0, -1);
            if (per != "") {
                var timesDB = per.split("+");
                for (let i = 0; i < timesDB.length; i++) {
                    var timeSeperate = timesDB[i].split("@");
                    if(timeSeperate[0] !== ""){
                        times.push(parseInt(timeSeperate[0]));
                        timesDate.push(timeSeperate[1]);
                        timesRanked.push(parseInt(timeSeperate[0]));
                        if(timeSeperate[1] == "0")
                            addTime(parseInt(timeSeperate[0]), undefined, undefined, "");
                        else
                            addTime(parseInt(timeSeperate[0]), undefined, undefined, timeSeperate[1]);
                    }
                }
                timesRanked.sort(function (a, b) { return a - b });
                checkLow();
            }
        }
    };
    xmlhttp.open("GET", "download.php?e=" + str + "&i=" + indexTable, true);
    xmlhttp.send();
}
function getCubes(str){
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            const per = this.responseText.slice(0, -1);
            if (per !== "") {
                const cubeDB = per.split("+");
                for (let i = 0; i < cubeDB.length; i++) {
                    const cubeSeperate = cubeDB[i].split("@");
                    if(cubeSeperate[0] !== ""){
                        cubeLists.push([cubeSeperate[0],cubeSeperate[1],cubeSeperate[2],cubeSeperate[3]]);

                        cubeLists.sort((function(index){
                            return function(a, b){
                                return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
                            };
                        })(1));
                        cubeLists.reverse();
                    }
                }
                for (let j = 0; j < cubeLists.length; j++) {
                    $('#myCubesList').prepend( '<div id="cube' + j + '" class="cubeList" onclick="activeCube(' + j + ');"><img src="cube/' + cubeLists[j][2] + '.png"><p>' + cubeLists[j][1] + '</p></div>');
                    if(cubeLists[j][3] === "true"){
                        $("#cube" + j).addClass("active");
                        $("#activeCube").css("top", "0px").text(cubeLists[j][1]);
                        currentCube = cubeLists[j][0];
                    }
                }
                if (currentCube === "")
                    currentCube = cubeLists[0][0];
                downloadTasks(profileId, currentCube,false);
            }
            $("#listsLeft").text(cubeLists.length + "/6");
        }
    };
    xmlhttp.open("GET", "login.php?e=" + str, true);
    xmlhttp.send();
}
function selectCubeIcon(t){
    $("#addListTypeSpan").text($(t).attr("alt"));
    if($("#addListName").val() == "" || $("#addListName").val() == $(".activeCube").attr("alt"));
        $("#addListName").val($(t).attr("alt"));
    
    $('.activeCube').removeClass('activeCube');
    $(t).addClass('activeCube');
    iconSelected = $(t).attr("alt");

    if(iconSelected !== '' &&  $('#addListName').val() !== '')
        $('.create').addClass('ready');
    else
        $('.create').removeClass('ready');
}
//Generate cube icons
function generateCubeIcons(){
    if (!deleteList){
        let catagory = cubeIcons[0][2];
        const iconList = $("#iconList");
        iconList.append("<span>" + catagory + "</span>");
        for (let i = 0; i < cubeIcons.length; i++) {
            if(cubeIcons[i][2] !== catagory){
                catagory = cubeIcons[i][2];
                iconList.append(`<span>${catagory}</span>`);
            }
            iconList.append(`<img class='icon' alt='${cubeIcons[i][0]}' src='cube/${cubeIcons[i][1]}.png' onclick='selectCubeIcon(this)' onmouseover='selectCubeIconOver(this)'>`);
        }
    }
}
function selectCubeIconOver(t){
    $("#addListTypeSpan").text($(t).attr("alt"));
}
function createNewList(){
    if (!deleteList){
        if($("#addListContainer").css("height") === "0px"){
            $("#profileDropDown").css("height", parseInt($("#profileDropDown").css("height").slice(0, -2)) + 410 + "px");
            $("#addListContainer").css("height", "410px").animate({ scrollTop:9999 }, 200);
            generateCubeIcons();
        }
        else{
            $("#addListContainer").css("height", "0px");
            $('.create').removeClass('ready');
            $("#addListName").val("");
            $("#addListTypeSpan").text("");
            setTimeout(function(){$("#iconList").html("")}, 450);
            $("#profileDropDown").css("height", parseInt($("#profileDropDown").css("height").slice(0, -2)) - 410 + "px");
        }
    }
}
function generateNewList(){
    var imgName;
    for (let i = 0; i < cubeIcons.length; i++) {
        if(cubeIcons[i][0] === iconSelected){
            imgName = cubeIcons[i][1];
        }
    }
    cubeLists.push([1,$("#addListName").val(),imgName]);
    let idList;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            cubeLists.push(this.responseText);
            idList = this.responseText;
        }
    };
    xmlhttp.open("POST", "newList.php?t=" + $("#addListName").val() + "&e=" + profileId + "&i=" + imgName, true);
    xmlhttp.onerror = function() {
        console.log(`Network Error`);
    };
    xmlhttp.send();

    $('#myCubesList').prepend( '<div id="cube' + cubeLists.length + '" class="cubeList" onclick="activeCube(' + cubeLists.length + ');"><img src="cube/' + imgName + '.png"><p>' + $("#addListName").val() + '</p></div>');
    $(".active").removeClass("active");
    $("#cube" + cubeLists.length).addClass("active");
    $("#activeCube").css("top", "0px").text($("#addListName").val());
    $("#listsLeft").text(cubeLists.length + "/5");
    createNewList();
    //Empty times display
    $("#TimesCont").text("");
    times = [];
    timesRanked = [];
    timesChart.data.labels = [];
    timesChart.data.datasets[0].data = [];
    dataUpdate(true);
    timesChart.clear();
}
function deleteLists(){
    if (!deleteList){
        deleteList = true;
        $(".cubeList").addClass("delete");
        $("#incognito").removeClass("delete");
        $("#addList").removeClass("delete");
        $(".deleteIcon path").css("fill", "var(--re)")
    }
    else{
        $("#deleteList").remove();
        deleteList = false;
        $(".cubeList").removeClass("delete");
        $(".deleteIcon path").css("fill", "var(--color)");
    }
}
function deleteModal(c){
    $("body").append("<div class='modal micromodal-slide' id='deleteList' aria-hidden='true'><div class='modal__overlay' tabindex='-1' data-micromodal-close><div class='modal__container' role='dialog' aria-modal='true' aria-labelledby='deleteList-title'><header class='modal__header'><h2 class='modal__title' id='deleteList-title'>Attention</h2><button class='modal__close' onclick='deleteLists();' aria-label='Close modal' data-micromodal-close></button></header><main class='modal__content' id='deleteList-content'><p>Are you sure you want to delete you cube: " + cubeLists[c][1] + "? <br>You will NOT be able to recover your data!</p></main><footer class='modal__footer'><button class='modal__btn modal__btn-primary' onclick='permDeleteList(" + c + ");'>Yes I'm sure<output></output></button><button class='modal__btn' onclick='deleteLists();' data-micromodal-close aria-label='Close this dialog window'>Cancel</button></footer></div></div>");
    MicroModal.show('deleteList');
}
function permDeleteList(c){//Slet database item
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "deleteList.php?c=" + cubeLists[c][0] + "&e=" + profileId, true);
    xmlhttp.send();
    $("#cube" + c).remove();
    cubeLists[c] = "";
    deleteLists();
}
//works like ARRAY.insert(index, Item to add);
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
}

function deleteInt(i) {
    //Index is location of time in the array. Aka, 1 less than the shown rank and id
    var index = times.indexOf(i);
    var indexR = timesRanked.indexOf(i);
    var countD = i;
    undo = [index, i, timesDate[index]];
    if (index > -1) {
        times.splice(index, 1);
        timesDate.splice(index, 1);
        timesRanked.splice(indexR, 1);
    }
    if (index == times.length) {
        index++;
        $("#" + index).remove();
        removeData(timesChart);
    }
    else {
        //Empty times display
        $("#TimesCont").text("");
        //Remove chart
        timesChart.data.datasets[0].data = [];
        timesChart.data.labels = [];
        //Add Times again
        for (let i = 0; i < times.length; i++) {
            addTime(times[i], i + 1, false, timesDate[i]);
        }
    }
    if(!incognito){
        //Slet database item
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "delete.php?q=" + countD + "&e=" + profileId + "&c=" + currentCube, true);
        xmlhttp.send();
    }
    checkLow();
    $("#undo").css("top", "0");
    setTimeout(function(){$("#undo").css("top", "-45px");}, 10000)
}

function doUndo() {
    $("#undo").css("top", "-45px");
    times.insert(undo[0], undo[1]);
    timesDate.insert(undo[0], undo[2]);
    timesRanked.insert(undo[0], undo[1]);
    timesRanked.sort(function (a, b) { return a - b });

    //Empty times display
    $("#TimesCont").text("");
    //Remove chart
    timesChart.data.datasets[0].data = [];
    timesChart.data.labels = [];
    //Add Times again
    for (let i = 0; i < times.length; i++) {
        addTime(times[i], i + 1, undefined, timesDate[i]);
    }

    if(!incognito){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "upload.php?q=" + undo[1] + "&e=" + profileId + "&d=" + undo[2], true);
        xmlhttp.send();
    }
    undo = [];
}

function dataUpdate(clear) {
    if(clear){
        $("#B").text(toMin(""));
        $("#W").text(toMin(""));
        $("#A").text(toMin(""));
        $("#M").text(toMin(""));
        findData(5, true);
        findData(15, true);
    }
    else{
        //Best
        $("#B").text(toMin(timesRanked[0]));
        //Worst
        $("#W").text(toMin(timesRanked[timesRanked.length - 1]));

        //Find Average
        var sum = 0;
        for (let i = 0; i < times.length; i++) {
            sum += parseInt(times[i], 10);
        }
        var avg = sum / times.length
        $("#A").text(toMin(avg));
        //Median
        $("#M").text(toMin(timesRanked[Math.floor(times.length / 2)]));
        findData(5);
        findData(15);
    }
}

function findData(c, clear) {
    if(clear){
        $("#A" + c).text("");
        $("#B" + c).text("");
        $("#W" + c).text("");

    }
    else{
        var ofFive = [];
        for (let i = 0; i < c; i++) {
            ofFive.push(times[times.length - i - 1])
        }
        ofFive.sort(function (a, b) { return a - b });
        //Best
        $("#B" + c).text(toMin(ofFive[0]));
        //Worst
        $("#W" + c).text(toMin(ofFive[c - 1]));
        //Find Average
        sum = 0;
        for (let i = 0; i < ofFive.length; i++) {
            sum += parseInt(ofFive[i], 10);
        }
        avg = sum / ofFive.length
        $("#A" + c).text(toMin(avg));
    }
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function toggleProfile(e) {
    clearTimeout(closeTimeout);
    if(e){
        profileOpen = false;
        $("#pName").remove();
        $("#pMail").remove();
        $("#profile").css("background-image", "url(data:image/jpeg;base64,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)").css("visibility", "visible").css("background-size", "cover");
    }
    if (profileOpen){
        let h;
        if ($("#myCubesList").height() <= 150)
            h = "369px";
        else if ($("#myCubesList").height() <= 300)
            h = "510px";
        else
            h = $("#myCubesList").height() + "px";
        $("#profileDropDown").css("height", h).css("width", "420px").css("border-radius", "25px 5px 5px 5px").css("box-shadow", "0 4px 4px rgba(0, 0, 0, .1), 0 1px 6px rgba(0, 0, 0, .05), 0 8px 8px rgba(0, 0, 0, .1), 0 16px 16px rgba(0, 0, 0, .1)");
    }
    else{
        if($("#addListContainer").css("height") !== "0px")
            createNewList();
        $("#profileDropDown").css("height", "56px").css("border-radius", "25px").css("box-shadow", "0,0,0");
        closeTimeout = setTimeout(function () {$("#profileDropDown").css("width", "56px")}, 1000);
    }
    profileOpen = !profileOpen;
}



// Dom confetti by Daniel Lundin (https://github.com/daniel-lundin/dom-confetti)
const colors = [
'#a864fd',
'#29cdff',
'#78ff44',
'#ff718d',
'#fdff6a'];


function createElements(root, elementCount) {
    return Array.
    from({ length: elementCount }).
    map((_, index) => {
    const element = document.createElement('div');
    element.classList = ['fetti'];
    const color = colors[index % colors.length];
    element.style['background-color'] = color; // eslint-disable-line space-infix-ops
    element.style.width = '15px';
    element.style.height = '15px';
    element.style.position = 'absolute';
    root.appendChild(element);
    return element;
    });
}

function randomPhysics(angle, spread, startVelocity) {
    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);
    return {
    x: 0,
    y: 0,
    wobble: Math.random() * 10,
    velocity: startVelocity * 0.8 + Math.random() * startVelocity,
    angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
    angle3D: -(Math.PI / 4) + Math.random() * (Math.PI / 2),
    tiltAngle: Math.random() * Math.PI };

}

function updateFetti(fetti, progress, decay) {
    /* eslint-disable no-param-reassign */
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
    fetti.physics.wobble += 0.1;
    fetti.physics.velocity *= decay;
    fetti.physics.y += 3;
    fetti.physics.tiltAngle += 0.1;

    const { x, y, tiltAngle, wobble } = fetti.physics;
    const wobbleX = x + 10 * Math.cos(wobble);
    const wobbleY = y + 10 * Math.sin(wobble);
    const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

    fetti.element.style.transform = transform;
    fetti.element.style.opacity = 1 - progress;

    /* eslint-enable */
}

function animate(root, fettis, decay) {
    const totalTicks = 200;
    let tick = 0;

    function update() {
    fettis.forEach(fetti => updateFetti(fetti, tick / totalTicks, decay));

    tick += 1;
    if (tick < totalTicks) {
        requestAnimationFrame(update);
    } else {
        fettis.forEach(fetti => root.removeChild(fetti.element));
    }
    }

    requestAnimationFrame(update);
}

function confetti(root, {
    angle = 90,
    decay = 0.9,
    spread = 95,
    startVelocity = 25,
    elementCount = 50 } =
{}) {
    const elements = createElements(root, elementCount);
    const fettis = elements.map(element => ({
    element,
    physics: randomPhysics(angle, spread, startVelocity) }));


    animate(root, fettis, decay);
}

//Modal
!function (e, o) { "object" == typeof exports && "undefined" != typeof module ? module.exports = o() : "function" == typeof define && define.amd ? define(o) : e.MicroModal = o() }(this, function () {
    "use strict"
    var e = function (e, o) { if (!(e instanceof o)) throw new TypeError("Cannot call a class as a function") }, o = function () {
        function e(e, o) {
            for (var t = 0; t < o.length; t++) {
                var i = o[t]
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        } return function (o, t, i) { return t && e(o.prototype, t), i && e(o, i), o }
    }(), t = function (e) {
        if (Array.isArray(e)) {
            for (var o = 0, t = Array(e.length); o < e.length; o++)t[o] = e[o]
            return t
        } return Array.from(e)
    }
    return function () {
        var i = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], n = function () {
            function n(o) {
                var i = o.targetModal, a = o.triggers, r = void 0 === a ? [] : a, s = o.onShow, l = void 0 === s ? function () { } : s, c = o.onClose, d = void 0 === c ? function () { } : c, u = o.openTrigger, f = void 0 === u ? "data-micromodal-trigger" : u, h = o.closeTrigger, v = void 0 === h ? "data-micromodal-close" : h, g = o.disableScroll, m = void 0 !== g && g, b = o.disableFocus, y = void 0 !== b && b, w = o.awaitCloseAnimation, k = void 0 !== w && w, p = o.debugMode, E = void 0 !== p && p
                e(this, n), this.modal = document.getElementById(i), this.config = { debugMode: E, disableScroll: m, openTrigger: f, closeTrigger: v, onShow: l, onClose: d, awaitCloseAnimation: k, disableFocus: y }, r.length > 0 && this.registerTriggers.apply(this, t(r)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this)
            } return o(n, [{
                key: "registerTriggers", value: function () {
                    for (var e = this, o = arguments.length, t = Array(o), i = 0; i < o; i++)t[i] = arguments[i]
                    t.forEach(function (o) { o.addEventListener("click", function () { return e.showModal() }) })
                }
            }, { key: "showModal", value: function () { this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add("is-open"), this.setFocusToFirstNode(), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.onShow(this.modal) } }, {
                key: "closeModal", value: function () {
                    var e = this.modal
                    this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement.focus(), this.config.onClose(this.modal), this.config.awaitCloseAnimation ? this.modal.addEventListener("animationend", function o() { e.classList.remove("is-open"), e.removeEventListener("animationend", o, !1) }, !1) : e.classList.remove("is-open")
                }
            }, {
                key: "scrollBehaviour", value: function (e) {
                    if (this.config.disableScroll) {
                        var o = document.querySelector("body")
                        switch (e) {
                            case "enable": Object.assign(o.style, { overflow: "initial", height: "initial" })
                                break
                            case "disable": Object.assign(o.style, { overflow: "hidden", height: "100vh" })
                        }
                    }
                }
            }, { key: "addEventListeners", value: function () { this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown) } }, { key: "removeEventListeners", value: function () { this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown) } }, { key: "onClick", value: function (e) { e.target.hasAttribute(this.config.closeTrigger) && (this.closeModal(), e.preventDefault()) } }, { key: "onKeydown", value: function (e) { 27 === e.keyCode && this.closeModal(e), 9 === e.keyCode && this.maintainFocus(e) } }, {
                key: "getFocusableNodes", value: function () {
                    var e = this.modal.querySelectorAll(i)
                    return Object.keys(e).map(function (o) { return e[o] })
                }
            }, {
                key: "setFocusToFirstNode", value: function () {
                    if (!this.config.disableFocus) {
                        var e = this.getFocusableNodes()
                        e.length && e[0].focus()
                    }
                }
            }, {
                key: "maintainFocus", value: function (e) {
                    var o = this.getFocusableNodes()
                    if (this.modal.contains(document.activeElement)) {
                        var t = o.indexOf(document.activeElement)
                        e.shiftKey && 0 === t && (o[o.length - 1].focus(), e.preventDefault()), e.shiftKey || t !== o.length - 1 || (o[0].focus(), e.preventDefault())
                    } else o[0].focus()
                }
            }]), n
        }(), a = null, r = function (e, o) {
            var t = []
            return e.forEach(function (e) {
                var i = e.attributes[o].value
                void 0 === t[i] && (t[i] = []), t[i].push(e)
            }), t
        }, s = function (e) { if (!document.getElementById(e)) return console.warn("MicroModal v0.3.1: ❗Seems like you have missed %c'" + e + "'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="' + e + '"></div>'), !1 }, l = function (e) { if (e.length <= 0) return console.warn("MicroModal v0.3.1: ❗Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>'), !1 }, c = function (e, o) {
            if (l(e), !o) return !0
            for (var t in o) s(t)
            return !0
        }
        return {
            init: function (e) {
                var o = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, e), i = [].concat(t(document.querySelectorAll("[" + o.openTrigger + "]"))), a = r(i, o.openTrigger)
                if (!0 !== o.debugMode || !1 !== c(i, a)) for (var s in a) {
                    var l = a[s]
                    o.targetModal = s, o.triggers = [].concat(t(l)), new n(o)
                }
            }, show: function (e, o) {
                var t = o || {}
                t.targetModal = e, !0 === t.debugMode && !1 === s(e) || (a = new n(t), a.showModal())
            }, close: function () { a.closeModal() }
        }
    }()
})
var cube = {
    // Define the six faces of the cube
    faces: "DLBURF",
    // This will contain a history of all the states to make sure we don't repeat a state
    states: [],
    // Which stickers are part of the same layer and should move along with the face
    edges: {
        D: [46, 45, 44, 38, 37, 36, 22, 21, 20, 14, 13, 12],
        L: [24, 31, 30, 40, 47, 46, 0, 7, 6, 20, 19, 18],
        B: [26, 25, 24, 8, 15, 14, 6, 5, 4, 36, 35, 34],
        U: [18, 17, 16, 34, 33, 32, 42, 41, 40, 10, 9, 8],
        R: [28, 27, 26, 16, 23, 22, 4, 3, 2, 44, 43, 42],
        F: [30, 29, 28, 32, 39, 38, 2, 1, 0, 12, 11, 10]
    },
    // Sets the cube to the solved state
    reset: function () {
        cube.states = ["yyyyyyyyoooooooobbbbbbbbwwwwwwwwrrrrrrrrgggggggg"];
    },
    // Twist the cube according to a move in WCA notation
    twist: function (state, move) {
        var i, k, prevState, face = move.charAt(0), faceIndex = cube.faces.indexOf(move.charAt(0)),
            turns = move.length > 1 ? (move.charAt(1) === "2" ? 2 : 3) : 1;
        state = state.split("");
        for (i = 0; i < turns; i++) {
            prevState = state.slice(0);
            // Rotate the stickers on the face itself
            for (k = 0; k < 8; k++) { state[(faceIndex * 8) + k] = prevState[(faceIndex * 8) + ((k + 6) % 8)]; }
            // Rotate the adjacent stickers that are part of the same layer
            for (k = 0; k < 12; k++) { state[cube.edges[face][k]] = prevState[cube.edges[face][(k + 9) % 12]]; }
        }
        return state.join("");
    },
    // Scramble the cube
    scramble: function () {
        var count = 0, total = 20, state, prevState = cube.states[cube.states.length - 1],
            move, moves = [], modifiers = ["", "'", "2"];
        while (count < total) {
            // Generate a random move
            move = cube.faces[Math.floor(Math.random() * 6)] + modifiers[Math.floor(Math.random() * 3)];
            // Don't move the same face twice in a row
            if (count > 0 && move.charAt(0) === moves[count - 1].charAt(0)) { continue; }
            // Avoid move sequences like "R L R", which is the same as "R2 L"
            if (count > 1 && move.charAt(0) === moves[count - 2].charAt(0) &&
                moves[count - 1].charAt(0) === cube.faces.charAt((cube.faces.indexOf(move.charAt(0)) + 3) % 6)) {
                continue;
            }
            state = cube.twist(prevState, move);
            if (cube.states.indexOf(state) === -1) {
                // If this state hasn't yet been encountered, save it and move on
                moves[count] = move;
                cube.states[count] = state;
                count++;
                prevState = state;
            }
        }
        return moves;
    }
}