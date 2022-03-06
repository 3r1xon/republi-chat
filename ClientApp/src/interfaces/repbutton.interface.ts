export interface REPButton {
  name: string;
  icon?: string;
  color?: string;
  onClick?: Function;
  route?: string;
  tooltip?: string;
  type?: string;
  outline?: boolean;
  hotkey?: string;
  enabled?: Function;
  visible?: Function;
  highlighted?: boolean;
  background?: string;
}
