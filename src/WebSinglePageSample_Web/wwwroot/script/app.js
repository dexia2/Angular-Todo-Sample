var appName = "SinglePageSample";
var app = angular.module(appName, ["ngResource"]);
var ScreenMode;
(function (ScreenMode) {
    ScreenMode[ScreenMode["Search"] = 0] = "Search";
    ScreenMode[ScreenMode["Insert"] = 1] = "Insert";
    ScreenMode[ScreenMode["Update"] = 2] = "Update";
})(ScreenMode || (ScreenMode = {}));
app.run(["$rootScope", function ($rootScope) {
        $rootScope.ScreenMode = ScreenMode;
    }]);
var DialogConfig = (function () {
    function DialogConfig() {
    }
    return DialogConfig;
}());
var DialogService = (function () {
    function DialogService($compile) {
        this.$compile = $compile;
        this.guids = {};
        this.resolves = {};
        this.retvals = {};
    }
    DialogService.prototype.getGuidOf = function (screenKey) {
        var guid = this.guids[screenKey];
        delete this.guids[screenKey];
        return guid;
    };
    DialogService.prototype.getResolveOf = function (guid) {
        var resolve = this.resolves[guid];
        delete this.resolves[guid];
        return resolve;
    };
    DialogService.prototype.setReturnValue = function (guid, returnValue) {
        this.retvals[guid] = returnValue;
    };
    DialogService.prototype.getReturnValueOf = function (guid) {
        var retval = this.retvals[guid];
        delete this.retvals[guid];
        return retval;
    };
    DialogService.prototype.show = function (config) {
        var guid = this.getGuid();
        var dialogOption = {
            show: "clip",
            hide: "fade",
            title: config.title,
            modal: config.modal,
            width: config.width,
            close: function (event) {
                if (config.closeCallback)
                    config.closeCallback(guid);
                $(this).dialog('destroy');
                $(event.target).remove();
            }
        };
        $("<div class = \"dialog\" id = " + guid + "></div>").dialog(dialogOption);
        this.guids[config.screenId] = guid;
        this.resolves[guid] = config.resolve;
        var $dialog = $("#" + guid);
        var includeHtml = "<div ng-include=\"'" + config.path + "'\"></div>";
        var scope = angular.element($dialog).scope();
        $dialog.append(this.$compile(includeHtml)(scope));
        return guid;
    };
    DialogService.prototype.close = function (guid) {
        $("#" + guid).dialog('close');
    };
    DialogService.prototype.getGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    return DialogService;
}());
app.service("DialogService", ["$compile", DialogService]);
var MenuController = (function () {
    function MenuController(DialogService) {
        this.DialogService = DialogService;
    }
    MenuController.prototype.showTodoSearch = function () {
        var config = new DialogConfig();
        config.title = "一覧検索";
        config.screenId = TodoSearchController.screenId;
        config.path = "view/todoSearch.html";
        config.modal = false;
        config.width = 300;
        config.resolve = { mode: ScreenMode.Search };
        this.DialogService.show(config);
    };
    MenuController.prototype.showTodoDetail = function () {
        var config = new DialogConfig();
        config.title = "新規追加";
        config.screenId = TodoDetailController.screenId;
        config.path = "view/todoDetail.html";
        config.modal = false;
        config.width = 300;
        config.resolve = { mode: ScreenMode.Insert };
        this.DialogService.show(config);
    };
    return MenuController;
}());
app.controller("MenuController", [
    "DialogService",
    MenuController
]);
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Error"] = 0] = "Error";
    MessageType[MessageType["Information"] = 1] = "Information";
    MessageType[MessageType["Question"] = 2] = "Question";
    MessageType[MessageType["Warning"] = 3] = "Warning";
})(MessageType || (MessageType = {}));
var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["OK"] = 0] = "OK";
    ButtonType[ButtonType["OKCancel"] = 1] = "OKCancel";
})(ButtonType || (ButtonType = {}));
var DialogResult;
(function (DialogResult) {
    DialogResult[DialogResult["OK"] = 0] = "OK";
    DialogResult[DialogResult["Cancel"] = 1] = "Cancel";
})(DialogResult || (DialogResult = {}));
var MessageDialogService = (function () {
    function MessageDialogService(DialogService, $q) {
        this.DialogService = DialogService;
        this.$q = $q;
    }
    MessageDialogService.prototype.show = function (messageType, buttonType, message) {
        var _this = this;
        var d = this.$q.defer();
        var config = new DialogConfig();
        config.screenId = MessageDialogController.screenId;
        config.path = "view/messageDialog.html";
        config.title = this.getTitle(messageType);
        config.modal = true;
        config.width = 300;
        config.resolve = {
            imgPath: this.getImgPath(messageType),
            msg: message,
            btnType: buttonType
        };
        config.closeCallback = function (guid) {
            d.resolve(_this.DialogService.getReturnValueOf(guid).dialogResult);
        };
        this.DialogService.show(config);
        return d.promise;
    };
    MessageDialogService.prototype.getImgPath = function (msgType) {
        var path;
        switch (msgType) {
            case MessageType.Error:
                path = "img/error.png";
                break;
            case MessageType.Information:
                path = "img/information.png";
                break;
            case MessageType.Question:
                path = "img/question.png";
                break;
            case MessageType.Warning:
                path = "img/warning.png";
                break;
        }
        return path;
    };
    MessageDialogService.prototype.getTitle = function (msgType) {
        var title;
        switch (msgType) {
            case MessageType.Error:
                title = "エラー";
                break;
            case MessageType.Information:
                title = "情報";
                break;
            case MessageType.Question:
                title = "確認";
                break;
            case MessageType.Warning:
                title = "警告";
                break;
        }
        return title;
    };
    return MessageDialogService;
}());
app.service("MessageDialogService", [
    "DialogService",
    "$q",
    MessageDialogService]);
var MessageDialogController = (function () {
    function MessageDialogController(DialogService) {
        this.DialogService = DialogService;
        this.guid = DialogService.getGuidOf(MessageDialogController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.imgPath = resolve.imgPath;
        this.msg = resolve.msg;
        this.btnType = resolve.btnType;
    }
    MessageDialogController.prototype.isOKCancel = function () {
        return this.btnType === ButtonType.OKCancel;
    };
    MessageDialogController.prototype.OK = function () {
        this.DialogService.setReturnValue(this.guid, { dialogResult: DialogResult.OK });
        this.DialogService.close(this.guid);
    };
    MessageDialogController.prototype.Cancel = function () {
        this.DialogService.setReturnValue(this.guid, { dialogResult: DialogResult.Cancel });
        this.DialogService.close(this.guid);
    };
    MessageDialogController.screenId = "messageDialog";
    return MessageDialogController;
}());
app.controller("MessageDialogController", [
    "DialogService",
    MessageDialogController
]);
var Todo = (function () {
    function Todo() {
    }
    return Todo;
}());
var TodoService = (function () {
    function TodoService($resource) {
        var _this = this;
        this.$resource = $resource;
        this.todoList = [];
        var resource = this.$resource("http://localhost:59309/api/todo", {}, { get: { method: 'GET', isArray: true } });
        resource.get().$promise.then(function (todos) { return _this.todoList = todos; });
    }
    return TodoService;
}());
app.service("TodoService", [
    "$resource",
    TodoService
]);
var TodoSearchController = (function () {
    function TodoSearchController(DialogService, MessageDialogService, TodoService) {
        this.DialogService = DialogService;
        this.MessageDialogService = MessageDialogService;
        this.TodoService = TodoService;
        this.guid = DialogService.getGuidOf(TodoSearchController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.mode = resolve.mode;
    }
    TodoSearchController.prototype.showTodoDetail = function (guid) {
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
    TodoSearchController.screenId = "todoSearch";
    return TodoSearchController;
}());
app.controller("TodoSearchController", [
    "DialogService",
    "MessageDialogService",
    "TodoService",
    TodoSearchController
]);
var TodoDetailController = (function () {
    function TodoDetailController(DialogService, MessageDialogService, TodoService) {
        var _this = this;
        this.DialogService = DialogService;
        this.MessageDialogService = MessageDialogService;
        this.TodoService = TodoService;
        this.todo = new Todo();
        this.guid = DialogService.getGuidOf(TodoDetailController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.mode = resolve.mode;
        if (this.mode === ScreenMode.Update) {
            var guid = resolve.guid;
            var todos = TodoService.todoList.filter(function (td) { return td.guid === guid; });
            if (!todos) {
                this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "更新対象が存在しません。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
                return;
            }
            this.todo = angular.copy(todos[0]);
        }
    }
    TodoDetailController.prototype.validate = function () {
        var isSuccess = false;
        if (!this.todo.what) {
            this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "やるべきことは必ず指定してください。");
            return isSuccess;
        }
        isSuccess = true;
        return isSuccess;
    };
    TodoDetailController.prototype.addTodo = function () {
        var _this = this;
        if (!this.validate()) {
            return;
        }
        this.todo.guid = this.DialogService.getGuid();
        this.TodoService.todoList.push(this.todo);
        this.MessageDialogService.show(MessageType.Information, ButtonType.OK, "登録が完了しました。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
    };
    TodoDetailController.prototype.updateTodo = function () {
        var _this = this;
        if (!this.validate()) {
            return;
        }
        var todos = this.TodoService.todoList.filter(function (td) { return td.guid === _this.todo.guid; });
        if (!todos) {
            this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "更新対象が存在しません。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
            return;
        }
        var todo = todos[0];
        todo.guid = this.todo.guid;
        todo.complete = this.todo.complete;
        todo.what = this.todo.what;
        this.MessageDialogService.show(MessageType.Information, ButtonType.OK, "更新が完了しました。");
    };
    TodoDetailController.prototype.deleteTodo = function () {
        var _this = this;
        var todos = this.TodoService.todoList.filter(function (td) { return td.guid === _this.todo.guid; });
        if (!todos) {
            this.MessageDialogService.show(MessageType.Error, ButtonType.OK, "削除対象が存在しません。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
            return;
        }
        var todo = todos[0];
        var index = this.TodoService.todoList.indexOf(todo);
        this.TodoService.todoList.splice(index, 1);
        this.MessageDialogService.show(MessageType.Information, ButtonType.OK, "削除が完了しました。").then(function (dialogResult) { return _this.DialogService.close(_this.guid); });
    };
    TodoDetailController.screenId = "todoDetail";
    return TodoDetailController;
}());
app.controller("TodoDetailController", [
    "DialogService",
    "MessageDialogService",
    "TodoService",
    TodoDetailController
]);
