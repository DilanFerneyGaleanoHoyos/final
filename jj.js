let data = {
    "tasks": {}
  };

  document.addEventListener("DOMContentLoaded", function() {
    const taskTable = document.getElementById("task-table");
    const taskFilter = document.getElementById("task-filter");
    const taskInput = document.getElementById("task-input");
    const taskEnd = document.getElementById("task-end");
    const taskAddButton = document.getElementById("task-add");


    function addTask(taskName, taskEndDate) {
        if (Object.keys(data.tasks).length >= 20) {
          alert("¡Has alcanzado el límite máximo de 20 actividades!");
          return;
        }
        
        const taskId = getOrdinal(Object.keys(data.tasks).length + 1);
        data.tasks[taskId] = {
          task: taskName,
          state: false,
          finalizada: false,
          end: taskEndDate
        };

      saveData(); 
      filterTasks(taskFilter.value);
    }

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

    taskAddButton.addEventListener("click", function() {
      const taskName = taskInput.value;
      const taskEndDate = taskEnd.value;

      if (taskName && taskEndDate) {
        addTask(taskName, taskEndDate);
        taskInput.value = "";
        taskEnd.value = "";
      }
    });
    function getOrdinal(n) {
        const ordinals = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
        return ordinals[n - 1] || n.toString();
      }
 
    loadData();
    filterTasks("all");
  });

  document.getElementById("task-table").addEventListener("click", function(e) {
    if (e.target.classList.contains("change-state-button")) {
      const taskId = e.target.getAttribute("data-taskid");
      if (taskId && data.tasks[taskId] && !data.tasks[taskId].finalizada) {
        data.tasks[taskId].state = true; 
        data.tasks[taskId].finalizada = true; 
        saveData(); 
        location.reload();
        const taskFilter = document.getElementById("task-filter");
        filterTasks(taskFilter.value);
      }
    }
  });
 


  
  // ...
  

  
  function saveData() {
    localStorage.setItem("taskData", JSON.stringify(data));
  }

  // 
  function loadData() {
    const savedData = localStorage.getItem("taskData");
    if (savedData) {
      data = JSON.parse(savedData);
    }
  }