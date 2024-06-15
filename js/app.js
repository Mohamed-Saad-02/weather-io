"use strict";import{fetchData as e,url as t}from"./api.js";import{addClassName as i,removeClassName as s,monthNames as l,weekDayNames as a,getDate as c,getHours as n}from"./helper.js";let spinner=document.getElementById("spinner"),iconSearch=document.getElementById("iconSearch"),iconClose=document.getElementById("iconClose"),searchContainer=document.querySelector(".search.box");iconSearch.addEventListener("click",()=>i(searchContainer,"active")),iconClose.addEventListener("click",()=>s(searchContainer,"active"));let searchParent=document.getElementById("searchParent"),inputSearch=document.getElementById("searchLocation");inputSearch.addEventListener("focus",e=>{e.target.value.length>2&&i(searchParent,"show-list")}),inputSearch.addEventListener("blur",()=>{inputSearch.value.length<=2&&s(searchParent,"show-list")});let controller=new AbortController;inputSearch.addEventListener("input",e=>{let l=e.target.value;if(l.length<=2){s(searchParent,"show-list");return}async function a(){try{let e=await fetch(t.searchGeo(l),{signal:controller.signal});if(!e.ok)throw Error("Something went wrong with fetching movies");let i=await e.json();handleDisplayData(i)}catch(s){console.log(s.message)}}i(searchParent,"show-list"),controller.abort(),controller=new AbortController,a()});let listUl=document.getElementById("list");function handleDisplayData(e){for(let[t,i]of(listUl.innerHTML="",e.entries())){if(t>5)return;let{lat:l,lon:a,name:c,country:n}=i,r=document.createElement("li");r.className="list-item flex items-center justify-between gap-12",r.dataset.location=`${l},${a}`,r.innerHTML=`
    <div class="icon flex items-center gap-12">
      <i class="fa-solid fa-location-dot"></i>
      <div class="item-name">
      <p class="color-white">${c}</p>
      <span>${n}</span>
      </div>
    </div>
    <div class="image flex-1 flex items-center justify-end">
      <img src="https://www.countryflags.com/wp-content/uploads/${n.split(" ").join("-").toLowerCase()}-flag-png-large.png" loading="lazy" width="30" />
    </div>
    `,listUl.appendChild(r),r.addEventListener("click",e=>{let t=e.currentTarget,i=t.dataset.location;updateWeather(...i.split(",")),inputSearch.value="",s(searchParent,"show-list")})}}let locationUser={},currentLocationBtn=document.getElementById("currentLocation");function currentLocation(){navigator.geolocation.getCurrentPosition(e=>{let{latitude:t,longitude:i}=e.coords;locationUser.latitude=t,locationUser.longitude=i,updateWeather(t,i)},e=>{console.log(e.message),updateWeather(51.52,-.11)})}currentLocationBtn.addEventListener("click",currentLocation),currentLocation();let currentWebsiteSection=document.getElementById("currentWebsite"),highlights=document.getElementById("highlights"),hourlyForecast=document.getElementById("hourlyForecast"),forecastSection=document.getElementById("forecastSection");function updateWeather(r,d){locationUser.latitude!=r&&locationUser.longitude!=d?document.querySelector(".current-location button").removeAttribute("disabled"):document.querySelector(".current-location button").setAttribute("disabled",""),e(t.forecast(r,d,"days=5"),function(e){i(document.querySelector("main"),"hidden"),i(spinner,"active"),currentWebsiteSection.innerHTML="",highlights.innerHTML="",hourlyForecast.innerHTML="",forecastSection.innerHTML="";let{current:{condition:{icon:t,text:r},temp_c:d,pressure_mb:o,humidity:h,feelslike_c:p,vis_km:u},location:{name:g,localtime:m,country:f},forecast:{forecastday:v}={}}=e,{astro:{sunrise:x,sunset:y}={},hour:w=[],day:{air_quality:{no2:_,o3:b,so2:L,pm2_5:S}}}=v[0],$=document.createElement("div");$.classList.add("card"),$.innerHTML=`
     <h2 class="title-2">Now</h2>
     <div class="wrapper flex items-center">
       <p class="heading">${parseInt(d)}&deg;<sup>c</sup></p>
       <img
         src="${t}"
         alt="${r}"
         width="100"
         height="100"
         class="mx-auto"
       />
     </div>
     <p class="body-3">${r}</p>
     <ul class="meta-list">
       <li class="flex items-center gap-12">
         <i class="fa-regular fa-calendar color-white"></i>
         <span>${c(m)}</span>
       </li>
       <li class="flex items-center gap-12">
         <div class="flex items-center gap-12">
          <i class="fa-solid fa-location-dot color-white"></i>
          <span data-location>${g}, ${f}</span>
         </div>
         <div class="flex-1 flex items-center justify-end">
         <img src="https://www.countryflags.com/wp-content/uploads/${f.split(" ").join("-").toLowerCase()}-flag-png-large.png" loading="lazy" width="30" />
         </div>
       </li>
     </ul>   
    `,currentWebsiteSection.appendChild($);let E=document.createElement("div");E.className="card",E.innerHTML=`
              <div class="title-2">Todays Highlights</div>
              <div class="highlight-list gap-20">
                <div
                  class="card card-sm highlight-card one flex flex-column position-relative"
                >
                  <h3 class="title-3">Air Quality Index</h3>
                  <div class="flex items-center justify-between gap-16 flex-1">
                    <div class="icon">
                      <i class="fa-solid fa-wind"></i>
                    </div>
                    <ul class="card-list flex items-center flex-1 flex-wrap">
                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(S).toFixed(1)}</p>
                        <p class="label-1">PM<sub>2.5</sub></p>
                      </li>

                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(L).toFixed(1)}</p>
                        <p class="label-1">SO<sub>2</sub></p>
                      </li>

                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(_).toFixed(1)}</p>
                        <p class="label-1">NO<sub>2</sub></p>
                      </li>

                      <li class="card-item flex items-center gap-8">
                        <p class="title-1">${Number(b).toFixed(1)}</p>
                        <p class="label-1">O<sub>3</sub></p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card two flex flex-column position-relative"
                >
                  <h3 class="title-3">Sunrise & Sunset</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="sunrise flex items-center flex-1 gap-20">
                      <i class="fa-regular fa-sun"></i>
                      <div class="info">
                        <div class="label-1">Sunrise</div>
                        <div class="title-1">${x}</div>
                      </div>
                    </div>
                    <div class="sunset flex items-center flex-1 gap-20">
                      <i class="fa-regular fa-moon"></i>
                      <div class="info">
                        <div class="label-1">Sunset</div>
                        <div class="title-1">${y}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Humidity</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <img
                        src="./images/humidity.png"
                        alt="humidity"
                        width="40"
                        height="40"
                      />
                    </div>
                    <p class="title-1">${h}<sub>%</sub></p>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Pressure</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <img
                        src="./images/pressure.png"
                        alt="pressure"
                        width="40"
                        height="40"
                      />
                    </div>
                    <p class="title-1">${o}<sub>hpa</sub></p>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Visibility</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <i class="fa-solid fa-eye"></i>
                    </div>
                    <p class="title-1">${u}<sub>km</sub></p>
                  </div>
                </div>
                <div
                  class="card card-sm highlight-card flex flex-column position-relative"
                >
                  <h3 class="title-3">Feels Like</h3>
                  <div class="flex items-center justify-between flex-1">
                    <div class="icon">
                      <img
                        src="./images/temperature.png"
                        alt="temperature"
                        width="40"
                        height="40"
                      />
                    </div>
                    <p class="title-1">${parseInt(p)}&deg;<sup>c</sup></p>
                  </div>
                </div>
              </div>
      `,highlights.appendChild(E),hourlyForecast.innerHTML=`
          <h2 class="title-2">Today at</h2>
          <div class="slider-container">
            <ul class="slider-list flex items-center gap-20" data-temp></ul>
            <ul class="slider-list flex items-center gap-20" data-wind></ul>
          </div>
      `;for(let T=3;T<w.length;T+=3){let{condition:{icon:j,text:C},temp_c:H,time_epoch:M,wind_degree:B,wind_kph:F}=w[T],I=document.createElement("li");I.className="slider-item flex-1",I.innerHTML=`
          <div class="card slider-card flex flex-column items-center">
            <p class="body-3">${n(M)}</p>
            <img
              src="${j}"
              title="${C}"
              alt="${C}"
              width="80"
              height="80"
              loading="lazy"
              class="weather-icon"
            />
            <p class="body-3">${parseInt(H)}&deg;</p>
          </div>
        `,hourlyForecast.querySelector("[data-temp]").appendChild(I);let k=document.createElement("li");k.className="slider-item flex-1",k.innerHTML=`
          <div class="card slider-card flex flex-column items-center">
            <p class="body-3">${n(M)}</p>
            <div class="icon flex items-center justify-center">
              <img
              src="./images/direction.png"
              title="Air Direction"
              alt="Air Direction"
              width="48"
              height="48"
              loading="lazy"
              class="weather-icon direction"
              style="transform: rotate(${B-180}deg);"
              />
            </div>
            <p class="body-3">${parseInt(F)}/h</p>
          </div>
        `,hourlyForecast.querySelector("[data-wind]").appendChild(k)}for(let P of(forecastSection.innerHTML=`
        <h2 class="title-2">5 Days Forecast</h2>
        <div class="card">
          <ul data-forecast-list></ul>
        </div>
      `,v)){let{date_epoch:q,day:{condition:{icon:D,text:U},maxtemp_c:W}}=P,N=new Date(1e3*q),z=document.createElement("li");z.className="card-item flex items-center",z.innerHTML=`
          <div class="icon flex items-center">
            <img
              src="${D}"
              alt="${U}"
              width="60"
              height="60"
              title="${U}"
              loading="lazy"
            />
            <span class="degree">${parseInt(W)}&deg;</span>
          </div>
          <p class="flex-1 text-right">${N.getDate()} ${l[N.getMonth()]}</p>
          <p class="flex-1 text-right">${a[N.getDay()]}</p>
        `,forecastSection.querySelector("[data-forecast-list]").appendChild(z)}s(document.querySelector("main"),"hidden"),setTimeout(()=>{s(spinner,"active")},500)})}