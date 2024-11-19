import { uzivatele } from "./data/uzivatele.js";
import { darky } from "./data/darky.js";

//LOCAL STORAGE ZÍSKÁNÍ DAT
const idUzivatele = localStorage.getItem('vybranyUzivatelId'); //z local storage dostanu id uživatele, které jsem ukládal v prihlaseni.js
const vybranyUzivatel = uzivatele.find(uzivatel => uzivatel.id === idUzivatele); //loop - uzivatel je proměnná, do které se postupně zapisuje každý uživatel v uzivatele a hledá to stejné id

//NADPIS
document.querySelector('.js-nadpis')    //dynemické definování nadpisu - píšu do něj jméno vybraného uživatele
    .innerHTML=`Vybraný uživatel: ${vybranyUzivatel.jmeno}`;

//TLACITKO ZPET
document.getElementById('tlacitkoZpet').addEventListener('click', () => { //tlačítko zpět
    window.history.back();
    });

//TLACITKA PREPINANI ZOBRAZENI
let soucasnyStav = "proMe"; //stav pro přepínání tlačítek - na začátku je automaticky zvoleno "Pro mě"
const tlackitkoProMe = document.getElementById('tlacitkoDarkyProMe');   
const tlackitkoProOstatni = document.getElementById('tlacitkoDarkyProOstatni');
tlackitkoProMe.classList.add('aktivni') //pro vizuální změnu stylu - do zvoleného tlačítka přijám tuto třídu, aby bylo tlačítko zelené

tlackitkoProMe.addEventListener('click', () => {tlackitkoProMe.classList.add('aktivni');    //pokud přidám znovu třídu .aktivni do již zvoleného tlačítka, nic se nestane (třída se neduplikuje)
    tlackitkoProOstatni.classList.remove('aktivni')
    });
tlackitkoProOstatni.addEventListener('click', () => {tlackitkoProOstatni.classList.add('aktivni');
    tlackitkoProMe.classList.remove('aktivni')
    });


function zobrazDarky() {
    const filtrDarky = darky.filter(darek => 
        darek.zapsal === vybranyUzivatel.jmeno && darek.proKoho === vybranyUzivatel.jmeno
    );

    let seznamDarkuHTML = '';
    filtrDarky.forEach((darek, index) => {
        let darkyString = `<p>${darek.nazev} ${darek.popis} <button class="tlacitkoSmazat">Smazat</button></p>`;
        seznamDarkuHTML += darkyString;
    });

    document.querySelector('.js-seznam-darku').innerHTML = seznamDarkuHTML;

    const tlacitkaSmazat = document.querySelectorAll('.tlacitkoSmazat');
    tlacitkaSmazat.forEach((tlacitko, index) => {
        tlacitko.addEventListener('click', () => {
            // Remove the item from the array using splice
            darky.splice(index, 1);
            // Re-render the list after deletion
            zobrazDarky();
        });
    });
}

zobrazDarky();
    
    
function pridatDarek() {
    var pridavanyPrvek = document.querySelector('.js-udelat-vstup');
    var ukol = pridavanyPrvek.value;
    var pridatDatum = document.querySelector('.js-datum');
    var datum = pridatDatum.value;

    ukoly.push({
        nazev: ukol,
        datum: datum
    });
}

