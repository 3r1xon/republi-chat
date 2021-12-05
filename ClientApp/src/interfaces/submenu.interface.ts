export interface SubMenu {
    name: string;
    icon?: string;
    color?: string;
    onClick?: Function;
    route?: string;
    highlighted?: boolean;
}