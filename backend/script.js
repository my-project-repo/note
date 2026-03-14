const addBtn = document.querySelector("#add");
const noteDiv = document.querySelector("#note-div");
const backBtn = document.querySelector("#back");
const note = document.getElementById("note");
const parent = document.querySelector("#stack");

let child;
let time;
let para = "";
let currentId = null;

function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function createNoteElement(id, text) {
  const child = document.createElement("div");
  child.className = "child text-bg bg-box p-4 rounded-2xl";
  child.dataset.id = id;

  const p = document.createElement("p");
  p.className = "line-clamp-5";
  p.textContent = text;

  child.appendChild(p);
  parent.appendChild(child);
}

function loadNotes() {
  const notes = getNotes();
  notes.forEach(n => createNoteElement(n.id, n.text));
}

parent.addEventListener("click", (e) => {
  child = e.target.closest(".child");

  if (child) {
    currentId = Number(child.dataset.id);

    noteDiv.style.display = "initial";
    addBtn.style.display = "none";

    note.textContent = child.textContent;
    para = child.textContent;
  }
});

addBtn.addEventListener("click", () => {
  note.textContent = "";
  para = "";
  currentId = null;

  noteDiv.style.display = "initial";
  note.focus();
  addBtn.style.display = "none";
});

note.addEventListener("input", () => {
  clearTimeout(time);

  time = setTimeout(() => {
    para = note.textContent;
  }, 500);
});

backBtn.addEventListener("click", () => {
    let notes = getNotes();
  const text = para.trim();

  // EDITING EXISTING NOTE
  if (currentId !== null) {

    if (text === "") {
      // remove note
      notes = notes.filter(n => n.id !== currentId);
      child.remove();
    } else {
      // update note
      notes = notes.map(n =>
        n.id === currentId ? { ...n, text } : n
      );

      child.querySelector("p").textContent = text;
    }

  } 
  
  // CREATING NEW NOTE
  else {
    if (text === "") {
      // do nothing if empty
      noteDiv.style.display = "none";
      addBtn.style.display = "initial";
      return;
    }

    const id = Date.now();

    notes.push({ id, text });

    createNoteElement(id, text);
  }

  saveNotes(notes);

  noteDiv.style.display = "none";
  addBtn.style.display = "initial";
});

loadNotes();