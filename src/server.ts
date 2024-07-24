/* eslint-disable no-case-declarations */
import readline from 'readline';

import { Health } from '@gman/controllers/health/health';
import { WeightedGraph } from '@gman/controllers/algorithm/dijstras';
import { checkForArguments, createEdges, createVertices } from '@gman/utils/utility-functions';

import { Direction } from './controllers/algorithm/interfaces';

export class Server {
  private initialPower: number;
  private gridSize: number;
  private rotationPowerLoss: number;
  private oneStepPowerLoss: number;
  private dbData: { [key: string]: number | string };
  private graph: WeightedGraph;

  constructor() {
    this.initialPower = 200;
    this.gridSize = 6;
    this.rotationPowerLoss = 5;
    this.oneStepPowerLoss = 10;
    this.dbData = {};

    // grid creation
    this.graph = new WeightedGraph(this.rotationPowerLoss, this.oneStepPowerLoss);
    createVertices(this.gridSize, this.graph);
    createEdges(this.gridSize, this.graph);
  }

  public start(): void {
    //health check
    const health = new Health();
    health.health();

    //start input output interface
    this.createInputInterface();
  }

  private createInputInterface() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });

    rl.prompt();

    rl.on('line', (line) => {
      const input = line.trim().split(' ');

      const command = input[0].toUpperCase();
      const args = input.slice(1);

      switch (command) {
        case 'SOURCE':
          checkForArguments(args, 3);
          const [source_xCoordinate, source_yCoordinate, direction] = args;
          this.dbData['source'] = `${source_xCoordinate}${source_yCoordinate}`;
          this.dbData['direction'] = direction.toLowerCase();
          break;
        case 'DESTINATION':
          checkForArguments(args, 2);
          const [destination_xCoordinate, destination_yCoordinate] = args;
          this.dbData['destination'] = `${destination_xCoordinate}${destination_yCoordinate}`;
          break;
        case 'PRINT_POWER':
          const { power } = this.graph.Dijkstra(
            this.dbData.source as string,
            this.dbData.destination as string,
            this.initialPower,
            this.dbData.direction as Direction
          );
          console.log('POWER ', power);
          break;
        default:
          console.log(`UNKNOWN COMMAND: ${command}`);
          break;
      }

      rl.prompt();
    }).on('close', () => {
      console.log('Exiting the application');
    });
  }
}
