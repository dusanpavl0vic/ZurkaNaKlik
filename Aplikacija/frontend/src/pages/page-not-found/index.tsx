import { useNavigate } from "react-router-dom";
import style from "./style.module.css";

// components
import MojButton from "@/components/lib/button";
import PageSpacer from "@/components/lib/page-spacer";

// other
import { SVG as PNF } from "@/assets/images/pageNotFound.svg";

function PageNotFound() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper bs ${style.wrapper}`}>
        <div className={style.text}>
          <div className="pageNotFoundTextContainer">
            <h1>Uuuups!</h1>
            <p>Stranica koju ste zatražili nažalost ne postoji.</p>
          </div>
          <MojButton text={"Nazad na pocetnu"} onClick={handleClick} />
        </div>
        {/* // TODO configure svgs correctly */}
        <div className={style.image}>
          <img src="/public/images/not_found.png" />
        </div>
      </div>
      <PageSpacer />
    </>
  );
}

export default PageNotFound;
