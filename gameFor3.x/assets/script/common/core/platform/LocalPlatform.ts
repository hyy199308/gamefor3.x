import PlatformBase from "./PlatformBase";

export default class LocalPlatform extends PlatformBase {

    constructor() {
        super();
    }

    public login(callback: (data: any) => void): void {
        callback(null);
    }

    public share(callback: (success: boolean) => void): void {
        callback(true);
    }

    public watchAd(callback: (success: boolean, shareState: boolean) => void, ad: string = '', eventId: number = 999): void {
        callback(true, false);
    }

    public adShare(callback: (success: boolean) => void): void {
        callback(true);
    }

    public shareViode(callback: (success: any) => void): void {
        callback("success");
    }

    public name(): string {
        return "local";
    }
}
