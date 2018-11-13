/*
-Choose from 4 characters
-Move 3 enemies to a new div
-Choose an enemy to attack
-Selected enemy moves to defender area
-User hits attack button
  -Player reduces enemy hitpoints by his attack power
  -Check enemy HP. If it drops below zero, remove from defender area and let player pick new opponent. Pressing attack tells player to choose new opponent.
    -If enemy dies, check enemies remaining. If there are no enemies remaining, display win message and restart button which allows player to play again.
  -Enemy reduces player hitpoints by his counterattack power if he survives
  -Check player HP. If it drops below zero, the game ends. Show restart button which allows player to pick a new character.
  -Increase player attack power by base attack power 

-Character object
 -healthPoints
 -attackPower
 -counterAttackPower
*/

class Fighter {
    constructor(name, healthPoints, attackPower, counterAttackPower) {
        this.name = name;
        this.healthPoints = healthPoints;
        this.baseAttack = attackPower;
        this.attackPower = this.baseAttack;
        this.counterAttackPower = counterAttackPower;
    }
    levelUp() {
        this.attackPower += this.baseAttack;
    }
}

Fighter.prototype.toString = function fighterToString() {
    return "Name: " + this.name + "\n" +
           "Health: " + this.healthPoints + "\n" +
           "Base Attack Power: " + this.baseAttack + "\n" +
           "Attack Power: " + this.attackPower + "\n" +
           "Counter Attack: " + this.counterAttackPower + "\n" +
           "******************************\n";
}

var jarjar = new Fighter("Jar Jar", 120, 6, 25);
var ewok = new Fighter("Ewok", 80, 16, 30);
var jabba = new Fighter("Jabba", 200, 4, 10);
var chewie = new Fighter("Chewie", 150, 5, 20);

var playerFighter;
var enemyFighters = [];
var currentEnemy;

function attack(playerFighter, currentEnemy) {
    currentEnemy.healthPoints -= playerFighter.attackPower;

    console.log(
        playerFighter.name + " attacks " +
        currentEnemy.name + " for " +
        playerFighter.attackPower + " damage"
    );
    console.log(playerFighter.toString() + currentEnemy.toString());

    if(currentEnemy.healthPoints >= 0) {
        //counterattack
    }
    else {
        //remove enemy
    }
}