import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Popup from './Popup';
import image1 from './image1.png';
import arrow from './arrow.png';
import lock from './lock.png';
import ColorItem from './ColorItem';
import Addnotes from './Addnotes';
import './Newnotes.css';

const Newnotes = ({ onSelectGroup }) => {
  const [isOpen, setisOpen] = useState(false);
  const [text, setText] = useState('');
  const [groups, setGroups] = useState([]);
  const [groupname, setGroupname] = useState('');
  const [colorpick, setColorpick] = useState('');
  const colors = ['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'];
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isAddNotesAreaVisible, setIsAddNotesAreaVisible] = useState(true); 
  const [isNotesAreaVisible, setIsNotesAreaVisible] = useState(true);

  const Openpopup = () => {
    setisOpen(!isOpen);
  };

  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('NoteDetails') || '[]');
    setGroups(storedGroups);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
  
      setIsMobileView(isMobile);
  
      if (selectedGroupIndex !== null && isMobile) {
        setIsAddNotesAreaVisible(false);
        setIsNotesAreaVisible(true);
      } else {
        setIsAddNotesAreaVisible(true);
        setIsNotesAreaVisible(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedGroupIndex]);

  const setColor = (event) => {
    const currentColor = event.target.style.getPropertyValue('--bg-color');
    setColorpick(currentColor);
  };

  const creategroup = (event) => {
    const Notes = JSON.parse(localStorage.getItem('NoteDetails') || '[]');
    const NoteDet = {
      groupname: groupname,
      currentColor: colorpick,
    };
    Notes.push(NoteDet);
    localStorage.setItem('NoteDetails', JSON.stringify(Notes));
    setGroups(Notes);
  };

  const getGroupInitials = (groupName) => {
    const names = groupName.split(' ');
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join('').substring(0, 2);
  };

  const handleGroupClick = (index) => {
    if(isMobileView){
      setIsAddNotesAreaVisible(false);  
      setIsNotesAreaVisible(true);
      console.log(isAddNotesAreaVisible);
      console.log(isNotesAreaVisible);
    }
    const selectedGroup = groups[index];
    onSelectGroup(selectedGroup);
    setSelectedGroupIndex(index);
    const close = document.querySelector('.image');
    close.style.display = 'none';
  
  };

  const handleTextareaSave = () => {
    if (selectedGroupIndex !== null && text.trim() !== '') {
      const selectedGroup = groups[selectedGroupIndex];
      const updatedNotes = JSON.parse(localStorage.getItem(selectedGroup.groupname) || '[]');

      updatedNotes.push({ text, timestamp: new Date().toISOString() });

      localStorage.setItem(selectedGroup.groupname, JSON.stringify(updatedNotes));
      setText('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp));
  };

  return (
    <>
      <div className='Addnote-area' style={{ display: isAddNotesAreaVisible ? 'block' : 'none' }}>
        <h1>Pocket Notes</h1>
        <div className='add-group'>
          {groups.map((data, index) => (
            <div
              className={`New-group ${selectedGroupIndex === index ? 'selected' : ''}`}
              key={index}
              onClick={() => handleGroupClick(index)}
            >
              <div className='Group-color' style={{ backgroundColor: data.currentColor }}>
                <p>{getGroupInitials(data.groupname)}</p>
              </div>
              <p className='NewGroup-name'>{data.groupname}</p>
            </div>
          ))}
        </div>
        <button className='Addbutton' onClick={Openpopup}>
          +
        </button>
        {isOpen && (
          <Popup
            handleClose={() => {}}
            content={
              <div>
                <form className='Create-group'>
                  Create New group<br />
                  Group Name{' '}
                  <input
                    type='text'
                    className='Group-name'
                    placeholder='Enter group name'
                    onChange={(e) => setGroupname(e.target.value)}
                  />
                  <br />
                  <div className='color-content'>
                    <div className='color-groups'>
                      Choose Colour
                      <div className='color-list'>{colors.map((color, idx) => <ColorItem setColor={setColor} color={color} />)}</div>
                    </div>
                  </div>
                  <button className='create-btn' onClick={creategroup}>
                    Create
                  </button>
                </form>
              </div>
            }
          />
        )}
      </div>
      <div className='notes-area' style={{ display: isNotesAreaVisible ? 'block' : 'none' }}>
        <div className='image'>
          <img src={image1} height={'300px'} width={'500px'} alt='Pocket Notes' className='Image1' />
          <h1>Pocket Notes</h1>
          <p>
            Send and receive messages without keeping your phone online.<br /> Use Pocket Notes on up to 4 linked devices and 1
            mobile phone.
          </p>
          <div className='encrypt'>
            <img src={lock} height={'30px'} width={'30px'} />
            <p>end-to-end encryption</p>
          </div>
        </div>
        {selectedGroupIndex !== null && (
          <div className='display-area'>
            <div className='Selected-group'>
              <div className='Group-color' style={{ backgroundColor: groups[selectedGroupIndex]?.currentColor }}>
                <p>{getGroupInitials(groups[selectedGroupIndex]?.groupname)}</p>
              </div>
              <p className='Selected-groupname'>{groups[selectedGroupIndex]?.groupname}</p>
            </div>
            <div className='Notes-display'>
              <div className='Note-list'>
                {groups[selectedGroupIndex]?.groupname && (
                  JSON.parse(localStorage.getItem(groups[selectedGroupIndex].groupname) || '[]').map((note, index) => (
                    <div key={index} className='Note-item'>
                      <div className='Note-text'>{note.text}</div>
                      <div className='Note-metadata'>
                        <span className='Note-timestamp'>{formatTimestamp(note.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className='Notes-Input'>
              <textarea
                className='Text-area'
                placeholder='Enter your text here.........'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className='imageButton'>
                <img
                  src={arrow}
                  alt='Button Image'
                  onClick={handleTextareaSave}
                  disabled={!text.trim()}
                  style={{ filter: !text.trim() ? 'grayscale(100%)' : 'none' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Newnotes;
