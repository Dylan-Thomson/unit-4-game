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
        $("#" + this.currentEnemy.name + " .hp").text(this.currentEnemy.healthPoints);
        logAttack(this.playerFighter, this.currentEnemy, this.playerFighter.attackPower);
        
        // enemy counterattacks if they survive
        if(this.currentEnemy.healthPoints > 0) {
            this.playerFighter.healthPoints -= this.currentEnemy.counterAttackPower;
            $("#" + this.playerFighter.name + " .hp").text(this.playerFighter.healthPoints);
            logAttack(this.currentEnemy, this.playerFighter, this.currentEnemy.counterAttackPower);
            
            // levelUp if player survives
            if(this.playerFighter.healthPoints > 0) {
                this.playerFighter.levelUp();
            }
            else {
                console.log("You died.");
                this.playerFighter = null;
                $("#new-game-btn").show();
            }
        }
        else {
            //remove enemy
            console.log("Enemy defeated!");
            this.enemyFighters = this.enemyFighters.filter((fighter) => {
                return fighter !== this.currentEnemy;
            });
            console.log(this.currentEnemy.name);
            $("#" + this.currentEnemy.name).hide();
            this.currentEnemy = null;
            
            
            console.log(this.enemyFighters);
            //check enemies remaining
            if(!this.enemyFighters.length) {
                console.log("You won!");
                $("#new-game-btn").show();
            }
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

// Set up game object
var game;
function init() {
    var fighters = {
        soldier: new Fighter("soldier", 200, 15, 15),
        tracer: new Fighter("tracer", 150, 20, 20),
        reaper: new Fighter("reaper", 250, 10, 10),
        widow: new Fighter("widow", 175, 12, 12)
    };
    game = new Game(fighters);

    Object.values(fighters).forEach(function(fighter) {
        $("#" + fighter.name + " .hp").text(fighter.healthPoints);
    });
    $(".fighter").removeClass("player-fighter enemy-fighter");
    $(".fighter").appendTo("#fighter-select");
    $(".fighter").show();
    $("#new-game-btn").hide();
}

$(document).ready(function() {
    init();

    $(".fighter").on("click", function() {
        var fighter = game.fighters[$(this).attr("id")];
        // Player selects fighter if none selected yet
        if(!game.playerFighter) {
            $(this).appendTo("#attacker-area");
            $(this).addClass("player-fighter");
            game.playerFighter = fighter;
            // Add other fighters to enemyFighters array
            game.enemyFighters = Object.values(game.fighters).filter((fighter) => {
                return fighter !== game.playerFighter;
            });
            game.enemyFighters.forEach(function(fighter) {
                $("#" + fighter.name).addClass("enemy-fighter");
            });
        }
        // Player selects an enemy
        else if(!game.currentEnemy && fighter !== game.playerFighter) {
            $(this).appendTo("#defender-area");
            game.currentEnemy = fighter;
        }
    });
    
    // Player clicks attack
    $("#attack-btn").on("click", function() {
        if(game.playerFighter && game.currentEnemy) {
            console.log(game.currentEnemy);
            game.attack();
        }
    });

    $("#new-game-btn").on("click", function() {
        init();
    });
});
