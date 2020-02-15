import React,{Component} from 'react';
import dConfessContract from "./dConfess.json";
import getWeb3 from './getWeb3';
import './App.css';
import { render } from 'react-dom';

let no_of_confessions=0;
let which_page = false;
let element ;

class App extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
		web3 : null,
		account: null,
		accounts: null,
		contract : null,
		confession: '',
		all_confessions:[],
		}
	}
	componentDidMount = async () => 
	{
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();
			//console.log(web3)
			// Get the contract instance.
			const accounts = await web3.eth.getAccounts();
			// console.log(accounts[0]);
			
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = dConfessContract.networks[networkId];
			const instance = new web3.eth.Contract(dConfessContract.abi, deployedNetwork.address);
			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			// const account = await contract.methods.getAddress().call();console.log("j "+account);
			console.log(deployedNetwork)
			// console.log(instance);
			this.setState({
				web3,
				accounts,
				contract: instance
			});
			this.setState({account:accounts[0]})
			
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
		await this.getAccount();
		const contract = this.state.contract;
		const account = this.state.account; 
		const totalConfessions =  await contract.methods.getAddressCount(account).call();
		console.log("totalconfessions : ",totalConfessions);
		no_of_confessions=totalConfessions;
	};
	ChangePage =(e)=>
	{
	which_page=true
	window.location='http://localhost:3000/'
	}
	handleConfessionChange=(e)=>{
		this.setState({ confession: e.target.value });
	};

	handleConfessionSubmit = async()=>{
		const contract = this.state.contract;
		const account = this.state.account; 
		const confess = this.state.confession;
		await contract.methods.set(confess).send({
			from: account
		}).then((e) => {
			console.log('confession sent', e)
		});
	}

	getAllConfessions = async()=>{
		which_page = true; 
		await this.getAccount();
		const contract = this.state.contract;
		const account = this.state.account; 
		var confess = '';
		await this.getCount();
		if(no_of_confessions==0)
		{
			window.alert("Confess first!!!!!");
		}
		else
		{
			for(let i=0;i<no_of_confessions;i++)
			{
				confess = await contract.methods.getConfession(account,i).call();
				this.setState({confession:confess})
				console.log('confession :',(i+1),confess); 
				let joined = this.state.all_confessions.concat(<div class="grid-item"><b>{this.state.confession}</b></div>)
				this.setState({all_confessions:joined})
				joined = this.state.all_confessions.concat(<div><br></br><br></br></div>)
				this.setState({all_confessions:joined})
			}
			
		}
		
		
	};

	render()
	{	
		
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		else if(which_page===false)
		{
			return (
				<center>
				<div className ="wrapper">
				<form className="paper">
				<h1 class="title"><i>Confessions</i></h1>
				<br></br>
				<br></br>
				<br></br>
				<br></br>
				<textarea placeholder="Express your feelings here" value={this.state.confession} className="text" name="confession" rows="4"  onChange={this.handleConfessionChange} ></textarea>
				
				<br></br>
				<br></br>
				<br></br>
				<div className="down"></div>
				<button type="button" className="glow-on-hover"  onClick={this.handleConfessionSubmit}>Confess</button>
				
				
				<br></br>
				<br></br>
				
				
				
				<button type="button"  className="glow-on-hover" onClick={this.getAllConfessions}>Show Confessions</button>
				</form>
				</div>
				</center>
			
			
			);
		}
		else
		{
			return (
			<div>
			<div className="grid-container">{this.state.all_confessions}</div>
			<center><button type="button"  className="glow-on-hover" onClick={this.ChangePage}>Confess Again!</button>
			</center>
			</div>	
			);

		}

	}
}

export default App;
