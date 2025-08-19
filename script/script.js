const btnCreateTask = document.querySelector('.create-new-task')
const opacity = document.getElementById('modalOpacity')
const taskMenu = document.querySelector('.new-task')
const btnCancel = document.querySelector('.new-task__cancel')

const bodyToDo = document.querySelector('.body-block--red')

let taskList = []
function renderTaskList() {
    bodyToDo.innerHTML = ''

    taskList = []
    for(let i = 0; i< localStorage.length; i++) {
        let key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        taskList.push(value)
        renderToDoTask(taskList[i].name, taskList[i].desc,taskList[i].date, i)
    }
    taskList.sort((a, b) => new Date(a.date) - new Date(b.date))
    
}

renderTaskList()






btnCreateTask.addEventListener('click', () => { 
    taskMenu.style.display = 'flex'
    taskMenu.setAttribute('data-modal', 'active')
    opacity.style.display = 'flex'
    }
)

btnCancel.addEventListener('click', () => closeActiveModal())

modalOpacity.addEventListener('click', () => closeActiveModal())

function closeActiveModal() {
    const activeModal = document.querySelector('[data-modal="active"]')
    activeModal.style.display = 'none'
    activeModal.dataset.modal = "inactive"
    opacity.style.display = 'none'
}



const btnTaskConfirm = document.querySelector('.new-task__confirm') 

btnTaskConfirm.addEventListener('click', () => confirmTask())

class Task {
    constructor(name, desc, date) {
        this.name = name,
        this.desc = desc,
        this.date = date
    }
}

function confirmTask() {
    const inputTaskName = document.getElementById('inputTaskName').value
    const inputTaskDesc = document.getElementById('inputTaskDesc').value
    const inputTaskDate = document.getElementById('inputTaskDate').value
    
    if (inputTaskName != "" && inputTaskDesc != "") {
        const createTask = new Task(inputTaskName, inputTaskDesc, inputTaskDate)
        // taskList.push(createTask)
        localStorage.setItem(inputTaskName, JSON.stringify(createTask))
    }
}




function renderToDoTask(name, desc, date, index) {
    bodyToDo.insertAdjacentHTML('beforeend', `
    
    <div class="block-tracker block-todo__tracker" data-index = ${index}>
        <span class="block__tracker-name">${name}</span>
        <button class="block__btn-tracker-close">x</button>
        <span class="block__tracker-description">${desc}</span>
        <div class="block__tracker-end-date">
            <span>Due Date:</span>
            <span class = "block-tracker-date">${date}</span>
        </div>
        <div class="block-todo__tracker-priority"></div>
    </div>
    `)

}

const btnDeleteTracker = document.querySelectorAll('.block__btn-tracker-close')

btnDeleteTracker.forEach((btn, index) => {
    const trackerName = document.querySelectorAll('.block__tracker-name')
    btn.addEventListener('click', () => {
        console.log(index, btn)
        localStorage.removeItem(trackerName[index].textContent)
        location.reload()
    })
})