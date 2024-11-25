function zobrazitCiziDarky(kolekce, jmeno) {
    dataHTML = "";

    if (kolekce.length > 0) {
        let dataHTML = `
            <h3>Dary pro ostatní</h3>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Odstranit</th>
                        <th scope="col">Dárek</th>
                        <th scope="col">Popis</th>
                        <th scope="col">Od koho</th>
                        <th scope="col">Pro koho</th>
                    </tr>
                </thead>
            <tbody>
        `;

        // Iterate through the gifts and build table rows
        kolekce.forEach(darek => {

            let tlacitkoSmazat = darek.zapsal === jmeno ? `<button class="js-smazatZaznam" data-id="${darek.id}">Smazat</button>` : '';

            dataHTML += `
                <tr>
                    <td>${tlacitkoSmazat}</td>
                    <td>${darek.nazev}</td>
                    <td>${darek.popis}</td> 
                    <td>${darek.zapsal}</td>
                    <td>${darek.proKoho}</td>
                </tr>
            `;
        });

        dataHTML += `
                </tbody>
            </table>`;

        document.getElementById('zobrazitVytrideneDarky').innerHTML = dataHTML;

        // Attach event listeners to all delete buttons
        const deleteButtons = document.querySelectorAll('.js-smazatZaznam');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id'); // Get the item ID
                deleteItem(itemId); // Call the deleteItem function with the item ID

                // After deleting, re-filter and re-render the list
                filtrovatCiziDarky(jmeno).then(darkyVytridene => {
                    zobrazitCiziDarky(darkyVytridene, jmeno); // Automatically update the displayed table
                });
            });
        });
    } else {
        document.getElementById('zobrazitVytrideneDarky').innerHTML = "<p>Zatím žádné dárky.</p>";
    }
}