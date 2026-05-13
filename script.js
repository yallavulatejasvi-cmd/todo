let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

displayTasks();

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function changeTheme() {
  const selectedTheme = document.getElementById("themeSelect").value;
  document.body.className = selectedTheme;
}

function addSubtaskInput() {
  const subtaskInputs = document.getElementById("subtaskInputs");

  const row = document.createElement("div");
  row.className = "subtask-row";

  row.innerHTML = `
    <input class="subtask-name" type="text" placeholder="Subtask">
    <select class="subtask-priority">
      <option value="1">High</option>
      <option value="2">Medium</option>
      <option value="3">Low</option>
    </select>
    <input class="subtask-date" type="date">
    <input class="subtask-time" type="time">
  `;

  subtaskInputs.appendChild(row);
}

function addTask() {
  const title = document.getElementById("taskInput").value.trim();

  if (title === "") {
    alert("Enter a main task");
    return;
  }

  const subtasks = Array.from(document.querySelectorAll(".subtask-row"))
    .map(row => ({
      id: Date.now() + Math.random(),
      name: row.querySelector(".subtask-name").value.trim(),
      priority: Number(row.querySelector(".subtask-priority").value),
      date: row.querySelector(".subtask-date").value,
      time: row.querySelector(".subtask-time").value,
      status: "should-start"
    }))
    .filter(subtask => subtask.name !== "");

  const task = {
    id: Date.now(),
    title,
    date: document.getElementById("dateInput").value,
    time: document.getElementById("timeInput").value,
    priority: Number(document.getElementById("priorityInput").value),
    status: "should-start",
    subtasks
  };

  tasks.push(task);
  sortTasks();
  saveTasks();
  displayTasks();
  clearForm();
}

function addSubtaskToExistingTask(taskId) {
  const name = prompt("Enter subtask name:");
  if (!name || name.trim() === "") return;

  const date = prompt("Enter date as YYYY-MM-DD, or leave blank:");
  const time = prompt("Enter time as HH:MM, or leave blank:");
  const priority = prompt("Priority: 1 = High, 2 = Medium, 3 = Low") || "2";

  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  task.subtasks.push({
    id: Date.now() + Math.random(),
    name: name.trim(),
    priority: Number(priority),
    date: date || "",
    time: time || "",
    status: "should-start"
  });

  sortTasks();
  saveTasks();
  displayTasks();
}

function sortTasks() {
  tasks.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;

    const dateA = new Date(`${a.date || "9999-12-31"}T${a.time || "23:59"}`);
    const dateB = new Date(`${b.date || "9999-12-31"}T${b.time || "23:59"}`);

    return dateA - dateB;
  });

  tasks.forEach(task => {
    task.subtasks.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;

      const dateA = new Date(`${a.date || "9999-12-31"}T${a.time || "23:59"}`);
      const dateB = new Date(`${b.date || "9999-12-31"}T${b.time || "23:59"}`);

      return dateA - dateB;
    });
  });
}

function formatDate(date) {
  if (!date) return "No date";
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getDay(date) {
  if (!date) return "No day";
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long"
  });
}

function formatTime(time) {
  if (!time) return "No time";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function getTaskStatus(task) {
  if (task.subtasks.length === 0) return task.status;

  const doneCount = task.subtasks.filter(subtask => subtask.status === "done").length;
  const progressCount = task.subtasks.filter(subtask => subtask.status === "in-progress").length;

  if (doneCount === task.subtasks.length) return "done";
  if (doneCount > 0 || progressCount > 0) return "in-progress";

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

function getPriorityText(priority) {
  if (priority === 1) return "High";
  if (priority === 2) return "Medium";
  return "Low";
}

function getPriorityClass(priority) {
  if (priority === 1) return "priority-high";
  if (priority === 2) return "priority-medium";
  return "priority-low";
}

function getCardPriorityClass(priority) {
  if (priority === 1) return "high";
  if (priority === 2) return "medium";
  return "low";
}

function getSubtaskPriorityClass(priority) {
  if (priority === 1) return "subtask-high";
  if (priority === 2) return "subtask-medium";
  return "subtask-low";
}

function displayTasks() {
  const board = document.getElementById("flowBoard");
  board.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");
    const taskStatus = getTaskStatus(task);

    card.className = `task-card ${getCardPriorityClass(task.priority)}`;

    card.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="priority-pill ${getPriorityClass(task.priority)}">${getPriorityText(task.priority)}</div>
      </div>

      <div class="edit-row">
        <select onchange="changeTaskPriority(${task.id}, this.value)">
          <option value="1" ${task.priority === 1 ? "selected" : ""}>High</option>
          <option value="2" ${task.priority === 2 ? "selected" : ""}>Medium</option>
          <option value="3" ${task.priority === 3 ? "selected" : ""}>Low</option>
        </select>
      </div>

      <div class="date-boxes">
        <div class="date-box">
          <div class="date-label">Date</div>
          <div class="date-value">${formatDate(task.date)}</div>
        </div>
        <div class="date-box">
          <div class="date-label">Day</div>
          <div class="date-value">${getDay(task.date)}</div>
        </div>
        <div class="date-box">
          <div class="date-label">Time</div>
          <div class="date-value">${formatTime(task.time)}</div>
        </div>
      </div>

      <span class="status-pill ${getPriorityClass(task.priority)}">${getStatusText(taskStatus)}</span>

      <div class="status-row">
        <button class="status-btn ${getActiveClass(taskStatus, "should-start")}" onclick="setTaskStatus(${task.id}, 'should-start')">Should Start</button>
        <button class="status-btn ${getActiveClass(taskStatus, "in-progress")}" onclick="setTaskStatus(${task.id}, 'in-progress')">In Progress</button>
        <button class="status-btn ${getActiveClass(taskStatus, "done")}" onclick="setTaskStatus(${task.id}, 'done')">Done</button>
      </div>

      <button onclick="addSubtaskToExistingTask(${task.id})">+ Add Subtask</button>

      <ul class="subtask-list">
        ${
          task.subtasks.length > 0
            ? task.subtasks.map(subtask => `
              <li class="${getSubtaskPriorityClass(subtask.priority)}">
                <div class="subtask-name-display">${subtask.name}</div>

                <div class="edit-row">
                  <select onchange="changeSubtaskPriority(${task.id}, ${subtask.id}, this.value)">
                    <option value="1" ${subtask.priority === 1 ? "selected" : ""}>High</option>
                    <option value="2" ${subtask.priority === 2 ? "selected" : ""}>Medium</option>
                    <option value="3" ${subtask.priority === 3 ? "selected" : ""}>Low</option>
                  </select>
                  <span class="priority-pill ${getPriorityClass(subtask.priority)}">${getPriorityText(subtask.priority)}</span>
                </div>

                <div class="subtask-date-grid">
                  <div class="subtask-date-box">
                    <div class="date-label">Date</div>
                    <div>${formatDate(subtask.date)}</div>
                  </div>
                  <div class="subtask-date-box">
                    <div class="date-label">Day</div>
                    <div>${getDay(subtask.date)}</div>
                  </div>
                  <div class="subtask-date-box">
                    <div class="date-label">Time</div>
                    <div>${formatTime(subtask.time)}</div>
                  </div>
                </div>

                <div class="status-row">
                  <button class="status-btn ${getActiveClass(subtask.status, "should-start")}" onclick="setSubtaskStatus(${task.id}, ${subtask.id}, 'should-start')">Should Start</button>
                  <button class="status-btn ${getActiveClass(subtask.status, "in-progress")}" onclick="setSubtaskStatus(${task.id}, ${subtask.id}, 'in-progress')">In Progress</button>
                  <button class="status-btn ${getActiveClass(subtask.status, "done")}" onclick="setSubtaskStatus(${task.id}, ${subtask.id}, 'done')">Done</button>
                </div>
              </li>
            `).join("")
            : "<li>No subtasks added</li>"
        }
      </ul>

      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete Task</button>
    `;

    board.appendChild(card);
  });
}

function changeTaskPriority(taskId, priority) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  task.priority = Number(priority);
  sortTasks();
  saveTasks();
  displayTasks();
}

function changeSubtaskPriority(taskId, subtaskId, priority) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
  if (!subtask) return;

  subtask.priority = Number(priority);
  sortTasks();
  saveTasks();
  displayTasks();
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

  saveTasks();
  displayTasks();
}

function setSubtaskStatus(taskId, subtaskId, status) {
  const task = tasks.find(task => task.id === taskId);
  if (!task) return;

  const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
  if (!subtask) return;

  subtask.status = status;
  task.status = getTaskStatus(task);

  saveTasks();
  displayTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
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
      <select class="subtask-priority">
        <option value="1">High</option>
        <option value="2">Medium</option>
        <option value="3">Low</option>
      </select>
      <input class="subtask-date" type="date">
      <input class="subtask-time" type="time">
    </div>
  `;
}
