'use strict;'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import identities from '../reducers/identities'
import Create from '../components/create';

const ConnectedCreate = connect(
    undefined,
    (dispatch) => ({actions: bindActionCreators(identities.actions, dispatch)})
)(Create)

export { ConnectedCreate as default }
