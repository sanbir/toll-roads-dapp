import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import RegulatorContract from '../../../build/contracts/Regulator.json';
import getWeb3 from '../../utils/getWeb3'

export class RegulatorPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.setVehicleType = this.setVehicleType.bind(this);
        this.updateVehicleState = this.updateVehicleState.bind(this);

        this.createNewOperator = this.createNewOperator.bind(this);
        this.updateOperatorState = this.updateOperatorState.bind(this);

        this.state = {
            vehicle: {
                address: "",
                type: ""
            },
            operator: {
                owner: "",
                deposit: ""
            }
        };

        let self = this;
        getWeb3.then(results => {
            self.web3 = results.web3;
        })
        .catch(() => {
            console.log('Error finding web3.')
        });


    }



    setVehicleType() {
        const contract = require('truffle-contract')
        const regulator = contract(RegulatorContract)
        regulator.setProvider(this.web3.currentProvider)


        let regulatorInstance

        // Get accounts.
        this.web3.eth.getAccounts((error, accounts) => {
            regulator.deployed().then((instance) => {
                regulatorInstance = instance

                // Stores a given value, 5 by default.
                return regulatorInstance.setVehicleType(this.state.vehicle.address, this.state.vehicle.type, {from: accounts[0]})
            })
                .then(() => {
                    return regulatorInstance.getVehicleType(this.state.vehicle.address);
                })
                .then(alert);

        })
    }

    createNewOperator() {
        const contract = require('truffle-contract')
        const regulator = contract(RegulatorContract)
        regulator.setProvider(this.web3.currentProvider)


        let regulatorInstance;

        // Get accounts.
        this.web3.eth.getAccounts((error, accounts) => {
            regulator.deployed().then((instance) => {
                regulatorInstance = instance;
                console.log(this.state);
                return regulatorInstance.createNewOperator(this.state.operator.owner, this.state.operator.deposit, {from: accounts[0]})
            })
                //.catch(console.log)
                .then(tx => {
                    //const log = tx.logs[0];

                    return JSON.stringify(tx);//log.args;
                })
                .then(alert);

        })
    }

    updateVehicleState(event) {
        const field = event.target.name;
        let vehicle = this.state.vehicle;
        vehicle[field] = event.target.value;
        return this.setState({vehicle});
    }

    updateOperatorState(event) {
        const field = event.target.name;
        let operator = this.state.operator;
        operator[field] = event.target.value;
        return this.setState({operator});
    }

    render() {
        return (
            <div>
                <h1>Regulator</h1>

                <hr></hr>

                <div className="container">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a  href="#1" data-toggle="tab">Set vehicle type</a>
                        </li>
                        <li>
                            <a href="#2" data-toggle="tab">Create a new Toll Booth Operator</a>
                        </li>
                    </ul>

                    <div className="tab-content ">
                        <div className="tab-pane active" id="1">
                            <br/>
                            <div>
                                <TextInput
                                    name="address"
                                    label="Vehicle"
                                    value={this.state.vehicle.address}
                                    onChange={this.updateVehicleState}/>
                                <TextInput
                                    name="type"
                                    label="Vehicle Type"
                                    value={this.state.vehicle.type}
                                    onChange={this.updateVehicleState}/>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.setVehicleType}>Set vehicle type</button>
                            </div>
                        </div>
                        <div className="tab-pane" id="2">
                            <br/>
                            <div>
                                <TextInput
                                    name="owner"
                                    label="Owner"
                                    value={this.state.operator.owner}
                                    onChange={this.updateOperatorState}/>
                                <TextInput
                                    name="deposit"
                                    label="Deposit"
                                    value={this.state.operator.deposit}
                                    onChange={this.updateOperatorState}/>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.createNewOperator}>Create New Operator</button>
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
RegulatorPage.contextTypes = {
    router: PropTypes.object
};

export default RegulatorPage
