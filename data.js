const data = {
  "tasks":{
    "one":{
      "task":"Learning Javascript",
      "state":true,
      "end":"2020/10/21"
    },
    "two":{
      "task":"Reader Book Clean Code",
      "state":false,
      "end":"2023/12/31"
    },
    "three":{
      "task":"Running",
      "state":false,
      "end":"2023/06/25"
    },
    "four":{
      "task":"Pass the Evaluation",
      "state":false,
      "end":"2023/11/09"
    },
    "five":{
      "task":"Go to Karaoke",
      "state":true,
      "end":"2022/08/25"
    },
    "six":{
      "task":"Finish watching the serie",
      "state":false,
      "end":"2023/12/31"
    },
    "seven":{
      "task":"Controll Weight",
      "state":false,
      "end":"2020/11/22"
    }
  }
} 
document.addEventListener("DOMContentLoaded", function() {
  const taskTable = document.getElementById("task-table");
  const taskFilter = document.getElementById("task-filter");

  function filterTasks(filter) {
    while (taskTable.firstChild) {
      taskTable.removeChild(taskTable.firstChild);
    }

    for (const taskId in data.tasks) {
      const task = data.tasks[taskId];
      const currentDate = new Date();
      const taskDate = new Date(task.end);

      if (
        (filter === "completed" && task.state) ||
        (filter === "notCompleted" && !task.state && currentDate <= taskDate) ||
        (filter === "doneExpired" && task.state && currentDate > taskDate) ||
        filter === "all"
      ) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${task.task}</td>
          <td>${task.state ? "Cumplida" : (task.finalizada ? "Finalizada" : "No cumplida")}</td>
          <td>${task.end}</td>
        `;
        if (!task.state && !task.finalizada && currentDate <= taskDate) {

          const buttonCell = document.createElement("td");
          const button = document.createElement("button");
          button.classList.add("btn", "btn-sm", "btn-primary", "change-state-button");
          button.setAttribute("data-taskid", taskId);
          button.textContent = "Cambiar Estado";
          buttonCell.appendChild(button);
          row.appendChild(buttonCell);
        }

        if (!task.state && currentDate <= taskDate) {
          row.classList.add("table-warning");
        } else if (!task.state) {
          row.classList.add("table-danger");
        } else {
          row.classList.add("table-success");
        }

        taskTable.appendChild(row);
      }
    }
  }

  taskFilter.addEventListener("change", function() {
    filterTasks(taskFilter.value);
  });

  filterTasks("all");
});

document.getElementById("task-table").addEventListener("click", function(e) {
  if (e.target.classList.contains("change-state-button")) {
    const taskId = e.target.getAttribute("data-taskid");
    if (taskId && data.tasks[taskId] && !data.tasks[taskId].finalizada) {
      data.tasks[taskId].state = true; // Marca la actividad como cumplida
      data.tasks[taskId].finalizada = true; // Marca la actividad como finalizada
      const taskFilter = document.getElementById("task-filter");
      filterTasks(taskFilter.value);
      saveData(); // Guardar los datos actualizados en localStorage
    }
  }
});

// Función para guardar los datos en localStorage
function saveData() {
  localStorage.setItem("taskData", JSON.stringify(data));
}

// Función para cargar los datos desde localStorage
function loadData() {
  const savedData = localStorage.getItem("taskData");
  if (savedData) {
    data = JSON.parse(savedData);
  }
}


loadData();