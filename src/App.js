import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'firebase/database';
import RaffleForm from './raffle/form';
import RafflePicker from './raffle/picker';
import './app.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={RaffleForm} />
          <Route path="/raffle" component={RafflePicker} />
        </div>
      </Router>
    );
  }
}
export default App;
