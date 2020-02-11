import React,{Component} from 'react';
import dConfessContract from "./dConfess.json";
import getWeb3 from './getWeb3';
import './App.css';
import { render } from 'react-dom';

let no_of_confessions=0;
class App extends Component
{
	constructor(props)
	{
		super(props);
		this.state={
		web3 : null,
		account: null,
		contract : null,
		confession: ''
		}
	}
	componentDidMount = async () => 
	{
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();
			console.log(web3)
			// Get the contract instance.
			const accounts = await web3.eth.getAccounts();
			console.log(accounts[0]);
			
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = dConfessContract.networks[networkId];
			const contract= new web3.eth.Contract(dConfessContract.abi,deployedNetwork && deployedNetwork.address);
			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			const account = await contract.methods.getAddress().call();
			this.setState({ web3, account ,contract: contract });
			
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
			`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
  	};
	getAccount = async()=>{
		const web3 = this.state.web3;
		const accounts = await web3.eth.getAccounts();
		console.log(accounts[0]);
		this.setState({account:accounts[0]});
	};

	getCount = async()=>{
		//await this.getAccount();
		const contract = this.state.contract;
		const account = this.state.account; 
		const totalConfessions =  await contract.methods.getAddressCount(account).call();
		console.log("totalconfessions : ",totalConfessions);
		no_of_confessions=totalConfessions;
	};

	handleConfessionChange=(e)=>{
		this.setState({ confession: e.target.value });
	};

	handleConfessionSubmit = async()=>{
		const contract = this.state.contract;
		const account = this.state.account; 
		const confess = this.state.confession;
		await contract.methods.set(confess).send({from:account}).then((e)=>{console.log('confession sent',e)}) ;
	}

	getAllConfessions = async()=>{
		//await this.getAccount();
		const contract = this.state.contract;
		const account = this.state.account; 
		var confess = '';
		//await this.getCount();
		if(no_of_confessions==0)
		{
			window.alert("Confess first!!!!!");
		}
		else
		{
			for(let i=0;i<no_of_confessions;i++)
			{
				confess = await contract.methods.getConfession(account,i).call();
				console.log('confession :',(i+1),confess); 
			}
			
		}
	};
	render()
	{	
		console.log('web3: -->',this.state.web3);
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (	
			<div className ="wrapper">
			<form className="paper">
			 
			<textarea placeholder="Express your feelings here." value={this.state.confession} className="text" name="confession" rows="4"  onChange={this.handleConfessionChange} ></textarea>
			
			<br></br>
			<br></br>
			<br></br>
	        <div className="down"></div>
			<button type="button" className="glow-on-hover"  onClick={this.handleConfessionSubmit}>Confess</button>
			<div className="divider"></div>
			<button type="button" className="glow-on-hover"  onClick={this.getAccount}>GetAccount</button>
			<br></br>
			<br></br>
			<div className="down"></div>
			<button type="button" className="glow-on-hover"  onClick={this.getCount}>Total Confessions</button>
			<div className="divider"></div>
			<button type="button"  className="glow-on-hover" onClick={this.getAllConfessions}>Show Confessions</button>
			</form>
			</div>
           
			 
			);

	}
}

export default App;
