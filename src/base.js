
export class Base {
    static putItem(todoitem) {
        return fetch(`https://online-todo-list-7ca5c.firebaseio.com/items.json`, {
                method: "POST",
                body: JSON.stringify(todoitem),
                headers: {
                    "Content-Type": "aplication/json"
                }
            })
            .then(response => response.json())
    }

    static deleteItem(ItemBaseId) {
        return fetch(`https://online-todo-list-7ca5c.firebaseio.com/items/${ItemBaseId}.json`, {
                method: "DELETE"
            })
    }

    static getItems() {
        return fetch(`https://online-todo-list-7ca5c.firebaseio.com/items.json`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => console.log(response))
    }

    static updateItem(ItemBaseId, newcontent) {
        return fetch(`https://online-todo-list-7ca5c.firebaseio.com/items/${ItemBaseId}.json`, {
            method: "PUT",
            body: JSON.stringify(newcontent),
            headers: {
                "Content-Type": "aplication/json"
            }
        })
        .then(response => response.json())
    }
}