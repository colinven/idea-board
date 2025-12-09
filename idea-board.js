class IdeaBoard {
    constructor(title){
        this.title = title
        this.ideas = [];
    }
    addIdea(Idea){
        this.ideas.push(Idea);
    }
    deleteIdea(id){
        const ideaIndex = this.ideas.findIndex((idea)=> idea.id === id)
        this.ideas.splice(ideaIndex, 1);
    }
}
class Idea {
    static nextId = 1;
    static ALLOWED_STATUSES = ['new', 'progress', 'complete'];

    constructor(title, description, status){
        this.id = `idea${Idea.nextId++}`;
        this.title = title.trim();
        this.description = description.trim();
        this.setStatus(status);
    }
    setStatus(newStatus){
        this.status = Idea.ALLOWED_STATUSES.includes(newStatus) ? newStatus : 'new';
    }
    appendToDisplay(){
        const content = this.title;
        const newDiv = document.createElement('div');
        newDiv.id = `${this.id}`;
        newDiv.className = `idea ${this.status}`;
        newDiv.innerText = content;
        ideaDisplay.appendChild(newDiv);
    }
}
const addIdeaButton = document.getElementById('add-idea-button');

//Expanded modal elements
const backdrop = document.getElementById('backdrop');
const ideaModalContainer = document.getElementById('modal-container');
const ideaModal = document.getElementById('idea-expanded-modal')

//Input fields
const titleInputField = document.getElementById('idea-expanded-title');
const descriptionInputField = document.getElementById('idea-expanded-desc');
const statusDropdown = document.getElementById('idea-status');

//New idea buttons
const newIdeaButtons = document.getElementById('modal-buttons-container');
const exitModalButtons = document.querySelectorAll('.cancel');
const saveIdeaButton = document.getElementById('save-idea-button');

//Expanded idea buttons
const expandedIdeaButtons = document.getElementById('change-idea-buttons-container');
const saveChangesButton = document.getElementById('save-changes-button');
const deleteIdeaButton = document.getElementById('delete-idea-button');

//Local storage
const saveData = () => localStorage.setItem('ideaBoard', JSON.stringify(mainIdeaBoard));
const loadIdeaBoardData = () => {
    const data = localStorage.getItem('ideaBoard');
    if (data) {
        const parsed = JSON.parse(data);
        mainIdeaBoard = new IdeaBoard();
        mainIdeaBoard.title = 'main';
        parsed.ideas.forEach((item) => {
            const idea = new Idea(
                item.title,
                item.description,
                item.status,
            )
            mainIdeaBoard.ideas.push(idea);
        })
        updateDisplay();
    }
    
}
//Open modal
addIdeaButton.addEventListener('click', ()=>{
    backdrop.classList.remove('hidden');
    ideaModalContainer.classList.remove('hidden');
})

//Clear input fields
const resetInput = () =>{
    titleInputField.value = '';
    descriptionInputField.value = '';
    statusDropdown.selectedIndex = 0;
    ideaIdentifier.innerText = '';
    newIdeaButtons.classList.remove('hidden');
    expandedIdeaButtons.classList.add('hidden');
    //Probably a better way to do this:
    ideaModal.classList.remove('new')
    ideaModal.classList.remove('progress');
    ideaModal.classList.remove('complete')
}
const hideModal = () => {
    backdrop.classList.add('hidden');
    ideaModalContainer.classList.add('hidden');
    resetInput();
}

//Exit modal listeners
backdrop.addEventListener('click', hideModal);

exitModalButtons.forEach((button)=>{
    button.addEventListener('click', hideModal)
})

//Add new idea
const ideaDisplay = document.getElementById('idea-board-container')
let mainIdeaBoard = new IdeaBoard('main');

const createNewIdea = () => {
    const title = titleInputField.value;
    const description = descriptionInputField.value;
    const status = statusDropdown.value;
    const newIdea = new Idea(title, description, status);
    mainIdeaBoard.addIdea(newIdea);
    return newIdea;
}
const updateDisplay = () => {
    ideaDisplay.innerHTML = '';
    const ideasArray = mainIdeaBoard.ideas;
    ideasArray.forEach((item) => {
        item.appendToDisplay();
    })
}

saveIdeaButton.addEventListener('click', () => {
    createNewIdea();
    updateDisplay();
    hideModal();
    saveData();
});

//Click on idea card to expand & edit
const ideaIdentifier = document.getElementById('identifier');

ideaDisplay.addEventListener('click', (event) => {
    const ideaToDisplay = mainIdeaBoard.ideas.find((idea) => idea.id === event.target.id);

    if (event.target.classList.contains('idea')){
        //Display Modal
        backdrop.classList.remove('hidden');
        ideaModalContainer.classList.remove('hidden');
        //Populate fields w data
        titleInputField.value = ideaToDisplay.title;
        descriptionInputField.value = ideaToDisplay.description;
        statusDropdown.value = ideaToDisplay.status;
        ideaIdentifier.innerText = ideaToDisplay.id;
        //Display appropriate buttons
        newIdeaButtons.classList.add('hidden');
        expandedIdeaButtons.classList.remove('hidden');
        //Apply coresponding color theme
        ideaModal.classList.add(ideaToDisplay.status);


;    }
});
const updateIdeaInfo = () => {
    const displayedIdea = mainIdeaBoard.ideas.find((idea)=> idea.id === ideaIdentifier.innerText);
    displayedIdea.title = titleInputField.value === '' ? displayedIdea.title : titleInputField.value.trim();
    displayedIdea.description = descriptionInputField.value.trim();
    displayedIdea.status = statusDropdown.value.toLowerCase();
}
//Save Changes to Idea
saveChangesButton.addEventListener('click', () => {
    updateIdeaInfo();
    updateDisplay();
    hideModal();
    saveData();
})

//Delete Idea
deleteIdeaButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete your bright idea?")){
        mainIdeaBoard.deleteIdea(ideaIdentifier.innerText)
        updateDisplay();
        hideModal();
        saveData();
    }
})

loadIdeaBoardData();