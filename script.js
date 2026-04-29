const player = {
  hp: 20,
  maxHp: 20,
  attack: 4,
  inventory: []
};

let currentScene = "start";

const scenes = {
  start: {
    text: "You awaken in a dark forest. The wind is cold. A path leads north.",
    choices: [
      { text: "Go north", next: "wolfEncounter" },
      { text: "Search the ground", next: "findDagger" }
    ]
  },

  findDagger: {
    text: "You find a rusty dagger half-buried in leaves.",
    loot: ["Rusty Dagger"],
    choices: [
      { text: "Go back", next: "start" }
    ]
  },

  wolfEncounter: {
    text: "A hungry wolf blocks your path, growling.",
    enemy: { name: "Wolf", hp: 10, attack: 3 },
    choices: [
      { text: "Fight", combat: true },
      { text: "Run back", next: "start" }
    ]
  },

  afterWolf: {
    text: "The wolf lies defeated. The path ahead is clear.",
    loot: ["Wolf Pelt"],
    choices: [
      { text: "Continue north", next: "clearing" }
    ]
  },

  clearing: {
    text: "You reach a quiet clearing with sunlight filtering through the trees.",
    choices: [
      { text: "The adventure continues...", next: "clearing" }
    ]
  }
};

function renderScene() {
  const scene = scenes[currentScene];
  const textDiv = document.getElementById("text");
  const choicesDiv = document.getElementById("choices");

  textDiv.innerHTML = scene.text;
  choicesDiv.innerHTML = "";

  // Loot handling
  if (scene.loot) {
    scene.loot.forEach(item => {
      player.inventory.push(item);
      textDiv.innerHTML += `<br><br>You obtained: <b>${item}</b>`;
    });
    scene.loot = null; // prevent duplicate looting
  }

  // Enemy handling
  if (scene.enemy && !scene.enemy.defeated) {
    textDiv.innerHTML += `<br><br><b>${scene.enemy.name} appears!</b>`;
  }

  // Choices
  scene.choices.forEach(choice => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.innerText = choice.text;

    if (choice.combat) {
      btn.onclick = () => startCombat(scene.enemy);
    } else {
      btn.onclick = () => {
        currentScene = choice.next;
        renderScene();
      };
    }

    choicesDiv.appendChild(btn);
  });
}

renderScene();

function startCombat(enemy) {
  const textDiv = document.getElementById("text");
  const choicesDiv = document.getElementById("choices");

  function updateCombatText() {
    textDiv.innerHTML = `
      <b>Combat!</b><br><br>
      ${enemy.name}: ${enemy.hp} HP<br>
      You: ${player.hp}/${player.maxHp} HP
    `;
  }

  function playerTurn() {
    updateCombatText();
    choicesDiv.innerHTML = "";

    const attackBtn = document.createElement("div");
    attackBtn.className = "choice";
    attackBtn.innerText = "Attack";
    attackBtn.onclick = () => {
      enemy.hp -= player.attack;
      if (enemy.hp <= 0) return winCombat(enemy);
      enemyTurn();
    };

    choicesDiv.appendChild(attackBtn);
  }

  function enemyTurn() {
    player.hp -= enemy.attack;
    if (player.hp <= 0) return loseCombat();
    playerTurn();
  }

  function winCombat(enemy) {
    enemy.defeated = true;
    textDiv.innerHTML = `You defeated the ${enemy.name}!`;
    choicesDiv.innerHTML = "";

    const cont = document.createElement("div");
    cont.className = "choice";
    cont.innerText = "Continue";
    cont.onclick = () => {
      currentScene = "afterWolf";
      renderScene();
    };
    choicesDiv.appendChild(cont);
  }

  function loseCombat() {
    textDiv.innerHTML = "You have fallen in battle.";
    choicesDiv.innerHTML = "";
  }

  playerTurn();
}
