<template>
  <nav>
    <v-card>
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
        style="top: 8px"
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
        right: 0px;
        width: 20%; 
        height: 100%;
        position: absolute;
        background-color: #4D85E9;
        "
    >
      <v-btn app dark text fab small v-model="chevright" v-on:click="isHidden=false" style="left:8px; top: 8px;">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
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