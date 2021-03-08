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

      <v-col
        cols="12"
        class="py-2"
        align="center"
        v-if="isHeatmap"
        
      >
        <v-btn-toggle
          v-model="wx_type"
          mandatory
          color="deep-purple accent-3"
          group
        >
          <v-btn 
            value= 0
            v-on:click="wx_type = 0; deleteHeatmap(); showHeatmap()">
            Temperature
          </v-btn>

          <v-btn 
            value= 1
            v-on:click="wx_type = 1; deleteHeatmap(); showHeatmap()">
            Humidity
          </v-btn>

          <v-btn 
            value= 2
            v-on:click="wx_type = 2; deleteHeatmap(); showHeatmap()">
            Pressure
          </v-btn>

          <v-btn 
            value= 3
            v-on:click="wx_type = 3; deleteHeatmap(); showHeatmap()">
            PM 1.0
          </v-btn>

          <v-btn 
            value= 4
            v-on:click="wx_type = 4; deleteHeatmap(); showHeatmap()">
            PM 2.5
          </v-btn>

          <v-btn 
            value= 5
            v-on:click="wx_type = 5; deleteHeatmap(); showHeatmap()">
            PM 10
          </v-btn>

        </v-btn-toggle>
      </v-col>

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
        weathers: [],
        allStation: [],
        point: [],
        wx_type: 0,

      };
    },

    beforeCreate(){
      
    },
    created(){
    },

    beforeMount(){
      
    },
    
    mounted() {
      this.getWeatherStation().then(()=>{
        this.showUserLocationOnTheMap();
      });
      // this.getWeather(this.allStation);
      
      // this.showStationOnTheMap(this.userLocat.latitude, this.userLocat.longitude)
      // this.geocodeLatlng();
    },


    methods: {
      async getWeatherStation(){
        this.allStation = await apiService.stationList()
        // console.log(this.allStation)
        await this.setAllStation();
        this.showStationInSearch()
        // return station
      },

      async getWeather(stationName){
        var temp = await apiService.weatherData(stationName);
  
        this.weathers.push(temp);
  
      },

      getPM(stationName){
        return apiService.pmData(stationName)
      },

      // async getDataWeather() {
      //   this.allStation = await this.getWeatherStation();
      // },

      async setAllStation() {
        // console.log(this.allStation)
        // Add province to each station 
        for(let i = 0; i < this.allStation.length; i++) {
          await  this.getWeather(this.allStation[i].name)
                         
          // this.geocodeLatlng(this.allStation[i].lat, this.allStation[i].lng, i);
        }
        // console.log('--> Print weathers');
        // console.log(this.weathers);

      },

      showStationInSearch() {
        this.station = this.allStation.map((element)=>{
          return {names:element.name + ' (จังหวัด)',latitude:element.lat,longitude:element.lng,};
        })
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
                this.allStation[id].locat = rs
                console.log(this.allStation[id].locat)

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
        // axios.get(
        //   "https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
        //   + lat + "," 
        //   + long 
        //   + "&key=AIzaSyBbGY7ji1hmf81p2LbTPHOOgXCroqeEmk8").then(response => {
        //     if(response.data.error_message) {
        //       console.log(response.data.error_message);
        //     }
        //     else {
        //       this.stations = response.data.results[0].formatted_address
        //     }
        //   })
        //   .catch(error => {
        //     console.log(error.message);
        //   })
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

        // console.log(this.isHeatmap)
        this.isHeatmap ? this.showHeatmap() : this.showMarker()
      },

      showMarker() {
        console.log("Marker Mode!")
        const infoWindow = new google.maps.InfoWindow();
        // console.log(this.weathers)
        // Add Marker

        var marker = [];
        for(let i=0; i < this.allStation.length; i++) {

          // console.log(this.allStation[i], this.weathers[i])

          const lat = this.allStation[i].lat;
          const lng = this.allStation[i].lng;
          if(this.weathers[i] != undefined){
            marker.push(new google.maps.Marker({
                  position: new google.maps.LatLng(lat, lng),
                  animation: google.maps.Animation.DROP,
                  map: map
                }));

                // console.log("Marker = ",marker);
                google.maps.event.addListener(marker[i], "mouseover", (event,weathers = this.weathers , index = i) => {
                    infoWindow.setContent(
                    `<div id="stationName" style="font-weight:bold; font-size:16px;">${weathers[index].name}</div><br>`+
                    `<div style="position: left;"><div id="temp" style="font-size:14px">Temperature : ${weathers[index]?.temp}  ํC</div>`+
                    `<div id="humid" style="font-size:14px">Humidity : ${ (weathers[index].humidity != undefined)?weathers[index].humidity:'N/A'} %</div>`+
                    `<div id="press" style="font-size:14px">Pressure : ${(weathers[index].pressure != undefined)?weathers[index].pressure:'N/A'} mbar</div></div>`+
                    `<div style="position: left;"><div id="pm1" style="font-size:14px">PM 1.0 ${ (weathers[index].pm1 != undefined)?weathers[index].pm1:'N/A'} ug/m3</div>`+
                    `<div id="pm25" style="font-size:14px">PM 2.5 ${(weathers[index].pm2_5 != undefined)?weathers[index].pm2_5:'N/A'} ug/m3</div>`+
                    `<div id="pm10" style="font-size:14px">PM 10 ${(weathers[index].pm10 != undefined)?weathers[index].pm10:'N/A'} ug/m3</div></div>`
                    );
                  // infoWindow.setBackgroundColor("rgb(153, 255, 73)");
                  infoWindow.open(map, marker[i]);
                })
                google.maps.event.addListener(marker[i], "click", () => {
                  this.selected = this.allStation[i];
                  this.weather = this.weathers[i];
                  this.isHidden = true;
                });
          }
   
        }
      },

      showHeatmap() {
        console.log("Heatmap Mode!");
        // const wx_type = 0;
        const gradient = [
          [
            // Temp
            "rgba(255, 255, 155, 1)",
            "rgba(255, 255, 0, 1)",
            "rgba(255, 225, 0, 1)",
            "rgba(255, 200, 0, 1)",
            "rgba(255, 170, 0, 1)",
            "rgba(255, 145, 0, 1)",
            "rgba(255, 100, 0, 1)",
            "rgba(255, 80, 0, 1)",
            "rgba(245, 0, 0, 1)",
            "rgba(220, 0, 0, 1)",
            "rgba(145, 0, 0, 1)",
            "rgba(110, 0, 0, 1)",
          ],
          // Humid
          [
            "rgba(155, 255, 255, 1)",
            "rgba(0, 225, 255, 1)",
            "rgba(0, 200, 255, 1)",
            "rgba(0, 170, 255, 1)",
            "rgba(0, 145, 255, 1)",
            "rgba(0, 100, 255, 1)",
            "rgba(0, 60, 255, 1)",
            "rgba(0, 0, 255, 1)",
            "rgba(0, 0, 200, 1)",
            "rgba(0, 0, 150, 1)",
            "rgba(0, 0, 100, 1)",
            "rgba(0, 0, 50, 1)",
          ],
          // Press
          [
            "rgba(155, 255, 180, 1)",
            "rgba(0, 255, 180, 1)",
            "rgba(0, 255, 160, 1)",
            "rgba(0, 255, 130, 1)",
            "rgba(0, 255, 100, 1)",
            "rgba(0, 255, 80, 1)",
            "rgba(0, 255, 50, 1)",
            "rgba(0, 255, 10, 1)",
            "rgba(0, 255, 0, 1)",
            "rgba(0, 200, 0, 1)",
            "rgba(0, 150, 0, 1)",
            "rgba(0, 110, 0, 1)",
            "rgba(0, 70, 0, 1)",
          ],
          // PM 1.0
          [
            "rgba(255, 155, 255, 1)",
            "rgba(255, 100, 255, 1)",
            "rgba(255, 80, 255, 1)",
            "rgba(255, 50, 255, 1)",
            "rgba(255, 25, 255, 1)",
            "rgba(225, 0, 225, 1)",
            "rgba(190, 0, 190, 1)",
            "rgba(175, 0, 175, 1)",
            "rgba(150, 0, 150, 1)",
            "rgba(125, 0, 125, 1)",
            "rgba(90, 0, 90, 1)",
            "rgba(75, 0, 75, 1)",
            "rgba(60, 0, 60, 1)",
          ],
          // PM 2.5
          [
            "rgba(255, 193, 128, 1)",
            "rgba(255, 181, 102, 1)",
            "rgba(255, 169, 77, 1)",
            "rgba(255, 156, 51, 1)",
            "rgba(255, 144, 26, 1)",
            "rgba(255, 132, 0, 1)",
            "rgba(230, 119, 0, 1)",
            "rgba(204, 105, 0, 1)",
            "rgba(179, 92, 0, 1)",
            "rgba(153, 79, 0, 1)",
            "rgba(128, 66, 0, 1)",
            "rgba(102, 53, 0, 1)",
            "rgba(77, 40, 0, 1)",
          ],
          // PM 10 
          [
            "rgba(255, 245, 204, 1)",
            "rgba(255, 240, 179, 1)",
            "rgba(255, 235, 153, 1)",
            "rgba(255, 230, 128, 1)",
            "rgba(255, 224, 102, 1)",
            "rgba(255, 219, 77, 1)",
            "rgba(255, 214, 51, 1)",
            "rgba(255, 209, 26, 1)",
            "rgba(255, 204, 0, 1)",
            "rgba(230, 184, 0, 1)",
            "rgba(204, 163, 0, 1)",
            "rgba(179, 143, 31, 1)",
            "rgba(153, 122, 0, 1)",
          ],
        ];

        this.getPoints();
        // Set heatmap
        // this.point.push(this.point.push(new google.maps.LatLng(37.782, -122.447)))
        // console.log(this.point)
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: this.point,
          map: map
        });
        heatmap.set("radius", 50);
        heatmap.set("gradient", gradient[this.wx_type])
      },

      deleteHeatmap() {
        heatmap.setMap(null);
        heatmap.setData([]);
      },

      getPoints() {
        console.log("Getting data point for heatmap")
        this.point = [];
        // temp
        if( this.wx_type == 0) {
          for(let i = 0; i < this.allStation.length; i++) {
            if (this.weathers[i] != undefined) {
              console.log(this.allStation[i].lat, this.allStation[i].lng, this.weathers[i].temp)
              this.point.push({location: new google.maps.LatLng(this.allStation[i].lat, this.allStation[i].lng), weight: (this.weathers[i].temp != undefined)?this.weathers[i].temp:0})
            } 
          }
        }
        // humid
        if( this.wx_type == 1) {
          for(let i = 0; i < this.allStation.length; i++) {
            if (this.weathers[i] != undefined) {
              console.log(this.allStation[i].lat, this.allStation[i].lng, this.weathers[i].humidity)
              this.point.push({location: new google.maps.LatLng(this.allStation[i].lat, this.allStation[i].lng), weight: (this.weathers[i].humidity != undefined)?this.weathers[i].humidity:0})
            } 
          }
        }
        // press
        if( this.wx_type == 2) {
          for(let i = 0; i < this.allStation.length; i++) {
            if (this.weathers[i] != undefined) {
              console.log(this.allStation[i].lat, this.allStation[i].lng, this.weathers[i].pressure)
              this.point.push({location: new google.maps.LatLng(this.allStation[i].lat, this.allStation[i].lng), weight: (this.weathers[i].pressure != undefined)?this.weathers[i].pressure:0})
            } 
          }
        }
        // pm 1.0
        if( this.wx_type == 3) {
          for(let i = 0; i < this.allStation.length; i++) {
            if (this.weathers[i] != undefined) {
              console.log(this.allStation[i].lat, this.allStation[i].lng, this.weathers[i].pm1)
              this.point.push({location: new google.maps.LatLng(this.allStation[i].lat, this.allStation[i].lng), weight: (this.weathers[i].pm1 != undefined)?this.weathers[i].pm1:0})
            } 
          }
        }
        // pm 2.5
        if( this.wx_type == 4) {
          for(let i = 0; i < this.allStation.length; i++) {
            if (this.weathers[i] != undefined) {
              console.log(this.allStation[i].lat, this.allStation[i].lng, this.weathers[i].pm2_5)
              this.point.push({location: new google.maps.LatLng(this.allStation[i].lat, this.allStation[i].lng), weight: (this.weathers[i].pm2_5 != undefined)?this.weathers[i].pm2_5:0})
            } 
          }
        }
        // pm 10
        if( this.wx_type == 5) {
          for(let i = 0; i < this.allStation.length; i++) {
            if (this.weathers[i] != undefined) {
              console.log(this.allStation[i].lat, this.allStation[i].lng, this.weathers[i].pm10)
              this.point.push({location: new google.maps.LatLng(this.allStation[i].lat, this.allStation[i].lng), weight: (this.weathers[i].pm10 != undefined)?this.weathers[i].pm10:0})
            } 
          }
        }
        
        
        console.log(this.point)
        // console.log(this.point)
        // var heatMapData = [
        //   {location: new google.maps.LatLng(15.6454, 100.2218), weight: 0.5},
        //   new google.maps.LatLng(13.5780, 100.3920),
        //   {location: new google.maps.LatLng(13.5320, 100.3270), weight: 2},
        //   {location: new google.maps.LatLng(13.5269, 100.3004), weight: 3},
        //   {location: new google.maps.LatLng(13.4304, 100.3544), weight: 2},
        //   new google.maps.LatLng(13.4753, 100.1775),
        //   {location: new google.maps.LatLng(13.4753, 100.1775), weight: 0.5},

        //   {location: new google.maps.LatLng(13.4206, 101.0326), weight: 3},
        //   {location: new google.maps.LatLng(13.5780, 100.3920), weight: 2},
        //   new google.maps.LatLng(13.4764, 100.0689),
        //   {location: new google.maps.LatLng(13.2995, 100.1210), weight: 0.5},
        //   new google.maps.LatLng(14.0248, 99.3047),
        //   {location: new google.maps.LatLng(14.1669, 99.1363), weight: 2},
        //   {location: new google.maps.LatLng(15.2054, 100.0359), weight: 3}
        // ];
        // return heatMapData
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

  .v-application .py-2 {
    position: absolute;
    top: 530px;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
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