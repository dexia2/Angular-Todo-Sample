/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />
// アプリケーション設定
/**
* アプリケーション名
*/
var appName = "SinglePageSample";
/**
* アプリケーション
*/
var app = angular.module(appName, ["ngResource"]);
/**
* 画面モード
*/
var ScreenMode;
(function (ScreenMode) {
    /**
     * 検索
     */
    ScreenMode[ScreenMode["Search"] = 0] = "Search";
    /**
     * 登録
     */
    ScreenMode[ScreenMode["Insert"] = 1] = "Insert";
    /**
     * 更新
     */
    ScreenMode[ScreenMode["Update"] = 2] = "Update";
})(ScreenMode || (ScreenMode = {}));
//アプリケーション設定
app.run(["$rootScope", function ($rootScope) {
        //列挙体をViewでも使えるようにする
        $rootScope.ScreenMode = ScreenMode;
    }]);
