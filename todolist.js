//User Action Logic Goes Here

const userCreate = (function(){
    const createTodo = (title, description, dueDate) => {
        return { toDoTitles: [title], descriptions: [description], dueDates: [dueDate], noteList: ["noteObj"], completed: [false], id: [0] };
    };
    const createProject = (title,...args) => {
        let projectObj = {
            projectTitle: title,
            projectSelect: true,
            toDosCount: 1,
            toDoList: createTodo(...args)
        }
        for(let obj in projectList){
            projectList[obj].projectSelect = false;
        }
        return projectObj;
    }
    const removeProject = (name) => {
        index = projectList.findIndex(obj => obj.projectTitle === name);
        console.log(`Deleted ${projectList[index].projectTitle}`);
        projectList.splice(index,1);
    }
    const changeProject = (name) => {
        index = projectList.findIndex(obj => obj.projectTitle === name);
        for(let obj in projectList){
            projectList[obj].projectSelect = false;
        }
        projectList[index].projectSelect = true;
    }
    const defaultProject = {
        projectTitle: "Untitled Project",
        projectSelect: true,
        projectDescription: "Default Project",
        projectDueDate: 9/14/2021,
        toDosCount: 1,
        toDoList: {
            toDoTitles: ["Gardening"],
            descriptions: ["Water the plants"],
            dueDates: ["7/21/2021"],
            completed: [false],
            noteList: [],
            id: [0]
        }
    }
    const projectList = [defaultProject];
    const currentProject = projectList[projectList.findIndex(obj => obj.projectSelect === true)];
    return { createProject, removeProject, projectList, currentProject, changeProject };
})();

////////////////////////////////////////////////////////////////

//DOM Logic Goes Here

const displayController = (function(){
    
    //User Nav Link Action Listener and Menu Toggle
    const links = document.querySelectorAll(".menu-link");
    let menuOpen = false;
    links.forEach(link => link.addEventListener('click',function(){
        if(link.innerText === "New Project"){
            navToggle("Create New Project", "Create New Task", "project");
        } else if(link.innerText === "Add Todo"){
            navToggle("Create New Task", "Create New Project", "todo");
        } 
    }))

    const navToggle = (formTitle, otherTitle, type) => {
        formNav = document.getElementById('form-nav');
        if(menuOpen){
            currentMenuTitle = document.getElementById("addTodoTitle");
            if(currentMenuTitle === null){
                navForm(formTitle, type);
                return;
            } else if(currentMenuTitle.innerText === otherTitle){
                formNav.innerHTML = '';
                navForm(formTitle, type);
            } else {
                formNav.innerHTML = '';
                menuOpen = !menuOpen;
            }
        } else if(!menuOpen){
            navForm(formTitle, type);
            menuOpen = !menuOpen;
        }
    }

    const selectProject = () => {
        myDropdown = document.getElementById("myDropdown");
        myDropdown.innerHTML = "";
        for(let i = 0; i < userCreate.projectList.length; i++){
            anchor = document.createElement("a");
            anchor.setAttribute("href","#");
            anchor.innerText = userCreate.projectList[i].projectTitle;
            myDropdown.appendChild(anchor);
        }
        document.getElementById("myDropdown").classList.toggle("show");
        linkList = document.querySelectorAll("a");
        linkList.forEach(link => {
            link.addEventListener('click',function(){
                formNav = document.getElementById("form-nav");
                formNav.innerHTML = "";
                userCreate.changeProject(link.innerText);
                titleSection = document.getElementById("title-section");
                index = userCreate.projectList.findIndex(obj => obj.projectTitle === link.innerText);
                userCreate.currentProject = userCreate.projectList[index];
                totalTasks = userCreate.projectList[index].toDoList.toDoTitles.length;
                tasksCompleted = userCreate.projectList[index].toDoList.completed.filter(Boolean).length;
                percentCompleted = `${Math.floor(tasksCompleted/totalTasks * 100)}`;
                if(isNaN(percentCompleted)){
                    percentNotified = `There are no current tasks`
                } else {
                    percentNotified = `You have completed ${percentCompleted}% of your tasks`
                }
                titleSection.innerHTML = "";
                titleSection.innerHTML = `<div id = "title-section">
                <p id ="project-name">${link.innerText}</p>
                <p class ="subtitle">Total Tasks: ${totalTasks}</p>
                <p class ="subtitle">Tasks Completed: ${tasksCompleted}</p>
                <p class ="subtitle">${percentNotified}</p>
                <button id = "deleteButton" onclick = "displayController.deleteProject()">Delete Project</button>
            </div>`
                toDoBody = document.getElementById('todo-body');
                toDoBody.innerHTML = "";
                for(let i = 0; i < totalTasks; i++){
                    appendTodo(userCreate.projectList[index].toDoList.id[i], userCreate.projectList[index].toDoList.toDoTitles[i], userCreate.projectList[index].toDoList.descriptions[i], userCreate.projectList[index].toDoList.dueDates[i], userCreate.projectList[index].toDoList.completed[i]);
                }
            })
        })
    }
    
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }

    //Append New Project
    const appendProject = (dataArr) => {
        const projectTitle = dataArr[0];
        const projectInfo = [dataArr[1],dataArr[2],dataArr[3]];
        const newProject = userCreate.createProject(projectTitle,...projectInfo);
        userCreate.projectList.push(newProject);
        userCreate.currentProject = userCreate.projectList[userCreate.projectList.findIndex(obj => obj.projectSelect === true)];
        titleSection = document.getElementById("title-section");
        titleSection.innerHTML = "";
        titleSection.innerHTML = `<div id = "title-section">
        <p id ="project-name">${dataArr[0]}</p>
        <p class ="subtitle">Total Tasks: 1</p>
        <p class ="subtitle">Tasks Completed: 0</p>
        <p class ="subtitle">You have completed 0% of your tasks</p>
        <button id = "deleteButton" onclick = "displayController.deleteProject()">Delete Project</button>
    </div>`
        toDoBody = document.getElementById("todo-body");
        toDoBody.innerHTML = "";
        toDoBody.innerHTML = `<div id = "todo-template0" class = "todo-template">
        <p class = "todo-title">${dataArr[1]}</p>
        <p class = "todo-items"><input type="checkbox" id="priority0" name="priority0" value="priority0" class="checkbox" onclick="displayController.toggleBox(0)"></p>
        <!-- <p class = "numeral">1</p> -->
        <p class = "todo-items">${dataArr[2]}</p>
        <p class = "todo-items">${dataArr[3]}</p>
        <p class = "todo-items">Notes</p>
        <button onclick="displayController.deleteTodo(0)">Delete</button>
    </div>`
    }
    
    const deleteProject = () => {
        console.log("deleting project");
        userCreate.removeProject(userCreate.currentProject.projectTitle);
        // userCreate.currentProject = userCreate.projectList[0];
        titleSection = document.getElementById("title-section");
        titleSection.innerHTML = "";
        toDoBody = document.getElementById("todo-body");
        titlePara = document.createElement("p");
        titlePara.setAttribute("id","noProjects");
        titleSection.appendChild(titlePara);
        toDoBody.innerHTML = "";
        if(userCreate.projectList.length === 0){
            console.log("There are no projects remaining.");
            titlePara.innerText = "There are no projects remaining. Please click on New Project to create a new project.";
        } else {
            titlePara.innerText = `${userCreate.currentProject.projectTitle} was removed. Please select another project :)`;
        }
    }

   const inventoryUpdate = () => {
        subtitles = document.querySelectorAll(".subtitle");
        taskCount = document.querySelectorAll(".checkbox").length;
        tasksComplete = userCreate.currentProject["toDoList"]["completed"].filter(Boolean).length;
        percentComplete = Math.floor(tasksComplete/taskCount * 100);
        subtitles[0].innerText = `Total Tasks: ${taskCount}`;
        subtitles[1].innerText = `Tasks Completed: ${tasksComplete}`;
        if(isNaN(percentComplete)){
            subtitles[2].innerText = `There are no current tasks`
        } else {
            subtitles[2].innerText = `You have completed ${percentComplete}% of your tasks`
        }
    }

    const toggleBox = (id) => {
        index = userCreate.currentProject["toDoList"]["id"].indexOf(id);
        thisBox = document.getElementById(`priority${id}`);
        toDoTitle = thisBox.parentElement.parentElement.firstElementChild;
        if(!userCreate.currentProject["toDoList"]["completed"][index]){
            toDoTitle.style = "text-decoration: line-through";
        } else{
            toDoTitle.style = "text-decoration: none";
        }
        userCreate.currentProject["toDoList"]["completed"][index] = !userCreate.currentProject["toDoList"]["completed"][index];
        inventoryUpdate();
    }

    const deleteTodo = (id) => {
        index = userCreate.currentProject["toDoList"]["id"].indexOf(id);
        toDoItem = document.getElementById(`todo-template${id}`);
        toDoItem.remove();
        for(let entries in userCreate.currentProject.toDoList){
            userCreate.currentProject.toDoList[entries].splice(index, 1);
        }
        inventoryUpdate();
    }

    const navForm = (navtitle,type) => {
        dataArr = [];
        formNav = document.getElementById("form-nav");
        title = document.createElement("p");
        title.innerText = navtitle;
        title.setAttribute('id','addTodoTitle');
        formDiv = document.createElement("div");
        formDiv.setAttribute('id','form-section')
        enterTitle = document.createElement("p");
        enterTitle.innerText = "Enter Title:";
        enterDescription = document.createElement("p");
        enterDescription.innerText = "Enter Description:";
        enterDueDate = document.createElement("p");
        enterDueDate.innerText = "Enter Due Date:";
        titleInput = document.createElement("input");
        descriptionInput = document.createElement("input");
        dueDateInput = document.createElement("input");
        titleInput.setAttribute("class","nav-input");
        descriptionInput.setAttribute("class","nav-input");
        dueDateInput.setAttribute("class","nav-input");
        submit = document.createElement("button");
        submit.setAttribute("id","nav-submit");
        submit.innerHTML = "Submit";
        submit.style = "margin-top: 2rem; margin-bottom: 2rem;";
        formDiv.appendChild(enterTitle);
        formDiv.appendChild(titleInput);
        formDiv.appendChild(enterDescription);
        formDiv.appendChild(descriptionInput);
        formDiv.appendChild(enterDueDate);
        formDiv.appendChild(dueDateInput);
        formNav.appendChild(title);
        if(type === "project"){
            projectTitleInput = document.createElement("input");
            projectTitleInput.setAttribute("class","nav-input");
            enterProjectTitle = document.createElement("p");
            createFirstTodo = document.createElement("p");
            enterProjectTitle.innerText = "Enter new project title here:";
            createFirstTodo.innerText = "Create your first todo here:";
            projectTitleInput.setAttribute("id","projectInput");
            enterProjectTitle.setAttribute("class","enterProjectTitle");
            createFirstTodo.setAttribute("class","enterProjectTitle");
            formNav.appendChild(enterProjectTitle);
            formNav.appendChild(projectTitleInput);   
            formNav.appendChild(createFirstTodo);
        }
        formNav.appendChild(formDiv);
        formNav.appendChild(submit);
        submit.addEventListener('click',function(){
            navInputs = document.getElementsByClassName("nav-input")
            for(let i = 0; i < navInputs.length; i++){
                if(navInputs[i].value == ""){
                    alert("One or more fields were left blank. Try again.")
                    return;
                }
            }
            if(type === "todo"){
            dataArr.push(titleInput.value, descriptionInput.value, dueDateInput.value);
            addTodo(dataArr);
            } else if (type === "project"){
                dataArr.push(projectTitleInput.value, titleInput.value, descriptionInput.value, dueDateInput.value);
                appendProject(dataArr);
            }
            dataArr = [];
        })
    }

     //Add Todo
     const addTodo = (dataArr) => {
        userCreate.currentProject.toDosCount++;
        const addToProject = Object.values(userCreate.currentProject.toDoList);
        const newTodo = dataArr;
        for(let values in addToProject){
            addToProject[values].push(newTodo[values]);
        }
        addToProject[3][addToProject[3].length-1] = false;
        const newID = userCreate.currentProject.toDosCount - 1;
        addToProject[5][addToProject[5].length-1] = newID;
        appendTodo(newID, newTodo[0], newTodo[1], newTodo[2]);
        inventoryUpdate();
        navForm.dataArr = [];
    }

    const appendTodo = (id, title, description, duedate, pretoggled) => {
        const toDoBody = document.getElementById("todo-body");
        const newTemplate = document.createElement("div");
        toDoBody.appendChild(newTemplate);
        newTemplate.setAttribute("class","todo-template")
        newTemplate.setAttribute("id", `todo-template${id}`);
        newTemplate.innerHTML += `<p class = "todo-title">${title}</p>
        <p class = "todo-items"><input type="checkbox" id="priority${id}" name="priority${id}" value="priority${id}" class="checkbox" onclick="displayController.toggleBox(${id})"></p>
        <p class = "todo-items">${description}</p>
        <p class = "todo-items">${duedate}</p>
        <p class = "todo-items">Notes</p>
        <button onclick="displayController.deleteTodo(${id})">Delete</button>`

        if(pretoggled){
            document.getElementById(`priority${id}`).checked = true;
            // document.getElementsByClassName('todo-title')[id].style = "text-decoration: line-through;"
            document.getElementById(`todo-template${id}`).firstChild.style = "text-decoration: line-through";
            
        }
    }

    return { toggleBox, deleteTodo, navForm, menuOpen, appendProject, selectProject, appendTodo, deleteProject };
})();