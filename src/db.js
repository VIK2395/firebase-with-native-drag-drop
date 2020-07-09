//get data from DB
db.collection('users').get().then((snapshot) => {
    //console.log(snapshot.docs);
    renderToDOM(snapshot.docs);//array inside
})

function renderItemsToDOM(data) {
    data.forEach((doc) => {
        const item = doc.data();
        const liitem = `<li>${item.content}</li>`;
        list.insertAdjacentHTML("beforeend", liitem);
        console.log(item)
    });
}