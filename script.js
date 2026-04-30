const items = {
  "Rusty Dagger": {
    type: "attack",
    attack: 2
  },

  "Heart Necklace": {
    type: "support",
    description: "A mysterious necklace with strange powers.",
    revive: true
  },

  "Gold Coin": {
  type: "general",
  description: "A shiny gold coin."
},

  "Iron Sword": {
  type: "attack",
  attack: 10
},

  "Beer": {
  type: "general",
  description: "A refreshing drink."
}

};

const player = {
  hp: 20,
  maxHp: 20,
  attack: 4,
  money: 3,
  inventory: [],
  currentQuest: null,
  questProgress: {}
};

function countItem(itemName) {
  return player.inventory.filter(i => i === itemName).length;
}

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
      { text: "Go right", next: "encounterBridge" },
      { text: "Go back", next: "start" }
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
    enemy: { 
  name: "George", 
  hp: 25, 
  attack: 30,
  loot: [
  { item: "Gold Coin", chance: 1.0 },     // 100% drop
  { item: "Rusty Dagger", chance: 0.25 }  // 25% drop
]
},
    choices: [
      { text: "Talk to the man", next: "talkGeorge" },
      { text: "Attack him", combat: true },
      { text: "Ignore him and explore the village", next: "exploreRoseTown" },
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
      { text: "Continue conversation", next: "talkGeorge" }
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

  askGeorgeAboutNecklace: {
    text: "Legends say this necklace is supposed to revive you if you die... but only once! I got it at a travelling merchant, he told me that. Who wouldn't trust travelling salesmen?",
    choices: [
      { text: "Continue conversation", next: "talkGeorge" }
    ]
  },

    exploreRoseTown: {
    text: "In the central plaza of Rose Town, you see 5 buildings. Which shall you explore?",
    choices: [
      { text: "Check out the well", next: "goWell" },
      { text: "Check out the tavern", next: "goTavern" },
      { text: "Check out the village hall", next: "goTownHall" },
      { text: "Check out the farm", next: "goFarm" },
      { text: "Check out the Museum", next: "goMuseum" },
      { text: "Go back", next: "villageEntrance" }
    ]
  },

      goWell: {
    text: "The well is made of stone... it looks old and dark.",
    choices: [
      { text: "Jump in", next: "jumpWellCheck" },
      { text: "Throw in a coin", next: "coinWellCheck" },
      { text: "Sing into the well", next: "singWell" },
      { text: "Go back", next: "exploreRoseTown" }
    ]
  },

      jumpWellCheck: {
  check: () => player.hp >= 1,
  success: "jumpWellSurvive",
  fail: "jumpWellDie"
},

  jumpWellSurvive: {
  text: "You land hard, but survive the fall.",
  choices: [
    { text: "Explore the bottom", next: "wellBottom" }
  ]
},

jumpWellDie: {
  text: "You hit the ground with a sickening crack. You did not survive the fall.",
  choices: []
},

coinWellCheck: {
  check: () => countItem("Gold Coin") >= 1,
  remove: { item: "Gold Coin", amount: 1 },
  success: "coinWellSuccess",
  fail: "coinWellFail"
},

    coinWellSuccess: {
  text: "You toss one of your coins into the well. You feel a little more lucky than before.",
  choices: [
    { text: "Go back", next: "goWell" }
  ]
},

  coinWellFail: {
  text: "You can't afford to spare a single coin.",
  choices: [
    { text: "Go back", next: "goWell" }
  ]
},

        singWell: {
    text: "You sing into the well. You feel like a pretty princess.",
    choices: [
      { text: "Go back", next: "goWell" },
    ]
  },

          wellBottom: {
    text: "The bottom of the well is wet and sticky. Likely filled with the sewage of villagers past and present.",
    choices: [
      { text: "Go back", next: "goWell" }
    ]
  },

          goTavern: {
    text: "The tavern is called 'The Ruby Rose'. It looks like a man is standing outside of it.",
    choices: [
      { text: "Go inside", next: "goInsideTavern" },
      { text: "Talk to the man", next: "talkToSmith" },
      { text: "Go back", next: "exploreRoseTown" }
    ]
  },

          talkToSmith: {
    text: "*The man takes off his hat to greet you* Hello, my name's John Smith. What can I do for you?",
        enemy: { 
  name: "John Smith", 
  hp: 25, 
  attack: 30,
  loot: [
  { item: "Gold Coin", amount: 10 }
]
},
    choices: [
      { text: "Ask him what he's doing", next: "askJohnSmith" },
      { text: "Ask him if he has anything special", next: "askJohnSmithForSomething" },
      { text: "Attack him", combat: true },
      { text: "Go back", next: "goTavern" }
    ]
  },

          askJohnSmith: {
    text: "Oh, you know... just thinking.",
    choices: [
      { text: "Go back", next: "goTavern" }
    ]
  },
      
          askJohnSmithForSomething: {
    text: "Hell no, fuck off kid.",
    choices: [
      { text: "Go back", next: "goTavern" }
    ]
  },

          goInsideTavern: {
    text: "You enter the tavern. It is bustling with people which was strange because it was only mid-day.",
    choices: [
      { text: "Go to the bar", next: "goBar" },
      { text: "Look around at the people", next: "lookAtPeople" },
      { text: "Go back", next: "goTavern" }
    ]
  },

         goBar: {
    text: "Working at the bar is a scrawny and oily looking man. He asks you what you want.",
    choices: [
      { text: "Order a beer for 5 coins", next: "coinBeerCheck" },
      { text: "Go back", next: "goInsideTavern" }
    ]
  },

  coinBeerCheck: {
  check: () => countItem("Gold Coin") >= 5,
  remove: { item: "Gold Coin", amount: 5 },
  success: "coinBeerSuccess",
  fail: "coinBeerFail"
},

    coinBeerSuccess: {
  text: "The man hands you a nice cold beer, matching with a red straw.",
  loot: ["Beer"],
  choices: [
    { text: "Go back", next: "goBar" }
  ]
},

    coinBeerFail: {
  text: "You can't afford to buy a beer.",
  choices: [
    { text: "Go back", next: "goBar" }
  ]
},

      lookAtPeople: {
    text: "You see a man sitting in the corner. What do you do?",
    choices: [
      { text: "Approach him slowly", next: "slowlyApproachVictor" },
      { text: "Sit down with him without a word", next: "sitAcrossVictor" },
      { text: "Go back", next: "goInsideTavern" }
    ]
  },

      slowlyApproachVictor: {
    text: "I don't waste time with cowards...",
    choices: [
      { text: "Go back", next: "lookAtPeople" }
    ]
  },

      sitAcrossVictor: {
    text: "I like your boldness. What do you want?",
    choices: [
      { text: "Ask him who he is", next: "askVictor" }
      { text: "Go back", next: "lookAtPeople" }
    ]
  },

      askVictor: {
    text: "Who am I? I'm Victor, the quest man. Only the bravest come to me looking for challenges... but I think the question is, who are you?",
    choices: [
      { text: "Ask him for a quest", next: "askVictorForQuest" }
      { text: "Go back", next: "lookAtPeople" }
    ]
  },

      askVictorForQuest: {
    text: "You want a quest, eh? I don't think you're quite ready for what I need done... but, I'll give you the chance to prove it. Ever heard of Chicked Eaters? And no, I don't mean foxes. Well, you'll find out soon enough what they are. Anyways, farmer Johan needs some help with them. If you can slay... let's say 5 of them, then I can give you a proper quest.",
    choices: [
      { text: "Accept the quest", next: "acceptChickenEaterQuest" }
      { text: "Go back", next: "lookAtPeople" }
    ]
  },

        acceptChickenEaterQuest: {
    text: "Good, I knew you would accept.",
    onEnter: () => {
    player.currentQuest = {
    id: "kill5ChickenEaters",
    title: "Chicken Chaos",
    description: "Kill 5 Chicken Eaters at Johans Farm in Rose Town.",
    goal: 5,
    completeScene: "chickenEaterComplete"
};

      player.questProgress["kill3Slimes"] = 0;
},
    choices: [
      { text: "Go back", next: "lookAtPeople" }
    ]
  },

  "chickenEaterComplete": {
  text: "Viktor smirks as you return to the Red Rose. He knew he could've counted on you",
  onEnter: () => {
    player.currentQuest = null;
  },
  choices: [
    { text: "Go back", next: "lookAtPeople" }
  ]
}

  
}; // ← this closes the scenes object

function renderScene() {
  const scene = scenes[currentScene];
  if (scene.onEnter) scene.onEnter();
if (scene.check) {
  const passed = scene.check();

  if (passed) {
    // If the scene has a "remove" rule, apply it
    if (scene.remove) {
      const { item, amount } = scene.remove;
      for (let i = 0; i < amount; i++) {
        const index = player.inventory.indexOf(item);
        if (index !== -1) player.inventory.splice(index, 1);
      }
      renderInventory();
    }

    currentScene = scene.success;
  } else {
    currentScene = scene.fail;
  }

  return renderScene();
}
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
    renderInventory();
    renderQuestLog();
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
  let lastPlayerDamage = 0;
  let lastEnemyDamage = 0;

function updateCombatText() {
  textDiv.innerHTML = `
    <b>Combat!</b><br><br>

    ${enemy.name}: ${enemy.hp} HP<br>
    You: ${player.hp}/${player.maxHp} HP<br><br>

    ${lastPlayerDamage > 0 ? `You dealt <b style="color:lightgreen;">${lastPlayerDamage}</b> damage!<br>` : ""}
    ${lastEnemyDamage > 0 ? `${enemy.name} dealt <b style="color:red;">${lastEnemyDamage}</b> damage!<br>` : ""}
  `;
}

  function playerTurn() {
    updateCombatText();
    choicesDiv.innerHTML = "";

    const attackBtn = document.createElement("div");
    attackBtn.className = "choice";
    attackBtn.innerText = "Attack";
    attackBtn.onclick = () => {
      lastPlayerDamage = getPlayerAttack();
      enemy.hp -= lastPlayerDamage;
      if (enemy.hp <= 0) return winCombat(enemy);
      enemyTurn();
    };

    choicesDiv.appendChild(attackBtn);
  }

  function enemyTurn() {
    lastEnemyDamage = enemy.attack;
    player.hp -= lastEnemyDamage;
    if (player.hp <= 0) return loseCombat();
    playerTurn();
  }

  function winCombat(enemy) {
    enemy.defeated = true;
// Quest kill tracking
if (player.currentQuest && enemy.questTag === player.currentQuest.id) {
  const id = player.currentQuest.id;
  player.questProgress[id]++;

  if (player.questProgress[id] >= player.currentQuest.goal) {
    const finish = player.currentQuest.completeScene;
    currentScene = finish;
    return renderScene();
  }
}


    giveEnemyLoot(enemy);

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
    if (player.inventory.includes("Heart Necklace")) {
      const index = player.inventory.indexOf("Heart Necklace");
      player.inventory.splice(index, 1);

      player.hp = Math.floor(player.maxHp / 2);

      renderInventory();

      textDiv.innerHTML = "The Heart Necklace glows... you are revived!";
      choicesDiv.innerHTML = "";

      const cont = document.createElement("div");
      cont.className = "choice";
      cont.innerText = "Continue";
      cont.onclick = () => playerTurn();
      choicesDiv.appendChild(cont);

      return;
    }

    textDiv.innerHTML = "You have fallen in battle.";
    choicesDiv.innerHTML = "";
  }

  playerTurn();
} // ← THIS WAS MISSING

function loseCombat() {
  // Check for revive item
  if (player.inventory.includes("Heart Necklace")) {
    // Remove ONE necklace
    const index = player.inventory.indexOf("Heart Necklace");
    player.inventory.splice(index, 1);

    // Revive player
    player.hp = Math.floor(player.maxHp / 2);

    renderInventory();

    textDiv.innerHTML = "The Heart Necklace glows... you are revived!";
    choicesDiv.innerHTML = "";

    const cont = document.createElement("div");
    cont.className = "choice";
    cont.innerText = "Continue";
    cont.onclick = () => playerTurn();
    choicesDiv.appendChild(cont);

    return;
  }

  // No revive item → real death
  textDiv.innerHTML = "You have fallen in battle.";
  choicesDiv.innerHTML = "";
}
  
function renderInventory() {
  const invDiv = document.getElementById("inventory");

  if (player.inventory.length === 0) {
    invDiv.innerHTML = "<b>Inventory:</b> (empty)";
    return;
  }

  // Count duplicates
  const counts = {};
  player.inventory.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });

  let html = "<b>Inventory:</b><br>";

  for (let itemName in counts) {
    const itemData = items[itemName];
    const amount = counts[itemName];

    html += `${itemName}`;

    // stack count
    if (amount > 1) html += ` x${amount}`;

    // show type
    if (itemData) {
      html += ` <span style="color:gray;">(${itemData.type})</span>`;
    }

    html += "<br>";
  }

  invDiv.innerHTML = html;
}

function renderQuestLog() {
  const questDiv = document.getElementById("questLog");

  if (!player.currentQuest) {
    questDiv.innerHTML = "<b>Quest:</b> (none)";
    return;
  }

let progressText = "";

if (player.currentQuest.goal) {
  const id = player.currentQuest.id;
  const progress = player.questProgress[id] || 0;
  progressText = `<br><b>Progress:</b> ${progress}/${player.currentQuest.goal}`;
}

questDiv.innerHTML = `
  <b>Quest:</b><br>
  ${player.currentQuest.title}<br>
  <span style="color:gray;">${player.currentQuest.description}</span>
  ${progressText}
`;
}

function giveEnemyLoot(enemy) {
  if (!enemy.loot) return;

  enemy.loot.forEach(drop => {

    // Simple string loot: ["Gold Coin", "Rusty Dagger"]
    if (typeof drop === "string") {
      player.inventory.push(drop);
      return;
    }

    // Quantity-based loot: { item: "Gold Coin", amount: 10 }
    if (drop.amount) {
      for (let i = 0; i < drop.amount; i++) {
        player.inventory.push(drop.item);
      }
      return;
    }

    // Chance-based loot: { item: "Rusty Dagger", chance: 0.25 }
    if (drop.chance && Math.random() < drop.chance) {
      player.inventory.push(drop.item);
    }
  });

  renderInventory();
}

function useItem(itemName) {
  const item = items[itemName];

  if (!item) return;

  if (item.type === "support") {
    if (item.heal) {
      player.hp = Math.min(player.maxHp, player.hp + item.heal);
    }

    if (item.revive && player.hp <= 0) {
      player.hp = player.maxHp / 2;
    }

    // remove one from inventory
    const index = player.inventory.indexOf(itemName);
    if (index !== -1) player.inventory.splice(index, 1);

    renderInventory();
    renderScene();
  }
}

function getPlayerAttack() {
  let total = player.attack;

  player.inventory.forEach(itemName => {
    const item = items[itemName];
    if (item && item.type === "attack" && item.attack) {
      total += item.attack;
    }
  });

  return total;
}

renderInventory();
renderQuestLog();
