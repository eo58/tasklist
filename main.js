/***********************************************************************************

	FILE NAME:	main.js
	
	PURPOSE:	To-do Task Web Application Tool

	APPLICATION:	Task Management Tool

	CONTENTS:	saveTask()
                        setStatusCompleted()
			deleteTask()
                        fetchTask()
			
 **********************************************************************************/

document.getElementById('taskInputForm').addEventListener('submit', saveTask);
document.getElementById("clickMe").onclick = fetchTasks;

/***********************************************************************************
 
	FUNCTION NAME:	saveTask()
                  
	PURPOSE:        Create and insert the task object values into local storage
 
	ARGUMENTS:	e: event - Prevent from submitting the form
 
	RETURN:		none

 **********************************************************************************/

function saveTask(e) {
  var taskDesc = document.getElementById('taskDescInput').value;
  var taskDuedate = document.getElementById('taskDuedateInput').value;
  var taskAssignedTo = document.getElementById('taskAssignedToInput').value;
  // Use the chance library for a global unique identifier
  var taskId = chance.guid();
  // Every task is open by default
  var taskStatus = 'Open';

  // Create the object
  var task = {
    id: taskId,
    description: taskDesc,
    duedate: taskDuedate,
    assignedTo: taskAssignedTo,
    status: taskStatus
  }

  // Insert the object into local storage
  if (localStorage.getItem('tasks') == null) {
    var tasks = [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } 
  else {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Reset and prevent the form from submitting
  document.getElementById('taskInputForm').reset();
  e.preventDefault();
}


/***********************************************************************************
 
	FUNCTION NAME:	setStatusCompleted(id, filter)
                  
	PURPOSE:        Sets the status of the task to complete when Complete button
                        is clicked by user
 
	ARGUMENTS:	id: global unique identifier for the task
			filter: defines condition used to show filtered tasks on page
 
	RETURN:		none

 **********************************************************************************/

function setStatusCompleted(id, filter) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks[i].status = 'Completed';
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  fetchTasks(filter);
}


/***********************************************************************************
 
	FUNCTION NAME:	deleteTask(id, filter)
                  
	PURPOSE:        Deletes the task when Delete button is clicked by the user
 
	ARGUMENTS:	id: global unique identifier for the task
			filter: defines condition to show filtered tasks on page
 
	RETURN:		none

 **********************************************************************************/

function deleteTask(id, filter) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks.splice(i, 1);
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  fetchTasks(filter);
}


/***********************************************************************************
 
	FUNCTION NAME:	fetchTasks(filter)
                  
	PURPOSE:        Fetches the list of tasks that are available
 
	ARGUMENTS:	filter: defines condition to show filtered tasks on page
 
	RETURN:		none

 **********************************************************************************/

function fetchTasks(filter) {
  // Parse the return value from the local storage and get item tasks
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  var tasksListe = document.getElementById('tasksList');
  tasksList.innerHTML = '';

  for (var i = 0; i < tasks.length; i++) {
    var id = tasks[i].id;
    var desc = tasks[i].description;
    var duedate = tasks[i].duedate;
    var duedateDate = duedate.split('T')[0];
    var duedateTime = duedate.split('T')[1];
    var assignedTo = tasks[i].assignedTo;
    var status = tasks[i].status;

    // Get the EST date
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,10);
 
    // Calculate the date for the next day
    var tomorrow = (new Date(Date.now() - tzoffset))
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tomorrowDate = tomorrow.toISOString().slice(0,10);

    // Capture the time from the date format 
    var localISOTime2 = (new Date(Date.now() - tzoffset)).toISOString().slice(11,16);


    // Change the color of label, button and assign a status string based on task status
    if ( status == 'Completed' ){
      var statLabel = 'label-success';
      var statusSta = ''
    }
    else if (( duedateDate == localISOTime ) || ( duedateDate == tomorrowDate ) || 
             ( localISOTime > duedateDate )){
      var statusSta = ': Due Soon'
      if ((( localISOTime > duedateDate ) && ( status !== 'Completed' )) ||
         (( localISOTime == duedateDate ) && ( localISOTime2 > duedateTime ) && ( status !== 'Completed' ))) {
        var statusSta = ': Overdue';
      }
      var statLabel = 'label-warning';
    }
    else{
      var statLabel = 'label-info';
      var statusSta = ''
    }
 
    // Set the filter conditions based on the filter parameter
    if ( filter == 'showoverdue' ){
      var condition = ((( localISOTime > duedateDate ) && ( status !== 'Completed' )) || 
                      (( localISOTime == duedateDate ) && ( localISOTime2 > duedateTime ) && ( status !== 'Completed' )));
    } else if ( filter == 'showcompleted' ){
      var condition = tasks[i].status == 'Completed';
    } else if ( filter == 'dueToday' ){
      var condition = (duedateDate == localISOTime);
    } else if ( filter == 'dueTomorrow' ){
      var condition = duedateDate == tomorrowDate;
    } else if ( filter == 'dueSoon' ){
      var condition = ( duedateDate == localISOTime ) || ( duedateDate == tomorrowDate );
    } else {
      var condition = true;
    }

    if ( condition ){
      tasksList.innerHTML +=   '<div class="well">'+
                               '<h6>Task ID: ' + id + '</h6>'+
                               '<p><span class="label '+ statLabel +'">' + status + statusSta +'</span></p>'+
                               '<p><span class="glyphicon glyphicon-list-alt"></span> ' + desc + '</p>'+
                               '<p><span class="glyphicon glyphicon-time"></span> ' + duedate + '</p>'+
                               '<p><span class="glyphicon glyphicon-tasks"></span> ' + assignedTo + '</p>'+
                               '<a href="#" onclick="setStatusCompleted(\''+id+'\',\''+filter+'\')" class="btn btn-primary">Complete</a> '+
                               '<a href="#" onclick="deleteTask(\''+id+'\',\''+filter+'\')" class="btn btn-danger">Delete</a>'+
                               '</div>';
    }
  }
}
