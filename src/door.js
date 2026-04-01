
function door_add(x, y, z, isActive) {
  doors.push({
    x: x,
    y: y,
    z: z,
    offset: 0, // used for opening and closing
    state: DOOR_STATE_CLOSED,
    isActive: isActive
  });
}

function door_update() {
  doors.forEach(function(door) {
    // 玩家穿门后，大门永久锁定关闭（不再根据距离开关）
    let doorLocked = door.isActive && playerEnteredLevel && player.z > door.z;

    // open doors if you are in range (未穿门锁定时才生效)
    if (!doorLocked && player_nearDoor(door) && door.state === DOOR_STATE_CLOSED) {
      if (door.isActive) {
        door.state = DOOR_STATE_OPENING;
        soundEffects_play(SOUND_EFFECTS_DOOR_OPEN);
      }
    }
    // 玩家真正穿门后立即关门（Z 轴方向超过门 3 个单位即触发）
    else if (door.isActive && door.state === DOOR_STATE_OPEN && player.z - door.z > 3) {
      door.state = DOOR_STATE_CLOSING;
      soundEffects_play(SOUND_EFFECTS_DOOR_CLOSE);
    }
    // 穿门锁定后不再自动关门，避免已关闭的门又触发状态变化
    else if (!doorLocked && !player_nearDoor(door) && door.state === DOOR_STATE_OPEN) {
      door.state = DOOR_STATE_CLOSING;
      soundEffects_play(SOUND_EFFECTS_DOOR_CLOSE);
    }

    // udpate opening doors
    let distEachFrame = DOOR_OPEN_SPEED * elapsedTime / 1000;
    if (door.state === DOOR_STATE_OPENING) {
      door.offset += distEachFrame;

      if (door.offset > 8) {
        door.offset = 8;
        door.state = DOOR_STATE_OPEN;
      }
    }
    else if (door.state === DOOR_STATE_CLOSING) {    
      door.offset -= distEachFrame;

      if (door.offset < 0) {
        door.offset = 0;
        door.state = DOOR_STATE_CLOSED;
      }
    }
  });
}