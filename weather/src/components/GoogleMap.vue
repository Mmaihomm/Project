<template 
  absolute
>
  <v-card 
    absolute
    tile
    color = "red"
    height = 100%
  >
    
    <v-btn 
      icon
      v-if="!isSearch"
      background-color = "white"
      style="top: 8px; left: 8 px;"
      v-on:click="isSearch = true"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-toolbar
      class = "searching-tab"
      background-color = "white"
      absolute
      rounded
      dense
      style="top: 8px; left: 8 px;"
      v-if="isSearch"
    >
      <v-text-field
        hide-details
        floating
        single-line
        rounded
        filled
        dense
        placeholder="Enter weather station"
        v-model="address"
        background-color = #00000
      ></v-text-field>

      <v-btn 
        icon
        v-on:click="locatorButtonPressed()"
      >
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "GoogleMap",

    data() {
      return {
        isSearch: false,
        address: ""
      };
    },

    // mounted() {
    //   new google.maps.places.Autocomplete(
    //     document.getElementById("autocomplete")
    //   )
    // },


    methods: {
    locatorButtonPressed() {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.getAddressFrom(position.coords.latitude,position.coords.longitude)
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
            this.address = response.data.results[0].formatted_address
          }
        })
        .catch(error => {
          console.log(error.message);
        })
      }
    }
  };

</script>

<style scoped>

</style>