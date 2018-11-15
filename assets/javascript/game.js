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

class Game {
    constructor(fighters) {
        this.fighters = fighters;
        this.playerFighter;
        this.enemyFighters = [];
        this.currentEnemy;
    }

    attack() {
        var result = {
            player: this.playerFighter,
            enemy: this.currentEnemy
        };
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
                result.gameOver = "lose";
                return result;
            }
        }
        else {
            //remove enemy
            console.log("Enemy defeated!");
            result.defeatedEnemy = this.currentEnemy;
            this.enemyFighters = this.enemyFighters.filter((fighter) => {
                return fighter !== this.currentEnemy;
            });
            this.currentEnemy = null;
            
            
            console.log(this.enemyFighters);
            //check enemies remaining
            if(!this.enemyFighters.length) {
                console.log("You won!");
                result.gameOver = "win";
            }
            return result;
        }
        return result;
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

    // Append fighters to fighter-select in order
    Object.values(fighters).forEach(function(fighter) {
        $("#" + fighter.name + " .hp").text(fighter.healthPoints);
        $("#" + fighter.name ).appendTo("#fighter-select");
        
    });
    $(".fighter").removeClass("player-fighter enemy-fighter");
    $(".fighter").show();
    $("#new-game-btn").hide();
    $("#attack-btn").show();
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
            var result = game.attack();
            $("#" + result.player.name + " .hp").text(result.player.healthPoints);
            $("#" + result.enemy.name + " .hp").text(result.enemy.healthPoints);
            console.log("Result", result);
            if(result.gameOver === "lose") {
                console.log("You lost!!!");
                $("#new-game-btn").show();
                $("#attack-btn").hide();
            }
            else if (result.defeatedEnemy) {
                console.log("Enemy defeated!");
                $("#" + result.defeatedEnemy.name).hide();
                if(result.gameOver === "win") {
                    console.log("You Won!!!");
                    $("#new-game-btn").show();
                    $("#attack-btn").hide();
                }
            }
        }
    });

    $("#new-game-btn").on("click", function() {
        init();
    });
});
