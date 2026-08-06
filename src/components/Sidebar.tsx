import { NavLink } from 'react-router-dom';
import {Text} from './Text';
import {sidebarLinks} from '../data/appdata'

export const Sidebar = () => {
  return (
        <div className="side-nav">
          <Text variant="h2">Weather Today</Text>  
          <nav className="nav-list">
            {sidebarLinks.map((link)=>
            <NavLink to={link.path} id={link.id} className='navigator'>
                <img src={link.icon} alt="" className="icons" />
                {link.linkName}
            </NavLink>
            )}

          </nav>
          <div>
          </div>
        </div>   
  )
}
