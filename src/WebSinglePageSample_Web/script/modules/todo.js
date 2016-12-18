/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />
/**
 * Todoモデル
 */
var Todo = (function () {
    function Todo() {
    }
    return Todo;
}());
/**
 * Todoサービス
 */
var TodoService = (function () {
    /**
     * コンストラクタ
     * @param $resource リソースサービス
     */
    function TodoService($resource) {
        var _this = this;
        this.$resource = $resource;
        /**
         * Todoリスト
         */
        this.todoList = [];
        //APIで初期値を取得
        var resource = this.$resource("http://localhost:59309/api/todo", {}, { get: { method: 'GET', isArray: true } });
        resource.get().$promise.then(function (todos) { return _this.todoList = todos; });
    }
    return TodoService;
}());
app.service("TodoService", [
    "$resource",
    TodoService
]);
/**
 * Todo一覧検索
 */
var TodoSearchController = (function () {
    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     * @param MessageDialogService ダイアローグサービス
     * @param TodoService Todoサービス
     */
    function TodoSearchController(DialogService, MessageDialogService, TodoService) {
        this.DialogService = DialogService;
        this.MessageDialogService = MessageDialogService;
        this.TodoService = TodoService;
        //初期値の設定
        this.guid = DialogService.getGuidOf(TodoSearchController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.mode = resolve.mode;
    }
    /**
     * 詳細画面への遷移
     * @param guid オブジェクト固有キー
     */
    TodoSearchController.prototype.showTodoDetail = function (guid) {
        //ダイアローグ設定
        var config = new DialogConfig();
        config.title = "更新";
        config.screenId = TodoDetailController.screenId;
        config.path = "view/todoDetail.html";
        config.modal = false;
        config.width = 300;
        config.resolve = {
            mode: ScreenMode.Update,
            guid: guid
        };
        this.DialogService.show(config);
    };
    /**
     * 画面ID
     */
    TodoSearchController.screenId = "todoSearch";
    return TodoSearchController;
}());
app.controller("TodoSearchController", [
    "DialogService",
    "MessageDialogService",
    "TodoService",
    TodoSearchController
]);
/**
 * Todo編集
 */
var TodoDetailController = (function () {
    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     * @param MessageDialogService ダイアローグサービス
     * @param TodoService Todoサービス
     */
    function TodoDetailController(DialogService, MessageDialogService, TodoService) {
        var _this = this;
        this.DialogService = DialogService;
        this.MessageDialogService = MessageDialogService;
        this.TodoService = TodoService;
        /**
         * Todo
         */
        this.todo = new Todo();
        //初期値の設定
        this.guid = DialogService.getGuidOf(TodoDetailController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.mode = resolve.mode;
        //更新モードの場合モデルの値を取得する
        if (this.mode === ScreenMode.Update) {
            //モデルの取得
            var guid = resolve.guid;
            var todos = TodoService.todoList.filter(function (td) { return td.guid === guid; });
            //存在しない場合はエラー
            if (!todos) {
                this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "更新対象が存在しません。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
                return;
            }
            //値のコピー
            this.todo = angular.copy(todos[0]);
        }
    }
    /**
     * 入力項目の検証
     */
    TodoDetailController.prototype.validate = function () {
        var isSuccess = false;
        //必須チェック
        if (!this.todo.what) {
            this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "やるべきことは必ず指定してください。");
            return isSuccess;
        }
        isSuccess = true;
        return isSuccess;
    };
    /**
     * Todoの追加
     */
    TodoDetailController.prototype.addTodo = function () {
        var _this = this;
        //入力エラー
        if (!this.validate()) {
            return;
        }
        //Todoの追加
        this.todo.guid = this.DialogService.getGuid();
        this.TodoService.todoList.push(this.todo);
        //完了メッセージ
        this.MessageDialogService.show(MessageType.Information, ButtonType.OK, "登録が完了しました。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
    };
    /**
     * Todoの更新
     */
    TodoDetailController.prototype.updateTodo = function () {
        var _this = this;
        //入力エラー
        if (!this.validate()) {
            return;
        }
        //更新対象チェック
        var todos = this.TodoService.todoList.filter(function (td) { return td.guid === _this.todo.guid; });
        if (!todos) {
            this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "更新対象が存在しません。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
            return;
        }
        //Todoの更新
        var todo = todos[0];
        todo.guid = this.todo.guid;
        todo.complete = this.todo.complete;
        todo.what = this.todo.what;
        //完了メッセージ
        this.MessageDialogService.show(MessageType.Information, ButtonType.OK, "更新が完了しました。");
    };
    /**
     * Todoの削除
     */
    TodoDetailController.prototype.deleteTodo = function () {
        var _this = this;
        //更新対象チェック
        var todos = this.TodoService.todoList.filter(function (td) { return td.guid === _this.todo.guid; });
        if (!todos) {
            this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "削除対象が存在しません。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
            return;
        }
        //Todoの削除
        var todo = todos[0];
        var index = this.TodoService.todoList.indexOf(todo);
        this.TodoService.todoList.splice(index, 1);
        //完了メッセージ
        this.MessageDialogService.show(MessageType.Information, ButtonType.OK, "削除が完了しました。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
    };
    /**
     * 画面ID
     */
    TodoDetailController.screenId = "todoDetail";
    return TodoDetailController;
}());
app.controller("TodoDetailController", [
    "DialogService",
    "MessageDialogService",
    "TodoService",
    TodoDetailController
]);
