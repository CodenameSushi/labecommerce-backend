const play = process.argv[2];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let npcPlay = getRndInteger(1, 3);

let option = "";

let resultado = "";

if (npcPlay == 1) {

  option = "pedra";

} else if (npcPlay == 2) {

  option = "papel";

} else if (npcPlay == 3) {
    
  option = "tesoura";
}

if (option == play.toLowerCase()) {

  resultado = "Empate";

} else if (option == "pedra" && play.toLowerCase() == "tesoura") {

  resultado = "Voce perdeu";

} else if (option == "pedra" && play.toLowerCase() == "papel") {

  resultado = "Voce ganhou";

} else if (option == "tesoura" && play.toLowerCase() == "pedra") {

  resultado = "Voce ganhou";

} else if (option == "tesoura" && play.toLowerCase() == "papel") {

  resultado = "Voce perdeu";

} else if (option == "papel" && play.toLowerCase() == "pedra") {

  resultado = "Voce perdeu";

} else if (option == "papel" && play.toLowerCase() == "tesoura") {

  resultado = "Voce ganhou";
}

console.log(
  `Voce escolheu ${play} e o computador escolheu ${option}. ${resultado}!`
);
