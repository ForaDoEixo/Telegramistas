import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';

import List from './containers/list';
import Create from './containers/create';

import './App.css';
import './typography';

import store from './store'

const App = () => (
  <Provider store={store}>
      <Router>
          <div id="content">
              <header>
                  <h1>TELEGRAMISTA<span>cree sus identidades</span></h1>
              </header>
              <Create/>
              <List/>
          </div>
      </Router>
  </Provider>
)

export default App;
