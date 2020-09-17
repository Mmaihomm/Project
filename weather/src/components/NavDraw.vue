<template>
  <nav>
    <v-card absolute>
      <v-btn
        v-if="!isHidden "
        v-model="but"
        absolute
        dark
        fab
        small
        buttom
        right
        color="#0A275A"
        style="top: 8px;"
        v-on:click="isHidden = true"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-card>
    <v-card
      v-if="isHidden"
      class="flex-column justify-end align-self-end"
      dark
      style="
        position: absolute;
        right: 0px;
        width: 400px; 
        height: 950px;
        position: absolute;
        background-image: linear-gradient(to bottom,rgba(77,133,233,0.95),rgba(255,255,255));
        "
    >
      <v-btn app dark text fab small v-model="chevright" v-on:click="isHidden=false" style="left:8px; top: 8px; padding: 8px;">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <br/>
      <br/>
      <v-card v-model="place" app dark flat width="95%" class="mx-auto justify-center transparent" style="height: 100px; opacity:50% font-size: 24px;">
        <v-card-title class="mx-auto flex-auto justify-center" >
          <v-icon left style="margin-bottom: 4px;">mdi-map-marker</v-icon>
          <span class="subtitle" style="margin-bottom: 2px;">EW 4214</span>
        </v-card-title> 
        <v-card-title class="justify-center subtitle-2" style=" padding:0%; font-weight:300; " >
            <span>Tue 18 AUG 2020  16:30</span>
        </v-card-title> 
      </v-card>
      <v-card v-model="info" app dark flat width="95%" class="mx-auto justify-center" style="margin: 5%;height: 350px; background-color: rgba(256,256,256,0.3);  font-size: 24px;">
        <v-tabs
          show-arrows 
          center-active
          dark
          background-color="transparent"
          class="subtitle-2"
          style="font-weight:100"
        >
          <v-tab>
            All
          </v-tab>
          <v-tab>
            Temperature
          </v-tab>
          <v-tab>
            Pressure
          </v-tab>
          <v-tab>
            Humidity
          </v-tab>
          <v-tab>
            PM 1.0
          </v-tab>
          <v-tab>
            PM 2.5
          </v-tab>
          <v-tab>
            PM 10
          </v-tab>
        </v-tabs >
        <v-card dark flat class="transparent flex-column">
          <v-card dark flat width="95%" class="mx-auto d-flex justify-center transparent" style="margin: 2%; height: 100px;">
            <v-card dark flat width="50%" class="mx-auto  d-flex justify-center align-center transparent">
              <v-card dark flat class="mx-auto flex-column justify-center transparent">
                <br/>
                <v-card-title class="justify-center subtitle-2" style=" padding:0%; font-weight:300; " >
                    <span style="color: #F2C94C; text-shadow: 2px 2px rgba(0,0,0,0.5); font-size:30px;">40 ํC</span>
                </v-card-title> 
                <v-card-subtitle style="padding:20px;">Dew point 27 ํC</v-card-subtitle>
              </v-card>
            </v-card>
            <v-card dark flat width="50%" class="mx-auto d-flex justify-center transparent">
              <v-card dark flat class="mx-auto flex-column justify-center transparent">
                  <v-card-subtitle style="margin:8px; padding:0px;"> 0.0        mm/h</v-card-subtitle>
                  <v-card-subtitle style="margin:8px; padding:0px;">0.0      mm/24h</v-card-subtitle>
                  <v-card-subtitle style="margin:8px; padding:0px;">0.0  mm/since 0:00</v-card-subtitle>
              </v-card>
            </v-card>
          </v-card>
          <v-card dark flat width="95%" class="mx-auto d-flex justify-center transparent" style="margin: 2%; height: 170px;">
            <v-card dark flat width="50%" class="mx-auto  d-flex align-center transparent">
              <v-card dark flat class=" flex-column justify-start transparent">
                  <v-card-subtitle style="margin:8px; padding:0px;">Humidity</v-card-subtitle>
                  <v-card-subtitle style="margin:8px; padding:0px;">Pressure</v-card-subtitle>
                  <v-card-subtitle style="margin:8px; padding:0px;">Wind</v-card-subtitle>
              </v-card>
            </v-card>
            <v-divider dark vertical inset style="border-width:2px; background-color:white; opacity:80%; margin:8px;"></v-divider>
            <v-card dark flat width="50%" class="mx-auto d-flex justify-start align-center transparent">
              <v-card dark flat class=" flex-column justify-center transparent">
                  <v-card-subtitle style="margin:8px; padding:0px;">PM 10</v-card-subtitle>
                  <v-card-subtitle style="margin:8px; padding:0px;">PM 2.5</v-card-subtitle>
                  <v-card-subtitle style="margin:8px; padding:0px;">PM 1.0</v-card-subtitle>
              </v-card>
            </v-card>
          
          </v-card>
        </v-card>
      </v-card>
      <v-card v-model="info" app dark flat width="95%" class="mx-auto justify-center" style="margin: 5%;height: 350px; background-color: rgba(256,256,256,0.3);  font-size: 24px;">
        <v-tabs
          show-arrows 
          center-active
          dark
          background-color="transparent"
          class="subtitle-2"
          style="font-weight:100"
        >
          <v-tab>
            History
          </v-tab>
        </v-tabs >
        <v-card dark flat class="transparent flex-column">
          
        </v-card>
      </v-card>
    </v-card>
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