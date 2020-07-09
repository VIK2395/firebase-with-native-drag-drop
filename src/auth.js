let nodesColection;
let nodeToMove;
let currentCursorLiIndex; // над яким елементом находиться курсор!!!

//handle drag listener on list itself
const itemList = document.querySelector('#item-list');

itemList.addEventListener('change', () => {
    console.log('LI_CHANGED')
})


itemList.addEventListener('dragover', (e) => {
    e.preventDefault();//to allow dropping
    console.log('drag over');
    //get shapshot of li items
    nodesColection = document.querySelectorAll('li');//кожного разу робимо знімок щоб мати актуальну індексацію li

    for (let i = 0; i < nodesColection.length; i++) {//кожного разу по новый розраховуэм координати цетрыв li
        const liposition = nodesColection[i].getBoundingClientRect();
        const yLiCenterInDOC = liposition.top + liposition.height / 2 + window.pageYOffset;
        nodesColection[i].yLiCenterInDOC = yLiCenterInDOC;
    }

    const currentCursorPosInDoc = e.clientY + window.pageYOffset;//типерішнє положення курсора

    for (let i=0; i < nodesColection.length; i++ ) {
        if (nodesColection[i].yLiCenterInDOC < currentCursorPosInDoc) {
            if (i == nodesColection.length - 1) {
                //break // можна не виходити бо це йтак останный елемент цикла
                itemList.append(nodeToMove);//просто добавляєм в кінець листа!!!
            }
        } else {
            //як тільки буде переше неспівпадіння нема сенсу продовжувати цикл
            currentCursorLiIndex = i; // над яким елементом находиться курсор!!!
            itemList.insertBefore(nodeToMove, itemList.children[currentCursorLiIndex]);
            break;
        }
    }
})

// listen for auth status changes
auth.onAuthStateChanged(user => {//RENDER ACCORDING TO FIREBASE CHANGES!!!!!
    if (user) {
        console.log('user logged in:\n', user.uid);

        //db conversation based on logged in user               //тут сортыровка задатою!!! //list-group-item
        db.collection('users').doc(user.uid).collection('list').orderBy("createdate", "desc").onSnapshot(snapshot => {
            snapshot.docChanges().forEach(function(change) {

                const liTemplate = () => `
                        <li draggable="true" id="${change.doc.id}" class="just-added list-group-item text-break ${change.doc.data().completeness}">
                            <div class="d-flex flex-wrap">
                                <div class="flex-grow-1 content">
                                    <p class="text">${change.doc.data().content}</p>
                                    <p>ID: ${change.doc.id}</p>
                                    <p>createdate: ${change.doc.data().createdate.toDate()}</p>
                                </div>
                                <div class="ml-auto">
                                    <input type="button" class="btn btn-warning rise" value="Rise">
                                    <input type="button" class="btn btn-warning edit" value="Edit">
                                    <input type="button" class="btn btn-success completeness" value="Done">
                                    <input type="button" class="btn btn-danger delete" value="Delete">
                                </div>
                            </div>
                        </li>`;

                if (change.type === "added") {
                    console.log("added called");
                    const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source);

                    const itemList = document.querySelector('#item-list');
                    itemList.insertAdjacentHTML("afterbegin", liTemplate());

                    const currentLi = document.getElementById(change.doc.id);

                    currentLi.addEventListener('animationend', () => {
                        currentLi.classList.remove('just-added');
                    })

                    currentLi.addEventListener('mousedown', (e) => {
                        e.currentTarget.style.backgroundColor = 'tomato';
                    })

                    currentLi.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text', e.currentTarget)//for firefox
                        console.log('drag start');
                        //pull in hight scoupe
                        nodeToMove = currentLi;
                        //start dragging //start DRAGOVERLISTENER
                        currentLi.classList.add('dragging');
                        // setTimeout(function() {
                        //     currentLi.style.visibility = 'hidden';
                        // },0)
                    })

                    currentLi.addEventListener('drop', (e) => {//to kill firefox reqvest
                        e.preventDefault();
                        console.log('dropped');
                    })

                    currentLi.addEventListener('dragend', (e) => {
                        e.preventDefault();// to kill fire fox linking
                        console.log('drag end');
                        e.currentTarget.style.backgroundColor = 'lime';

                        currentLi.classList.remove('dragging')
                    })
                }


                if (change.type === "modified") {
                    console.log('modified called');
                    let source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source);


                    const LIToReplaceInDOM = document.getElementById(change.doc.id);
                    LIToReplaceInDOM.parentNode.replaceChild(createHTMLElementFromStr(liTemplate()), LIToReplaceInDOM);

                    function createHTMLElementFromStr(htmlString) {
                        const div = document.createElement('div');
                        div.innerHTML = htmlString.trim();
                        //Change this to div.childNodes to support multiple top-level nodes
                        return div.firstChild; 
                    }

                    //Event listeners
                    const currentLi = document.getElementById(change.doc.id);

                    currentLi.addEventListener('animationend', () => {
                        currentLi.classList.remove('just-added');
                        
                    })

                    // currentLi.addEventListener('mousedown', (e) => {
                    //     e.currentTarget.style.backgroundColor = 'tomato';
                    // })

                    currentLi.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text', e.currentTarget)//for firefox
                        console.log('drag start');
                        nodeToMove = currentLi;
                        currentLi.classList.add('dragging');
                    })

                    currentLi.addEventListener('drop', (e) => {//to kill firefox reqvest
                        e.preventDefault();
                        console.log('dropped');
                    })

                    currentLi.addEventListener('dragend', () => {
                        console.log('drag end');
                        currentLi.classList.remove('dragging')
                    })
                }
                
                if (change.type === "removed") {
                    console.log('removed called');
                    let source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
                    console.log(source);
                    
                    const currentLi = document.getElementById(change.doc.id);
                    currentLi.classList.add('just-deleted');
                        //currentLi.style.animationPlayState = 'running';
                    currentLi.addEventListener('animationend', () => {

                        currentLi.classList.remove('just-deleted');

                        const tempDiv = document.createElement('div');
                    
                        const liRectangle = currentLi.getBoundingClientRect();
                    
                        tempDiv.style.boxSizing = 'border-box';
                        tempDiv.style.height = `${liRectangle.height}px`;
                        tempDiv.style.width = `${liRectangle.width}px`;
                    
                        tempDiv.style.opacity = 0;
                        tempDiv.style.margin = 0;
                        tempDiv.style.border = 0;
                        tempDiv.style.padding = 0;

                        //ul
                        currentLi.parentNode.replaceChild(tempDiv, currentLi);

                        tempDiv.classList.add('temp-div-to-shrink');
                        tempDiv.addEventListener('animationend', () => {
                                tempDiv.remove();
                        })
                    })
                }
            });
        }, function (err) {
            console.log(err.message)
        });
        setupUI(user);
    } else {
        console.log('user logged out');
        const itemList = document.querySelector('#item-list');
        itemList.innerHTML="";
        setupUI();
    }
})

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

function setupUI(user) {
    if (user) {
        loggedInLinks.forEach(item => item.style.display = "block");
        loggedOutLinks.forEach(item => item.style.display = "none")
    } else {
        loggedInLinks.forEach(item => item.style.display = "none");
        loggedOutLinks.forEach(item => item.style.display = "block")
    }
}

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    //sign up the user and create DB collection "users", add document with the same ID as new user just created => inside create another collection "list" with auto-generated doc with required fields
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            return db.collection('users').doc(cred.user.uid).collection('list').add({
                ["user\'s email"]: signupForm['signup-email'].value
            })
        })
        .then(() => {
            //clear signup fields
            $("#signup-email").val("");
            $("#signup-password").val("");
            //close signup modal
            $("#signup-modal").modal("toggle");
        });
})

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser) {
        auth.signOut()
            .then(console.log("the user has logged out successfully"));
    } else {
        console.log('no user logged in');
    }
})

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    //log in the user
    auth.signInWithEmailAndPassword(email, password);
})

//BD code
const addForm = document.querySelector('#add-item-form');
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get current sign in user uid and assosiated doc by uid
    if (auth.currentUser) {
        db.collection('users').doc(auth.currentUser.uid).collection('list').add({
            content: addForm['add-item-input'].value,
            completeness: 'undone',
            createdate: new Date()//put local brawser date
        }).then(() => {}
            //console.log('item added sucssesfuly')
        )
    } else {
        console.log('no user logged in');
    }
})

    const account = document.querySelector('#account');
    account.addEventListener('click', () => {
        const accountInfo = document.querySelector('#account-info');
        if (auth.currentUser) {
            accountInfo.innerHTML = `You are logged in as ${auth.currentUser.email}`;
            return
        }
        accountInfo.innerHTML = `NO USER LOGGED IN`;
    })

//const itemList = document.querySelector('#item-list');
itemList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        const docId = e.target.closest('li').id;

        db.collection("users")
            .doc(auth.currentUser.uid)
            .collection('list')
            .doc(docId)
            .delete()
            .then(function() {
            //console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    if (e.target.classList.contains('rise')) {
        const currentLi = e.target.closest('li');

        currentLi.style.visibility = 'hidden';

        const liRectangle = currentLi.getBoundingClientRect();

        const tempDiv = document.createElement('div');

        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.height = `0px`;
        tempDiv.style.width = `${liRectangle.width}px`;
    
        tempDiv.style.opacity = 0;
        tempDiv.style.margin = 0;
        tempDiv.style.border = 0;
        tempDiv.style.padding = 0;
        tempDiv.style.transition = "all .2s";

        currentLi.before(tempDiv);

        setTimeout(() => {
            tempDiv.style.height = `${liRectangle.height}px`;
        }, 50)

        //tempDiv.style.height = `${liRectangle.height}px`; //из-за асинхронності ці стилі приміняються швидше ніж елемент вимонтувавя в дом
    } 

    if (e.target.classList.contains('completeness')) {

        if (e.target.closest('li').classList.contains('undone')) {
            const docId = e.target.closest('li').id;
            //firstly accessing the database
            db.collection("users")
                .doc(auth.currentUser.uid)
                .collection('list')
                .doc(docId)
                .update({
                    completeness: 'done'
                });
        }

        if (e.target.closest('li').classList.contains('done')) {
            const docId = e.target.closest('li').id;
            //firstly accessing the database
            db.collection("users")
                .doc(auth.currentUser.uid)
                .collection('list')
                .doc(docId)
                .update({
                    completeness: 'undone'
                });
        }
    }

    if (e.target.classList.contains('edit')) {
        const docId = e.target.closest('li').id;//но краще list ID
        const currentLIedit = e.target.closest('li');
        const duplicateForReturningBack = currentLIedit.innerHTML;

        const textToEdit = currentLIedit.querySelector('.content .text').innerHTML.trim();
        //тут треба проміс щоб повісити обработчик тільки після того як ітем відрендерився. Удалити обработчик після кліка, щоб він не висів в домі!!!
        currentLIedit.innerHTML = `
                <div class="d-flex flex-wrap">
                    <div class="flex-grow-1" style="padding: 5px">
                        <form id="edit-item-form-${docId}">
                            <input type="text" id="edit-item-input-${docId}" class="form-control" placeholder="Update the item" value="${textToEdit}">
                        </form>
                        <div>
                            ID: ${docId}
                        </div>
                    </div>
                    <div class="ml-auto">
                        <button type="submit" form="edit-item-form-${docId}" class="btn btn-success">Update</button>
                        <button type="submit" id="cancel-edit-${docId}" class="btn btn-danger cancel">Cancel</button>
                    </div>
                </div>`;
        
                const cancelBtn = document.querySelector(`#cancel-edit-${docId}`);
                cancelBtn.addEventListener('click', () => {
                    currentLIedit.innerHTML = duplicateForReturningBack;
                })

            function updateItemRequest(e) {
                e.preventDefault();

                //editForm.removeEventListener('submit', updateItemRequest);

                db.collection("users")
                    .doc(auth.currentUser.uid)
                    .collection('list')
                    .doc(docId)
                    .update({
                        content: editForm[`edit-item-input-${docId}`].value,
                    })
                    .then(() => {
                        //console.log('updated!');
                    })
            }

            const editForm = document.querySelector(`#edit-item-form-${docId}`);
            editForm.addEventListener('submit', updateItemRequest)
    }
})

    