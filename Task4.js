document.addEventListener('DOMContentLoaded', () => {
  const InputSection = document.getElementById('InputSection');
  const Input = document.getElementById('Input');
  const submit = document.getElementById('submit');
  const addbutton = document.getElementById('addbutton');
  const error = document.getElementById('error');
  const List = document.getElementById('List');
  const Multidelete = document.getElementById('MultiDelete');
  let editMode = false;
  let currentEdit = null;
  let previousText = '';

  function EditTask(taskItem) {
    const completedButton = taskItem.querySelector('.update');
    const deleteButton = taskItem.querySelector('.singledelete');
    completedButton.disabled = true;
    deleteButton.disabled = true;
  }

  function CompletedTasks() {
    const editButtons = document.querySelectorAll('.edit');
    const updateButtons = document.querySelectorAll('.update');
    
    editButtons.forEach(button => {
      const taskItem = button.parentNode;
      if (taskItem.classList.contains('completed-task')) {
        button.disabled = true;
      }
    });

    updateButtons.forEach(button => {
      const taskItem = button.parentNode;
      if (taskItem.classList.contains('completed-task')) {
        button.disabled = true;
      }
    });
  }

  function enableOther() {
    const editButtons = document.querySelectorAll('.edit');
    const updateButtons = document.querySelectorAll('.update');
    const deleteButtons = document.querySelectorAll('.singledelete');
    
    editButtons.forEach(button => {
      const taskItem = button.parentNode;
      if (!taskItem.classList.contains('completed-task')) {
        button.disabled = false;
      }
    });

    updateButtons.forEach(button => {
      const taskItem = button.parentNode;
      if (!taskItem.classList.contains('completed-task')) {
        button.disabled = false;
      }
    });

    deleteButtons.forEach(button => {
      button.disabled = false;
    });
  }

  function enableAll() {
    addbutton.disabled = false;
    Multidelete.disabled = false;
    enableOther();
  }

  addbutton.addEventListener('click', () => {
    if (editMode) {
      cancelEdit();
    }
    InputSection.style.display = 'block';
    submit.textContent = 'Submit';
    Input.value = '';
    error.style.display = 'none';
    enableAll();
  });

  submit.addEventListener('click', () => {
    const taskText = Input.value.trim();

    if (taskText === '') {
      error.style.display = 'block';
    } else {
      error.style.display = 'none';

      if (editMode) {
        if (currentEdit) {
          currentEdit.querySelector('span').textContent = taskText;
          currentEdit.querySelector('.update').disabled = false;
          currentEdit.querySelector('.singledelete').disabled = false;
          currentEdit = null;
        }
        editMode = false;
        submit.textContent = 'Submit';
        enableAll();
      } else {
        const newTask = document.createElement('li');
        newTask.innerHTML = `
          <span>${taskText}</span>
          <input type="checkbox" class="checkbox">
          <button type="button" class="toggleButton edit">Edit</button>
          <button type="button" class="toggleButton update">Completed</button>
          <button type="button" class="singledelete">Delete</button>
        `;
        List.appendChild(newTask);
      }

      Input.value = '';
      InputSection.style.display = 'none';
    }
  });

  List.addEventListener('click', (event) => {
    const target = event.target;
    const taskItem = target.parentNode;

    if (target.classList.contains('edit')) {
      if (editMode && currentEdit) {
        currentEdit.querySelector('span').textContent = previousText;
        currentEdit.querySelector('.update').disabled = false;
        currentEdit.querySelector('.singledelete').disabled = false;
      }

      if (editMode) {
        cancelEdit();
      }

      InputSection.style.display = 'block';
      previousText = taskItem.querySelector('span').textContent;
      Input.value = previousText;
      currentEdit = taskItem;
      submit.textContent = 'Update';
      editMode = true;

      addbutton.disabled = true; 
      Multidelete.disabled = true; 
      EditTask(taskItem);

      CompletedTasks();
      target.disabled = false;
    }

    if (target.classList.contains('update')) {
      const taskSpan = taskItem.querySelector('span');
      taskSpan.style.textDecoration = 'line-through';
      taskItem.querySelector('.edit').disabled = true;
      target.disabled = true;
      taskItem.classList.add('completed-task');
      taskItem.querySelector('.singledelete').disabled = false; 
    }

    if (target.classList.contains('singledelete')) {
      taskItem.remove();
      if (editMode && taskItem === currentEdit) {
        cancelEdit(); 
      }
    }
  });

  function cancelEdit() {
    if (currentEdit) {
      currentEdit.querySelector('span').textContent = previousText;
      currentEdit.querySelector('.update').disabled = false;
      currentEdit.querySelector('.singledelete').disabled = false;
    }
    InputSection.style.display = 'none';
    submit.textContent = 'Submit';
    Input.value = '';
    currentEdit = null;
    editMode = false;
    enableAll();
  }

  Multidelete.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.checkbox:checked');
    checkboxes.forEach(checkbox => {
      const taskItem = checkbox.parentNode;
      taskItem.remove();
    });
  });
});
