import axios from "axios"

export const apiService = {
  weatherData,
  stationList,
  pmData,
};
axios.defaults.withCredentials = true

//name type time lasttime lat long
async function stationList() {

  let records = [];
  let page = 0;
  let nextPage = 0;

  do {
      let { data: response }  = await axios.get('http://127.0.0.1:8000/weather/reportstation', { 
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




function weatherData(stationnid) {
  axios.get('http://127.0.0.1:8000/weather/weatherdata/' + stationnid ,{
    headers:{
      'Accept': 'application/json', 
    },
  }).then((data)=>{
        console.log(data.data)
        return data.data
  }).catch((e)=>{
        console.log(e)
  })

}

function pmData(stationname){
  axios.get('' + stationname)
}