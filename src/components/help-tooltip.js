import React from "react"
import { Tooltip } from "react-bootstrap";

export default function HelpTooltip(message, props) {
    return(
        <Tooltip {...props}>
            {message}
        </Tooltip>
    )
}