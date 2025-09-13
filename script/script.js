sessionStorage.setItem('taskPriority', '?')

class Modals {
    constructor() {
        this.openNewTask()
    }

    static clickBackOnDrop(el, event) {
        const modal = event.currentTarget
        const isClickBackOnDrop = event.target === modal
        if(isClickBackOnDrop) el.close()
    }

    static open(el) {
        el.showModal()
    }

    openNewTask() {
        const btnCreateTask = document.querySelector('.create-new-task')
        const taskMenu = document.querySelector('.new-task')
        btnCreateTask.addEventListener('click', () =>  Modals.open(taskMenu))   
        taskMenu.addEventListener('click', (e) => Modals.clickBackOnDrop(taskMenu, e)) 
    }
}

class TaskUI {
    constructor() {
        this.bodyToDo = document.querySelector('.body-block--red'),
        this.bodyInProgress = document.querySelector('.body-block--orange'),
        this.bodyDone = document.querySelector('.body-block--blue')
        this.taskList = []
        this.deleteTracker()
        this.clickConfirmNewTask()
        this.changeDate()
    }
        
    renderTaskList() {
        this.bodyToDo.innerHTML = ''
        this.bodyInProgress.innerHTML = ''
        this.bodyDone.innerHTML = ''
        
        this.taskList = []
        for(let i = 0; i< localStorage.length; i++) {
            let key = localStorage.key(i)
            const value = JSON.parse(localStorage.getItem(key))
            this.taskList.push(value)    
        }
        this.taskList.sort((a, b) => a.index - b.index)
        this.taskList.forEach((task, i) => {
            taskUI.render(task, i)
        })
    }
    render(task, i) {
    const container = {
        todo: this.bodyToDo,
        inProgress: this.bodyInProgress,
        done: this.bodyDone,
    }[task.type]
        container.insertAdjacentHTML('beforeend', `
        <div class="block-tracker block-${task.type}__tracker" data-index = "${i}">
            <span class="block__tracker-name">${task.name}</span>
            <button class="block__btn-tracker-close">x</button>
            <span class="block__tracker-description">${task.desc}</span>
            <div class="block__tracker-end-date">
                <span>Дата окончания:</span>
                <span class = "block__tracker-date">${taskUI.checkingDate(task.date)}</span>
            </div>
            <div class="block__tracker-priority-${task.priority}">${task.priority}</div>
        </div>
        `)
    }
    checkingDate(date) {
        if (date !== '') {
            return date
        }
        else {
            return 'не указано'
        }
    }
    clickCancelNewTask() {
        const btnNewTaskCancel = document.querySelector('.new-task__cancel')
        btnNewTaskCancel.onclick = () => taskMenu.close()
        const btnTaskPriority = document.querySelectorAll('.new-task__tag-btn')
        btnTaskPriority.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                sessionStorage.setItem('taskPriority', btn.textContent)
            })
        })
    }
    clickConfirmNewTask() {
        const btnTaskConfirm = document.querySelector('.new-task__confirm') 
        btnTaskConfirm.addEventListener('click',() => {
        const inputTaskName = document.getElementById('inputTaskName').value
        const inputTaskDesc = document.getElementById('inputTaskDesc').value
        const inputTaskDate = document.getElementById('inputTaskDate').value
        this.confirmTask(inputTaskName, inputTaskDesc, inputTaskDate)
        })
    }

    confirmTask(name, desc, date) {
        const taskPriorityValue = sessionStorage.getItem('taskPriority')
        if (name != "" && inputTaskDesc != "") {
            const createTask = new Task(name, desc, date, taskPriorityValue, 'todo', this.taskList.length)
            console.log(this.taskList)
            localStorage.setItem(name, JSON.stringify(createTask))
        }
    }

    usingTracker(el) {
        const index = el.dataset.index
        this.todoPanel = document.querySelector('.todo-panel')
        this.inProgressPanel = document.querySelector('.inprogress-panel')
        const container = {
            todo: this.todoPanel,
            inProgress: this.inProgressPanel,
            done: null,
        }[this.taskList[index].type]
        Modals.open(container)
        container.addEventListener('click', (e) => {
            Modals.clickBackOnDrop(container, e)
        })
        this.clickStartGoal(index)
        this.clickCompleteGoal(index)
        this.acceptChangeDate(index)
    }

    deleteTracker() {
        const bodyTracker = document.querySelector('.tracker')
        bodyTracker.addEventListener('click', (e) => { 
        const trackerELement = e.target.closest('.block-tracker')
        const container = {
                todo: this.bodyToDo,
                inProgress: this.bodyInProgress,
                done: this.bodyDone,
            }[this.taskList[trackerELement.dataset.index].type]
            
            if (e.target.classList.contains('block__btn-tracker-close')) {
                const index = (e.target.closest('.block-tracker').dataset.index)
                localStorage.removeItem(this.taskList[index].name)
                taskUI.renderTaskList()
            }
            else if (trackerELement) taskUI.usingTracker(trackerELement) 
        })
    }

    changeDate() {
        const btnChangeDate = document.querySelector('.todo-panel__btn-change-date')
        btnChangeDate.addEventListener('click', () => {
            const btnsBlock = document.querySelector('.todo-panel__buttons')
            const newDateBlock = document.querySelector('.todo-panel__new-date-block')
            btnsBlock.style.display = 'none'
            newDateBlock.style.display = 'flex'   
        })
    }

    acceptChangeDate(i) {
        const btnAccept = document.querySelector('.todo-panel_new-date-accept')
        btnAccept.addEventListener('click', (e) => {
            const userNewDate = document.querySelector('.todo-panel__new-date-input').value
            let task = JSON.parse(localStorage.getItem(this.taskList[i].name))
            task.date = userNewDate
            localStorage.setItem(this.taskList[i].name, JSON.stringify(task))
            this.todoPanel.close()
            this.renderTaskList()
        })
    }
    clickStartGoal(i) {
        const btnStartGoal = document.querySelector('.todo-panel__btn-move')
        btnStartGoal.addEventListener('click', () => {
            let task = JSON.parse(localStorage.getItem(this.taskList[i].name))
            task.type = 'inProgress'
            localStorage.setItem(this.taskList[i].name, JSON.stringify(task))
            this.todoPanel.close()
            this.renderTaskList()
        })
    }

    clickCompleteGoal(i) {
        const btnCompleteTask = document.querySelector('.inprogress__btn-complete')
        btnCompleteTask.addEventListener('click', () => {
            let task = JSON.parse(localStorage.getItem(this.taskList[i].name))
            task.type = 'done'
            localStorage.setItem(this.taskList[i].name, JSON.stringify(task))
            this.inProgressPanel.close()
            this.renderTaskList()
        })
    }
}
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

const taskUI = new TaskUI()
taskUI.renderTaskList()
new Modals()