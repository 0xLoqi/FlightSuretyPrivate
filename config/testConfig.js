
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function (accounts) {

    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2",
        "0xF014343BDFFbED8660A9d8721deC985126f189F3",
        "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9",
        "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
        "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86",
        "0x6b85cc8f612d5457d49775439335f83e12b8cfde",
        "0xcbd22ff1ded1423fbc24a7af2148745878800024",
        "0xc257274276a4e539741ca11b590b9447b26a8051",
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7",
        "0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF",
        "0xA7d9ddBE1f17865597fBD27EC712455208b6B76d",
        "0x4404ac8bd8F9618D27Ad2f1485AA1B2cFD82482D",
        "0x7457d5E02197480Db681D3fdF256c7acA21bDc12",
        "0x91C44b6F3A749E5f6A5C5F2A7D1777488EAf525C",
        "0x8e0C1Da74D29d416fC94Bc8e8eFDFFB651A61D9d",
        "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
        "0x029c8bCC22f3A7e206025B6DfC7aF37801C0c6E6",
        "0x7C5a0CE9267ED19B22F8cae653F198e3e8daf098"
    ];


    let owner = accounts[0];
    let firstAirline = accounts[1];

    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);


    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};