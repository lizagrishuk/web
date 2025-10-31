const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);

const header = document.createElement('h1');
header.textContent = 'ToDo App';
app.appendChild(header);

const taskList = document.createElement('div');
taskList.id = 'task-list';
app.appendChild(taskList);

const form = document.createElement('form');

const input = document.createElement('input');
input.placeholder = 'Новая задача';

const addBtn = document.createElement('button');
addBtn.textContent = 'Добавить';

form.append(input, addBtn);
app.appendChild(form);

addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!input.value) return;
  
  const task = document.createElement('div');
  task.textContent = input.value;

  // добавляем кнопку "Удалить" внутрь задачи
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  task.appendChild(deleteBtn);

  // событие для кнопки "Удалить"
  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(task);
  });

  // редактирование задачи по двойному клику
  task.addEventListener('dblclick', () => {
    const newText = prompt('Редактировать задачу', task.firstChild.textContent);
    if (newText) task.firstChild.textContent = newText;
  });

  taskList.appendChild(task);
  
  input.value = '';
});
