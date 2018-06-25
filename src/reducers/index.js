import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import ids from './identities'

const appReducer = handleActions(    {
    SETTINGS: (state, {payload}) => ({...state, settings: payload}),
}, {settings: {}})

const rootReducer = combineReducers({
    app: appReducer,
    ids: ids.reducer
})

export { rootReducer as default }
