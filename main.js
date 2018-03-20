/***********************************************************************************

	FILE NAME:	main.js
	
	PURPOSE:	Manage to-do web application tool

	APPLICATION:	To-do Management Tool

	CONTENTS:	saveTask()
                        setStatusCompleted()
			deleteTask()
                        fetchTask()
			
 **********************************************************************************/

document.getElementById('taskInputForm').addEventListener('submit', saveTask);
document.getElementById("clickMe").onclick = fetchTasks;

/***********************************************************************************
 
	FUNCTION NAME:	saveTask(e)
                  
	PURPOSE:        Loads the task details provided by user to local storage
 
	ARGUMENTS:	e
 
	RETURN:		none

 **********************************************************************************/
function saveTask(e) {
  var taskDesc = document.getElementById('taskDescInput').value;
  var taskDuedate = document.getElementById('taskDuedateInput').value;
  var taskAssignedTo = document.getElementById('taskAssignedToInput').value;
  var taskId = chance.guid();
  var taskStatus = 'Open';

  var task = {
    id: taskId,
    description: taskDesc,
    duedate: taskDuedate,
    assignedTo: taskAssignedTo,
    status: taskStatus
  }

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

  document.getElementById('taskInputForm').reset();
  e.preventDefault();
}


/***********************************************************************************
 
	FUNCTION NAME:	setStatusCompleted(id, filter)
                  
	PURPOSE:        Sets the status of the task to complete when Complete button
                        is clicked by user
 
	ARGUMENTS:	id: global unique identifier for the task
			filter: defines condition to show filtered tasks on page
 
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
                  
	PURPOSE:        Fetches the tasks to display on page
 
	ARGUMENTS:	filter: defines condition to show filtered tasks on page
 
	RETURN:		none

 **********************************************************************************/
function fetchTasks(filter) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  var tasksListe = document.getElementById('tasksList');
  tasksList.innerHTML = '';

  for (var i = 0; i < tasks.length; i++) {
    var id = tasks[i].id;
    var desc = tasks[i].description;
    var duedate = tasks[i].duedate;
    var duedate2 = duedate.split('T')[0];
    var duedateSplit = duedate.split('T')[0];
    var curDateSliced = new Date().toISOString().slice(0,10);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tomorrowSliced = tomorrow.toISOString().slice(0,10);
    var curDate = new Date().toISOString().slice(0,10);
    var assignedTo = tasks[i].assignedTo;
    var status = tasks[i].status;

    if ( status == 'Completed' ){
      var statButton = 'btn-success';
      var statLabel = 'label-success';
    }
    else if (( duedateSplit == curDateSliced ) || ( duedateSplit == tomorrowSliced) || (( curDateSliced > duedateSplit ) && ( tasks[i].status !== 'Completed' ))){
      var statButton = 'btn-warning';
      var statLabel = 'label-warning';
    }
    else{
      var statButton = 'btn-info';
      var statLabel = 'label-info';
    }
 
    if ( filter == 'showoverdue' ){
      var condition = ( curDateSliced > duedateSplit ) && ( tasks[i].status !== 'Completed' );
    } else if ( filter == 'showcompleted' ){
      var condition = tasks[i].status == 'Completed';
    } else if ( filter == 'dueToday' ){
      var condition = duedateSplit == curDateSliced;
    } else if ( filter == 'dueTomorrow' ){
      var condition = duedateSplit == tomorrowSliced;
    } else if ( filter == 'dueSoon' ){
      var condition = ( duedateSplit == curDateSliced ) || ( duedateSplit == tomorrowSliced );
    } else {
      var condition = true;
    }

    if ( condition ){
      tasksList.innerHTML +=   '<div class="well">'+
                               '<h6>Task ID: ' + id + '</h6>'+
                               '<p><span class="label '+ statLabel +'">' + status + '</span></p>'+
                               '<p><span class="glyphicon glyphicon-list-alt"></span> ' + desc + '</p>'+
                               '<p><span class="glyphicon glyphicon-time"></span> ' + duedate + '</p>'+
                               '<p><span class="glyphicon glyphicon-tasks"></span> ' + assignedTo + '</p>'+
                               '<a href="#" onclick="setStatusCompleted(\''+id+'\',\''+filter+'\')" class="btn '+ statButton +'">Complete</a> '+
                               '<a href="#" onclick="deleteTask(\''+id+'\',\''+filter+'\')" class="btn btn-danger">Delete</a>'+
                               '</div>';
    }
  }
}
