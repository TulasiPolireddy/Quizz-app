/* ==========================================================
   SPORTS QUESTION BANK WITH DIFFICULTY LEVELS
   ========================================================== */
const questionsBank = [
    // CRICKET
    {
        category: "Cricket",
        difficulty: "Easy",
        question: "Which cricketer holds the record for 100 international centuries?",
        options: ["Ricky Ponting", "Sachin Tendulkar", "Virat Kohli", "Brian Lara"],
        answer: 1
    },
    {
        category: "Cricket",
        difficulty: "Medium",
        question: "Who won the inaugural ICC Men's T20 World Cup in 2007?",
        options: ["Pakistan", "Australia", "India", "West Indies"],
        answer: 2
    },
    {
        category: "Cricket",
        difficulty: "Hard",
        question: "Who is the only bowler to take 800 wickets in Test Match cricket?",
        options: ["Shane Warne", "James Anderson", "Anil Kumble", "Muttiah Muralitharan"],
        answer: 3
    },

    // FOOTBALL
    {
        category: "Football",
        difficulty: "Easy",
        question: "Which nation has won the highest number of FIFA Men's World Cup titles (5)?",
        options: ["Germany", "Italy", "Argentina", "Brazil"],
        answer: 3
    },
    {
        category: "Football",
        difficulty: "Medium",
        question: "Which club won 3 consecutive UEFA Champions League titles from 2016 to 2018?",
        options: ["FC Barcelona", "Bayern Munich", "Real Madrid", "Liverpool"],
        answer: 2
    },
    {
        category: "Football",
        difficulty: "Hard",
        question: "Which player scored the controversial 'Hand of God' goal in the 1986 World Cup?",
        options: ["Diego Maradona", "Pelé", "Zico", "Michel Platini"],
        answer: 0
    },

    // FORMULA 1
    {
        category: "F1",
        difficulty: "Easy",
        question: "What does the black and white chequered flag signify in Formula 1?",
        options: ["Race Finish", "Safety Car Deployed", "Driver Penalty", "Oil on Track"],
        answer: 0
    },
    {
        category: "F1",
        difficulty: "Medium",
        question: "Who shares the record for most World Championships (7) with Michael Schumacher?",
        options: ["Ayrton Senna", "Lewis Hamilton", "Max Verstappen", "Sebastian Vettel"],
        answer: 1
    },
    {
        category: "F1",
        difficulty: "Hard",
        question: "Which iconic racetrack features the 'Eau Rouge' and 'Raidillon' corners?",
        options: ["Monza", "Silverstone", "Spa-Francorchamps", "Suzuka"],
        answer: 2
    },

    // TENNIS
    {
        category: "Tennis",
        difficulty: "Easy",
        question: "Which Grand Slam tournament is played exclusively on natural grass courts?",
        options: ["Australian Open", "Roland Garros", "Wimbledon", "US Open"],
        answer: 2
    },
    {
        category: "Tennis",
        difficulty: "Medium",
        question: "Who is widely nicknamed the 'King of Clay' due to his French Open dominance?",
        options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Björn Borg"],
        answer: 1
    },
    {
        category: "Tennis",
        difficulty: "Hard",
        question: "In tennis scoring terminology, what number does 'Love' signify?",
        options: ["0", "15", "40", "Deuce"],
        answer: 0
    },

    // BADMINTON
    {
        category: "Badminton",
        difficulty: "Easy",
        question: "How many points must a player score to win a standard set in modern Badminton?",
        options: ["11", "15", "21", "25"],
        answer: 2
    },
    {
        category: "Badminton",
        difficulty: "Medium",
        question: "How many goose feathers are officially used to make a tournament shuttlecock?",
        options: ["12", "14", "16", "18"],
        answer: 2
    },
    {
        category: "Badminton",
        difficulty: "Hard",
        question: "Which nation holds the record for winning the most Thomas Cup (Men's Team) titles?",
        options: ["China", "Indonesia", "Malaysia", "Japan"],
        answer: 1
    }
];

/* ==========================================================
   APP STATE
   ========================================================== */
let currentUser = localStorage.getItem("sportsQuiz_user") || "";
let selectedCategory = "all";
let selectedDifficulty = "all";
let timePerQuestion = 15;

let currentQuestions = [];
let currentQuestionIndex = 0;
let userScore = 0;
let totalPointsEarned = 0;
let timerInterval = null;
let timeLeft = 0;
let userAnswersLog = []; // Stores detailed review data

// Views
const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");
const quizView = document.getElementById("quiz-view");
const resultView = document.getElementById("result-view");
const statsView = document.getElementById("stats-view");

// Elements
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const playerDisplayName = document.getElementById("player-display-name");
const logoutBtn = document.getElementById("logout-btn");
const startQuizBtn = document.getElementById("start-quiz-btn");
const categoryButtons = document.querySelectorAll(".cat-btn");
const diffButtons = document.querySelectorAll(".diff-btn");

// Quiz Elements
const quizCategoryTag = document.getElementById("quiz-category-tag");
const quizDifficultyTag = document.getElementById("quiz-difficulty-tag");
const timerDisplay = document.getElementById("timer-display");
const timerPill = document.getElementById("timer-pill");
const progressBar = document.getElementById("progress-bar");
const quizProgressText = document.getElementById("quiz-progress-text");
const quizScoreIndicator = document.getElementById("quiz-score-indicator");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");

// Result Elements
const resultBadge = document.getElementById("result-badge");
const resultMessage = document.getElementById("result-message");
const finalScore = document.getElementById("final-score");
const finalPercentage = document.getElementById("final-percentage");
const finalPoints = document.getElementById("final-points");
const reviewList = document.getElementById("review-list");
const retakeBtn = document.getElementById("retake-btn");
const dashboardBtn = document.getElementById("dashboard-btn");

// Tabs & Modals
const viewLeaderboardBtn = document.getElementById("view-leaderboard-btn");
const viewHistoryBtn = document.getElementById("view-history-btn");
const resLeaderboardBtn = document.getElementById("res-leaderboard-btn");
const closeStatsBtn = document.getElementById("close-stats-btn");
const tabLeaderboardBtn = document.getElementById("tab-leaderboard-btn");
const tabHistoryBtn = document.getElementById("tab-history-btn");
const leaderboardTab = document.getElementById("leaderboard-tab");
const historyTab = document.getElementById("history-tab");
const leaderboardBody = document.getElementById("leaderboard-body");
const historyBody = document.getElementById("history-body");
const noLeaderboardMsg = document.getElementById("no-leaderboard-msg");
const noHistoryMsg = document.getElementById("no-history-msg");
const clearHistoryBtn = document.getElementById("clear-history-btn");

/* ==========================================================
   NAVIGATION
   ========================================================== */
function switchView(targetView) {
    [loginView, dashboardView, quizView, resultView, statsView].forEach(v => v.classList.remove("active"));
    targetView.classList.add("active");
}

/* ==========================================================
   USER AUTHENTICATION
   ========================================================== */
function checkUser() {
    if (currentUser) {
        playerDisplayName.textContent = currentUser;
        switchView(dashboardView);
    } else {
        switchView(loginView);
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = usernameInput.value.trim();
    if (name) {
        currentUser = name;
        localStorage.setItem("sportsQuiz_user", name);
        playerDisplayName.textContent = currentUser;
        usernameInput.value = "";
        switchView(dashboardView);
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("sportsQuiz_user");
    currentUser = "";
    switchView(loginView);
});

/* ==========================================================
   SETTINGS SELECTION (CATEGORY & DIFFICULTY)
   ========================================================== */
categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = btn.dataset.category;
    });
});

diffButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        diffButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedDifficulty = btn.dataset.diff;
        timePerQuestion = parseInt(btn.dataset.time);
    });
});

/* ==========================================================
   TIMED QUIZ LOGIC
   ========================================================== */
startQuizBtn.addEventListener("click", startQuiz);
retakeBtn.addEventListener("click", startQuiz);

function startQuiz() {
    // Filter questions
    currentQuestions = questionsBank.filter(q => {
        const catMatch = (selectedCategory === "all") || (q.category === selectedCategory);
        const diffMatch = (selectedDifficulty === "all") || (q.difficulty === selectedDifficulty);
        return catMatch && diffMatch;
    });

    if (currentQuestions.length === 0) {
        alert("No questions found for this specific combination! Starting with all questions.");
        currentQuestions = [...questionsBank];
    }

    // Shuffle
    currentQuestions.sort(() => Math.random() - 0.5);

    currentQuestionIndex = 0;
    userScore = 0;
    totalPointsEarned = 0;
    userAnswersLog = [];

    switchView(quizView);
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    const q = currentQuestions[currentQuestionIndex];
    nextBtn.disabled = true;
    timerPill.classList.remove("urgent");

    // UI Updates
    quizCategoryTag.textContent = q.category;
    quizDifficultyTag.textContent = q.difficulty;
    quizProgressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    quizScoreIndicator.textContent = `Points: ${totalPointsEarned}`;
    progressBar.style.width = `${((currentQuestionIndex) / currentQuestions.length) * 100}%`;
    questionText.textContent = q.question;

    // Render Options
    optionsContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = opt;
        btn.addEventListener("click", () => handleAnswer(idx, btn));
        optionsContainer.appendChild(btn);
    });

    nextBtn.textContent = (currentQuestionIndex === currentQuestions.length - 1) ? "Finish Match 🏁" : "Next Question →";

    // Start Timer
    startTimer();
}

function startTimer() {
    timeLeft = timePerQuestion;
    timerDisplay.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 4) {
            timerPill.classList.add("urgent");
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    const q = currentQuestions[currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll(".option-btn");

    allBtns.forEach(btn => btn.classList.add("disabled"));
    allBtns[q.answer].classList.add("correct");

    // Log timeout answer as wrong
    userAnswersLog.push({
        question: q.question,
        category: q.category,
        userAnswer: "⏰ Time Expired",
        correctAnswer: q.options[q.answer],
        isCorrect: false
    });

    nextBtn.disabled = false;
}

function handleAnswer(selectedIndex, button) {
    clearInterval(timerInterval);
    const q = currentQuestions[currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll(".option-btn");

    allBtns.forEach(btn => btn.classList.add("disabled"));

    const isCorrect = (selectedIndex === q.answer);

    // Point Multiplier based on difficulty
    let points = 10;
    if (q.difficulty === "Medium") points = 15;
    if (q.difficulty === "Hard") points = 20;

    if (isCorrect) {
        button.classList.add("correct");
        userScore++;
        totalPointsEarned += points;
    } else {
        button.classList.add("wrong");
        allBtns[q.answer].classList.add("correct");
    }

    quizScoreIndicator.textContent = `Points: ${totalPointsEarned}`;

    // Record for Review breakdown
    userAnswersLog.push({
        question: q.question,
        category: q.category,
        userAnswer: q.options[selectedIndex],
        correctAnswer: q.options[q.answer],
        isCorrect: isCorrect
    });

    nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
});

/* ==========================================================
   RESULTS & REVIEW PRESENTATION
   ========================================================== */
function showResults() {
    clearInterval(timerInterval);
    progressBar.style.width = "100%";
    const total = currentQuestions.length;
    const percentage = Math.round((userScore / total) * 100);

    finalScore.textContent = `${userScore}/${total}`;
    finalPercentage.textContent = `${percentage}%`;
    finalPoints.textContent = totalPointsEarned;

    if (percentage >= 80) {
        resultBadge.textContent = "🥇";
        resultMessage.textContent = "World-Class Champion! Flawless execution.";
    } else if (percentage >= 50) {
        resultBadge.textContent = "🥈";
        resultMessage.textContent = "Great Match! You gave a strong fight on the pitch.";
    } else {
        resultBadge.textContent = "🥉";
        resultMessage.textContent = "Needs more training! Hit the practice nets and try again.";
    }

    // Build Detailed Review Breakdown
    renderAnswerReview();

    // Save records
    saveHistory(selectedCategory, selectedDifficulty, userScore, total, percentage, totalPointsEarned);
    saveToLeaderboard(currentUser, selectedCategory, selectedDifficulty, userScore, total, totalPointsEarned);

    switchView(resultView);
}

function renderAnswerReview() {
    reviewList.innerHTML = "";
    userAnswersLog.forEach((log, idx) => {
        const item = document.createElement("div");
        item.classList.add("review-item", log.isCorrect ? "is-correct" : "is-wrong");

        item.innerHTML = `
            <div class="review-q-title">${idx + 1}. ${log.question}</div>
            <div class="review-ans-row">
                <span class="ans-text-user ${log.isCorrect ? 'correct-match' : ''}">
                    <strong>Your Answer:</strong> ${log.userAnswer} ${log.isCorrect ? '✓' : '✗'}
                </span>
                ${!log.isCorrect ? `<span class="ans-text-correct"><strong>Correct Answer:</strong> ${log.correctAnswer}</span>` : ''}
            </div>
        `;
        reviewList.appendChild(item);
    });
}

dashboardBtn.addEventListener("click", () => switchView(dashboardView));

/* ==========================================================
   PERSISTENCE: LEADERBOARD & USER HISTORY
   ========================================================== */
function saveHistory(cat, diff, score, total, percentage, points) {
    const key = `sportsQuiz_history_${currentUser}`;
    const history = JSON.parse(localStorage.getItem(key)) || [];
    history.unshift({
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        category: cat === "all" ? "All Sports" : cat,
        difficulty: diff === "all" ? "Mixed" : diff,
        accuracy: `${score}/${total} (${percentage}%)`,
        points: points
    });
    localStorage.setItem(key, JSON.stringify(history));
}

function saveToLeaderboard(user, cat, diff, score, total, points) {
    const key = "sportsQuiz_global_leaderboard";
    const leaderboard = JSON.parse(localStorage.getItem(key)) || [];
    
    leaderboard.push({
        user: user,
        category: cat === "all" ? "All Sports" : cat,
        difficulty: diff === "all" ? "Mixed" : diff,
        score: `${score}/${total}`,
        points: points,
        timestamp: Date.now()
    });

    // Sort leaderboard by Points (Descending)
    leaderboard.sort((a, b) => b.points - a.points);
    localStorage.setItem(key, JSON.stringify(leaderboard.slice(0, 30))); // Top 30
}

function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("sportsQuiz_global_leaderboard")) || [];
    leaderboardBody.innerHTML = "";

    if (leaderboard.length === 0) {
        noLeaderboardMsg.style.display = "block";
    } else {
        noLeaderboardMsg.style.display = "none";
        leaderboard.forEach((entry, idx) => {
            let medal = `#${idx + 1}`;
            if (idx === 0) medal = "🥇 1st";
            if (idx === 1) medal = "🥈 2nd";
            if (idx === 2) medal = "🥉 3rd";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="rank-badge">${medal}</span></td>
                <td><strong>${entry.user}</strong></td>
                <td>${entry.category}</td>
                <td><span class="badge" style="margin:0">${entry.difficulty}</span></td>
                <td>${entry.score}</td>
                <td style="color:var(--primary); font-weight:700;">${entry.points}</td>
            `;
            leaderboardBody.appendChild(tr);
        });
    }
}

function renderHistory() {
    const key = `sportsQuiz_history_${currentUser}`;
    const history = JSON.parse(localStorage.getItem(key)) || [];
    historyBody.innerHTML = "";

    if (history.length === 0) {
        noHistoryMsg.style.display = "block";
    } else {
        noHistoryMsg.style.display = "none";
        history.forEach(entry => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.category}</td>
                <td><span class="badge" style="margin:0">${entry.difficulty}</span></td>
                <td>${entry.accuracy}</td>
                <td style="color:var(--primary); font-weight:700;">${entry.points}</td>
            `;
            historyBody.appendChild(tr);
        });
    }
}

/* Tab Event Listeners */
function openStats(tab) {
    if (tab === "leaderboard") {
        tabLeaderboardBtn.classList.add("active");
        tabHistoryBtn.classList.remove("active");
        leaderboardTab.classList.add("active");
        historyTab.classList.remove("active");
        renderLeaderboard();
    } else {
        tabHistoryBtn.classList.add("active");
        tabLeaderboardBtn.classList.remove("active");
        historyTab.classList.add("active");
        leaderboardTab.classList.remove("active");
        renderHistory();
    }
    switchView(statsView);
}

viewLeaderboardBtn.addEventListener("click", () => openStats("leaderboard"));
resLeaderboardBtn.addEventListener("click", () => openStats("leaderboard"));
viewHistoryBtn.addEventListener("click", () => openStats("history"));

tabLeaderboardBtn.addEventListener("click", () => openStats("leaderboard"));
tabHistoryBtn.addEventListener("click", () => openStats("history"));

closeStatsBtn.addEventListener("click", () => switchView(dashboardView));

clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your attempt history?")) {
        localStorage.removeItem(`sportsQuiz_history_${currentUser}`);
        renderHistory();
    }
});

// Initialize
checkUser();
