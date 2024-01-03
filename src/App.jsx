import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Newnotes from './components/Newnotes'
import './App.css'

function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelectGroup = (group) => {
    // Handle the selected group in the parent component
    setSelectedGroup(group);
  };
  return (
    <>
      <div className='Main-area'>
        <Newnotes onSelectGroup={handleSelectGroup} />
      </div>
     
    </>
  )
}

export default App
