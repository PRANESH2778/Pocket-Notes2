import React from 'react'

const ColorItem= ({color,setColor}) => <div onClick={setColor} className='color-item' style={{'--bg-color':color}}></div>
export default ColorItem;