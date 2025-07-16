import { jest } from '@jest/globals';
import energyConsumption from '../src/js/_lib/energyConsumption.js';

const { estimateEnergyConsumption, constants } = energyConsumption;

describe('Estimated energyConsumption self-test', () => {
  test('should return the correct total energy consumption', () => {
    const totalEnergy = estimateEnergyConsumption();
    expect(totalEnergy).toBeCloseTo(0.0697, 4);
  });

  test('It should return the correct total energy consumption for 10 API calls', () => {
    const totalEnergy = estimateEnergyConsumption() * 10;
    expect(totalEnergy).toBeCloseTo(0.7, 2);
  });

  test('It should have server energy consumption defined', () => {
    const { serverEnergy } = constants;
    expect(serverEnergy).toBeDefined();
    expect(serverEnergy).toBeCloseTo(0.0083, 4);
  });

  test('It should have network energy consumption defined', () => {
    const { networkEnergy } = constants;
    expect(networkEnergy).toBeDefined();
    expect(networkEnergy).toBeCloseTo(0.06, 4);
  });

  test('It should have client energy consumption defined', () => {
    const { clientEnergy } = constants;
    expect(clientEnergy).toBeDefined();
    expect(clientEnergy).toBeCloseTo(0.0014, 4);
  });

});
