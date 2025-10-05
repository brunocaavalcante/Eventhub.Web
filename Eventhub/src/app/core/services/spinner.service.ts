import { inject, Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { NgxUiLoaderConfig, NgxUiLoaderService } from "ngx-ui-loader";

export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsColor: "#f04299",
    bgsOpacity: 0.6,
    bgsPosition: "bottom-right",
    bgsSize: 70,
    bgsType: "ball-spin-clockwise",
    blur: 15,
    delay: 0,
    fastFadeOut: true,
    fgsColor: "#f04299",
    fgsPosition: "center-center",
    fgsSize: 150,
    fgsType: "ball-scale-multiple",
    gap: 57,
    logoPosition: "center-center",
    logoSize: 120,
    logoUrl: "",
    masterLoaderId: "master",
    overlayBorderRadius: "0",
    overlayColor: "rgba(40, 40, 40, 0.8)",
    pbColor: "#f04299",
    pbDirection: "ltr",
    pbThickness: 4,
    hasProgressBar: true,
    text: "CARREGANDO...",
    textColor: "#FFFFFF",
    textPosition: "center-center",
    maxTime: -1,
    minTime: 300
};

@Injectable({ providedIn: 'root' })
export class SpinnerService extends BaseService {

    private readonly service = inject(NgxUiLoaderService);

    show(): void {
        this.service.startLoader('loader-01');
    }

    hide(): void {
        this.service.stopLoader('loader-01');
    }
}