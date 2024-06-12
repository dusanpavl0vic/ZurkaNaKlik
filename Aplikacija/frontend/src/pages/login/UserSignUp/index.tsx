import style from "../style.module.css";
import LoginLabel from "@/components/lib/labels/login";
import UserSignUpForm from "../../../components/UserSignUpForm";
import PageSpacer from "@/components/lib/page-spacer";

const UserSignUpPage = () => {
  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper bs ${style.container}`}>
        <div className={style.textContent}>
          <div className={style.textWrapper}>
            <h1>Napravite Nalog</h1>
            <p>
              Samo korisnici sa nalogom mogu iznajmljivati ili oglašavati
              prostore. Kreirajte svoj nalog u svega par trenutaka.
            </p>
            <p>
              Ukoliko želite da nudite usluge keteringa, pratite link ispod.
            </p>
            <div className="smallSpace" />
          </div>
          <div className={style.optionsWrapper}>
            <LoginLabel
              text={"Nudite usluge keteringa?"}
              linkText={"Oglasite se"}
              link={"/catering/register"}
            />
            <LoginLabel
              text={"Već imate nalog?"}
              linkText={"Prijavite se"}
              link={"/login"}
            />
          </div>
        </div>
        <div className={style.loginElements}>
          <UserSignUpForm />
        </div>
      </div>
    </>
  );
};

export default UserSignUpPage;
