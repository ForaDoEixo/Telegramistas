'use strict;'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import random from 'random'

import identities from '../reducers/identities'
import Create from '../components/create';
import feministas from '../feministas.json'

const pickRandom = (array) => (
    array[random.int(0, array.length - 1)]
)

const makeName = () => (`${pickRandom(feministas.name)} ${pickRandom(feministas.surname)}`)

const ConnectedCreate = connect(
    () => ({name: makeName()}),
    (dispatch) => ({actions: bindActionCreators(identities.actions, dispatch)})
)(Create)

export { ConnectedCreate as default }
