import UseWindowDimensions from "./get-window-dimensions"

export default function ResponsiveSize(maxSize, unit, scale, minScreenSize) {
    const {height, width} = UseWindowDimensions();
  
    var refDim = width;
    if(height < width) {
      refDim = height;
    }
  
    var decrement = 0;
    if(refDim < minScreenSize) {
      decrement = (minScreenSize * scale) - (refDim * scale);
    }
  
    return (maxSize - decrement).toString() + unit;
}