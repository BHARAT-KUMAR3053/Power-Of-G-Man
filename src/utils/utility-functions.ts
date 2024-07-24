import { WeightedGraph } from '@gman/controllers/algorithm/dijstras';
import { Direction } from '@gman/controllers/algorithm/interfaces';

export function createVertices(n: number, graph: WeightedGraph) {
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const vertex = `${i}${j}`;
      graph.addVertex(vertex);
    }
  }
}

export function createEdges(n: number, graph: WeightedGraph) {
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const currentVertex = `${i}${j}`;
      if (j < n) {
        // Adding edge to the right neighbor
        const rightNeighbor = `${i}${j + 1}`;
        graph.addEdge(currentVertex, rightNeighbor, 10);
      }
      if (i < n) {
        // Adding edge to the down neighbor
        const downNeighbor = `${i + 1}${j}`;
        graph.addEdge(currentVertex, downNeighbor, 10);
      }
    }
  }
}

function calculateDirectionChangeCost(direction1: Direction, direction2: Direction, rotationPowerLoss: number) {
  const directions = ['n', 'e', 's', 'w'];
  const index1 = directions.indexOf(direction1);
  const index2 = directions.indexOf(direction2);

  if (index1 === -1 || index2 === -1) {
    throw new Error("Invalid direction. Only 'n', 's', 'e', 'w' are allowed.");
  }

  const diff = Math.abs(index1 - index2);

  const minTurns = Math.min(diff, 4 - diff);

  // Returning the cost based on the number of 90-degree turns
  return minTurns * rotationPowerLoss;
}

export function calculateDirectionAndCost(node1: string, node2: string, direction: Direction, rotationPowerLoss: number) {
  let newDirection: Direction;
  let directionCost: number;
  if (node2.slice(0, 1) === node1.slice(0, 1)) {
    if (Number(node2.slice(1)) > Number(node1.slice(1))) {
      newDirection = 'n';
      directionCost = calculateDirectionChangeCost(direction, newDirection, rotationPowerLoss);
      return { newDirection, directionCost };
    } else {
      newDirection = 's';
      directionCost = calculateDirectionChangeCost(direction, newDirection, rotationPowerLoss);
      return { newDirection, directionCost };
    }
  } else {
    if (Number(node2.slice(0, 1)) > Number(node1.slice(0, 1))) {
      newDirection = 'e';
      directionCost = calculateDirectionChangeCost(direction, newDirection, rotationPowerLoss);
      return { newDirection, directionCost };
    } else {
      newDirection = 'w';
      directionCost = calculateDirectionChangeCost(direction, newDirection, rotationPowerLoss);
      return { newDirection, directionCost };
    }
  }
}

export function checkForArguments(args: string[], length: number) {
  if (args.length !== length) {
    console.log('Invalid number of arguments');
  }
}
