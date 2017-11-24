import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TollBoothOperatorContract from '../../../build/contracts/TollBoothOperator.json';
import getWeb3 from '../../utils/getWeb3'

export class IndividualVehiclePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.getBalance = this.getBalance.bind(this);
        this.updateVehicleState = this.updateVehicleState.bind(this);
        this.enterRoad = this.enterRoad.bind(this);
        this.updateEnterRoadState = this.updateEnterRoadState.bind(this);
        this.showHistory = this.showHistory.bind(this);
        this.updateTollBoothOperatorContractAddress = this.updateTollBoothOperatorContractAddress.bind(this);

        this.state = {
            tollBoothOperatorContractAddress: "",
            vehicle: {
                address: "",
                balance: ""
            },
            enterRoad: {
                entryBooth: "",
                secret: "",
                depositedWeis: ""
            },
            historyEntries: []
        };

        let self = this;
        getWeb3.then(results => {
            self.web3 = results.web3;

            const contract = require('truffle-contract');
            self.tollBoothOperator = contract(TollBoothOperatorContract);
            self.tollBoothOperator.setProvider(self.web3.currentProvider);
        })
        .catch(() => {
            console.log('Error finding web3.')
        });

    }

    enterRoad() {
        let tollBoothOperatorInstance;

        this.tollBoothOperator.at(this.state.tollBoothOperatorContractAddress)
        .then(instance => {
            tollBoothOperatorInstance = instance;
            return tollBoothOperatorInstance.hashSecret(this.state.enterRoad.secret);
        })
        .then(exitSecretHashed => {
            let depositedWeis = parseInt(this.web3.toWei(this.state.enterRoad.depositedWeis, "ether"));

            return tollBoothOperatorInstance.enterRoad(this.state.enterRoad.entryBooth, exitSecretHashed, {
                from: this.state.vehicle.address,
                value: depositedWeis,
                gas: 3600000});
        })
        .then(tx => {
            const log = tx.logs[0];
            return JSON.stringify(log.args);
        })
        .then(alert);
    }

    updateVehicleState(event) {
        const field = event.target.name;
        let vehicle = this.state.vehicle;
        vehicle[field] = event.target.value;
        return this.setState({vehicle});
    }

    updateTollBoothOperatorContractAddress(event) {
        this.state["tollBoothOperatorContractAddress"] = event.target.value;
        return this.setState(this.state);
    }

    updateEnterRoadState(event) {
        const field = event.target.name;
        let enterRoad = this.state.enterRoad;
        enterRoad[field] = event.target.value;
        return this.setState({enterRoad});
    }

    getBalance() {
        let self = this;
        this.web3.eth.getBalance(this.state.vehicle.address, function (error, result) {
            self.state.vehicle.balance = self.web3.fromWei(result, 'ether').toString();
            self.setState(self.state.vehicle);
        })
    }

    showHistory() {
        this.state.historyEntries = [];
        
        this.tollBoothOperator.at(this.state.tollBoothOperatorContractAddress)
            .then(tollBoothOperatorInstance => {

                let logRoadEnteredEvent = tollBoothOperatorInstance.LogRoadEntered({vehicle: this.state.vehicle.address}, {fromBlock: 0, toBlock: 'latest'});

                logRoadEnteredEvent.get((error, logs) => {
                    logs.forEach(log => {
                        console.log(log.args);

                        let exitSecretHashed = log.args.exitSecretHashed;

                        let historyEntry = {
                            entryBooth: log.args.entryBooth,
                            exitBooth: "",
                            depositedWeis: log.args.depositedWeis,
                            finalFee: "",
                            refundWeis: ""
                        };

                        let logRoadExitedEvent = tollBoothOperatorInstance.LogRoadExited({exitSecretHashed: exitSecretHashed}, {fromBlock: 0, toBlock: 'latest'});

                        logRoadExitedEvent.get((error, logs) => {
                            if (logs.length) {
                                historyEntry.exitBooth = logs[0].args.exitBooth;
                                historyEntry.finalFee = logs[0].args.finalFee;
                                historyEntry.refundWeis = logs[0].args.refundWeis;

                                this.state.historyEntries.push(historyEntry);
                                this.setState(this.state.historyEntries);
                            } else {
                                let logPendingPaymentEvent = tollBoothOperatorInstance.LogPendingPayment({exitSecretHashed: exitSecretHashed}, {fromBlock: 0, toBlock: 'latest'});

                                logPendingPaymentEvent.get((error, logs) => {
                                    if (logs.length) {
                                        historyEntry.exitBooth = logs[0].args.exitBooth;
                                    }

                                    this.state.historyEntries.push(historyEntry);
                                    this.setState(this.state.historyEntries);
                                });
                            }
                        });

                    });

                });

            });
    }


    render() {
        return (
            <div>
                <h1>Individual Vehicle</h1>

                <hr></hr>

                <div className="container">
                    <TextInput
                        name="tollBoothOperatorContractAddress"
                        label="Toll Booth Operator contract address"
                        value={this.state.tollBoothOperatorContractAddress}
                        onChange={this.updateTollBoothOperatorContractAddress}/>
                    <TextInput
                        name="address"
                        label="Vehicle address"
                        value={this.state.vehicle.address}
                        onChange={this.updateVehicleState}/>
                    <button
                        className="btn btn-primary"
                        onClick={this.getBalance}>Show vehicle balance</button>
                </div>
                <br/>
                <div className="container">
                    <label>Basic Ether balance: {this.state.vehicle.balance}</label>
                </div>

                <div className="container">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#1" data-toggle="tab">Make an entry deposit</a>
                        </li>
                        <li>
                            <a href="#2" data-toggle="tab">History of entry / exit</a>
                        </li>
                    </ul>

                    <div className="tab-content ">
                        <div className="tab-pane active" id="1">
                            <br/>
                            <div>
                                <TextInput
                                    name="entryBooth"
                                    label="Entry Booth"
                                    value={this.state.enterRoad.entryBooth}
                                    onChange={this.updateEnterRoadState}/>
                                <TextInput
                                    name="secret"
                                    label="Secret"
                                    value={this.state.enterRoad.secret}
                                    onChange={this.updateEnterRoadState}/>
                                <TextInput
                                    name="depositedWeis"
                                    label="Ether to deposit"
                                    value={this.state.enterRoad.depositedWeis}
                                    onChange={this.updateEnterRoadState}/>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.enterRoad}>Enter Road</button>
                            </div>
                        </div>
                        <div className="tab-pane" id="2">
                            <br/>
                            <div>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.showHistory}>Show history</button>

                                <br/>
                                <table className={"table"} style={{display: this.state.historyEntries.length ? '' : 'none'}}>
                                    <thead>
                                        <tr>
                                            <th>Entry Booth</th>
                                            <th>Exit Booth</th>
                                            <th>Deposit (Ether)</th>
                                            <th>Final Fee (Ether)</th>
                                            <th>Refund (Ether)</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.historyEntries.map(entry =>
                                            <tr>
                                                <td>{entry.entryBooth}</td>
                                                <td>{entry.exitBooth}</td>
                                                <td>{entry.depositedWeis ? this.web3.fromWei(entry.depositedWeis, 'ether').toString() : ""}</td>
                                                <td>{entry.finalFee ? this.web3.fromWei(entry.finalFee, 'ether').toString() : ""}</td>
                                                <td>{entry.refundWeis ? this.web3.fromWei(entry.refundWeis, 'ether').toString() : ""}</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <hr></hr>


            </div>
        );
    }
}

//Pull in the React Router context so router is available on this.context.router.
IndividualVehiclePage.contextTypes = {
    router: PropTypes.object
};

export default IndividualVehiclePage
