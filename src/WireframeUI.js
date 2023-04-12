import React, { useState } from 'react';
import './WireframeUI.css';

const WireframeUI = () => {
  const [tiles, setTiles] = useState([{ type: 'story', title: '', text: '' }]);

  const handleChangeTile = (type, index, newType) => {
    if (newType === type) {
      return;
    }
  
    const newTile = newType === 'decision'
      ? { type: newType, title: '', text: '', decision: { text: '', health: 0, wealth: 0, happiness: 0, newBranch: false } }
      : { type: newType, title: '', text: '' };
  
    if (type === 'end') {
      setTiles([...tiles.slice(0, index + 1), newTile]);
    } else {
      const newTiles = [...tiles.slice(0, index), newTile, ...tiles.slice(index + 1)];
      setTiles(newTiles);
    }
  };

  const handleAddTile = (type, index) => {
    const newTile = type === 'decision' 
      ? { type, title: '', text: '', decision: { text: '', health: 0, wealth: 0, happiness: 0, newBranch: false } } 
      : { type, title: '', text: '' };
    if (type === 'end') {
      setTiles([...tiles.slice(0, index + 1), newTile]);
    } else {
      const newTiles = [...tiles.slice(0, index + 1), newTile, ...tiles.slice(index + 1)];
      setTiles(newTiles);
    }
  };

  const handleDeleteTile = (index) => {
    const newTiles = [...tiles];
    newTiles.splice(index, 1);
    setTiles(newTiles);
  };


    function handleTypeChange(type, index, event) {
      const newType = event.target.value;
      handleChangeTile(type, index, newType);
    };


  const handleTileTitleChange = (index, event) => {
    const updatedTile = { ...tiles[index], title: event.target.value };
    const updatedTiles = [...tiles.slice(0, index), updatedTile, ...tiles.slice(index + 1)];
    setTiles(updatedTiles);
  };

  const handleTileTextChange = (index, event) => {
    const updatedTile = { ...tiles[index], text: event.target.value };
    const updatedTiles = [...tiles.slice(0, index), updatedTile, ...tiles.slice(index + 1)];
    setTiles(updatedTiles);
  };

  const handleDecisionTextChange = (index, event) => {
    const updatedDecision = { ...tiles[index].decision, text: event.target.value };
    const updatedTile = { ...tiles[index], decision: updatedDecision };
    const updatedTiles = [...tiles.slice(0, index), updatedTile, ...tiles.slice(index + 1)];
    setTiles(updatedTiles);
  };

  const handleDecisionButtonClick = (index, key, value) => {
    const updatedDecision = { ...tiles[index].decision, [key]: value };
    const updatedTile = { ...tiles[index], decision: updatedDecision };
    const updatedTiles = [...tiles.slice(0, index), updatedTile, ...tiles.slice(index + 1)];
    setTiles(updatedTiles);
  };

  const handleDownloadClick = () => {
    const content = tiles
      .map((tile) => {
        if (tile.type === 'decision') {
          return `${tile.type}:${tile.title}:${tile.text}:${tile.decision.text || ''}:${tile.decision.health || ''}:${tile.decision.wealth || ''}:${tile.decision.happiness || ''}:${tile.decision.newBranch || false}`;
        } else {
          return `${tile.type}:${tile.title}:${tile.text}`;
        }
      })
      .join('\n');
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'story.twee';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="container">
      <h1 className="title">Fast Forward Wireframe</h1>
      <div className="tile-container">
        {tiles.map((tile, index) => {
          const nextTileIndex = index + 1;
          return (
            <div key={index} className={`tile tile-${tile.type}`}>
              <input
                type="text"
                placeholder="Enter title"
                value={tile.title}
                onChange={(event) => handleTileTitleChange(index, event)}
                />
                {tile.type === 'decision' && (
                  <>
                    <textarea
                      placeholder="Enter decision text"
                      value={tile.decision.text}
                      onChange={(event) => handleDecisionTextChange(index, event)}
                    />
                    <div className="decision-buttons">
                      <button onClick={() => handleDecisionButtonClick(index, 'health', (tile.decision.health || 0) + 1)}>
                        Health +1
                      </button>
                      <button onClick={() => handleDecisionButtonClick(index, 'health', (tile.decision.health || 0) - 1)}>
                        Health -1
                      </button>
                      <button onClick={() => handleDecisionButtonClick(index, 'wealth', (tile.decision.wealth || 0) + 1)}>
                        Wealth +1
                      </button>
                      <button onClick={() => handleDecisionButtonClick(index, 'wealth', (tile.decision.wealth || 0) - 1)}>
                        Wealth -1
                      </button>
                      <button
                        onClick={() => handleDecisionButtonClick(index, 'happiness', (tile.decision.happiness || 0) + 1)}
                      >
                        Happiness +1
                      </button>
                      <button
                        onClick={() => handleDecisionButtonClick(index, 'happiness', (tile.decision.happiness || 0) - 1)}
                      >
                        Happiness -1
                      </button>
                      <label>
                        <input
                          type="checkbox"
                          checked={tile.decision.newBranch || false}
                          onChange={() => handleDecisionButtonClick(index, 'newBranch', !tile.decision.newBranch)}
                        />
                        Create new branch
                      </label>
                    </div>
                  </>
                )}
                <button onClick={() => handleAddTile('story', index)}>Add tile</button>
                {tile.type !== 'decision' && (
                  <textarea
                    placeholder={`Enter ${tile.type} text`}
                    value={tile.text}
                    onChange={(event) => handleTileTextChange(index, event)}
                  />
                )}
                {tiles[nextTileIndex] && (
                  <div className="tile-connector">
                    <svg>
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#999" strokeWidth="2" />
                    </svg>
                  </div>
                )}
                {tile.type !== 'end' && (
                  <div className="add-tile">
                    <select onChange={(event) => handleTypeChange(tile.type, index, event)}>
                      <option value="story">Add Story Tile</option>
                      <option value="decision">Add Decision Tile</option>
                      <option value="end">Add End Tile</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={handleDownloadClick} className="download-btn">
          Download Twine File
        </button>
        <a href="https://twinery.org/" target="_blank" rel="noreferrer" className="twine-link">
          Download Twine
        </a>
      </div>
    );
  };
  
  export default WireframeUI;
  
