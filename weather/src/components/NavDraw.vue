<template>
 
  <nav>
    <!--- open sidebar button --->
    <v-card>
      <v-btn
        v-if="!isHidden && !isHeatmap"
        absolute
        dark
        fab
        buttom
        right
        color="#0A275A"
        style="top: 10px;"
        v-on:click="isHidden = true"
      >
        <v-icon>mdi-monitor-dashboard</v-icon>
      </v-btn>
    </v-card>
    <!------------------------------->

    <!---------- Side Bar ----------->
    <v-card
      absolute
      v-if="isHidden && !isHeatmap"
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
            v-on:click="isHidden = false;"
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
                    
                      <radChart v-bind:serie="[weather.temp]" v-bind:value="[weather.temp]" v-bind:color="setChartColor('temp', weather.temp)" />

                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        Temperature ( ํC )
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="[pressPercent(weather.pressure)]" v-bind:value="[weather.pressure]" v-bind:color="setChartColor('pressure', weather.pressure)"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        Pressure ( mbar )
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="[pmPercent(weather.pm10)]" v-bind:value="[weather.pm10]" v-bind:color="setChartColor('pm', weather.pm10)"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        PM 10 ( ug/m3 )
                      </v-card>
                    </v-card>
                  </v-col>
                  <v-col cols="6">  
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="[weather.humidity]" v-bind:value="[weather.humidity]" v-bind:color="setChartColor('humidity', weather.humidity)"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        Humidity (%)
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="[pmPercent(weather.pm2_5)]" v-bind:value="[weather.pm2_5]" v-bind:color="setChartColor('pm', weather.pm2_5)"/>
                      <v-card flat style="fontSize:12px; margin:-7px; background-color: rgba(256,256,256,0);">
                        PM 2.5 ( ug/m3 )
                      </v-card>
                    </v-card>
                    <v-card flat class="justify-center" style="padding:35px 0 0 10px; overflow-x:hidden; height:109px; background-color: rgba(256,256,256,0);">
                      <radChart v-bind:serie="[pmPercent(weather.pm1)]" v-bind:value="[weather.pm1]" v-bind:color="setChartColor('pm', weather.pm1)"/>
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
                    <div style="fontSize:35px; color:#F0B734; text-shadow: 3px 2px 1px #4A4A48;"> {{weather.temp}}  ํC</div>
                    <!-- <div style="color:#FFFFFF;"> Dew point {{dewPoint}}  ํC</div> -->
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'Temperature'" v-bind:lineColor="['rgb(200, 0, 0)', 'rgb(230, 179, 179)']" 
                              v-bind:dataHigh="historyDT.temp_max" v-bind:dataLow="historyDT.temp_min" v-bind:days="historyDT.days"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--Pressure-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{weather.pressure}}  mbar</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'Pressure'" v-bind:lineColor="['rgb(0, 150, 0)', 'rgb(182, 230, 179)']" 
                              v-bind:dataHigh="historyDT.pressure_max" v-bind:dataLow="historyDT.pressure_min" v-bind:days="historyDT.days"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--Humidity-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{weather.humidity}} %</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'Humidity'" v-bind:lineColor="['rgb(0, 0, 150)', 'rgb(179, 188, 230)']" 
                              v-bind:dataHigh="historyDT.humidity_max" v-bind:dataLow="historyDT.humidity_min" v-bind:days="historyDT.days"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--PM 10-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{weather.pm10}} ug/m3</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'PM 10'" v-bind:lineColor="['rgb(227, 197, 0)', 'rgb(230, 227, 179)']" 
                              v-bind:dataHigh="historyDT.pm10_max" v-bind:dataLow="historyDT.pm10_min" v-bind:days="historyDT.days"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--PM 2.5-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px;  text-shadow: 3px 2px 1px #4A4A48;"> {{weather.pm2_5}}  ug/m3</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'PM 2.5'" v-bind:lineColor="['rgb(128, 66, 0)', 'rgb(209, 190, 165)']" 
                              v-bind:dataHigh="historyDT.pm2_5_max" v-bind:dataLow="historyDT.pm2_5_min" v-bind:days="historyDT.days"/>
                </v-card>
              </v-card>
            </v-tab-item>
            <!--PM 1.0-->
            <v-tab-item>
              <v-card flat style="height:352px; background-color: rgba(256,256,256,0);">
                  <v-card flat class="justify-center" style="overflow-x:hidden; height:110px; background-color: rgba(256,256,256,0);">
                  <v-col >
                    <div style="fontSize:35px; color:#F0B734; margin:10px; text-shadow: 3px 2px 1px #4A4A48;"> {{weather.pm1}}  ug/m3</div>
                  </v-col>
                </v-card>
                <v-card flat style="background-color: rgba(256,256,256,0);">
                    <lineChart v-bind:ytext="'PM 1.0'" v-bind:lineColor="['rgb(90, 0, 90)', 'rgb(226, 197, 237)']" 
                              v-bind:dataHigh="historyDT.pm1_max" v-bind:dataLow="historyDT.pm1_min" v-bind:days="historyDT.days"/>
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

            <v-tab>Forecast</v-tab>
          </v-tabs>

          <v-tabs-items v-model="history" class="transparent">

            <!--Forecast card-->
            <v-tab-item>
              <v-card flat style="height:252px; background-color: rgba(256,256,256,0.1);">
                <v-col>
                  <lineChart v-bind:ytext="'Temperature Forecast'" v-bind:lineColor="['rgb(200,0,0)']" v-bind:dataHigh="forecastDT.temp" v-bind:days="forecastDT.days"/>
                </v-col>
              </v-card>
            </v-tab-item>
            <!---->
          </v-tabs-items>
          
          </v-card>
          
        </v-col>
      </v-row>
    </v-card>
    <!------------ end sidebar --------->

    
    <!-- open heatmap sidebar -->
    <v-card>
      <v-btn
        v-if="!isHiddenHeatmap && isHeatmap"
        absolute
        dark
        fab
        buttom
        right
        color="#0A275A"
        style="top: 60px;"
        v-on:click="isHiddenHeatmap = true;"
      >
        <v-icon>mdi-monitor-dashboard</v-icon>
      </v-btn>
    </v-card>
    <!-- -------------------- -->
    <!---------- Heatmap sidebar ----------->
    <v-card
      absolute 
      v-if="isHiddenHeatmap"
      id="sidebar-bg"
      class="flex-column justify-end align-self-end text-center"
      style="
        overflow-x: hidden;
        z-index: 10;
        position: absolute;
        right: 0px;
        width: 400px;
        height: 100%;
        <!-- margin: 20px; -->
        padding: 20px;
        background-color: rgba(64, 64, 64,0.8);"
    >
      
      <v-row>
        <v-btn
            app
            dark
            text
            fab
            small
            v-on:click="isHiddenHeatmap = false;"
            style="left: 8px; top: 8px; padding: 8px;"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        <v-card-title d-flex class="flex-column pa-2 " style="color:white; font-size:150%" > {{averageType()}} ( {{unit()}} ) </v-card-title>
      </v-row>

      <v-row>
        <v-card
          flat
          class=" transparent text-center" 
          style="
            height: 20%;  
            justify-items: center;
            justify-content: center;
            font-size: 48px; 
            font-family: 'Century Gothic';
            color: white;"
        >
          {{ average.all }} 
        </v-card>
      </v-row>
              
      <v-row >
        <v-col cols="6">
          <v-card
            flat
            class="transparent text-center"
            >
              <v-card 
                flat 
                class="transparent text-left font-weight-medium" 
                style="
                padding-left: 8px;
                font-size: 14px;
                color: white;" >North</v-card>
              <v-card
                flat
                style="
                  background-color: rgba(255, 255, 255, 0.5);
                  color: rgba(0, 0, 0, 1);
                  padding: 8px;
                  margin: 8px
                  height: 50px;  
                  font-size: 24px; 
                  font-family: 'Century Gothic';">
                {{average.n}}
              </v-card>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card
            flat
            class="transparent text-center"
            >
              <v-card 
                flat 
                class="transparent text-left font-weight-medium" 
                style="
                padding-left: 8px;
                font-size: 14px;
                color: white;">North-east</v-card>
              <v-card
                flat
                style="
                  background-color: rgba(255, 255, 255, 0.5);
                  color: rgba(0, 0, 0, 1);
                  padding: 8px;
                  margin: 8px
                  height: 50px;  
                  font-size: 24px; 
                  font-family: 'Century Gothic';">
                {{average.ne}}
              </v-card>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-card
            flat
            class="transparent text-center"
            >
              <v-card 
                flat 
                class="transparent text-left font-weight-medium" 
                style="
                padding-left: 8px;
                font-size: 14px;
                color: white;">East</v-card>
              <v-card
                flat
                style="
                  background-color: rgba(255, 255, 255, 0.5);
                  color: rgba(0, 0, 0, 1);
                  padding: 8px;
                  margin: 8px
                  height: 50px;  
                  font-size: 24px; 
                  font-family: 'Century Gothic';">
                {{average.e}}
              </v-card>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card
            flat
            class="transparent text-center"
            >
              <v-card 
                flat 
                class="transparent text-left font-weight-medium" 
                style="
                padding-left: 8px;
                font-size: 14px;
                color: white;">Central</v-card>
              <v-card
                flat
                style="
                  background-color: rgba(255, 255, 255, 0.5);
                  color: rgba(0, 0, 0, 1);
                  padding: 8px;
                  margin: 8px
                  height: 50px;  
                  font-size: 24px; 
                  font-family: 'Century Gothic';">
                {{average.c}}
              </v-card>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-card
            flat
            class="transparent text-center"
            >
              <v-card 
                flat 
                class="transparent text-left font-weight-medium" 
                style="
                padding-left: 8px;
                font-size: 14px;
                color: white;">West</v-card>
              <v-card
                flat
                style="
                  background-color: rgba(255, 255, 255, 0.5);
                  color: rgba(0, 0, 0, 1);
                  padding: 8px;
                  margin: 8px
                  height: 50px;  
                  font-size: 24px; 
                  font-family: 'Century Gothic';">
                {{average.w}}
              </v-card>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card
            flat
            class="transparent text-center"
            >
              <v-card 
                flat 
                class="transparent text-left font-weight-medium" 
                style="
                padding-left: 8px;
                font-size: 14px;
                color: white;">South</v-card>
              <v-card
                flat
                style="
                  background-color: rgba(255, 255, 255, 0.5);
                  color: rgba(0, 0, 0, 1);
                  padding: 8px;
                  margin: 8px
                  height: 50px;  
                  font-size: 24px; 
                  font-family: 'Century Gothic';">
                {{average.s}}
              </v-card>
          </v-card>
        </v-col>
      </v-row>

    </v-card>
    <!-------- end Heatmap sidebar --------->
  </nav>
</template>

<script>
import moment from "moment"
import {apiService} from "../service"
import radChart from "../components/radiusChart"
import lineChart from "../components/lineChart"

// console.log(this.station);
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
    
    async getWeatherStation(){
      
      let station = await apiService.stationList()
      /*let list = [];
        let i;
        await apiService.stationList().then((results)=>{
        for (i=0;i<results.length;i++) {
        list = list.concat(results[i].name)
        }
        console.log(list)
      }).catch((e)=>{
      console.log(e)
      })*/
      console.log(station)
      return station
    },

    getWeather(stationid){
      return apiService.weatherData(stationid)
    },

    getPM(stationName){
      return apiService.pmData(stationName)
    },


    pressPercent(press) {
      var value = press * (100/2300);
      return value
    },

    pmPercent(pm) {
      var value = pm * (100/300);
      return value
    },

    setChartColor(type, value) {
      // Temperature
      if(type == 'temp') {
        if(value <= 25) {
          return 'rgb(0, 255, 0)'
        }
        else if( value <= 30) {
          return 'rgb(255, 255, 0)'
        }
        else if(value <= 40) {
          return 'rgb(255, 153, 0)'
        }
        else {
          return 'rgb(255, 0, 0)'
        }
      }

      // Pressure
      if(type == 'pressure') {
        if(value <= 1013) {
          return 'rgb(0, 255, 0)'
        }
        else if( value <= 1200) {
          return 'rgb(255, 255, 0)'
        }
        else if(value <= 1500) {
          return 'rgb(255, 153, 0)'
        }
        else {
          return 'rgb(255, 0, 0)'
        }
      }

      // Humidity
      if(type == 'humidity') {
        if(value <= 30) {
          return 'rgb(255, 0, 0)'
        }
        else if( value <= 60) {
          return 'rgb(255, 153, 0)'
        }
        else {
          return 'rgb(0, 255, 0)'
        }
      }

      // PM 
      if(type == 'pm') {
        if(value <= 50) {
          return 'rgb(0, 255, 0)'
        }
        else if( value <= 100) {
          return 'rgb(255, 255, 0)'
        }
        else if(value <= 150) {
          return 'rgb(255, 153, 0)'
        }
        else {
          return 'rgb(255, 0, 0)'
        }
      }
    },

    averageType(){
      if(this.wx_type == 0)  this.averageName = 'Temperature Average';
      if(this.wx_type == 1)  this.averageName = 'Humidity Average';
      if(this.wx_type == 2)  this.averageName = 'Pressure Average';
      if(this.wx_type == 3)  this.averageName = 'PM 10 Average';
      if(this.wx_type == 4)  this.averageName = 'PM 2.5 Average';
      if(this.wx_type == 5)  this.averageName = 'PM 1 Average';
      return  this.averageName
    },

    unit(){
      if(this.wx_type == 0)  this.unitName = 'ํ C';
      if(this.wx_type == 1)  this.unitName = '%';
      if(this.wx_type == 2)  this.unitName = 'mbar';
      if(this.wx_type == 3)  this.unitName = 'ug/m3';
      if(this.wx_type == 4)  this.unitName = 'ug/m3';
      if(this.wx_type == 5)  this.unitName = 'ug/m3';
      return this.unitName

    },

    changeBg(type) {
      console.log(this.historyDT.days)

      var color = "";
      console.log("Change color test")
      if(type == 0) {
        color = "rgba(205, 0, 0, 0.6)"
        document.getElementById('sidebar-bg').style.backgroundColor = color;
      }
      else if(type == 1) {
        color = "rgba(50, 50, 155, 0.6)"
        document.getElementById('sidebar-bg').style.backgroundColor = color;
      }
      else if(type == 2) {
        color = "rgba(204, 0, 0, 0.6)"
        document.getElementById('sidebar-bg').style.backgroundColor = color;
      }
      else if(type == 3) {
        color = "rgba(204, 0, 0, 0.6)"
        document.getElementById('sidebar-bg').style.backgroundColor = color;
      }
      else if(type === 4) {
        color = "rgba(204, 0, 0, 0.6)"
        document.getElementById('sidebar-bg').style.backgroundColor = color;
      }
      else if(type === 5) {
        color = "rgba(204, 0, 0, 0.6)"
        document.getElementById('sidebar-bg').style.backgroundColor = color;
      }
    },

  },

  props:{
    station: String,
    weather: Object,
    historyDT: Object,
    forecastDT: Object,
    weathers: Array,
    isHidden: Boolean,
    isHeatmap: Boolean,
    isHiddenHeatmap: Boolean,
    average: Object,
    wx_type: Number,
    
  },

  data() {
    return {
      //isHidden: false,
      //weather: {name:'HS2AR-10', id: 1, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
      stations: [],
      tab: 0,
      history: 0,
      items: ['All', 'Temperature', 'Pressure', 'Humidity', 'PM 10', 'PM 2.5', 'PM 1.0' ],
      temp: [], press:[], humid:[], pm10:[], pm25:[], pm1:[],
      dewPoint: 25,
      averageName: '',
    };
  },
};
</script>

<style >
.row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-right: -12px;
    margin-left: -12px;
}
</style>