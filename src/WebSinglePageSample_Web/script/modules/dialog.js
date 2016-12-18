/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />
/**
* ダイアローグ設定クラス
*/
var DialogConfig = (function () {
    /**
     * コンストラクタ
     */
    function DialogConfig() {
    }
    return DialogConfig;
}());
/**
* ダイアローグサービス
*/
var DialogService = (function () {
    /**
     * コンストラクタ
     * @param  $compile コンパイルサービス
     */
    function DialogService($compile) {
        this.$compile = $compile;
        /**
         * 現在開いている画面のキーのコレクション
         */
        this.guids = {};
        /**
         * 現在開いている画面に渡すべきパラメータのコレクション
         */
        this.resolves = {};
        /**
         * 現在開いている画面から受け取った返り値のコレクション
         */
        this.retvals = {};
    }
    /**
     * GUIDの設定
     * @param guid 画面のキー
     * @param returnValue 返り値
     */
    DialogService.prototype.getGuidOf = function (screenKey) {
        var guid = this.guids[screenKey];
        delete this.guids[screenKey];
        return guid;
    };
    /**
     * パラメータの取得
     * @param guid 画面のキー
     * @return パラメータ
     */
    DialogService.prototype.getResolveOf = function (guid) {
        var resolve = this.resolves[guid];
        delete this.resolves[guid];
        return resolve;
    };
    /**
     * 返り値の設定
     * @param guid 画面のキー
     * @param returnValue 返り値
     */
    DialogService.prototype.setReturnValue = function (guid, returnValue) {
        this.retvals[guid] = returnValue;
    };
    /**
     * 返り値の取得
     * @param guid 画面のキー
     * @return returnValue 返り値
     */
    DialogService.prototype.getReturnValueOf = function (guid) {
        var retval = this.retvals[guid];
        delete this.retvals[guid];
        return retval;
    };
    /**
     * ダイアローグの表示
     * @param config 画面設定
     * @return 画面のキー
     */
    DialogService.prototype.show = function (config) {
        // 画面のキーの採番
        var guid = this.getGuid();
        // ダイアローグオプションへの設定
        var dialogOption = {
            show: "clip",
            hide: "fade",
            title: config.title,
            modal: config.modal,
            width: config.width,
            close: function (event) {
                //コールバックの実行
                if (config.closeCallback)
                    config.closeCallback(guid);
                //画面をHTMLから破棄
                $(this).dialog('destroy');
                $(event.target).remove();
            }
        };
        //ダイアローグを開く
        $("<div class = \"dialog\" id = " + guid + "></div>").dialog(dialogOption);
        //ダイアローグ情報を保存
        this.guids[config.screenId] = guid;
        this.resolves[guid] = config.resolve;
        //ダイアローグにAngularのviewを差し込む
        var $dialog = $("#" + guid);
        var includeHtml = "<div ng-include=\"'" + config.path + "'\"></div>";
        var scope = angular.element($dialog).scope();
        $dialog.append(this.$compile(includeHtml)(scope));
        return guid;
    };
    /**
     * 画面を閉じる
     * @param guid 画面のキー
     */
    DialogService.prototype.close = function (guid) {
        $("#" + guid).dialog('close');
    };
    /**
     * GUIDの取得
     * @return GUID
     */
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
