
/**
 * [
 *    {
 *      id: <int>
 *      title: <string>
 *      author <string>
 *      year: <number>
 *      isComplete: <boolean>
 *    }
 * ]
 */
const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOKSHELF_APP (M. Eric Chaniago)';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeTodo(todoObject) {
  const { id, title, author, year, isComplete } = todoObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;
  textTitle.setAttribute('data-testid', 'bookItemTitle');

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;
  textAuthor.setAttribute('data-testid', 'bookItemAuthor');

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = year;
  textTimestamp.setAttribute('data-testid', 'bookItemYear');

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.setAttribute('data-testid', 'bookItem');
  container.setAttribute('data-bookid', `todo-${id}`);
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  const trashButton = document.createElement('button');
  trashButton.classList.add('trash-button');
  trashButton.setAttribute('data-testid', 'bookItemDeleteButton');
  trashButton.addEventListener('click', function () {
    removeTaskFromCompleted(id);
  });

  if (isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.setAttribute('data-testid', 'bookItemUndoButton');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addTodo() {
  console.log(todos);
  const textTodo = document.getElementById('bookFormTitle').value;
  const year = Number(document.getElementById('bookFormYear').value); // Konversi ke number
  const author = document.getElementById('bookFormAuthor').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, author, year, isComplete);
  todos.push(todoObject);

  console.log('Tipe data year:', typeof year); // Melihat tipe data year di konsol
  console.log('Nilai year:', year);
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}


function addTaskToCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isComplete = true;
  console.log(`Todo ID: ${todoId}, isComplete changed to: ${todoTarget.isComplete}`);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  console.log(`Todo ID: ${todos[todoTarget].id}, isComplete: ${todos[todoTarget].isComplete} is removed from list`);
  todos.splice(todoTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId /* HTMLELement */) {

  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isComplete = false;
  console.log(`Todo ID: ${todoId}, isComplete changed to: ${todoTarget.isComplete}`);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm /* HTMLFormElement */ = document.getElementById('bookForm');

  const searchBookForm = document.getElementById("searchBook");
  searchBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();

    submitForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

  // clearing list item
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isComplete) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
})

// JavaScript for Modal
const modal = document.getElementById("modal");
const showModalButton = document.getElementById("show-modal");
const closeModalButton = document.getElementById("close-modal");

// Show the modal
showModalButton.addEventListener("click", () => {
  modal.classList.add("active");
});

// Close the modal
closeModalButton.addEventListener("click", () => {
  modal.classList.remove("active");
});

// Close the modal when clicking outside the content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});

function searchBook() {
    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();

    const searchResults = todos.filter((todo) => 
        typeof todo.title === 'string' && todo.title.toLowerCase().includes(searchTitle)
    );

    clearBookshelves();

    for (const result of searchResults) {
        if (result.isComplete) {
            addToCompleteBookshelf(result);
        } else {
            addToIncompleteBookshelf(result);
        }
    }
}


function clearBookshelves() {
    const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

    while (uncompletedTODOList.firstChild) {
        uncompletedTODOList.removeChild(uncompletedTODOList.firstChild);
    }

    while (listCompleted.firstChild) {
        listCompleted.removeChild(listCompleted.firstChild);
    }
  }

function addToIncompleteBookshelf(todoObject) {
    const uncompletedTODOList = document.getElementById('todos');
    const todoElement = makeTodo(todoObject);
    uncompletedTODOList.append(todoElement);
}

function addToCompleteBookshelf(todoObject) {
    const listCompleted = document.getElementById('completed-todos');
    const todoElement = makeTodo(todoObject);
    listCompleted.append(todoElement);
}

