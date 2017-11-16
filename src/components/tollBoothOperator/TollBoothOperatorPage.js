import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TollBoothOperatorContract from '../../../build/contracts/TollBoothOperator.json';
import getWeb3 from '../../utils/getWeb3'

export class TollBoothOperatorPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.addTollBooth = this.addTollBooth.bind(this);
        this.updateTollBoothState = this.updateTollBoothState.bind(this);

        this.setRoutePrice = this.setRoutePrice.bind(this);
        this.updateRoutePriceState = this.updateRoutePriceState.bind(this);

        this.state = {
            tollBooth: {
                address: "",
                operatorOwner: "",
                operatorContract: ""
            },
            routePrice: {
                entryBooth: "",
                exitBooth: "",
                priceWeis: "",
                operatorOwner: "",
                operatorContract: ""
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

    addTollBooth() {
        const contract = require('truffle-contract');
        const tollBoothOperator = contract(TollBoothOperatorContract);
        tollBoothOperator.setProvider(this.web3.currentProvider);

        let tollBoothOperatorInstance;

        this.web3.eth.getAccounts((error, accounts) => {
            tollBoothOperator.at(this.state.tollBooth.operatorContract).then((instance) => {
                tollBoothOperatorInstance = instance;
                return tollBoothOperatorInstance.addTollBooth(this.state.tollBooth.address, {from: this.state.tollBooth.operatorOwner});
            })
            .then(tx => {
                const log = tx.logs[0];
                return JSON.stringify(log.args);
            })
            .then(alert);
        })
    }

    setRoutePrice() {
        const contract = require('truffle-contract');
        const tollBoothOperator = contract(TollBoothOperatorContract);
        tollBoothOperator.setProvider(this.web3.currentProvider);

        let tollBoothOperatorInstance;

        this.web3.eth.getAccounts((error, accounts) => {
            tollBoothOperator.at(this.state.routePrice.operatorContract).then((instance) => {
                tollBoothOperatorInstance = instance;
                return tollBoothOperatorInstance.setRoutePrice(
                    this.state.routePrice.entryBooth,
                    this.state.routePrice.exitBooth,
                    this.state.routePrice.priceWeis,
                    {from: this.state.routePrice.operatorOwner});
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

    updateRoutePriceState(event) {
        const field = event.target.name;
        let routePrice = this.state.routePrice;
        routePrice[field] = event.target.value;
        return this.setState({routePrice});
    }

    render() {
        return (
            <div>
                <h1>Toll Booth Operator</h1>

                <hr></hr>

                <div className="container">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a  href="#1" data-toggle="tab">Add a toll booth</a>
                        </li>
                        <li>
                            <a href="#2" data-toggle="tab">Add base route prices</a>
                        </li>
                    </ul>

                    <div className="tab-content ">
                        <div className="tab-pane active" id="1">
                            <br/>
                            <div>
                                <TextInput
                                    name="address"
                                    label="Toll Booth address"
                                    value={this.state.tollBooth.address}
                                    onChange={this.updateTollBoothState}/>
                                <TextInput
                                    name="operatorOwner"
                                    label="Toll Booth Operator owner address"
                                    value={this.state.tollBooth.operatorOwner}
                                    onChange={this.updateTollBoothState}/>
                                <TextInput
                                    name="operatorContract"
                                    label="Toll Booth Operator contract address"
                                    value={this.state.tollBooth.operatorContract}
                                    onChange={this.updateTollBoothState}/>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.addTollBooth}>Add a Toll Booth</button>
                            </div>
                        </div>
                        <div className="tab-pane" id="2">
                            <br/>
                            <div>
                                <TextInput
                                    name="entryBooth"
                                    label="Entry Booth address"
                                    value={this.state.routePrice.entryBooth}
                                    onChange={this.updateRoutePriceState}/>
                                <TextInput
                                    name="exitBooth"
                                    label="Exit Booth address"
                                    value={this.state.routePrice.exitBooth}
                                    onChange={this.updateRoutePriceState}/>
                                <TextInput
                                    name="priceWeis"
                                    label="Price (in Weis)"
                                    value={this.state.routePrice.priceWeis}
                                    onChange={this.updateRoutePriceState}/>
                                <TextInput
                                    name="operatorOwner"
                                    label="Toll Booth Operator owner address"
                                    value={this.state.routePrice.operatorOwner}
                                    onChange={this.updateRoutePriceState}/>
                                <TextInput
                                    name="operatorContract"
                                    label="Toll Booth Operator contract address"
                                    value={this.state.routePrice.operatorContract}
                                    onChange={this.updateRoutePriceState}/>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.setRoutePrice}>Set Route Price</button>
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
TollBoothOperatorPage.contextTypes = {
    router: PropTypes.object
};

export default TollBoothOperatorPage
