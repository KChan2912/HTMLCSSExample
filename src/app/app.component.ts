import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService} from './api.service';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {TableDisplayComponent} from "./table-display/table-display.component";
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import {MatSelectModule}  
    from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field'

declare var Highcharts:any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, CommonModule, MatTabsModule, GoogleMapsModule, MapAdvancedMarker, MatSelectModule, MatFormFieldModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  
  @ViewChild('daily-table') dailytable?: ElementRef;
  @ViewChild('myForm') child?: NgForm;
  states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];
stateCodes = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
    "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
    "WV", "WI", "WY"
];
  autodetect: boolean = false;
  dataLoaded?: boolean = false;
  isError?:boolean = false;
  isDetailsOpen:boolean = false;
  message: string = '';
  formData = {street: '', city: '', state: ''};
  jsonData: any;
  dailyData: any;
  city: any;
  state: any;
  lat:any;
  lng:any;
  detailsDay:any;
  description:any;
  icon:any;
  keys: string[] = [];
  hourlyData:any;
  constructor(private apiService: ApiService){}

  getDescandIcon(weathercode:any){
    if(weathercode==1000)
    {this.description = 'Clear'; this.icon= '../assets/clear_day.svg'; }else if
    (weathercode==1001){this.description = 'Cloudy'; this.icon= '../assets/cloudy.svg'; }else if
    (weathercode==1100){this.description = 'Mostly Clear'; this.icon= '../assets/mostly_clear_day.svg'; }else if
    (weathercode==1101){this.description = 'Partly Cloudy'; this.icon= '../assets/partly_cloudy_day.svg' ;}else if
    (weathercode==1102){this.description = 'Mostly Cloudy'; this.icon= '../assets/mostly_cloudy.svg'; }else if
    (weathercode==4200){this.description = 'Light Rain'; this.icon= '../assets/rain_light.svg';}else if
    (weathercode==5000){this.description = 'Snow'; this.icon= '../assets/rain_light.svg';}else if
    (weathercode==6000){this.description = 'Freezing Drizzle'; this.icon= '../assets/freezing_drizzle.svg';}else if
    (weathercode==6001){this.description = 'Freezing Rain'; this.icon= '../assets/freezing_rain.svg';}else if
    (weathercode==7000){this.description = 'Strong Winds'; this.icon= '../assets/strong_wind.svg';}else if
    (weathercode==7101){this.description = 'Windy'; this.icon= '../assets/wind.png'; }else if
    (weathercode==8000){this.description = 'Thunderstorms'; this.icon= '../assets/tstorm.svg';}else
    {this.description = 'NOT VALID STATUS'; this.icon= '../assets/tstorm.svg';}
}

  title = 'weather-app';

  getHourlyData(){
    const progBar = document.getElementById("progress-bar") as HTMLElement;
    progBar.style.width = "67%";
    this.apiService.pushForm2(this.lat, this.lng)
        .subscribe(response => {
            console.log('Form submitted:', response);
            
            this.savehourly(response);
        });

  }
  savehourly(data: any){
    this.jsonData = data;
    this.hourlyData = this.jsonData.data.timelines[0].intervals;
    console.log(this.hourlyData);
    
    this.formatTable();
    this.getDetailedData(0);
  }
  getDetailedData(i:any)
  {
    if(this.dailyData){
    console.log(i);
    this.jsonData = this.dailyData[i];
    const date = new Date(this.jsonData.startTime).toLocaleDateString('en-US',{ weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'});
    this.detailsDay = i;
    const tempHigh = this.jsonData.values.temperatureMax;
    const tempLow = this.jsonData.values.temperatureMin;
    const tempApp = this.jsonData.values.temperatureApparent;
    const sunrise = this.jsonData.values.sunriseTime;
    const sunset = this.jsonData.values.sunsetTime;
    const sunsetTime = new Date(sunset).toLocaleTimeString('en-US', {hour: 'numeric', hour12: true,});
    const sunriseTime = new Date(sunrise).toLocaleTimeString('en-US', {hour: 'numeric', hour12: true,});
    const humidity = this.jsonData.values.humidity;
    const visibility = this.jsonData.values.visibility;
    const cloudcover = this.jsonData.values.cloudCover;
    const wind = this.jsonData.values.windSpeed;
    const weathercode = this.jsonData.values.weatherCode;
    this.getDescandIcon(weathercode);
    const detailedtablebody = document.getElementById("DetailedTableTableBody") as HTMLElement;
    const detaileddate = document.getElementById("DetailedDatePlaceHolder") as HTMLElement;
    detaileddate.innerHTML = `${date}`;
    const td = detailedtablebody.querySelectorAll('td');
    if(td)
    {
        td.forEach((x)=>{
            if (x.id == "DetailedMaxTemp" )
            {
                x.innerHTML=`${tempHigh}°F`;
            }
            else if (x.id == "DetailedStatus" )
                {
                    x.innerHTML=`${this.description}`;
                }
            else if (x.id == "DetailedMinTemp" )
                {
                    x.innerHTML=`${tempLow}°F`;
                }
            else if (x.id == "DetailedAppTemp" )
                {
                    x.innerHTML=`${tempApp}°F`;
                }
            else if (x.id == "SunRiseTime" )
                {
                    x.innerHTML=`${sunriseTime}`;
                }
            else if (x.id == "SunSetTime" )
                {
                    x.innerHTML=`${sunsetTime}`;
                }
            else if (x.id == "WindSpeed" )
                {
                    x.innerHTML=`${wind}`;
                }
            else if (x.id == "Humidity" )
                {
                    x.innerHTML=`${humidity}%`;
                }
                else if (x.id == "Visibility" )
                {
                    x.innerHTML=`${visibility}`;
                }
                else if (x.id == "CloudCover" )
                {
                    x.innerHTML=`${cloudcover}`;
                }
        }
        
        
        
        
        )
    }
    this.initMap();
    
    }

  }
  initMap() {
    let lat = parseFloat(this.lat ?? '0')
    let lng = parseFloat(this.lng ?? '0')
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        zoom: 14,
        center: { lat: lat, lng: lng },
    });
    

    new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map: map,
    });

}

  formatTable(){
    for(let i=0; i<this.dailyData.length; i++)
    {
        
        const p = document.getElementById("resulttitle") as HTMLElement;
      p.innerHTML = `Forecast at ${this.formData.city}, ${this.formData.state}`
      this.jsonData = this.dailyData[i];
      console.log(this.jsonData);
      const weathercode = this.jsonData.values.weatherCode;
      this.getDescandIcon(weathercode);
      console.log(this.description);
      const date = new Date(this.jsonData.startTime).toLocaleDateString('en-US',{ weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'})
      const tempHigh = this.jsonData.values.temperatureMax;
      const tempLow = this.jsonData.values.temperatureMin;
      const wind = this.jsonData.values.windSpeed;
      const tablebody = document.getElementById("dailytable") as HTMLElement;
      console.log(tablebody.innerHTML);
        var newRow = `<tr id="${i}">
                  <th scope="row">${i+1}</th>
                  <td id="${i}">${date}</td>
                  <td id="${i}">${this.description}<img src=${this.icon} style="height:50px;"></td>
                  <td id="${i}">${tempHigh}</td>
                  <td id="${i}">${tempLow}</td>
                  <td id="${i}">${wind}</td>
                  
                </tr>`
      tablebody.innerHTML= tablebody.innerHTML + newRow;

      
      


    }
    const tablebody = document.getElementById("dailytable") as HTMLElement;
    const td = tablebody.querySelectorAll('tr');
      if(td){
        td.forEach((x,index)=>{x.addEventListener('click', (e) => {console.log(e); this.getDetailedData(index); this.Slide();});});
        
      }
      
      
        this.createCharts();
        const progBar = document.getElementById("progress-bar") as HTMLElement;
        progBar.style.width = "75%";
        if(!this.dataLoaded)
        {
            const progBar = document.getElementById("progress-bar") as HTMLElement;
            progBar.style.width = "100%";
            this.showresults();
            this.hideBar();
            this.dataLoaded = true;
        }
        
    
  }

  Slide(){
    this.isDetailsOpen=!this.isDetailsOpen;
    console.log(this.isDetailsOpen);
    const slidingdiv = document.getElementById("slidingdiv") as HTMLElement;
    var contains = slidingdiv.classList.contains("slidein");
    var contains2 = slidingdiv.classList.contains("slideout");
    if(!contains && !contains2)
    {
        slidingdiv.classList.toggle("slideout");
    }
    slidingdiv.classList.toggle("slidein");
    slidingdiv.classList.toggle("slideout");
    

  }
  createCharts(){
    Highcharts.chart('temp-minmax', {
      chart: {
          type: 'arearange',
          zoomType: 'x',
          scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1,
          },
          },
          title: {
              text: 'Temperature Range (Min, Max)',
          },
          xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
              day: '%e %b',
              },
          },
          yAxis: {
              title: {
              text: 'Temperature (°F)',
          },
          },
          tooltip: {
              crosshairs: true,
              shared: true,
              valueSuffix: '°F',
          },
          legend: {
              enabled: false,
          },
          series: [
          {
              name: 'Temperature',
              data: this.dailyData.map((day:any) => [
                  new Date(day.startTime).getTime(),
                  day.values.temperatureMin,
                  day.values.temperatureMax,
              ]),
              fillColor: {
                  linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 0.7,
                  },
                  stops: [
                  [0, 'rgba(247, 155, 32, 0.9)'],
                  [1, 'rgba(196, 228, 251, 0.9)'],
                  ],
              },
              lineColor: '#FFA500',
              marker: {
                  enabled: true,
                  radius: 4,
                  fillColor: '#00aaff',
              },
          },
          ],
      });
    const hValues = this.hourlyData;

    Highcharts.chart('hourly-weather', {
        chart: {
            zoomType: 'xy',
            },
        title: {
            text: 'Hourly Weather (For Next 5 Days)',
        },
        xAxis: [{ 
            type: 'datetime',
            tickInterval: 6 * 36e5,
            minorTickInterval: 36e5,
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 40,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, {
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: ' +
                    'bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: 8
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],
        /*xAxis: [
            {
                showEmpty:true,
                //opposite:true,
                type: 'datetime',
                tickInterval: 36e5,
                gridLineWidth: 1,
                lineWidth: 0,
                tickWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                labels: {
                format: '{value:%H}',
                step: 6,
            },
            crosshair: true,
  
            },
        ],*/
        yAxis: [
            {
                showEmpty: true,
                lineWidth: 0,
                tickWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                title: {
                text: 'Temperature (°F)',
                },
                labels: {
                format: '{value}°',
                step:10,
                },
                min: 0,
                max: 100,
                gridLineColor: '#e0e0e0',
                gridLineWidth: 1,
            },
        {
            title: {
            text: 'Pressure (inHg)',
            },
            labels: {
                format: '{value}',
                style: {
                color: '#FFA500',
                },
            },
            opposite: true,
            min: 20,
            max: 40,
            gridLineWidth: 0,
        },
        ],
        tooltip: {
            shared: true,
        },
        series: [
            {
                name: 'Temperature',
                type: 'spline',
                yAxis: 0,
                data: hValues.map((hour:any) => [
                    new Date(hour.startTime).getTime(),
                    Math.round(hour.values.temperature),
                ]),
                tooltip: {
                    valueSuffix: ' °F',
                },
                color: '#FF0000',
                lineWidth: 1,
            },
            {
                name: 'Humidity',
                type: 'column',
                yAxis: 0,
                data: hValues.map((hour:any) => [
                new Date(hour.startTime).getTime(),
                hour.values.humidity,
                ]),
                tooltip: {
                    valueSuffix: ' %',
                },
                color: 'rgba(135, 206, 235, 0.5)',
                borderColor: '#00aaff',
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    /*formatter: function () {
                        return this.point.index % 1 === 0 ? Math.round(this.y) : '';
                    },*/
                    style: {
                        color: '#000000',
                    },
                },
            },
            
            {
                name: 'Air Pressure',
                type: 'spline',
                yAxis: 1,
                data: hValues.map((hour:any) => [
                    new Date(hour.startTime).getTime(),
                    hour.values.pressureSeaLevel,
                ]),
                tooltip: {
                    valueSuffix: ' inHg',
                },
                color: '#FFA500',
                lineWidth: 1,
            },
            {
                
                name: 'Wind Speed',
                type: 'windbarb',
                pointPlacement:'on',
                data: hValues.map((hour:any, index:any) => {
                    return index % 2 === 0? [new Date(hour.startTime).getTime(),
                        hour.values.windSpeed,
                        hour.values.windDirection,
                    ]: null;
                }).filter(Boolean),
                vectorLength: 10,
                lineWidth:1.5,
                color: '#0000FF',
                tooltip: {
                    valueSuffix: ' mph',
                },
            },
        ],
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
        },
    });
  }

  savedaily(data: any){
    if(this.autodetect){
        this.jsonData = data.weatherjson;
    }
    else{
        this.jsonData = data;
    }
    console.log("here");
    console.log(this.jsonData);
    this.lat = this.jsonData.lat;
    this.lng = this.jsonData.lng;
    this.formData.city = this.jsonData.city;
    this.formData.state = this.jsonData.state;
    this.dailyData = this.jsonData.data.timelines[0].intervals;
    if(this.dailyData){
        //this.dataLoaded=true;
    console.log(this.dailyData);
    this.getHourlyData();

    }
    else{
        this.isError=true;
        console.log("ErrorOccured");
    }
    
  }

  hideBar(){
    const progBarBox = document.getElementById("progressBarBox") as HTMLElement;
    progBarBox.classList.toggle("hidden");
  }
  showBar(){
    const progBarBox = document.getElementById("progressBarBox") as HTMLElement;
    progBarBox.classList.toggle("hidden");

    const progBar = document.getElementById("progress-bar") as HTMLElement;
    progBar.style.width = "25%";
  }
  onSubmit() {
    const tablebody = document.getElementById("dailytable") as HTMLElement;
    tablebody.innerHTML=``;
    this.dataLoaded=false;
    this.showBar();
    if(this.autodetect){
      this.apiService.pushIP().subscribe(response=>{
        console.log(response);
        this.savedaily(response);
      });
    }
    else{
      this.apiService.pushForm(this.formData)
        .subscribe(response => {
            console.log('Form submitted:', response);
            this.savedaily(response);
        });

    }
    
  }
  showresults(){
    const slidingdiv = document.getElementById("mainresultscontainer") as HTMLElement;
    //slidingdiv.classList.toggle("hidden");
    slidingdiv.style.display = "block";
    const aslidingdiv = document.getElementById("slidingdiv") as HTMLElement;
    aslidingdiv.classList.toggle("slidein");
    //aslidingdiv.classList.toggle("slideout");
    aslidingdiv.style.animationPlayState = "running";
    var contains = aslidingdiv.classList.contains("slidein");
    console.log(contains);
    //aslidingdiv.classList.toggle("slideout");
  }
  tweet() {
    console.log("HI");
    let day = this.dailyData[this.detailsDay];
    let date = new Date(day.startTime).toLocaleDateString('en-US',{ weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'});
    let dateParts = date.split(" ")
    date = dateParts[0] + " " + dateParts[2] + ". " + dateParts[3] + ", " + dateParts[4]
    let link = document.getElementById("tweet") as HTMLAnchorElement;
    link.href = `https://twitter.com/intent/tweet?text=The%20temperature%20in%20${this.formData.city},%20${this.formData.state}%20on%20${date}%20is%20${day?.values?.temperature}°F%20and%20the%20conditions%20are%20${this.description}%20&hashtags=CSCI571WeatherSearch`;
}
  resetForm() {
    if(this.child)
    { 
      
      console.log(this.formData);
      console.log(this.autodetect);
      this.dataLoaded=false;
      this.child.resetForm();
      const slidingdiv = document.getElementById("mainresultscontainer") as HTMLElement;
      slidingdiv.style.display = "none";

    }

    
  }
  disableForm(){
    this.formData = {street: '', city: '', state: ''};
    
    
  }
}
