import React from 'react';

function PlumbContainer({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export default PlumbContainer;
