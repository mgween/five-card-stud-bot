const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const deck = [];

const generateCards = suit => {
  for (let i = 1; i <= 13; i++) {
    if (i <= 10) {
      deck.push(`${i} ${suit}`);
    } else if (i === 11) {
      deck.push( `J ${suit}`);
    } else if (i === 12) {
      deck.push( `Q ${suit}`);
    } else if (i === 13) {
      deck.push( `K ${suit}`);
    };
  };
};

['hearts', 'spades', 'diamonds', 'clubs'].forEach(suit => generateCards(suit));

let botHand;
let playerHand;

const shuffle = array => { // Source: https://stackoverflow.com/a/12646864
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  };
};

const showCards = (hand) => {
  const cards = hand.map((card, index) => {
    return `${index + 1}: ${card}`;
  });
  cards.forEach(card => console.log(card))
};

const getMultiples = (hand) => {
  const countMultiples = {};
  hand.map(item => {
    return item.split(' ')[0];
  }).forEach(item => {
    if (countMultiples[item] === undefined) {
      countMultiples[item] = 1;
    } else {
      countMultiples[item]++;
    };
  });
  return countMultiples;
};

const showdown = () => {
  
  const biggestMultiple = (hand) => {
    const multiplesValues = Object.values(getMultiples(hand));
    const biggestMultipleValue = Math.max(...multiplesValues);
    return Object.entries(getMultiples(hand))[multiplesValues.indexOf(biggestMultipleValue)];  
  };
  
  if (biggestMultiple(playerHand)[1] > biggestMultiple(botHand)[1]) {
    console.log(`\nPlayer wins with ${biggestMultiple(playerHand)[1]} ${biggestMultiple(playerHand)[0]}s!`);
  } else if (biggestMultiple(playerHand)[1] < biggestMultiple(botHand)[1]) {
    console.log(`\nBot wins with ${biggestMultiple(botHand)[1]} ${biggestMultiple(botHand)[0]}s!`);
  } else {
    console.log('\nTie');
  };
  
};

const beginGame = () => {
  
  shuffle(deck);
  
  botHand = deck.splice(0, 5);
  playerHand = deck.splice(0, 5);
  
  console.log('\nPlayer Hand:');
  showCards(playerHand);
  
  rl.question('\nSelect up to 3 cards to trade in. (0 to keep all)\n', input => {
    
    if (input !== '0') {
      const selections = input.split(' ').map(item => parseInt(item) - 1).sort((a, b) => b - a);
      selections.forEach(item => playerHand.splice(item, 1));
      playerHand.push(...deck.splice(0, selections.length));
    };
    
    console.log(`\nPlayer Hand:`);
    showCards(playerHand);
    
    console.log(`\nBot Hand:`);
    showCards(botHand);
    
    showdown();
    
    rl.question('\nPlay again? (y/n)', input => {
      if (input === 'y') {
        beginGame();
      } else {
        rl.close();
      };
    });
    
  });
  
};

beginGame();

