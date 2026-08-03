
import {Button} from "./ButtonComponent/Button"
import lightMode from "../assets/navbarIcons/light-mode.png"
import darkMode from "../assets/navbarIcons/night-mode.png"
import {Text} from "../components/Text"

export const NavigationBar = () => {

return (
    <header>
        <nav>
            <Text variant='h2'>Weather App</Text>
            <div className="theme-container">
                    <Button ><img src={lightMode} alt="" /></Button>
                    <Button ><img src={darkMode} alt="" /></Button>
            </div>
            <div className="deg-to-Fer">
                <Button>Deg</Button>
                <Button>Fer</Button>
            </div>
            

        </nav>
    </header>
  )
}
