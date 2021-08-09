import React from 'react'
import classNames from 'classnames'

import './Badge.scss'

function Badge({ color, className }) {
    return (
        <i className={classNames('badge', className, { [`badge--${color}`]: color })}></i>
    )
}

export default Badge
