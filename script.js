let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const subtaskInput = document.getElementById("subtaskInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const priorityInput = document.getElementById("priorityInput");

  const title = taskInput.value.trim();

  if (title === "") {
    alert("Enter a task");
    return;
  }

  const task = {
    id: Date.now(),
    title: title,
    subtasks: subtaskInput.value
      .split(",")
      .map(subtask => subtask.trim())
      .filter(subtask => subtask !== ""),
    date: dateInput.value,
    time: timeInput.value,
    priority: Number(priorityInput.value)
  };

  tasks.push(task);

  tasks.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    return new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time);
  });

  displayTasks();

  taskInput.value = "";
  subtaskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
}

function displayTasks() {
  const board = document.getElementById("flowBoard");
  board.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");

    const priorityClass =
      task.priority === 1 ? "high" :
      task.priority === 2 ? "medium" :
      "low";

    const priorityText =
      task.priority === 1 ? "High Priority" :
      task.priority === 2 ? "Medium Priority" :
      "Low Priority";

    const day = task.date
      ? new Date(task.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })
      : "No day";

    card.className = "task-card " + priorityClass;

    card.innerHTML = `
      <div class="task-title">${task.title}</div>

      <div class="task-meta">
        ${priorityText} | ${task.date || "No date"} | ${day} | ${task.time || "No time"}
      </div>

      <strong>Subtasks:</strong>
      <ul class="subtask-list">
        ${
          task.subtasks.length > 0
            ? task.subtasks.map(subtask => `<li>${subtask}</li>`).join("")
            : "<li>No subtasks added</li>"
        }
      </ul>

      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete Task</button>
    `;

    board.appendChild(card);
  });
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  displayTasks();
}
