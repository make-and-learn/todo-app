// UIを管理するクラス
export class UIManager {
    // コンストラクタ
    constructor(taskManager) {
        this.taskManager = taskManager; // TaskManagerのインスタンスを保持
        this.taskList = document.getElementById('task-list'); // タスクリストのDOM要素を取得
    }

    // 新しいタスクを追加するメソッド
    addTask(taskText, date) {
        this.taskManager.addTask(taskText, date); // TaskManagerを使ってタスクを追加
        this.renderTasks(); // タスクリストを再描画
    }

    // タスク要素を作成するメソッド
    createTaskElement(task) {
        const li = document.createElement('li'); // リスト項目要素を作成
        li.className = `task-item ${task.completed ? 'completed' : ''}`; // クラスを設定
        
        // タスク要素の内部HTMLを設定
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text" title="${task.text}">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn">編集</button>
                <button class="delete-btn">削除</button>
            </div>
        `;

        this.addTaskEventListeners(li, task); // イベントリスナーを追加

        return li; // 作成したタスク要素を返す
    }

    // タスク要素にイベントリスナーを追加するメソッド
    addTaskEventListeners(li, task) {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        // チェックボックスの状態変更イベント
        checkbox.addEventListener('change', () => this.toggleTaskStatus(task, li));
        // 編集ボタンのクリックイベント
        editBtn.addEventListener('click', () => this.editTask(task));
        // 削除ボタンのクリックイベント
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
    }

    // タスクの完了状態を切り替えるメソッド
    toggleTaskStatus(task, li) {
        this.taskManager.toggleTaskStatus(task.id); // TaskManagerを使ってタスクの状態を切り替え
        li.classList.toggle('completed'); // タスク要素のクラスを切り替え
    }

    // タスクを編集するメソッド
    editTask(task) {
        const newText = prompt('タスクを編集:', task.text); // 新しいタスクテキストを入力
        if (newText && newText.trim() !== '') {
            this.taskManager.editTask(task.id, newText.trim()); // TaskManagerを使ってタスクを編集
            this.renderTasks(); // タスクリストを再描画
        }
    }

    // タスクを削除するメソッド
    deleteTask(taskId) {
        this.taskManager.deleteTask(taskId); // TaskManagerを使ってタスクを削除
        this.renderTasks(); // タスクリストを再描画
    }

    // タスクリストを描画するメソッド
    renderTasks() {
        this.taskList.innerHTML = ''; // タスクリストをクリア
        const tasks = this.taskManager.getTasks(); // すべてのタスクを取得
        const groupedTasks = this.groupTasksByDate(tasks); // タスクを日付ごとにグループ化

        // 日付でソート
        const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));

        // 各日付のタスクを描画
        sortedDates.forEach(date => {
            const dateHeader = document.createElement('h2');
            dateHeader.textContent = this.formatDate(date); // 日付ヘッダーを作成
            this.taskList.appendChild(dateHeader);

            // その日のタスクを描画
            groupedTasks[date].forEach(task => {
                this.taskList.appendChild(this.createTaskElement(task));
            });
        });
    }

    // タスクを日付ごとにグループ化するメソッド
    groupTasksByDate(tasks) {
        return tasks.reduce((acc, task) => {
            const dateKey = this.formatDateKey(task.date);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(task);
            return acc;
        }, {});
    }

    // 日付キーをフォーマットするメソッド
    formatDateKey(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 日付を表示用にフォーマットするメソッド
    formatDate(dateString) {
        const date = new Date(dateString);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${days[date.getDay()]})`;
    }
}