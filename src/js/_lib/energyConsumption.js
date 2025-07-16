/**
 * Estimated energy consumption in watt-hours
 * @file energyConsumption.js
 * @module energyConsumption
 */

/**
 * @constant {Object} constants - Estimated energy consumption in watt-hours
 */
const constants = {
  serverEnergy: 0.0083, // watt-hours
  networkEnergy: 0.06, // watt-hours
  clientEnergy: 0.0014, // watt-hours
};
Object.freeze(constants);

/**
 * @returns {Number} Total energy consumption
 */
const estimateEnergyConsumption = () => {
  const { serverEnergy, networkEnergy, clientEnergy } = constants;
  return serverEnergy + networkEnergy + clientEnergy;
};

export default { estimateEnergyConsumption, constants };
