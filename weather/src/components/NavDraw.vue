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
            {{ station }}
            </v-card>
            <v-card
            v-model="date"
            dark
            flat
            class="transparent text-center"
            style="height: 50px;  font-size: 16px; font-family: 'Century Gothic';"
            >
            {{getTimeStamp()}}
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

          <v-tabs-items v-model="tab" class="transparent">
            <!--All-->
            <v-tab-item>
              <v-card flat style="overflow-x:hidden; height:352px; background-color: rgba(256,256,256,0);">
                <v-row>
                  <v-col cols="6">
                    <v-card flat style="overflow-x:hidden; height:330px; background-color: rgba(256,256,256,0);">
                      
                    </v-card>
                  </v-col>
                  <v-col cols="6">  
                    <v-card flat style="overflow-x:hidden; height:330px; background-color: rgba(256,256,256,0);">
                      
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <!--Temp-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">temperature</v-card>
            </v-tab-item>
            <!--Pressure-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">Pressure</v-card>
            </v-tab-item>
            <!--Humidity-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">humidity</v-card>
            </v-tab-item>
            <!--PM 10-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">PM 10</v-card>
            </v-tab-item>
            <!--PM 2.5-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">PM 2.5</v-card>
            </v-tab-item>
            <!--PM 1.0-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">PM 1.0</v-card>
            </v-tab-item>
          </v-tabs-items>
          
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
          <v-tabs v-model="history" dark background-color="transparent">
            <v-tab>History</v-tab>
          </v-tabs>

          <v-tabs-items v-model="history" class="transparent">
            <v-tab-item>
              <v-card flat style="height:252px; background-color: rgba(256,256,256,0.1);">
                
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          
          </v-card>
          
        </v-col>
      </v-row>
    </v-card>
    <!------------ end sidebar --------->
  </nav>
</template>

<script>
import moment from "moment"
export default {
  name: "Drawer",

  methods:{
    getTimeStamp(){
      return moment().format('ddd DD MMM YYYY LT')
    }
  },

  props:[
    'station',
  ],

  data() {
    return {
      isHidden: false,
      tab: null,
      items: ['All', 'Temperature', 'Pressure', 'Humidity', 'PM 10', 'PM 2.5', 'PM 1.0' ],
      
    };
  },
};
</script>

<style >
  
</style>