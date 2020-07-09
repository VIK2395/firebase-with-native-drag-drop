
const itemList = document.querySelector('#item-list');
itemList.addEventListener('change', (e) => {
    const draggable = document.querySelectorAll("li[draggable]");
    console.log(draggable)
})