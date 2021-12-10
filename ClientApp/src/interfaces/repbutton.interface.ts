export interface REPButton {
    name: string;
    icon?: string;
    color?: string;
    onClick?: Function;
    route?: string;
    enabled?: boolean | (() => boolean);
    highlighted?: boolean;
    background?: string;
}