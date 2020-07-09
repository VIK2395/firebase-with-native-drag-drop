
// listen for auth status changes
auth.onAuthStateChanged(user => {//RENDER ACCORDING TO FIREBASE CHANGES!!!!!
    if (user) {
        console.log('user logged in:\n', user.uid);
        //db conversation based on logged in user               //тут сортыровка задатою!!!
        db.collection('users').doc(user.uid).collection('list').orderBy("createdate", "desc").onSnapshot(snapshot => {
            console.log(snapshot);
            console.log(snapshot.metadata.hasPendingWrites);
        }, function (err) {
            console.log(err.message)
        });
        setupUI(user);
    } else {
        console.log('user logged out');
        setupUI();
    }
})

// function renderItemsToDOM(data) {
//     //робити ререндер тільки якщо нема відкритих едітів!!!!
//     //if (!document.querySelectorAll('.cancel')) {

//         const itemList = document.querySelector('#item-list');
//         itemList.innerHTML = "";
//         data.forEach(doc => {
//             const item = doc.data();
//             const liitem = `<li id="${doc.id}" class="list-group-item text-break d-flex flex-wrap ${item.completeness}">
//                                 <div class="flex-grow-1 content" style="padding: 5px">
//                                     <div class="text">
//                                         ${item.content}
//                                     </div>
//                                     ${doc.id}
//                                 </div>
//                                 <div class="ml-auto" style="padding: 5px">
//                                     <button class="btn btn-warning edit" type="submit">Edit</button>
//                                     <button class="btn btn-success completeness" type="submit">Done</button>
//                                     <button class="btn btn-danger delete" type="submit">Delete</button>
//                                 </div>
//                             </li>`;
//             itemList.insertAdjacentHTML("beforeend", liitem);
//         });
//     //}
// }

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
            createdate: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => 
            console.log('item added sucssesfuly')
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

const itemList = document.querySelector('#item-list');
itemList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        const docId = e.target.parentNode.parentNode.id;

        db.collection("users")
            .doc(auth.currentUser.uid)
            .collection('list')
            .doc(docId)
            .delete()
            .then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    if (e.target.classList.contains('completeness')) {

        if (e.target.parentNode.parentNode.classList.contains('undone')) {
            const docId = e.target.parentNode.parentNode.id;
            //firstly accessing the database
            db.collection("users")
                .doc(auth.currentUser.uid)
                .collection('list')
                .doc(docId)
                .update({
                    completeness: 'done',
                    lastupdatedate: firebase.firestore.FieldValue.serverTimestamp()
                });


                // .set({
                //     completeness: 'done'
                // }, { merge: true });


        } 
        if (e.target.parentNode.parentNode.classList.contains('done')) {
            const docId = e.target.parentNode.parentNode.id;
            //firstly accessing the database
            db.collection("users")
                .doc(auth.currentUser.uid)
                .collection('list')
                .doc(docId)
                .update({
                    completeness: 'undone',
                    lastupdatedate: firebase.firestore.FieldValue.serverTimestamp()
                });


                // .set({
                //     completeness: 'undone'
                // }, { merge: true });

        }
    }

    if (e.target.classList.contains('edit')) {
        const docId = e.target.parentNode.parentNode.id;//но краще list ID
        const currentLIedit = e.target.parentNode.parentNode;
        const duplicateForReturningBack = currentLIedit.innerHTML;

        const textToEdit = currentLIedit.querySelector('.content .text').innerHTML.trim();
        //тут треба проміс щоб повісити обработчик тільки після того як ітем відрендерився. Удалити обработчик після кліка, щоб він не висів в домі!!!
        currentLIedit.innerHTML = `
                <div class="flex-grow-1" style="padding: 5px">
                    <form id="edit-item-form-${docId}">
                        <input type="text" id="edit-item-input-${docId}" class="form-control" placeholder="Update the item" value="${textToEdit}">
                        ${docId}
                    </form>
                </div>
                <div class="ml-auto" style="padding: 5px">
                    <button type="submit" form="edit-item-form-${docId}" class="btn btn-success">Update</button>
                    <button type="submit" id="cancel-edit-${docId}" class="btn btn-danger cancel">Cancel</button>
                </div>`;
        
                const cancelBtn = document.querySelector(`#cancel-edit-${docId}`);
                cancelBtn.addEventListener('click', () => {
                    currentLIedit.innerHTML = duplicateForReturningBack;
                })

                console.log(currentLIedit);

            function updateItemRequest(e) {
                e.preventDefault();

                //editForm.removeEventListener('submit', updateItemRequest);

                db.collection("users")
                    .doc(auth.currentUser.uid)
                    .collection('list')
                    .doc(docId)
                    .update({
                        content: editForm[`edit-item-input-${docId}`].value,
                        lastupdatedate: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        console.log('updated!');
                    })
            }

            const editForm = document.querySelector(`#edit-item-form-${docId}`);
            editForm.addEventListener('submit', updateItemRequest)
    }
})

    