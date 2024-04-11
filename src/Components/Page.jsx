import React from 'react';

const Page = ({ elements, selectedElement, onDrop, onElementClick, onDragEnd, onDragStart }) => {
  const handleElementClick = (event, element) => {
    event.stopPropagation();
    onElementClick(element);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const handleDragStart = (event, element) => {
    event.dataTransfer.setData('elementId', element.id);
    onDragStart(event, element);
  };

  const getElementStyle = (element) => {
    return {
      position: 'absolute',
      padding: '10px',
      top: element.position.y,
      left: element.position.x,
      cursor: 'pointer',
      border: element === selectedElement ? '4px solid red' : '2px solid black',
      fontSize: element.style.fontSize, 
    fontWeight: element.style.fontWeight,
    };
  };

  return (
    <div
      className="page"
      style={{ width: '80%', height: '100vh', overflow: 'auto', position: 'relative' }}
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      {elements.map((element, index) => (
        <div
          key={index}
          className="element"
          style={getElementStyle(element)}
          onClick={(event) => handleElementClick(event, element)}
          draggable={true}
          onDragStart={(event) => handleDragStart(event, element)}
          onDragEnd={handleDragEnd}
        >
          {element.text}
        </div>
      ))}
    </div>
  );
};

export default Page;
