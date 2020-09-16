<template>
  <v-app>
    
    <v-card-text style="height: 60px;" ><MyHeader/> </v-card-text>
    <v-card-text style="height: 150px; position: relative">
        <v-btn
            absolute
            dark
            fab
            buttom
            right
            color="#0A275A"
        >
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
    </v-card-text>
        
    <google-map />


  </v-app>
  
</template>

<script>
  import MyHeader from './components/Header'
  import GoogleMap from "./components/GoogleMap";


export default ({
  name: 'App',

  components: {
   MyHeader,
   GoogleMap
  },

})

</script>
