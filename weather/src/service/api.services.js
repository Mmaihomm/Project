import axios from "axios"

export const apiService = {
  weatherData,
  stationList,
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