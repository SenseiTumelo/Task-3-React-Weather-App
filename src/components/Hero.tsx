import { useState } from "react";
import { Button } from "./Button";

export const Hero = () => {
 interface apiData{
  cityName: String,
  temperature: Number
}

  const [data, setData] = useState<apiData[]>([]);
       //const apiKey = "912533d7b0a5f9eaa2cb9be133558ccb";
        const apiKey = import.meta.env.VITE_API_KEY;
      
const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>)=>{
      const cityName = e.target.city.value;
      e.preventDefault(); 
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
      .then(res=>res.json())
      .then(data=>{ console.log(data); setData(data)});
  
} 
if(!data){
  return <div>Loading...</div>
}
 return (
    <>
         <main className="hero-section">
          <div className="card-wrapper">
              <div className="card card-1">
                    
                   <div className="currentWeather">
                    <h1></h1>
                   </div>
              </div>
              
              
              <div className="card card-2">
                <form onSubmit={handleSubmit}>
                      <input type="text" id="city" name="city" placeholder="Search for location" />
                      <button>Search</button>
                   </form></div>
              <div className="card card-3">
                <Button>Overview</Button>
                <Button>Temperature</Button>
                <Button>Humidity</Button>
                <Button>Cloud Cover</Button>
              </div>
              <div className="card card-4">four</div>
              <div className="card card-5">five</div>
          </div>
        </main>
    </>

  )
}
