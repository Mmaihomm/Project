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
        icon
        elevation="10"
        v-if="!isSearch"
        background-color = "white"
        style="top: 8px; left: 8px;"
        v-on:click="isSearch = true"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-toolbar
        class = "searching-tab"
        background-color = "white"
        absolute
        fab
        rounded
        dense
        style="top: 8px; left: 8 px;"
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
          v-model="station.names"
          :items = "station"
          :filter="customFilter"
          item-text="names"
          background-color = #00000
        ></v-autocomplete>

        <v-btn 
          icon
          
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
        station: [
          {names: 'HS2AR-10'},
          {names: 'sdgf;s'},
          {names: ';ldjkz'},
          {names: 'awdhkj'},
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

              this.showUserLocationOnTheMap(
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
      
      showUserLocationOnTheMap(latitude, longitude) {
        // Create a map object
        let map = new google.maps.Map(document.getElementById("map"), {
          zoom: 12,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
          },
        });

        // Add Marker
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
</style>