let tasks = [];

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

  const subtasks = Array.from(document.querySelectorAll(".subtask-row"))
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

function getPriorityText(priority) {
  if (priority === 1) return "High Priority";
  if (priority === 2) return "Medium Priority";
  return "Low Priority";
}

function getPriorityClass(priority) {
  if (priority === 1) return "priority-high";
  if (priority === 2) return "priority-medium";
  return "priority-low";
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

    const taskStatus = getTaskStatus(task);

    card.className = "task-card " + priorityClass;

    card.innerHTML = `
      <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="priority-pill ${getPriorityClass(task.priority)}">${getPriorityText(task.priority)}</div>
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

      <span class="task-status">Task Status: ${getStatusText(taskStatus)}</span>

      <div class="status-row">
        <button class="status-btn ${getActiveClass(taskStatus, "should-start")}" onclick="setTaskStatus(${task.id}, 'should-start')">Should Start</button>
        <button class="status-btn ${getActiveClass(taskStatus, "in-progress")}" onclick="setTaskStatus(${task.id}, 'in-progress')">In Progress</button>
        <button class="status-btn ${getActiveClass(taskStatus, "done")}" onclick="setTaskStatus(${task.id}, 'done')">Done</button>
      </div>

      <strong>Subtasks</strong>

      <ul class="subtask-list">
        ${
          task.subtasks.length > 0
            ? task.subtasks.map(subtask => `
              <li>
                <div class="subtask-name-display">${subtask.name}</div>

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
