/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />
/**
 * メッセージタイプ
 */
var MessageType;
(function (MessageType) {
    /**
     * エラー
     */
    MessageType[MessageType["Error"] = 0] = "Error";
    /**
     * 情報
     */
    MessageType[MessageType["Information"] = 1] = "Information";
    /**
     * 確認
     */
    MessageType[MessageType["Question"] = 2] = "Question";
    /**
     * 警告
     */
    MessageType[MessageType["Warning"] = 3] = "Warning";
})(MessageType || (MessageType = {}));
/**
 * ボタンタイプ
 */
var ButtonType;
(function (ButtonType) {
    /**
     * OK
     */
    ButtonType[ButtonType["OK"] = 0] = "OK";
    /**
     * OKCancel
     */
    ButtonType[ButtonType["OKCancel"] = 1] = "OKCancel";
})(ButtonType || (ButtonType = {}));
/**
 * メッセージ処理結果
 */
var DialogResult;
(function (DialogResult) {
    /**
     * OK
     */
    DialogResult[DialogResult["OK"] = 0] = "OK";
    /**
     * キャンセル
     */
    DialogResult[DialogResult["Cancel"] = 1] = "Cancel";
})(DialogResult || (DialogResult = {}));
/**
 * メッセージサービス
 */
var MessageDialogService = (function () {
    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     * @param $q 非同期サービス
     */
    function MessageDialogService(DialogService, $q) {
        this.DialogService = DialogService;
        this.$q = $q;
    }
    /**
     * ダイアローグを開く
     * @param messageType メッセージタイプ
     * @param buttonType ボタンタイプ
     * @param message メッセージ
     * @return メッセージ処理結果
     */
    MessageDialogService.prototype.show = function (messageType, buttonType, message) {
        var _this = this;
        var d = this.$q.defer();
        //ダイアローグ条件の設定
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
        //メッセージ処理結果の取得
        config.closeCallback = function (guid) {
            d.resolve(_this.DialogService.getReturnValueOf(guid).dialogResult);
        };
        //ダイアローグを開く
        this.DialogService.show(config);
        return d.promise;
    };
    /**
     * 画像ファイルへのパスの取得
     * @param messageType メッセージタイプ
     * @return 画像ファイルへのパス
     */
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
    /**
     * タイトルの取得
     * @param messageType メッセージタイプ
     * @return タイトル
     */
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
/**
 * メッセージコントローラー
 */
var MessageDialogController = (function () {
    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     */
    function MessageDialogController(DialogService) {
        this.DialogService = DialogService;
        //初期値の設定
        this.guid = DialogService.getGuidOf(MessageDialogController.screenId);
        var resolve = DialogService.getResolveOf(this.guid);
        this.imgPath = resolve.imgPath;
        this.msg = resolve.msg;
        this.btnType = resolve.btnType;
    }
    /**
     * ボタンタイプがOKCancekかどうか。
     * @return ボタンタイプがOKCancekの場合はTrue
     */
    MessageDialogController.prototype.isOKCancel = function () {
        return this.btnType === ButtonType.OKCancel;
    };
    /**
     * OKボタンが押された時
     */
    MessageDialogController.prototype.OK = function () {
        this.DialogService.setReturnValue(this.guid, { dialogResult: DialogResult.OK });
        this.DialogService.close(this.guid);
    };
    /**
     * Cancelボタンが押された時
     */
    MessageDialogController.prototype.Cancel = function () {
        this.DialogService.setReturnValue(this.guid, { dialogResult: DialogResult.Cancel });
        this.DialogService.close(this.guid);
    };
    /**
     * 画面ID
     */
    MessageDialogController.screenId = "messageDialog";
    return MessageDialogController;
}());
app.controller("MessageDialogController", [
    "DialogService",
    MessageDialogController
]);
