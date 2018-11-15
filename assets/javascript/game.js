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


class Game {
    constructor(fighters) {
        this.fighters = fighters;
        this.playerFighter;
        this.enemyFighters = [];
        this.currentEnemy;
    }

    attack() {
        // damage enemy
        this.currentEnemy.healthPoints -= this.playerFighter.attackPower;
        
        logAttack(this.playerFighter, this.currentEnemy, this.playerFighter.attackPower);
        
        // enemy counterattacks if they survive
        if(this.currentEnemy.healthPoints > 0) {
            this.playerFighter.healthPoints -= this.currentEnemy.counterAttackPower;
            logAttack(this.currentEnemy, this.playerFighter, this.currentEnemy.counterAttackPower);
            
            // levelUp if player survives
            if(this.playerFighter.healthPoints > 0) {
                this.playerFighter.levelUp();
            }
            else {
                console.log("You died.");
                this.playerFighter = null;
            }
        }
        else {
            //remove enemy
            console.log("Enemy defeated!");
            this.enemyFighters = this.enemyFighters.filter((fighter) => {
                return fighter !== this.currentEnemy;
            });
            this.currentEnemy = null;
            
            
            console.log(this.enemyFighters);
            //check enemies remaining
            if(!this.enemyFighters) {
                //game over
            }
            else {
                //pick new fighter
            }
            //if there are enemies left, have player pick new enemy
            //otherwise game ends
        }
        function logAttack(attacker, defender, damage) {
            console.log(
                attacker.name + " attacks " +
                defender.name + " for " +
                damage + " damage.\n" +
                defender.name + " has " +
                defender.healthPoints + " remaining!"
                );
        }
    }    
}

var game;
function init() {
    var fighters = {
        soldier: new Fighter("Solider 76", 200, 15, 15),
        tracer: new Fighter("Tracer", 150, 20, 20),
        reaper: new Fighter("Reaper", 250, 10, 100),
        widow: new Fighter("Widowmaker", 175, 12, 12)
    };
    game = new Game(fighters);
}

    
$(document).ready(function() {
    init();
    
    $(".fighter").on("click", function() {
        if(!game.playerFighter) {
            $(this).appendTo("#attacker-area");
            game.playerFighter = game.fighters[$(this).attr("id")];
            game.enemyFighters = Object.values(game.fighters).filter((fighter) => {
                return fighter !== game.playerFighter;
            });
        }
        else if(!game.currentEnemy) {
            $(this).appendTo("#defender-area");
            game.currentEnemy = game.fighters[$(this).attr("id")];
        }
    });
        
    $("#attack-btn").on("click", function() {
        if(game.playerFighter && game.currentEnemy) {
            console.log(game.currentEnemy);
            game.attack();
        }
    });
});

// function attack() {
//     // damage enemy
//     currentEnemy.healthPoints -= playerFighter.attackPower;

//     logAttack(playerFighter, currentEnemy, playerFighter.attackPower);
    
//     // enemy counterattacks if they survive
//     if(currentEnemy.healthPoints > 0) {
//         playerFighter.healthPoints -= currentEnemy.counterAttackPower;
//         logAttack(currentEnemy, playerFighter, currentEnemy.counterAttackPower);

//         // levelUp if player survives
//         if(playerFighter.healthPoints > 0) {
//             playerFighter.levelUp();
//         }
//         else {
//             console.log("You died.");
//             playerFighter = null;
//         }
//     }
//     else {
//         //remove enemy
//         console.log("Enemy defeated!");
//         enemyFighters = enemyFighters.filter(function(fighter) {
//             return fighter !== currentEnemy;
//         });
//         currentEnemy = null;


//         console.log(enemyFighters);
//         //check enemies remaining
//         if(!enemyFighters) {
//             //game over
//         }
//         else {
//             //pick new fighter
//         }
//         //if there are enemies left, have player pick new enemy
//         //otherwise game ends
//     }
//     function logAttack(attacker, defender, damage) {
//         console.log(
//             attacker.name + " attacks " +
//             defender.name + " for " +
//             damage + " damage.\n" +
//             defender.name + " has " +
//             defender.healthPoints + " remaining!"
//         );
//     }
// }
