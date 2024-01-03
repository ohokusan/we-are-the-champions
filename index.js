// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-a1cce-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsement")

const textareaEndorsementEl = document.querySelector("#textarea-endorsement")
const inputFromEl = document.querySelector('#input-from')
const inputToEl = document.querySelector('#input-to')
const publishBtn = document.querySelector('#publish-btn')
const endorsementCardsEl = document.querySelector('#endorsement-cards')

publishBtn.addEventListener("click", function() {
    let endorsement = makeEndorsement()
    push(endorsementInDB, endorsement)
    clearForm()
})

onValue(endorsementInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        console.log(itemsArray)
        clearEndorsementCardsEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentEndorsement = itemsArray[i]
            // console.log(currentEndorsement)

            appendEndorsementToEndorsementCardsEl(currentEndorsement)
        }
    } else {
        console.log("Issue")
    }
}
)

function makeEndorsement() {
    let endorsementObj = {
        sender: inputFromEl.value,
        recipient: inputToEl.value,
        message: textareaEndorsementEl.value,
        likes: 0,
        isLiked: false
    }

    return endorsementObj
}

function clearForm() {
    textareaEndorsementEl.value = ""
    inputFromEl.value = ""
    inputToEl.value = ""
}

function clearEndorsementCardsEl() {
    endorsementCardsEl.innerHTML = ""
}

function appendEndorsementToEndorsementCardsEl(endorsement) {
    // let endorsementID = endorsement[0]
    let endorsementItem = endorsement

    let newEndorsementCard = createNewEndorsementCard(endorsementItem)

    endorsementCardsEl.append(newEndorsementCard)


}

{/* <div class="endorsement-card">
    <p class="endorsement-card-to">To Leanne</p>
    <p class="endorsement-card-text">Leanne! Thank you so much for helping me with the March accounting. Saved so much time because of you! 💜 Frode</p>
    <div class="endorsement-card-footer">
        <p class="endorsement-card-from">From Frode</p>
        <p class="endorsement-card-like">4</p>
    </div>
</div> */}

function createNewEndorsementCard(endorsement) {

    // Assuming the second item in the array is an object with recipient, sender, and message keys.
    let recipientName = endorsement[1].recipient;
    let senderName = endorsement[1].sender;
    let messageIn = endorsement[1].message;
    let likesAmount = endorsement[1].likes;

    let newEndorsementCardEl = document.createElement("div");
    newEndorsementCardEl.className = "endorsement-card";

    let newEndorsementCardToEl = document.createElement("p");
    newEndorsementCardToEl.className = "endorsement-card-to";
    newEndorsementCardToEl.textContent = `To ${recipientName}`;

    let newEndorsementCardTextEl = document.createElement("p");
    newEndorsementCardTextEl.className = "endorsement-card-text";
    newEndorsementCardTextEl.textContent = messageIn;

    let newEndorsementCardFooterEl = document.createElement("div");
    newEndorsementCardFooterEl.className = "endorsement-card-footer";

    let newEndorsementCardFromEl = document.createElement("p");
    newEndorsementCardFromEl.className = "endorsement-card-from";
    newEndorsementCardFromEl.textContent = `From ${senderName}`;

    let newEndorsementCardLikeEl = document.createElement("p");
    newEndorsementCardLikeEl.className = "endorsement-card-like";
    newEndorsementCardLikeEl.textContent = likesAmount;

    newEndorsementCardFooterEl.appendChild(newEndorsementCardFromEl);
    newEndorsementCardFooterEl.appendChild(newEndorsementCardLikeEl);

    newEndorsementCardEl.appendChild(newEndorsementCardToEl);
    newEndorsementCardEl.appendChild(newEndorsementCardTextEl);
    newEndorsementCardEl.appendChild(newEndorsementCardFooterEl);

    newEndorsementCardEl.addEventListener("dblclick", function() {
        // let exactLocationOfItemInDB = ref(database, `endorsement/${endorsement[0]}`)

    
        if (endorsement[1].isLiked == false) {
            likesAmount += 1
            update(ref(database, `endorsement/${endorsement[0]}`), {
                isLiked: true,
                likes: likesAmount
              });
        } else {
            likesAmount -= 1
            update(ref(database, `endorsement/${endorsement[0]}`), {
                isLiked: false,
                likes: likesAmount
              });
        }
    })

    console.log(endorsement)

    return newEndorsementCardEl;
}