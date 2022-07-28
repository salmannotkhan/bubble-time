(function (){
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const intersectionObserver = new IntersectionObserver(observer);
    const scoreBoard = document.getElementById("scoreBoard")
    const livesBoard = document.getElementById("lives")
    const letterMap = {};
    let score = 0;
    let lives = 3;

    function observer(entries) {
        const fallenLetters = entries.filter(entry => !entry.isIntersecting);
        fallenLetters.forEach(letter => {
            letter.target.remove();
            delete letterMap[letter.target.innerText];
        });
        if (!lives) {
            Object.values(letterMap).forEach(letter => {
                intersectionObserver.unobserve(letter)
            })
            alert(`Game Over. Your score was ${score}`);
            window.location.reload();
        } else {
            lives -= fallenLetters.length;
            livesBoard.innerText = lives
        }
    }

    function getRandomSpawnLocation() {
        const displayWidth = window.innerWidth - 100;
        const spawnLocation = Math.round(Math.random() * displayWidth);
        return spawnLocation + "px";
    }

    function getRandomLetter() {
        let letter = "";
        do {
            const randomIndex = Math.round(Math.random() * 25);
            letter = LETTERS[randomIndex];
        } while (letter in letterMap);
        return letter;
    }

    function getRandomColor() {
        const red = Math.random() * 255;
        const green = Math.random() * 255;
        const blue = Math.random() * 255;
        return `rgb(${red}, ${green}, ${blue})`;
    }

    function getDifficultyLevel(score) {
        const difficulty = Math.floor(score / 10) 
        return difficulty < 5 ? difficulty : 5
    }

    function setRandomTimeout(timeout) {
        setTimeout(() => {
            const letter = getRandomLetter();
            const difficulty = getDifficultyLevel(score)
            const letterElement = document.createElement("div");
            letterElement.classList.add("letter");
            letterElement.innerText = letter;
            letterElement.style.left = getRandomSpawnLocation();
            letterElement.style.backgroundColor= getRandomColor();
            letterMap[letter] = letterElement;
            letterElement.style.animationDuration = `${12 - (difficulty * 2)}s`;
            document.body.append(letterElement);
            intersectionObserver.observe(letterElement);
            const randomTimeout = Math.random() * ((6 - difficulty) * 1000);
            if (lives) {
                setRandomTimeout(randomTimeout);
            }
        }, timeout);
    }

    window.addEventListener("keydown", function (e) {
        if (e.key.length === 1) {
            if (e.key.toUpperCase() in letterMap) {
                const letterElement = letterMap[e.key.toUpperCase()]
                intersectionObserver.unobserve(letterElement)
                letterElement.remove();
                delete letterMap[e.key.toUpperCase()]
                scoreBoard.innerText = ++score;
            } else {
                score -= 0.25;
                scoreBoard.innerText = score;
            }
        }
    })

    document.addEventListener("DOMContentLoaded", function () {
        alert("Correct keystroke = 1\nWrong keystroke = -0.25")
        const randomTimeout = Math.random() * 5000;
        setRandomTimeout(randomTimeout);
        livesBoard.innerText = lives
        scoreBoard.innerText = score
    })
})()
