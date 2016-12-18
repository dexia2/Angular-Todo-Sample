/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />

/**
 * メッセージタイプ
 */
enum MessageType {
    /**
     * エラー
     */
    Error,
    /**
     * 情報
     */
    Information,
    /**
     * 確認
     */
    Question,
    /**
     * 警告
     */
    Warning
}

/**
 * ボタンタイプ
 */
enum ButtonType {
    /**
     * OK
     */
    OK,
    /**
     * OKCancel
     */
    OKCancel
}

/**
 * メッセージ処理結果
 */
enum DialogResult {
    /**
     * OK
     */
    OK,
    /**
     * キャンセル
     */
    Cancel
}

/**
 * メッセージサービス
 */
class MessageDialogService {

    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     * @param $q 非同期サービス
     */
    constructor(
        protected DialogService: DialogService,
        protected $q: angular.IQService
    ) {
    }

    /**
     * ダイアローグを開く
     * @param messageType メッセージタイプ
     * @param buttonType ボタンタイプ
     * @param message メッセージ
     * @return メッセージ処理結果
     */
    public show(
        messageType: MessageType,
        buttonType: ButtonType,
        message: string
    ): angular.IPromise<DialogResult> {

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
        }

        //メッセージ処理結果の取得
        config.closeCallback = (guid) => {
            d.resolve(this.DialogService.getReturnValueOf(guid).dialogResult);
        }

        //ダイアローグを開く
        this.DialogService.show(config);

        return d.promise

    }

    /**
     * 画像ファイルへのパスの取得
     * @param messageType メッセージタイプ
     * @return 画像ファイルへのパス
     */
    protected getImgPath(
        msgType: MessageType
    ): string {

        var path: string;

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

    }

    /**
     * タイトルの取得
     * @param messageType メッセージタイプ
     * @return タイトル
     */
    protected getTitle(
        msgType: MessageType
    ): string {

        var title: string;

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

    }

}

app.service("MessageDialogService", [
    "DialogService",
    "$q",
    MessageDialogService]);

/**
 * メッセージコントローラー
 */
class MessageDialogController {

    /**
     * 画面ID
     */
    public static screenId = "messageDialog";

    /**
     * 画面キー
     */
    protected guid: string;

    /**
     * ボタンタイプ
     */
    public btnType: ButtonType;

    /**
     * 画像ファイルへのパス
     */
    public imgPath: string;

    /**
     * メッセージ
     */
    public msg: string;

    /**
     * コンストラクタ
     * @param DialogService ダイアローグサービス
     */
    constructor(
        protected DialogService: DialogService
    ) {

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
    public isOKCancel(): boolean {
        return this.btnType === ButtonType.OKCancel;
    }

    /**
     * OKボタンが押された時
     */
    public OK(): void {
        this.DialogService.setReturnValue(this.guid, { dialogResult: DialogResult.OK });
        this.DialogService.close(this.guid);
    }

    /**
     * Cancelボタンが押された時
     */
    public Cancel(): void {
        this.DialogService.setReturnValue(this.guid, { dialogResult: DialogResult.Cancel });
        this.DialogService.close(this.guid);
    }

}

app.controller("MessageDialogController",
    [
        "DialogService",
        MessageDialogController
    ]);