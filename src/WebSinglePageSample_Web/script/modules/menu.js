/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />
/**
 * メニューコントローラー
 */
var MenuController = (function () {
    /**
     * コンストラクタ
     * @param ds ダイアローグサービス
     */
    function MenuController(DialogService) {
        this.DialogService = DialogService;
    }
    /**
     * Todo検索画面の表示
     */
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
    /**
     * Todo詳細画面の表示
     */
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
