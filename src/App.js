import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
import './typography';

import store from './store'
import Main from './Main'

const App = () => (
  <Provider store={store}>
      <Router>
          <Route component={Main}/>
      </Router>
  </Provider>
)

export default App;
