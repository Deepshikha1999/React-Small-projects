
function house() {
    let house = Array.from({ length: 17 }, () => Array.from({ length: 11 }, () => 0))
    let x = 5;
    let y = 5;
    for (let i = 0; i < 6; i++) {
      for (let j = x; j <= y; j++) {
        house[i][j] = 1
      }
      x--;
      y++;
    }
  
    for (let i = 6; i < 17; i++) {
      for (let j = 0; j < 11; j++) {
        house[i][j] = 2
      }
    }
  
    for (let i = 16; i > 16 - 6 + 1; i--) {
      for (let j = 3; j < 8; j++) {
        house[i][j] = 3
      }
    }
  
    for (let i = 8; i < 10; i++) {
      for (let j = 2; j < 4; j++) {
        house[i][j] = 4
      }
      for (let j = 8; j > 6; j--) {
        house[i][j] = 4
      }
    }
    return house;
  }
  
  function tree() {
    let tree = Array.from({ length: 17 }, () => Array.from({ length: 11 }, () => 0))
  
    let x = 4;
    let y = 5;
    for (let i = 0; i < 6; i++) {
      for (let j = x + Math.floor(Math.random() * 2); j <= y + Math.floor(Math.random() * 2); j++) {
        tree[i][j] = 5
      }
      x--;
      y++;
    }
  
    x = 1;
    y = 10;
    for (let i = 6; i < 10; i++) {
      for (let j = x + Math.floor(Math.random() * 2); j <= y - Math.floor(Math.random() * 2); j++) {
        tree[i][j] = 5
      }
      x++;
      y--;
    }
  
    for (let i = 10; i < 15; i++) {
      for (let j = 5; j <= 6; j++) {
        tree[i][j] = 3
      }
    }
  
    for (let j = 3; j < 9; j++) {
      tree[15][j] = 3
      tree[16][j] = 3
    }
    return tree
  }
  
  function grass() {
    let grass = Array.from({ length: 17 }, () => Array.from({ length: 11 }, () => 0))
    let x = 4;
    let y = 5;
    for (let i = 0; i < 6; i++) {
      for (let j = x + Math.floor(Math.random() * 2); j <= y + Math.floor(Math.random() * 2); j++) {
        grass[i][j] = 5
      }
      x--;
      y++;
    }
    for (let i = 6; i < 10; i++) {
      for (let j = 0; j < 11; j++) {
        grass[i][j] = 5
      }
    }
    return grass;
  }
  
  