import { SyntheticEvent, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import MojButton from "@/components/lib/button";
import Input from "@/components/lib/inputs/text-input";

// import authAction from "../../actions/authAction";
import { agencySignUpSchema, userSignUpSchema } from "@/utils/validators";
import {
  useAgencySignUpMutation,
  useUserSignUpMutation,
} from "@/store/api/endpoints/auth";
import {
  CreateAgencyDTO,
  CreateUserDTO,
} from "@/store/api/endpoints/auth/types";
import { Role } from "@/models/role";
import {
  selectIsFirstLogin,
  setIsFirstLogin,
  setToken,
  setUser,
} from "@/store/auth";
import { useAppDispatch } from "@/store";
import { toast } from "react-toastify";

const AgencySignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [nameText, setNameText] = useState("");
  const [emailText, setMailText] = useState("");
  const [phoneNumberText, setPhoneNumberText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [repeatPasswordText, setRepeatPasswordText] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(
    null
  );

  const [handleSignUp] = useAgencySignUpMutation();

  const isValid = (loginData: CreateAgencyDTO): boolean => {
    setNameError("");
    setEmailError("");
    setPhoneNumberError("");
    setLocationError("");
    setPasswordError("");
    setRepeatPasswordError("");
    const valResult = agencySignUpSchema.validate(loginData);

    if (valResult.error) {
      const errType = valResult?.error?.details[0].path[0];
      const errText = valResult?.error?.details[0].message;

      if (errType === "name") setNameError(errText);
      if (errType === "email") setEmailError(errText);
      if (errType === "phoneNumber") setPhoneNumberError(errText);
      if (errType === "location") setLocationError(errText);
      if (errType === "password") setPasswordError(errText);
      if (errType === "repeatPassword") setRepeatPasswordError(errText);

      toast.warn(errText);

      return false;
    }
    if (loginData.password.localeCompare(loginData.repeatPassword)) {
      setRepeatPasswordError("Lozinke se ne poklapaju.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const signUpData: CreateAgencyDTO = {
      name: nameText,
      email: emailText,
      phoneNumber: phoneNumberText,
      location: locationText,
      password: passwordText,
      repeatPassword: repeatPasswordText,
      role: Role.AGENCIJA,
    };

    const valid = isValid(signUpData);
    if (valid == false) return;

    const signUpResult = await handleSignUp(signUpData);
    if ("error" in signUpResult) return;
    // dispatch(setToken(signUpResult.data.accessToken));
    // dispatch(setUser(signUpResult.data.loginResult));
    dispatch(setIsFirstLogin(true));

    toast.success("Nalog je uspesno kreiran");
    navigate("/login", { replace: true });
  };

  return (
    <Form className="loginForm">
      <div className="formInputsWrapper">
        <Input
          onChange={setNameText}
          icon={"edit"}
          text={nameText}
          placeholder={"Ime"}
          error={nameError}
        />
        <Input
          onChange={setMailText}
          icon={"mail"}
          text={emailText}
          placeholder={"Email"}
          error={emailError}
        />
        <Input
          onChange={setPhoneNumberText}
          icon={"phone"}
          text={phoneNumberText}
          placeholder={"Broj telefona"}
          error={phoneNumberError}
        />
        <Input
          onChange={setLocationText}
          icon={"location_on"}
          text={locationText}
          placeholder={"Grad"}
          error={locationError}
        />
        <Input
          onChange={setPasswordText}
          icon={"lock"}
          text={passwordText}
          placeholder={"Lozinka"}
          suffixIcon={true}
          error={passwordError}
        />
        <Input
          onChange={setRepeatPasswordText}
          icon={"lock"}
          text={repeatPasswordText}
          placeholder={"Ponovi Lozinku"}
          suffixIcon={true}
          error={repeatPasswordError}
        />
      </div>
      <MojButton
        text={"Prijavi se"}
        onClick={handleSubmit}
        wide={true}
        center={true}
        paddingY={"16px"}
      />
    </Form>
  );
};

export default AgencySignUpForm;
