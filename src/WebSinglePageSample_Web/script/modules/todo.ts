/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />


/**
 * Todoモデル
 */
class Todo {

    /**
     * オブジェクト固有キー
     */
    public guid: string;

    /**
     * 作業が完了しているかどうか。
     */
    public complete: boolean

    /**
     * すべきこと
     */
    public what: string

}

/**
 * Todoサービス
 */
class TodoService {

    /**
     * Todoリスト
     */
    public todoList: Todo[] = [];

    /**
     * コンストラクタ
     * @param $resource リソースサービス
     */
    public constructor(
        protected $resource: ng.resource.IResourceService
    ) {

        //APIで初期値を取得
        var resource = this.$resource(
            "http://localhost:59309/api/todo",
            {},
            { get: { method: 'GET', isArray: true } });
        resource.get().$promise.then((todos) => this.todoList = todos);

    }

}

app.service("TodoService", [
    "$resource",
    TodoService
]);


/**
 * Todo一覧検索
 */
class TodoSearchController {

    /**
     * 画面ID
     */
    public static screenId = "todoSearch";

    /**
     * 画面キー
     */
    protected guid: string;

    /**
     * 画面モード
     */
    public mode: ScreenMode;

    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     * @param MessageDialogService ダイアローグサービス
     * @param TodoService Todoサービス
     */
    public constructor(
        protected DialogService: DialogService,
        protected MessageDialogService: MessageDialogService,
        public TodoService: TodoService
    ) {

        //初期値の設定
        this.guid = DialogService.getGuidOf(TodoSearchController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.mode = resolve.mode;

    }

    /**
     * 詳細画面への遷移
     * @param guid オブジェクト固有キー
     */
    public showTodoDetail(
        guid: string
    ) {

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

    }

}

app.controller(
    "TodoSearchController",
    [
        "DialogService",
        "MessageDialogService",
        "TodoService",
        TodoSearchController
    ]
);

/**
 * Todo編集
 */
class TodoDetailController {

    /**
     * 画面ID
     */
    public static screenId = "todoDetail";

    /**
     * 画面キー
     */
    protected guid: string;

    /**
     * Todo
     */
    public todo: Todo = new Todo();

    /**
     * 画面モード
     */
    public mode: ScreenMode;

    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     * @param MessageDialogService ダイアローグサービス
     * @param TodoService Todoサービス
     */
    public constructor(
        protected DialogService: DialogService,
        protected MessageDialogService: MessageDialogService,
        protected TodoService: TodoService) {

        //初期値の設定
        this.guid = DialogService.getGuidOf(TodoDetailController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.mode = resolve.mode;

        //更新モードの場合モデルの値を取得する
        if (this.mode === ScreenMode.Update) {

            //モデルの取得
            var guid = resolve.guid;
            var todos = TodoService.todoList.filter((td) => td.guid === guid);

            //存在しない場合はエラー
            if (!todos) {
                this.MessageDialogService.show(
                    MessageType.Error,
                    ButtonType.OK,
                    "更新対象が存在しません。").then(
                    (dialogResult) => this.DialogService.close(this.guid)
                    );
                return;
            }

            //値のコピー
            this.todo = angular.copy(todos[0]);

        }

    }

    /**
     * 入力項目の検証
     */
    protected validate(): boolean {

        var isSuccess = false;

        //必須チェック
        if (!this.todo.what) {
            this.MessageDialogService.show(
                MessageType.Error,
                ButtonType.OK,
                "やるべきことは必ず指定してください。");
            return isSuccess;
        }

        isSuccess = true;
        return isSuccess;

    }

    /**
     * Todoの追加
     */
    public addTodo():void {

        //入力エラー
        if (!this.validate()) {
            return;
        }

        //Todoの追加
        this.todo.guid = this.DialogService.getGuid();
        this.TodoService.todoList.push(this.todo);

        //完了メッセージ
        this.MessageDialogService.show(
            MessageType.Information,
            ButtonType.OK,
            "登録が完了しました。").then(
            (dialogResult) => this.DialogService.close(this.guid)
            );

    }

    /**
     * Todoの更新
     */
    public updateTodo(): void {

        //入力エラー
        if (!this.validate()) {
            return;
        }

        //更新対象チェック
        var todos = this.TodoService.todoList.filter((td) => td.guid === this.todo.guid);
        if (!todos) {
            this.MessageDialogService.show(
                MessageType.Error,
                ButtonType.OK,
                "更新対象が存在しません。").then(
                (dialogResult) => this.DialogService.close(this.guid)
                );
            return;
        }

        //Todoの更新
        var todo = todos[0];
        todo.guid = this.todo.guid;
        todo.complete = this.todo.complete;
        todo.what = this.todo.what;

        //完了メッセージ
        this.MessageDialogService.show(
            MessageType.Information,
            ButtonType.OK,
            "更新が完了しました。");

    }

    /**
     * Todoの削除
     */
    public deleteTodo(): void {

        //更新対象チェック
        var todos = this.TodoService.todoList.filter((td) => td.guid === this.todo.guid);
        if (!todos) {
            this.MessageDialogService.show(
                MessageType.Error,
                ButtonType.OK,
                "削除対象が存在しません。").then(
                (dialogResult) => this.DialogService.close(this.guid)
                );
            return;
        }

        //Todoの削除
        var todo = todos[0];
        var index = this.TodoService.todoList.indexOf(todo);
        this.TodoService.todoList.splice(index, 1);

        //完了メッセージ
        this.MessageDialogService.show(
            MessageType.Information,
            ButtonType.OK,
            "削除が完了しました。").then(
            (dialogResult) => this.DialogService.close(this.guid)
            );

    }

}

app.controller(
    "TodoDetailController",
    [
        "DialogService",
        "MessageDialogService",
        "TodoService",
        TodoDetailController
    ]
);
