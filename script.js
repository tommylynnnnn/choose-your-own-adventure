const player = {
  hp: 20,
  maxHp: 20,
  attack: 4,
  inventory: []
};

let currentScene = "start";

const scenes = {
  start: {
    text: "You are in a dark forest. The only thing you see is a path that leads north.",
    choices: [
      { text: "Follow the path", next: "pathWalk" },
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

  pathWalk: {
    text: "You walk along the path. There is a fork in the road. Where do you go?",
    choices: [
      { text: "Go left", next: "villageEntrance" },
      { text: "Go right", next: "encounterBridge" }
    ]
  },

    villageEntrance: {
    text: "There is a sign that welcomes you to Rose Town.",
    choices: [
      { text: "Enter the village", next: "enterVillage" },
      { text: "Go back", next: "pathWalk" }
    ]
  },

      enterVillage: {
    text: "Rose Town is a small village. Since you are a new arrival, a man takes notice.",
    enemy: { name: "George", hp: 25, attack: 30 },
    choices: [
      { text: "Talk to the man", next: "talkGeorge" },
      { text: "Attack him", combat: true },
      { text: "Go back", next: "villageEntrance" }
    ]
  },

        talkGeorge: {
    text: "You must be new here. I am George the town fool. It is nice to see a new face here in Rose Town... nobody here is ever new. Not after- well, you don't need to know the details.",
    choices: [
      { text: "Ask him about the 'details'", next: "askGeorgeAboutDetails" },
      { text: "Ask him about Rose Town", next: "askGeorgeAboutRoseTown" },
      { text: "Ask him for a special object", next: "askGeorgeForGift" },
      { text: "Go back", next: "enterVillage" }
    ]
  },

          askGeorgeForGift: {
    text: "What's that? You want something? Hmmm... *he digs around in his pockets*. Aha! How about this? It might help you in the future!",
    loot: ["Heart Necklace"],
    choices: [
      { text: "Ask him about the necklace", next: "askGeorgeAboutNecklace" },
      { text: "Continue conversation", next: "talkGeorge" },
    ]
  },

        askGeorgeAboutRoseTown: {
    text: "So, you want to know about Rose Town do you? Well... I can't think of much to say really. We make good beer! Depending on who you ask... that's all that matters!",
    choices: [
      { text: "Continue conversation", next: "talkGeorge" }
    ]
  },

          askGeorgeAboutDetails: {
    text: "It's not good to ask questions you wouldn't want the answer too...",
    choices: [
      { text: "Continue conversation", next: "talkGeorge" }
    ]
  },

} 

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
