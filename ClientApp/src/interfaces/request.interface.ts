import { REPButton } from "./repbutton.interface";

export interface Request {
  title: string;
  message: string;
  actions?: Array<REPButton>;
  default?: any;
  visible: boolean;
}
