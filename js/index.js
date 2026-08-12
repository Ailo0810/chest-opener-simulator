function createChestButton(chest) {
    const button = document.createElement("button");
    button.className = "chestContainer";
    button.textContent = chest.name;
    button.addEventListener("click", () => {
        location.href = `../page/open.html?id=${encodeURIComponent(chest.id)}`;
    });
    return button;
}

async function main() {
    const chests = await fetch("../manifest/chest_ref.json").then(r => r.json());
    const div = document.querySelector("#allChestsContainer");

    for (const chest of chests)
        div.append(createChestButton(chest));
}

main();