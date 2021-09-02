// //Write Project Content To Page Function
// const writeProjectContent = (project) => {
//     const projectGrid = document.createElement("div");
//     projectGrid.setAttribute("id","project-section");
//     const appendListItems = document.createElement("div");
//     appendListItems.setAttribute("id","project-items")
//     const appendTitle = document.createElement("h1");
//     appendTitle.setAttribute("id","project-title");
//     const pageBody = document.querySelector("body");
//     projectGrid.appendChild(appendTitle);
//     projectGrid.appendChild(appendListItems);
//     pageBody.appendChild(projectGrid);
//     appendTitle.innerHTML = `${project[0]}`;
//     for(let i = 1; i < project.length; i++){
//         for(let prop in project[i]){
//         appendListItems.innerHTML += `${project[i][prop]}<br>`;
//         }
//     }
//     // projectGrid.style = `grid-template-rows: 33% 50%`;
// }

// //Write Project Content On Page Load
// writeProjectContent(defaultProject);
