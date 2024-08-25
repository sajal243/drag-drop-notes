import React, { createRef, useEffect, useRef } from 'react'
import Note from './Note'

export const Notes = ({notes=[], setNotes = () => {}}) => {

  const noteRefs = useRef([]);
  
  useEffect(() => {

    const savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];

    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((n) => n.id === note.id);
      if(savedNote){
        // return directly
        return {...note, position: savedNote.position};
      }
      else{
        const position = determineNewPosition();     // will give new x and y coordinates
        return {...note, position};
      }
    })

    setNotes(updatedNotes);
    localStorage.setItem("savedNotes", JSON.stringify(updatedNotes));
  }, [notes.length, notes, setNotes]);

  const determineNewPosition = () => {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;

    const newX = Math.floor(Math.random()*maxX);
    const newY = Math.floor(Math.random()*maxY);

    return {
      x: newX,
      y: newY
    }

  }

  const handleDragNote = (e, note) => {
    const {id} = note;
    console.log("drag note")
    const noteRef = noteRefs.current[id].current;
    const rect = noteRef.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const startPos = note.position;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      noteRef.style.left = `${newX}px`;
      noteRef.style.top = `${newY}px`;

    }

    const handleMouseUp = (e) => {
      
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp)

      const finalRect = noteRef.getBoundingClientRect();
      const newPosition = {x: finalRect.left, y: finalRect.top};

      console.log("newPos", newPosition)

      if(checkOverlap(id)){
        // overlap
        noteRef.style.left = `${startPos.x}px`;
        noteRef.style.top = `${startPos.y}px`;
      }
      else{
        updateNotePosition(id, newPosition);
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp)

  }

  const updateNotePosition = (id, newPosition) => {
    const updatedNotes = notes?.map((note) => note.id === id ? {...note, position: newPosition}: note);
    setNotes(updatedNotes);
    localStorage.setItem("savedNotes", JSON.stringify(updatedNotes));
  }

  const checkOverlap = (id) => {
    const currentNoteRef = noteRefs.current[id].current;
    const currentRect = currentNoteRef.getBoundingClientRect();

    return notes.some((note) => {
      if(note.id === id)  return false;

      const otherNoteRef = noteRefs.current[note.id].current;
      const otherRect = otherNoteRef.getBoundingClientRect();

      const overlap = !( currentRect.left > otherRect.left || currentRect.right < otherRect.left || currentRect.bottom < otherRect.top || currentRect.top > otherRect.bottom );

      return overlap;
    })

    

  }

  

  return (
    <div className='notes-list'>
        {notes?.map((note, i) => 
          <Note 
          ref= {noteRefs.current[note.id] ? noteRefs.current[note.id] : (noteRefs.current[note.id]= createRef())}
          key={note.id} 
          initPos = {note.position} content={note?.content} 
          onMouseDown = {(e) => handleDragNote(e, note)}
          /> 
        )}
    </div>
  )
}
