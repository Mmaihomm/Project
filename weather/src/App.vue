<template>
  <v-app>
    <MyHeader/>
      
  </v-app>
</template>

<script>
  import MyHeader from './components/Header'

export default {
  
  name: 'App',

  components: {
   MyHeader
  },

  data: () => ({
    //
  }),
};
</script>
