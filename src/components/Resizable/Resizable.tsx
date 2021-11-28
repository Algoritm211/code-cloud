import React, {useEffect, useState} from 'react';
import {ResizableBox, ResizableBoxProps} from 'react-resizable'
import './resizable.css'

interface ResizableProps {
  direction: 'vertical' | 'horizontal',

}

/**
 * Component for resizing text editor
 *
 * @param direction
 * @param children
 */
const Resizable: React.FC<ResizableProps> = ({direction, children}) => {

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [horizontalElemWidth, setHorizontalElemWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const resizeListener = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        if (window.innerWidth * 0.75 < horizontalElemWidth) {
          setHorizontalElemWidth(window.innerWidth * 0.75)
        }
      }, 150)
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [horizontalElemWidth]);

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
      width: horizontalElemWidth,
      height: Infinity,
      resizeHandles: ['e'],
      onResizeStop: (_, data) => {
        setHorizontalElemWidth(data.size.width)
      }
    }
  }

  return (
    <ResizableBox {...resizableBoxProps}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
