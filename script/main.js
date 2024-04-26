//1. 영화 API 이용하여 데이터 들여오기 V
//1-1. 영화 정보 카드리스트 UI (제목, 내용, 이미지, 평점) V
//1-2. 카드 클릭 시 id를 alert로 띄우기
//2. 버튼 동작
//2-1. 검색 동작

//------------- 상기 목록은 필수 요건------------------

//2-2. 전체 목록 동작 (일정 카테고리로 나누어서 표현되도록) (부가)
//2-3. 다크모드 (부가)


/* 카드 리스트 만들기 */
const listUp = ["now_playing", "popular", "top_rated", "upcoming"];
const listName = document.querySelectorAll('.listname'); //리스트 타이틀
let main = document.querySelector('main');
let body = document.querySelector('body');

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTE4NTdhNTg1MThiOWVjZWRjMzE4ZDVkYjE1OWRkOSIsInN1YiI6IjY2MjhhZmRmNjNkOTM3MDE0YTcyMmMxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZrKj2Zyb565lbyPKH1RQSzBsq3AYrMAoFe7QZKm-P2Q'
    }
};

listUp.forEach(elem => {
        function spreadContents(listNum) {
            let listingSection = listName.item(listNum).nextSibling.nextSibling.childNodes.item(1)

            fetch(`https://api.themoviedb.org/3/movie/${elem}?language=ko&page=1`, options)
            .then(response => response.json())
            .then(data => {
                for(let contentCount = 0; contentCount < Object.keys(data['results']).length; contentCount++) {              
                    const title = data['results'][contentCount]['title'];
                    const originalTitle = data['results'][contentCount]['original_title'];
                    const releaseDate = data['results'][contentCount]['release_date'];
                    const overview = data['results'][contentCount]['overview'];
                    const voteAverage = data['results'][contentCount]['vote_average'];
                    const movieId = data['results'][contentCount]['id']
        
                    let movieCard = `
                    <li class="movie_card">
                        <p class="movie_bg">영화 포스터</p>
                        <h3 class="movie_name">${title}</h3>
                        <h4 class="original_name">${originalTitle}</h4>
                        <p class="release_date">${releaseDate.slice(0, 4)}</p>
                        <p class="movie_detail">${overview || "등록된 줄거리가 없습니다."}</p>
                        <p class="movie_rate">⭐&nbsp;${voteAverage.toFixed(1)}</p>
                        <p class="movie_id">${movieId}</p>
                    </li>
                    `;
                    listingSection.innerHTML += movieCard;
                };

                for(let contentCount = 0; contentCount < Object.keys(data['results']).length; contentCount++) {
                    const backdropPath = data['results'][contentCount]['backdrop_path'];
                    
                    const backdropOnBgs = listingSection.querySelectorAll('.movie_card .movie_bg');
        
                    backdropOnBgs.item(contentCount).setAttribute("style", `background-image: url(https://image.tmdb.org/t/p/w500${backdropPath});`); //background-image 속성으로 배경 지정
                };
            });
        }; // 들어온 영화 데이터를 카드 형식으로 만들어서 해당 섹션에 배치시켜주는 함수

        switch (elem) {
            case "now_playing":
                spreadContents(0);
                break
            case "popular":
                spreadContents(1);
                break
            case "top_rated":
                spreadContents(2);
                break
            case "upcoming":
                spreadContents(3);
                break
        }; // 들어오는 URL의 첫번째 쿼리값(영화 리스트업 조건)에 따라 서로 다른 섹션에 컨텐츠를 배치한다.
}); // 4개의 카테고리의 각 1페이지의 컨텐츠들을 해당 영역에 배치

main.addEventListener('click', (e) => {
    if(e.target.parentNode.className === "movie_card") {
        const movieId = e.target.parentNode.childNodes.item(13).innerText;
        alert(`영화 ID는 ${movieId} 입니다.`); 
    }; // 클릭한 타켓의 부모노드의 클래스 이름이 "movie_card" 일때만 alert 출력 (다른 곳을 이벤트 발생 시 콘솔에 출력되는 오류 방지)
});
// 영화 카드의 ID 출력




/* dynamic button action */
const searchBtn = document.querySelector('.search');
const cancelIcon = searchBtn.querySelector('.fa-xmark');
const magnifyIcon = searchBtn.querySelector('.fa-magnifying-glass');
const totalBtn = document.querySelector('.total');
const darkmodeBtn = document.querySelector('.darkmode');

const inputWrap = document.querySelector('.input_wrap');
const searchInput = inputWrap.querySelector('input');

let isClicked = false;

searchBtn.addEventListener('click', () => {
    isClicked = !isClicked;
    searchInputToggle(isClicked);
});

function searchInputToggle(isClicked) {
    if(isClicked) {
        console.log('눌림')
        inputWrap.style.opacity = '1';
        inputWrap.style.left = '100px';
        cancelIcon.style.opacity = "1";
        cancelIcon.style.textIndent = "0";
        magnifyIcon.style.opacity = "0";
        magnifyIcon.style.textIndent = "-99999px";
    } else {
        console.log('눌림2')
        inputWrap.style.opacity = '0';
        inputWrap.style.left = '-99999px';
        cancelIcon.style.opacity = "0";
        cancelIcon.style.textIndent = "-99999px";
        magnifyIcon.style.opacity = "1";
        magnifyIcon.style.textIndent = "0";
        //검색창이 나온 상태에서 esc를 누르면 취소된다.
    }
}

body.addEventListener('keydown', (e) => {
    if(e.key === "Escape") {
        isClicked = !isClicked;
        searchInputToggle(isClicked);
    }
});

//search action
// 받아온 db에 대해 검색은 어떻게 이루어질까
// 1. input을 통해 사용자가 입력한 텍스트를 받는다.
// 2. 받은 텍스트로 이름을 찾는다. (공백은 무시한다. 한글 1자 이상의 텍스트를 받는다. 자/모음 단독 검색은 불가)
// 3. 찾은 이름의 영화 카드를 리스트업한다.
// 4. 리스트업이 완료되면 화면에 띄운다.


searchInput.addEventListener('keydown',(e) => {

    // enter : 검색 동작
    if(e.key === "Enter") {
        console.log('검색한다')
        

        // function searchToTitle() {
        //     fetch(`https://api.themoviedb.org/3/movie/${listUp}?language=ko&page=1`, options)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
                
        //         });
                
        //     }
    }

    // esc : 검색 아이콘을 한번 더 누르는 동작

});