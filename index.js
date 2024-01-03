// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-a1cce-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "endorsement")

const textareaEndorsementEl = document.querySelector("#textarea-endorsement")
const inputFromEl = document.querySelector('#input-from')
const inputToEl = document.querySelector('#input-to')
const publishBtn = document.querySelector('#publish-btn')
const endorsementCardsEl = document.querySelector('#endorsement-cards')

publishBtn.addEventListener("click", function() {
    let endorsement = makeEndoresment()
    
})



function makeEndoresment() {
    let endorsementObj = {
        sender: inputFromEl.value,
        recipient: inputToEl.value,
        message: textareaEndorsementEl.value
    }

    return endorsementObj
}