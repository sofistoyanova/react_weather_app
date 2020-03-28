import React from 'react';
import Form from './components/form/Form';
import Weather from './components/weather/Weather';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      weatherData: {},
      showForecast: false
    }
  }

  getForecast = async (longtitude, latitude) => {
    try {
      const forecastURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/91d9b7283ecd94de1e0afc86e0403ee0/${latitude},${longtitude}?units=si`;
      console.log(forecastURL)
      const response = await fetch(forecastURL)
      const json = await response.json();

      const weatherData = {
        summary: json.daily.data[0].summary,
        temperature: json.currently.temperature,
        icon: json.currently.icon
      }
      return weatherData
    
    }catch(error) {
      this.setState({errorMessage: 'there is an error with the forecast'})
      console.log('forecast error', error)
    }
  }

  getGeocode = async (city) => {
    try {
      const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=pk.eyJ1Ijoic2hhdW5hYSIsImEiOiJjazBjNWg4MHMweXJ3M2Jud3NmYmZuOHByIn0.p_BbNZ_GSVqe7fWuN-VXdw&limit=1`;
      
      const response = await fetch(geocodeURL);
      const json = await response.json();
      if(json.features.length === 0) {
        this.setState({
          errorMessage: 'your city is not found'
        })
      }else {
        const latitude = json.features[0].center[1]
        const longtitude = json.features[0].center[0]

        const weatherData = await this.getForecast(longtitude, latitude)
        weatherData.city = json.features[0].place_name
        this.setState({
          errorMessage: '',
          weatherData,
          showForecast: true
        })
        console.log(this.state)
      }
    }catch(err) {
      this.setState({errorMessage: 'network error'})
    }
   
  }

  handlerFormSubmit = async (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    if(city) {
      this.getGeocode(city)
    }else {
      alert('please enter a city');
    }
    
   
  };

  render() {
      const {summary, temperature, icon, city} = this.state.weatherData
      const weahterComponent = this.state.showForecast ? <Weather summary={summary} temperature={temperature} icon={icon} city={city} /> : ''
      return(
        <div id="app">
          <p>{this.state.errorMessage}</p>
          <Form onFormSubmit={this.handlerFormSubmit} />
          {weahterComponent}
        </div>
      )
    }
}

export default App;
