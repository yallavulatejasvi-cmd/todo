let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const subtaskInput = document.getElementById("subtaskInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const priorityInput = document.getElementById("priorityInput");

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Enter a main task");
    return;
  }

  const task = {
    id: Date.now(),
    title: taskText,
    subtasks: subtaskInput.value
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== ""),
    date: dateInput.value,
    time: timeInput.value,
    priority: Number(priorityInput.value),
    completed: false
  };

  tasks.push(task);
  sortTasks();
  renderTasks();

  taskInput.value = "";
  subtaskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  priorityInput.value = "1";
}

function sortTasks() {
  tasks.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);

    return dateA - dateB;
  });
}

function renderTasks() {
  const board = document.getElementById("flowBoard");
  board.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");

    const priorityClass =
      task.priority === 1 ? "high" :
      task.priority === 2 ? "medium" :
      "low";

    card.className = `task-card ${priorityClass}`;

    if (task.completed) {
      card.classList.add("completed");
    }

    const day = task.date
      ? new Date(task.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })
      : "No day";

    const priorityText =
      task.priority === 1 ? "High" :
      task.priority === 2 ? "Medium" :
      "Low";

    card.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="priority-label">${priorityText}</div>
      </div>

      <div class="task-info">
        Date: ${task.date || "No date"} |
        Day: ${day} |
        Time: ${task.time || "No time"}
      </div>

      <div class="subtasks">
        ${
          task.subtasks.length > 0
            ? task.subtasks.map(sub => `<span class="subtask">${sub}</span>`).join("")
            : `<span class="subtask">No subtasks</span>`
        }
      </div>

      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;

    card.addEventListener("click", function(event) {
      if (event.target.tagName !== "BUTTON") {
        task.completed = !task.completed;
        renderTasks();
      }
    });

    board.appendChild(card);
  });
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}
