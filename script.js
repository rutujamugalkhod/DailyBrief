// ======================================================
// DAILY BRIEF v1.4
// ======================================================


// ======================
// API KEY
// ======================
const apiKey = "f23f993e9bc3a472ac66a0775f519f4d";


console.log("SCRIPT LOADED");

// ======================
// GLOBAL VARIABLES
// ======================

let currentArticles = [];

const newsGrid = document.getElementById("newsGrid");

const heroImage = document.getElementById("heroImage");

const heroTitle = document.getElementById("heroTitle");

const heroDescription = document.getElementById("heroDescription");

const heroButton = document.getElementById("heroButton");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const themeBtn = document.getElementById("themeBtn");

const categoryCards = document.querySelectorAll(".category-card");


// ======================
// API URL
// ======================

function getApiURL(search="",category="general"){

    if(search.trim()!==""){

        return `https://gnews.io/api/v4/search?q=${encodeURIComponent(search)}&lang=en&country=in&max=10&apikey=${apiKey}`;

    }

    return `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&apikey=${apiKey}`;

}


// ======================
// LOADING
// ======================

function showLoading(){

    newsGrid.innerHTML="";

    for(let i=0;i<6;i++){

        newsGrid.innerHTML+=`

        <div class="skeleton">

            <div class="skeleton-image"></div>

            <div class="skeleton-line"></div>

            <div class="skeleton-line short"></div>

        </div>

        `;

    }

}

// ======================
// LOAD NEWS
// ======================

async function loadNews(search="",category="general"){

    try{

        showLoading();

        const response=await fetch(getApiURL(search,category));

        const data=await response.json();

        if(!data.articles || data.articles.length===0){

            newsGrid.innerHTML="<h2>No News Found.</h2>";

            return;

        }

        currentArticles=data.articles;

        displayHero(data.articles[0]);

        displayNews(data.articles.slice(1));

    }

    catch(error){

        console.log(error);

        newsGrid.innerHTML="<h2>Unable to load news.</h2>";

    }

}



// ======================
// HERO
// ======================

function displayHero(article){

    heroImage.src=article.image || "assets/images/no-image.jpg";

    heroTitle.innerText=article.title;

    heroDescription.innerText=
        article.description || "No description available.";

    heroButton.onclick=()=>{

        window.open(article.url,"_blank");

    };

}

// ======================
// DISPLAY NEWS
// ======================

function displayNews(articles){

    newsGrid.innerHTML="";

    articles.forEach((article,index)=>{

        newsGrid.innerHTML+=`

        <div class="news-card">

            <img
                src="${article.image || 'assets/images/no-image.jpg'}"
                alt="News Image">

            <h2>${article.title}</h2>

            <p>${article.description || "No description available."}</p>

            <div class="card-footer">

                <span>📰 ${article.source.name}</span>

                <span>
                    📅 ${new Date(article.publishedAt).toLocaleDateString()}
                </span>

            </div>

<div class="card-buttons">

    <button
        class="save-btn"
        onclick="saveArticle(${index})">

        ❤️ Save

    </button>

    <button
        onclick="showSummary(${index})">

        ✨ Summary

    </button>

    <button
        onclick="openAIChat(${index})">

        🤖 Ask AI

    </button>

    <button
        onclick="window.open('${article.url}','_blank')">

        Read →

    </button>

</div>

        </div>

        `;

    });

}



// ======================
// SAVE ARTICLE
// ======================

function saveArticle(index){

    const article=currentArticles[index+1];

    let savedNews=
        JSON.parse(localStorage.getItem("savedNews")) || [];

    const alreadyExists=savedNews.some(item=>item.url===article.url);

    if(alreadyExists){

        alert("This article is already saved!");

        return;

    }

    savedNews.push(article);

    localStorage.setItem(

        "savedNews",

        JSON.stringify(savedNews)

    );

    alert("❤️ Article Saved Successfully!");

}

// ======================================================
// SEARCH
// ======================================================

searchBtn.addEventListener("click",()=>{

    const searchText=searchInput.value.trim();

    loadNews(searchText);

});


// ======================================================
// ENTER KEY SEARCH
// ======================================================

searchInput.addEventListener("keypress",(event)=>{

    if(event.key==="Enter"){

        const searchText=searchInput.value.trim();

        loadNews(searchText);

    }

});


// ======================================================
// CATEGORY CLICK
// ======================================================

categoryCards.forEach(card=>{

    card.addEventListener("click",()=>{

        categoryCards.forEach(item=>{

            item.classList.remove("active");

        });

        card.classList.add("active");

        const category=card.dataset.category;

        loadNews("",category);

    });

});


// ======================================================
// HOME BUTTON
// ======================================================

const homeLink=document.getElementById("homeLink");

if(homeLink){

    homeLink.addEventListener("click",(event)=>{

        event.preventDefault();

        categoryCards.forEach(card=>{

            card.classList.remove("active");

        });

        searchInput.value="";

        loadNews();

    });

}


// ======================================================
// IMAGE FALLBACK
// ======================================================

document.addEventListener("error",(event)=>{

    if(event.target.tagName==="IMG"){

        event.target.src="assets/images/no-image.jpg";

    }

},true);

// =====================================
// GENERATE AI SUMMARY
// =====================================

async function generateAISummary(article){

    try{

        const response = await fetch("http://localhost:3000/api/summary",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title:article.title,

                description:article.description

            })

        });

        if(!response.ok){

            throw new Error("Server Error");

        }

        const data = await response.json();

        return data.summary;

    }

    catch(error){

        console.error(error);

        return `What happened:
Unable to generate AI summary.

Background:
Please make sure the backend server is running.

Latest Update:
No AI response received.

Why it matters:
The frontend could not communicate with the AI server.`;

    }

}
// =====================================
// DARK MODE
// =====================================

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    console.log(document.body.className);

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme","dark");

        themeBtn.innerText="☀️ Light Mode";

    }

    else{

        localStorage.setItem("theme","light");

        themeBtn.innerText="🌙 Dark Mode";

    }

});


// Load saved theme

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.toggle("dark-mode");

console.log(document.body.className);

    themeBtn.innerText="☀️ Light Mode";

}

// ======================================================
// START WEBSITE
// ======================================================

loadNews();

// =====================================
// AI SUMMARY MODAL
// =====================================

const summaryModal = document.getElementById("summaryModal");

const closeModal = document.getElementById("closeModal");

console.log(closeModal);

const summaryTitle = document.getElementById("summaryTitle");

const summaryProblem = document.getElementById("summaryProblem");

const summaryBackground = document.getElementById("summaryBackground");

const summaryLatest = document.getElementById("summaryLatest");

const summaryImportance = document.getElementById("summaryImportance");

const summaryReadBtn = document.getElementById("summaryReadBtn");

// =====================================
// AI CHAT
// =====================================

const chatModal = document.getElementById("chatModal");

const closeChatModal = document.getElementById("closeChatModal");

const chatQuestion = document.getElementById("chatQuestion");

const askAIBtn = document.getElementById("askAIBtn");

const chatMessages = document.getElementById("chatMessages");

let currentChatArticle = null;

async function showSummary(index){

    const article = currentArticles[index + 1];

    summaryTitle.innerText = article.title;

    summaryProblem.innerText = "Generating AI Summary...";
    summaryBackground.innerText = "";
    summaryLatest.innerText = "";
    summaryImportance.innerText = "";

    summaryModal.style.display = "flex";

    const aiSummary = await generateAISummary(article);

    const what = aiSummary.match(/What happened:\s*([\s\S]*?)\n\s*Background:/i);
    const background = aiSummary.match(/Background:\s*([\s\S]*?)\n\s*Latest Update:/i);
    const latest = aiSummary.match(/Latest Update:\s*([\s\S]*?)\n\s*Why it matters:/i);
    const importance = aiSummary.match(/Why it matters:\s*([\s\S]*)/i);

    summaryProblem.innerText = what ? what[1].trim() : "Not available.";

    summaryBackground.innerText = background ? background[1].trim() : "Not available.";

    summaryLatest.innerText = latest ? latest[1].trim() : "Not available.";

    summaryImportance.innerText = importance ? importance[1].trim() : "Not available.";

    summaryReadBtn.onclick = () => {

        window.open(article.url, "_blank");

    };

}
// =====================================
// CLOSE MODAL
// =====================================

// Close using the ❌ button
closeModal.addEventListener("click", () => {

    summaryModal.style.display = "none";

});

// Close when clicking outside the modal
window.addEventListener("click", (event) => {

    if(event.target === summaryModal){

        summaryModal.style.display = "none";

    }

});

// Optional: Close with Escape key
document.addEventListener("keydown", (event) => {

    if(event.key === "Escape"){

        summaryModal.style.display = "none";

    }

});

// =====================================
// OPEN AI CHAT
// =====================================

function openAIChat(index){

    currentChatArticle = currentArticles[index + 1];

    chatQuestion.value = "";

    chatMessages.innerHTML = `
<div class="ai-message">
🤖 Ask me anything about this article.
</div>
`;

    chatModal.style.display = "flex";

}

// =====================================
// ASK AI
// =====================================

askAIBtn.addEventListener("click", async () => {

    const question = chatQuestion.value.trim();

    if(question === ""){
        alert("Please enter a question.");
        return;
    }

    // Add user's message
    chatMessages.innerHTML += `
        <div class="user-message">
            👤 ${question}
        </div>
    `;

    // Show thinking message
    chatMessages.innerHTML += `
        <div class="ai-message" id="thinking">
            🤖 Thinking...
        </div>
    `;

    chatMessages.scrollTop = chatMessages.scrollHeight;

    try{

        const response = await fetch("http://localhost:3000/api/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title: currentChatArticle.title,

                description: currentChatArticle.description,

                question: question

            })

        });

        const data = await response.json();

        // Remove "Thinking..."
        document.getElementById("thinking").remove();

        // Add AI response
        chatMessages.innerHTML += `
            <div class="ai-message">
                🤖 ${data.answer}
            </div>
        `;

        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatQuestion.value = "";

    }

    catch(error){

        console.error(error);

        document.getElementById("thinking").remove();

        chatMessages.innerHTML += `
            <div class="ai-message">
                ❌ Unable to contact AI server.
            </div>
        `;

    }

});

// =====================================
// CLOSE AI CHAT
// =====================================

closeChatModal.addEventListener("click",()=>{

    chatModal.style.display = "none";

});

window.addEventListener("click",(event)=>{

    if(event.target===chatModal){

        chatModal.style.display="none";

    }

});