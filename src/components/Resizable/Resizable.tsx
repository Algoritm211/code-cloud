import React from 'react';
import {ResizableBox, ResizableBoxProps} from 'react-resizable'
import './resizable.css'

interface ResizableProps {
  direction: 'vertical' | 'horizontal',

}

const Resizable: React.FC<ResizableProps> = ({direction, children}) => {
  let resizableBoxProps: ResizableBoxProps;

  if (direction === 'vertical') {
    resizableBoxProps = {
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, window.innerHeight * 0.9],
      width: Infinity,
      height: 300,
      resizeHandles: ['s'],
    }
  } else {
    resizableBoxProps = {
      className: 'resize-horizontal',
      minConstraints: [window.innerWidth * 0.3, Infinity],
      maxConstraints: [window.innerWidth * 0.75, Infinity],
      width: window.innerWidth * 0.75,
      height: 300,
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
