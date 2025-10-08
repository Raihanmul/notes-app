import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState(""); // 1. Add search state

  const baseUrl = "https://notes-app-eta-steel.vercel.app";

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${baseUrl}/notes`);

      const result = await res.json();

      setNotes(result.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      const result = await res.json();
      if (res.ok) {
        setNotes([...notes, result.data]);
      }

      console.log(result.data);
    } catch (error) {
      console.error("Error");
    }
  };

  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });

      const result = await res.json();

      setNotes((prevNotes) => {
        return prevNotes.map((note) => (note.id === id ? result.data : note));
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((notes) => notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNoteById = (id) => {
    console.log(id);
  };

  return (
    <>
      <Navbar search={search} setSearch={setSearch} /> {/* 2. Pass props */}
      <main className="min-h-screen flex flex-col mt-20 items-center bg-gray-100">
        <NoteForm onAddNote={addNote} />
        <NoteList
          notes={notes}
          search={search} // 3. Pass search to NoteList
          onDelete={handleDelete}
          onUpdate={handleUpdateNote}
          onGetById={getNoteById}
        />
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = ({ search, setSearch }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="w-full fixed top-0 flex justify-center bg-white shadow-lg">
      <div className="flex justify-between px-5 py-5 container">
        <img src="/logo.svg" alt="Logo" />
        <div className="relative flex items-center">
          <button
            className="p-2 bg-gray-200 rounded-xl hover:shadow-inner hover:bg-gray-100 transition-all"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label="Show search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#434343"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
          {showSearch && (
            <input
              type="text"
              className="outline-none ml-3 p-2 px-4 rounded-xl bg-gray-200 transition-all"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{ width: 180 }}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section className="container max-w-xl px-5 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
        <input
          type="text"
          placeholder="Title"
          className="rounded-sm outline outline-gray-400 p-3 focus:outline-blue-500 transition-all"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="resize-y min-h-14 rounded-sm outline outline-gray-400 p-3 focus:outline-blue-500 transition-all"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold rounded-lg py-3 cursor-pointer hover:bg-blue-700 focus:bg-black transition-all"
        >
          Add note
        </button>
      </form>
    </section>
  );
};

const NoteItem = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdit, setTitleEdit] = useState(note.title);
  const [contentEdit, setContentEdit] = useState(note.content);

  const handleCancel = () => {
    setTitleEdit(note.title);
    setContentEdit(note.content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md hover:shadow-lg transition-all bg-white w-[300px] p-5">
      {isEditing ? (
        <>
          <input
            value={titleEdit}
            type="text"
            className="w-full rounded-sm outline outline-gray-400 p-3"
            onChange={(e) => setTitleEdit(e.target.value)}
          />

          <textarea
            value={contentEdit}
            type="text"
            className="w-full rounded-sm outline outline-gray-400 p-3 mt-2"
            onChange={(e) => setContentEdit(e.target.value)}
          />

          <div className="mt-4 flex gap-2">
            <a onClick={handleCancel} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#434343"
              >
                <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </a>
            <a
              onClick={() => {
                onUpdate(note.id, titleEdit, contentEdit);
                setIsEditing(false);
              }}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#434343"
              >
                <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
              </svg>
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="font-medium text-xl">{note.title}</p>
            <div className="flex gap-2">
              <a onClick={() => setIsEditing(true)} className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#434343"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </a>
              <a onClick={() => onDelete(note.id)} className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#434343"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="mt-2 w-full">{note.content}</p>
          <p className="text-sm items-end text-gray-500 flex justify-end">
            {showFormattedDate(note.created_at)}
          </p>
        </>
      )}
    </div>
  );
};

const NoteList = ({ notes, search, onUpdate, onDelete }) => {
  // 5. Filter notes based on search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="container py-8 border-b">
      <h2 className="inline-flex items-center gap-2 text-2xl pb-2 font-medium mb-6 border-b w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M280-160v-441q0-33 24-56t57-23h439q33 0 56.5 23.5T880-600v320L680-80H360q-33 0-56.5-23.5T280-160ZM81-710q-6-33 13-59.5t52-32.5l434-77q33-6 59.5 13t32.5 52l10 54h-82l-7-40-433 77 40 226v279q-16-9-27.5-24T158-276L81-710Zm279 110v440h280v-160h160v-280H360Zm220 220Z" />
        </svg>
        Notes
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <h1>No notes found</h1>
        )}
      </div>
    </section>
  );
};

// helper
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
