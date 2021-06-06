/* AUTOILUMITTARI

Solibadiksen koodihaaste 06/2021
https://koodihaaste.solidabis.com/

Tekijä Antti Rajasärkkä
antti@rajasarkka.fi
050 514 9318

Testattu toimivaksi:
Windows:
- Chrome 91.0.4472.77
- Firefox 89.0
- Edge 91.0.864.37

Android 10:
- Chrome 91.0.4472.77

Ei toimi:
Windows:
- Internet Explorer 11 (ei tue JS 2015)

*/
"use strict";

const KULUTUS = [3, 3.5, 4];	//kulutus l/100km nopeudella 1 km/h, autot 1-3
const KULMAKERROIN = 1.009;		//kulutuksen kasvu per 1km/h lisää nopeutta

const KULUTUS_TARKKUUS = 2; 	//monenko numeron tarkkuudella tulos esitetään - toPrecision()
const KULUTUSERO_TARKKUUS = 1;	//monenko desimaalin tarkkuudella ero esitetään - toFixed()

const MATKAN_PITUUS_TYHJA = "Syötä matkan pituus";
const MATKAN_PITUUS_VIRHE = "Matkan pituuden oltava välillä 0-999 999";

const NOPEUS_TYHJA = "Syötä matkanopeus";
const NOPEUS_VIRHE = "Nopeuden oltava välillä yli 0 ja alle 999"
		
function kirjoitaKulutus(autoNro) {
	//kirjoittaa kulutuslukeman auton kuvaukseen
	//autoNro auton id välillä 1-3
	if (autoNro !== undefined && autoNro >= 1 && autoNro <= 3) {
		document.write("(kulutus " + KULUTUS[autoNro-1] + " l/100km)");
	}
}

function laskeTulos() {
	//laskee ja tulostaa matka-ajat ja kulutukset taulukkoon
				
	var aika1 = -1, aika2 = -1;
	var aikaero1 = -1, aikaero2 = -1;
	var matka = -1;
	var valittuAuto = -1;
	var nopeus1 = -1, nopeus2 = -1;
	var kulutus1 = -1, kulutus2 = -1;
	var kulutusero1 = -1, kulutusero2 = -1;

	var aikaerokentta1, aikaerokentta2;
	var kulutuserokentta1, kulutuserokentta2;
	
	//ensin tarkistetaan kentät
	if (tarkistaKentat() !== true) {
		//kentissä vikaa => lopeta
		return ;
	}
	
	valittuAuto = document.forms.valinnat.auton_tyyppi.value;
	matka = document.forms.valinnat.matka.value;
	nopeus1 = document.forms.valinnat.nopeus1.value;
	nopeus2 = document.forms.valinnat.nopeus2.value;
	
	aika1 = matka / nopeus1; //aika tunteina
	document.getElementById("aika1").innerHTML = muotoileAika(aika1);
	aika2 = matka / nopeus2;
	document.getElementById("aika2").innerHTML = muotoileAika(aika2);
	
	aikaero1 = aika1 - aika2;
	aikaerokentta1 = document.getElementById("aikaero1");
	aikaerokentta1.innerHTML = muotoileAika(aikaero1, true);
	aikaerokentta1.className = annaEroKentanClass(aikaero1);
	
	aikaero2 = aika2 - aika1;
	aikaerokentta2 = document.getElementById("aikaero2");
	aikaerokentta2.innerHTML = muotoileAika(aikaero2, true);
	aikaerokentta2.className = annaEroKentanClass(aikaero2, true);

	kulutus1 = laskeKulutus(valittuAuto, nopeus1) * matka / 100; //lasketaan absoluuttinen kuluva polttoainemäärä (matka/100 siksi, että kulutus on l/100km)
	document.getElementById("kulutus1").innerHTML = kulutus1.toPrecision(KULUTUS_TARKKUUS);
	kulutus2 = laskeKulutus(valittuAuto, nopeus2) * matka / 100; 
	document.getElementById("kulutus2").innerHTML = kulutus2.toPrecision(KULUTUS_TARKKUUS);
	
	kulutusero1 = kulutus1- kulutus2;
	kulutuserokentta1 = document.getElementById("kulutusero1");
	kulutuserokentta1.innerHTML = "" + annaPositiivinenEtumerkki(kulutusero1) + kulutusero1.toFixed(KULUTUSERO_TARKKUUS);
	kulutuserokentta1.className = annaEroKentanClass(kulutusero1);

	kulutusero2 = kulutus2- kulutus1;
	kulutuserokentta2 = document.getElementById("kulutusero2");
	kulutuserokentta2.innerHTML = "" + annaPositiivinenEtumerkki(kulutusero2) + kulutusero2.toFixed(KULUTUSERO_TARKKUUS);
	kulutuserokentta2.className = annaEroKentanClass(kulutusero2);
}

function laskeKulutus(autoNro, nopeus) {
	//laskee auton kulutuksen (l/100km) tietylle nopeudelle
	//autoNro = auton numero, väli 1-3
	//nopeus, km/h

	//x0 = taulukkokulutus nopeudella 1 km/h 
	//x = kulutus tietyllä nopeudella 
	//k = annettu kulmakerroin kulutuksen kasvulle per 1 km/h lisää nopeutta
	// => x = x0*k^(x-1)
	
	return KULUTUS[autoNro - 1] * Math.pow(KULMAKERROIN, nopeus - 1);
}

function muotoileAika(aika, etumerkki=false) {
	//sisään:	aika tunteina (desimaali)
	//			etumerkki - tulostetaanko positiivinen etumerkki vai ei
	//palauttaa ajan tulostettavassa muodossa h:mm, pyöristetään täysiin minuutteihin
	//esim. aika = 2.11 (= 2h 6,6s) => palautus 2:07
	
	var aikaString = "";
	var minuutit = -1;
	
	//etumerkki
	if (aika > -1 && aika < 0 ) {
		//jos aika on välillä ]-1,0[, parseInt antaa vain nollan, eikä tulosta miinusta
		//tällä pakotetaan miinus alle 1h negatiivisiin arvoihin
		aikaString += "-";
	}
	else if (etumerkki == true && aika > 0) {
		aikaString += "+";
	}
	
	//tunnit
	aikaString += parseInt(aika);
	aikaString += ":";
	
	//minuutit
	minuutit = Math.abs((aika - parseInt(aika)))*60; //etumerkki on hoidettu jo edellä eikä miinusta ei haluta enää minuuttien eteen, siksi abs
	minuutit = minuutit.toFixed(0);
	if (minuutit >= 0 && minuutit < 10) {
		aikaString += "0";
	}
	aikaString += minuutit;
	
	return aikaString; 
}

function annaEroKentanClass(luku) {
	//palauttaa CSS-luokan nimen:
	//	"positiivinen" jos luku < 0
	//	"negatiivinen" jos luku > 0
	//	"nolla" jos luku == 0
	// käänteinen == true kääntää vertailun päinvastoin
	
	if (luku < 0) {
		return "positiivinen";
	}
	else if (luku > 0) {
		return "negatiivinen";
	}
	else {
		return "nolla";
	}
}

function annaPositiivinenEtumerkki(luku) {
	//palauttaa etumerkin:
	//	"+" jos luku > 0
	//	"" jos luku <= 0¨
	
	if (luku > 0) {
		return "+";
	}	
	else {
		return "";
	}
}

function tarkistaKentat() {
	//tarkastaa, onko kenttiin syötetty oikeita arvoja
	//ja näyttää tai piilottaa ohjetekstin vastaavasti
	
	//PALAUTTAA:	true, jos kaikki kunnossa
	//				false, jos joku kenttä ei kunnossa
	
	var paluuarvo = true;
	
	// *** auton tyyppi ***
	
	//sallitut arvot 1-3
	
	var testi = /(1|2|3)/;
	var autonTyyppi = document.forms.valinnat.auton_tyyppi.value;
	var auto_ohje = document.getElementById("auto_ohje");
	if (testi.test(autonTyyppi)) {
		auto_ohje.style.display = "none";
	}
	else {
		auto_ohje.style.display = "block";
		tyhjennaTulokset();
		paluuarvo = false;
	}
		
	// *** matkan pituus ***
	
	//täytyy olla numero välillä [0, 100000[
	
	var matkaohje = document.getElementById("matkaohje");
	var matkanPituusTeksti = document.forms.valinnat.matka.value;
	var matkanPituusNro = Number(matkanPituusTeksti); 		//Jos kenttä ei ole numero, palauttaa NaN
	
	if (matkanPituusTeksti !== "" && !Number.isNaN(matkanPituusNro)) {
		//Tässä vaiheessa selvää, että kentässä on numero
		if (matkanPituusNro >= 0 && matkanPituusNro < 1000000) {
			//kaikki kunnossa, piilota ohje
			matkaohje.style.display = "none";
		}
		else {
			//kentässä numero sallitun välin ulkopuolella
			matkaohje.innerHTML = MATKAN_PITUUS_VIRHE;
			matkaohje.style.display = "inline";
			tyhjennaTulokset();
			paluuarvo = false;
		}
	}
	else {
		//kenttä tyhjä tai ei-numero
		matkaohje.innerHTML = MATKAN_PITUUS_TYHJA;
		matkaohje.style.display = "inline";
		tyhjennaTulokset();
		paluuarvo = false;
	}

	// *** nopeus ***
	
	//täytyy olla numero välillä ]0, 1000[
	
	var nopeusohje = document.getElementById("nopeusohje");
	var nopeusTeksti1 = document.forms.valinnat.nopeus1.value;
	var nopeusTeksti2 = document.forms.valinnat.nopeus2.value;
	var nopeusNro1 = Number(nopeusTeksti1);
	var nopeusNro2 = Number(nopeusTeksti2);
	
	if (nopeusTeksti1 !== "" && !Number.isNaN(nopeusNro1) && nopeusTeksti2 !== "" && !Number.isNaN(nopeusNro2) ) {
		if (nopeusNro1 > 0 && nopeusNro1 < 1000 && nopeusNro2 > 0 && nopeusNro2 < 1000) {
			//kaikki kunnossa
			nopeusohje.style.display = "none";
		}
		else {
			//syötetty numero sallitun välin ulkopuolella
			nopeusohje.innerHTML = NOPEUS_VIRHE;
			nopeusohje.style.display = "inline";
			tyhjennaTulokset();
			paluuarvo = false;
		}
	}
	else {
		//jompikumpi kenttä tyhjä tai ei-numero
		nopeusohje.innerHTML = NOPEUS_TYHJA;
		nopeusohje.style.display = "inline";
		tyhjennaTulokset();
		paluuarvo = false;
	}
				
	return paluuarvo;
}

function tyhjennaTulokset() {
	//tyhjentää tuloskentät
	
	document.getElementById("aika1").innerHTML = "&nbsp;";
	document.getElementById("aika2").innerHTML = "&nbsp;";
	document.getElementById("aikaero1").innerHTML = "&nbsp;";
	document.getElementById("aikaero2").innerHTML = "&nbsp;";
	document.getElementById("kulutus1").innerHTML = "&nbsp;";
	document.getElementById("kulutus2").innerHTML = "&nbsp;";
	document.getElementById("kulutusero1").innerHTML = "&nbsp;";
	document.getElementById("kulutusero2").innerHTML = "&nbsp;";	
		
}

function naytaOhjetekstit() {
	//näyttää kaikki tyhjien kenttien ohjetekstit
	auto_ohje.style.display = "block";
	tyhjennaTulokset();
	matkaohje.innerHTML = MATKAN_PITUUS_TYHJA;
	matkaohje.style.display = "inline";
	nopeusohje.innerHTML = NOPEUS_TYHJA;
	nopeusohje.style.display = "inline";
}	
