//=============================================================================
// Viz_Turn.js [MZ] (v1.0.0)
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] (v1.0.0) Permite al jugador cambiar de dirección sin moverse.
 * @author Vizcacha
 * @base Viz_GameControlsExtender
 * @orderAfter Viz_GameControlsExtender
 * @url https://github.com/Cri-ParraC/Viz_Turn
 * @help Viz_Turn.js [MZ] (v1.0.0)
 * ----------------------------------------------------------------------------
 * Plugin para RPG Maker MZ que permite al jugador girar en su lugar, sin
 * moverse.
 * 
 * Existen 2 formas de girar:
 * 
 * - Presionando un botón
 *   => Análogo derecho del mando.
 *
 * - Presionando una combinación de botones
 *   => ALT + direccional en el teclado
 *   => RT + direccional en el mando
 * 
 * Requiere como base el plugin Viz_GameControlsExtender.js (+v1.0).
 */

(() => {
  "use strict";

  window.Imported ||= {};
  Imported.Viz_Turn = 1.0;

  if (Imported.Viz_GameControlsExtender) {
    if (Imported.Viz_GameControlsExtender >= 1.0) {
      console.info("Viz_Turn.js [MZ] (v1.0.0)");
    } else {
      throw new Error('Viz_Turn.js: Viz_GameControlsExtender.js debe ser +v1.0');
    }
  } else {
    throw new Error('Viz_Turn.js: Requiere Viz_GameControlsExtender.js (+v1.0)');
  }

  //-----------------------------------------------------------------------------
  // Input
  //-----------------------------------------------------------------------------

  Input.gamepadMapper[200] = "turnup";
  Input.gamepadMapper[201] = "turndown";
  Input.gamepadMapper[202] = "turnleft";
  Input.gamepadMapper[203] = "turnright";

  Input.gamepadMapper[7] = "turn";
  Input.keyMapper[18] = "turn";

  //-----------------------------------------------------------------------------
  // Game_Player
  //-----------------------------------------------------------------------------

  // Game_Player.turnByInput (*)

  Game_Player.prototype.turnByInput = function () {
    if (Input.isTriggered("turndown")) {
      this._turning = true;
      $gamePlayer.setDirection(2); // turndown
    }
    if (Input.isTriggered("turnleft")) {
      this._turning = true;
      $gamePlayer.setDirection(4); // turnleft
    }
    if (Input.isTriggered("turnright")) {
      this._turning = true;
      $gamePlayer.setDirection(6); // turnright
    }
    if (Input.isTriggered("turnup")) {
      this._turning = true;
      $gamePlayer.setDirection(8); // turnup
    }
  };

  // Game_Player.turnByCombination (*)

  Game_Player.prototype.turnByCombination = function () {
    if (Input.isPressed("turn")) {
      this._turning = true;
      if (Input.isTriggered("down")) {
        this.setDirection(2);
      }
      if (Input.isTriggered("left")) {
        this.setDirection(4);
      }
      if (Input.isTriggered("right")) {
        this.setDirection(6);
      }
      if (Input.isTriggered("up")) {
        this.setDirection(8);
      }
    }
  };

  // Game_Player.turn (*)

  Game_Player.prototype.turn = function (sceneActive) {
    if (sceneActive) {
      if (!this.isMoving() && this.canMove() && !this.isDashing()) {
        this.turnByInput();
        this.turnByCombination();
      }
    }
  };

  // Game_Player.update (alias)

  const Game_Player_update = Game_Player.prototype.update;

  Game_Player.prototype.update = function (sceneActive) {
    this.turn(sceneActive);
    Game_Player_update.call(this, sceneActive);
    this._turning = false;
  };

  // Game_Player.canMove (alias)

  const Game_Player_canMove = Game_Player.prototype.canMove;

  Game_Player.prototype.canMove = function () {
    if (this.isTurning()) {
      return false;
    }
    return Game_Player_canMove.call(this);
  };

  // Game_Player.initMembers (alias)

  const Game_Player_initMembers = Game_Player.prototype.initMembers;

  Game_Player.prototype.initMembers = function () {
    Game_Player_initMembers.call(this);
    this._turning = false;
  };

  // Game_Player.isTurning (*)

  Game_Player.prototype.isTurning = function () {
    return this._turning;
  };

  // Game_Player.triggerAction (alias)

  const Game_Player_triggerAction = Game_Player.prototype.triggerAction;

  Game_Player.prototype.triggerAction = function () {
    if (this.isTurning() && this.triggerButtonAction()) {
      return true;
    }
    return Game_Player_triggerAction.call(this);
  };

})();
