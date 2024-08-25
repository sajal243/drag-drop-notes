import { useState } from 'react';
import './App.css';
import { notesData } from './constants/notes';
import { Notes } from './components/Notes';

function App() {
  const [notes, setNotes] = useState(notesData);
  return (
    <div className="App">
      <h1>Drag and Drop Notes</h1>
      <Notes notes={notes} setNotes={setNotes} />
    </div>
  );
}

export default App;
