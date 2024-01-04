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
const userID = getOrCreateUserId()

publishBtn.addEventListener("click", function() {
    let endorsement = makeEndorsement()
    push(endorsementInDB, endorsement)
    clearForm()
})

onValue(endorsementInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        // console.log(itemsArray)
        clearEndorsementCardsEl()

        for (let i = itemsArray.length - 1; i >= 0; i--) {
            let currentEndorsement = itemsArray[i]
            // console.log(currentEndorsement)

            appendEndorsementToEndorsementCardsEl(currentEndorsement)
        }
    } else {
        // console.log("Issue")
    }
}
)

function makeEndorsement() {
    let endorsementObj = {
        sender: inputFromEl.value,
        recipient: inputToEl.value,
        message: textareaEndorsementEl.value,
        likes: 0,
        // isLiked: false,
        whoLiked: []
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

//     newEndorsementCardEl.addEventListener("dblclick", function() {
//         // let exactLocationOfItemInDB = ref(database, `endorsement/${endorsement[0]}`)

newEndorsementCardEl.addEventListener("dblclick", function() {
    // Define the path to the whoLiked array in Firebase
    let whoLikedRef = ref(database, `endorsement/${endorsement[0]}/whoLiked`);

    // Retrieve the current whoLiked array from Firebase
    onValue(whoLikedRef, (snapshot) => {
        let whoLiked = snapshot.exists() ? snapshot.val() : [];

        // Determine if the user has already liked the endorsement
        let userIndex = whoLiked.indexOf(userID);

        if (userIndex === -1) {
            // User hasn't liked it yet, so add their ID to the array
            whoLiked.push(userID);
        } else {
            // User has already liked it, so remove their ID from the array
            whoLiked.splice(userIndex, 1);
        }

        // Update the whoLiked array in Firebase
        update(ref(database, `endorsement/${endorsement[0]}`), { whoLiked: whoLiked, likes: whoLiked.length });

        // Update the likes display
        newEndorsementCardLikeEl.textContent = whoLiked.length;
    }, {
        onlyOnce: true // We only need to fetch the data once
    });
});

// })
    return newEndorsementCardEl
}

function getOrCreateUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + (Math.floor(Math.random() * 10000000000)).toString(36)
        localStorage.setItem('userId', userId);
    }
    return userId;
}