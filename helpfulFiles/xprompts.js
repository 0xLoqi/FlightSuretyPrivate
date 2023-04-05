////////////[test that we're debugging]//////////////////////////////

it('(airline) can be funded by sending funds to the data contract', async () => {
    // ARRANGE
    let fundingAmount = web3.utils.toWei("10", "ether");

    // Register the airline first
    await config.flightSuretyApp.registerAirline(config.firstAirline, { from: config.owner });
    let isRegistered = await config.flightSuretyData.isAirline.call(config.firstAirline);
    assert.equal(isRegistered, true, "Airline should be registered before attempting to fund");

    // ACT
    let tx;
    try {
        tx = await config.flightSuretyData.fund({ from: config.firstAirline, value: fundingAmount });
    } catch (error) {
        console.log("Error message:", error.message);
    }

    // Check for the AirlineFunded event
    if (tx !== undefined) {
        const airlineFundedEvent = tx.logs.find(e => e.event === 'AirlineFunded');
        assert.exists(airlineFundedEvent, 'AirlineFunded event should be emitted');
    }

    let result = await config.flightSuretyData.fundedAirlines.call(config.firstAirline);

    // ASSERT
    assert.equal(result, true, "Airline should be funded after sending funds to the data contract");
});

/////////////[Error output in console when running test]//////////////

1) (airline) can be funded by sending funds to the data contract
    > No events were emitted


6 passing(10s)
1 failing

1) Contract: Flight Surety Tests
    (airline) can be funded by sending funds to the data contract:
Error: Transaction: 0xcd8a4300a4bfe01c98185f5beb5827bbc5de39e8c53f5669b88eba7feb087143 exited with an error(status 0).
 Please check that the transaction:
- satisfies all conditions set by Solidity `require` statements.
 - does not trigger a Solidity `revert` statement.

//////////////[Function(s) being tested]///////////////////////////

//In flightSuretyData
function registerAirline(address newAirline) external requireIsOperational {
    require(
        fundedAirlines[msg.sender],
        "Only funded airlines can register new airlines"
    );
    require(
        !registeredAirlines[newAirline],
        "Airline is already registered"
    );

    if (registeredAirlineCount < 4) {
        registeredAirlines[newAirline] = true;
        registeredAirlineList.push(newAirline);
        registeredAirlineCount++;

            emit AirlineRegistered(newAirline);
    } else {
        if (!airlineProposals[newAirline][msg.sender]) {
            airlineProposals[newAirline][msg.sender] = true;
        }

            uint256 votes = 0;
        for (uint i = 0; i < registeredAirlineCount; i++) {
                address airline = registeredAirlineList[i];
            if (fundedAirlines[airline]) {
                if (airlineProposals[newAirline][airline]) {
                    votes++;
                }
            }
        }

        if (votes * 2 >= registeredAirlineCount) {
            registeredAirlines[newAirline] = true;
            registeredAirlineList.push(newAirline);
            registeredAirlineCount++;

                emit AirlineRegistered(newAirline);
        }
    }
}

//in flightSuretyApp
function registerAirline(
    address newAirline
) external requireIsOperational returns(bool success) {
    flightSuretyData.registerAirline(newAirline);
    success = true;
}


///////////////[Transaction referenced in error output]///////////

Transaction: 0xcd8a4300a4bfe01c98185f5beb5827bbc5de39e8c53f5669b88eba7feb087143
  Gas usage: 32975
  Block number: 72
  Block time: Wed Mar 29 2023 11: 17: 54 GMT - 0500(Central Daylight Time)
  Runtime error: revert
  Revert reason: Only funded airlines can register new airlines

///////////////[test config]////////////////////////////////////

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
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
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

Please continue to act as a master level software engineer and output back to me the issue as well as any code required to fix or request any additional information needed from this project


///////////////front end dev prompt/////////////////////////////
I have some requirements that need to be fulfilled for this to work properly; please add the following and output the completed code.The design should follow modern design principles.Also try not to make many assumptions and do not hesitate to ask me for additional context before outputting the final code.The requirements are as follows:

/////////////JS Dev Prompt:
You're amazing. Please update the index.js to reflect the new html. Here is the current .js file:


import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async () => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error, result);
            display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }]);
        });


        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
            });
        })

    });


})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}

To make it easier, here are the functions that are used in the smart contracts:
