"use strict"
let todoList = [];
const jbinKey = "$2a$10$r33GJqovpTVcoFA64zGBO.MNuJyE08sEKINVCAUXn55xvoa8olDBC"
const jbinApi = "https://api.jsonbin.io/v3/b/671665eaad19ca34f8bc34d9"
let initList = async function() {
    try {
        let response = await fetch(jbinApi, {
            method: 'GET',
            headers: {
                'X-Master-Key': jbinKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        todoList = data.record;
    } catch (error) {
        console.error("Błąd podczas inicjalizacji listy z JSONbin:", error);
    }
}

initList();

async function categorizeTask(title, description) {
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    const apiKey = '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';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const jsonSchema = JSON.stringify({
        type: "object",
        properties: {
            title: { title: "Name", type: "string" },
            description: { title: "Opis", type: "string" },
            category: { title: "Kategoria", type: "string", enum: ["uczelnia", "prywatne", "inne"] }
        }
    });

    const body = {
        messages: [
            {
                role: "system",
                content: `You are a categorization model that categorizes tasks into one of three categories: 'uczelnia', 'prywatne', or 'inne'. The input must conform to the following json schema: ${jsonSchema}. The output should be in json format.`
            },
            {
                role: "user",
                content: `Categorize the following task: Title: ${title}, Description: ${description}.  Please respond with the result in JSON format. Ensure your output contains valid JSON.`
            }
        ],
        model: "llama3-8b-8192",
        temperature: 0,
        response_format: { type: "json_object" }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });

    if (response.ok) {
        const data = await response.json();
        
        // Parsujemy zawartość jako JSON
        const categoryResponse = JSON.parse(data.choices[0].message.content); 
        console.log(categoryResponse);
        // Zwracamy kategorię
        return categoryResponse.category; 
    } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
    }
}


let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");

    // Usuń wszystkie istniejące elementy
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    // Tworzymy tabelę
    let table = document.createElement('table');
    table.className = "table table-bordered table-hover";
    let thead = document.createElement('thead');
    thead.className = "table-primary";
    let tbody = document.createElement('tbody');

    // Tworzymy nagłówki kolumn
    let headerRow = document.createElement('tr');
    headerRow.className = "text-center";
    let headers = ['Title', 'Description', 'Category', 'Place', 'Due Date', 'Actions'];
    headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Pobranie wartości zakresu dat
    let startDate = document.getElementById('inputStartDate').value;
    let endDate = document.getElementById('inputEndDate').value;

    // Pobranie wartości z pola wyszukiwania
    let filterInput = document.getElementById("inputSearch").value.toLowerCase();

    // Dodajemy filtrowane elementy z todoList
    todoList.forEach((todo, index) => {
        let taskDate = new Date(todo.dueDate);

        // Sprawdzamy, czy zadanie mieści się w zakresie dat
        let isInDateRange = true;
        if (startDate) {
            isInDateRange = (taskDate >= new Date(startDate));
        }
        if (endDate) {
            let endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);
            isInDateRange = (taskDate <= endDateTime);
        }

        // Filtrowanie po polu wyszukiwania i po dacie
        if (
            isInDateRange && (
                filterInput === "" ||
                todo.title.toLowerCase().includes(filterInput) ||
                todo.description.toLowerCase().includes(filterInput) ||
                todo.place.toLowerCase().includes(filterInput)
            )
        ) {
            let row = document.createElement('tr');
            row.className = "text-center";

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
            deleteButton.className = "btn btn-danger"
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

let addTodo = async function() {
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

      const category = await categorizeTask(newTitle, newDescription);

    //create new item
      let newTodo = {
          title: newTitle,
          description: newDescription,
          place: newPlace,
          category: category,
          dueDate: newDate.toLocaleDateString()
      };
    //add item to the list
      todoList.push(newTodo);
      updateJSONbin();
  }

let updateJSONbin = async function() {
    try {
        let response = await fetch(jbinApi, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': jbinKey
            },
            body: JSON.stringify(todoList)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error("Błąd podczas aktualizacji JSONbin:", error);
    }
}

