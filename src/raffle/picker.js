import React, { Component } from 'react';
import { DB_CONFIG } from '../firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/database';
import Button from '@material-ui/core/Button';
import cphjs from '../cphjs.png';
import '../app.css';

class RafflePicker extends Component {
  constructor() {
    super();
    this.state = {
      raffleNumber: -1,
      raffleWinner: {},
      isLoading: false,
      participantsData: []
    };

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app
      .database()
      .ref()
      .child('participantsData');

    this.handleRaffle = this.handleRaffle.bind(this);
  }

  componentWillMount() {
    const previousData = this.state.participantsData;

    if (document.cookie.indexOf('submittedRaffle=true') >= 0) {
      this.setState({
        submitSuccessful: true
      });
    }

    // DataSnapshot
    this.database.on('child_added', snap => {
      previousData.push({
        id: snap.key,
        name: snap.val().name,
        number: snap.val().number
      });

      this.setState({
        participantsData: previousData
      });
    });

    this.database.on('child_removed', snap => {
      for (var i = 0; i < previousData.length; i++) {
        if (previousData[i].id === snap.key) {
          previousData.splice(i, 1);
        }
      }

      this.setState({
        participantsData: previousData
      });
    });
  }

  generateRandomNumber() {
    const min = Math.ceil(0);
    const max = Math.floor(1000000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  handleRaffle() {
    const raffleNumber = this.generateRandomNumber();

    this.setState({
      raffleNumber: raffleNumber
    });

    const raffleWinner = this.state.participantsData.reduce(function(
      prev,
      curr
    ) {
      return Math.abs(curr.number - raffleNumber) <
        Math.abs(prev.number - raffleNumber)
        ? curr
        : prev;
    });

    setTimeout(() => {
      this.setState({
        raffleWinner: raffleWinner
      });
    }, 4000);
  }

  render() {
    const { raffleNumber, raffleWinner } = this.state;

    return (
      <div className="app">
        <header className="app__header">
          <img src={cphjs} className="app__logo" alt="logo" />
          <h1 className="app__title">Welcome to our Raffle</h1>
        </header>
        <div className="app__body">
          {raffleNumber >= 0 ? <h1>{raffleNumber}</h1> : <h1>-</h1>}
          {!!Object.keys(raffleWinner).length && (
            <h1>{`And the raffle winner is ${raffleWinner.name} with ${
              raffleWinner.number
            }`}</h1>
          )}
          <Button
            onClick={this.handleRaffle}
            variant="contained"
            color="primary"
          >
            Raffle
          </Button>
        </div>
      </div>
    );
  }
}

export default RafflePicker;
