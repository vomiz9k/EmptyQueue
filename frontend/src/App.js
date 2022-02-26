import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import QueueList from './QueueList';
import QueueEdit from "./QueueEdit";
import LoginPage from './LoginPage';
import { globalStateContext } from './Context'

class App extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoggedIn !== prevState.isLoggedIn) {
      localStorage.setItem("isLoggedIn", this.state.isLoggedIn)
    }
  }

  constructor(props) {
    super(props);

    this.change = (isLoggenIn) => {
      this.setState(state => ({
        isLoggedIn:
          isLoggenIn
      }));
    };
    // localStorage.removeItem("isLoggedIn");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    this.state = {
      isLoggedIn: isLoggedIn,
      change: this.change 
    };

    fetch("/check_login").then(response => response.json()).then(response => {
      this.state = {
        isLoggedIn: response.success && isLoggedIn,
        change: this.change
      }
    })
  }

  render() {
    return (
      <globalStateContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route path='/queue' exact={true} render={() => {
               return !this.state.isLoggedIn ? (
                <Redirect to="/perform_login"/>
              ) : (
                <QueueList />
              )}}/>
              <Route path='/' exact={true} component={Home}/>
              <Route path='/queue/:id' render={() => (
                !this.state.isLoggedIn ? (
                  <Redirect to="/perform_login"/>
                ) : (
                  <QueueEdit />
                ))}/>
            <Route path='/perform_login' component={LoginPage}/>
            <Route path='/perform_logout' render={() => {
              fetch ("/perform_logout", {method: "POST"}).then(this.change(false));
              return <Redirect to="/"/>
            }}/>
          </Switch>
        </Router>
      </globalStateContext.Provider>
    )
  }
}

export default App;