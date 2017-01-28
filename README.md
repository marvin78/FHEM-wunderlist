# FHEM-wunderlist
Manage Tasklists with wunderlist and FHEM


<ul>
  A module to get a task list as readings from wunderlist. Tasks can be completed and deleted.
	<br /><br />
	As preparation to use this module, you need a wunderlist account and you have to register an app as developer. 
	You will need a CLIENT-ID and an ACCESS-TOKEN.
	<br /><br />
	Notes:<br />
	<ul>
		<li>JSON, Data::Dumper and MIME::Base64 have to be installed on the FHEM host.</li>
	</ul>
	<br /><br />
	<a name="wunderlist_Define"></a>
  <b>Define</b><br />
  <ul>
    <code>define &lt;name&gt; wunderlist &lt;CLIENT-ID&gt; &lt;LIST-ID&gt;</code><br />
    <br />
		<b>CLIENT-ID:</b> You can get this ID, if you register an app at wunderlist.<br />
		<b>LIST-ID:</b> This ID can bee taken from the URL of your specified list on the wunderlist web page.<br />
    <br /><br />
    Example:
    <ul>
      <code>define Einkaufsliste wunderlist bed11eer1355f66230b9 257528237</code><br />
    </ul>
  </ul><br />
	<br />
	<a name="wunderlist_Set"></a>
  <b>Set</b>
  <ul>
		<li><b>accessToken</b> - set the access token for your wunderlist app</li><br />
		<li><b>active</b> - set the device active (starts the timer for reading task-list periodically)</li><br />
		<li><b>inactive</b> - set the device inactive (deletes the timer, polling is off)</li><br />
		<li><b>newAccessToken</b> - replace the saved token with a new one.</li><br />
		<li><b>getTasks</b> - get the task list immediately, reset timer.</li><br />
		<li><b>addTask</b> - create a new task. Needs title as parameter.<br /><br />
		<code>set &lt;DEVICE&gt; addTask &lt;TASK_TITLE&gt;[:&lt;DUE_DATE&gt;]</code><br ><br />
		Additional Parameters are:<br />
		<ul>
		 <li>dueDate (due_date)=&lt;DUE_DATE&gt; (formatted as an ISO8601 date)</li>
		 <li>assignee_id=&lt;ASSIGNEE_ID&gt; (integer)</li>
		 <li>recurrence_type=&lt;RECURRENCE_TYPE&gt; (string)</li>
		 <li>recurrence_count=&lt;RECURRENCE_COUNT&gt; (integer - is set to 1 if recurrence_type is given and 
		 recurrence_count is not)</li>
		 <li>starred="true"|"false" (string)</li>
		</ul><br />
		Example: <code>set &lt;DEVICE&gt; addTask &lt;TASK_TITLE&gt; dueDate=2017-01-15 starred=1 
		recurrence_type='week'</code><br /><br />
		<li><b>updateTask</b> - update a task. Needs Task-ID or wunderlist-Task-ID as parameter<br /><br />
		Possible Parameters are:<br />
		<ul>
		 <li>dueDate (due_date)=&lt;DUE_DATE&gt; (formatted as an ISO8601 date)</li>
		 <li>assignee_id=&lt;ASSIGNEE_ID&gt; (integer)</li>
		 <li>recurrence_type=&lt;RECURRENCE_TYPE&gt; (string)</li>
		 <li>recurrence_count=&lt;RECURRENCE_COUNT&gt; (integer - is set to 1 if recurrence_type is given 
		 and recurrence_count is not)</li>
		 <li>starred="true"|"false" (string)</li>
		 <li>completed="true"|"false" (string)</li>
		 <li>title=&lt;TITLE&gt; (string)</li>
		 <li>remove=&lt;TYPE&gt; (comma seperated list of attributes which should be removed from the task)
		</ul><br />
		Examples: <br /><br />
		<code>set &lt;DEVICE&gt; updateTask ID:12345678 dueDate=2017-01-15 starred=1 recurrence_type='week'</code><br />
		<code>set &lt;DEVICE&gt; updateTask 1 dueDate=2017-01-15 starred=1 recurrence_type='week'</code><br />
		<code>set &lt;DEVICE&gt; updateTask 2 remove=due_date,starred</code><br />
		
		<br /><br />
		<li><b>completeTask</b> - completes a task. Needs number of task (reading 'Task_NUMBER') or the 
		wunderlist-Task-ID (ID:<ID>) as parameter</li><br />
		<code>set &lt;DEVICE&gt; completeTask &lt;TASK-ID&gt;</code> - completes a task by number<br >
		<code>set &lt;DEVICE&gt; completeTask ID:&lt;wunderlist-TASK-ID&gt;</code> - completes a task by wunderlist-Task-ID<br ><br />
		<li><b>deleteTask</b> - deletes a task. Needs number of task (reading 'Task_NUMBER') or the wunderlist-Task-ID (ID:<ID>) as parameter</li><br />
		<code>set &lt;DEVICE&gt; deleteTask &lt;TASK-ID&gt;</code> - deletes a task by number<br >
		<code>set &lt;DEVICE&gt; deleteTask ID:&lt;wunderlist-TASK-ID&gt;</code> - deletes a task by wunderlist-Task-ID<br ><br />
		<li><b>sortTasks</b> - sort Tasks alphabetically<br /><br />
		<li><b>clearList</b> - <b><u>deletes</u></b> all Tasks from the list (only FHEM listed Tasks can be deleted)
	</ul>
	<br />
	<a name="wunderlist_Attributes"></a>
  <b>Attributes</b><br />
  <ul>
		<li><a href="#readingFnAttributes">readingFnAttributes</a></li><br />
		<li><a href="#do_not_notify">do_not_notify</a></li><br />
    <li><a name="#disable">disable</a></li><br />
		<li>pollInterval</li>
		get the list every pollInterval seconds. Default is 1800. Smallest possible value is 600.<br /><br />
		<li>sortTasks</li>
		<ul>
		<li>0: don't sort the tasks</li>
		<li>1: sorts Tasks alphabetically after every update</li>
		<li>2: sorts Tasks in wunderlist order</li>
		</ul>
		<br /><br />
		<li>getCompleted</li>
		get's completed Tasks from list additionally. 
	</ul><br />
	
	<a name="wunderlist_Readings"></a>
  <b>Readings</b><br />
  <ul>
		<li>Task_XXX<br />
      the tasks are listet as Task_000, Task_001 [...].</li><br />
		<li>Task_XXX_dueDate<br />
      if a task has a due date, this reading should be filled with the date.</li><br />
		<li>Task_XXX_ID<br />
      the wunderlist ID of Task_X.</li><br />
		<li>Task_XXX_starred<br />
      if a task is starred, this reading should be filled with the 1.</li><br />
		<li>Task_XXX_assigneeId<br />
      if a task has an assignee, this reading should be filled with the the corresponding ID.</li><br />
		<li>Task_XXX_recurrenceType<br />
      if a task has recurrence_type as attribute, this reading should be filled with the type.</li><br />
		<li>Task_XXX_recurrenceCount<br />
      if a task has recurrence_type as attribute, this reading should be filled with the count.</li><br />
		<li>Task_XXX_completedAt<br />
      only for completed Tasks (attribute getCompleted).</li><br />
		<li>Task_XXX_completedById<br />
      only for completed Tasks (attribute getCompleted).</li><br />
		<li>User_XXX<br />
      the lists users are listet as User_000, User_001 [...].</li><br />
		<li>User_XXX_ID<br />
      the users wunderlist ID.</li><br />
		<li>listText<br />
      a comma seperated list of tasks in the specified list. This may be used for TTS, Messages etc.</li><br />
		<li>count<br />
      number of Tasks in list.</li><br />
		<li>error<br />
      current error. Default is none.</li><br />
		<li>lastCompletedTask<br />
      title of the last completed task.</li><br />
		<li>lastCreatedTask<br />
      title of the last created task.</li><br />
		<li>lastDeletedTask<br />
      title of the last deleted task.</li><br />
		<li>lastError<br />
      last Error.</li><br />
		<li>state<br />
			state of the wunderlist-Device</li>
  </ul><br />
</ul>
