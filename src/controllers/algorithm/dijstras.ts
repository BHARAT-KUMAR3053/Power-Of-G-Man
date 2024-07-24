import { PriorityQueue } from '@gman/controllers/algorithm/priority-queue';
import { Direction, IAdjacencyList } from '@gman/controllers/algorithm/interfaces';
import { calculateDirectionAndCost } from '@gman/utils/utility-functions';

export class WeightedGraph {
  private power: number;
  private direction: Direction;
  private adjacencyList: IAdjacencyList;
  private rotationPowerLoss: number;
  private oneStepPowerLoss: number;

  constructor(rotationPowerLoss: number, oneStepPowerLoss: number) {
    this.adjacencyList = {};
    this.power = 0;
    this.direction = 'n';
    this.rotationPowerLoss = rotationPowerLoss;
    this.oneStepPowerLoss = oneStepPowerLoss;
  }

  addVertex(vertex: string): void {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1: string, vertex2: string, weight: number) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  Dijkstra(start: string, finish: string, power: number, direction: Direction) {
    this.power = power;
    this.direction = direction.toLowerCase() as Direction;
    const nodes = new PriorityQueue();
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const path = [];
    let smallest: string;

    for (const vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (nodes.values.length) {
      smallest = nodes.dequeue()!.val;

      if (smallest === finish) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest] as string;
        }
        break;
      }

      if (smallest || distances[smallest] !== Infinity) {
        for (const neighbor in this.adjacencyList[smallest]) {
          const nextNode = this.adjacencyList[smallest][neighbor];
          const nextNeighbor = nextNode.node;
          const { directionCost } = calculateDirectionAndCost(smallest, nextNeighbor, this.direction, this.rotationPowerLoss);
          const candidate = distances[smallest] + nextNode.weight + directionCost;
          if (candidate < distances[nextNeighbor]) {
            distances[nextNeighbor] = candidate;
            previous[nextNeighbor] = smallest;
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }

    let additionalCost = 0;
    let oldDirection = direction;
    const newPath = path.concat(smallest!).reverse();

    for (let i = 0; i < newPath.length - 1; i++) {
      const { newDirection, directionCost } = calculateDirectionAndCost(newPath[i], newPath[i + 1], oldDirection, this.rotationPowerLoss);
      if (oldDirection !== newDirection) {
        additionalCost += directionCost;
        oldDirection = newDirection;
      }
    }
    const newPower = this.power - path.length * this.oneStepPowerLoss - additionalCost;
    return { path: newPath, power: newPower };
  }
}
