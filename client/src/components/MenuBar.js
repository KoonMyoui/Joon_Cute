import React, { useContext,useState } from 'react'
import { Menu } from 'semantic-ui-react'
import {Link} from 'react-router-dom'

import { AuthContext } from '../context/auth'

function MenuBar(){

    const pathname = window.location.pathname;
    // /login
    const {user, logout} = useContext(AuthContext)
    const path = pathname === '/' ? 'home' : pathname.substr(1);
    const [activeItem, setActiveItem] = useState(path);// ขึ้น point ที่หน้า ตาม path

    const handleItemClick = (e, { name }) => setActiveItem(name);

    const menuBar = user ? (
        <Menu pointing secondary size="massive" color="orange">

            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                as={Link}
                to={'/'}
            />

            <Menu.Menu position="right">
                <Menu.Item name={user.username} active as={Link} to="/" />
                <Menu.Item name="logout" onClick={logout} />
            </Menu.Menu>
        </Menu>
    ):(
        <Menu pointing secondary size="massive" color="orange">
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to={'/'}
            />

            <Menu.Item
                name='joon'
                active={activeItem === 'joon'}
                onClick={handleItemClick}
                as={Link}
                to={'/'}
            />

            <Menu.Menu position='right'>
            <Menu.Item
                name='login'
                active={activeItem === 'login'}
                onClick={handleItemClick}
                as={Link}
                to={'/login'}
            />
            <Menu.Item
                name='register'
                active={activeItem === 'register'}
                onClick={handleItemClick}
                as={Link}
                to={'/register'}
            />
            </Menu.Menu>
        </Menu>
    )

    return menuBar;//ตัวบาร์ของเรา pointing คือตัวสีข้างล่างว่าอยู่ที่ไหน


}

export default MenuBar;