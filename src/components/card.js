import React from 'react';

const IdCard = ({id, phone, name, img, actions}) => (
    <div className="idCard">
        <div className="profilePic" style={{
            backgroundImage: `url({${img}})`
        }}></div>
        <div className="content">
            <h1>{phone}</h1>
            <h2>{name}</h2>
        </div>
        <button onClick={() => actions.delete(id)}>destruir</button>
    </div>
)

export { IdCard as default }
