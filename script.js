// ======================================================
// DAILY BRIEF v1.4
// ======================================================


// ======================
// API KEY
// ======================

const apiKey = "f23f993e9bc3a472ac66a0775f519f4d";

const geminiApiKey = "AQ.Ab8RN6JDRF5TJUZADFTur6z1W_Ijpt-WWymCXCaV3RunuSVS6g";

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

        ✨ AI Summary

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

    const prompt = `
You are a professional news analyst.

Read the news below and answer ONLY in this format.

What happened:
...

Background:
...

Latest Update:
...

Why it matters:
...

Keep every section short.
Use simple English.
Do NOT invent facts.
If something is missing, write:
"Not mentioned in the article."

Title:
${article.title}

Description:
${article.description}
`;

    try{

        const response = await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                contents:[

                    {

                        parts:[

                            {

                                text:prompt

                            }

                        ]

                    }

                ]

            })

        });

        console.log("Status:", response.status);

const data = await response.json();

console.log("Gemini Response:", data);

return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    catch(error){

        console.log(error);

        return "Unable to generate AI summary.";

    }

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

const summaryTitle = document.getElementById("summaryTitle");

const summaryProblem = document.getElementById("summaryProblem");

const summaryBackground = document.getElementById("summaryBackground");

const summaryLatest = document.getElementById("summaryLatest");

const summaryImportance = document.getElementById("summaryImportance");

const summaryReadBtn = document.getElementById("summaryReadBtn");


async function showSummary(index){

    const article = currentArticles[index + 1];

    summaryTitle.innerText = article.title;

    summaryProblem.innerText = "Generating AI Summary...";

summaryBackground.innerText = "";

summaryLatest.innerText = "";

summaryImportance.innerText = "";

summaryModal.style.display = "flex";

const aiSummary = await generateAISummary(article);

const sections = aiSummary.split("\n");

summaryProblem.innerText = "";

summaryBackground.innerText = "";

summaryLatest.innerText = "";

summaryImportance.innerText = "";

sections.forEach(line=>{

    if(line.startsWith("What happened")){

        summaryProblem.innerText =
        line.replace("What happened:","").trim();

    }

    else if(line.startsWith("Background")){

        summaryBackground.innerText =
        line.replace("Background:","").trim();

    }

    else if(line.startsWith("Latest Update")){

        summaryLatest.innerText =
        line.replace("Latest Update:","").trim();

    }

    else if(line.startsWith("Why it matters")){

        summaryImportance.innerText =
        line.replace("Why it matters:","").trim();

    }

});


    summaryReadBtn.onclick = () => {

        window.open(article.url, "_blank");

    };

    summaryModal.style.display = "flex";

}


// Close button

closeModal.onclick = () => {

    summaryModal.style.display = "none";

};


// Close when clicking outside

window.onclick = (event) => {

    if(event.target === summaryModal){

        summaryModal.style.display = "none";

    }

};

