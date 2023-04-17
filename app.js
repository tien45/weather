const $= document.querySelector.bind(document)
const $$= document.querySelectorAll.bind(document)

const container = $('.container')
const input = $('#location');
const btnSearch = $('.icon-search');
const weatherBox = $('.weather-box');
const imgWeather = $('.img-weather img');
const currentTemperature = $('.current-temperature');
const minMaxTemperature =$('.min-max-temperature')
const currentStatus = $('.current-status');
const humidityCount = $('.humidity-count');
const humidityStatus = $('.humidity-status');
const windCount = $('.wind-count');
const windStatus = $('.wind-status');
const getMyLocation = $('.icon-location')
const nameLocation =$('.name-location');

const not404 = 'img/cuteCat.jpg'


const KEYAPI = '2ba9936d92110510780f56a78d942a44';

const app ={
    getValue :function() {
        const firstInputValue = input.value;
        if(firstInputValue === ""){
            this.generalFunction.locationNotFound()
            weatherBox.classList.add("fadein");
        }
        else{
            weatherBox.classList.add("fadein");
            let inputValue = firstInputValue.replace(/\s/g, "%20");
            const firstAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&appid=${KEYAPI}`;
            this.covertLocation(firstAPI)
        }
    },
    covertLocation: function(firstAPI) {
        fetch(firstAPI)
            .then(response => response.json())
            .then(data =>{
                this.getAPI(data[0]);
            })
            .catch(err => {
                app.generalFunction.locationNotFound()
            });
    },
    getAPI: function(data) {
        const API = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}6&lon=${data.lon}&appid=${KEYAPI}`
        fetch(API)
            .then(response => response.json())
            .then(dataAPI =>{
                app.render(dataAPI,data)
            })
            .catch(error => console.error(error));
    },

    handleEvents: function() {
        btnSearch.onclick = () => this.getValue()
        input.onkeydown = (e) => {
            if(e.key === "Enter") { 
                this.getValue()
            }
        }
        getMyLocation.onclick = () => {
                navigator.geolocation.getCurrentPosition((position) =>{
                    const data={
                        lat : position.coords.latitude,
                        lon : position.coords.longitude
                    }
                    app.getAPI(data)
                    input.value = ""
                    weatherBox.classList.add("fadein");

                });
        }
        document.onkeydown = (e) => {
            if(e.key ==="Enter") {
                input.focus()
            }
            if(e.keyCode == 123) {
                return false;
            }
        }
    },
    render: function(apiWeather,data) {
        currentTemperature.innerHTML = (apiWeather.main.temp -  273.15).toFixed(0) +'°C';
        currentStatus.innerHTML = apiWeather.weather[0].description
        humidityCount.innerHTML = apiWeather.main.humidity+'%';
        windCount.innerHTML = apiWeather.wind.speed +' Km/h'
        if(data.name === undefined){
            nameLocation.innerHTML = apiWeather.name +' - ' +apiWeather.sys.country;
        }
        else{
            nameLocation.innerHTML = data.name +' - ' +data.country;
        }
        function setBg(hours){
            if(hours.session ==="night"){
                if(apiWeather.weather[0].main === "Clear"){
                    imgWeather.src = 'img/clear.jpg'
                }
                else if(apiWeather.weather[0].main === "Clouds"){
                    imgWeather.src = 'img/clouds.jpg'
                }
                else if(apiWeather.weather[0].main === "Haze"){
                    imgWeather.src = 'img/sun.jpg'
                }
                else if(apiWeather.weather[0].main === "Rain"){
                    imgWeather.src = 'img/rain.jpg'
                }
                else{
                    imgWeather.src = 'img/cuteCat.jpg'
                }
            }
            else{
                if(apiWeather.weather[0].main === "Clear"){
                    imgWeather.src = 'img/clear.jpg'
                }
                else if(apiWeather.weather[0].main === "Clouds"){
                    imgWeather.src = 'img/clouds.jpg'
                }
                else if(apiWeather.weather[0].main === "Haze"){
                    imgWeather.src = 'img/sun.jpg'
                }
                else if(apiWeather.weather[0].main === "Rain"){
                    imgWeather.src = 'img/rain.jpg'
                }
                else{
                    imgWeather.src = 'img/cuteCat.jpg'
                }
            }
            container.style.backgroundImage = `url('img/cuteCat.jpg${hours.session}.jpg')`
            container.style.color = hours.textColor
        }
        setBg(this.generalFunction.handleTimes(apiWeather))
    },
    generalFunction: {
        locationNotFound: function() {
            imgWeather.src = not404
            nameLocation.innerHTML = 'Oops! Address not found'
            currentTemperature.innerHTML = '...'
            currentStatus.innerHTML = '...'
            humidityCount.innerHTML = '...'
            windCount.innerHTML = '...'
        },
        handleTimes: function(data) {
            var time = new Date();
            var myUTC = time.getTimezoneOffset()/(-60);
            let getUTC= data.timezone /3600
            let myHours = time.getHours()
            let hoursResuilt = 0;
            if(getUTC> myUTC){
                hoursResuilt = myHours + (getUTC - myUTC)
                if(hoursResuilt > 24){
                    hoursResuilt =  (UTCResuilt - myUTC) -1
                }
            }
            else{
                hoursResuilt = myHours - (myUTC - getUTC)
                if(hoursResuilt < 0){
                    hoursResuilt = 24 -(myUTC - getUTC)
                }
            }
            if(hoursResuilt>5 && hoursResuilt <=14){

                return {
                    session : 'morning',
                    textColor : '#000'
                }
            }
            else if(hoursResuilt>14 && hoursResuilt <18){
                return {
                    session : 'afternoon',
                    textColor : '#fff'
                }
            }
            else {
                return {
                    session : 'night',
                    textColor : '#fff'
                }
            }
        }
    },
    start: function() {
        this.handleEvents()
    }
}

app.start()

document.addEventListener('contextmenu', event => event.preventDefault());