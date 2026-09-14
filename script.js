/* ==========================================================
   SPORTS QUIZ QUESTION BANK (Cricket, Football, F1, Tennis, Badminton)
   ========================================================== */
const questionsBank = [
    // CRICKET
    {
        category: "Cricket",
        question: "Which cricketer has scored 100 international centuries?",
        options: ["Ricky Ponting", "Sachin Tendulkar", "Virat Kohli", "Brian Lara"],
        answer: 1
    },
    {
        category: "Cricket",
        question: "Who won the first-ever ICC Men's T20 World Cup in 2007?",
        options: ["Pakistan", "Australia", "India", "West Indies"],
        answer: 2
    },
    {
        category: "Cricket",
        question: "How many fielders are allowed outside the 30-yard circle in standard T20 powerplays?",
        options: ["2", "3", "4", "5"],
        answer: 0
    },

    // FOOTBALL
    {
        category: "Football",
        question: "Which country has won the most FIFA World Cup titles?",
        options: ["Germany", "Italy", "Argentina", "Brazil"],
        answer: 3
    },
    {
        category: "Football",
        question: "Who won the FIFA World Cup Golden Ball in 2022?",
        options: ["Kylian Mbappé", "Lionel Messi", "Luka Modrić", "Cristiano Ronaldo"],
        answer: 1
    },
    {
        category: "Football",
        question: "Which club has won the most UEFA Champions League titles?",
        options: ["AC Milan", "Bayern Munich", "Real Madrid", "Liverpool"],
        answer: 2
    },

    // FORMULA 1
    {
        category: "F1",
        question: "Who shares the record for the most F1 World Championships (7 titles) with Michael Schumacher?",
        options: ["Ayrton Senna", "Lewis Hamilton", "Sebastian Vettel", "Max Verstappen"],
        answer: 1
    },
    {
        category: "F1",
        question: "What does the black and white checkered flag signal in Formula 1?",
        options: ["Safety Car deployed", "Session / Race finish", "Driver disqualified", "Debris on track"],
        answer: 1
    },
    {
        category: "F1",
        question: "Which track is famously known as the 'Temple of Speed'?",
        options: ["Silverstone", "Monza", "Spa-Francorchamps", "Suzuka"],
        answer: 1
    },

    // TENNIS
    {
        category: "Tennis",
        question: "Which Grand Slam tennis tournament is played on traditional grass courts?",
        options: ["Australian Open", "Roland Garros (French Open)", "Wimbledon", "US Open"],
        answer: 2
    },
    {
        category: "Tennis",
        question: "Who is popularly known as the 'King of Clay' in Tennis?",
        options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Carlos Alcaraz"],
        answer: 1
    },
    {
        category: "Tennis",
        question: "What score is represented by the term 'Love' in tennis?",
        options: ["0", "15", "40", "Deuce"],
        answer: 0
    },

    // BADMINTON
    {
        category: "Badminton",
        question: "How many feathers are traditionally used to make an authentic feather shuttlecock?",
        options: ["12", "14", "16", "18"],
        answer: 2
    },
    {
        category: "Badminton",
        question: "Which nation has won the most Thomas Cup (Men's Team) titles?",
        options: ["China", "Indonesia", "Malaysia", "Denmark"],
        answer: 1
    },
    {
        category: "Badminton",
        question: "A standard game in a Badminton match is played up to how many points?",
        options: ["15", "21", "25", "30"],
        answer: 1
    }
];

/* ==========================================================
   APPLICATION STATE & DOM REFERENCES
   ========================================================== */
let currentUser = localStorage.getItem("sportsQuiz_user") || "";
let selectedCategory = "all";
let currentQuestions = [];
let currentQuestionIndex = 0;
let userScore = 0;
let selectedOptionIndex = null;

// Views
const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");
const quizView = document.getElementById("quiz-view");
const resultView = document.getElementById("result-view");
const historyView = document.getElementById("history-view");

// Elements
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const playerDisplayName = document.getElementById("player-display-name");
const logoutBtn = document.getElementById("logout-btn");
const startQuizBtn = document.getElementById("start-quiz-btn");
const viewHistoryBtn = document.getElementById("view-history-btn");
const categoryButtons = document.querySelectorAll(".cat-btn");

// Quiz Elements
const quizCategoryTag = document.getElementById("quiz-category-tag");
const quizProgressText = document.getElementById("quiz-progress-text");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");

// Result Elements
const resultBadge = document.getElementById("result-badge");
const resultMessage = document.getElementById("result-message");
const finalScore = document.getElementById("final-score");
const finalPercentage = document.getElementById("final-percentage");
const retakeBtn = document.getElementById("retake-btn");
const dashboardBtn = document.getElementById("dashboard-btn");

// History Elements
const historyTableBody = document.getElementById("history-table-body");
const noHistoryMsg = document.getElementById("no-history-msg");
const closeHistoryBtn = document.getElementById("close-history-btn");
const clearHistoryBtn = document.getElementById("clear-history-btn");

/* ==========================================================
   NAVIGATION & VIEW SWITCHING
   ========================================================== */
function switchView(targetView) {
    [loginView, dashboardView, quizView, resultView, historyView].forEach(view => {
        view.classList.remove("active");
    });
    targetView.classList.add("active");
}

/* ==========================================================
   AUTHENTICATION / USER HANDLING
   ========================================================== */
function checkExistingUser() {
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
   CATEGORY SELECTION & QUIZ SETUP
   ========================================================== */
categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = btn.dataset.category;
    });
});

startQuizBtn.addEventListener("click", startQuiz);

function startQuiz() {
    // Filter questions by category
    if (selectedCategory === "all") {
        currentQuestions = [...questionsBank];
    } else {
        currentQuestions = questionsBank.filter(q => q.category === selectedCategory);
    }

    // Shuffle questions
    currentQuestions.sort(() => Math.random() - 0.5);

    currentQuestionIndex = 0;
    userScore = 0;
    selectedOptionIndex = null;

    switchView(quizView);
    loadQuestion();
}

function loadQuestion() {
    const currentQ = currentQuestions[currentQuestionIndex];
    selectedOptionIndex = null;
    nextBtn.disabled = true;

    // Update Progress
    quizCategoryTag.textContent = currentQ.category;
    quizProgressText.textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render Question and Options
    questionText.textContent = currentQ.question;
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = opt;
        btn.addEventListener("click", () => selectOption(index, btn));
        optionsContainer.appendChild(btn);
    });

    if (currentQuestionIndex === currentQuestions.length - 1) {
        nextBtn.textContent = "Finish Quiz 🏁";
    } else {
        nextBtn.textContent = "Next Question →";
    }
}

function selectOption(index, button) {
    if (selectedOptionIndex !== null) return; // Prevent changing answer after selection

    selectedOptionIndex = index;
    const currentQ = currentQuestions[currentQuestionIndex];
    const allOptionButtons = optionsContainer.querySelectorAll(".option-btn");

    allOptionButtons.forEach(btn => btn.classList.add("disabled"));

    if (index === currentQ.answer) {
        button.classList.add("correct");
        userScore++;
    } else {
        button.classList.add("wrong");
        // Highlight correct answer
        allOptionButtons[currentQ.answer].classList.add("correct");
    }

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
   SCORE CALCULATION & RESULT SCREEN
   ========================================================== */
function showResults() {
    progressBar.style.width = "100%";
    const total = currentQuestions.length;
    const percentage = Math.round((userScore / total) * 100);

    finalScore.textContent = `${userScore}/${total}`;
    finalPercentage.textContent = `${percentage}%`;

    // Customize feedback message
    if (percentage >= 80) {
        resultBadge.textContent = "🏆";
        resultMessage.textContent = "Outstanding Performance! You are a true Sports MVP!";
    } else if (percentage >= 50) {
        resultBadge.textContent = "🎖️";
        resultMessage.textContent = "Solid Play! Good effort across the field.";
    } else {
        resultBadge.textContent = "📋";
        resultMessage.textContent = "Time for more training! Better luck next match.";
    }

    saveQuizAttempt(selectedCategory, userScore, total, percentage);
    switchView(resultView);
}

retakeBtn.addEventListener("click", startQuiz);
dashboardBtn.addEventListener("click", () => switchView(dashboardView));

/* ==========================================================
   ATTEMPT HISTORY (LOCAL STORAGE)
   ========================================================== */
function saveQuizAttempt(category, score, total, percentage) {
    const attempts = JSON.parse(localStorage.getItem(`sportsQuiz_history_${currentUser}`)) || [];
    const attempt = {
        date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        category: category === "all" ? "All Sports" : category,
        score: `${score}/${total}`,
        percentage: `${percentage}%`
    };
    attempts.unshift(attempt); // newest first
    localStorage.setItem(`sportsQuiz_history_${currentUser}`, JSON.stringify(attempts));
}

function renderHistory() {
    const attempts = JSON.parse(localStorage.getItem(`sportsQuiz_history_${currentUser}`)) || [];
    historyTableBody.innerHTML = "";

    if (attempts.length === 0) {
        noHistoryMsg.style.display = "block";
    } else {
        noHistoryMsg.style.display = "none";
        attempts.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.date}</td>
                <td><span class="badge" style="margin:0">${item.category}</span></td>
                <td><strong>${item.score}</strong></td>
                <td>${item.percentage}</td>
            `;
            historyTableBody.appendChild(tr);
        });
    }
}

viewHistoryBtn.addEventListener("click", () => {
    renderHistory();
    switchView(historyView);
});

closeHistoryBtn.addEventListener("click", () => switchView(dashboardView));

clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your attempt history?")) {
        localStorage.removeItem(`sportsQuiz_history_${currentUser}`);
        renderHistory();
    }
});

// Initialize App
checkExistingUser();
