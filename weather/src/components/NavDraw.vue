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
      absolute
      v-if="isHidden"
      class="flex-column justify-end align-self-end"
      dark
      style="
        overflow-x: hidden;
        z-index: 10;
        position: absolute;
        right: 0px;
        width: 400px;
        height: 100%;
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
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="temp" v-bind:color="'#FF0000'" v-bind:unitt=" Y"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        Temperature ( ํC )
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="press" v-bind:color="'#FE8F25'"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        Pressure ( mbar )
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="pm10" v-bind:color="'#F664C0'"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        PM 10 ( ug/m3 )
                      </v-card>
                    </v-card>
                  </v-col>
                  <v-col cols="6">  
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="humid" v-bind:color="'#0000FF'"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        Humidity (%)
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="pm25" v-bind:color="'#9031EF'"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        PM 2.5 ( ug/m3 )
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="pm1" v-bind:color="'#F2E146'"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        PM 1.0 ( ug/m3 )
                      </v-card>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <!--Temp-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; text-shadow: 3px 2px 1px #4A4A48;"> {{temp[0]}}  ํC</div>
                    <div style="color:#FFFFFF;"> Dew point {{dewPoint}}  ํC</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'temperature'" v-bind:dataHigh="[23,24,26,28,30]" v-bind:dataLow="[15,16,18,20,17]"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--Pressure-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{press[0]}}  mbar</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'Pressure'" v-bind:dataHigh="[1009,1009,1010,1008,1007]" v-bind:dataLow="[1009,1009,1010,1008,1007]"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--Humidity-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{humid[0]}} %</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'Humidity'" v-bind:dataHigh="[65,63,64,67,70]" v-bind:dataLow="[63,62,64,59,58]" />
                </v-card>
              </v-card>
            </v-tab-item>
            <!--PM 10-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{pm10[0]}}  ug/m3</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'PM 2.5'" v-bind:dataHigh="[5,6,7,8,9,12]" v-bind:dataLow="[3,4,8,6,2]" />
                </v-card>
              </v-card>
            </v-tab-item>
            <!--PM 2.5-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px;  text-shadow: 3px 2px 1px #4A4A48;"> {{pm25[0]}}  ug/m3</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'PM 2.5'" v-bind:dataHigh="[5,6,7,8,9,12]" v-bind:dataLow="[3,4,8,6,2]" />
                </v-card>
              </v-card>
            </v-tab-item>
            <!--PM 1.0-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{pm1[0]}}  ug/m3</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'PM 1.0'" v-bind:dataHigh="[5,6,7,8,9,12]" v-bind:dataLow="[3,4,8,6,2]" />
                </v-card>
              </v-card>
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
                <v-col>
                  <lineChart v-bind:ytext="'Temperature'" v-bind:dataHigh="[23,24,26,28,30]" v-bind:dataLow="[15,16,18,20,17]"/>
                </v-col>
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
import {apiService} from "../service"
import radChart from "../components/radiusChart"
import lineChart from "../components/lineChart"

export default {
  name: "Drawer",
  
  mounted() {

  },

  components:{
    radChart,
    lineChart,
  },

  methods:{
    getTimeStamp(){
      return moment().format('ddd DD MMM YYYY LT')
    },
    getWeatherStation(){
      return apiService.reportStation('1')
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
      temp: [27.5],
      press:[1010],
      humid:[65],
      pm10:[6],
      pm25:[2],
      pm1:[5],
      dewPoint: 25,
    };
  },
};
</script>

<style >
  
</style>