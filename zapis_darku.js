import { uzivatele } from "./data/uzivatele.js";
import { darky } from "./data/darky.js";
import { filtrovatMojeDarky, filtrovatCiziDarky, deleteItem, pridatDarek } from "./funkcni_prvky/firestore_databaze.js";
import { setupModal } from "./funkcni_prvky/modal.js";

//LOCAL STORAGE ZÍSKÁNÍ DAT
const idUzivatele = localStorage.getItem('vybranyUzivatelId'); //z local storage dostanu id uživatele, které jsem ukládal v prihlaseni.js
const vybranyUzivatel = uzivatele.find(uzivatel => uzivatel.id === idUzivatele); //loop - uzivatel je proměnná, do které se postupně zapisuje každý uživatel v uzivatele a hledá to stejné id
const jmeno = vybranyUzivatel.jmeno

//NADPIS
document.querySelector('.js-nadpis')    //dynemické definování nadpisu - píšu do něj jméno vybraného uživatele
    .innerHTML=`Vybraný uživatel: ${jmeno}`;

//TLACITKO ZPET
document.getElementById('tlacitkoZpet').addEventListener('click', () => { //tlačítko zpět
    window.history.back();
    });

//SEZNAM OSTATNÍCH UŽIVATELŮ
let vybranyObdarovany;
const tlacitkaContainer = document.getElementById('tlacitkaOstatniUzivatele');
  
uzivatele.forEach((uzivatel, index) => {
    if (uzivatel.id !== vybranyUzivatel.id) {
        const tlacitko = document.createElement('button');
        tlacitko.textContent = uzivatel.jmeno;
        if (!vybranyObdarovany){
            tlacitko.classList.add('aktivni');
            vybranyObdarovany = uzivatel
        }
        tlacitko.addEventListener('click', () => {
            const vsechnyTlacitka = tlacitkaContainer.querySelectorAll('button');
            vsechnyTlacitka.forEach(tlac => tlac.classList.remove('aktivni'));
            tlacitko.classList.add('aktivni');
            vybranyObdarovany = uzivatel;
            document.querySelector('.js-pro-ostatni-nadpis').innerHTML = `Dárek pro člena: ${vybranyObdarovany.jmeno}`;
            filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
                zobrazitCiziDarky(darkyVytridene); 
            });
        });
  
         tlacitkaContainer.appendChild(tlacitko);
    };
});

//TLACITKA PREPINANI ZOBRAZENI
let soucasnyStav = "proMe"; //stav pro logiku JS - na začátku je automaticky zvoleno "Pro mě"
const tlackitkoProMe = document.getElementById('tlacitkoDarkyProMe');   
const tlackitkoProOstatni = document.getElementById('tlacitkoDarkyProOstatni');
tlackitkoProMe.classList.add('aktivni'); //pro vizuální změnu stylu - do zvoleného tlačítka přijám tuto třídu, aby bylo tlačítko zelené

tlackitkoProMe.addEventListener('click', () => {
    soucasnyStav = "proMe";
    tlackitkoProMe.classList.add('aktivni');
    tlackitkoProOstatni.classList.remove('aktivni');
    
    const proMePrvky = document.getElementsByClassName('proMe');
    
    filtrovatMojeDarky(jmeno).then(darkyVytridene => {
        zobrazitMojeDarky(darkyVytridene);
    });

    for (let prvek of proMePrvky) {
        prvek.style.display = 'block'; 
    }
    
    const proOstatniPrvky = document.getElementsByClassName('proOstatni');
    for (let prvek of proOstatniPrvky) {
        prvek.style.display = 'none';
    }
});

tlackitkoProOstatni.addEventListener('click', () => {
    soucasnyStav = "proOstatni";
    tlackitkoProOstatni.classList.add('aktivni');
    tlackitkoProMe.classList.remove('aktivni');
    
    const proMePrvky = document.getElementsByClassName('proMe');
    
    filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
        zobrazitCiziDarky(darkyVytridene); 
    });

    for (let prvek of proMePrvky) {
        prvek.style.display = 'none';
    }
    
    const proOstatniPrvky = document.getElementsByClassName('proOstatni');
    for (let prvek of proOstatniPrvky) {
        prvek.style.display = 'block';
    }
});

//PŘIDAT DÁREK PRO MĚ
document.getElementById("pridatDarekProMe").addEventListener("click", async () => {
    
    const nazev = document.getElementById("nazevProMe").value;
    const popis = document.getElementById("popisProMe").value;
  
    /* 
    if (!nazev) {
      alert("Please fill in both fields!");
      return;
    }
    */
    pridatDarek(nazev, popis, jmeno, jmeno, false, "", true)
});

//PŘIDAT DÁREK PRO OSTATNÍ
document.getElementById("pridatDarekProOstatni").addEventListener("click", async () => {
    
    const nazev = document.getElementById("nazevProOstatni").value;
    const popis = document.getElementById("popisProOstatni").value;
    const zamluveno = document.getElementById("zamluvitDarek").checked;
    let zamluvil = "";
    if (zamluveno) {
        zamluvil = vybranyObdarovany.jmeno
    };
    const chciZobrazitObdarovanemu = document.getElementById("zobrazitDarek").checked;
  
    /* 
    if (!nazev) {
      alert("Please fill in both fields!");
      return;
    }
    */
    pridatDarek(nazev, popis, vybranyObdarovany.jmeno, jmeno, zamluveno, zamluvil, chciZobrazitObdarovanemu)
});

let darkyVytridene = await filtrovatMojeDarky(jmeno);

//ZOBRAZENI VYFILTROVANYCH DARKU
let dataHTML = "";

function zobrazitMojeDarky(kolekce) {
    if (kolekce.length > 0) {
        dataHTML = '<h3>Moje dárky:</h3>';

        // Iterate through the gifts and build HTML
        kolekce.forEach(darek => {
            dataHTML += `
                <p>
                    <button onclick="deleteItem('${darek.id}')">Smazat</button>
                    Dárek: ${darek.nazev}, od koho: ${darek.zapsal}, pro koho: ${darek.proKoho}
                </p>`;
        });

        document.getElementById('zobrazitVytrideneDarky').innerHTML = dataHTML;
    } else {
        document.getElementById('zobrazitVytrideneDarky').innerHTML = "<p>Zatím žádné dárky.</p>";
    }
}

function zobrazitCiziDarky(kolekce) {   
    if (kolekce.length > 0) {
        dataHTML = '<h3>Dary pro ostatní</h3>';

        // Iterate through the gifts and build HTML
        kolekce.forEach(darek => {
            dataHTML += `
                <p>
                    <button onclick="deleteItem('${darek.id}')">Smazat</button>
                    Dárek: ${darek.nazev}, od koho: ${darek.zapsal}, pro koho: ${darek.proKoho}
                </p>`;
        });

        document.getElementById('zobrazitVytrideneDarky').innerHTML = dataHTML;
    } else {
        document.getElementById('zobrazitVytrideneDarky').innerHTML = "<p>Zatím žádné dárky.</p>";
    }
}

// Call the display function to render the gifts
zobrazitMojeDarky(darkyVytridene);

setupModal();
