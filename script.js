let tasks = [];

function addSubtaskInput() {
  const subtaskInputs = document.getElementById("subtaskInputs");

  const row = document.createElement("div");
  row.className = "subtask-row";

  row.innerHTML = `
    <input class="subtask-name" type="text" placeholder="Subtask">
    <input class="subtask-date" type="date">
    <input class="subtask-time" type="time">
  `;

  subtaskInputs.appendChild(row);
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const priorityInput = document.getElementById("priorityInput");

  const title = taskInput.value.trim();

  if (title === "") {
    alert("Enter a main task");
    return;
  }

  const subtaskRows = document.querySelectorAll(".subtask-row");

  const subtasks = Array.from(subtaskRows)
    .map(row => {
      return {
        name: row.querySelector(".subtask-name").value.trim(),
        date: row.querySelector(".subtask-date").value,
        time: row.querySelector(".subtask-time").value
      };
    })
    .filter(subtask => subtask.name !== "");

  const task = {
    id: Date.now(),
    title: title,
    date: dateInput.value,
    time: timeInput.value,
    priority: Number(priorityInput.value),
    subtasks: subtasks
  };

  tasks.push(task);
  sortTasks();
  displayTasks();
  clearForm();
}

function sortTasks() {
  tasks.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    const dateA = new Date(`${a.date || "9999-12-31"}T${a.time || "23:59"}`);
    const dateB = new Date(`${b.date || "9999-12-31"}T${b.time || "23:59"}`);

    return dateA - dateB;
  });
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
            ? task.subtasks.map(subtask => {
                const subtaskDay = subtask.date
                  ? new Date(subtask.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })
                  : "No day";

                return `
                  <li>
                    <span class="subtask-name-display">${subtask.name}</span>
                    <span class="subtask-date-display">
                      Date: ${subtask.date || "No date"} |
                      Day: ${subtaskDay} |
                      Time: ${subtask.time || "No time"}
                    </span>
                  </li>
                `;
              }).join("")
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

function clearForm() {
  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("timeInput").value = "";
  document.getElementById("priorityInput").value = "1";

  document.getElementById("subtaskInputs").innerHTML = `
    <div class="subtask-row">
      <input class="subtask-name" type="text" placeholder="Subtask">
      <input class="subtask-date" type="date">
      <input class="subtask-time" type="time">
    </div>
  `;
}
