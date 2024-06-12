import { SyntheticEvent, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import MojButton from "@/components/lib/button";
import Input from "@/components/lib/inputs/text-input";

// import authAction from "../../actions/authAction";
import { userSignUpSchema } from "@/utils/validators";
import { useUserSignUpMutation } from "@/store/api/endpoints/auth";
import { CreateUserDTO } from "@/store/api/endpoints/auth/types";
import { Role } from "@/models/role";
import { logOut, setToken, setUser } from "@/store/auth";
import { useAppDispatch } from "@/store";
import { toast } from "react-toastify";

const UserSignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [nameText, setNameText] = useState("");
  const [lastNameText, setLastNameText] = useState("");
  const [emailText, setMailText] = useState("");
  const [phoneNumberText, setPhoneNumberText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [repeatPasswordText, setRepeatPasswordText] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(
    null
  );

  const [handleSignUp] = useUserSignUpMutation();

  const isValid = (loginData: CreateUserDTO): boolean => {
    setNameError("");
    setLastNameError("");
    setPhoneNumberError("");
    setEmailError("");
    setLocationError("");
    setPasswordError("");
    setRepeatPasswordError("");
    const valResult = userSignUpSchema.validate(loginData);

    if (valResult.error) {
      const errType = valResult?.error?.details[0].path[0];
      const errText = valResult?.error?.details[0].message;

      if (errType === "name") setNameError(errText);
      if (errType === "lastName") setLastNameError(errText);
      if (errType === "phoneNumber") setPhoneNumberError(errText);
      if (errType === "email") setEmailError(errText);
      if (errType === "location") setLocationError(errText);
      if (errType === "password") setPasswordError(errText);
      if (errType === "repeatPassword") setRepeatPasswordError(errText);
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

    const signUpData: CreateUserDTO = {
      name: nameText,
      lastName: lastNameText,
      phoneNumber: phoneNumberText,
      email: emailText,
      password: passwordText,
      repeatPassword: repeatPasswordText,
      location: locationText,
      role: Role.USER,
    };

    const valid = isValid(signUpData);
    if (valid == false) return;

    const signUpResult = await handleSignUp(signUpData);
    if ("error" in signUpResult) return;
    // dispatch(setToken(signUpResult.data.accessToken));
    // dispatch(setUser(signUpResult.data.loginResult));

    toast.success("Nalog je uspesno kreiran.");
    navigate("/login");
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
          onChange={setLastNameText}
          icon={"edit"}
          text={lastNameText}
          placeholder={"Prezime"}
          error={lastNameError}
        />
        <Input
          onChange={setPhoneNumberText}
          icon={"phone"}
          text={phoneNumberText}
          placeholder={"Broj Telefona"}
          error={phoneNumberError}
        />
        <Input
          onChange={setMailText}
          icon={"mail"}
          text={emailText}
          placeholder={"Email"}
          error={emailError}
        />
        <Input
          onChange={setLocationText}
          icon={"location_on"}
          text={locationText}
          placeholder={"Ime Grada"}
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

export default UserSignUpForm;
