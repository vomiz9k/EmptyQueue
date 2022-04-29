import React, {Component} from 'react';
import {Navbar, NavbarBrand, NavItem, NavLink} from 'reactstrap';
import {Link} from 'react-router-dom';
import { globalStateContext } from "./Context"

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var names = ["Andrey_lox", "Kirill_4mo", "Lexa_G@y", "Sanya_HuiSosi", "Kostya_ped1k", "Serega_gand0n"];

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
        this.name = names[getRandomInt(5)];
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand/>
            <NavbarBrand tag={Link} to="/">{this.name}</NavbarBrand>
             {/* <globalStateContext.Consumer>
                {({isLoggedIn}) => (
                <NavItem className="ms-auto">
                    { !isLoggedIn ? <NavLink href="/perform_login/">Login</NavLink> : <NavLink href="/perform_logout/">Logout</NavLink> }
                </NavItem>
                )}
            </globalStateContext.Consumer> */}
        </Navbar>;
    }
}