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
        let result = {
            player: this.playerFighter,
            enemy: this.currentEnemy
        };
        // damage enemy
        this.currentEnemy.healthPoints -= this.playerFighter.attackPower;
        //logAttack(this.playerFighter, this.currentEnemy, this.playerFighter.attackPower);
        
        // enemy counterattacks if they survive
        if(this.currentEnemy.healthPoints > 0) {
            this.playerFighter.healthPoints -= this.currentEnemy.counterAttackPower;
            //logAttack(this.currentEnemy, this.playerFighter, this.currentEnemy.counterAttackPower);
            
            // levelUp if player survives
            if(this.playerFighter.healthPoints > 0) {
                this.playerFighter.levelUp();
            }
            else {
                this.playerFighter = null;
                result.gameOver = "lose";
                return result;
            }
        }
        else {
            //remove enemy
            result.defeatedEnemy = this.currentEnemy;
            this.enemyFighters = this.enemyFighters.filter((fighter) => {
                return fighter !== this.currentEnemy;
            });
            this.currentEnemy = null;
            
            //check enemies remaining
            if(!this.enemyFighters.length) {
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
let game;
function init() {
    const fighters = {
        soldier: new Fighter("soldier", 200, 20, 30),
        tracer: new Fighter("tracer", 150, 25, 40),
        reaper: new Fighter("reaper", 230, 15, 25),
        widow: new Fighter("widow", 160, 25, 35)
    };
    game = new Game(fighters);

    // Append fighters to fighter-select in order
    Object.values(fighters).forEach(function(fighter) {
        $("#" + fighter.name + " .hp").text(fighter.healthPoints);
        $("#" + fighter.name ).appendTo("#fighter-select");
        
    });

    // Reset web site
    $(".fighter").removeClass("player-fighter enemy-fighter");
    $(".fighter").show();
    $("#new-game-btn").hide();
    $("#attack-btn").show();
    $("#game-message").text("Choose a fighter");
}

$(document).ready(function() {
    init();

    $(".fighter").on("click", function() {
        const fighter = game.fighters[$(this).attr("id")];

        // Player selects fighter if none selected yet
        if(!game.playerFighter) {
            $(this).appendTo("#attacker-area");
            $(this).addClass("player-fighter");
            game.playerFighter = fighter;

            // Add other fighters to enemyFighters array
            game.enemyFighters = Object.values(game.fighters).filter((fighter) => {
                return fighter !== game.playerFighter;
            });
            $("#game-message").text("Choose an opponent");
        }
        
        // Player selects an enemy
        else if(!game.currentEnemy && fighter !== game.playerFighter) {
            $(this).appendTo("#defender-area");
            game.currentEnemy = fighter;
            $("#" + fighter.name).addClass("enemy-fighter");
            $("#game-message").text("Attack!");
        }
    });
    
    // Player clicks attack
    $("#attack-btn").on("click", function() {
        if(game.playerFighter && game.currentEnemy) {
            const result = game.attack();
            $("#" + result.player.name + " .hp").text(result.player.healthPoints);
            $("#" + result.enemy.name + " .hp").text(result.enemy.healthPoints);
            if(result.gameOver === "lose") {
                $("#new-game-btn").show();
                $("#attack-btn").hide();
                $("#game-message").text("You lost...");
            }
            else if (result.defeatedEnemy) {
                $("#" + result.defeatedEnemy.name).hide();
                if(result.gameOver === "win") {
                    $("#game-message").text("You won!!");
                    $("#new-game-btn").show();
                    $("#attack-btn").hide();
                }
                else {
                    $("#game-message").text("Choose an opponent");
                }
            }
        }
    });

    $("#new-game-btn").on("click", function() {
        init();
    });
});
