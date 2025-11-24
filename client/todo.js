const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  
const taskList = document.getElementById("taskList");
const actionBtns = document.getElementById("action-buttons");
const editBtn = document.getElementById("edit-task");
const deleteBtn = document.getElementById("delete-task");

function renderTasks() {
    taskList.innerHTML = "";
  
    tasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = `task ${task.priority}`;
      div.innerHTML = `
        <label style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <div style="display: flex; align-items: center;">
            <input type="checkbox" class="task-complete" data-index="${index}" ${task.completed ? "checked" : ""}/>
            <span class="task-title ${task.completed ? "completed" : ""}" style="margin-left: 10px;">
              <strong>${task.title}</strong> - ${task.priority}
            </span>
          </div>
          <div class="task-menu">
            <button class="menu-btn" data-index="${index}">⋮</button>
            <div class="menu-options" id="menu-${index}">
              <button onclick="editTask(${index})">Edit</button>
              <button onclick="deleteTask(${index})">Delete</button>
            </div>
          </div>
        </label>
      `;
      taskList.appendChild(div);
    });
  
    setupCompletionLogic();
    setupMenuLogic();
  }
  
  function setupCompletionLogic() {
    const checkboxes = document.querySelectorAll(".task-complete");
  
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const index = cb.dataset.index;
        tasks[index].completed = cb.checked;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
    });
  }
  
  function setupMenuLogic() {
    document.querySelectorAll(".menu-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent closing immediately
        const index = button.dataset.index;
        const menu = document.getElementById(`menu-${index}`);
        closeAllMenus();
        menu.style.display = "flex";
      });
    });
  
    document.addEventListener("click", () => closeAllMenus());
  }
  
  function closeAllMenus() {
    document.querySelectorAll(".menu-options").forEach(menu => {
      menu.style.display = "none";
    });
  }
  
  function editTask(index) {
    const newTitle = prompt("Edit Task Title:", tasks[index].title);
    if (newTitle) {
      tasks[index].title = newTitle;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  }
  
  function deleteTask(index) {
    if (confirm("Delete this task?")) {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  }

  function clearTasks() {
    if (confirm("Clear all tasks?")) {
      localStorage.removeItem("tasks");
      location.reload();
    }
  }
  
  renderTasks();
