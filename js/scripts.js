// ELEMENT SELECTIONS
const btnCancel = document.querySelector("#cancel-edit-btn");
const editForm = document.querySelector("#edit-form");

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editInput = document.querySelector("#edit-input");

const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// FUNCTIONS
const saveTodo = (text, done = 0, save = 1) => {

    // div creation Todo List
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text
    todo.appendChild(todoTitle);

    // creating finish, edit and remove buttons
    const doneBtn = document.createElement("button")
    doneBtn.classList.add(".finish-todo");
    doneBtn.innerHTML = "<i class='fa-solid fa-check'></i>"
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button")
    editBtn.classList.add(".edit-todo");
    editBtn.innerHTML = " <i class='fa-solid fa-pen'></i>"
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add(".remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(removeBtn);

    // Utilizando dados de LocalStorage

    if(done) {
        todo.classList.add("done");
    }
    if(save) {
        saveTodoLocaleStorage({text, done});
    }

    // adding the Todo element to the TodoList through the DOM
    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();

}

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;

            updateTodoslocalStorage( oldInputValue,text);
        }
    });
};

const getSearchTodos = (search) => {

    const todos = document.querySelectorAll(".todo");

    todos.forEach(todo => {
        let todoTitle = todo.querySelector("h3").innerText
            .toLowerCase();
        const normalizeSearch = search.toLowerCase();

        todo.style.display = "flex"

        if (!todoTitle.includes(normalizeSearch)) {
            todo.style.display = "none"
        }
    });
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => todo.style.display = "flex")
            break;

        case "done":
            todos.forEach((todo) => todo.classList.contains("done")
                ? (todo.style.display = "flex")
                : (todo.style.display = "none"));
            break;

        case "todo":
            todos.forEach((todo) =>
             !todo.classList.contains("done")
                ? (todo.style.display = "flex")
                : (todo.style.display = "none"));
            break;
        default:
            break;
    }
}




// EVENTS

// evento para salvar o texto
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
})

// evento para utitlizar os botões de concluir, editar e remover
document.addEventListener("click", (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    };

    if (targetEl.classList.contains(".finish-todo")) {
        parentEl.classList.toggle("done");

        updateTodosStatuslocalStorage(todoTitle);
    }

    if (targetEl.classList.contains(".edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }

    if (targetEl.classList.contains(".remove-todo")) {
        parentEl.remove();

        removeLocaleStorage(todoTitle);
    }
})

// evento para cancelar a edição 
btnCancel.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
})

// evento para concluir a edição 
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editFormValue = editInput.value;

    if (editFormValue) {
        updateTodo(editFormValue);
    }

    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    e.preventDefault();

    const search = e.target.value;

    getSearchTodos(search);
})

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
})

filterBtn.addEventListener("change", (e) => {
    e.preventDefault();

    const filterValue = e.target.value;

    filterTodos(filterValue);
})



// LOCAL STORAGE





const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach(todo => {
        saveTodo(todo.text, todo.done, 0)
    });
}
const saveTodoLocaleStorage = (todo) => {

   const todos = getTodosLocalStorage();

   todos.push(todo);

   localStorage.setItem("todos" , JSON.stringify(todos))
}

const removeLocaleStorage =  (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText )

    localStorage.setItem("todos" , JSON.stringify(filteredTodos))
}

const updateTodosStatuslocalStorage = (todoText) => {

    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ?
     todo.done = !todo.done : null )

    localStorage.setItem("todos" , JSON.stringify(todos))
}
const updateTodoslocalStorage = (todoOldText, todoNewText) => {

    const todos = getTodosLocalStorage();

    todos.map((todo) =>
     todo.text === todoOldText ?
     (todo.text = todoNewText ): null )

    localStorage.setItem("todos" , JSON.stringify(todos))
}