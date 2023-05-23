import React, {Component} from 'react';
import {Navbar, NavbarBrand, NavItem, NavLink} from 'reactstrap';
import {Link} from 'react-router-dom';
import { globalStateContext } from "./Context"

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand/>
            <NavbarBrand tag={Link} to="/">EmptyQueue</NavbarBrand>
             <globalStateContext.Consumer>
                {({isLoggedIn}) => (
                <NavItem className="ms-auto">
                    { !isLoggedIn ? <NavLink href="/perform_login/">Login</NavLink> : <NavLink href="/perform_logout/">Logout</NavLink> }
                </NavItem>
                )}
            </globalStateContext.Consumer>
        </Navbar>;
    }
}