import React, { Component } from 'react';
import './App.css';
import possibleTags from "./constants";

class App extends Component {
  state = {
    teamOneInput: ``,
    teamTwoInput: ``,
    correctAnswers: [],
    teamOne: 0,
    teamTwo: 0,
    teamOneName: ``,
    teamTwoName: ``,
    showIncorrectWarning: false
  }

  answerContainer = null;

  handleSubmit = (team, field, event) => {
    event.preventDefault();
    this.verifyAnswer(this.state[field], team);
  }

  handleChange = (field, event) => {
    this.setState({
      [field]: event.target.value
    });
  }

  verifyAnswer = (answer, team) => {
    const isCorrect = possibleTags.includes(answer);
    if (isCorrect) {
      const correctAnswers = this.state.correctAnswers;
      const isDuplicate = correctAnswers.includes(answer);

      if (!isDuplicate) {
        correctAnswers.push(answer);
        let score = this.state[team];
        score++;

        this.setState({
          correctAnswers,
          [team]: score,
          teamOneInput: ``,
          teamTwoInput: ``
        });

      } else {
        console.log("Already used!")
      }

    } else {
      console.log("Incorrect!")
      this.setState({
        showIncorrectWarning: true
      });
    }


  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    this.updateScroll();
  }

  componentDidUpdate() {
    this.updateScroll();
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  updateScroll = () => {
    this.answerContainer.scrollTop = this.answerContainer.scrollHeight;
  }

  dismissIncorrectWarning = () => {
    this.setState({
      showIncorrectWarning: false
    });
  }

  render() {
    const { teamOne, teamTwo, correctAnswers, teamOneName, teamTwoName, showIncorrectWarning } = this.state;

    const displayedAnswers = correctAnswers.map(answer => <li><svg fill="#35c735" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg>&lt;{answer}&gt;</li>)

    return (
      <>
        <header>
          <h1>HTML <span className="fun">Fun</span>damentals</h1>
        </header>

        <div className="container">

          <div className="row">
            <div className="col team-one">
              <input tabIndex="-1" className="team-name" value={teamOneName} onChange={e => this.handleChange("teamOneName", e)} />
              <figure className="score">
                {teamOne}
              </figure>
              <form autocomplete="off" onSubmit={e => this.handleSubmit("teamOne", "teamOneInput", e)}>
                <input tabIndex="-1" autocomplete="false" name="hidden" type="text" style={{ display: `none` }}></input>
                <input tabIndex="0" type="text" name="team-one" onChange={e => this.handleChange("teamOneInput", e)} value={this.state.teamOneInput} />
                <button type="submit">Submit</button>
              </form>
            </div>
            <div className="correct-answers">
              <div className="count">
                {`${correctAnswers.length} / ${possibleTags.length}`}
              </div>
              <div ref={ref => this.answerContainer = ref} className="answer-container"><ul>{displayedAnswers}</ul></div>
            </div>

            <div className="col team-two">
              <input tabIndex="-1" className="team-name" value={teamTwoName} onChange={e => this.handleChange("teamTwoName", e)} />
              <figure className="score">
                {teamTwo}
              </figure>
              <form autocomplete="off" onSubmit={e => this.handleSubmit("teamTwo", "teamTwoInput", e)}>
                <input tabIndex="-1" autocomplete="false" name="hidden" type="text" style={{ display: `none` }}></input>
                <input tabIndex="0  " type="text" name="team-two" onChange={e => this.handleChange("teamTwoInput", e)} value={this.state.teamTwoInput} />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
        {showIncorrectWarning && <div onClick={this.dismissIncorrectWarning} className="incorrect-warning">Wrong!</div>}
      </>

    );
  }
}

export default App;
