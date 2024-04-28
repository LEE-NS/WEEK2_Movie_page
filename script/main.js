//1. 영화 API 이용하여 데이터 들여오기 V
//1-1. 영화 정보 카드리스트 UI (제목, 내용, 이미지, 평점) V
//1-2. 카드 클릭 시 id를 alert로 띄우기 V
//2. 버튼 동작
//2-1. 검색 동작 V
//search action
// 받아온 db에 대해 검색은 어떻게 이루어질까
// 1. input을 통해 사용자가 입력한 텍스트를 받는다.
// 2. 받은 텍스트로 이름을 찾는다. (공백은 무시한다. 한글 1자 이상의 텍스트를 받는다. 자/모음 단독 검색은 불가)
// 3. 찾은 이름의 영화 카드를 리스트업한다.
// 4. 리스트업이 완료되면 화면에 띄운다.

//------------- 상기 목록은 필수 요건------------------

//2-2. 다크모드 (부가) V


/* 카드 리스트 만들기 */

const main = document.querySelector('main');
const body = document.querySelector('body');
const footer = document.querySelector('footer');
const headerNav = document.querySelector('#header_wrap header ul');
const modal = document.querySelector('.modal_wrap');

const spinnerOuter = document.querySelector('.loading_spinner');
const spinnerInner = document.querySelector('.spinner_inner');

let movieListWrap = main.querySelector('.movie_list_wrap');
const listUp = ["now_playing", "popular", "top_rated", "upcoming"];
const listName = document.querySelectorAll('.listname'); //리스트 타이틀

const key = process.env.API_KEY;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: API_KEY,
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
                    const backdropPath = data['results'][contentCount]['backdrop_path'];
        
                    let movieCard = `
                    <li class="movie_card">
                        <p class="movie_bg">
                            <img src="https://image.tmdb.org/t/p/w500${backdropPath}" alt="">
                        </p>
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
        const movieName = e.target.parentNode.childNodes.item(3).innerText;
        const movieId = e.target.parentNode.childNodes.item(13).innerText;

        let modalMovieName = modal.querySelector('.m_name');
        let modalMovieId = modal.querySelector('.m_id');
        let modalConfirm = modal.querySelector('.confirm');

        modal.style.display = "block"
        modalMovieName.innerHTML += `'${movieName}'`;
        modalMovieId.innerHTML += movieId;

        modalConfirm.addEventListener('click', () => {
            modalMovieName.innerHTML = '';
            modalMovieId.innerHTML = '';
            modal.style.display = "none";
        });

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

let isClickedLight = false;
let isClickedSearch = false;

totalBtn.addEventListener('click', () => {
    window.location.reload();
})

searchBtn.addEventListener('click', () => {
    isClickedSearch = !isClickedSearch;
    searchInputToggle(isClickedSearch);
});

darkmodeBtn.addEventListener('click', () => {
    isClickedLight = !isClickedLight;
    if(isClickedLight) {
        headerNav.style.backgroundColor = "#d9d9d9";
        body.style.backgroundColor = "#f1f1f1";
        footer.style.color = "#53464b";
        
        listName.forEach((elem) => {
            elem.style.color = "#53464b";
        });
    } else {
        headerNav.style.backgroundColor = "#272727";
        body.style.backgroundColor = "#0c0c0c";
        footer.style.color = "#aa9ca1";
        
        listName.forEach((elem) => {
            elem.style.color = "#b4a0a7";
        });
    }
})

function searchInputToggle(isClickedSearch) {
    if(isClickedSearch) {
        inputWrap.style.opacity = '1';
        inputWrap.style.left = '100px';
        cancelIcon.style.opacity = "1";
        cancelIcon.style.textIndent = "0";
        magnifyIcon.style.opacity = "0";
        magnifyIcon.style.textIndent = "-99999px";
    } else {
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
        inputWrap.style.opacity = '0';
        inputWrap.style.left = '-99999px';
        cancelIcon.style.opacity = "0";
        cancelIcon.style.textIndent = "-99999px";
        magnifyIcon.style.opacity = "1";
        magnifyIcon.style.textIndent = "0";
        isClickedSearch = false;
    }
});

let isSpin = false;

function spinner(isSpin) {
    isSpin === !isSpin
    if(isSpin) {
        spinnerOuter.setAttribute('style', 'display: none;');
        spinnerInner.setAttribute('style', 'display: none;');
    } else {
        spinnerOuter.setAttribute('style', 'display: block;');
        spinnerInner.setAttribute('style', 'display: block;');
    };
}; // 로딩 스피너 토글

searchInput.addEventListener('keydown', (e) => {
    // enter : 검색 동작
    if(e.key === "Enter") {
        let text = searchInput.value;
        if(text === '') {
            alert('검색어를 입력해주세요')
            searchInput.focus();
            return
        }
        let promise = new Promise((resolve, reject) => {
            resolve(searchToTitle(text));
        });

        spinner(isSpin); // 검색 중인 1초동안 로딩 스피너가 돌아간다.

        promise
        .then((resultArr) => {
            setTimeout(() => {
                searchResult(resultArr, text); // 검색 결과 표시
                spinner(!isSpin) // 로딩 스피너 제거
                isClickedSearch = !isClickedSearch;
                searchInputToggle(isClickedSearch); // input 영역 제거
                 //검색 버튼 동작 off
            }, 1000);
        });
    };        
});


 /* searchTotitle이 끝나고 나서 실행 */
function searchToTitle(text) {
    
    const modText = text.toUpperCase().split(' ').join('');
    let allTitles = [];

    listUp.forEach(elem => {
        fetch(`https://api.themoviedb.org/3/movie/${elem}?language=ko&page=1`, options)
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < Object.keys(data['results']).length; i++) {
                //저장할 객체의 타이틀 프로퍼티에 접근해서 찾기
                let titleData = data['results'][i]['title'];
                let modTitleData = titleData.toUpperCase().split(' ').join(''); //공백 없는 영화 타이틀
                let titleArrSize = modTitleData.length - modText.length + 1;
                let splitedTitle = []; // ex)'쇼생크 탈출' 검색을 위해 '쇼생'을 입력했다면 ['쇼생', '생크', '크탈', '탈출'] 과 같이 들어와야한다.

                for(let j = 0; j < titleArrSize; j++) {
                    splitedTitle.push(modTitleData.substring(j, j + modText.length));
                };

                if(splitedTitle.includes(modText)) {
                    allTitles.push(titleData); 
                }; //입력된 텍스트가 같은 음절 수로 나눠진 대상의 배열에 있다면 results 배열에 넣는다.
            };    
        });
    });
    return allTitles // 중복이 포함된 배열 allTitles 반환
};

function searchResult(allTitles, text) {
    
    let uniqTitles = allTitles.filter((elem, index) => {
        return allTitles.indexOf(elem) === index
    }); //중복 요소 제거
    
    let resultArea = `
    <div class="movie_list_place">
        <h2 class="listname">'${text}' 에 대한 검색 결과<span class="result_num">${uniqTitles.length}개</span></h2>
        <div class="list_wrap">
            <ul></ul>
        </div>
    </div>
    `;

    movieListWrap.innerHTML = '';
    movieListWrap.innerHTML += resultArea;
    //검색 결과 표시 공간 확보    
    
    listUp.forEach(elem => {
        fetch(`https://api.themoviedb.org/3/movie/${elem}?language=ko&page=1`, options)
        .then(response => response.json())
        .then(data => {
            for(let contentCount = 0; contentCount < Object.keys(data['results']).length; contentCount++) {
                
                let searchResultArea = movieListWrap.childNodes[1].childNodes[3].childNodes[1];
                const title = data['results'][contentCount]['title'];
                
                if(uniqTitles.includes(title) && uniqTitles.length !== 0) {
                    const originalTitle = data['results'][contentCount]['original_title'];
                    const releaseDate = data['results'][contentCount]['release_date'];
                    const overview = data['results'][contentCount]['overview'];
                    const voteAverage = data['results'][contentCount]['vote_average'];
                    const movieId = data['results'][contentCount]['id'];
                    const backdropPath = data['results'][contentCount]['backdrop_path'];

                    let movieCard = `
                    <li class="movie_card">
                        <p class="movie_bg">
                            <img src="https://image.tmdb.org/t/p/w500${backdropPath}" alt="">
                        </p>
                        <h3 class="movie_name">${title}</h3>
                        <h4 class="original_name">${originalTitle}</h4>
                        <p class="release_date">${releaseDate.slice(0, 4)}</p>
                        <p class="movie_detail">${overview || "등록된 줄거리가 없습니다."}</p>
                        <p class="movie_rate">⭐&nbsp;${voteAverage.toFixed(1)}</p>
                        <p class="movie_id">${movieId}</p>
                    </li>
                    `;

                    searchResultArea.innerHTML += movieCard; // 검색 결과에 해당하는 영화 카드가 들어온다.

                    uniqTitles.splice(uniqTitles.indexOf(title), 1); // 등록이 끝난 요소는 배열에서 제거
                    continue
                } else if ( uniqTitles.length === 0) {
                    break
                }
            };
        });
    });
    return "success"
};

    











