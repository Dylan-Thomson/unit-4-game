# unit-4-game
User selects a fighter, then must choose to fight opponents in a certain order to win the game.

## Fighter class
The Fighter class contains properties for `name`, `healthPoints`, `baseAttackPower`, `attackPower`, and `counterAttackPower`.

A new Fighter is created by calling the constructor `new Fighter(name, healthPoints, baseAttackPower, counterAttackPower)`. It expects a `String` argument and three `number` arguments. `attackPower` is initially set to `baseAttack`. 

Fighter contains one method called `levelUp()`. It increases the fighter's `attackPower` by its `baseAttackPower`. For example, a fighter with base attack power of 6 will level up to 12, 18, and so on.

## Game class
The Game class contains properties for `fighters`, `playerFighter` `enemyFighters`, and `currentEnemy`.

A new Game is created by calling the constructor `new Game(fighters)`. It expects an `Object` containing objects of the `Fighter` class.

Game contains one method called `attack()`. The enemy fighter loses `healthPoints` based on the player's `attackPower`. 

If the enemy survives, it counterattacks, subtracting its `counterAttackPower` from the player's `healthPoints`. The game then checks the player's `healthPoints` to determine whether or not the player has lost.

Should the player defeat an enemy, the game removes the `currentEnemy` from `enemyFighters` and checks this array to see if there are enemies left. If there are no enemies left, the player wins the game. Otherwise, the player must choose another enemy to continue.

`attack()` returns an object containing the player's fighter, the enemy fighter, and two optional values `gameOver` and `defeatedEnemy`. The `gameOver` property will be set to either `"win"` or `"lose"`. This object simply holds onto some Game data that would otherwise be lost, so that the data can be used to update the web site.

## Beating the game
<details>
<summary>Spoilers?</summary>
The strategy for beating the game is simple. You must fight enemies in order of ascending `counterAttackPower` so that you can level up your own `attackPower` to minimize the attacks you take from the harder hitting fighters.
</details>