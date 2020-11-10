<template>
    <div id="chart">
        <apexcharts type="line" height="210px" width="320px" :options="chartOptions" :series="series"></apexcharts>
      </div>
</template>

<script>
import apexcharts from 'vue-apexcharts'

export default {
    name: "lineChart",
    components:{
        apexcharts
    },
    props:{
        ytext:String,
        dataHigh:Array,
        dataLow:Array,
        Min:Number,
        Max:Number,
    },
    data() {
        return{
                series: [
                    {
                        name: "High",
                        data: this.dataHigh
                    },
                    {
                        name: "Low",
                        data: this.dataLow
                    }
                ],
                chartOptions: {
                    chart: {
                        height: 350,
                        type: 'line',
                        dropShadow: {
                            enabled: true,
                            color: '#000',
                            top: 18,
                            left: 7,
                            blur: 10,
                            opacity: 0.2
                        },
                        toolbar: {
                            show: false,
                        }
                    },
                    colors: ['#77B6EA', '#545454'],
                    dataLabels: {
                        enabled: true,
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    title: {
                        text: 'Average High & Low Temperature',
                        align: 'left',
                        style: {
                                fontSize:  '11px',
                                fontWeight:  'bold',
                                fontFamily:  undefined,
                                color:  '#263238'
                        },
                    },
                    grid: {
                        show:false
                    },
                    markers: {
                        size: 1
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        title: {
                            text: 'time'
                        }
                    },
                    yaxis: {
                        title: {
                            text: this.ytext
                        },
                        min: this.Min,
                        max: this.Max,
                        tickAmount: 4,
                    },
                    legend: {
                        position: 'right',
                        horizontalAlign: 'right',
                        floating: true,
                        offsetY: -25,
                        offsetX: -5
                    }
                },
            };
        },

}
</script>

<style>

</style>