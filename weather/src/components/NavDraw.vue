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
        height: 88%;
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
        <v-col cols="9">
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
          style=" height:400px; background-color: rgba(256,256,256,0.2);"
          >
          <v-tabs show-arrows dark background-color="transparent">
            <v-tab>All</v-tab>
            <v-tab>Temperature</v-tab>
            <v-tab>Pressure</v-tab>
            <v-tab>Humidity</v-tab>
            <v-tab>PM 1.0</v-tab>
            <v-tab>PM 2.5</v-tab>
            <v-tab>PM 10</v-tab>
          </v-tabs>
          
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
          style=" height:300px; background-color: rgba(256,256,256,0.1);"
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
    };
  },
};
</script>

<style >
</style>