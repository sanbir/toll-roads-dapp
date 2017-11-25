import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TollBoothOperatorContract from '../../../build/contracts/TollBoothOperator.json';
import getWeb3 from '../../utils/getWeb3'

export class IndividualTollBoothPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.update = this.update.bind(this);
        this.reportExitRoad = this.reportExitRoad.bind(this);

        this.state = {
            tollBoothOperatorContractAddress: "",
            tollBoothAddress: "",
            exitSecretClear: "",
            status: ""
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

    update(event) {
        const field = event.target.name;
        this.state[field] = event.target.value;
        return this.setState(this.state);
    }

    reportExitRoad() {
        this.tollBoothOperator.at(this.state.tollBoothOperatorContractAddress)
            .then(tollBoothOperatorInstance => {
                return tollBoothOperatorInstance.reportExitRoad(this.state.exitSecretClear, {
                    from: this.state.tollBoothAddress,
                    gas: 3600000});
            })
            .then(tx => {
                const log = tx.logs[0];
                this.state.status = log.event == "LogPendingPayment"
                    ? "The payment is pending"
                    : log.event == "LogRoadExited"
                        ? "The refund has completed"
                        : "An error has occurred";
                this.setState(this.state);
                return JSON.stringify(log.args);
            })
            .then(alert);
    }

    render() {
        return (
            <div>
                <h1>Individual Toll Booth</h1>

                <hr></hr>

                <div className="container">
                    <TextInput
                        name="tollBoothOperatorContractAddress"
                        label="Toll Booth Operator contract address"
                        value={this.state.tollBoothOperatorContractAddress}
                        onChange={this.update}/>
                    <TextInput
                        name="tollBoothAddress"
                        label="Toll Booth address"
                        value={this.state.tollBoothAddress}
                        onChange={this.update}/>
                    <TextInput
                        name="exitSecretClear"
                        label="Secret"
                        value={this.state.exitSecretClear}
                        onChange={this.update}/>
                    <button
                        className="btn btn-primary"
                        onClick={this.reportExitRoad}>Report a vehicle exit</button>
                    <br/>
                    <label style={{display: this.state.status ? '' : 'none'}}>{this.state.status}</label>
                </div>


                <hr></hr>

            </div>
        );
    }
}

IndividualTollBoothPage.contextTypes = {
    router: PropTypes.object
};

export default IndividualTollBoothPage
