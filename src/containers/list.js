'use strict;'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import identities from '../reducers/identities'
import List from '../components/list';

const ConnectedList = connect(
    ({ids}) => {
        const {items, ...state} = ids
        return {items, state}
    }, 
    (dispatch) => ({actions: bindActionCreators(identities.actions, dispatch)}))(List)

export { ConnectedList as default }
