"use client";
import Spline from '@splinetool/react-spline';
import "../extra.css"

export default function Three() {
  return (  
    <div className='w-full h-full flex items-start justify-start relative ppoo '>
      <Spline 
        scene="https://prod.spline.design/XX4qUg6LjYpZr2mV/scene.splinecode"
      />
    </div>
  );
}