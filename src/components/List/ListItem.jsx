import React from 'react'
import classNames from 'classnames'

import Badge from '../Badge'
import './List.scss'
import deleteSvg from '../../assets/img/delete.svg'

function ListItem({ item, onClickItem, activeItem, isRemovable, onDelete }) {
    const onSelectItem = () => {
        onClickItem(item)
    }

    const onDeleteItem = () => {
        onDelete(item)
    }

    return (
        <li onClick={onSelectItem} className={classNames(item.className, "list__item", { active: item.active ? item.active : activeItem && activeItem.id === item.id })}>
            <i>{item.icon ? item.icon : <Badge color={item.color.name}></Badge>}</i>
            <span>{item.name}</span>
            {isRemovable && <img onClick={onDeleteItem} src={deleteSvg} alt="delete list" />}
        </li>
    )
}

export default ListItem
