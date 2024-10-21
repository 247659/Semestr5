"use strict"
let todoList = []; //declares a new array for Your todo list
let initList = function() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            todoList = JSON.parse(req.responseText).record;
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/671665eaad19ca34f8bc34d9/latest ", true);
    req.setRequestHeader("X-Master-Key", "$2a$10$r33GJqovpTVcoFA64zGBO.MNuJyE08sEKINVCAUXn55xvoa8olDBC");
    req.send();
}

initList();

let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");

    // Usuń wszystkie istniejące elementy
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    // Tworzymy tabelę
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    // Tworzymy nagłówki kolumn
    let headerRow = document.createElement('tr');
    let headers = ['Title', 'Description', 'Category' , 'Place', 'Due Date', 'Actions'];
    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Dodajemy filtrowane elementy z todoList
    let filterInput = document.getElementById("inputSearch").value.toLowerCase();

    todoList.forEach((todo, index) => {
        if (
            filterInput === "" ||
            todo.title.toLowerCase().includes(filterInput) ||
            todo.description.toLowerCase().includes(filterInput) ||
            todo.place.toLowerCase().includes(filterInput)
        ) {
            let row = document.createElement('tr');

            // Tworzymy komórki dla każdej kolumny
            let titleCell = document.createElement('td');
            titleCell.textContent = todo.title;
            row.appendChild(titleCell);

            let descCell = document.createElement('td');
            descCell.textContent = todo.description;
            row.appendChild(descCell);

            let catCell = document.createElement('td');
            catCell.textContent = todo.category;
            row.appendChild(catCell);

            let placeCell = document.createElement('td');
            placeCell.textContent = todo.place;
            row.appendChild(placeCell);

            let dueDateCell = document.createElement('td');
            dueDateCell.textContent = todo.dueDate;
            row.appendChild(dueDateCell);

            // Tworzymy przycisk "Usuń" i dodajemy go do wiersza
            let actionCell = document.createElement('td');
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.addEventListener('click', function() {
                deleteTodo(index);  // Usunięcie zadania
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            // Dodajemy wiersz do tabeli
            tbody.appendChild(row);
        }
    });

    // Dodajemy body do tabeli i tabelę do div'a
    table.appendChild(tbody);
    todoListDiv.appendChild(table);
};

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
    //get the elements in the form
      let inputTitle = document.getElementById("inputTitle");
      let inputDescription = document.getElementById("inputDescription");
      let inputPlace = document.getElementById("inputPlace");
      let inputDate = document.getElementById("inputDate");
    //get the values from the form
      let newTitle = inputTitle.value;
      let newDescription = inputDescription.value;
      let newPlace = inputPlace.value;
      let newDate = new Date(inputDate.value);
    //create new item
      let newTodo = {
          title: newTitle,
          description: newDescription,
          place: newPlace,
          category: '',
          dueDate: newDate
      };
    //add item to the list
      todoList.push(newTodo);
      updateJSONbin();
  }

  let updateJSONbin = function() {
      let req = new XMLHttpRequest();

      req.onreadystatechange = () => {
          if (req.readyState == XMLHttpRequest.DONE) {
              console.log(req.responseText);
          }
      };

      req.open("PUT", "https://api.jsonbin.io/v3/b/671665eaad19ca34f8bc34d9", true);
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("X-Master-Key", "$2a$10$r33GJqovpTVcoFA64zGBO.MNuJyE08sEKINVCAUXn55xvoa8olDBC");

      req.send(JSON.stringify(todoList));
    }