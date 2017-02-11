import React, { Component } from 'react';
import './App.min.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: 25,
      breakMinutes: 5,
      seconds: 0,
      count: 0,
      on: false,
      end: false,
      background: true,
      breakOn: false,
      customSessionLength: 25,
      sessOrBreak: "Session"
    }
  }

  componentDidUpdate() {
    if(this.state.minutes === 0 && this.state.seconds === 0 && this.state.breakOn === false) {
      this.setState({
        background: false,
        minutes: this.state.breakMinutes,
        breakOn: true,
        sessOrBreak: "Break"
      })
    } else if (this.state.minutes === 0 && this.state.seconds === 0 && this.state.breakOn === true) {
        this.setState({
          background: true,
          minutes: this.state.customSessionLength,
          breakOn: false,
          sessOrBreak: "Session"
        })
    }
  }

  changeBackground() {
    if(this.state.background) {
      return "normal-background"
    } else {
      return "alert-background"
    }
  }

  handleDecrementBreak() {
    if(this.state.breakOn) {
      this.setState({
        minutes: this.state.minutes - 1
      })
    } else {
      this.setState({
        breakMinutes: this.state.breakMinutes - 1
      })
    }
  }

  handleIncrementBreak() {
    if(this.state.breakOn) {
      this.setState({
        minutes: this.state.minutes + 1
      })
    } else {
      this.setState({
        breakMinutes: this.state.breakMinutes + 1
      })
    }
  }

  handleDecrement() {
    if(this.state.on === false && this.state.breakOn === false) {
      this.setState({
        minutes: this.state.minutes - 1,
        customSessionLength: this.state.customSessionLength - 1
      })
    }
  }

  handleIncrement() {
    if(this.state.on === false && this.state.breakOn === false) {
      this.setState({
        minutes: this.state.minutes + 1,
        customSessionLength: this.state.customSessionLength + 1
      })
    }
  }

  reduceMinutes() {
    this.setState({
      minutes: this.state.minutes - 1,
      seconds: 59
    })
  }

  reduceSeconds() {
    this.setState({
      seconds: this.state.seconds - 1
    })
  }

  endCount() {
    end: !this.state.end
  }

  toggleCount() {
    this.setState({
      on: !this.state.on
    })
  }

  startCount() {
    this.setState({
      on: !this.state.on,
      count: this.state.count + 1
    })
  }

  restartCount() {
    this.setState({
      on: !this.state.on
    })
  }

  render() {
    return (
      <div className="App" id={this.changeBackground()}>
        <Header />
        <Clock sessOrBreak={this.state.sessOrBreak} restartCount={this.restartCount.bind(this)} startCount={this.startCount.bind(this)} toggleCount={this.toggleCount.bind(this)} endCount={this.endCount.bind(this)} minutes={this.state.minutes} seconds={this.state.seconds} count={this.state.count} on={this.state.on} end={this.state.end} reduceMinutes={this.reduceMinutes.bind(this)} reduceSeconds={this.reduceSeconds.bind(this)}/>
        <Time breakOn={this.state.breakOn} on={this.state.on} increment={this.handleIncrement.bind(this)} decrement={this.handleDecrement.bind(this)} minutes={this.state.minutes} seconds={this.state.seconds} />
        <Break on={this.state.on} increment={this.handleIncrementBreak.bind(this)} decrement={this.handleDecrementBreak.bind(this)} breakMinutes={this.state.breakMinutes} />
        <Footer />
      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <div className="header">
        <p>Pomodoro Clock</p>
      </div>
    )
  }
}

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" target="_blank"><div>
          <p>This app is based off of the Pomodoro time management technique.</p>
          <p>To learn more about the technique, and how you can make use of this app to be more productive please click here</p>
        </div></a>
      </div>
    )
  }
}

class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: 25,
      seconds: 0,
      count: 0,
      on: false,
      end: false
    }
  }

  countdown() {
    var self = this
    let timeInterval = setInterval(function() {
      if(self.props.seconds === 0) {
        self.props.reduceMinutes()
      } else {
        self.props.reduceSeconds()
      }
      if (self.props.minutes === 0 && self.props.seconds === 0) {
        this.props.endCount()
      }
      if(self.props.end === true || self.props.on === false) {
        clearInterval(timeInterval)
      }
    },1000);
  }

  handleClick() {
    if(this.props.on){
      this.props.toggleCount()
    } else if (this.props.count === 0) {
      this.props.startCount()
      this.countdown()
    } else {
      this.props.restartCount()
      this.countdown()
    }
  }

  render() {
    return (
      <div className="clock" style={{cursor:'pointer'}} onClick={() => this.handleClick()}>
        <div className="ses">{this.props.sessOrBreak}</div>
        <div>{("0" + this.props.minutes).slice(-2)}:{("0" + this.props.seconds).slice(-2)}</div>
      </div>
    );
  }
}


class Time extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: this.props.minutes
    }
  }

  timeDecrement() {
    if(this.props.on === false && this.props.breakOn === false && this.props.minutes > 1) {
      this.props.decrement()
      this.setState({
        minutes: this.state.minutes - 1
      })
    }
  }

  timeIncrement() {
    if(this.props.on === false && this.props.breakOn === false) {
      this.props.increment()
      this.setState({
        minutes: this.state.minutes + 1
      })
    }
  }

  render() {
    return (
      <div className="small-box ses-length">
        <p>Session Length</p>
        <div className="length">
          <div className="changer decrement" style={{cursor:'pointer'}} onClick={() => this.timeDecrement()}><button>-</button></div>
          <p>{this.state.minutes}</p>
          <div className="changer increment" style={{cursor:'pointer'}} onClick={() => this.timeIncrement()}><button>+</button></div>
        </div>
      </div>
    );
  }
}

class Break extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: 5
    }
  }

  componentDidUpdate() {
    if(this.state.minutes === 0) {
      this.setState({
        minutes: 5
      })
    }
  }

  breakDecrement() {
    if(this.props.on === false && this.props.breakMinutes > 1) {
      this.props.decrement()
      this.setState({
        minutes: this.state.minutes - 1
      })
    }
  }

  breakIncrement() {
    if(this.props.on === false) {
      this.props.increment()
      this.setState({
        minutes: this.state.minutes + 1
      })
    }
  }

  render() {
    return (
      <div className="small-box">
        <p>Break Length</p>
        <div className="length">
          <div className="changer decrement" style={{cursor:'pointer'}} onClick={() => this.breakDecrement()}><button>-</button></div>
          <p>{this.state.minutes}</p>
          <div className="changer decrement" style={{cursor:'pointer'}} onClick={() => this.breakIncrement()}><button>+</button></div>
        </div>
      </div>
    );
  }
}

export default App;
