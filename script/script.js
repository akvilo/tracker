const bodyToDo = document.querySelector('.body-block--red')
const bodyInProgress = document.querySelector('.body-block--orange')
const bodyDone = document.querySelector('.body-block--blue')
sessionStorage.setItem('taskPriority', '?')

let taskList = []
function renderTaskList() {
    bodyToDo.innerHTML = ''
    bodyInProgress.innerHTML = ''
    bodyDone.innerHTML = ''
    
    taskList = []
    for(let i = 0; i< localStorage.length; i++) {
        let key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        taskList.push(value)    
    }

    taskList.sort((a, b) => a.index - b.index)
    taskList.forEach((task, i) => {
        render(task, i)
    })
}
renderTaskList()

function render(task, i) {
const container = {
    todo: bodyToDo,
    inProgress: bodyInProgress,
    done: bodyDone,
}[task.type]
    container.insertAdjacentHTML('beforeend', `
    <div class="block-tracker block-${task.type}__tracker" data-index = "${i}">
        <span class="block__tracker-name">${task.name}</span>
        <button class="block__btn-tracker-close">x</button>
        <span class="block__tracker-description">${task.desc}</span>
        <div class="block__tracker-end-date">
            <span>Дата окончания:</span>
            <span class = "block__tracker-date">${checkingDate(task.date)}</span>
        </div>
        <div class="block__tracker-priority-${task.priority}">${task.priority}</div>
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

function clickBackOnDrop(el, event) {
    const modal = event.currentTarget
    const isClickBackOnDrop = event.target === modal
    if(isClickBackOnDrop) el.close()
}


const btnCreateTask = document.querySelector('.create-new-task')
const taskMenu = document.querySelector('.new-task')

btnCreateTask.onclick = () => taskMenu.showModal(open)
taskMenu.addEventListener('click', (e) => {
    clickBackOnDrop(taskMenu, e)
}) 

const btnNewTaskCancel = document.querySelector('.new-task__cancel')
btnNewTaskCancel.onclick = () => taskMenu.close()

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
        localStorage.setItem(inputTaskName, JSON.stringify(createTask))
    }
}


const btnChangeDate = document.querySelector('.todo-panel__btn-change-date')
const btnStartGoal = document.querySelector('.todo-panel__btn-move')
const bodyTracker = document.querySelector('.tracker')
const btnCompleteTask = document.querySelector('.inprogress__btn-complete')

bodyTracker.addEventListener('click', (e) => { 
    const trackerELement = e.target.closest('.block-tracker')
    const container = {
        todo: bodyToDo,
        inProgress: bodyInProgress,
        done: bodyDone,
    }[taskList[trackerELement.dataset.index].type]
    
    if (e.target.classList.contains('block__btn-tracker-close')) {
        const index = (e.target.closest('.block-tracker').dataset.index)
        localStorage.removeItem(taskList[index].name)
        renderTaskList()
    }
    else if (trackerELement) usingTracker(trackerELement) 
})

function usingTracker(el) {
    const todoPanel = document.querySelector('.todo-panel')
    const inProgressPanel = document.querySelector('.inprogress-panel')
    const index = el.dataset.index
    const container = {
        todo: todoPanel,
        inProgress: inProgressPanel,
        done: null,
    }[taskList[index].type]

    container.showModal(open)
    container.addEventListener('click', (e) => {
        clickBackOnDrop(container, e)
    })
    

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
            todoPanel.close()
            renderTaskList()
        }
    }

    btnStartGoal.onclick = function() {
        let task = JSON.parse(localStorage.getItem(taskList[index].name))
        task.type = 'inProgress'
        localStorage.setItem(taskList[index].name, JSON.stringify(task))
        todoPanel.close()
        renderTaskList()
    }

      btnCompleteTask.onclick = function() {
        let task = JSON.parse(localStorage.getItem(taskList[index].name))
        task.type = 'done'
        localStorage.setItem(taskList[index].name, JSON.stringify(task))
        inProgressPanel.close()
        renderTaskList()
    }
}
