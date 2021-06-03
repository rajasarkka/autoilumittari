# autoilumittari
Solibadiksen koodihaaste 06/2021

Tekijä Antti Rajasärkkä, antti@rajasarkka.fi, 050 514 9318

Sovellus on tehty JavaScriptillä, käyttöliittymä HTML + CSS. JavaScriptissä käytössä ovat JS 2015 (ECMAScrpit 6) ominaisuudet, mikä tarkoittaa sitä, että sovellus ei toimi vanhemmilla selaimilla. 

-----------------------------------------------------------------------
Toteutus on testattu toimivaksi ainakin näillä selaimilla:
Windows 10:
- Chrome 91.0.4472.77
- Firefox 89.0
- Edge 91.0.864.37

Android 10:
- Chrome 91.0.4472.77

Ei toimi:
Windows 10
- Internet Explorer 11

-----------------------------------------------------------------------
Sovelluksen asennus ja käyttö:

Sovellus toimii yksinkertaisesti selaimessa. Kaikki kolme tiedostoa (autoilumittari.html, autoilumittari.js ja autoilumittari.css) kopioidaan samaan hakemistoon ja avataan sivu autoilumittari.html selaimessa.

Toimiva sivu löytyy suoraan tästä: http://rajasarkka.fi/koodikisa/autoilumittari.html

Itse käyttö on suoraviivaista, ja sovellus opastaa täyttämään kentät oikein. Tyhjennä kentät -napilla voi tyhjentää kaikki kentät kerralla.

-----------------------------------------------------------------------
Tunnetut ominaisuudet

- Käytetty JavaScriptin versio ei toimi vanhemmilla selaimilla. Valitsin kuitenkin tämän version, sillä se mm. sallii muuttujien määrittelyn vakioiksi (const). Yhteensopivuus taaksepäin olisi kuitenkin helppo toteuttaa esim. muuttamalla const-määritellyt muuttujat var-määritellyiksi.

- Matkustusajan ja polttoaineen kulutuksen erot lasketaan tarkoista arvoista. Tämä tarkoittaa, että pyöristyksistä johtuen esim. sopivilla numeroilla 
matkustusaika 1 + erotus != matkustusaika 2. 
matkustusaika 1 = 50,4 min => näyttö 0.50
matkustusaika 2 = 40,6 min => näyttö 0.41
erotus tarkoilla arvoilla 9,8 min => näyttö 0.10, vaikka näkyville pyöristetyillä arvoilla laskettuna ero olisikin 50 - 41 = 9 min.
Tämä voi tuntua satunnaisesta käyttäjästä harhaanjohtavalta, joten asiakkaan niin halutessa muutos erotuksen laskemiseen pyöristetyillä arvoilla olisi helppo toteuttaa.
