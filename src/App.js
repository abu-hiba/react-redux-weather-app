import React, { Component } from 'react';
import './App.scss';
import DayCard from './components/DayCard/DayCard';

class App extends Component {
  constructor() {
    super();

    this.getLocation = this.getLocation.bind(this);
    this.getPosition = this.getPosition.bind(this);

    this.state = {
      location: {
        latitude: undefined,
        longitude: undefined,
        city: '',
        country: ''
      },
      weather: {
        description: '',
        temperature: 0,
        icon: ''
      },
      isLoading: true
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.getPosition, this.showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
  }

  getPosition(position) {
    let lat = position.coords.latitude,
        lon = position.coords.longitude;

    this.setState({
      location: {
        latitude: lat,
        longitude: lon
      }
    });

    let url = this.createWeatherUrl(lat, lon, process.env.REACT_APP_API_KEY);

    fetch(url)
      .then(results => {
        if (results.status !== 200) {
          console.log(`There was a problem. Status code: ${results.status}`)
        } 
         return results.json();
      }).then(data => {
        console.log(data);

        this.setState({
          location: {
            ...this.state.location,
            city: data.name,
            country: data.sys.country
          },
          weather: {
            description: data.weather[0].description,
            temperature: data.main.temp,
            icon: data.weather[0].icon
          },
          isLoading: false
        });
      }).catch(err => console.log(err));
  }

  createWeatherUrl(latitude, longitude, key) {
    return `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${key}`;
  }

  createForecastUrl(latitude, longitude, key) {
    return `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${key}`;
  }

  showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }
  }

  render() {
    return this.state.isLoading 
    ? (<div>Loading...</div>) 
    : (
      <div className="App">
      <h3>{this.state.location.city}, {this.state.location.country}</h3>
        <DayCard
          weather={this.state.weather}/>
      </div>
    );
  }
}

export default App;