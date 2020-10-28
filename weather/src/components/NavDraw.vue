<template>
  <nav>
    <!--- open sidebar button --->
    <v-card>
      <v-btn
        v-if="!isHidden"
        v-model="but"
        absolute
        dark
        fab
        small
        buttom
        right
        color="#0A275A"
        style="top: 8px"
        v-on:click="isHidden = true"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-card>
    <!------------------------------->
    <!---------- Side Bar ----------->
    <v-card
      relative
      v-if="isHidden"
      class="flex-column justify-end align-self-end"
      dark
      style="
        overflow-x: hidden;
        z-index: 10;
        position: absolute;
        right: 0px;
        width: 400px;
        height: 85%;
        background-image: linear-gradient(to bottom, rgba(77, 133, 233),rgba(255, 255, 255,0.5));
      "
    >
      <v-row>
        <v-col cols="2">
          <v-btn
            app
            dark
            text
            fab
            small
            v-model="chevright"
            v-on:click="isHidden = false"
            style="left: 8px; top: 8px; padding: 8px"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="8">
            <v-card
            v-model="station" 
            dark 
            flat
            class=" transparent text-center" 
            style="height: 50px;  font-size: 24px; font-family: 'Century Gothic';"
            >
            EW 4214
            </v-card>
            <v-card
            v-model="date"
            dark
            flat
            class="transparent text-center"
            style="height: 50px;  font-size: 16px; font-family: 'Century Gothic';"
            >
            TUE 18 AUG 2020  16:30
            </v-card>
            
        </v-col>
      </v-row>
      <v-row class="justify-center" >
        <v-col cols="11" >
          <v-card
          dark
          flat
          class="text-center"
          style="overflow:auto; height:400px; background-color: rgba(256,256,256,0.2);"
          >
          <v-tabs v-model="tab" show-arrows dark background-color="transparent">
            <v-tab 
            v-for="item in items"
            :key="item">
              {{item}}
            </v-tab>
          </v-tabs>

          <v-tabs-item v-model="tab">
            <v-tab-item
            v-for="item in items"
            :key="item">

            </v-tab-item>
          </v-tabs-item>
          
          </v-card>
          
        </v-col>
        <!-- Information -->
      </v-row>
      <v-row class="justify-center">
        <!-- History -->
        <v-col cols="11" >
          <v-card
          dark
          flat
          class="text-center"
          style="overflow:auto; height:300px; background-color: rgba(256,256,256,0.1);"
          >
          <v-tabs dark background-color="transparent">
            <v-tab>History</v-tab>
          </v-tabs>
          
          </v-card>
          
        </v-col>
      </v-row>
    </v-card>
    <!------------ end sidebar --------->
  </nav>
</template>

<script>
export default {
  name: "Drawer",

  data() {
    return {
      isHidden: false,
      tab: null,
      items: ['All', 'Temperature', 'Pressure', 'Humidity', 'PM 1.0', 'PM 2.5', 'PM 10' ],
    };
  },
};
</script>

<style >
</style>