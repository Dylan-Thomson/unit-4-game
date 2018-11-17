class Fighter {
    constructor(name, healthPoints, baseAttackPower, counterAttackPower) {
        this.name = name;
        this.healthPoints = healthPoints;
        this.baseAttackPower = baseAttackPower;
        this.attackPower = this.baseAttackPower;
        this.counterAttackPower = counterAttackPower;
    }

    levelUp() {
        this.attackPower += this.baseAttackPower;
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
        this.playerFighter.levelUp();
        //logAttack(this.playerFighter, this.currentEnemy, this.playerFighter.attackPower);
        
        // enemy counterattacks if they survive
        if(this.currentEnemy.healthPoints > 0) {
            this.playerFighter.healthPoints -= this.currentEnemy.counterAttackPower;
            //logAttack(this.currentEnemy, this.playerFighter, this.currentEnemy.counterAttackPower);
            
            // Check if player dies and game ends
            if(this.playerFighter.healthPoints <= 0) {
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
        soldier: new Fighter("soldier", 200, 10, 25), //can win/lose
        tracer: new Fighter("tracer", 150, 18, 35), //can win/lose
        reaper: new Fighter("reaper", 230, 10, 20), //can win/lose
        widow: new Fighter("widow", 160, 16, 30) //can win/lose
    };
    game = new Game(fighters);

    // Append fighters to fighter-select in order
    Object.values(fighters).forEach(function(fighter) {
        $("#" + fighter.name + " .hp").text(fighter.healthPoints);
        $("#" + fighter.name ).appendTo("#fighter-select");
        
    });

    // Reset web site
    $(".fighter").removeClass("player-fighter enemy-fighter defeated");
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
        if(!game.playerFighter && !game.currentEnemy) {
            $(this).appendTo("#attacker-area");
            $(this).addClass("player-fighter");
            game.playerFighter = fighter;

            // Add other fighters to enemy Fighters array
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
            // $("#" + result.player.name).fadeTo("fast", .5, function() {
            //     $("#" + result.player.name).fadeTo("fast", 1);
            // });
            $("#" + result.enemy.name + " .hp").text(result.enemy.healthPoints);
            // $("#" + result.enemy.name).fadeTo("fast", .5, function() {
            //     $("#" + result.enemy.name).fadeTo("fast", 1);
            // });
            if(result.gameOver === "lose") {
                $("#new-game-btn").show();
                $("#attack-btn").hide();
                $("#game-message").text("You lost...");
                $("#" + result.player.name).addClass("defeated");
                // $("#" + result.player.name).fadeOut("slow");
            }
            else if (result.defeatedEnemy) {
                // $("#" + result.defeatedEnemy.name).addClass("defeated");
                // $("#" + result.defeatedEnemy.name).fadeOut("slow");
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

    $("#new-game-btn").on("click", init);
});
