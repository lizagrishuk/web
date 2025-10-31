const app = document.createElement('div');
app.id = 'app';
document.body.appendChild(app);

const header = document.createElement('h1');
header.textContent = 'ToDo App';
app.appendChild(header);

const taskList = document.createElement('div');
taskList.id = 'task-list';
app.appendChild(taskList);
