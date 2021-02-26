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

      <div
        id="toggleMap"
      >
        <v-btn
          id="geo-btn"
          v-on:click="isHeatmap=false; showStationOnTheMap(userLocat.latitude,userLocat.longitude)"
        >
          Geolocation
        </v-btn>

        <v-btn
          id="heatmap-btn"
          v-on:click="isHeatmap=true; showStationOnTheMap(userLocat.latitude,userLocat.longitude)"
        >
          Heatmap
        </v-btn>
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


<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBbGY7ji1hmf81p2LbTPHOOgXCroqeEmk8&libraries=places,visualization" async=""></script>

<script>
  import axios from 'axios'
  import {apiService} from "../service"
  import Drawer from "../components/NavDraw";

  let map, heatmap;
  
  export default { 
    name: "GoogleMap",

    components:{
      Drawer,
    },
    data() {
      
      return {
        isSearch: false,
        isHidden: false,
        isHeatmap: false,
        userLocat: {latitude: null, longitude: null},
        selected: {names: 'HS2AR-10', latitude: 15.6454, longitude: 100.2218, id: 1},
        station: [],
        weather: {name:'HS2AR-10', id: 1, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
        weathers: [
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
        ],
        all: [],
        point: [],
        test: [
          {names: 'HS2AR-10', latitude: 15.6454, longitude: 100.2218},
          {names: 'HS2AR-10', latitude: 13.6454, longitude: 105.2218},
          {names: 'HS2AR-10', latitude: 11.6454, longitude: 102.2218},
          {names: 'HS2AR-10', latitude: 10.6454, longitude: 103.2218},
          {names: 'HS2AR-10', latitude: 11.6454, longitude: 107.2218},
          {names: 'HS2AR-10', latitude: 15.6454, longitude: 105.2218},
          {names: 'HS2AR-10', latitude: 14.6454, longitude: 104.2218},
        ],

      };
    },

    beforeCreate(){
      
    },
    created(){
    },

    beforeMount(){
      
    },
    
    mounted() {
      this.showUserLocationOnTheMap();
      // this.geocodeLatlng();
      this.getDataWeather();
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

      async getDataWeather() {
        this.all = await this.getWeatherStation();

        // Add province to each station 
        for(let i = 0; i < this.all.length; i++) {          
          this.geocodeLatlng(this.all[i].latitude, this.all[i].longitude, i);
        }

        this.station = this.all.map((element)=>{
          return {names:element.name + ' (จังหวัด)',latitude:element.lat,longitude:element.lng,};
        });
      },

      geocodeLatlng(latitude, longitude, id) {  // Get lat long from station and return city
        // Get address from geocoder
        const geocoder = new google.maps.Geocoder();
        const latlng = {
          lat: latitude, //13.7289596, 
          lng: longitude, //100.2218, 
        };

        // geocoder.geocode({locat}, (results, status) => {});
        geocoder.geocode(
          { location: latlng },
          (
            results,
            status
          ) => {
            if (status === "OK") {
              if (results[0]) {
                // Search for province
                for(let i = 0; i < 10; i++) {
                  if(results[0].address_components[i].types[0] == "administrative_area_level_1") {
                    var rs = results[0].address_components[i].long_name;
                    // console.log(results[0].address_components[i].long_name)
                    break;
                  }
                }
                // console.log(rs);
                this.all[id].locat = rs
                console.log(this.all[id])

              } else {
                window.alert("No results found");

              }
            } else {
              window.alert("Geocoder failed due to: " + status);
            }
          }
        );
      },
      
      // Get current position and set center
      showUserLocationOnTheMap() {
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

      // Get user location
      getAddressFrom(lat, long) {
        this.userLocat.latitude = lat
        this.userLocat.longitude = long
        // console.log(this.userLocat.latitude,this.userLocat.longitude)
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
      
      showStationOnTheMap(latitude, longitude) {
        // Create a map object
        map = new google.maps.Map(document.getElementById("map"), {
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

        console.log(this.isHeatmap)

        this.isHeatmap ? this.showHeatmap() : this.showMarker()

      },

      showMarker() {
        console.log("Marker Mode!")
        const infoWindow = new google.maps.InfoWindow();
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
      },

      showHeatmap() {
        console.log("Heatmap Mode!")
        const gradient = [
          "rgba(0, 255, 255, 0)",
          "rgba(0, 255, 255, 1)",
          "rgba(0, 191, 255, 1)",
          "rgba(0, 127, 255, 1)",
          "rgba(0, 63, 255, 1)",
          "rgba(0, 0, 255, 1)",
          "rgba(0, 0, 223, 1)",
          "rgba(0, 0, 191, 1)",
          "rgba(0, 0, 159, 1)",
          "rgba(0, 0, 127, 1)",
          "rgba(63, 0, 91, 1)",
          "rgba(127, 0, 63, 1)",
          "rgba(191, 0, 31, 1)",
          "rgba(255, 0, 0, 1)",
        ];
        // Set heatmap
        // this.point.push(this.point.push(new google.maps.LatLng(37.782, -122.447)))
        // console.log(this.point)
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: this.getPoints(),
          map: map
        });
        heatmap.set("radius", 50);
        heatmap.set("gradient", gradient)
      },

      getPoints() {
        console.log("Getting data point for heatmap")
        var heatMapData = [
          {location: new google.maps.LatLng(15.6454, 100.2218), weight: 0.5},
          new google.maps.LatLng(13.5780, 100.3920),
          {location: new google.maps.LatLng(13.5320, 100.3270), weight: 2},
          {location: new google.maps.LatLng(13.5269, 100.3004), weight: 3},
          {location: new google.maps.LatLng(13.4304, 100.3544), weight: 2},
          new google.maps.LatLng(13.4753, 100.1775),
          {location: new google.maps.LatLng(13.4753, 100.1775), weight: 0.5},

          {location: new google.maps.LatLng(13.4206, 101.0326), weight: 3},
          {location: new google.maps.LatLng(13.5780, 100.3920), weight: 2},
          new google.maps.LatLng(13.4764, 100.0689),
          {location: new google.maps.LatLng(13.2995, 100.1210), weight: 0.5},
          new google.maps.LatLng(14.0248, 99.3047),
          {location: new google.maps.LatLng(14.1669, 99.1363), weight: 2},
          {location: new google.maps.LatLng(15.2054, 100.0359), weight: 3}
        ];
        return heatMapData
      },




    // End methods
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

  #toggleMap {
    position: absolute;
    top: 8px;
    left: 45%;
    border-radius: 20px;
  }

  #geo-btn{
    width: 50%;
    border-radius: 20px 0px 0px 20px;
    background: rgba(0, 50, 138, 0.8);
    color: white;
    opacity: 0.9;
  }

  #heatmap-btn{
    width: 50%;
    border-radius: 0px 20px 20px 0px;
    opacity: 0.9;
  }

  #stationName {
    font-weight: bold;
  }
</style>