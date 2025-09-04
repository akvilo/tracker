const btnCreateTask = document.querySelector('.create-new-task')
const opacity = document.getElementById('modalOpacity')
const taskMenu = document.querySelector('.new-task')
const btnCancel = document.querySelector('.new-task__cancel')

const bodyToDo = document.querySelector('.body-block--red')
const bodyInProgress = document.querySelector('.body-block--orange  ')
sessionStorage.setItem('taskPriority', '?')


let taskList = []
function renderTaskList() {
    bodyToDo.innerHTML = ''

    taskList = []
    for(let i = 0; i< localStorage.length; i++) {
        let key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        taskList.push(value)    
    }

    taskList.sort((a, b) => a.index - b.index)
    taskList.forEach((task, i) => {
        switch (taskList[i].type) {
            case "todo":  renderToDoTask(task.name, task.desc,task.date, task.priority, i,)
            break;

            case "inProgress": renderInProgressTask(task.name, task.desc,task.date, task.priority, i,)
            break;
        }
    })
}

renderTaskList()


function renderToDoTask(name, desc, date, priority, index) {
    bodyToDo.insertAdjacentHTML('beforeend', `
    
    <div class="block-tracker block-todo__tracker" data-index = "${index}">
        <span class="block__tracker-name">${name}</span>
        <button class="block__btn-tracker-close">x</button>
        <span class="block__tracker-description">${desc}</span>
        <div class="block__tracker-end-date">
            <span>Дата окончания:</span>
            <span class = "block__tracker-date">${checkingDate(date)}</span>
        </div>
        <div class="block__tracker-priority-${priority}">${priority}</div>
    </div>
    `)
}
function renderInProgressTask(name, desc, date, priority, index) {
       bodyInProgress.insertAdjacentHTML('beforeend', `
    
    <div class="block-tracker block-inprogress__tracker" data-index = "${index}">
        <span class="block__tracker-name">${name}</span>
        <button class="block__btn-tracker-close">x</button>
        <span class="block__tracker-description">${desc}</span>
        <div class="block__tracker-end-date">
            <span>Дата окончания:</span>
            <span class = "block__tracker-date">${checkingDate(date)}</span>
        </div>
        <div class="block__tracker-priority-${priority}">${priority}</div>
    </div>
    `)
}

function checkingDate(date) {
    if (date !== '') {
        return date
    }
    else {
        return 'не указано'
    }
}


btnCreateTask.addEventListener('click', () => openActiveModal(taskMenu))

btnCancel.addEventListener('click', () => closeActiveModal())

modalOpacity.addEventListener('click', () => closeActiveModal())

function openActiveModal(el) {
    el.style.display = 'flex'
    el.setAttribute('data-modal', 'active')
    opacity.style.display = 'flex'
}
function closeActiveModal() {
    const activeModal = document.querySelector('[data-modal="active"]')
    activeModal.style.display = 'none'
    activeModal.dataset.modal = "inactive"
    opacity.style.display = 'none'
}





const btnTaskPriority = document.querySelectorAll('.new-task__tag-btn')

btnTaskPriority.forEach((btn) => {
    btn.addEventListener('click', () => {
        sessionStorage.setItem('taskPriority', btn.textContent)
    })
})








const btnTaskConfirm = document.querySelector('.new-task__confirm') 

btnTaskConfirm.addEventListener('click', () => confirmTask())

class Task {
    constructor(name, desc, date, priority, type, index) {
        this.name = name,
        this.desc = desc,
        this.date = date,
        this.priority = priority,
        this.type = type
        this.index = index
    }
}

function confirmTask() {
    const inputTaskName = document.getElementById('inputTaskName').value
    const inputTaskDesc = document.getElementById('inputTaskDesc').value
    const inputTaskDate = document.getElementById('inputTaskDate').value
    const taskPriorityValue = sessionStorage.getItem('taskPriority')

    if (inputTaskName != "" && inputTaskDesc != "") {
        const createTask = new Task(inputTaskName, inputTaskDesc, inputTaskDate, taskPriorityValue, 'todo', taskList.length)
        // taskList.push(createTask)
        localStorage.setItem(inputTaskName, JSON.stringify(createTask))
    }
}




const btnDeleteTracker = document.querySelectorAll('.block__btn-tracker-close')

btnDeleteTracker.forEach((btn, index) => {
    const trackerName = document.querySelectorAll('.block__tracker-name')
    btn.addEventListener('click', (el) => {
        el.stopPropagation()
        localStorage.removeItem(trackerName[index].textContent)
        location.reload()
    })
})




// взаимоедйствие с трекером

const blockTracker = document.querySelectorAll('.block-tracker')
const todoPanel = document.querySelector('.todo-panel')
const btnChangeDate = document.querySelector('.todo-panel__btn-change-date')
const btnStartGoal = document.querySelector('.todo-panel__btn-move')

blockTracker.forEach((block) => {
    block.onclick = () => usingTracker(block)
})

function usingTracker(el) {
    const index = el.dataset.index
    if (el.classList.contains('block-todo__tracker')) {
        todoMoveModal()
    }   
    
    function todoMoveModal() {
        openActiveModal(todoPanel)
    }


    btnChangeDate.onclick = function() {
        const btnsBlock = document.querySelector('.todo-panel__buttons')
        const newDateBlock = document.querySelector('.todo-panel__new-date-block')
        btnsBlock.style.display = 'none'
        newDateBlock.style.display = 'flex'
        
        const btnAccept = document.querySelector('.todo-panel_new-date-accept')

        btnAccept.onclick = function() {
            const userNewDate = document.querySelector('.todo-panel__new-date-input').value
            let task = JSON.parse(localStorage.getItem(taskList[index].name))
            task.date = userNewDate
            localStorage.setItem(taskList[index].name, JSON.stringify(task))
            closeActiveModal()
            btnsBlock.style.display = 'flex'
            newDateBlock.style.display = 'none'
            location.reload()
        }
    }

    btnStartGoal.onclick = function() {
        let task = JSON.parse(localStorage.getItem(taskList[index].name))
        task.type = 'inProgress'
        localStorage.setItem(taskList[index].name, JSON.stringify(task))
        location.reload()
    }
}
