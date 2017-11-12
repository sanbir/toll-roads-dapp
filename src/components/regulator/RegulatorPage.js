import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import RegulatorContract from '../../../build/contracts/Regulator.json';
import getWeb3 from '../../utils/getWeb3'

export class RegulatorPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.setVehicleType = this.setVehicleType.bind(this);
        this.updateVehicleState = this.updateVehicleState.bind(this);

        this.state = {
            vehicle: {
                address: "",
                type: ""
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

    updateVehicleState(event) {
        const field = event.target.name;
        let vehicle = this.state.vehicle;
        vehicle[field] = event.target.value;
        return this.setState({vehicle});
    }

    render() {
        return (
            <div>
                <h1>Regulator</h1>
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
        );
    }
}

//Pull in the React Router context so router is available on this.context.router.
RegulatorPage.contextTypes = {
    router: PropTypes.object
};

export default RegulatorPage
