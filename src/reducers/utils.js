import {createAsyncAction, createReducer} from 'redux-action-tools'

export const makeHandlers = (actionTypes, creators) => {
    const actionKeys = Object.keys(creators)

    return actionKeys.reduce((handlers, cur) => {
        const actionType = actionTypes[cur]
        const {handler} = creators[cur]

        const reducer = createReducer()
            .when(actionType, (state, {type}) => ({
                ...state,
                isFetching: true}))
            .done((state, action) => ({
                ...handler(state, action),
                isFetching: false
            }))
            .failed((state, action) => ({
                ...state,
                failed: action,
                isFetching: false
            }))
            .build()

        return Object.assign(handlers, {
            [actionType]: reducer,
            [`${actionType}_COMPLETED`]: reducer,
            [`${actionType}_FAILED`]: reducer
        })
    }, {})
}

export const makeReducer = (actionsTypes, creators, defaultState = {}) => {
    const handlers = makeHandlers(actionsTypes, creators)

    return (state, action) => {
        const handler = handlers[action.type]

        if (handler) {
            return handler(state, action)
        }

        return Object.assign({isFetching: false, fetched: false}, defaultState)
    }
}

export const makeActions = (actionTypes, creators) => {
    return Object.keys(actionTypes).reduce((actions, type) => {
        const creator = creators[type]

        return Object.assign(actions, {
            [type]: createAsyncAction(
                actionTypes[type],
                creator.promiseCreator
            )
        })
    }, {})
}

