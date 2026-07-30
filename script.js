let images = [];
let displayedImages = [];

const gallery = document.getElementById("gallery");
const searchBox = document.getElementById("searchBox");
const noResults = document.getElementById("noResults");


// Load images.json

async function loadImages(){

    try{

        const response = await fetch("images.json");

        images = await response.json();

        showRandomImages();

    }

    catch(error){

        console.error("Could not load images.json:", error);

        gallery.innerHTML =
        "<p>Failed to load images.</p>";

    }

}



// Pick 50 random images

function showRandomImages(){

    displayedImages = [...images]
        .sort(() => Math.random() - 0.5)
        .slice(0,50);

    displayGallery(displayedImages);

}



// Display images

function displayGallery(list){

    gallery.innerHTML = "";

    if(list.length === 0){

        noResults.style.display = "block";

        return;

    }

    noResults.style.display = "none";


    list.forEach(image => {


        const card = document.createElement("div");

        card.className = "card";


        const img = document.createElement("img");

        img.src = image.url;

        img.loading = "lazy";

        img.alt = image.name;



        const title = document.createElement("div");

        title.className = "cardTitle";

        title.textContent = image.name;



        card.appendChild(img);

        card.appendChild(title);


        card.onclick = () => openImage(image);


        gallery.appendChild(card);


    });


}



// Search system with relevance ranking

function searchImages(query){

    query = query.toLowerCase().trim();


    if(query === ""){

        showRandomImages();

        return;

    }



    let results = images.map(image => {


        let score = 0;


        const name =
        image.name.toLowerCase();


        const tags =
        image.tags.map(tag =>
        tag.toLowerCase());



        // Exact name match

        if(name === query){

            score += 100;

        }


        // Name starts with search

        else if(name.startsWith(query)){

            score += 75;

        }


        // Name contains search

        else if(name.includes(query)){

            score += 50;

        }



        // Tag matches

        tags.forEach(tag => {


            if(tag === query){

                score += 40;

            }

            else if(tag.includes(query)){

                score += 20;

            }


        });



        return {
            image:image,
            score:score
        };


    });



    results = results
    .filter(item => item.score > 0)
    .sort((a,b)=>b.score-a.score);



    displayedImages =
    results.map(item=>item.image);



    displayGallery(displayedImages);


}



// Search while typing

searchBox.addEventListener(
"input",
()=>{

    searchImages(searchBox.value);

});



// Start website

loadImages();

// Image viewer elements

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const downloadBtn = document.getElementById("downloadBtn");
const closeBtn = document.getElementById("closeBtn");



// Open image viewer

function openImage(image){

    modal.style.display = "flex";

    modalImage.src = image.url;

    modalTitle.textContent = image.name;

    modalAuthor.textContent =
    "By " + image.author;


    downloadBtn.href = image.url;

    downloadBtn.download =
    image.name;


}



// Close image viewer

function closeImage(){

    modal.style.display = "none";

    modalImage.src = "";

}



// Close button

closeBtn.addEventListener(
"click",
()=>{

    closeImage();

});



// Close when clicking outside image

modal.addEventListener(
"click",
(event)=>{

    if(event.target === modal){

        closeImage();

    }

});



// Escape key closes viewer

document.addEventListener(
"keydown",
(event)=>{

    if(event.key === "Escape"){

        closeImage();

    }

});