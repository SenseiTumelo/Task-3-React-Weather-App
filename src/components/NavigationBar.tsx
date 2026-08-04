
import {Button} from "./ButtonComponent/Button"
import lightMode from "../assets/navbarIcons/light-mode.png"
import darkMode from "../assets/navbarIcons/night-mode.png"
import {Text} from "../components/Text"
import { useEffect, useState } from "react";
import {DarkmodeToggle} from "./DarkMode/DarkmodeToggle"

export const NavigationBar = () => {
const [isDarkmode, setIsDarkmode] = useState(localStorage.getItem('isDarkMode') === 'true');

useEffect(() =>{
    document.body.classList.toggle('darkmode', isDarkmode);
}, [isDarkmode]);

return (
    <header>
        <nav>
            <Text variant='h2'>Weather App</Text>
            <DarkmodeToggle isDarkMode={isDarkmode} setIsDarkMode={setIsDarkmode}/>
            <div className="deg-to-Fer">
                <Button>Deg</Button>
                <Button>Fer</Button>
            </div>
            

        </nav>
    </header>
  )
}
