
"use strict"
let todoList = []; //declares a new array for Your todo list
let initList = function() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            const response = JSON.parse(req.responseText); // Sparsuj odpowiedź jako JSON
            todoList = response.record; // Przypisz odpowiedź do todoList
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/671665eaad19ca34f8bc34d9/latest ", true);
    req.setRequestHeader("X-Master-Key", "$2a$10$r33GJqovpTVcoFA64zGBO.MNuJyE08sEKINVCAUXn55xvoa8olDBC");
    req.send();
}

initList();

let updateTodoList = function() {
    let todoListDiv =
    document.getElementById("todoListView");

    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }
    console.log(todoList)

    //add all elements
    for (let todo in todoList) {
        let newElement = document.createElement("div");
        let newContent = document.createTextNode(
            todoList[todo].title + " " + todoList[todo].description);
        newElement.appendChild(newContent);
        todoListDiv.appendChild(newElement);
        let newDeleteButton = document.createElement("input");
        newDeleteButton.type = "button";
        newDeleteButton.value = "x";
        newDeleteButton.addEventListener("click",
            function() {
                deleteTodo(todo);
            });
            newElement.appendChild(newDeleteButton);
    }
    //add all elements
    let filterInput = document.getElementById("inputSearch");   
    for (let todo in todoList) {
    if (
        (filterInput.value == "") ||
        (todoList[todo].title.includes(filterInput.value)) ||
        (todoList[todo].description.includes(filterInput.value))
    ) {
        let newElement = document.createElement("p");
        let newContent = document.createTextNode(todoList[todo].title + " " +
                                                todoList[todo].description);
        newElement.appendChild(newContent);
        todoListDiv.appendChild(newElement);
    }
    }


}

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    //window.localStorage.removeItem("todos", JSON.stringify(todoList));
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
      //window.localStorage.setItem("todos", JSON.stringify(todoList));
      updateJSONbin();
  }

  let updateJSONbin = function() {
    // ciało funkcji na podstawie https://jsonbin.io/api-reference/bins/update

    // UWAGA: ta funkcja zastepuje całą zawartość bina
    }