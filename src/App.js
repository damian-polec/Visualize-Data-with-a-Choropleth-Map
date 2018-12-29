import React, { Component } from 'react';
import './App.css';
import ChoroplethMap from './components/ChoroplethMap/ChoroplethMap';

class App extends Component {
  state = {
    userEducationData: null,
    counties: null
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
      .then(response => response.json())
      .then(data => this.setState({userEducationData: data}))
      .catch(error => console.log(error));
    fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
      .then(response => response.json())
      .then(data => this.setState({counties: data}))
      .catch(error => console.log(error));
  }
  render() {
    return (
      <div className="App">
        <h1 id='title'>United States Educational Attainment</h1>
        <h3 id='description'>Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h3>
        {this.state.userEducationData && this.state.counties 
          ? <ChoroplethMap 
              data={this.state.userEducationData}
              geoLoc={this.state.counties}/> 
          : null}
      </div>
    );
  }
}

export default App;
