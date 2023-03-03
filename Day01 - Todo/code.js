const formTextEl = document.querySelector('#new_todo_text');
const formBtnEl = document.querySelector('#new_todo_btn');

const listTodoEl = document.querySelector('#todo_list');
const listCompleteEl = document.querySelector('#complete_list');

const THE_KEY = 'hey hello';

let db = [];

function saveLocalStorage() {
  localStorage.setItem(THE_KEY, JSON.stringify(db));
}

function debugShowDb() {
  for (item of db) {
    console.log(item.id + ' - ' + item.content);
  }
}

function renderTodoItem(id, checked, content) {
  let externalDiv = document.createElement('div');
  let checkBtn = document.createElement('button');
  let deleteBtn = document.createElement('button');
  let paragraph = document.createElement('p');

  externalDiv.id = id;
  externalDiv.classList.add('item');

  checkBtn.classList.add('circle');

  deleteBtn.textContent = 'D';
  deleteBtn.onclick = (e) => { deleteTodo(id); };

  checkBtn.onclick = async () => {
    await deleteTodo(id);
    addTodo(content, !checked, id);
  };

  paragraph.textContent = content;

  externalDiv.appendChild(checkBtn);
  externalDiv.appendChild(paragraph);
  externalDiv.appendChild(deleteBtn);
  if (checked) {
    checkBtn.textContent = 'X';
    listCompleteEl.appendChild(externalDiv);
  } else {
    checkBtn.textContent = 'O';
    listTodoEl.appendChild(externalDiv);
  }
}

function addTodo(content, checked = false, id = undefined) {
  let maxId = Math.max(...db.map(i => i.id));
  if (maxId == -Infinity) maxId = 0;
  let newTodo = {
    id: id || maxId + 1,
    content: content,
    checked: checked,
  };
  db.push(newTodo);
  saveLocalStorage();
  renderTodoItem(newTodo.id, newTodo.checked, newTodo.content);
  debugShowDb();
}

async function deleteTodo(id) {
  let item = document.getElementById(id);
  item.classList.toggle('removing');
  db = db.filter(i => i.id != id);
  saveLocalStorage();
  setTimeout(() => {
    item.remove();
  }, 1000);
}

formBtnEl.onclick = () => {
  let content = formTextEl.value;
  formTextEl.value = '';
  addTodo(content);
};

// INITIAL RENDER:
if (localStorage.getItem(THE_KEY)) {
  db = JSON.parse(localStorage.getItem(THE_KEY));
  db.forEach(item => {
    renderTodoItem(item.id, item.checked, item.content);
  });
}
