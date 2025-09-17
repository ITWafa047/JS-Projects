const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(){
    taskList.innerHTML = "";
    tasks.forEach((task,index) => {
        let li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) li.classList.add("completed");

        li.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            tasks.splice(index,1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

if (taskInput && addTaskBtn && taskList) {
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter'){
            addTaskBtn.click();
        }
    });

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    renderTasks();
} else {
    console.error("Required DOM elements not found. Please check your HTML.");
}