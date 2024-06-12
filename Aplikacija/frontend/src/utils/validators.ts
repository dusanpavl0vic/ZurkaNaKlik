import {
  CreateAgencyDTO,
  CreateUserDTO,
  LoginPayload,
} from "@/store/api/endpoints/auth/types";
import { UpdateUserDTO } from "@/store/api/endpoints/korisnik/types";
import Joi from "joi";

const customTlds = ["com", "net", "org"];

const emailVal = Joi.string()
  .required()
  .email({ tlds: { allow: customTlds } })
  .label("Email")
  .messages({
    "string.email": "Molimo vas unesite ispravan email.",
    "any.required": "{{#label}} polje je obavezno",
    "string.empty": "{{#label}} polje ne može biti prazno",
  });

const passwordVal = Joi.string()
  .required()
  .min(8)
  .max(30)
  .label("Lozinka")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazna.",
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
  });

const nameVal = Joi.string().required().min(4).max(40).label("Naziv").messages({
  "string.base": "{{#label}} mora biti niz karaktera",
  "string.empty": "{{#label}} ne može biti prazno.",
  "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
  "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
});

const userNameVal = Joi.string()
  .required()
  .min(4)
  .max(40)
  .label("Ime")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
  });

const lastNameVal = Joi.string()
  .required()
  .min(4)
  .max(40)
  .alphanum()
  .label("Prezime")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.alphanum": "{{#label}} može sadržati samo alfanumeričke znakove.",
  });

const phoneNumberVal = Joi.string()
  .required()
  .alphanum()
  .pattern(new RegExp("^(06)[0-9]{8}$"))
  .label("Broj telefona")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.pattern.base": "{{#label}} mora biti u formatu 06xxxxxxxx",
    "string.alphanum": "{{#label}} može sadržati samo alfanumeričke znakove.",
  });

const agencyNameVal = Joi.string()
  .required()
  .alphanum()
  .min(4)
  .max(40)
  .label("Ime agencije")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.alphanum": "{{#label}} može sadržati samo alfanumeričke znakove.",
  });

const instagramVal = Joi.string()
  .min(2)
  .pattern(new RegExp("^[a-zA-Z._0-9]+$"))
  .label("Instagram")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.pattern.base":
      '{{#label}} može sadržati samo slova, brojeve kao i "." i "_"',
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.alphanum": "{{#label}} može sadržati samo alfanumeričke znakove.",
  });

const twitterVal = Joi.string()
  .min(2)
  .pattern(new RegExp("^[a-z.0-9]+$"))
  .label("Twitter")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.pattern.base":
      '{{#label}} može sadržati samo slova, brojeve kao i "."',
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.alphanum": "{{#label}} može sadržati samo alfanumeričke znakove.",
  });

const cityValReq = Joi.string()
  .required()
  .min(2)
  .max(40)
  .label("Ime Grada")
  .messages({
    "string.base": "{{#label}} mora biti niz karaktera",
    "string.empty": "{{#label}} ne može biti prazno.",
    "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
    "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
  });

const cityVal = Joi.string().min(2).max(40).label("Ime Grada").messages({
  "string.base": "{{#label}} mora biti niz karaktera",
  "string.empty": "{{#label}} ne može biti prazno.",
  "string.min": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
  "string.max": "{{#label}} mora imati najmanje {{#limit}} karaktera.",
});

const roleVal = Joi.any();

export const userLoginSchema = Joi.object<LoginPayload>({
  email: emailVal,
  password: passwordVal,
});

export const userSignUpSchema = Joi.object<CreateUserDTO>({
  name: userNameVal,
  lastName: lastNameVal,
  phoneNumber: phoneNumberVal,
  email: emailVal,
  location: cityValReq,
  password: passwordVal,
  repeatPassword: passwordVal,
  role: roleVal,
});

export const updateUserSchema = Joi.object<UpdateUserDTO>({
  id: Joi.number(),
  name: userNameVal,
  lastName: lastNameVal,
  phoneNumber: phoneNumberVal,
  email: emailVal,
  location: cityValReq,
});

export const agencySignUpSchema = Joi.object<CreateAgencyDTO>({
  name: userNameVal,
  phoneNumber: phoneNumberVal,
  email: emailVal,
  location: cityValReq,
  password: passwordVal,
  repeatPassword: passwordVal,
  role: roleVal,
});

export const agencyRegisterSchema = Joi.object({
  name: userNameVal,
  email: emailVal,
  phoneNumberVal: phoneNumberVal,
  password: passwordVal,
});

export const agencyLoginSchema = Joi.object({
  email: emailVal,
  password: passwordVal,
});

export const addUserOglasSchema = Joi.object({
  listaTipProslava: Joi.array(),
  listaTipProstora: Joi.array(),
  listDodatneOpreme: Joi.array(),
  naziv: nameVal,
  brTel: phoneNumberVal.label("Broj Telefona"),
  grad: cityVal,
  lokacija: cityVal.label("Adresa"),
  cenaPoDanu: Joi.number().label("Cena po danu"),
  brojSoba: Joi.number().label("Broj Soba"),
  kvadratura: Joi.number().label("Kvadratura"),
  brojKreveta: Joi.number().label("Broj Kreveta"),
  brojKupatila: Joi.number().label("Broj Kupatila"),
  opis: Joi.string().label("Opis"),
  slike: Joi.array().label("Slike"),
  ocena: Joi.number().label("Ocena"),
  brojOcena: Joi.number().label("Broj Ocena"),
  grejanje: Joi.number().label("Grejanje"),
});

export const updateUserOglasSchema = Joi.object({
  id: Joi.any(),
  listaTipProslava: Joi.array(),
  listaTipProstora: Joi.array(),
  listDodatneOpreme: Joi.array(),
  naziv: nameVal,
  brTel: phoneNumberVal.label("Broj Telefona"),
  grad: cityVal,
  lokacija: cityVal.label("Adresa"),
  cenaPoDanu: Joi.number().label("Cena po danu"),
  brojSoba: Joi.number().label("Broj Soba"),
  kvadratura: Joi.number().label("Kvadratura"),
  brojKreveta: Joi.number().label("Broj Kreveta"),
  brojKupatila: Joi.number().label("Broj Kupatila"),
  opis: Joi.string().label("Opis"),
  slike: Joi.array().label("Slike"),
  ocena: Joi.number().label("Ocena"),
  brojOcena: Joi.number().label("Broj Ocena"),
  grejanje: Joi.number().label("Grejanje"),
});

export const updateAgencySchema = Joi.object<UpdateAgencyDTO>({
  id: Joi.number(),
  brojOcena: Joi.number(),
  cenaDostave: Joi.any(),
  email: emailVal,
  ime: nameVal,
  brTel: phoneNumberVal,
  lokacija: cityValReq,
  opis: Joi.string().label("Opis"),
  mogucnostDostave: Joi.boolean().label("Mogucnost dostave"),
  ocena: Joi.any(),
  slikaProfila: Joi.any(),
});
