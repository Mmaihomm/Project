<template 
  absolute
>
  <v-card 
    absolute
    tile
    height = 100%
  >
    <Drawer v-bind:station="selected.names" v-bind:weathers="weather" v-bind:isHidden="isHidden"/>
    <section style="position:relative;z-index:1;">
      <div  style="width: 20%; margin: 8px"
      >
      <v-btn 
        rounded
        fab
        elevation="10"
        v-if="!isSearch"
        v-on:click="isSearch = true"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- <v-toolbar
        class = "searching-tab rounded-xl"
        background-color = "white"
        absolute
        fab
        rounded
        dense
        style="top: 8px; left: 8px;"
        
      > -->
      
        <v-autocomplete
          v-if="isSearch"
          hide-details
          floating
          single-line
          rounded
          
          dense
          solo
          placeholder="Enter weather station"
          v-model="selected"
          :items = "station"
          hide-no-data
          clearable
          item-text="names"
          item-value="names"
          return-object
          
          @change="showStationOnTheMap(selected.latitude,selected.longitude)"
        ></v-autocomplete>
      </div>  
          
      <!-- </v-toolbar> -->
      
    </section>
    
    <section 
      id="map"
      v-on:click="isSearch = false"
    >

    </section>
  </v-card>
</template>

<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyBbGY7ji1hmf81p2LbTPHOOgXCroqeEmk8"></script>

<script>
  import axios from 'axios'
  import {apiService} from "../service"
  import Drawer from "../components/NavDraw";

  export default {
    name: "GoogleMap",

    components:{
      Drawer,
    },
    data() {
      
      return {
        isSearch: false,
        isHidden: false,
        selected: {names: 'HS2AR-10', latitude: 15.6454, longitude: 100.2218, id: 1},
        station: [],
        weather: {name:'HS2AR-10', id: 1, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
        /*weathers: [
          {name:'HS2AR-10', id: 1, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 2, temp: 31, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 3, temp: 32, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 4, temp: 33, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 5, temp: 34, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 6, temp: 35, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 7, temp: 36, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 8, temp: 37, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 9, temp: 38, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 10, temp: 39, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 11, temp: 40, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 12, temp: 41, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
        ],*/
        all: [],

      };
    },

    beforeCreate(){
      
    },
    created(){
    },

    beforeMount(){
      
    },
    
    mounted() {
      // new google.maps.places.Autocomplete(
      //   document.getElementById("autocomplete")
      // )
      
      
      this.locatorButtonPressed();

    },


    methods: {
      async getWeatherStation(){
      let station = await apiService.stationList()
      return station
    },
      getWeather(stationName){
        return  apiService.weatherData(stationName)
        
      },

      getPM(stationName){
        return apiService.pmData(stationName)
      },
      
      locatorButtonPressed() {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              this.getAddressFrom(
                position.coords.latitude,
                position.coords.longitude
              );

              this.showStationOnTheMap(
                position.coords.latitude,
                position.coords.longitude
              );
            }, 
            error => {
              console.log(error.message); 
            }
          );
        }
        else {
          console.log("Your browser does not support geolocation API");
        }
      },

      getAddressFrom(lat, long) {
        axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
          + lat + "," 
          + long 
          + "&key=AIzaSyBbGY7ji1hmf81p2LbTPHOOgXCroqeEmk8").then(response => {
            if(response.data.error_message) {
              console.log(response.data.error_message);
            }
            else {
              this.stations = response.data.results[0].formatted_address
            }
          })
          .catch(error => {
            console.log(error.message);
          })
      },
      
      async showStationOnTheMap(latitude, longitude) {
        // Create a map object
        let map = new google.maps.Map(document.getElementById("map"), {
          zoom: 10,
          minZoom: 6,
          maxZoom: 13,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
          },
        });

        const infoWindow = new google.maps.InfoWindow();

        this.all = await this.getWeatherStation();
        this.station = this.all.map((element)=>{
             
          return {names:element.name + ' (จังหวัด)',latitude:element.lat,longitude:element.lng,};
        });
        // Add Marker
        for(let i=0; i < this.all.length; i++) {
          const lat = this.all[i].lat;
          const lng = this.all[i].lng;

          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            animation: google.maps.Animation.DROP,
            map: map
          })

          
          
          google.maps.event.addListener(marker, "mouseover", () => {
            infoWindow.setContent(
              `<div id="stationName" style="font-weight:bold; font-size:16px;">${this.station[i].names}</div><br>`+
              `<div style="position: left;"><div id="temp" style="font-size:14px">Temperature : ${this.weather.temp}  ํC</div>`+
              `<div id="humid" style="font-size:14px">Humidity : ${this.weathers[i].humid} %</div>`+
              `<div id="press" style="font-size:14px">Pressure : ${this.weathers[i].press} mbar</div></div>`+
              `<div style="position: left;"><div id="pm1" style="font-size:14px">PM 1.0 ${this.weathers[i].pm1} ug/m3</div>`+
              `<div id="pm25" style="font-size:14px">PM 2.5 ${this.weathers[i].pm25} ug/m3</div>`+
              `<div id="pm10" style="font-size:14px">PM 10 ${this.weathers[i].pm10} ug/m3</div></div>`
              );
            infoWindow.open(map, marker);
          })

          google.maps.event.addListener(marker, "click", () => {
            this.selected = this.all[i];
            this.weather = this.weathers[i];
            this.isHidden = true;
          })
        }

      }
    }
  };

</script>

<style scoped>
  #map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(77,133,233,0.95);
  }

  #stationName {
    font-weight: bold;
  }
</style>