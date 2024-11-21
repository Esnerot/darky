export function setupModal () {
    // Modal functionality
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeBtn = document.getElementById("closeBtn");

    // Open the modal when the button is clicked
    openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";  // Show the modal when the button is clicked
    });

    // Close the modal when the close button (X) is clicked
    closeBtn.addEventListener("click", () => {
    modal.style.display = "none";  // Hide the modal when the close button is clicked
    });

    // Close the modal when the user clicks outside of the modal content
    window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";  // Close the modal if the user clicks outside of it
    }
    });
}