type Agency = {
  id: number;
  ime: string;
  email: string;
  brTel: string;
  slikaProfila?: string;
  lokacija: string;
  opis?: string;
  ocena?: number;
  mogucnostDostave: boolean;
  cenaDostave: number;
  brojOcena: number;
};

type UpdateAgencyDTO = Agency;

type Category = {
  id: number;
  naziv: string;
  idAgencije?: number;
};

type Menu = {
  id: number;
  naziv: string;
  slika?: string;
  opis: string;
  cenaMenija: number;
  sastavMenija: string[];
  idKategorije?: number;
};

type GetMenuDTO = {
  id: number;
  naziv: string;
  meniKeteringa: Menu[];
};

type AddMenuDTO = {
  id: number;
  menu: Omit<Menu, "id" | "idKategorije">;
};

type AddCategoryDTO = Omit<Category, "id">;

type CateringOrder = {
  id: number;
  konacnaCena: number;
  statusRezervacije: boolean | null;
  datumRezervacije: Date;
  idOglasa?: number;
  idAgencije?: number;
  idMenija?: number[];
};

// TODO CHECK THIS
type MenuForList = {
  id: number;
  naziv: string;
  cenaMenija: number;
  slika: string;
  opis: string;
  sastavMenija: string[];
};
