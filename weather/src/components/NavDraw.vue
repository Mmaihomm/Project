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
        z-index: 10;
        position: absolute;
        right: 0px;
        width: 400px;
        height: 85%;
        background-image: linear-gradient(to bottom, rgba(77, 133, 233, 0.95),rgba(255, 255, 255));
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