import UseWindowDimensions from "./get-window-dimensions"

export default function ResponsiveGridColumns(maxCols, breakpoints) {
    const {height, width} = UseWindowDimensions();

    if(breakpoints.length === (maxCols - 1)) {
      breakpoints.sort(function(a, b){return b-a});
      var decrement = 0;
      var i = 0;
      while(i < breakpoints.length && width <= breakpoints[i]) {
        decrement++;
        i++;
      }
      
      return maxCols - decrement;
    }
    else {
      return maxCols;
    }
}