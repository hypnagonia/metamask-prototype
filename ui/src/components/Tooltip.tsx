import React, { useState } from 'react'


export const Tooltip = (props: any) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="tooltip-container"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}>
            {props.children}
            {showTooltip &&
                <div className="tooltip">{props.text}</div>
            }
        </div>
    )
}
