import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Button, Container } from 'reactstrap';
import queue from "./queue.png"

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid style={{ 
                    display: "flex",
                    "justifyContent": "center",
                    "alignItems": "center",
                    "flexDirection": "column"
                }}>
                    <img src={queue} alt=""></img>
                    <h3>EmptyQueue - service for building queues.</h3>  
                    <Button  onClick={()=> {this.props.history.push('/queue')}}>Get started</Button>
                </Container>
                
            </div>
        );
    }
}

export default Home;