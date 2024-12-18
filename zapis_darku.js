import { uzivatele } from "./data/uzivatele.js";
import { filtrovatMojeDarky, filtrovatCiziDarky, deleteItem, pridatDarek, rezervovatDarek } from "./funkcni_prvky/firestore_databaze.js";
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
        tlacitko.classList.add('css-seznamLidi');
        if (!vybranyObdarovany){
            tlacitko.classList.add('css-aktivniClovek');
            vybranyObdarovany = uzivatel
        }
        tlacitko.addEventListener('click', () => {
            const vsechnyTlacitka = tlacitkaContainer.querySelectorAll('button');
            vsechnyTlacitka.forEach(tlac => tlac.classList.remove('css-aktivniClovek'));
            tlacitko.classList.add('css-aktivniClovek');
            vybranyObdarovany = uzivatel;
            document.querySelector('.js-pro-ostatni-nadpis').innerHTML = `Dárek pro člena: ${vybranyObdarovany.jmeno}`;
            filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
                zobrazitCiziDarky(darkyVytridene, jmeno, vybranyObdarovany.jmeno); 
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
        prvek.style.display = 'flex'; 
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
        zobrazitCiziDarky(darkyVytridene, jmeno, vybranyObdarovany.jmeno); 
    });

    for (let prvek of proMePrvky) {
        prvek.style.display = 'none';
    }
    
    const proOstatniPrvky = document.getElementsByClassName('proOstatni');
    for (let prvek of proOstatniPrvky) {
        prvek.style.display = 'flex';
    }
});

//PŘIDAT DÁREK PRO MĚ
document.getElementById("pridatDarekProMe").addEventListener("click", async () => {
    
    const nazev = document.getElementById("nazevProMe").value;
    const popis = document.getElementById("popisProMe").value;
  
     
    if (!nazev) {
      alert("Prosím vyplňte název!");
      return;
    }
    
    pridatDarek(nazev, popis, jmeno, jmeno, false, "", true);
    filtrovatMojeDarky(jmeno).then(darkyVytridene => {
        zobrazitMojeDarky(darkyVytridene);
    });
    document.getElementById("myModal").style.display = "none";
});

//PŘIDAT DÁREK PRO OSTATNÍ
document.getElementById("pridatDarekProOstatni").addEventListener("click", async () => {
    
    const nazev = document.getElementById("nazevProOstatni").value;
    const popis = document.getElementById("popisProOstatni").value;
    const zamluveno = document.getElementById("zamluvitDarek").checked;
    let zamluvil = "";
    if (zamluveno) {
        zamluvil = jmeno
    };
    const chciZobrazitObdarovanemu = document.getElementById("zobrazitDarek").checked;
  
    
    if (!nazev) {
      alert("Prosím vyplňte název!");
      return;
    }

    pridatDarek(nazev, popis, vybranyObdarovany.jmeno, jmeno, zamluveno, zamluvil, chciZobrazitObdarovanemu);
    filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
        zobrazitCiziDarky(darkyVytridene, jmeno, vybranyObdarovany.jmeno); 
    });
    document.getElementById("myModal").style.display = "none";
});

let darkyVytridene = await filtrovatMojeDarky(jmeno);

//ZOBRAZENI VYFILTROVANYCH DARKU
let dataHTML = "";

function zobrazitMojeDarky(kolekce) {
    dataHTML = "";
    
    if (kolekce.length > 0) {
        dataHTML = `
            <h3>Dárky pro mě:</h3>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Odstranit</th>
                        <th scope="col">Dárek</th>
                        <th scope="col">Popis</th>                        
                    </tr>
                </thead>
                <tbody>
        `;

        // Iterate through the gifts and build table rows
        kolekce.forEach(darek => {
            dataHTML += `
                <tr>
                    <td class="css-sloupecOdstranit"><button class="js-smazatZaznam" data-id="${darek.id}">✖</button></td>
                    <td><div class="css-dlouhyText">${darek.nazev}</div></td>
                    <td><div class="css-dlouhyText">${darek.popis}</div></td>                                       
                </tr>
            `;
        });

        dataHTML += `
                </tbody>
            </table>
        `;

        document.getElementById('zobrazitVytrideneDarky').innerHTML = dataHTML;

        // Attach event listeners to all delete buttons
        const deleteButtons = document.querySelectorAll('.js-smazatZaznam');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id'); // Get the item ID
                deleteItem(itemId); // Call the deleteItem function with the item ID

                // After deleting, re-filter and re-render the list
                filtrovatMojeDarky(jmeno).then(darkyVytridene => {
                    zobrazitMojeDarky(darkyVytridene);
                });
            });
        });
    } else {
        document.getElementById('zobrazitVytrideneDarky').innerHTML = "<p>Zatím žádné dárky.</p>";
    }
}

function zobrazitCiziDarky(kolekce, jmeno, proKoho) {
    dataHTML = "";

    if (kolekce.length > 0) {
        let dataHTML = `
            <h3>${proKoho} - seznam dárků:</h3>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Odstranit</th>
                        <th scope="col">Dárek</th>
                        <th scope="col">Popis</th>
                        <th scope="col">Od koho</th>
                        <th scope="col">Zamluvit</th>
                    </tr>
                </thead>
            <tbody>
        `;

        // Iterate through the gifts and build table rows
        kolekce.forEach(darek => {
            
            let tlacitkoSmazat = darek.zapsal === jmeno ? `<button class="js-smazatZaznam" data-id="${darek.id}">✖</button>` : '';
            let tlacitkoZamluvit;
            if (darek.zamluvil === "") {
                tlacitkoZamluvit = `<button class="js-zamluvitZaznam" data-id="${darek.id}">Zamluvit</button>`
            } else if (darek.zamluvil === jmeno) {
                tlacitkoZamluvit = `<button class="js-prenechatZaznam" data-id="${darek.id}">Přenechat</button>`
            } else {
                tlacitkoZamluvit = darek.zamluvil
            }
            

            dataHTML += `
                <tr>
                    <td class="css-sloupecOdstranit">${tlacitkoSmazat}</td>
                    <td><div class="css-dlouhyText">${darek.nazev}</div></td>
                    <td><div class="css-dlouhyText">${darek.popis}</div></td> 
                    <td>${darek.zapsal}</td>
                    <td>${tlacitkoZamluvit}</td>
                </tr>
            `;
        });

        dataHTML += `
                </tbody>
            </table>
        `;

        document.getElementById('zobrazitVytrideneDarky').innerHTML = dataHTML;

        // Smazat záznam
        const deleteButtons = document.querySelectorAll('.js-smazatZaznam');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id'); // Get the item ID
                deleteItem(itemId); // Call the deleteItem function with the item ID

                // After deleting, re-filter and re-render the list
                filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
                    zobrazitCiziDarky(darkyVytridene, jmeno, vybranyObdarovany.jmeno); 
                });
            });
        });

        // Zarezervovat
        const zamluvitButtons = document.querySelectorAll('.js-zamluvitZaznam');
        zamluvitButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id'); // Get the item ID
                rezervovatDarek(itemId, jmeno); // Call the deleteItem function with the item ID

                // After deleting, re-filter and re-render the list
                filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
                    zobrazitCiziDarky(darkyVytridene, jmeno, vybranyObdarovany.jmeno); 
                });
            });
        })

        // Odstranit rezervaci
        const prenechatButtons = document.querySelectorAll('.js-prenechatZaznam');
        prenechatButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id'); // Get the item ID
                rezervovatDarek(itemId, ''); // Call the deleteItem function with the item ID

                // After deleting, re-filter and re-render the list
                filtrovatCiziDarky(vybranyObdarovany.jmeno).then(darkyVytridene => {
                    zobrazitCiziDarky(darkyVytridene, jmeno, vybranyObdarovany.jmeno); 
                });
            });
        })

    } else {
        document.getElementById('zobrazitVytrideneDarky').innerHTML = "<p>Zatím žádné dárky.</p>";
    }
}



// Call the display function to render the gifts
zobrazitMojeDarky(darkyVytridene);

setupModal();
