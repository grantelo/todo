import React from 'react'

import ListItem from './ListItem'
import './List.scss'


function List({ items, onClickItem, isRemovable, onDeleteList, activeItem }) {
    return (
        <ul className="list">
            {items && items.map((item) => (
                <ListItem key={!item?.icon && item.id} item={item} onClickItem={onClickItem} activeItem={activeItem} isRemovable={isRemovable} onDelete={onDeleteList} />
            ))}
        </ul>
    )
}

export default List
