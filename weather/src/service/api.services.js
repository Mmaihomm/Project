import axios from "axios"

export const apiService = {
  weatherData,
  stationList,
  pmData,
  historyData,
  forecastData,
};
// axios.defaults.withCredentials = true

//name type time lasttime lat long
async function stationList() {

  let records = [];
  let page = 0;
  let nextPage = 0;

  do {
      let { data: response }  = await axios.get('http://161.246.5.197:10001/weather/reportstation', { 
        params: { page: ++page },
        headers: {
          'Accept': 'application/json', 
        }, 
      })
      nextPage = response.next;
      //console.log(`downloadRecords: page ${page} of ${nextPage} downloaded...`);
      records = records.concat(response.results);
      //console.log("records.length:", records.length);
      
  } while (nextPage != null)
  //console.log(records)
  return records
}




async function weatherData(stationnname) {
  var result = await  axios.get('http://161.246.5.197:10001/weather/weatherdata/?search=' + stationnname ,{
    headers:{
      'Accept': 'application/json', 
    },
  })
  return result.data.results[0];
}

async function pmData(stationname){
  var result = await axios.get('http://161.246.5.197:10001/weather/pmdata/?search=' + stationname,{
    headers:{
      'Accept': 'application/json', 
    },
  })
  // .then((data)=>{
  //       console.log(data.data.results[0])
  //       return data.results
  // }).catch((e)=>{
  //       console.log(e)
  // })
  return result.data.results;

}

async function historyData(stationnname) {
  var result = await  axios.get('http://161.246.5.197:10001/weather/weatherhistory/?search=' + stationnname ,{
    headers:{
      'Accept': 'application/json', 
    },
  })
  return result.data.results;
}

async function forecastData(stationnname) {
  var result = await  axios.get('http://161.246.5.197:10001/weather/forecast/?search=' + stationnname ,{
    headers:{
      'Accept': 'application/json', 
    },
  })
  return result.data.results;
}