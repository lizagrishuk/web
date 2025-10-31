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

// создаем массив для хранения задач с датой 
let tasks = [];

// функция рендера всех задач (нужна для сортировки) 
function renderAllTasks() {
  taskList.innerHTML = ''; // очищаем контейнер перед перерисовкой
  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.textContent = task.text;

    // кнопка "Удалить"
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    taskDiv.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t !== task); // удаляем из массива
      renderAllTasks(); // перерисовываем список
    });

    // редактирование по двойному клику
    taskDiv.addEventListener('dblclick', () => {
      const newText = prompt('Редактировать задачу', task.text);
      if(newText) task.text = newText;
      renderAllTasks(); // перерисовываем список
    });

    // отметка выполненной задачи по клику
    taskDiv.addEventListener('click', (e) => {
      if(e.target !== deleteBtn) {
        task.completed = !task.completed;
        taskDiv.classList.toggle('completed');
      }
    });

    // если задача уже выполнена, добавляем класс
    if(task.completed) taskDiv.classList.add('completed');

    taskList.appendChild(taskDiv);
  });
}

// обработка добавления новой задачи 
addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if(!input.value) return;

  // создаем объект задачи с текстом и датой
  const newTask = {
    text: input.value,
    date: new Date(), // текущая дата для сортировки
    completed: false
  };

  tasks.push(newTask); // добавляем в массив
  renderAllTasks();    // рендерим весь список заново
  input.value = '';    // очищаем поле ввода
});

// создаем кнопку сортировки по дате
const sortBtn = document.createElement('button');
sortBtn.textContent = 'Сортировать по дате';
app.appendChild(sortBtn);

sortBtn.addEventListener('click', () => {
  // сортируем массив по дате
  tasks.sort((a, b) => a.date - b.date);
  renderAllTasks(); // перерисовываем список после сортировки
});
