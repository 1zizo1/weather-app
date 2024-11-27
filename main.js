var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
async function searchWeather(term) {
    // term = "london"
    if ( term === 'default'){
        document.getElementById('day').innerHTML = "<div style='text-align:center'><h3 style='color:white'>Loading ...</h3></div>";
        term = await getUserLocation();
    }

    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${term}&days=3`)
    if (response.ok && 400 != response.status) {
        let term = await response.json();
        displayCurrent(term.location, term.current),
        displayforecast(term.forecast.forecastday)
        // console.log(term);

    }
}
document.getElementById('search').addEventListener('keyup', function (term) {
    searchWeather(term.target.value);

})
document.getElementById('searchBtn').addEventListener('click', function(term){
    searchWeather(term.target.value);

})


function displayCurrent(term, response) {
    if (null != response) {
        let dateofsearch = new Date(response.last_updated)
        let cart = `
                <div  id="todayCard">
                <!-- today -->
                <div class="card">
                    <div class="card-header d-flex justify-content-between px-4 text-grey">
                        <span>${days[dateofsearch.getDay()]}</span>
                        <span> ${dateofsearch.getDay() + monthNames[dateofsearch.getMonth()]}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title location">${term.name}</h5>
                        <div class="degree">
                            <div class="num px-2">${response.temp_c}<sup>o</sup>C</div>
                            <div class="forecast-ico">
                                <img src="https:${response.condition.icon}" alt="" width=90px>
                            </div>
                        </div>
                        <div class="custom text-primary">${response.condition.text}</div>
                        <div class="current-info d-flex">
                            <span><i class="fa-solid fa-umbrella "> </i> 20%</span>
                            <span><i class="fa-solid fa-wind"></i>${response.gust_kph} Km/h</span>
                            <span><i class="fa-regular fa-compass"></i>West </span>
                        </div>
                    </div>
                </div>

            </div>
    
    `
        document.getElementById('day').innerHTML = cart;
        console.log(dateofsearch);

    }

};
function displayforecast(term) {
    let cart = ''
    for (i = 1; i < term.length; i++) {
        cart += `
             

        <div class="col-lg-6 p-0">
        <div class="text-center forecostCard" >
        
          <div class="card w-100">
              <div class="card-header d-flex justify-content-center px-4 text-grey">
                  <span> ${days[new Date(term[i].date).getDay()]}</span>
              </div>
              <div class="card-body  d-flex flex-column align-items-center justify-content-center">
                  <div class="degree">
                      <div>
                          <div class="forecast-ico">
                              <img src="${term[i].day.condition.icon} ">
                          </div>
                          <h1> ${term[i].day.maxtemp_c}<sup>o</sup>C</h1>
                      <h4 class="text-muted">${term[i].day.mintemp_c}<sup>o</sup></h4>
                      </div>
                  </div>
                  <div class="custom text-primary">${term[i].day.condition.text}</div>  
              </div>
          </div>
      </div>
      </div>
       
`
        document.getElementById('next').innerHTML = cart;

    }

};


async function getUserLocation(){

    var user_location = "london";
    var user_ip_resp = await fetch("https://api.ipquery.io/");
    if (user_ip_resp.ok) {
        let user_ip = await user_ip_resp.text();
        console.log(`User IP ${ user_ip }`);

        var ip_details_resp = await fetch(`https://api.ipquery.io/${user_ip}`);

        if ( ip_details_resp.ok ){

            let ip_in_details = await ip_details_resp.json();
            console.log(`Ip details ${ JSON.stringify(ip_in_details) }`);
            user_location = ip_in_details.location.state;
        };

    };

    return user_location;

};

searchWeather("default");
