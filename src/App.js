import React, { Component } from 'react';
import { DB_CONFIG } from './firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/database';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import cphjs from './cphjs.png';
import './app.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      number: '',
      raffleNumber: -1,
      raffleWinner: {},
      isLoading: false,
      submitSuccessful: false,
      participantsData: []
    };

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app
      .database()
      .ref()
      .child('participantsData');

    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleNumberInput = this.handleNumberInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  setCookie() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    document.cookie = `submittedRaffle=true; expires=${expiryDate}; path=/`;
  }

  generateRandomNumber() {
    const min = Math.ceil(0);
    const max = Math.floor(1000000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  handleSubmit() {
    const { name, number } = this.state;

    this.setState({
      isLoading: true
    });

    this.database.push().set({
      name: name,
      number: number
    });

    setTimeout(() => {
      this.setCookie();
      this.setState({
        isLoading: false,
        submitSuccessful: true
      });
    }, 2000);
  }

  handleTextInput(e) {
    this.setState({ name: e.target.value });
  }

  handleNumberInput(e) {
    this.setState({ number: e.target.value });
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
    const {
      name,
      number,
      raffleNumber,
      raffleWinner,
      isLoading,
      submitSuccessful
    } = this.state;

    return (
      <div className="app">
        <header className="app__header">
          <img src={cphjs} className="app__logo" alt="logo" />
          <h1 className="app__title">Welcome to our Raffle</h1>
        </header>
        <div className="app__body">
          {isLoading && <CircularProgress size={50} />}
          {submitSuccessful && <h1>Thank you for submitting your answer!</h1>}
          {!isLoading &&
            !submitSuccessful && (
              <React.Fragment>
                <TextField
                  id="name"
                  label="Name"
                  value={name}
                  onChange={this.handleTextInput}
                  className="app__body__input"
                  margin="normal"
                />
                <TextField
                  id="number"
                  label="Number"
                  min="0"
                  max="1000"
                  value={number}
                  onChange={this.handleNumberInput}
                  type="number"
                  className="app__body__input"
                  margin="normal"
                />
                <Button
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                  className="app__body__input"
                >
                  Submit
                </Button>
              </React.Fragment>
            )}
          {raffleNumber >= 0 && <h1>{raffleNumber}</h1>}
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

export default App;
