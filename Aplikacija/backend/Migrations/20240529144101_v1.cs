using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebTemplate.Migrations
{
    /// <inheritdoc />
    public partial class v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KorisniciAgencije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrTel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LozinkaHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    SlikaProfila = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Lokacija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TokenCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TokenExpires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ocena = table.Column<int>(type: "int", nullable: true),
                    MogucnostDostave = table.Column<bool>(type: "bit", nullable: true),
                    CenaDostave = table.Column<int>(type: "int", nullable: true),
                    BrojOcena = table.Column<int>(type: "int", nullable: true),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorisniciAgencije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AgencijaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategorije", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kategorije_KorisniciAgencije_AgencijaId",
                        column: x => x.AgencijaId,
                        principalTable: "KorisniciAgencije",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OglasiObjekta",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ListaTipProslava = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ListaTipProstora = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Lokacija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CenaPoDanu = table.Column<int>(type: "int", nullable: false),
                    BrojSoba = table.Column<int>(type: "int", nullable: false),
                    Kvadratura = table.Column<int>(type: "int", nullable: false),
                    BrojKreveta = table.Column<int>(type: "int", nullable: false),
                    BrojKupatila = table.Column<int>(type: "int", nullable: false),
                    Grejanje = table.Column<int>(type: "int", nullable: false),
                    ListDodatneOpreme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrTel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slike = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ocena = table.Column<double>(type: "float", nullable: true),
                    BrojOcena = table.Column<int>(type: "int", nullable: false),
                    ZauzetiDani = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VlasnikOglasaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OglasiObjekta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OglasiObjekta_KorisniciAgencije_VlasnikOglasaId",
                        column: x => x.VlasnikOglasaId,
                        principalTable: "KorisniciAgencije",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ZahteviZaKetering",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KonacnaCena = table.Column<int>(type: "int", nullable: false),
                    StatusRezervacije = table.Column<bool>(type: "bit", nullable: false),
                    DatumRezervacije = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AgencijaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahteviZaKetering", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZahteviZaKetering_KorisniciAgencije_AgencijaId",
                        column: x => x.AgencijaId,
                        principalTable: "KorisniciAgencije",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MenijiKeteringa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CenaMenija = table.Column<int>(type: "int", nullable: false),
                    Slika = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SastavMenija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KategorijaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenijiKeteringa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenijiKeteringa_Kategorije_KategorijaId",
                        column: x => x.KategorijaId,
                        principalTable: "Kategorije",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KorisnikOglasObjekta",
                columns: table => new
                {
                    ListaKorisnikaOmiljeniOglasId = table.Column<int>(type: "int", nullable: false),
                    ListaOmiljenihOglasaObjekataId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorisnikOglasObjekta", x => new { x.ListaKorisnikaOmiljeniOglasId, x.ListaOmiljenihOglasaObjekataId });
                    table.ForeignKey(
                        name: "FK_KorisnikOglasObjekta_KorisniciAgencije_ListaKorisnikaOmiljeniOglasId",
                        column: x => x.ListaKorisnikaOmiljeniOglasId,
                        principalTable: "KorisniciAgencije",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KorisnikOglasObjekta_OglasiObjekta_ListaOmiljenihOglasaObjekataId",
                        column: x => x.ListaOmiljenihOglasaObjekataId,
                        principalTable: "OglasiObjekta",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZakupljeniOglasi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OglasId = table.Column<int>(type: "int", nullable: true),
                    KorisnikId = table.Column<int>(type: "int", nullable: true),
                    DatumZakupa = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ZakupljenOd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ZakupljenDo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ZakupljeniOglas = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZakupljeniOglasi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZakupljeniOglasi_KorisniciAgencije_KorisnikId",
                        column: x => x.KorisnikId,
                        principalTable: "KorisniciAgencije",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ZakupljeniOglasi_OglasiObjekta_OglasId",
                        column: x => x.OglasId,
                        principalTable: "OglasiObjekta",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ZakupljeniOglasi_ZahteviZaKetering_ZakupljeniOglas",
                        column: x => x.ZakupljeniOglas,
                        principalTable: "ZahteviZaKetering",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MeniKeteringaZahtevZaKetering",
                columns: table => new
                {
                    ListaZahetevaZaKeteringId = table.Column<int>(type: "int", nullable: false),
                    ZakupljeniMenijiId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeniKeteringaZahtevZaKetering", x => new { x.ListaZahetevaZaKeteringId, x.ZakupljeniMenijiId });
                    table.ForeignKey(
                        name: "FK_MeniKeteringaZahtevZaKetering_MenijiKeteringa_ZakupljeniMenijiId",
                        column: x => x.ZakupljeniMenijiId,
                        principalTable: "MenijiKeteringa",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeniKeteringaZahtevZaKetering_ZahteviZaKetering_ListaZahetevaZaKeteringId",
                        column: x => x.ListaZahetevaZaKeteringId,
                        principalTable: "ZahteviZaKetering",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Kategorije_AgencijaId",
                table: "Kategorije",
                column: "AgencijaId");

            migrationBuilder.CreateIndex(
                name: "IX_KorisnikOglasObjekta_ListaOmiljenihOglasaObjekataId",
                table: "KorisnikOglasObjekta",
                column: "ListaOmiljenihOglasaObjekataId");

            migrationBuilder.CreateIndex(
                name: "IX_MenijiKeteringa_KategorijaId",
                table: "MenijiKeteringa",
                column: "KategorijaId");

            migrationBuilder.CreateIndex(
                name: "IX_MeniKeteringaZahtevZaKetering_ZakupljeniMenijiId",
                table: "MeniKeteringaZahtevZaKetering",
                column: "ZakupljeniMenijiId");

            migrationBuilder.CreateIndex(
                name: "IX_OglasiObjekta_VlasnikOglasaId",
                table: "OglasiObjekta",
                column: "VlasnikOglasaId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviZaKetering_AgencijaId",
                table: "ZahteviZaKetering",
                column: "AgencijaId");

            migrationBuilder.CreateIndex(
                name: "IX_ZakupljeniOglasi_KorisnikId",
                table: "ZakupljeniOglasi",
                column: "KorisnikId");

            migrationBuilder.CreateIndex(
                name: "IX_ZakupljeniOglasi_OglasId",
                table: "ZakupljeniOglasi",
                column: "OglasId");

            migrationBuilder.CreateIndex(
                name: "IX_ZakupljeniOglasi_ZakupljeniOglas",
                table: "ZakupljeniOglasi",
                column: "ZakupljeniOglas",
                unique: true,
                filter: "[ZakupljeniOglas] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KorisnikOglasObjekta");

            migrationBuilder.DropTable(
                name: "MeniKeteringaZahtevZaKetering");

            migrationBuilder.DropTable(
                name: "ZakupljeniOglasi");

            migrationBuilder.DropTable(
                name: "MenijiKeteringa");

            migrationBuilder.DropTable(
                name: "OglasiObjekta");

            migrationBuilder.DropTable(
                name: "ZahteviZaKetering");

            migrationBuilder.DropTable(
                name: "Kategorije");

            migrationBuilder.DropTable(
                name: "KorisniciAgencije");
        }
    }
}
