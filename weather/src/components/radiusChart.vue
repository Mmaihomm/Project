<template>
    <div>
        <apexcharts type="radialBar" :options="chartOptions" :series="serie"></apexcharts>
    </div>
</template>

<script>
import apexcharts from 'vue-apexcharts'
export default {
    name: "radChart",
    components: {
        apexcharts,
    },
    props:{
       serie:Array, 
       color:Array,
    },
    data() {
      return {
                series: [3],
                chartOptions: {
                            chart: {
                            type: 'radialBar',
                            offsetY: -20,
                            sparkline: {
                                enabled: true
                                }
                            },
                            plotOptions: {
                                radialBar: {
                                    startAngle: -90,
                                    endAngle: 90,
                                    track: {
                                        background: "#e7e7e7",
                                        strokeWidth: '97%',
                                        margin: 5, // margin is in pixels
                                        dropShadow: {
                                            enabled: true,
                                            top: 2,
                                            left: 0,
                                            color: '#999',
                                            opacity: 1,
                                            blur: 2
                                        }
                                    },
                                    dataLabels: {
                                        name: {
                                            show: false
                                            },
                                        value: {
                                            offsetY: -2,
                                            fontSize: '15px',
                                            formatter: function (val) {
                                                return val 
                                                }
                                            }
                                    }
                                }
                            },
                            grid: {
                                padding: {
                                    top: -10
                                }
                            },
                            fill: {
                                colors: [this.color],
                                type: 'gradient',
                                gradient: {
                                    shade: 'light',
                                    shadeIntensity: 0.4,
                                    inverseColors: false,
                                    opacityFrom: 1,
                                    opacityTo: 1,
                                    stops: [0, 50, 53, 91]
                                },
                            },
                            labels: ['Average'],
                        },
        };
    },
   
};   
</script>

<style>

</style>