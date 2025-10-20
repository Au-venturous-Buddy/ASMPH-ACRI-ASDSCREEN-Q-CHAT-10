import React from "react";
import ResponsiveSize from "../hooks/responsive-size";

export default function ResponsiveHeader(props) {
    if(props.level === 1) {
        return(
            <h1 style={{fontSize: ResponsiveSize(props.maxSize, "rem", 0.001, props.minScreenSize)}}>
                {props.children}
            </h1>
        )
    }
    else if(props.level === 2) {
        return(
            <h2 style={{fontSize: ResponsiveSize(props.maxSize, "rem", 0.001, props.minScreenSize)}}>
                {props.children}
            </h2>
        )
    }
    else if(props.level === 3) {
        return(
            <h3 style={{fontSize: ResponsiveSize(props.maxSize, "rem", 0.001, props.minScreenSize)}}>
                {props.children}
            </h3>
        )
    }
    else if(props.level === 4) {
        return(
            <h4 style={{fontSize: ResponsiveSize(props.maxSize, "rem", 0.001, props.minScreenSize)}}>
                {props.children}
            </h4>
        )
    }
    else if(props.level === 5) {
        return(
            <h5 style={{fontSize: ResponsiveSize(props.maxSize, "rem", 0.001, props.minScreenSize)}}>
                {props.children}
            </h5>
        )
    }
    else {
        return(
            <h6 style={{fontSize: ResponsiveSize(props.maxSize, "rem", 0.001, props.minScreenSize)}}>
                {props.children}
            </h6>
        )
    }
}