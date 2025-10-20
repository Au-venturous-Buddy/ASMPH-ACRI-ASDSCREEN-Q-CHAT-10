import React from "react"
import { FaWindowClose } from "react-icons/fa";
import {Button} from "react-bootstrap";
import ResponsiveSize from "../hooks/responsive-size";

export default function CloseButton({handleClose}) {
    return(
        <Button style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} aria-label="Close" onClick={handleClose}>
            <span aria-hidden={true}><FaWindowClose aria-hidden={true} /> <b>Close</b></span>
        </Button>
    )
}