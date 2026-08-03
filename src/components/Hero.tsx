import { useState } from "react";
import {Text} from "./Text"
import {Button} from "./ButtonComponent/Button"

export const Hero = () => {

  const [data, setData] = useState();
        const apiKey = import.meta.env.VITE_API_KEY;
   
      
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>)=>{
      const cityName = e.target.city.value;
      e.preventDefault(); 
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
      .then(res=>res.json())
      .then(data=>{ console.log(data); setData(data); localStorage.setItem("weater-details",JSON.stringify(data.city.name))});
  
} 


 return (
    <>
         <main className="hero-section">
          <div className="location-details">

            <form onSubmit={handleSubmit}>
                  <input type="text" id="city" name="city" placeholder="Search for location" />
                  <Button style={{color: "#fff", marginLeft: "0.5rem", width:"5rem", height:"2.5rem"}}>Search</Button>
            </form>
            <Text variant="h1">22&deg;C</Text>
          </div>
          
        </main>
    </>

  )
}
