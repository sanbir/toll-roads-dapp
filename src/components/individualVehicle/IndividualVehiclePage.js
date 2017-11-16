import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TollBoothOperatorContract from '../../../build/contracts/TollBoothOperator.json';
import getWeb3 from '../../utils/getWeb3'

export class IndividualVehiclePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.addTollBooth = this.addTollBooth.bind(this);
        this.updateTollBoothState = this.updateTollBoothState.bind(this);

        this.state = {
            balance: ""
        };

        let self = this;
        getWeb3.then(results => {
            self.web3 = results.web3;
        })
            .catch(() => {
                console.log('Error finding web3.')
            });

    }

    addTollBooth() {
        const contract = require('truffle-contract');
        const tollBoothOperator = contract(TollBoothOperatorContract);
        tollBoothOperator.setProvider(this.web3.currentProvider);

        let tollBoothOperatorInstance;

        this.web3.eth.getAccounts((error, accounts) => {
            tollBoothOperator.at(this.state.operator.contract).then((instance) => {
                tollBoothOperatorInstance = instance;
                return tollBoothOperatorInstance.addTollBooth(this.state.tollBooth.address, {from: this.state.operator.owner});
            })
                .then(tx => {
                    const log = tx.logs[0];
                    return JSON.stringify(log.args);
                })
                .then(alert);
        })
    }

    updateTollBoothState(event) {
        const field = event.target.name;
        let tollBooth = this.state.tollBooth;
        tollBooth[field] = event.target.value;
        return this.setState({tollBooth});
    }

    getBalance() {

    }


    render() {
        return (
            <div>
                <h1>Individual Vehicle</h1>

                <hr></hr>
                
                <div className="container">
                    <label>Basic Ether balance: {this.state.balance}</label>
                    <button
                        className="btn btn-primary"
                        onClick={this.getBalance}>Refresh</button>
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
