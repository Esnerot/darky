// IMPORT MODULŮ
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// KONFIGURACE
const firebaseConfig = {
    apiKey: "AIzaSyAhifLMHm4fQojO_tOxb5RedJ9d7BNcz4s",
    authDomain: "darky-b41bf.firebaseapp.com",
    projectId: "darky-b41bf",
    storageBucket: "darky-b41bf.firebasestorage.app",
    messagingSenderId: "513485540196",
    appId: "1:513485540196:web:08210b1691f30025d54871",
    measurementId: "G-27C5BJ6DHN"
  };
  
// INICIALIZACE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FILTROVAT KOLEKCI - PRO MĚ A PRO CIZÍ
export async function filtrovatMojeDarky(vybranyUzivatel) {
    try {
        // Build a query that filters the documents by proKoho and chciZobrazitObdarovanemu
        const q = query(
            collection(db, "darky"),
            where("proKoho", "==", vybranyUzivatel),  // Filter by vybranyUzivatel
            where("chciZobrazitObdarovanemu", "==", true)  // Filter by chciZobrazitObdarovanemu = true
        );

        const querySnapshot = await getDocs(q);
        let darkyVytridene = [];

        querySnapshot.forEach((docSnapshot) => {
            const docData = docSnapshot.data(); 

            darkyVytridene.push({ // You can directly return all the fields from the document along with the ID
                id: docSnapshot.id, 
                ...docData  // Spread all the fields from the document
            });
        });

        // Return the filtered data
        return darkyVytridene;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];  // Return an empty array if there's an error
    }
};

export async function filtrovatCiziDarky(vybranyUzivatel) {
    try {
        // Build a query that filters the documents by proKoho and chciZobrazitObdarovanemu
        const q = query(
            collection(db, "darky"),
            where("proKoho", "==", vybranyUzivatel),  // Filter by vybranyUzivatel
        );

        const querySnapshot = await getDocs(q);
        let darkyVytridene = [];

        querySnapshot.forEach((docSnapshot) => {
            const docData = docSnapshot.data(); 

            darkyVytridene.push({ // You can directly return all the fields from the document along with the ID
                id: docSnapshot.id, 
                ...docData  // Spread all the fields from the document
            });
        });

        // Return the filtered data
        return darkyVytridene;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];  // Return an empty array if there's an error
    }
}

// SMAZAT DOKUMENT
export async function deleteItem(docId) {
    try {
        // Reference to the document to delete
        const docRef = doc(db, "darky", docId);
        
        // Delete the document
        await deleteDoc(docRef);

        // After deletion, update the UI
        alert('Document deleted!');
        filtrovatMojeDarky();  // Re-fetch and display the updated data
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

export async function pridatDarek(nazev, popis, proKoho, zapsal, zamluveno, zamluvil, chciZobrazitObdarovanemu) {
    try {
      
      const docRef = await addDoc(collection(db, "darky"), {
        nazev: nazev,
        popis: popis,
        proKoho: proKoho,
        zapsal: zapsal,
        datumZapsani: new Date(),
        zamluveno: zamluveno,
        zamluvil: zamluvil,
        chciZobrazitObdarovanemu: chciZobrazitObdarovanemu

      });
  
      document.getElementById("nazevProMe").value = ''; //vymaze hodnoty v polich pro zapis
      document.getElementById("popisProMe").value = '';
      document.getElementById("nazevProOstatni").value = ''; //vymaze hodnoty v polich pro zapis
      document.getElementById("popisProOstatni").value = '';
      document.getElementById("zamluvitDarek").checked = false;
      document.getElementById("zobrazitDarek").checked = false;
  
      alert("Dárek úspěšně přidán!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding dárek!");
    }
}

// Make deleteItem function available globally
window.deleteItem = deleteItem;