import React from 'react';
import { PropTypes } from 'prop-types';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { AnimatedRoute, AnimatedSwitch } from 'react-router-transition';

import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import { createActions, handleActions } from 'redux-actions';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localforage';

import Typography from 'typography';
import lincolnTheme from 'typography-theme-lincoln';

import deepEqual from 'fast-deep-equal';
import cloneDeep from 'clone-deep';

import Twitter from 'twitter';

import logo from './logo.svg';
import './App.css';

const typography = new Typography(lincolnTheme)
typography.injectStyles()

const actionCreators = createActions({
  APP: {
    SETTINGS: undefined,
    HASHTAGS: {
      ADD: undefined,
      REMOVE: undefined,
      TOGGLE: undefined,
    },
    USERS: {
      ADD: undefined,
      REMOVE: undefined,
      TOGGLE: undefined,
    }
  },
  TWITTER: {
    CONNECT: undefined,
    DISCONNECT: undefined,
    ERROR: undefined,
  }
})

const rootReducer = handleActions({
  APP: {
    SETTINGS: (state, {payload}) => ({...state, settings: payload}),
    HASHTAGS: {
      ADD: ({hashtags, ...state}, {payload}) => ({
        ...state,
        hashtags: {
          ...hashtags,
          [payload] : true
        }}),
      REMOVE: ({hashtags, ...state}, {payload}) => {
        delete hashtags[payload]
        return {...state, hashtags}
      },
      TOGGLE: ({hashtags}, {payload}) => {
        hashtags[payload] = !!!hashtags[payload]
        return {hashtags}
      }
    },
    USERS: {
      ADD: ({users, ...state}, {payload}) => ({
        ...state,
        users: {
          ...users,
          [payload] : true
        }}),
      REMOVE: ({users, ...state}, {payload}) => {
        delete users[payload]
        return {...state, users}
      },
      TOGGLE: ({users}, {payload}) => {
        users[payload] = !!!users[payload]
        return {users}
      }
    },
  }, TWITTER: {
    CONNECT: (state, {payload}) => ({...state, twitter: {connected: true, error: true}}),
    DISCONNECT: (state, {payload}) => ({...state, twitter: {connected: false, error: false}}),
    ERROR: (state, {payload}) => ({...state, twitter: {connected: false, error: true}}),
  }
}, {settings: {}, hashtags: {}, users: {}, twitter: {connected: false, error: false}})

const reducer = storage.reducer(rootReducer)
const engine = createEngine('slurp');
const middleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
const store = createStoreWithMiddleware(reducer)

const load = storage.createLoader(engine);
load(store);

const settingDescriptors = {
  consumer_key: 'Consumer Key',
  consumer_secret: 'Consumer Secret',
  access_token: 'Access Token',
  access_token_secret: 'Access Token Secret'
}

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = {}
  }

  updateInputs(props) {
    const {settings} = props
    Object.keys(this.inputs).map(key => this.inputs[key].value = settings[key] || "")
  }

  componentWillMount() {
    setTimeout(() => this.updateInputs(this.props), 200)
  }

  componentWillUpdate(nextProps) {
    this.updateInputs(nextProps)
  }

  render () {
    const {action, settings} = this.props

    const updateSettings = () => {
      const ret = Object.keys(this.inputs).reduce((acc, key) => Object.assign({}, acc, {
        [key]: this.inputs[key].value
      }), {})

      action(ret)
    }

    return (
      <div className="Settings">
          <h1>Twitter</h1>
          <form onSubmit={e => {
              e.preventDefault()
              updateSettings()
          }}>
              <ul>
                  {
                    Object.entries(settingDescriptors).map(([key, value]) => (
                      <li key={key}>
                          <label htmlFor={key}>{value}</label>
                          <input name={key} ref={node => this.inputs[key] = node}/>
                      </li>
                    ))
                  }
              </ul>
              <button type='submit'>Set</button>
          </form>
      </div>
    )
  }
}

const ConnectedSettings = connect(
  ({settings}) => ({settings}),
  (dispatch) => ({action: bindActionCreators(actionCreators.app.settings, dispatch)})
)(Settings)

const NavBar = () => (
  <nav className="Main-nav">
      <img src={logo} className="App-logo" alt="logo" />
      <nav>
          <h1>SLURP</h1>
          <ul>
              <NavLink to="/main">Main</NavLink>
              <NavLink to="/stats">stats</NavLink>
          </ul>
      </nav>
      <NavLink to="/settings">Settings</NavLink>
  </nav>
)

const Stats = () => (
  <div>
      Here go pretty graphs
  </div>
)

const TagsSelector = ({name, collection, actions, marker=""}) => {
  let input;

  console.error('collection', collection)

  return (
    <section>
        <h1>{name}</h1>
        <form  onSubmit={e => {
            e.preventDefault()
            if (!input.value.trim()) {
              return
            }
            actions.add(input.value)
            input.value = ''
        }}>
            <input ref={node => input = node} />
            <button type='submit'>add</button>
        </form>
        <ul className="List">
            {Object.keys(collection).map((item, key) => (
              <li key={`${item}`} className="List-item">
                  <span>{marker}{item}</span>
                  <button onClick={() => actions.remove(item)}>remove</button>
              </li>
            ))}
        </ul>
    </section>
  )
}

TagsSelector.propTypes = {
  name: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}

const HashTagsSelector = connect(
  ({hashtags}) => ({name: 'hashtags', collection: hashtags, marker: '#'}),
  (dispatch) => ({actions: bindActionCreators(actionCreators.app.hashtags, dispatch)})
)(TagsSelector)

const UsersSelector = connect(
  ({users}) => ({name: 'users', collection: users, marker: '#'}),
  (dispatch) => ({actions: bindActionCreators(actionCreators.app.users, dispatch)})
)(TagsSelector)


const Home = () => (
  <div className="App">
      <header className="App-header">
          <h1 className="App-title">Welcome to Slurp</h1>
      </header>
      <div className="Sections">
          <HashTagsSelector/>
          <UsersSelector/>
      </div>
  </div>
)

const Layout = () => (
  <div>
      <NavBar/>
      <div className="Content">
          <AnimatedSwitch
            className="route-wrapper"
            atEnter={{ offset: -100, opacity: 0 }}
            atLeave={{ offset: -100, opacity: 0 }}
            atActive={{ offset: 0, opacity: 1 }}
            mapStyles={(styles) => ({
                opacity: styles.opacity,
                transform: `translateX(${styles.offset}%)`,
            })} >
              <Route path="/stats" component={Stats} />
              <Route component={Home} />
          </AnimatedSwitch>
          <AnimatedRoute path="/settings" component={ConnectedSettings}
                         atEnter={{ offset: 100, opacity: 0 }}
                         atLeave={{ offset: 100, opacity: 0 }}
                         atActive={{ offset: 0, opacity: 1 }}
                         mapStyles={(styles) => ({
                             opacity: styles.opacity,
                             transform: `translateX(${styles.offset}%)`,
                         })}/>
      </div>
  </div>
)

let state
let TwitterClient

const handleChange = () => {
  let updated = false
  let previous = cloneDeep(state) || {}
  state = store.getState()

  if (! deepEqual(previous.settings, state.settings)) {
    TwitterClient = new Twitter({
      ...state.settings,
      request_options: {
        'no-cors': true
      }
    })
    TwitterClient.get('application/rate_limit_status', {})
                 .then(status => store.dispatch(actionCreators.twitter.connected(true)))
                 .catch(status => store.dispatch(actionCreators.twitter.error(true)))
  }

  if (! deepEqual(previous.hashtags, state.hashtags)) {
    updated = true
  }

  if (! deepEqual(previous.users, state.users)) {
    updated = true
  }

  if (state.twitter.connected) {
    const users = Object.keys(state.users).filter(u => state.users[u])

    const getUsers = () => {
      if (! users.length) {
        return Promise.resolve([])
      }

      return Twitter.get('users/lookup', {users: users.join(',')})
    }

    getUsers.then(userIds => console.error(userIds))
    /*
    Twitter.stream('statuses/filter', {
      track: Object.keys(state.hashtags).filter(h => state.hashtags[h]),
      follow: 
    })
    */
  }

}

const unsubscribe = store.subscribe(handleChange)

const App = () => (
  <Provider store={store}>
      <Router>
          <Layout/>
      </Router>
  </Provider>
)

export default App;
