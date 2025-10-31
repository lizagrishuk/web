// создание контейнера приложения 
const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);

// создание заголовка
const header = document.createElement('h1');
header.textContent = 'ToDo App';
app.appendChild(header);

// список задач
const taskList = document.createElement('div');
taskList.id = 'task-list';
app.appendChild(taskList);

// форма для добавления новой задачи
const form = document.createElement('form');

const input = document.createElement('input');
input.placeholder = 'Новая задача';

const addBtn = document.createElement('button');
addBtn.textContent = 'Добавить';

form.append(input, addBtn);
app.appendChild(form);

// создание массива для хранения задач
let tasks = [];

// функция рендера одной задачи
function renderTask(task) {
  const taskDiv = document.createElement('div');
  taskDiv.textContent = task.text;

  // кнопка "Удалить"
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  taskDiv.appendChild(deleteBtn);

  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t !== task);
    renderAllTasks();
  });

  // редактирование по двойному клику
  taskDiv.addEventListener('dblclick', () => {
    const newText = prompt('Редактировать задачу', task.text);
    if(newText) task.text = newText;
    renderAllTasks();
  });

  // отметка выполненной задачи по клику
  taskDiv.addEventListener('click', (e) => {
    if(e.target !== deleteBtn) {
      task.completed = !task.completed;
      taskDiv.classList.toggle('completed');
    }
  });

  // если задача выполнена, добавляем класс
  if(task.completed) taskDiv.classList.add('completed');

  taskList.appendChild(taskDiv);
}

//  функция рендера всего списка
function renderAllTasks() {
  taskList.innerHTML = '';
  tasks.forEach(renderTask);
}

// добавление новой задачи 
addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(!input.value) return;

  const newTask = {
    text: input.value,
    date: new Date(),
    completed: false
  };

  tasks.push(newTask);
  renderAllTasks();
  input.value = '';
});

// кнопка сортировки по дате
const sortBtn = document.createElement('button');
sortBtn.textContent = 'Сортировать по дате';
app.appendChild(sortBtn);

sortBtn.addEventListener('click', () => {
  tasks.sort((a, b) => a.date - b.date);
  renderAllTasks();
});

// фильтры 
const filterAllBtn = document.createElement('button');
filterAllBtn.textContent = 'Все';

const filterCompletedBtn = document.createElement('button');
filterCompletedBtn.textContent = 'Выполненные';

const filterPendingBtn = document.createElement('button');
filterPendingBtn.textContent = 'Невыполненные';

app.append(filterAllBtn, filterCompletedBtn, filterPendingBtn);

// показать все задачи
filterAllBtn.addEventListener('click', () => {
  renderAllTasks();
});

// показать только выполненные
filterCompletedBtn.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.filter(task => task.completed).forEach(renderTask);
});

// показать только невыполненные
filterPendingBtn.addEventListener('click', () => {
  taskList.innerHTML = '';
  tasks.filter(task => !task.completed).forEach(renderTask);
});

// поиск задач по названию 
const searchInput = document.createElement('input');
searchInput.placeholder = 'Поиск задач...';
app.appendChild(searchInput);

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  taskList.innerHTML = '';
  tasks
    .filter(task => task.text.toLowerCase().includes(term))
    .forEach(renderTask);
});
