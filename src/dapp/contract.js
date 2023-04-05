import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            this.owner = accts[0];

            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    async purchaseInsurance(airlineAddress, flightNumber, insuranceAmount) {
        let self = this;
        let amountInWei = this.web3.utils.toWei(insuranceAmount, "ether");

        try {
            await self.flightSuretyApp.methods
                .buyInsurance(airlineAddress, flightNumber)
                .send({ from: self.passengers[0], value: amountInWei });
            alert("Insurance purchased successfully.");
        } catch (error) {
            console.log(error);
            alert("Failed to purchase insurance.");
        }
    }

    async registerAirline(newAirlineAddress) {
        let self = this;

        try {
            await self.flightSuretyApp.methods
                .registerAirline(newAirlineAddress)
                .send({ from: self.owner });
            alert("New airline registered successfully.");
        } catch (error) {
            console.log(error);
            alert("Failed to register new airline.");
        }
    }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }

    async withdrawFunds() {
        let self = this;

        try {
            await self.flightSuretyApp.methods
                .withdraw()
                .send({ from: self.passengers[0] });
            alert("Funds withdrawn successfully.");
        } catch (error) {
            console.log(error);
            alert("Failed to withdraw funds.");
        }
    }
}
