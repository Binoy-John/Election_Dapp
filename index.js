import { get_index_in_list,generate_proof_list_index,generate_merkle_list,generate_proof_list } from "./helpful_scripts.js";

var address="0xa8F004F122CdBb52D4f4F6EB0C6FdD0DB0F925a9";
var abi=[
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "parties",
				"type": "string[]"
			}
		],
		"name": "add_party_list",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "proof",
				"type": "bytes32[]"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "party_voted_name",
				"type": "string"
			}
		],
		"name": "cast_vote",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "end_election",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "start_election",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "election_state",
		"outputs": [
			{
				"internalType": "enum Merkle_Voter_Dapp_Contract_Final.ELECTION_STATUS",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "election_winner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get_winner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "voter_address",
				"type": "address"
			}
		],
		"name": "has_not_voted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "has_voted_map",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "has_winner_been_calculated",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "proof",
				"type": "bytes32[]"
			},
			{
				"internalType": "address",
				"name": "leaf",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "merkle_verify",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "parties_name_list",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "party_vote_counter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "return_election_status",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
var contract;
var account;

var eligible_voters_list = [
    "0x9AEa174491c2ecF7920021CE4252270777810ee8",
    "0xeaFD278a44E3D76244BFda14164e4371A3Ca0329",
    "0xc3c33568AB77Af2898B08F28B938d8BB2D0883eB",
    "0x0067Ed6447B37cB766c6FCD1552aA19D797e7cE8",
    "0x805DbCc006852B0367b3a6934eD1FA15F9b0141B",
    "0x660Ab258CD362D7F2FCdb86fca968c2B9ABc26D1",
    "0x0F2573c1E3fC651a8D2aA1Cb511f873Cc847D1F1",
    "0x4FBB76eA44bF7841740c12c25e476CD0c83b6Db7",
    "0xDa865289762B93D3AF38c0746f3995FC22f75a18",
    "0x2dB3216E355a5e4636C8F6604647d7Dc0CbB6BC7",
]

async function has_election_ended(contract){
	//logic to call the has_winner_been_calculated() function from the contract and return boolean
	var election_end_or_not = await contract.methods.has_winner_been_calculated().call();
	return election_end_or_not;

}

async function has_not_voted(contract, account){
	//logic to call the has_not_voted() function from the contract and return boolean
	var has_not_voted_or_not = await contract.methods.has_not_voted(account).call();
	console.log(has_not_voted_or_not);
	return (has_not_voted_or_not);
	
}

async function get_election_winner(contract){
	var election_winner = await contract.methods.get_winner().call();
	console.log(election_winner);
	return election_winner;

}

async function get_election_status(contract){
	var election_status = await contract.methods.return_election_status().call();
	
	return election_status;
}


$(document).ready(async function(){
    console.log("Document is ready!");
    web3 = new Web3(window.web3.currentProvider);
    contract =new web3.eth.Contract(abi,address);
    var accounts = await web3.eth.requestAccounts();
	account = accounts[0];

    //console.log(accounts[0]);
    $("#your_address").html("Your injected public address for casting vote is : "+accounts[0]);
	//logic to print if the injected address has voted

	$("#election_status").html("The election status is : "+ await get_election_status(contract));
	

	if(await has_not_voted(contract,accounts[0])){
		$("#voted_status").html("It seems you havent voted yet....");
	}
	else{
		$("#voted_status").html("It looks like you have already voted!");
	}


})

$("#submit_vote").click(async function(){
    console.log("submit vote button click detected");
	var vote_choice = $("#vote_input").val();
	console.log("option chosen is "+ vote_choice);
	var current_election_status = await get_election_status(contract);
	console.log("current election status is "+current_election_status);
	if(current_election_status == '<b>NOT STARTED</b>')
	{
		$("#voted_status").html("The election has not started yet!");

	}
	else
	{
		// logic to call the cast_vote() function from the contract
		// from the returned value from the contract, modify the voted_status html id to whether the vote has been cast successfully or not
		var merkle_list = generate_merkle_list(eligible_voters_list);
		console.log("merkle list is "+merkle_list);
		var index = get_index_in_list(eligible_voters_list,account);
		console.log("index is "+index);
		if(index ==-1)
		{
			index=0;
		}
		var proof_list_index = generate_proof_list_index(eligible_voters_list.length,index);
		console.log("proof list index is "+proof_list_index);
		var proof_list = generate_proof_list(proof_list_index,merkle_list);
		console.log("proof list is "+proof_list);
		var cast_vote_contract_status = await contract.methods.cast_vote(proof_list,index,vote_choice).send({from: account});
		console.log("vote status is returned as "+JSON.stringify(cast_vote_contract_status));
		console.log((cast_vote_contract_status.outputs));
		var vote_status = await has_not_voted(contract,account)
		if(vote_status == false)
		{
			$("#voted_status").html("Your vote has be sumbitted successfully!")
		}
		else{
			$("#voted_status").html("We were unable to register your vote.");
		}
		console.log(vote_status);
	}
	
})

$("#get_result").click(async function(){
    console.log("get result button click detected");
	var status = await get_election_status(contract);
	console.log(status);
	if(status == "<b>ENDED</b>")
	{
		$("#election_winner").html("The winner of the election is : <b>"+await get_election_winner(contract)+"</b>");
	}
	else{
		$("#election_winner").html("The election has not ended yet. Please wait for the election to end and press the button again!");
	}

})
