const vueApp = new Vue({
    el: '#vapp',
    data: {
        json: '',
        city: '',
        temp: [0, 0, 0, 0, 0],
        wind: [0, 0, 0, 0, 0],
        rain: [0, 0, 0, 0, 0],
        umbrella: false,
        packForHot: false,
        packForWarm: false,
        packForCold: false

    },
    methods: {
        getData: getDataFunc,
        getTemp: getOverallTemp,
        getWind: getOverallWind,
        rainCheck: rainCheckUmbrella,
        packingOptions: packingOptionsFunc,
        displayPacking: displayPackingItems,
        displayTable: displayTable,
    }

})

function getDataFunc() {
    vueApp.city = document.getElementById("userInput").value;
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + vueApp.city + '&mode=json&units=metric&APPID=3e2d927d4f28b456c6bc662f34350957').then(res => {
        return res.json();
    }).then(function (res) {
        vueApp.json = res
        vueApp.temp = getOverallTemp(res)
        vueApp.wind = getOverallWind(res)
        vueApp.rain = getOverallRain(res)
        rainCheckUmbrella()
        packingOptionsFunc()
        displayPackingItems()
        displayTable()
        console.log(vueApp.json)
    }).catch(function(error) {
        console.log(error);
    });

}

// get the average temperature for each day
function getOverallTemp(res) {
    let list = res.list;
    console.log("list")
    console.log(list)
    let temperatures = [0, 0, 0, 0, 0]
    for (let i = 0; i < 5; i++) {
        let currMin = 100;
        let currMax = -100;
        for (let j = i * 8; j < 8 + (i * 8); j++) {
            if (currMax < list[j].main.temp) {
                currMax = list[j].main.temp
            }
            if (currMin > list[j].main.temp) {
                currMin = list[j].main.temp
            }
        }
        let avgTemp = (currMax + currMin) / 2;
        temperatures[i] = avgTemp.toFixed(0);
    }
    return temperatures;

}

// get average windspeed for each day
function getOverallWind(res) {
    let list = res.list;
    console.log("list")
    console.log(list)
    let wind = [0, 0, 0, 0, 0]
    for (let i = 0; i < 5; i++) {
        let currWind = [];
        for (let j = i * 8; j < 8 + (i * 8); j++) {
            currWind.push(list[j].wind.speed)
        }
        let sum = currWind.reduce((previous, current) => current += previous);
        let avg = sum / currWind.length;
        wind[i] = avg.toFixed(2);
    }
    return wind;

}

// get total rainfall for each day
function getOverallRain(res) {
    let list = res.list;
    console.log("list")
    console.log(list)
    let rain = [0, 0, 0, 0, 0]
    for (let i = 0; i < 5; i++) {
        let currRain = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let j = i * 8; j < 8 + (i * 8); j++) {
            if (list[j].rain != undefined) {
                console.log(list[j].rain);
                if(list[j].rain["3h"] != undefined){
                    currRain[j - (8 * i)] = list[j].rain["3h"]
                }
            }
        }
        console.log(currRain)
        let sum = currRain.reduce((previous, current) => current += previous);
        rain[i] = sum.toFixed(2);
    }
    console.log(rain)
    return rain;

}

//check to bring umbrella
function rainCheckUmbrella() {
    vueApp.umbrella = false;
    for(let i = 0; i < 5; i++){
        if(vueApp.rain[i] > 0){
            vueApp.umbrella = true;
        }
    }
    console.log("umbrella check")
    console.log(vueApp.umbrella)
}

//check weather for next 5 days and see how to pack
function packingOptionsFunc(){
    vueApp.packForHot = false;
    vueApp.packForWarm = false;
    vueApp.packForCold = false;
    for(let i = 0; i < 5; i++){
        if(vueApp.temp[i] >= 20){
            vueApp.packForHot = true;
            console.log("it's hot")
        }
        else if(vueApp.temp[i] < 20 && vueApp.temp[i] > 10) {
            vueApp.packForWarm = true;
            console.log("it's warm")
        }
        else {
            vueApp.packForCold = true;
            console.log("it's cold")
        }
    }
}

//display packing items
function displayPackingItems(){
    console.log(vueApp.packForCold)
    console.log(vueApp.packForWarm)
    console.log(vueApp.packForHot)
    if(vueApp.packForCold){
        document.getElementById("packing").innerHTML = "❄️ It'll be cold - pack warm clothes!"
        console.log("Cold")
    }
    else if (vueApp.packForWarm) {
        document.getElementById("packing").innerHTML = "⛅ It'll be warm - pack accordingly!"
        console.log("Warm")
    }
    else if (vueApp.packForHot) {
        document.getElementById("packing").innerHTML = "☀️ It'll be hot - get the swim trunks!"
        console.log("Hot")
    }
    if (vueApp.umbrella){
        document.getElementById("umbrella").innerHTML = "☂️ Get that umbrella - it'll rain!"
        console.log("displaying umbrella")
    }
    else{
        document.getElementById("umbrella").innerHTML = ""
        console.log("not displaying umbrella")
    }
}

//display table of weather
function displayTable(){
    //day 1
    document.getElementById("temp1").innerHTML = "Temperature: " + vueApp.temp[0] + "°C"
    document.getElementById("wind1").innerHTML = "Wind Speed: " + vueApp.wind[0] + " km/h"
    document.getElementById("rain1").innerHTML = "Rainfall: " + vueApp.rain[0] + " mm h–1"
    //day 2
    document.getElementById("temp2").innerHTML = "Temperature: " + vueApp.temp[1] + "°C"
    document.getElementById("wind2").innerHTML = "Wind Speed: " + vueApp.wind[1] + " km/h"
    document.getElementById("rain2").innerHTML = "Rainfall: " + vueApp.rain[1] + " mm h–1"
    //day 3
    document.getElementById("temp3").innerHTML = "Temperature: " + vueApp.temp[2] + "°C"
    document.getElementById("wind3").innerHTML = "Wind Speed: " + vueApp.wind[2] + " km/h"
    document.getElementById("rain3").innerHTML = "Rainfall: " + vueApp.rain[2] + " mm h–1"
    //day 4
    document.getElementById("temp4").innerHTML = "Temperature: " + vueApp.temp[3] + "°C"
    document.getElementById("wind4").innerHTML = "Wind Speed: " + vueApp.wind[3] + " km/h"
    document.getElementById("rain4").innerHTML = "Rainfall: " + vueApp.rain[3] + " mm h–1"
    //day 5
    document.getElementById("temp5").innerHTML = "Temperature: " + vueApp.temp[4] + "°C"
    document.getElementById("wind5").innerHTML = "Wind Speed: " + vueApp.wind[4] + " km/h"
    document.getElementById("rain5").innerHTML = "Rainfall: " + vueApp.rain[4] + " mm h–1"
}