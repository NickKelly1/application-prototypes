import React from 'react';

function NoteEditor({ note, onChangeNote, onCloseNote }) {
  return (
    <div>
      <div>
        <textarea
          className="editor-content"
          autoFocus
          value={note.content}
          onChange={event => onChangeNote(note.id, event.target.value)}
          rows={10}
          cols={80}
        />
      </div>
      <button className="editor-button" onClick={onCloseNote}>Close</button>
    </div>
  );
};

function NoteTitle({ note }) {
  // ^ for beginning of string
  // \s for any whitespace (space, tab, line break)
  //  + for 1 or more of preceding token
  // | for boolean OR
  // $ for end of string
  const title = note.content.split('\n')[0].replace(/^\s+|\s+$/g, '');
  if (title === '') return <i>Untitled</i>;
  return <span>{ title }</span>
};

function NoteLink({ note, onOpenNote }) {
  return (
    <li className="note-list-item">
      <a href="#" onClick={() => onOpenNote(note.id)}>
        <NoteTitle note={note} />
      </a>
    </li>
  );
};

function NoteList({notes, onOpenNote }) {
  return (
    <ul className="note-list">
      {
        Object.entries(notes).map(([id, note]) => (
          <NoteLink
            note={note}
            key={id}
            onOpenNote={onOpenNote}
          />
        ))
      }
    </ul>
  );
};


function NoteApp({
  notes, openNoteId, onAddNote, onChangeNote,
  onOpenNote, onCloseNote
}) {
  return (
    <div>
      {
        openNoteId
          ?
            <NoteEditor note={notes[openNoteId]}
              onChangeNote={onChangeNote}
              onCloseNote={onCloseNote} />
          :
            <div>
              <NoteList notes={notes}
                onOpenNote={onOpenNote} />
              <button className="editor button" onClick={() => onAddNote('NEW NOTE!!')}>New Note</button>
            </div>
      }
    </div>
  );
}

export default NoteApp;
