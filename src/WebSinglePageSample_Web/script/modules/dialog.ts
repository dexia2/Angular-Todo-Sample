/// <reference path="./../typing/jquery.d.ts" />
/// <reference path="./../typing/jqueryui.d.ts" />
/// <reference path="./../typing/angular.d.ts" />
/// <reference path="./../typing/angular-resource.d.ts" />

/**
* ダイアローグ設定クラス
*/
class DialogConfig {

    /**
     * 画面ID
     */
    screenId: string;

    /**
     * 画面タイトル
     */
    title: string;

    /**
     * viewファイルへのパス
     */
    path: string;

    /**
     * モーダル表示するかどうか
     */
    modal: boolean;

    /**
     * 表示幅
     */
    width: number;

    /**
     * 渡したいパラメータ
     */
    resolve: any;

    /**
     * 画面が閉じた際のコールバック
     */
    closeCallback: (guid: string) => void;

    /**
     * コンストラクタ
     */
    constructor() {
    }

}

/**
* ダイアローグサービス
*/
class DialogService {

    /**
     * 現在開いている画面のキーのコレクション
     */
    protected guids: { [screenKey: string]: string; } = {};

    /**
     * 現在開いている画面に渡すべきパラメータのコレクション
     */
    protected resolves: { [guid: string]: any; } = {};

    /**
     * 現在開いている画面から受け取った返り値のコレクション
     */
    protected retvals: { [guid: string]: any; } = {};

    /**
     * コンストラクタ
     * @param  $compile コンパイルサービス
     */
    public constructor(
        protected $compile: angular.ICompileService
    ) {
    }

    /**
     * GUIDの設定
     * @param guid 画面のキー
     * @param returnValue 返り値
     */
    public getGuidOf(
        screenKey: string
    ): string {
        var guid = this.guids[screenKey];
        delete this.guids[screenKey];
        return guid;
    }

    /**
     * パラメータの取得
     * @param guid 画面のキー
     * @return パラメータ
     */
    public getResolveOf(
        guid: string
    ): any {
        var resolve = this.resolves[guid];
        delete this.resolves[guid]
        return resolve;
    }

    /**
     * 返り値の設定
     * @param guid 画面のキー
     * @param returnValue 返り値
     */
    public setReturnValue(
        guid: string,
        returnValue: any
    ): void {
        this.retvals[guid] = returnValue;
    }

    /**
     * 返り値の取得
     * @param guid 画面のキー
     * @return returnValue 返り値
     */
    getReturnValueOf(
        guid: string
    ): any {
        var retval = this.retvals[guid];
        delete this.retvals[guid]
        return retval;
    }

    /**
     * ダイアローグの表示
     * @param config 画面設定
     * @return 画面のキー
     */
    public show(
        config: DialogConfig
    ): string {

        // 画面のキーの採番
        var guid = this.getGuid();

        // ダイアローグオプションへの設定
        var dialogOption: JQueryUI.DialogOptions =
            {
                show: "clip",
                hide: "fade",
                title: config.title,
                modal: config.modal,
                width: config.width,
                close: function (event) {

                    //コールバックの実行
                    if (config.closeCallback) config.closeCallback(guid);

                    //画面をHTMLから破棄
                    $(this).dialog('destroy');
                    $(event.target).remove();
                }
            };

        //ダイアローグを開く
        $(`<div class = "dialog" id = ${guid}></div>`).dialog(dialogOption);

        //ダイアローグ情報を保存
        this.guids[config.screenId] = guid;
        this.resolves[guid] = config.resolve;

        //ダイアローグにAngularのviewを差し込む
        var $dialog = $(`#${guid}`);
        var includeHtml = `<div ng-include="'${config.path}'"></div>`
        var scope = angular.element($dialog).scope();
        $dialog.append(this.$compile(includeHtml)(scope));

        return guid;
    }

    /**
     * 画面を閉じる
     * @param guid 画面のキー
     */
    public close(
        guid: string
    ):void {
        $(`#${guid}`).dialog('close');
    }

    /**
     * GUIDの取得
     * @return GUID
     */
    public getGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}

app.service("DialogService", ["$compile", DialogService]);