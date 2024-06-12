
using System.Net.NetworkInformation;
using backend.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore.Internal;

namespace backend.Utilities
{
    public class ObjectCreatorSingleton
    {
        private static ObjectCreatorSingleton? instance;

        private ObjectCreatorSingleton() { }

        public static ObjectCreatorSingleton Instance
        {
            get
            {
                return instance ??= new ObjectCreatorSingleton();
            }
        }

        public LoginResult ToLoginResult(KorisnikAgencija korisnikAgencija)
        {
            LoginResult loginResult = new LoginResult
            {
                id = korisnikAgencija.Id,
                name = korisnikAgencija.Ime,
                email = korisnikAgencija.Email,
                phoneNumber = korisnikAgencija.BrTel,
                role = korisnikAgencija.Role,
            };
            return loginResult;
        }


        public Korisnik FromRegistrationKorisnik(RegistrationKorisnik registrationKorisnik, string passwordHash)
        {
            var korisnik = new Korisnik
            {
                Ime = registrationKorisnik.name,
                Prezime = registrationKorisnik.lastName,
                Email = registrationKorisnik.email,
                BrTel = registrationKorisnik.phoneNumber,
                LozinkaHash = passwordHash,
                Role = Roles.Korisnik,
                Lokacija = registrationKorisnik.location
            };

            return korisnik;
        }

        public Agencija FromRegistrationAgencija(RegistrationAgencija registrationAgencija, string passwordHash)
        {
            var agencija = new Agencija
            {
                Ime = registrationAgencija.name,
                Email = registrationAgencija.email,
                BrTel = registrationAgencija.phoneNumber,
                LozinkaHash = passwordHash,
                Role = Roles.Agencija,
                Lokacija = registrationAgencija.location
            };

            return agencija;
        }

        public GetKorisnikResult ToKorisnikResult(Korisnik korisnik)
        {
            GetKorisnikResult getKorisnik = new GetKorisnikResult
            {
                id = korisnik.Id,
                name = korisnik.Ime,
                lastName = korisnik.Prezime,
                email = korisnik.Email,
                phoneNumber = korisnik.BrTel,
                role = korisnik.Role,
                profilePhoto = korisnik.SlikaProfila,
                location = korisnik.Lokacija
            };

            return getKorisnik;
        }

        public OglasObjektaResponse ToOglasResult(OglasObjekta oglas)
        {
            OglasObjektaResponse oglasObjektaResponse = new OglasObjektaResponse
            {
                id = oglas.Id,
                listaTipProslava = oglas.ListaTipProslava,
                listaTipProstora = oglas.ListaTipProstora,
                naziv = oglas.Naziv,
                grad = oglas.Grad,
                lokacija = oglas.Lokacija,
                cenaPoDanu = oglas.CenaPoDanu,
                brojSoba = oglas.BrojSoba,
                kvadratura = oglas.Kvadratura,
                brojKreveta = oglas.BrojKreveta,
                brojKupatila = oglas.BrojKreveta,
                grejanje = oglas.Grejanje,
                listDodatneOpreme = oglas.ListDodatneOpreme,
                brTel = oglas.BrTel,
                opis = oglas.Opis,
                slike = oglas.Slike,
                ocena = oglas.Ocena,
                brojOcena = oglas.BrojOcena,
                zauzetiDani = oglas.ZauzetiDani,
                idVlasnika = oglas.VlasnikOglasa?.Id,
            };

            return oglasObjektaResponse;
        }

        public OglasObjekta FromOglasResponse(OglasObjektaResponse oglas)
        {
            OglasObjekta oglasObjekta = new OglasObjekta
            {
                Id = oglas.id,
                ListaTipProslava = oglas.listaTipProslava,
                ListaTipProstora = oglas.listaTipProstora,
                Naziv = oglas.naziv,
                Grad = oglas.grad,
                Lokacija = oglas.lokacija,
                CenaPoDanu = oglas.cenaPoDanu,
                BrojSoba = oglas.brojSoba,
                Kvadratura = oglas.kvadratura,
                BrojKreveta = oglas.brojKreveta,
                BrojKupatila = oglas.brojKreveta,
                Grejanje = oglas.grejanje,
                ListDodatneOpreme = oglas.listDodatneOpreme,
                BrTel = oglas.brTel,
                Opis = oglas.opis,
                Slike = oglas.slike,
                Ocena = oglas.ocena,
                BrojOcena = oglas.brojOcena,
                ZauzetiDani = oglas.zauzetiDani,
            };

            return oglasObjekta;
        }

        public OglasObjekta ToOglas(OglasObjektaBasic oglas)
        {
            OglasObjekta oglasObjekta = new OglasObjekta
            {
                ListaTipProslava = oglas.listaTipProslava,
                ListaTipProstora = oglas.listaTipProstora,
                Naziv = oglas.naziv,
                Grad = oglas.grad,
                Lokacija = oglas.lokacija,
                CenaPoDanu = oglas.cenaPoDanu,
                BrojSoba = oglas.brojSoba,
                Kvadratura = oglas.kvadratura,
                BrojKreveta = oglas.brojKreveta,
                BrojKupatila = oglas.brojKreveta,
                Grejanje = oglas.grejanje,
                ListDodatneOpreme = oglas.listDodatneOpreme,
                BrTel = oglas.brTel,
                Opis = oglas.opis,
                Slike = oglas.slike,
                Ocena = oglas.ocena,
                BrojOcena = oglas.brojOcena,
                ZauzetiDani = oglas.zauzetiDani,
            };

            return oglasObjekta;
        }

        public MeniKeteringa ToMeniKeteringa(MeniKeteringaBasic meni)
        {
            MeniKeteringa meniKeteringa = new MeniKeteringa
            {
                CenaMenija = meni.cenaMenija,
                Naziv = meni.naziv,
                Opis = meni.opis,
                SastavMenija = meni.sastavMenija,
                Slika = meni.slika,
            };

            return meniKeteringa;
        }

        public MeniKeteringaResult ToMeniKeteringaResult(MeniKeteringa meni)
        {
            MeniKeteringaResult meniKeteringa = new MeniKeteringaResult
            {
                id = meni.Id,
                cenaMenija = meni.CenaMenija,
                naziv = meni.Naziv,
                opis = meni.Opis,
                sastavMenija = meni.SastavMenija,
                slika = meni.Slika,
                idKategorije = meni?.Kategorija?.Id
            };

            return meniKeteringa;
        }

        public KategorijaResult ToKategorijaResult(Kategorija kategorija)
        {
            KategorijaResult kat = new KategorijaResult
            {
                id = kategorija.Id,
                naziv = kategorija.Naziv,
                idAgencije = kategorija.Agencija?.Id
            };

            return kat;
        }

        public ZahtevZaKeteringResult ToZahtevZaKeteringResult(ZahtevZaKetering zahtev)
        {
            List<int> ints = new List<int>();
            if (zahtev.ZakupljeniMeniji != null)
            {
                foreach (MeniKeteringa meni in zahtev.ZakupljeniMeniji)
                {
                    ints.Add(meni.Id);
                }
            }

            ZahtevZaKeteringResult zahtevResult = new ZahtevZaKeteringResult
            {
                id = zahtev.Id,
                datumRezervacije = zahtev.DatumRezervacije,
                idAgencije = zahtev.Agencija?.Id,
                idMenija = ints,
                idOglasa = zahtev.ZakupljeniOglas?.Id,
                konacnaCena = zahtev.KonacnaCena,
                statusRezervacije = zahtev.StatusRezervacije,
            };

            return zahtevResult;
        }

        public ZakupljeniOglasDTO ToZakupljeniOglasDTO(ZakupljeniOglas oglas)
        {
            ZakupljeniOglasDTO zakupljeniOglasDTO = new ZakupljeniOglasDTO
            {
                id = oglas.Id,
                datumZakupa = oglas.DatumZakupa,
                korisnikId = oglas.Korisnik?.Id,
                zakupljenOd = oglas.ZakupljenOd,
                zakupljenDo = oglas.ZakupljenDo,
                oglasId = oglas.Oglas?.Id,
                statusZahtevaZaKetering = oglas.ZahtevZaKetering?.StatusRezervacije,
                cenaOglasa = oglas.Cena,
            };

            return zakupljeniOglasDTO;
        }

        public AgencijaBasic ToAgencijaBasic(Agencija agencija)
        {
            AgencijaBasic agencijaBasic = new AgencijaBasic
            {
                id = agencija.Id,
                brTel = agencija.BrTel,
                brojOcena = agencija.BrojOcena,
                email = agencija.Email,
                ime = agencija.Ime,
                lokacija = agencija.Lokacija,
                cenaDostave = agencija.CenaDostave,
                mogucnostDostave = agencija.MogucnostDostave,
                ocena = agencija.Ocena,
                opis = agencija.Opis,
                slikaProfila = agencija.SlikaProfila,
            };

            return agencijaBasic;
        }


    }
}