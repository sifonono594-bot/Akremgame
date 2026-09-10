document.addEventListener('DOMContentLoaded', () => {
    const gameScreen = document.getElementById('game-screen');
    const bannedScreen = document.getElementById('banned-screen');
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');

    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;
    const PLAYER = 'X';
    const BOT = 'O';

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // الصفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
        [0, 4, 8], [2, 4, 6]             // أقطار
    ];

    // 1. التحقق أولاً إذا كان المستخدم محظوراً سابقاً
    if (localStorage.getItem('xo_game_lost') === 'true') {
        lockUserOut();
        return;
    }

    // 2. الأحداث عند الضغط على المربعات
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');

        if (board[index] !== '' || !isGameActive) return;

        // حركة اللاعب
        makeMove(index, PLAYER);

        if (checkWin(PLAYER)) {
            statusText.textContent = '🎉 مبروك! لقد فزت ونجوت من الحظر!';
            isGameActive = false;
            return;
        }

        if (checkDraw()) {
            statusText.textContent = '🤝 تعادل! يمكنك إعادة المحاولة.';
            setTimeout(resetGame, 2000);
            return;
        }

        // دور الذكاء الاصطناعي
        isGameActive = false;
        statusText.textContent = 'جاري تفكير الخصم...';
        setTimeout(botMove, 600);
    }

    function makeMove(index, symbol) {
        board[index] = symbol;
        cells[index].textContent = symbol;
        cells[index].classList.add(symbol.toLowerCase());
    }

    function botMove() {
        // حركات الكمبيوتر المتاحة
        let availableIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

        if (availableIndices.length === 0) return;

        // الذكاء الاصطناعي يختار مربع عشوائي (يمكنك تحسينه لاحقاً)
        let randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        makeMove(randomIndex, BOT);

        if (checkWin(BOT)) {
            statusText.textContent = '💀 لقد خسرت!';
            // حفظ حالة الخسارة وحظر اللاعب فوراً
            localStorage.setItem('xo_game_lost', 'true');
            setTimeout(lockUserOut, 1200);
            return;
        }

        if (checkDraw()) {
            statusText.textContent = '🤝 تعادل! يمكنك إعادة المحاولة.';
            setTimeout(resetGame, 2000);
            return;
        }

        statusText.textContent = 'دورك الآن (X)';
        isGameActive = true;
    }

    function checkWin(symbol) {
        return winConditions.some(condition => {
            return condition.every(index => board[index] === symbol);
        });
    }

    function checkDraw() {
        return board.every(cell => cell !== '');
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        statusText.textContent = 'دورك الآن (X)';
        isGameActive = true;
    }

    function lockUserOut() {
        gameScreen.classList.add('hidden');
        bannedScreen.classList.remove('hidden');
    }
});
