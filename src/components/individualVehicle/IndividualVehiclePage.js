import React, {PropTypes} from 'react';
import TextInput from '../common/TextInput';
import TollBoothOperatorContract from '../../../build/contracts/TollBoothOperator.json';
import getWeb3 from '../../utils/getWeb3'

export class IndividualVehiclePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.getBalance = this.getBalance.bind(this);
        this.updateVehicleState = this.updateVehicleState.bind(this);

        this.state = {
            vehicle: {
                address: "",
                balance: ""
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

    updateVehicleState(event) {
        const field = event.target.name;
        let vehicle = this.state.vehicle;
        vehicle[field] = event.target.value;
        return this.setState({vehicle});
    }

    getBalance() {
        let self = this;
        this.web3.eth.getBalance(this.state.vehicle.address, function (error, result) {
            self.state.vehicle.balance = self.web3.fromWei(result, 'ether').toString();
            self.setState(self.state.vehicle);
        })
    }


    render() {
        return (
            <div>
                <h1>Individual Vehicle</h1>

                <hr></hr>

                <div className="container">
                    <TextInput
                        name="address"
                        label="Vehicle address"
                        value={this.state.vehicle.address}
                        onChange={this.updateVehicleState}/>
                    <button
                        className="btn btn-primary"
                        onClick={this.getBalance}>Refresh</button>
                </div>
                <br/>
                <div className="container">
                    <label>Basic Ether balance: {this.state.vehicle.balance}</label>
                </div>

                {/*<div className="container">*/}
                    {/*<ul className="nav nav-tabs">*/}
                        {/*<li className="active">*/}
                            {/*<a  href="#1" data-toggle="tab">Get basic Ether balance</a>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                            {/*<a href="#2" data-toggle="tab">Make an entry deposit</a>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                            {/*<a href="#3" data-toggle="tab">History of entry / exit</a>*/}
                        {/*</li>*/}
                    {/*</ul>*/}

                    {/*<div className="tab-content ">*/}
                        {/*<div className="tab-pane active" id="1">*/}
                            {/*<br/>*/}
                            {/*<div>*/}
                                {/*<TextInput*/}
                                    {/*name="address"*/}
                                    {/*label="Toll Booth address"*/}
                                    {/*value={this.state.tollBooth.address}*/}
                                    {/*onChange={this.updateTollBoothState}/>*/}
                                {/*<button*/}
                                    {/*className="btn btn-primary"*/}
                                    {/*onClick={this.addTollBooth}>Add a Toll Booth</button>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="tab-pane" id="2">*/}
                            {/*<br/>*/}
                            {/*<div>*/}
                                {/*<TextInput*/}
                                    {/*name="entryBooth"*/}
                                    {/*label="Entry Booth address"*/}
                                    {/*value={this.state.routePrice.entryBooth}*/}
                                    {/*onChange={this.updateRoutePriceState}/>*/}
                                {/*<TextInput*/}
                                    {/*name="exitBooth"*/}
                                    {/*label="Exit Booth address"*/}
                                    {/*value={this.state.routePrice.exitBooth}*/}
                                    {/*onChange={this.updateRoutePriceState}/>*/}
                                {/*<TextInput*/}
                                    {/*name="priceWeis"*/}
                                    {/*label="Price (in Weis)"*/}
                                    {/*value={this.state.routePrice.priceWeis}*/}
                                    {/*onChange={this.updateRoutePriceState}/>*/}
                                {/*<button*/}
                                    {/*className="btn btn-primary"*/}
                                    {/*onClick={this.setRoutePrice}>Set Route Price</button>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="tab-pane" id="3">*/}
                            {/*<br/>*/}
                            {/*<div>*/}
                                {/*<TextInput*/}
                                    {/*name="vehicleType"*/}
                                    {/*label="Vehicle Type"*/}
                                    {/*value={this.state.multiplierStruct.vehicleType}*/}
                                    {/*onChange={this.updateMultiplierState}/>*/}
                                {/*<TextInput*/}
                                    {/*name="multiplier"*/}
                                    {/*label="Multiplier"*/}
                                    {/*value={this.state.multiplierStruct.multiplier}*/}
                                    {/*onChange={this.updateMultiplierState}/>*/}
                                {/*<button*/}
                                    {/*className="btn btn-primary"*/}
                                    {/*onClick={this.setMultiplier}>Set Multiplier</button>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

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
