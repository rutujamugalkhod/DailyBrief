// ============================================
// DAILY BRIEF
// bookmarks.js
// ============================================

const bookmarkGrid = document.getElementById("bookmarkGrid");

let savedNews = JSON.parse(localStorage.getItem("savedNews")) || [];

displayBookmarks();


// ============================================
// DISPLAY BOOKMARKS
// ============================================

function displayBookmarks(){

    bookmarkGrid.innerHTML = "";

    if(savedNews.length === 0){

        bookmarkGrid.innerHTML = `

            <div style="grid-column:1/-1;text-align:center;padding:60px;">

                <h2>📭 No Bookmarked Articles</h2>

                <p>You haven't saved any news yet.</p>

                <br>

                <button onclick="window.location.href='index.html'">

                    Browse News

                </button>

            </div>

        `;

        return;

    }

    savedNews.forEach((article,index)=>{

        bookmarkGrid.innerHTML += `

        <div class="news-card">

            <img
                src="${article.image || 'assets/images/no-image.jpg'}"
                alt="News">

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
                    onclick="window.open('${article.url}','_blank')">

                    Read Article →

                </button>

                <button
                    class="save-btn"
                    onclick="removeBookmark(${index})">

                    🗑 Remove

                </button>

            </div>

        </div>

        `;

    });

}


// ============================================
// REMOVE BOOKMARK
// ============================================

function removeBookmark(index){

    if(confirm("Remove this article from Bookmarks?")){

        savedNews.splice(index,1);

        localStorage.setItem(

            "savedNews",

            JSON.stringify(savedNews)

        );

        displayBookmarks();

    }

}