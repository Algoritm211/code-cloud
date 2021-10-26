import React, {useEffect, useState} from 'react';
import {ResizableBox, ResizableBoxProps} from 'react-resizable'
import './resizable.css'

interface ResizableProps {
  direction: 'vertical' | 'horizontal',

}

const Resizable: React.FC<ResizableProps> = ({direction, children}) => {

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, []);

  let resizableBoxProps: ResizableBoxProps;
  if (direction === 'vertical') {
    resizableBoxProps = {
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, innerHeight * 0.9],
      width: Infinity,
      height: 300,
      resizeHandles: ['s'],
    }
  } else {
    resizableBoxProps = {
      className: 'resize-horizontal',
      minConstraints: [innerWidth * 0.3, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      width: innerWidth * 0.75,
      height: Infinity,
      resizeHandles: ['e'],
    }
  }

  return (
    <ResizableBox {...resizableBoxProps}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
