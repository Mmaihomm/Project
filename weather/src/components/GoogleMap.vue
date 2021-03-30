<template 
  absolute
>
  <v-card 
    absolute
    tile
    height = 100%
  >
    <Drawer 
      v-bind:station="selected.name" 
      v-bind:weather="weather" 
      v-bind:isHidden="isHidden" 
      v-bind:isHeatmap="isHeatmap"
      v-bind:average="average"
      v-bind:wx_type="wx_type"
      v-bind:weathers="weathers"/>
    <section style="position:relative;z-index:1;">
      <div  style="width: 20%; margin: 60px">
      <v-btn 
        rounded
        fab
        elevation="10"
        v-if="!isSearch"
        v-on:click="isSearch = true; isHidden = false"
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
        -->
     
      <row flex container gutter="{12}">
        <column xs="{12}" md="{4}" lg="{3}">
          <v-autocomplete
            v-if="isSearch"
            hide-details
            floating
            single-line
            rounded
            style="width:200%; font-size:80%; top:15px;"
            dense
            solo
            placeholder="Enter station"
            v-model="selected"
            :items = "station"
            hide-no-data
            clearable
            item-text="names"
            item-value="names"
            return-object
          
          @change="showStationOnTheMap(selected.latitude,selected.longitude)"
        ></v-autocomplete>
        </column>
      </row>
      </div>  

      <v-btn-toggle
        id="toggleMap"
        Rounded
        mandatory
        v-model="toggleColorsText"
        color="deep-purple darken-4"
        style="top:-50px; left:37%"
      >
        <v-btn
          text
          v-on:click="isHeatmap=false; isHidden = false; showStationOnTheMap(userLocat.latitude,userLocat.longitude)"
        >
          Geolocation
        </v-btn>

        <v-btn
          text
          v-on:click="isHeatmap=true; isHidden = false; calAverage(); setStartHM(); showStationOnTheMap(userLocat.latitude,userLocat.longitude)"
        >
          Heatmap
        </v-btn>
      </v-btn-toggle>

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
          <column xs="{12}" md="{4}" lg="{3}">
          <v-btn
            class="transparent"
            value= 0
            v-on:click="wx_type = 0; average = ave.temp; deleteHeatmap(); showHeatmap()">
            Temperature
          </v-btn>

          <v-btn 
            class="transparent"
            value= 1
            v-on:click="wx_type = 1;average = ave.humid; deleteHeatmap(); showHeatmap()">
            Humidity
          </v-btn>

          <v-btn 
            class="transparent"
            value= 2
            v-on:click="wx_type = 2; average = ave.press; deleteHeatmap(); showHeatmap()">
            Pressure
          </v-btn>

          <v-btn 
            class="transparent"
            value= 3
            v-on:click="wx_type = 3; average = ave.pm1; deleteHeatmap(); showHeatmap()">
            PM 1.0
          </v-btn>

          <v-btn 
            class="transparent"
            value= 4
            v-on:click="wx_type = 4; average = ave.pm2_5; deleteHeatmap(); showHeatmap()">
            PM 2.5
          </v-btn>

          <v-btn 
            class="transparent"
            value= 5
            v-on:click="wx_type = 5; average = ave.pm10; deleteHeatmap(); showHeatmap()">
            PM 10
          </v-btn>
          </column>
        </v-btn-toggle>
      
      </v-col>
      
      <!-- </v-toolbar> -->
      
    </section>
    
    <section 
      id="map"
      v-on:click="isSearch = false; closeInfoWindow();"
    >

    </section>
  </v-card>
</template>


<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBWSbC4CgahJB93uFsTvH29kPuP0B3VR0A&libraries=places,visualization" async=""></script>

<script>
  import Vue from 'vue';
  import { Row, Column } from 'vue-grid-responsive';
  import axios from 'axios'
  import {apiService} from "../service"
  import Drawer from "../components/NavDraw";

  Vue.component('row', Row);
  Vue.component('column', Column);

  let map, heatmap;
  var infoWindow;

  const regions = {
    north: ["เชียงราย", "เชียงใหม่", "น่าน", "พะเยา", "แพร่", "แม่ฮ่องสอน", "ลำปาง", "ลำพูน", "อุตรดิตถ์" ],
    
    northeast: ["กาฬสินธุ์", "ขอนแก่น", "ชัยภูมิ", "นครพนม", "นครราชสีมา", "บึงกาฬ", "บุรีรัมย์", 
                "มหาสารคาม", "มุกดาหาร", "ยโสธร", "ร้อยเอ็ด", "เลย", "สกลนคร", "สุรินทร์", "ศรีสะเกษ",
                "หนองคาย", "หนองบัวลำภู", "อุดรธานี", "อุบลราชธานี", "อำนาจเจริญ" ],
    
    east: ["จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ตราด", "ปราจีนบุรี", "ระยอง", "สระแก้ว" ],
    
    central: ["กำแพงเพชร", "กรุงเทพมหานคร", "ชัยนาท", "นครนายก", "นครปฐม", "นครสวรรค์", "นนทบุรี", "ปทุมธานี",
              "พระนครศรีอยุธยา", "พิจิตร", "พิษณุโลก", "เพชรบูรณ์", "ลพบุรี", "สมุทรปราการ", "สมุทรสงคราม",
              "สมุทรสาคร", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สระบุรี", "อ่างทอง", "อุทัยธานี" ],
    
    west: ["กาญจนบุรี", "ตาก", "ประจวบคีรีขันธ", "เพชรบุรี", "ราชบุรี" ],
    
    south: ["กระบี่", "ชุมพร", "ตรัง", "นครศรีธรรมราช", "นราธิวาส", "ปัตตานี", "พังงา", "พัทลุง", 
            "ภูเก็ต", "ระนอง", "สตูล", "สงขลา", "สุราษฎร์ธานี", "ยะลา" ],
  };
  
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
        hm_start: true,
        userLocat: {latitude: null, longitude: null},
        selected: {names: 'HS2AR-10', latitude: 15.6454, longitude: 100.2218, id: 1},
        station: [],
        weather: {name:'HS2AR-10', id: 1, temp: 30, humid: 60, press: 1000, pm1: 3, pm25: 3, pm10: 3},
        pm: [],
        weathers: [],
        allStation: [],
        historyRDT: [],
        historyDT: {all:{}, name: '', temp_min: [], temp_max: [], days: ['Today']},
        point: [],
        ave: {
          temp: {all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0,},
          humid: {all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0,},
          press: {all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0,},
          pm1: {
            all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0,},
          pm2_5: {all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0, },
          pm10: {all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0,},
        },
        average: {all: 0.0, n: 0.0, ne: 0.0, e: 0.0, c: 0.0, w: 0.0, s: 0.0,},
        wx_type: 0,
        toggleColorsText: 0,

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
        // this.testInterval();
        this.showStationInSearch()
        this.calAverage()
        // this.getHistory(HS2AR-10)
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
        // return station
      },

      async getWeather(stationName){
        var temp = await apiService.weatherData(stationName);
        this.weathers.push(temp);
      },

      async getHistory(stationName){
        var tmp = await apiService.historyData(stationName);
        this.historyRDT.push(tmp)
      },

      async getPM(stationName, id){
        var temp = await apiService.pmData(stationName);
        this.pm.push(temp)
      },

      // async getDataWeather() {
      //   this.allStation = await this.getWeatherStation();
      // },

      setStartHM() {
        if(this.hm_start == true) {
          this.average = this.ave.temp
          this.hm_start = false
        }
      },

      getKeyByValue(value) {
        // filter in north
        let filtered = regions.north.filter(function(ele, index, array,  val = value) {
          if (ele == val) {
            return ele
          }
        })

        if (filtered == '') {
          // console.log("No pv in north")

          // filter in northeast
          filtered = regions.northeast.filter(function(ele, index, array,  val = value) {
            if (ele == val) {
              return ele
            }
          })

          if (filtered == '') {
            // console.log("No pv in northeast")

            // filter in central
            filtered = regions.central.filter(function(ele, index, array,  val = value) {
              if (ele == val) {
                return ele
              }
            })

            if (filtered == '') {
              // console.log("No pv in central")

              // filter in east
              filtered = regions.east.filter(function(ele, index, array,  val = value) {
                if (ele == val) {
                  return ele
                }
              })

              if (filtered == '') {
                // console.log("No pv in east")

                // filter in east
                filtered = regions.west.filter(function(ele, index, array,  val = value) {
                  if (ele == val) {
                    return ele
                  }
                })

                if (filtered == '') {
                  // console.log("No pv in west")

                  // filter in south
                  filtered = regions.south.filter(function(ele, index, array,  val = value) {
                    if (ele == val) {
                      return ele
                    }
                  })

                  if (filtered == '') {
                    console.log("No pv in Thailand")
                  }
                  else {
                    return 'south'
                  }
                }
                else {
                  return 'west'
                }
              }
              else {
                return 'east'
              }
            }
            else {
              return 'central'
            }
          }
          else {
            return 'northeast'
          }
        }
        else {
          return 'north'
        }
        // return Object.keys(object).find(key => object[key] === value);
      },

      async setAllStation() {
        // console.log(this.allStation)
        // Add province to each station 
        for(let i = 0; i < this.allStation.length; i++) {
          await this.getWeather(this.allStation[i].name);
          await this.getHistory(this.allStation[i].name);
          // await this.getPM(this.allStation[i].name, i) 
          this.setProvinceFrom(this.allStation[i].lat, this.allStation[i].lng, i);               
        }
      },

      showStationInSearch() {
        console.log(this.allStation)
        this.station = this.allStation.map((element)=>{
          return {names:element.name + ' (' + element.locat + ')',latitude:element.lat,longitude:element.lng,};
        })
      },
      
      // Get current position and set center
      showUserLocationOnTheMap() {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              this.setUserLocation(
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
      setUserLocation(lat, long) {
        this.userLocat.latitude = lat
        this.userLocat.longitude = long
        // console.log(this.userLocat.latitude,this.userLocat.longitude)
        // this.setProvinceFrom(lat, long);
      },

      setProvinceFrom(lat, long, index) {
        axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" 
          + lat + "," 
          + long 
          + "&key=AIzaSyBWSbC4CgahJB93uFsTvH29kPuP0B3VR0A").then(response => {
            if(response.data.error_message) {
              console.log(response.data.error_message);
            }
            else {
              // this.stations = response.data.results[0].formatted_address
              for(let i=0; i < response.data.results[0].address_components.length; i++) {
                var type = response.data.results[0].address_components[i].types[0];
                if(type == "administrative_area_level_1") {
                  this.allStation[index].locat = response.data.results[0].address_components[i].long_name
                  this.allStation[index].region = this.getKeyByValue(this.allStation[index].locat)
                  // console.log("Region of",this.allStation[index].locat," is",this.allStation[index].region)
                  // console.log(this.allStation[index].locat)
                }
              }
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

        // console.log(this.isHeatmap)
        this.isHeatmap ? this.showHeatmap() : this.showMarker()
      },

      showMarker() {
        console.log("Marker Mode!")
        infoWindow = new google.maps.InfoWindow();
        // console.log(this.weathers)
        // Add Marker

        var marker = [];
        for(let i=0; i < this.allStation.length; i++) {

          // console.log(this.allStation[i], this.weathers[i])

          const lat = this.allStation[i].lat;
          const lng = this.allStation[i].lng;
          if(this.allStation[i] != undefined){
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
                    `<div id="humid" style="font-size:14px">Humidity : ${ (weathers[index].humidity != undefined)?weathers[index].humidity:'Not avaliable'} %</div>`+
                    `<div id="press" style="font-size:14px">Pressure : ${(weathers[index].pressure != undefined)?weathers[index].pressure:'N/A'} mbar</div></div>`+
                    `<div style="position: left;"><div id="pm1" style="font-size:14px">PM 1.0 ${ (weathers[index].pm1 != undefined)?weathers[index].pm1:'N/A'} ug/m3</div>`+
                    `<div id="pm25" style="font-size:14px">PM 2.5 ${(weathers[index].pm2_5 != undefined)?weathers[index].pm2_5:'N/A'} ug/m3</div>`+
                    `<div id="pm10" style="font-size:14px">PM 10 ${(weathers[index].pm10 != undefined)?weathers[index].pm10:'N/A'} ug/m3</div></div>`
                    );
                  // infoWindow.setBackgroundColor("rgb(153, 255, 73)");
                  infoWindow.open(map, marker[i]);
                })
                google.maps.event.addListener(marker[i], "click", (event,weathers = this.weathers , index = i) => {
                  // this.selected = this.allStation[index];
                  // this.weather = weathers[index];
                  // console.log(this.isHidden)
                  // this.isHidden = true;
                  // console.log("i =",index)
                  this.showPopup(index);
                }); 
          }
   
        }
      },

      showPopup(index){
        this.selected = this.allStation[index];
        this.weather = this.weathers[index];
        this.isHidden = true;
        this.setSelectedHistory(this.selected.names)
        showStationOnTheMap(this.selected.latitude,this.selected.longitude)
        // console.log(this.selected)
        // console.log("i =",index)
      },

      async setSelectedHistory(stationName) {
        await this.getHistory(stationName);
      },

      closeInfoWindow(){
        infoWindow.close();
      },

      calAverage() {
        var temp_sum = 0; var temp_n = 0; var temp_ne = 0; var temp_e = 0; var temp_c = 0; var temp_w = 0; var temp_s = 0;
        var humid_sum = 0; var humid_n = 0; var humid_ne = 0; var humid_e = 0; var humid_c = 0; var humid_w = 0; var humid_s = 0;
        var press_sum = 0; var press_n = 0; var press_ne = 0; var press_e = 0; var press_c = 0; var press_w = 0; var press_s = 0;
        var pm1_sum = 0; var pm1_n = 0; var pm1_ne = 0; var pm1_e = 0; var pm1_c = 0; var pm1_w = 0; var pm1_s = 0;
        var pm2_5_sum = 0; var pm2_5_n = 0; var pm2_5_ne = 0; var pm2_5_e = 0; var pm2_5_c = 0; var pm2_5_w = 0; var pm2_5_s = 0;
        var pm10_sum = 0; var pm10_n = 0; var pm10_ne = 0; var pm10_e = 0; var pm10_c = 0; var pm10_w = 0; var pm10_s = 0;
        var undef_data = 0; var n_l = 0; var ne_l = 0; var e_l = 0; var c_l = 0; var w_l = 0; var s_l = 0;
        console.log("Calculate average")
        const length = this.weathers.length
        for(let i = 0; i < length; i++) {
          if(this.weathers[i] != undefined) {
            temp_sum += this.weathers[i].temp;
            humid_sum += this.weathers[i].humidity;
            press_sum += this.weathers[i].pressure;
            pm1_sum += this.weathers[i].pm1;
            pm2_5_sum += this.weathers[i].pm2_5;
            pm10_sum += this.weathers[i].pm10;

            // north
            if(this.allStation[i].region == 'north') {
              console.log("North!")
              n_l++;
              temp_n += this.weathers[i].temp;
              humid_n += this.weathers[i].humidity;
              press_n += this.weathers[i].pressure;
              pm1_n += this.weathers[i].pm1;
              pm2_5_n += this.weathers[i].pm2_5;
              pm10_n += this.weathers[i].pm10;
            }

            if(this.allStation[i].region == 'northeast') {
              console.log("Northeast!")
              ne_l++;
              temp_ne += this.weathers[i].temp;
              humid_ne += this.weathers[i].humidity;
              press_ne += this.weathers[i].pressure;
              pm1_ne += this.weathers[i].pm1;
              pm2_5_ne += this.weathers[i].pm2_5;
              pm10_ne += this.weathers[i].pm10;
            }

            if(this.allStation[i].region == 'east') {
              console.log("East!")
              e_l++;
              temp_e += this.weathers[i].temp;
              humid_e += this.weathers[i].humidity;
              press_e += this.weathers[i].pressure;
              pm1_e += this.weathers[i].pm1;
              pm2_5_e += this.weathers[i].pm2_5;
              pm10_e += this.weathers[i].pm10;
            }

            if(this.allStation[i].region == 'central') {
              console.log("Central!")
              c_l++;
              temp_c += this.weathers[i].temp;
              humid_c += this.weathers[i].humidity;
              press_c += this.weathers[i].pressure;
              pm1_c += this.weathers[i].pm1;
              pm2_5_c += this.weathers[i].pm2_5;
              pm10_c += this.weathers[i].pm10;
            }

            if(this.allStation[i].region == 'west') {
              console.log("West!")
              w_l++;
              temp_w += this.weathers[i].temp;
              humid_w += this.weathers[i].humidity;
              press_w += this.weathers[i].pressure;
              pm1_w += this.weathers[i].pm1;
              pm2_5_w += this.weathers[i].pm2_5;
              pm10_w += this.weathers[i].pm10;
            }

            if(this.allStation[i].region == 'south') {
              console.log("South!")
              s_l++;
              temp_s += this.weathers[i].temp;
              humid_s += this.weathers[i].humidity;
              press_s += this.weathers[i].pressure;
              pm1_s += this.weathers[i].pm1;
              pm2_5_s += this.weathers[i].pm2_5;
              pm10_s += this.weathers[i].pm10;
            }
          }
          else {
            undef_data++;
          }
        }
        console.log(temp_sum, (length-undef_data))
        this.ave.temp.all = (temp_sum/ (length-undef_data)).toFixed(2);
        this.ave.temp.n = (temp_n / n_l).toFixed(2)
        this.ave.temp.ne = (temp_ne / ne_l).toFixed(2)
        this.ave.temp.e = (temp_e / e_l).toFixed(2)
        this.ave.temp.c = (temp_c / c_l).toFixed(2)
        this.ave.temp.w = (temp_w / w_l).toFixed(2)
        this.ave.temp.s = (temp_s / s_l).toFixed(2)

        this.ave.humid.all = (humid_sum / (length-undef_data)).toFixed(2);
        this.ave.humid.n = (humid_n / n_l).toFixed(2)
        this.ave.humid.ne = (humid_ne / ne_l).toFixed(2)
        this.ave.humid.e = (humid_e / e_l).toFixed(2)
        this.ave.humid.c = (humid_c / c_l).toFixed(2)
        this.ave.humid.w = (humid_w / w_l).toFixed(2)
        this.ave.humid.s = (humid_s / s_l).toFixed(2)

        this.ave.press.all = (press_sum / (length-undef_data)).toFixed(2);
        this.ave.press.n = (press_n / n_l).toFixed(2)
        this.ave.press.ne = (press_ne / ne_l).toFixed(2)
        this.ave.press.e = (press_e / e_l).toFixed(2)
        this.ave.press.c = (press_c / c_l).toFixed(2)
        this.ave.press.w = (press_w / w_l).toFixed(2)
        this.ave.press.s = (press_s / s_l).toFixed(2)

        this.ave.pm1.all = (pm1_sum / (length-undef_data)).toFixed(2);
        this.ave.pm1.n = (pm1_n / n_l).toFixed(2)
        this.ave.pm1.ne = (pm1_ne / ne_l).toFixed(2)
        this.ave.pm1.e = (pm1_e / e_l).toFixed(2)
        this.ave.pm1.c = (pm1_c / c_l).toFixed(2)
        this.ave.pm1.w = (pm1_w / w_l).toFixed(2)
        this.ave.pm1.s = (pm1_s / s_l).toFixed(2)

        this.ave.pm2_5.all = (pm2_5_sum / (length-undef_data)).toFixed(2);
        this.ave.pm2_5.n = (pm2_5_n / n_l).toFixed(2)
        this.ave.pm2_5.ne = (pm2_5_ne / ne_l).toFixed(2)
        this.ave.pm2_5.e = (pm2_5_e / e_l).toFixed(2)
        this.ave.pm2_5.c = (pm2_5_c / c_l).toFixed(2)
        this.ave.pm2_5.w = (pm2_5_w / w_l).toFixed(2)
        this.ave.pm2_5.s = (pm2_5_s / s_l).toFixed(2)

        this.ave.pm10.all = (pm10_sum / (length-undef_data)).toFixed(2);
        this.ave.pm10.n = (pm10_n / n_l).toFixed(2)
        this.ave.pm10.ne = (pm10_ne / ne_l).toFixed(2)
        this.ave.pm10.e = (pm10_e / e_l).toFixed(2)
        this.ave.pm10.c = (pm10_c / c_l).toFixed(2)
        this.ave.pm10.w = (pm10_w / w_l).toFixed(2)
        this.ave.pm10.s = (pm10_s / s_l).toFixed(2)

        console.log(this.ave)
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