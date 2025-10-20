import UseWindowDimensions from "../hooks/get-window-dimensions"
import React from "react"

export default function TextBreakWithBreakpoint({maxSize}) {
    const {height, width} = UseWindowDimensions();
  
    return(
        <br hidden={width < maxSize} />
    );
}