import { PaginationData } from "../filters/types";


export type AgencyFilters = {
  filtersData: AgencyFiltersData;
  paginationData: PaginationData;
  sort: AgencySort;
};

export type AgencyFiltersData = {
  listaKategorija: string[];
  cenaDostaveOd?: number;
  cenaDostaveDo?: number;
  mogucnostDostave: boolean;
  grad?: string;
};

export enum AgencySort {
  CenaDostaveRastuca = "CenaDostaveRastuca",
  CenaDostaveOpadajuce = "CenaDostaveOpadajuce",
  OcenaRastuce = "OcenaRastuce",
  OcenaOpadajuce = "OcenaOpadajuce",
}

export const mapStringToSort = (value: string): AgencySort | undefined => {
  switch (value) {
    case "CenaDostaveRastuca":
      return AgencySort.CenaDostaveRastuca;
    case "CenaDostaveOpadajuce":
      return AgencySort.CenaDostaveOpadajuce;
    case "OcenaRastuce":
      return AgencySort.OcenaRastuce;
    case "OcenaOpadajuce":
      return AgencySort.OcenaOpadajuce;
    default:
      return undefined;
  }
};

// public string? sort { get; set; }
// public List<EnumTipProslava>? tipProslava { get; set; }
// public List<EnumTipProstora>? tipProstora { get; set; }

// public string? grad { get; set; }
// public int cenaOd { get; set; }
// public int cenaDo { get; set; }
// public int kvadraturaOd { get; set; }
// public int kvadraturaDo { get; set; }

// public List<EnumGrejanje>? grejanje { get; set; }
// public List<EnumDodatnaOprema>? dodatnaOprema { get; set; }

// public DateTime datumOd { get; set; }
// public DateTime datumDo { get; set; }

// const [gradValue, setGradValue] = useState<string | null>(null);
// const [cenaOd, setCenaOd] = useState("");
// const [cenaDo, setCenaDo] = useState("");
// const [broj, setBroj] = useState("");
// const [selectedDodatnaOprema, setSelectedDodatnaOprema] = useState<number[]>(
//   []
// );
// const [selectedTipoviProstora, setSelectedTipoviProslava] = useState<
//   number[]
// >([]);
// const [selectedTipoviGrejanja, setSelectedTipoviGrejanja] = useState<
//   number[]
// >([]);

// const [date, setDate] = useState<DateRange | undefined>();
