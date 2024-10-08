// タスク管理とUI管理のクラスをインポート
import { TaskManager } from './taskManager.js';
import { UIManager } from './uiManager.js';

// DOMの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', () => {
    // タスク管理とUI管理のインスタンスを作成
    const taskManager = new TaskManager();
    const uiManager = new UIManager(taskManager);

    // HTML要素の取得
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dateSelectBtn = document.getElementById('date-select-btn');
    const selectedDateSpan = document.getElementById('selected-date');
    const taskError = document.getElementById('task-error');
    const dateError = document.getElementById('date-error');
    const customCalendar = document.getElementById('custom-calendar');

    // 変数の初期化
    let selectedDate = '';
    let isCalendarVisible = false;
    let currentCalendarDate = new Date();

    // イベントリスナーの設定
    taskForm.addEventListener('submit', handleFormSubmit);
    dateSelectBtn.addEventListener('click', toggleCalendar);
    document.addEventListener('click', handleOutsideClick);

    // フォーム送信時の処理
    function handleFormSubmit(e) {
        e.preventDefault(); // デフォルトの送信動作を防止
        const taskText = taskInput.value.trim(); // 入力されたタスクのテキストを取得

        resetErrors(); // エラーメッセージをリセット

        // バリデーション
        if (!taskText) {
            showError(taskError, 'タスクを入力してください');
            return;
        }

        if (!selectedDate) {
            showError(dateError, '日付を設定してください');
            return;
        }

        // タスクを追加
        uiManager.addTask(taskText, selectedDate);
        resetForm(); // フォームをリセット
    }

    // カレンダーの表示/非表示を切り替え
    function toggleCalendar(e) {
        e.stopPropagation(); // イベントの伝播を停止
        isCalendarVisible ? hideCalendar() : showCalendar();
    }

    // カレンダーを表示
    function showCalendar() {
        const rect = dateSelectBtn.getBoundingClientRect();
        customCalendar.style.display = 'block';
        // カレンダーの位置を設定
        customCalendar.style.top = `${rect.bottom + window.scrollY}px`;
        customCalendar.style.left = `${rect.left + window.scrollX}px`;
        renderCalendar(currentCalendarDate);
        isCalendarVisible = true;
    }

    // カレンダーを非表示
    function hideCalendar() {
        customCalendar.style.display = 'none';
        isCalendarVisible = false;
    }

    // カレンダーをレンダリング
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        let calendarHTML = createCalendarHeader(year, month);
        calendarHTML += createCalendarDays(firstDay, lastDay);
        
        customCalendar.innerHTML = calendarHTML;
        
        addCalendarEventListeners(year, month);
    }

    // カレンダーのヘッダー部分を作成
    function createCalendarHeader(year, month) {
        return `
            <div class="calendar-header">
                <button id="prev-month">&lt;</button>
                <span>${year}年${month + 1}月</span>
                <button id="next-month">&gt;</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">日</div>
                <div class="calendar-day-header">月</div>
                <div class="calendar-day-header">火</div>
                <div class="calendar-day-header">水</div>
                <div class="calendar-day-header">木</div>
                <div class="calendar-day-header">金</div>
                <div class="calendar-day-header">土</div>
        `;
    }

    // カレンダーの日付部分を作成
    function createCalendarDays(firstDay, lastDay) {
        let calendarHTML = '';
        // 月の最初の日までの空白を追加
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarHTML += '<div></div>';
        }
        // 日付を追加
        for (let i = 1; i <= lastDay.getDate(); i++) {
            calendarHTML += `<div class="calendar-day">${i}</div>`;
        }
        return calendarHTML + '</div>';
    }

    // カレンダーのイベントリスナーを追加
    function addCalendarEventListeners(year, month) {
        // 前月ボタン
        document.getElementById('prev-month').addEventListener('click', (e) => {
            e.stopPropagation();
            currentCalendarDate = new Date(year, month - 1, 1);
            renderCalendar(currentCalendarDate);
        });
        // 次月ボタン
        document.getElementById('next-month').addEventListener('click', (e) => {
            e.stopPropagation();
            currentCalendarDate = new Date(year, month + 1, 1);
            renderCalendar(currentCalendarDate);
        });
        
        // 各日付にクリックイベントを追加
        customCalendar.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                selectedDate = new Date(year, month, parseInt(day.textContent));
                updateDateDisplay(selectedDate);
                hideCalendar();
            });
        });
    }

    // カレンダー外をクリックした時の処理
    function handleOutsideClick(e) {
        if (!customCalendar.contains(e.target) && e.target !== dateSelectBtn) {
            hideCalendar();
        }
    }

    // 選択された日付の表示を更新
    function updateDateDisplay(date) {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        selectedDateSpan.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${days[date.getDay()]})`;
    }

    // エラーメッセージをリセット
    function resetErrors() {
        taskError.textContent = '';
        dateError.textContent = '';
    }

    // エラーメッセージを表示
    function showError(element, message) {
        element.textContent = message;
    }

    // フォームをリセット
    function resetForm() {
        taskInput.value = '';
        selectedDate = '';
        selectedDateSpan.textContent = '';
    }

    // 初期表示時にタスクを表示
    uiManager.renderTasks();
});