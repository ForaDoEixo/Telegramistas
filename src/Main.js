import React from 'react'
import { withRouter } from 'react-router'
import { Switch, Route, Link } from 'react-router-dom'

import List from './containers/list';
import Create from './containers/create';

const Home = () => (
    <div>
        <Link to="/create">CREATE</Link>
        <List/>
    </div>
)

const RoutedHome = withRouter(Home)

const Main = () => (
    <div id="content">
        <header>
            <h1>TELEGRAMISTA<span>cree sus identidades</span></h1>
        </header>
        <Switch>
            <Route path="/create" component={Create}/>
            <Route component={Home}/>
        </Switch>
    </div>
)

export { Main as default }
