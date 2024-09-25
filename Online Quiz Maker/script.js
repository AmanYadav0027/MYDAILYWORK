window.onload = function() {
    // Show home page on load
    document.getElementById('home').classList.add('active');
}

let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let timerInterval = null;
let timeLeft = 60;

// Authentication: Register User
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        if (!users[username]) {
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('User registered successfully!');
        } else {
            alert('Username already exists!');
        }
    } else {
        alert('Please fill out both fields');
    }
}

// Authentication: Login User
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        currentUser = username;
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('quiz-actions').classList.remove('hidden');
        alert('Login successful!');
    } else {
        alert('Invalid username or password');
    }
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('quiz-actions').classList.add('hidden');
}

// Show Quiz Creation Form
function showCreateQuiz() {
    document.getElementById('home').classList.remove('active');
    document.getElementById('create-quiz').classList.add('active');
}

// Add a New Question to Quiz Creation
function addQuestion() {
    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `
        <input type="text" class="question" placeholder="Question">
        <input type="text" class="answer" placeholder="Answer 1">
        <input type="text" class="answer" placeholder="Answer 2">
        <input type="text" class="answer" placeholder="Answer 3">
        <input type="text" class="answer" placeholder="Answer 4">
        <input type="text" class="correct" placeholder="Correct Answer">
    `;
    document.getElementById('questions-container').appendChild(questionDiv);
}

// Save Quiz to Local Storage
function saveQuiz() {
    const title = document.getElementById('quiz-title').value;
    const questions = Array.from(document.querySelectorAll('#questions-container div')).map(q => {
        return {
            question: q.querySelector('.question').value,
            answers: Array.from(q.querySelectorAll('.answer')).map(a => a.value),
            correct: q.querySelector('.correct').value
        };
    });

    quizzes.push({ title, questions });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    alert('Quiz saved successfully!');

    goHome();
}

// Show Quiz Listing (with Delete option)
function showQuizList() {
    document.getElementById('home').classList.remove('active');
    document.getElementById('quiz-list').classList.add('active');

    const quizList = document.getElementById('quizzes');
    quizList.innerHTML = quizzes.map((quiz, index) => `
        <li>
            ${quiz.title}
            <button onclick="startQuiz(${index})">Start Quiz</button>
            <button onclick="deleteQuiz(${index})" style="background-color: red; color: white;">Delete</button>
        </li>
    `).join('');
}

// Delete a Quiz
function deleteQuiz(index) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        quizzes.splice(index, 1); // Remove the quiz from the array
        localStorage.setItem('quizzes', JSON.stringify(quizzes)); // Update localStorage
        alert('Quiz deleted successfully!');
        showQuizList(); // Refresh the quiz list
    }
}

// Start a Quiz
function startQuiz(index) {
    currentQuiz = quizzes[index];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    timeLeft = 60;

    document.getElementById('quiz-list').classList.remove('active');
    document.getElementById('take-quiz').classList.add('active');
    document.getElementById('quiz-title-display').textContent = currentQuiz.title;

    updateTimer();
    showQuestion();
    startTimer();
}

// Show a Question
function showQuestion() {
    const questionData = currentQuiz.questions[currentQuestionIndex];
    const questionDiv = document.getElementById('quiz-questions');
    questionDiv.innerHTML = `
        <p>${questionData.question}</p>
        ${questionData.answers.map(answer => `
            <label><input type="radio" class="option" name="answer" value="${answer}"> ${answer}</label><br>
        `).join('')}
    `;
}

// Submit Quiz
function submitQuiz() {
    clearInterval(timerInterval);

    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const correctAnswer = currentQuiz.questions[currentQuestionIndex].correct;

    if (selectedAnswer && selectedAnswer.value === correctAnswer) {
        correctAnswers++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.questions.length) {
        updateProgress();
        showQuestion();
    } else {
        endQuiz();
    }
}

// End Quiz and Show Results
function endQuiz() {
    document.getElementById('take-quiz').classList.remove('active');
    document.getElementById('quiz-results').classList.add('active');
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('incorrect-answers').textContent = currentQuiz.questions.length - correctAnswers;
}

// Timer and Progress Bar
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('time-left').textContent = timeLeft + 's';
}

function updateProgress() {
    const progress = (currentQuestionIndex / currentQuiz.questions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

// Go Back to Home
function goHome() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('home').classList.add('active');
}
