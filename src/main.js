'use strict';
import '@/style.css';
import '@/sassstyle.scss'
import "./auth.js";
import "./drag_drop";
//import "./db";
//import { Base } from "./base.js"

// first list render and on based on BD
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('test: ', auth.currentUser);

//     db.collection('users').doc(auth.currentUser.uid).collection('list').onSnapshot(snapshot => {
//         console.log('snapshot: ', snapshot);
//         renderItemsToDOM(snapshot.docs);
//     }), err => {
//         console.log(err.message)
//     }
// })

// listen for auth status changes
// auth.onAuthStateChanged((user) => {
//     if (user) {
//         console.log('user logged in:\n', user.uid);
//         //db conversation based on logged in user
//         db.collection('users').doc(user.uid).collection('list').onSnapshot((snapshot) => {
//             console.log('snapshot: ', snapshot);
//             renderItemsToDOM(snapshot.docs);
//         }), (err) => {
//             console.log(err.message)
//         }
//     } else {
//         const body = document.querySelector('body');
//         body.innerHTML=`
//             <nav class="navbar navbar-light bg-light">
//                 <span class="navbar-brand mb-0 h1">Navbar</span>
//             </nav>
//             <h1>Log in or sign up</h1>
//             <form id="signup-form">
//                 <div>
//                     <input type="email" id="signup-email" required />
//                     <label for="signup-email">Email address</label>
//                 </div>
//                 <div>
//                     <input type="password" id="signup-password" required />
//                     <label for="signup-password">Enter your password</label>
//                 </div>
//                 <button>Sign up</button>
//             </form>
//             <form id="login-form">
//                 <div>
//                     <input type="email" id="login-email" required />
//                     <label for="login-email">Email address</label>
//                 </div>
//                 <div>
//                     <input type="password" id="login-password" required />
//                     <label for="login-password">Enter your password</label>
//                 </div>
//                 <button>Log in</button>
//             </form>
//             `

//         //renderItemsToDOM([]);
//         //console.log('user logged out');
//     }
// })



//     function() {
//     //re-render DOM each time when BD changed
//     //onSnapshot gets second function-callback-parameter for mistakes
//     db.collection('users').onSnapshot(snapshot => {
//         console.log('snapshot: ', snapshot);
//         renderItemsToDOM(snapshot.docs);
//     }, err => {
//         console.log(err.message)
//     })
// })

// function renderItemsToDOM(data) {
//     const itemList = document.querySelector('#item-list');
//     data.forEach((doc) => {
//         const item = doc.data();
//         console.log(item);
//         const liitem = `<li>${item.content}</li>`;
//         itemList.insertAdjacentHTML("beforeend", liitem);
//     });
// }

/* const todoinput = document.getElementById("todofield");
const todobtn = document.getElementById("todobtn");
const updatebtn = document.getElementById("updatebtn");
const list = document.getElementById("list");

const gettodobtn = document.getElementById("gettodobtn");

todobtn.onclick = function() {
    Base.putItem(todoinput.value)
        .then(response => {
            const currentItemBaseId = response.name;
            const liitem = `<li id=${currentItemBaseId}>${todoinput.value}</li>`;
            list.insertAdjacentHTML("beforeend", liitem);
            todoinput.value = "";
        })
        .then(() => Base.getItems())//те що повертається з калбек функції передається далі!!!Бо повертається проміс!!! І тільки коли повертається проміс відбувається очікування!!!
        .then(() => {
            console.log("IT DONE")//якщо нічого не повернути проміс завершиться!!! тут ми нічого не повернули!!! не повернувся проміс!!!
        })
}; */

//list.onclick = function() {
//    if (event.target.tagName === "LI") {
//        console.log(event.target);
//        Base.deleteItem(event.target.id)
//        .then(()=>Base.getItems());//видалити потім
//        event.target.parentNode.removeChild(event.target);
//    }
//}

/* gettodobtn.onclick = function() {
    Base.getItems()
}

list.onclick = function() {
    if (event.target.tagName === "LI") {
        Base.updateItem(event.target.id, "updated item")
        .then(()=>Base.getItems());//видалити потім
    }
} */