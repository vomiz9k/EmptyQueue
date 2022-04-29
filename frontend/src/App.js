import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QueueList from './QueueList';
import QueueEdit from "./QueueEdit";
import { globalStateContext } from './Context'

class App extends Component {
  
  render() {
    return (
      <globalStateContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route path='/queue' exact={true} component={QueueList}/>
              <Route path='/' exact={true} component={QueueList}/>
              <Route path='/queue/:id' component={QueueEdit} />
          </Switch>
        </Router>
      </globalStateContext.Provider>
    )
  }
}

export default App;