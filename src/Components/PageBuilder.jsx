import React, { useState, useEffect } from 'react';
import DraggableList from './DraggableList';
import Sidebar from './Sidebar';
import Page from './Page';

const PageBuilder = () => {
  const [elements, setElements] = useState(
    JSON.parse(localStorage.getItem('elements')) || []
  );
  const [modalCoordinates, setModalCoordinates] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState();
  const [fontWeight, setFontWeight] = useState('normal');
  const [initialDrop, setInitialDrop] = useState(false); 

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement]);

  useEffect(() => {
    localStorage.setItem('elements', JSON.stringify(elements));
  }, [elements]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && selectedElement) {
      setModalCoordinates(selectedElement.position);
      setShowModal(true);
    } else if (event.key === 'Delete' && selectedElement) {
      setElements(prevElements => prevElements.filter(element => element !== selectedElement));
      setSelectedElement(null);
    }
  };
  
  

  const handleDrop = (event) => {
    event.preventDefault();
    const elementType = event.dataTransfer.getData('elementType');
    const newPosition = { x: event.clientX, y: event.clientY };
  
    if (!initialDrop) {
      setInitialDrop(true);
      const newElement = {
        id: elements.length + 1,
        type: elementType,
        text,
        position: newPosition,
        style: {
          fontSize: `${fontSize}px`,
          fontWeight
        }
      };
      setElements([newElement]); // Replace existing elements with the new one
      setSelectedElement(newElement);
      setModalCoordinates(newPosition);
      setShowModal(true);
    } else {
      const updatedElements = elements.map((element) =>
        element === selectedElement ? { ...element, position: newPosition } : element
      );
      setElements(updatedElements);
      setSelectedElement({ ...selectedElement, position: newPosition });
      setModalCoordinates(newPosition);
      setInitialDrop(false); // Reset initialDrop to allow moving other elements
    }
  };
  
  
  
  
  
  

  const handleModalSave = () => {
    const updatedElements = elements.map(element => {
      if (element === selectedElement) {
        return {
          ...element,
          position: modalCoordinates,
          text,
          style: {
            fontSize: `${fontSize}px`,
            fontWeight
          }
        };
      }
      return element;
    });
    setElements(updatedElements);
    setShowModal(false);
  };

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleDragStart = (event, elementType) => {
    event.dataTransfer.setData('elementType', elementType);
  };

  const handleDragEnd = () => {
    setSelectedElement(null);
  };

  const handleInputChange = (event, axis) => {
    const { value } = event.target;
    if (axis === 'x' || axis === 'y') {
      const intValue = parseInt(value);
      if (!isNaN(intValue)) {
        setModalCoordinates(prevCoordinates => ({
          ...prevCoordinates,
          [axis]: intValue
        }));
      } else {
        setModalCoordinates(prevCoordinates => ({
          ...prevCoordinates,
          [axis]: ''
        }));
      }
    }
  };
  
  
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    const value = parseInt(event.target.value);
    setFontSize(isNaN(value) ? '' : value); // If the value is not a number, set it to an empty string
  };
  
  const handleFontWeightChange = (event) => {
    setFontWeight(event.target.value);
  };
  

  return (
    <React.Fragment>
      <Sidebar>
        <DraggableList onDragStart={handleDragStart} />
      </Sidebar>
      <Page
        elements={elements}
        selectedElement={selectedElement}
        onDrop={handleDrop}
        onElementClick={handleElementClick}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart} 
        fontSize={handleFontSizeChange}
      />

      {showModal && (
        <div className="modal" style={{ fontFamily: 'Poppins' }}>
          <h2 >Edit {selectedElement && selectedElement.type} <hr /></h2>
          <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
          <div className='modal-content'>
            <div>Text</div>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
            />
            <div>X</div>
            <input
              type="text"
              value={modalCoordinates.x}
              onChange={(event) => handleInputChange(event, 'x')}
            />
            <div>Y</div>
            <input
              type="text"
              value={modalCoordinates.y}
              onChange={(event) => handleInputChange(event, 'y')}
            />
            <div>Font Size</div>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
            />
            <div>Font Weight</div>
            <input
              type="text"
              value={fontWeight}
              onChange={handleFontWeightChange}
            />
            <button onClick={handleModalSave}>Save Changes</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default PageBuilder;

