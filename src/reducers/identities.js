import * as utils from './utils'
import {remote} from 'electron'

const puppet = remote.require('./src/puppet/index.js')

const openTelegram = {
    promiseCreator: (config, dispatch, getState) =>  puppet(config),
    handler: ({identities, ...state}, {payload}) => ({
        ...state,
        identities: [...identities, {...payload, id: identities.length}]
    })
}

const extract = (array, pos) => {
    console.error(array, pos)
    return [...array.slice(0, pos ? pos - 1 : 0), ...array.slice(pos + 1)]
}

const find = (array, id) =>
    array.reduce((acc, cur, idx) => (cur.id === id ? idx : acc), -1)

const creators = {
    create: openTelegram,
    read: openTelegram,
    update: openTelegram,
    delete: {
        promiseCreator: (arg, dispatch, getState) => {},
        handler: ({identities, ...state}, {payload}) => ({
            ...state,
            identities: extract(identities, find(identities, payload))
        })
    }
}

const makeActionTypes = (creators) => {
    const actionKeys = Object.keys(creators)

    return actionKeys.reduce((actionTypes, type) => (
        Object.assign(actionTypes, {
            [type]: `TG/CHROME/${type}`
        })
    ), {})
}
const actionTypes = makeActionTypes(creators)

export default {
    actions: utils.makeActions(actionTypes, creators),
    reducer: utils.makeReducer(actionTypes, creators, {
        items: [
            { id: 0, phone: "+54 911 1234 5678", name: "Mercedes Sosa"},
            { id: 1, phone: "+54 911 8765 4321", name: "Carlos Gardel"},
            { id: 2, phone: "+55 11 8765 4321", name: "Caetano Veloso"},
        ]})
}
