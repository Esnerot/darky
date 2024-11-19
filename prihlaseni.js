import { uzivatele } from "./data/uzivatele.js";


//document.addEventListener('DOMContentLoaded', () => {
  const tlacitkaContainer = document.getElementById('tlacitkaContainer');
  
  // Create a button for each user from the uzivatele list
  uzivatele.forEach(uzivatel => {
    const tlacitko = document.createElement('button');
    tlacitko.textContent = uzivatel.jmeno;
    tlacitko.addEventListener('click', () => {
      console.log(`Selected user: ${uzivatel.id}`);
      localStorage.setItem('vybranyUzivatelId', uzivatel.id);
      window.location.href = 'zapis_darku.html';
      // You can add any additional logic here (e.g., store selected user in localStorage or redirect)
    });
    
    tlacitkaContainer.appendChild(tlacitko);  // Append the button to the container
  });
;
