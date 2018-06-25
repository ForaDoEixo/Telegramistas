import React from 'react';

const Create = ({actions}) => {
    let inputHash = {}
    const onSubmit = (e) =>{
        e.preventDefault()
        const inputs = Object.values(inputHash)

        if (inputs.map(i => i.value.trim()).indexOf('') > -1) {
            return
        }

        const identity = inputs.reduce((acc, cur) => {
            const name = cur.getAttribute('name')
            const ret = Object.assign({}, acc, {
                [name]: cur.value
            })
            cur.value = ''
            return ret
        }, {})

        actions.create(identity)
    }

    return (<form onSubmit={onSubmit}>
        <label htmlFor="name">Nombre</label>
        <input name="name" ref={node => inputHash.name = node}/>
        <label htmlFor="phone">Telefono</label>
        <input name="phone" ref={node => inputHash.phone = node}/>
        <button type='submit'>Crear Identidad</button>
    </form>)
}

export { Create as default }
