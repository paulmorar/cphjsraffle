import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'firebase/database';
import RaffleForm from './raffle/form.js';
import RafflePicker from './raffle/picker.js';
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
