class Weather{
    constructor() {
        this.currentWeather = undefined;
    }
    XMLHttpRequestApi(city){
        let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=city&appid=5221b8299d55ae8108b5278b66642ec3&units=metric";
        apiURL = apiURL.replace(/city/, city);

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();

            xhr.open("GET", apiURL, true);

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300){
                    this.currentWeather = JSON.parse(xhr.responseText);
                    console.log("Dane pobrane z XMLHttpRequest API: ", this.currentWeather);
                    resolve(this.currentWeather);
                }
                else {
                    reject(new Error("test"));
                }
            };

        xhr.onerror = () => reject(new Error("network error"));
        xhr.send();
        });
    }

    async fetchAPI(city) {
        let apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=city&appid=5221b8299d55ae8108b5278b66642ec3&units=metric";
        apiURL = apiURL.replace(/city/, city);

        let response = await fetch(apiURL);
        let data = await response.json();

        console.log("Dane pobrane z fetch API: ", data);

        return data;
    }

    async getWeatherXMLHttpRequest(city){
        await this.XMLHttpRequestApi(city);
        let weatherCity = this.currentWeather;

        let icon = weatherCity.weather[0].icon;
        let date = weatherCity.dt;
        let temp = weatherCity.main.temp;
        let feltTemp = weatherCity.main.feels_like;
        let description = weatherCity.weather[0].description;

        return {
            icon: icon,
            date: date,
            temp: temp,
            feltTemp: feltTemp,
            description: description
        };
    }

    convertDate(date){
        const dateObj = new Date(date * 1000);
        let hour = String(dateObj.getHours()).padStart(2, '0');
        let minute =String(dateObj.getMinutes()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let day = String(dateObj.getDate()).padStart(2, '0');
        let month = String(dateObj.getMonth() + 1).padStart(2, '0');
        date = `${day}.${month}.${year} ${hour}:${minute}`;

        return date;
    }

    async defaultWeather(){
        let weather = new Weather();
        let {icon, date, temp, feltTemp, description} = await weather.getWeatherXMLHttpRequest("Szczecin");
        let actualDate = document.getElementById("actualDate");
        let iconWeather = document.getElementById("iconWeather");
        let actualTemperature = document.getElementById("actualTemperature");
        let feltTemperature = document.getElementById("feltTemperature");
        let weatherDescription = document.getElementById("weatherDescription");


        let url = "https://openweathermap.org/img/wn/qqq@2x.png";
        url = url.replace(/qqq/, icon);

        date = this.convertDate(date);

        actualDate.textContent = date;
        iconWeather.src = url;
        actualTemperature.textContent = temp + " ºC";
        feltTemperature.textContent = "Feel: " + feltTemp + " ºC";
        weatherDescription.textContent = description;
    }

    async drawWeather(city){
        let cityName = document.getElementById("cityName");
        if (city){
            cityName.innerText = city;
        }

        let weather = new Weather();
        let data = await weather.fetchAPI(city);
        let weatherList = data.list;

        let actualDate = document.getElementById("actualDate");
        let iconWeather = document.getElementById("iconWeather");
        let actualTemperature = document.getElementById("actualTemperature");
        let feltTemperature = document.getElementById("feltTemperature");
        let weatherDescription = document.getElementById("weatherDescription");

        let icon = weatherList[0].weather[0].icon;
        let date = weatherList[0].dt;
        let temp = weatherList[0].main.temp;
        let feltTemp = weatherList[0].main.feels_like;
        let description = weatherList[0].weather[0].description;

        let url = "https://openweathermap.org/img/wn/qqq@2x.png";
        url = url.replace(/qqq/, icon);

        iconWeather.src = url;
        actualTemperature.textContent = temp + " ºC";
        feltTemperature.textContent = "Feel: " + feltTemp + " ºC";
        weatherDescription.textContent = description;

        let block = document.querySelector(".weatherContainer");
        let del = document.getElementById("weatherContainer");

        if (del.childElementCount > 1){
            for (let j = 0; j < 5; j++){
                del.removeChild(del.lastChild);
            }
        }

        for (let i = 0; i < 5; i++){
            icon = weatherList[i].weather[0].icon;
            date = weatherList[i].dt;
            temp = weatherList[i].main.temp;
            feltTemp = weatherList[i].main.feels_like;
            description = weatherList[i].weather[0].description;

            let url = "https://openweathermap.org/img/wn/qqq@2x.png";
            url = url.replace(/qqq/, icon);

            date = this.convertDate(date);

            let newDiv = document.createElement("div");
            newDiv.className = "weatherBox";

            actualDate = document.createElement("div");
            actualDate.className = "actualDate"
            actualDate.textContent = date;
            newDiv.appendChild(actualDate);

            iconWeather = document.createElement("img");
            iconWeather.className = "iconWeather";
            iconWeather.src = url;
            newDiv.appendChild(iconWeather);

            actualTemperature = document.createElement("div");
            actualTemperature.className = "actualTemperature";
            actualTemperature.textContent = temp + " ºC";
            newDiv.appendChild(actualTemperature);

            feltTemperature = document.createElement("div");
            feltTemperature.className = "feltTemperature";
            feltTemperature.textContent = feltTemp;
            newDiv.appendChild(feltTemperature);

            weatherDescription = document.createElement("div");
            weatherDescription.className = "weatherDescription";
            weatherDescription.textContent = description;
            newDiv.appendChild(weatherDescription);

            block.appendChild(newDiv);
        }
    }
}


window.onload = async function() {
    let weather = new Weather();

    const button = document.getElementById("lokalizacjaSend");
    button.addEventListener('click', () => weather.drawWeather(document.getElementById("lokalizacja").value));

    await weather.defaultWeather();


}