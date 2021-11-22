const app = document.getElementById('app');

app.innerHTML += `
    <div class='todos'>
        <div class='todos-header'>
            <h3 class='todo-title'>Todo List</h3>
            <div>
                <p>You have <span class='todos-count'></span> to-do left</p>
                <button type='button' class='todos-clear' style='display:none;'>
                    Clear Completed
                </button>
            </div>
        </div>
        <form class='todos-form' name='todos'>
            <input type='text' name='todo' placeholder="What's next?">
        </form>
        <ul class='todos-list'></ul>
    </div>
`;

//state
let todos = JSON.parse(localStorage.getItem('todos')) || [];

//selectors
const root = document.querySelector('.todos');        // making the scope to be small doc=root
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const clear = root.querySelector('.todos-clear')
const form = document.forms.todos;
const input = form.elements.todo;


//functions

function saveToStorage(todos){
    localStorage.setItem('todos' , JSON.stringify(todos));
}
//------------------------------

function renderTodos(todos){
    let todoString = '';
    todos.forEach((todo,index) => {
        todoString += `
            <li data-id='${index}'${todo.complete?'class="todos-complete"':''}>
                <div>
                    <input type='checkbox' class='check' ${todo.complete ?'checked':''}>
                    <span class='toDone' style="word-wrap: break-word;">${todo.label}</span>
                </div>
                <button type='button' class='remove'><i class="fas fa-trash-alt fa-sm"></i></button>
            </li>
        `;
    });

    list.innerHTML = todoString;
    count.innerText = todos.filter(todo => !todo.complete).length;
    clear.style.display = todos.filter(todo => todo.complete).length?'block':'none';
}

//----------------------------------
function addTodo(event){
    event.preventDefault();
    const label = input.value.trim();          // trim() will delete access spaces
    const complete = false;
    todos = [                                 // we are creating a list with Objects inside it
        ...todos,
        {
            label,
            complete
        }
    ];
    renderTodos(todos);                     // Calling renderTodos()
    saveToStorage(todos);
    input.value = "";
}
//------------------------------------
function updateTodo(event){
    const id = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'),10);
    const complete = event.target.checked;
    todos = todos.map((todo , index)=> {
        if(index === id){
           return {
               ...todo,
               complete
           }; 
        }
        return todo;
    });
    renderTodos(todos);
    saveToStorage(todos);
}

//--------------------------------------

function editTodo(event){
    if(event.target.nodeName !== 'SPAN'){
        return
    }
    const id = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'),10);
    const todoLabel = todos[id].label;
    
    const input = document.createElement('input');
        input.setAttribute('type' , 'text');
    input.value = todoLabel;
    input.classList.add('inputcss');

    function handleEdit(event){
     
        event.stopPropagation();
        const label = this.value;
        if(this.value !== todoLabel){
            todos = todos.map((todo ,index) => {
                if(index === id){
                    return{
                        ...todo,
                        label,
                    };
                }
                return todo;
            });
            console.log(todos)
            renderTodos(todos);
            saveToStorage(todos);
        }
        //CleanUp
        event.target.style.display = 'none';
        this.removeEventListener('change', handleEdit);
        this.remove();
    }

    event.target.style.display = 'none';
    event.target.parentNode.append(input);
    input.addEventListener('change', handleEdit);
    input.focus();
}

//--------------------------------------

function deleteTodo(event){
    // console.log(event.target.parentNode.previousElementSibling.childNodes[3].innerText);
    if(event.target.nodeName.toLowerCase() !== 'i'){
        return;
    }
    const id = parseInt(event.target.parentNode.parentNode.getAttribute('data-id'),10);
    const label = event.target.parentNode.previousElementSibling.childNodes[3].innerText;
    console.log(label);
    if(window.confirm(`Delete "${label}" ?`)){
        todos = todos.filter((todo ,index) => index != id);         //Delete Items
        renderTodos(todos);
        saveToStorage(todos);
    }
}

//--------------------------------------

function clearCompleteTodos(){
    const count = todos.filter(todo => todo.complete).length
    if(count === 0){
        return;
    }
    if(window.confirm(`Delete ${count} Todos ?`)){
        todos = todos.filter(todo => !todo.complete)
        renderTodos(todos);
        saveToStorage(todos);
    }
}

// intializers
function init(){
    renderTodos(todos);
    // Add todo
    form.addEventListener('submit', addTodo);
    // update Todo
    list.addEventListener('change', updateTodo);      //delegating the event
    // Edit todo
    list.addEventListener('dblclick',editTodo);
    //Delete Todo
    list.addEventListener('click' , deleteTodo);      // deleting 
    //Complete All todos
    clear.addEventListener('click', clearCompleteTodos);
}

init()