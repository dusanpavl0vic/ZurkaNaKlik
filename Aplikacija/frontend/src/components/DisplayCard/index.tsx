import { CSSProperties } from "react";
import Icon from "../lib/icon";
import style from "./style.module.css";
type DisplayKardProps = {
  text: string;
  icon?: string;
  width?: string;
};

const DisplayCard = ({ text, icon, width }: DisplayKardProps) => {
  return (
    <div className={style.LabeleIkone} style={{ width: width }}>
      <Icon fontSize="20px" icon={icon} />
      <p>{text}</p>
    </div>
  );
};
export default DisplayCard;
