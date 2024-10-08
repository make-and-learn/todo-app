// タスク管理を行うクラス
export class TaskManager {
    // コンストラクタ
    constructor() {
        // タスクを読み込んで初期化
        this.tasks = this.loadTasks();
    }

    // 新しいタスクを追加するメソッド
    addTask(taskText, date) {
        // 新しいタスクオブジェクトを作成
        const task = {
            id: Date.now(),  // 現在のタイムスタンプをIDとして使用
            text: taskText,  // タスクの内容
            completed: false,  // 完了状態（初期値は未完了）
            date: date  // タスクの日付
        };
        // タスクリストに新しいタスクを追加
        this.tasks.push(task);
        // タスクを保存
        this.saveTasks();
        // 作成したタスクを返す
        return task;
    }

    // タスクを削除するメソッド
    deleteTask(taskId) {
        // 指定されたIDのタスクを除外した新しい配列を作成
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        // 変更を保存
        this.saveTasks();
    }

    // タスクの完了状態を切り替えるメソッド
    toggleTaskStatus(taskId) {
        // 指定されたIDのタスクを見つける
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            // タスクが見つかった場合、完了状態を反転
            task.completed = !task.completed;
            // 変更を保存
            this.saveTasks();
        }
    }

    // タスクの内容を編集するメソッド
    editTask(taskId, newText) {
        // 指定されたIDのタスクを見つける
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            // タスクが見つかった場合、内容を更新
            task.text = newText;
            // 変更を保存
            this.saveTasks();
        }
    }

    // タスクをローカルストレージに保存するメソッド
    saveTasks() {
        // タスクリストをJSON文字列に変換してローカルストレージに保存
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // ローカルストレージからタスクを読み込むメソッド
    loadTasks() {
        // ローカルストレージからタスクのJSON文字列を取得
        const tasksJSON = localStorage.getItem('tasks');
        // JSON文字列が存在する場合はパースして返す、存在しない場合は空配列を返す
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }

    // 全タスクを取得するメソッド
    getTasks() {
        // タスクを日付順にソートして返す
        return this.tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}