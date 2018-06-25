import React from 'react';

import IdCard from './card';

const IdentitiesList = ({items= [], ...props}) => (
    <ul>
        {items.map(id => <li key={id.name}><IdCard {...id} {...props}/></li>)}
    </ul>
)

export { IdentitiesList as default }
