/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />

// アプリケーション設定

/**
* アプリケーション名
*/
const appName = "SinglePageSample";

/**
* アプリケーション
*/
const app = angular.module(appName, ["ngResource"]);

/**
* 画面モード
*/
enum ScreenMode {

   /**
    * 検索
    */
    Search,
   /**
    * 登録
    */
    Insert,
   /**
    * 更新
    */
    Update
}

/**
* アプリケーション規定のインターフェース
*/
interface MyRootScopeService extends angular.IRootScopeService {
    ScreenMode: any;
}

//アプリケーション設定
app.run(["$rootScope", ($rootScope: MyRootScopeService) => {

    //列挙体をViewでも使えるようにする
    $rootScope.ScreenMode = ScreenMode;

}]);