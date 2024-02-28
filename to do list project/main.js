const taskInput = document.querySelector("#new-task-input");
const addTaskBtn = document.querySelector("#add-task-btn");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");

let editId;
let isEditTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Event listeners for filter buttons
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// Function to display tasks based on filter
function showTodo(filter) {
    let liTag = "";
    todos.forEach((todo, id) => {
        let completed = todo.status === "completed" ? "checked" : "";
        if (filter === todo.status || filter === "all") {
            liTag += `<li class="task">
                        <label for="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                            <p class="${completed}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
        }
    });
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    clearAll.classList.toggle("active", taskBox.querySelectorAll(".task").length > 0);
    taskBox.classList.toggle("overflow", taskBox.offsetHeight >= 300);
}

showTodo("all");

// Function to display task menu
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.toggle("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Function to update task status
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Function to edit a task
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// Function to delete a task
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// Event listener for clear all tasks button
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

// Event listener for adding a new task
addTaskBtn.addEventListener("click", () => {
    let userTask = taskInput.value.trim();
    if (userTask) {
        todos.push({ name: userTask, status: "pending" });
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});