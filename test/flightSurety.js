
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
const truffleAssert = require('truffle-assertions');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));



contract('Flight Surety Tests', async (accounts) => {

    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });

    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    it(`(multiparty) has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

    });

    it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false);
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

    });

    it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false;
        try {
            await config.flightSurety.setTestingMode(true);
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);

    });
    //ADDITIONAL TESTS
    it('(airline) can register an Airline using registerAirline() if it is funded', async () => {
        // ARRANGE
        let newAirline = accounts[2];
        let fundingAmount = web3.utils.toWei("10", "ether");

        // ACT
        try {
            await config.flightSuretyData.registerAirline(newAirline, { from: config.firstAirline });
        } catch (e) {
            console.log(e);
        }

        // ASSERT
        let result = await config.flightSuretyData.isAirline.call(newAirline);
        assert.equal(result, true, "Airline should be able to register another airline if it has provided funding");
    });

    it('(airline) can register an Airline using registerAirline() if it is funded and there are less than 4 airlines', async () => {
        // ARRANGE
        let newAirline = accounts[3];

        // ACT
        try {
            await config.flightSuretyData.registerAirline(newAirline, { from: config.firstAirline });
        } catch (e) {
            console.log(e);
        }

        // ASSERT
        let result = await config.flightSuretyData.isAirline.call(newAirline);
        assert.equal(result, true, "Airline should be able to register another airline if it has provided funding");
    });
    it('(airline) cannot register an Airline using registerAirline() if it is funded and there are more than 4 airlines', async () => {
        // ARRANGE
        let newAirline = config.testAddresses[4];
        let newAirline2 = config.testAddresses[5];
        let newAirline3 = config.testAddresses[6];
        let newAirline4 = config.testAddresses[7];
        let newAirline5 = config.testAddresses[8];

        // ACT
        try {
            await config.flightSuretyData.registerAirline(newAirline, { from: config.firstAirline });
            await config.flightSuretyData.registerAirline(newAirline2, { from: config.firstAirline });
            await config.flightSuretyData.registerAirline(newAirline3, { from: config.firstAirline });
            await config.flightSuretyData.registerAirline(newAirline4, { from: config.firstAirline });
        } catch (e) {
            console.log(e);
        }
        try {
            await config.flightSuretyData.registerAirline(newAirline5, { from: config.firstAirline });
        } catch (e) {
            console.log(e);
        }

        // ASSERT
        let result = await config.flightSuretyData.isAirline.call(newAirline5);
        assert.equal(result, false, "Airline should not be able to register another airline if it has provided funding and there are more than 4 airlines");
    });

    it('(airline) can register an Airline using registerAirline() if it receives enough votes', async () => {
        // ARRANGE
        let newAirline = accounts[4];
        let fundingAmount = web3.utils.toWei("10", "ether");

        // Register and fund account[2] and account[3]
        //await config.flightSuretyData.registerAirline(accounts[2], { from: config.firstAirline });
        await config.flightSuretyData.fund({ from: accounts[2], value: fundingAmount });

        //await config.flightSuretyData.registerAirline(accounts[3], { from: config.firstAirline });
        await config.flightSuretyData.fund({ from: accounts[3], value: fundingAmount });

        // ACT
        // First vote for the new airline
        try {
            await config.flightSuretyData.registerAirline(newAirline, { from: accounts[2] });
        } catch (e) {
            console.log(e);
        }

        // ASSERT
        let result = await config.flightSuretyData.isAirline.call(newAirline);
        assert.equal(result, false, "Airline should not be registered until it receives enough votes");

        // ACT
        // Second vote, reaching the required threshold for registration
        try {
            await config.flightSuretyData.registerAirline(newAirline, { from: accounts[3] });
        } catch (e) {
            console.log(e);
        }

        // ASSERT
        result = await config.flightSuretyData.isAirline.call(newAirline);
        assert.equal(result, true, "Airline should be registered once it receives enough votes");
    });

    it('(passenger) can buy insurance for a flight', async () => {
        // ARRANGE
        let passenger = accounts[5];
        let flight = "ND1309";
        let timestamp = Math.floor(Date.now() / 1000);
        let newAirline = accounts[3];

        // Register the flight
        await config.flightSuretyData.registerFlight(newAirline, flight, timestamp, { from: newAirline });

        // ACT
        let tx = await config.flightSuretyData.buyInsurance(newAirline, flight, timestamp, { from: passenger, value: web3.utils.toWei("1", "ether") });

        // ASSERT
        truffleAssert.eventEmitted(tx, 'InsurancePurchased', (ev) => {
            return ev.passenger === passenger;
        }, 'InsurancePurchased event should be emitted with correct parameters');
    });

    it('(passenger) can have accounts credited and withdraw insurance payout', async () => {
        // ARRANGE
        let passenger = accounts[5];
        let flight = "ND1309";
        let timestamp = Math.floor(Date.now() / 1000);
        let newAirline = accounts[3];

        // Register the flight
        await config.flightSuretyData.registerFlight(newAirline, flight, timestamp, { from: newAirline });

        // Buy insurance
        await config.flightSuretyData.buyInsurance(newAirline, flight, timestamp, { from: passenger, value: web3.utils.toWei("1", "ether") });

        //getFlightkey
        let flightKey = await config.flightSuretyApp.getFlightKey(newAirline, flight, timestamp);

        //setFlightStatus to 20
        await config.flightSuretyData.setFlightStatus(flightKey, 20, { from: config.firstAirline });

        //getInsuredPassengers
        let insuredpassengers = await config.flightSuretyApp.getInsuredPassengers(flightKey, { from: config.firstAirline });

        //creditInsurees
        await config.flightSuretyData.creditInsurees(insuredpassengers, newAirline, flight, timestamp, { from: config.firstAirline });

        // ACT
        let tx = await config.flightSuretyData.withdraw({ from: passenger });

        // ASSERT
        truffleAssert.eventEmitted(tx, 'PaymentWithdrawn', (ev) => {
            return ev.passenger === passenger && ev.amount !== '0';
        }, 'PaymentWithdrawn event should be emitted with correct parameters');
    });
});