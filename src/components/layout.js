import React from 'react';
import { AnimatedRoute, AnimatedSwitch } from 'react-router-transition';
import { Route } from 'react-router-dom';

import { HashTagsSelector, UsersSelector } from '../containers/tags'
import ConnectedSettings from '../containers/settings'
import ConnectedInfo from '../containers/info'

import NavBar from './navbar'

const Stats = () => (
    <div>
        Here go pretty graphs
    </div>
)

const Home = () => (
    <div className="App">
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
        <ConnectedInfo/>
    </div>
)

export { Layout as default }
