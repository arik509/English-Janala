const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el} </span>`);
    return(htmlElements.join(" "));
} 

const manageSpinner = (status) => {
    if(status){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }
    else{
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden');
    }
}


const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLesson(json.data));
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    lessonButtons.forEach(btn => btn.classList.remove("active"))
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
    console.log(word);
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
    <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
</div>
<div class="">
    <h2 class="font-bold">Meaning</h2>
    <p>${word.meaning}</p>
</div>
<div class="">
    <h2 class="font-bold">Example</h2>
    <p>${word.sentence}</p>
</div>
<div class="">
    <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
    <div class="">${createElements(word.synonyms)}</div>
</div>


    `
    document.getElementById("word_modal").showModal();
}

const displayLesson = (lessons) => {
    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML = "";

    for (lesson of lessons) {
        const btnDiv = document.createElement("div");

        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
          <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>
        `

        levelContainer.appendChild(btnDiv)
    }
}

loadLessons();



const loadLevelWord = (id) => {
    manageSpinner(true);

    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");
            displayLoadLevelWord(data.data);
        });
}

const displayLoadLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-3">
        <p class="text-8xl text-gray-400"><i class="fa-solid fa-triangle-exclamation"></i> </p>
        <p class="text-xl font-medium text-gray-600 bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-4xl font-medium text-gray-900 bangla">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <p class="text-2xl font-medium bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}"</p>
            <div class="flex justify-between items-center">
                <button  onclick="loadWordDetail(${word.id})" class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1a91ff1a] hover:bg-[#1a91ffcc]"><i class="fa-solid fa-volume-high"></i></button>
            </div> 
        </div>
        
        `
        wordContainer.appendChild(card);

        manageSpinner(false);
    });
}
