const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel');
const taskAtiveDescription = document.querySelector('.app__section-active-task-description');
const textarea = document.querySelector('.app__form-textarea');
const btnCancel = document.querySelector('.app__form-footer__button--cancel');
const btnDelete = document.querySelector('.app__form-footer__button--delete');
const btnDeleteTaskComplete = document.querySelector('#btn-remover-concluidas');
const btnDeleteAll = document.querySelector('#btn-remover-todas');


const localStorageTasks = localStorage.getItem('tasks');
let tasks = localStorageTasks ? JSON.parse(localStorageTasks) : [];

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`;

let taskSelected = null;
let selectedTaskItem = null;
let editingTask  = null;
let editingParagraph  = null;

const deleteTasks = (completedOnly) => {
    const seletor = completedOnly ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((el) => {
        el.remove();
    });

    tasks = completedOnly ? tasks.filter(t => !t.completed) : []
    updateLocalStorage()
}

const selectTask = (task, element) => {
    if(task.completed) {
        return
    }
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active');
    });

    if (taskSelected == task) {
        taskAtiveDescription.textContent = null;
        selectedTaskItem = null;
        taskSelected = null;
        return;
    }

    taskSelected = task;
    selectedTaskItem = element;
    taskAtiveDescription.textContent = task.description;
    element.classList.add('app__section-task-list-item-active');
};

const clearForm = () => {
    editingTask  = null;
    editingParagraph  = null;
    textarea.value = '';
    formTask.classList.add('hidden');
};

const editSelectedTask = (task, el) => {
    if(editingTask  == task) {
        clearForm();
        return
    };

    formLabel.textContent="Editando tarefa";
    editingTask  = task;
    editingParagraph  = el;
    textarea.value = task.description;
    formTask.classList.remove('hidden');
};

function createTask(task) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');

    paragraph.textContent = task.description;

    const button = document.createElement('button');

    button.classList.add('app_button-edit');
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    button.appendChild(editIcon);


    button.addEventListener('click', (event) => {
        event.stopPropagation()
        editSelectedTask(task, paragraph)
    });

    li.onclick = () => {
        selectTask(task, li);
    };

    svgIcon.addEventListener('click', (event) => {
        if(task == taskSelected) {
            event.stopPropagation();
            button.setAttribute('disabled', true);
            li.classList.add('app__section-task-list-item-complete');
            taskSelected.completed = true;
            updateLocalStorage();
        };
    });

    if (task.completed) {
        button.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete');
    };

    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
};

tasks.forEach((task) => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden');
});

btnCancel.addEventListener('click', clearForm);

btnDelete.addEventListener('click', () => {
    if(taskSelected) {
        const index = tasks.indexOf(taskSelected);

        if(index !== -1) {
            tasks.splice(index, 1);
        };

        selectedTaskItem.remove();
        tasks.filter(t => t!= selectedTaskItem);
        selectedTaskItem = null;
        taskSelected = null;
    };

    updateLocalStorage();
    clearForm();
});

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa...';
    formTask.classList.toggle('hidden');
});

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

formTask.addEventListener('submit', (event) => {
    event.preventDefault();
    if(editingTask ) {
        editingTask .description = textarea.value;
        editingParagraph .textContent = textarea.value;
    } else {
        const task = {
            description: textarea.value,
            completed: false,
        };
        tasks.push(task);
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    }
    updateLocalStorage();
    clearForm();
});

btnDeleteTaskComplete.addEventListener('click', () => deleteTasks(true));

btnDeleteAll.addEventListener('click', () => deleteTasks(false));


document.addEventListener('TaskCompleted', function (e) {
    if(taskSelected) {
        taskSelected.completed = true;
        selectedTaskItem.classList.add('app__section-task-list-item-complete');
        selectedTaskItem.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage()
    }
});