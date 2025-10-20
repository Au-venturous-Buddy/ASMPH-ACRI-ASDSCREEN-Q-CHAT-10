import UseWindowDimensions from "./get-window-dimensions"

export default function ResponsiveSizeMaxWidth(initSize, maxSize, minScreenSize) {
    const {height, width} = UseWindowDimensions();
  
    var refDim = width;
    var increment = 0;
    if(refDim < minScreenSize) {
      increment = minScreenSize - refDim;
    }
  
    var newWidth = initSize + increment
    if(newWidth > maxSize) {
      newWidth = maxSize
    }

    return (newWidth).toString() + "%";
}