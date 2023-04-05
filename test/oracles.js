
var Test = require('../config/testConfig.js');
//var BigNumber = require('bignumber.js');

contract('Oracles', async (accounts) => {

  const TEST_ORACLES_COUNT = 10;
  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);

    // Watch contract events
    const STATUS_CODE_UNKNOWN = 0;
    const STATUS_CODE_ON_TIME = 10;
    const STATUS_CODE_LATE_AIRLINE = 20;
    const STATUS_CODE_LATE_WEATHER = 30;
    const STATUS_CODE_LATE_TECHNICAL = 40;
    const STATUS_CODE_LATE_OTHER = 50;


  });


  // it('can register oracles', async () => {

  //   // ARRANGE
  //   let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

  //   // ACT
  //   for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
  //     await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee });
  //     let result = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
  //     console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
  //   }
  // });

  // it('can request flight status', async () => {

  //   // ARRANGE
  //   let flight = 'ND1309'; // Course number
  //   let timestamp = Math.floor(Date.now() / 1000);

  //   // Register the flight
  //   await config.flightSuretyData.registerFlight(config.firstAirline, flight, timestamp, { from: config.firstAirline });

  //   // Submit a request for oracles to get status information for a flight
  //   await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight, timestamp);
  //   // ACT

  //   // Since the Index assigned to each test account is opaque by design
  //   // loop through all the accounts and for each account, all its Indexes (indices?)
  //   // and submit a response. The contract will reject a submission if it was
  //   // not requested so while sub-optimal, it's a good test of that feature
  //   for (let a = 1; a < TEST_ORACLES_COUNT; a++) {

  //     // Get oracle information
  //     let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
  //     for (let idx = 0; idx < 3; idx++) {

  //       try {
  //         // Submit a response...it will only be accepted if there is an Index match
  //         await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight, timestamp, STATUS_CODE_ON_TIME, { from: accounts[a] });

  //       }
  //       catch (e) {
  //         // Enable this when debugging
  //         console.log('\nError', idx, oracleIndexes[idx].toNumber(), flight, timestamp);
  //       }

  //     }
  //   }

  // });

  //////////////////updated test script////////////////////////
  it('can register oracles', async () => {
    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

    // ACT
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee });
      let result = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
  });

  it('can request flight status', async () => {
    // ARRANGE
    let flight = 'ND1309';
    let timestamp = Math.floor(Date.now() / 1000);
    let STATUS_CODE_ON_TIME = 10;

    // Register the flight
    await config.flightSuretyData.registerFlight(config.firstAirline, flight, timestamp, { from: config.firstAirline });

    // Submit a request for oracles to get status information for a flight
    await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight, timestamp);

    // ACT
    let requestIndex;

    config.flightSuretyApp.OracleRequest().on("data", async event => {
      requestIndex = event.args.index;
      console.log(event.args.index);
    });

    console.log(requestIndex);

    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      // Get oracle information
      let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });

      console.log(oracleIndexes.some(index => index.toNumber === requestIndex));
      console.log(requestIndex);
      // Check if any of the oracle's indexes match the request index
      if (oracleIndexes.some(index => index.toNumber() === requestIndex)) {
        try {
          // Submit a response...it will only be accepted if there is an Index match
          await config.flightSuretyApp.submitOracleResponse(requestIndex, config.firstAirline, flight, timestamp, STATUS_CODE_ON_TIME, { from: accounts[a] });
          console.log(`Oracle ${a} submitted a response`);

        } catch (e) {
          // Enable this when debugging
          console.log('\nError', oracleIndexes, flight, timestamp);
        }
      }
    }

    // Check if enough responses were submitted
    let flightStatus = await config.flightSuretyApp.fetchFlightStatus.call(config.firstAirline, flight, timestamp);
    assert.equal(flightStatus, TEST_ORACLES_COUNT, "Not enough responses were submitted");
  });



});
