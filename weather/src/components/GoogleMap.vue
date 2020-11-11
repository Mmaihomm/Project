<template 
  absolute
>
  <v-card 
    absolute
    tile
    height = 100%
  >
    <section style="position:relative;z-index:1;">
      <v-btn 
        rounded
        fab
        elevation="10"
        v-if="!isSearch"
        style="top: 8px; left: 8px;"
        v-on:click="isSearch = true"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-toolbar
        class = "searching-tab rounded-xl"
        background-color = "white"
        absolute
        fab
        rounded
        dense
        style="top: 8px; left: 8px;"
        v-if="isSearch"
      >
      
        <v-autocomplete
          hide-details
          floating
          single-line
          rounded
          filled
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
          background-color = #00000
        ></v-autocomplete>
        <v-btn 
          icon
          v-on:click= "showStationOnTheMap(selected.latitude,selected.longitude)"
        >
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>
      </v-toolbar>
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

  export default {
    name: "GoogleMap",

    data() {
      return {
        isSearch: false,
        selected: null,
        station: [
          {names: 'HS2AR-10', latitude: 15.6454, longitude: 100.2218, id: 1},
          {names: 'E24YPM-1', latitude: 16.7646, longitude: 100.0568, id: 2},
          {names: 'HS6AB-10', latitude: 15.9948, longitude: 101.07, id: 3},
          {names: 'HS3LSE-11', latitude: 14.7201, longitude: 103.5686, id: 4},
          {names: 'FW1926', latitude: 13.7177, longitude: 100.5955, id: 5},
          {names: 'FW6985', latitude: 13.7472, longitude: 100.6672, id: 6},
          {names: 'HS1IFU-13', latitude: 13.8347, longitude: 100.6602, id: 7},
          {names: 'E25ECY-1', latitude: 13.9333, longitude: 100.7225, id: 8},
          {names: 'HS7AP-10', latitude: 12.9002, longitude: 99.7822, id: 9},
          {names: 'HS2AR-10', latitude: 12.7177, longitude: 101.2919, id: 10},
          {names: 'E21TMW-3', latitude: 13.0211, longitude: 101.8375, id: 11},
          {names: 'HS8AC-10', latitude: 10.9138, longitude: 99.3086, id: 12},
        ],
        weathers: [
          {name:'HS2AR-10', id: 1, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 2, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 3, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 4, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 5, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 6, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 7, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 8, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 9, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 10, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 11, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
          {name:'HS2AR-10', id: 12, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
        ],

      };
    },

    mounted() {
      // new google.maps.places.Autocomplete(
      //   document.getElementById("autocomplete")
      // )
      this.locatorButtonPressed();
    },


    methods: {
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
      
      showStationOnTheMap(latitude, longitude) {
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

        // Add Marker
        for(let i=0; i < this.station.length; i++) {
          const lat = this.station[i].latitude;
          const lng = this.station[i].longitude;

          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            animation: google.maps.Animation.DROP,
            map: map
          })


          google.maps.event.addListener(marker, "mouseover", () => {
            infoWindow.setContent(
              `<div id="stationName" style="font-weight:bold; font-size:16px">${this.station[i].names}</div><br>`+
              `<div style="position: left;"><div id="temp" style="font-size:14px">Temperature : ${this.weathers[i].temp}  ํC</div>`+
              `<div id="humid" style="font-size:14px">Humidity : ${this.weathers[i].humid} %</div>`+
              `<div id="press" style="font-size:14px">Pressure : ${this.weathers[i].press} mbar</div></div>`+
              `<div style="position: left;"><div id="pm1" style="font-size:14px">PM 1.0 ${this.weathers[i].pm1} ug/m3</div>`+
              `<div id="pm25" style="font-size:14px">PM 2.5 ${this.weathers[i].pm25} ug/m3</div>`+
              `<div id="pm10" style="font-size:14px">PM 10 ${this.weathers[i].pm10} ug/m3</div></div>`
              );
            infoWindow.open(map, marker);
          })

          google.maps.event.addListener(marker, "click", function() {
            console.log("click works");
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