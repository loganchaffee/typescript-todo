import { v4 as uuid } from 'uuid';

type Task = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');
const tasks: Task[] = loadTasks();

tasks.forEach((task) => {
    addListItem(task);
});

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input?.value == '' || input?.value == null) return;

    const newTask: Task = {
        id: uuid(),
        title: input.value,
        completed: false,
        createdAt: new Date(),
    };

    tasks.push(newTask);

    addListItem(newTask);

    input.value = '';
});

function addListItem(task: Task) {
    const item = document.createElement('li');

    item.id = task.id;

    const label = document.createElement('div');

    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';

    checkbox.checked = task.completed;

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
    });

    const deleteBtn = document.createElement('button');

    deleteBtn.append('x');

    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });

    const span = document.createElement('span');

    span.append(task.title);

    label.append(checkbox, span, deleteBtn);

    item.append(label);

    list?.append(item);

    saveTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
    const tasksJson = localStorage.getItem('tasks');

    if (!tasksJson) return [];

    return JSON.parse(tasksJson);
}

function deleteTask(taskId: string) {
    const index = tasks.findIndex((task) => task.id === taskId);

    if (index > -1) {
        tasks.splice(index, 1);
        const li = document.getElementById(taskId) as HTMLLIElement;

        li.remove();

        saveTasks();
    }
}
