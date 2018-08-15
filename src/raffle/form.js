import React, { Component } from 'react';
import { DB_CONFIG } from '../firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/database';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import cphjs from '../cphjs.png';
import '../app.css';

class RaffleForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      number: '',
      isLoading: false,
      submitSuccessful: false
    };

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app
      .database()
      .ref()
      .child('participantsData');

    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleNumberInput = this.handleNumberInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (document.cookie.indexOf('submittedRaffle=true') >= 0) {
      this.setState({
        submitSuccessful: true
      });
    }
  }

  setCookie() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    document.cookie = `submittedRaffle=true; expires=${expiryDate}; path=/`;
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

  render() {
    const { name, number, isLoading, submitSuccessful } = this.state;

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
                  color="secondary"
                  className="app__body__input"
                >
                  Submit
                </Button>
              </React.Fragment>
            )}
        </div>
      </div>
    );
  }
}

export default RaffleForm;
