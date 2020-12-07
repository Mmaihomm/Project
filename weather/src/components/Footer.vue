<template>
  <v-card>
    <v-footer
      fixed
      dark
      height="40%"
      color="#0A275A"
      class="font-weight-medium"
      style="z-index:9999;"
    >
      <v-col
        class="text-center align-content-center"
        style="padding-top: 4px; font-size: 80%"
        cols="12"
      >
        <p>Visualization Based on APRS Data Network. <a href="https://aprs.fi" target="_blank" style="color:yellow;">Go to APRS.fi </a></p>
      </v-col>
    </v-footer>
  </v-card>
</template>

<script>
export default {
  name: "MyFooter",
};
</script>

<style>
</style>