export const spawnOnMapEdge = scene => {
  // map edges are numbered 1 - 4 clockwise from top
  // returns random point (x,y) somewhere on the edge of the map
  const edge = Math.ceil(Math.random() * 4);

  const edgeLength = edge % 2 === 0 ? scene.map.height : scene.map.width;
  const position = Math.floor(Math.random() * edgeLength);

  switch (edge) {
    case 1:
      return { x: position, y: 0 };
    case 2:
      return { x: scene.map.width - 1, y: position };
    case 3:
      return { x: position, y: scene.map.height - 1 };
    case 4:
      return { x: 0, y: position };
  }
};
