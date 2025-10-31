// создание контейнера приложения с семантикой
const app = document.createElement('main');
app.id = 'app';
document.body.appendChild(app);

// заголовок
const header = document.createElement('h1');
header.textContent = 'ToDo App';
app.appendChild(header);

// форма для добавления задач
const form = document.createElement('form');

const input = document.createElement('input');
input.placeholder = 'Новая задача';
input.type = 'text';

const addBtn = document.createElement('button');
addBtn.textContent = 'Добавить';

form.append(input, addBtn);
app.appendChild(form);

// контейнер задач
const taskList = document.createElement('section');
taskList.id = 'task-list';
app.appendChild(taskList);

// фильтры и сортировка
const controls = document.createElement('div');
controls.className = 'filters';

const filterAllBtn = document.createElement('button');
filterAllBtn.textContent = 'Все';
const filterCompletedBtn = document.createElement('button');
filterCompletedBtn.textContent = 'Выполненные';
const filterPendingBtn = document.createElement('button');
filterPendingBtn.textContent = 'Невыполненные';
const sortBtn = document.createElement('button');
sortBtn.textContent = 'Сортировать по дате';

controls.append(filterAllBtn, filterCompletedBtn, filterPendingBtn, sortBtn);
app.appendChild(controls);

// поиск задач
const searchInput = document.createElement('input');
searchInput.placeholder = 'Поиск задач...';
app.appendChild(searchInput);

// массив задач
let tasks = [];

// сохранение в localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// восстановление
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  renderAllTasks();
}

// рендер одной задачи
function renderTask(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  taskDiv.textContent = task.text;
  taskDiv.draggable = true;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  taskDiv.appendChild(deleteBtn);

  // событие удаления
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    tasks = tasks.filter(t => t !== task);
    renderAllTasks();
    saveTasks();
  });

  // редактирование
  taskDiv.addEventListener('dblclick', () => {
    const newText = prompt('Редактировать задачу', task.text);
    if (newText) task.text = newText;
    renderAllTasks();
    saveTasks();
  });

  // отметка выполненной
  taskDiv.addEventListener('click', () => {
    task.completed = !task.completed;
    renderAllTasks();
    saveTasks();
  });

  if(task.completed) taskDiv.classList.add('completed');

  // drag-and-drop
  taskDiv.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', tasks.indexOf(task));
  });

  taskDiv.addEventListener('dragover', e => e.preventDefault());

  taskDiv.addEventListener('drop', e => {
    e.preventDefault();
    const fromIndex = +e.dataTransfer.getData('text/plain');
    const toIndex = tasks.indexOf(task);
    const [movedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedTask);
    renderAllTasks();
    saveTasks();
  });

  taskList.appendChild(taskDiv);
}

// рендер всех задач
function renderAllTasks() {
  taskList.innerHTML = '';
  tasks.forEach(renderTask);
}

// добавление новой задачи
addBtn.addEventListener('click', e => {
  e.preventDefault();
  if(!input.value) return;
  const newTask = { text: input.value, date: new Date(), completed: false };
  tasks.push(newTask);
  renderAllTasks();
  saveTasks();
  input.value = '';
});

// фильтры
filterAllBtn.addEventListener('click', renderAllTasks);
filterCompletedBtn.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.filter(t => t.completed).forEach(renderTask);
});
filterPendingBtn.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.filter(t => !t.completed).forEach(renderTask);
});

// сортировка
sortBtn.addEventListener('click', () => {
  tasks.sort((a,b) => a.date - b.date);
  renderAllTasks();
});

// поиск
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  taskList.innerHTML = '';
  tasks.filter(task => task.text.toLowerCase().includes(term)).forEach(renderTask);
});
