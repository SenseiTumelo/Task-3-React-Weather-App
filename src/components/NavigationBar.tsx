
import {Button} from "./ButtonComponent/Button"
import {Text} from "../components/Text"
import {DarkmodeToggle} from "./DarkMode/DarkmodeToggle"

export const NavigationBar = () => {


return (
    <header>
        <nav>
            <Text variant='h2'>Weather App</Text>
            
            <div className="deg-to-Fer">
                <Button>Deg</Button>
                <Button>Fer</Button>
            </div>
            

        </nav>
    </header>
  )
}
