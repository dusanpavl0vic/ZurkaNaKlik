import style from "../style.module.css";

import LoginLabel from "@/components/lib/labels/login";
import PageSpacer from "@/components/lib/page-spacer";
import AgencySignUpForm from "@/components/AgencySignUpForm";
import { useLocation } from "react-router-dom";

const AgencySignUp = () => {

  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper bs ${style.container}`}>
        <div className={style.textContent}>
          <div className={style.textWrapper}>
            <h1>Izdajte vaše usluge</h1>
            <p>
              Ponudite vaše usluge korisnicima. Kreirajte nalog, a zatim dodajte
              menije i gradove u kojima je moguće poručivanje.
            </p>
            <div className="smallSpace" />
          </div>
          <div className={style.optionsWrapper}>
            <LoginLabel
              text={"Niste agencija?"}
              linkText={"Kreirajte korisnički nalog"}
              link={"/user/signup"}
            />
            <LoginLabel
              text={"Već imate agencijski nalog?"}
              linkText={"Prijavite se"}
              link={"/Login"}
            />
          </div>
        </div>
        <div className={style.loginElements}>
          <AgencySignUpForm />
        </div>
      </div>
    </>
  );
};

export default AgencySignUp;
