<template>
        <nav>
            <v-toolbar
            class= " font-weight-bold "
            color="#0A275A"
            dark
            elevate-on-scroll
            >
            <div class="d-flex align-center">
                <h3>APRS WEATHER VISUALIZATION</h3>
            </div>
            </v-toolbar>
        </nav>
</template>

<script>
export default {
    name: 'MyHeader',

}
</script>

<style>
    .v-toolbar{
        font-family: 'Century Gothic';
        font-size: 100%;
    }
</style>