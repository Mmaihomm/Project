import axios from "axios"

export const apiService = {
  reportStation,
  weatherData,
};
axios.defaults.withCredentials = true

function reportStation() {
   axios.get('http://127.0.0.1:8000/weather/reportstation/?page=1',{
    headers: {
      'Accept': 'application/json', 
      'Authorization':' ',
    },
  }).then((data)=>{
        console.log(data)

  }).catch((e)=>{
    console.log(e)

  })

}

function weatherData() {
  axios.get('http://127.0.0.1:8000/weather/weatherdata/?page=1',{
    headers:{
      'Accept': 'application/json', 
    },
  }).then((data)=>{
        console.log(data)
  }).catch((e)=>{
        console.log(e)
  })

}