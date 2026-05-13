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
        id: Date.now() + Math.random(),
        name: row.querySelector(".subtask-name").value.trim(),
        date: row.querySelector(".subtask-date").value,
        time: row.querySelector(".subtask-time").value,
        status: "should-start"
      };
    })
    .filter(subtask => subtask.name !== "");

  const task = {
    id: Date.now(),
    title: title,
    date: dateInput.value,
    time: timeInput.value,
    priority: Number(priorityInput.value),
    status: "should-start",
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

function getTaskStatus(task) {
  if (task.subtasks.length === 0) {
    return task.status;
  }

  const doneCount = task.subtasks.filter(subtask => subtask.status === "done").length;
  const progressCount = task.subtasks.filter(subtask => subtask.status === "in-progress").length;

  if (doneCount === task.subtasks.length) {
    return "done";
  }

  if (doneCount > 0 || progressCount > 0) {
    return "in-progress";
  }

  return "should-start";
}

function getStatusText(status) {
  if (status === "should-start") return "Should Start";
  if (status === "in-progress") return "In Progress";
  return "Done";
}

function getActiveClass(status, buttonStatus) {
  if (status !== buttonStatus) return "";

  if (buttonStatus === "should-start") return "active-start";
  if (buttonStatus === "in-progress") return "active-progress";
  return "active-done";
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

    const taskStatus = getTaskStatus(task);

    const day = task.date
      ? new Date(task.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })
      : "No day";

    card.className = "task-card " + priorityClass;

    card.innerHTML = `
      <div class="task-title">${task.title}</div>

      <div class="task-meta">
        ${priorityText} | ${task.date || "No date"} | ${day} | ${task.time || "No time"}
      </div>

      <span class="task-status">Task Status: ${getStatusText(taskStatus)}</span>

      <div class="status-row">
        <button class="status-btn ${getActiveClass(taskStatus, "should-start")}" onclick="setTaskStatus(${task.id}, 'should-start')">Should Start</button>
        <button class="status-btn ${getActiveClass(taskStatus, "in-progress")}" onclick="setTaskStatus(${task.id}, 'in-progress')">In Progress</button>
        <button class="status-btn ${getActiveClass(taskStatus, "done")}" onclick="setTaskStatus(${task.id}, 'done')">Done</button>
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

                    <div class="status-row">
                      <button class="status-btn ${getActiveClass(subtask.status, "should-start")}" onclick="setSubtaskStatus(${task.id}, ${subtask.id}, 'should-start')">Should Start</button>
                      <button class="status-btn ${getActiveClass(subtask.status, "in-progress")}" onclick="setSubtaskStatus(${task.id}, ${subtask.id}, 'in-progress')">In Progress</button>
                      <button class="status-btn ${getActiveClass(subtask.status, "done")}" onclick="setSubtaskStatus(${task.id}, ${subtask.id}, 'done')">Done</button>
                    </div>
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

function setTaskStatus(taskId, status) {
  const task = tasks.find(task => task.id === taskId);

  if (!task) return;

  task.status = status;

  if (task.subtasks.length > 0) {
    task.subtasks.forEach(subtask => {
      subtask.status = status;
    });
  }

  displayTasks();
}

function setSubtaskStatus(taskId, subtaskId, status) {
  const task = tasks.find(task => task.id === taskId);

  if (!task) return;

  const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);

  if (!subtask) return;

  subtask.status = status;
  task.status = getTaskStatus(task);

  displayTasks();
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
