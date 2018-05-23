document.write(`
<div id="geode_qty_modal" class="overlay">
	<a class="cancel" href="#"></a>
	<div class="modal">
		<h3>Buying Geodes</h3>
		<div class="content">
			<select id="NumberOfGeodes" name="NumberOfGeodes" title="Number of Geodes" style="width: 100%; height: 2em; margin: 1em 0 2em 0;">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5 (+1 free Gem)</option>
				<option value="6">6 (+1 free Gem)</option>
				<option value="7">7 (+1 free Gem)</option>
				<option value="8">8 (+1 free Gem)</option>
				<option value="9">9 (+1 free Gem)</option>
				<option value="10">10 (+1 free Gem and +1 free Geode)</option>
			</select>
			<input type="button" value="Buy" onclick="buy()" style="width: 100%; height: 2em;"/>
		</div>
	</div>
</div>
`);


const jQuery3 = jQuery.noConflict();

const con = document.getElementById("console");
const tok = document.getElementById("TokenAddress");
const sale = document.getElementById("SaleAddress");
const geodesNum = document.getElementById("NumberOfGeodes");
const tokAddr = "0xf795fd5c9c9be296997110891b5773181b9968f5";
const saleAddr = "0x00e1b0dd0ae8f12417fe9729787788100c53f69c";

let myWeb3;
let myAccount;
let gemABI;
let saleABI;

function init() {
	if(typeof window.web3 === 'undefined') {
		printError("Web3 is not enabled. Do you need to install MetaMask?");
		return;
	}
	myWeb3 = new Web3(window.web3.currentProvider);
	myWeb3.eth.getAccounts(function(err, accounts) {
		if(err) {
			printError("getAccounts() error: " + err);
			return;
		}
		myAccount = accounts[0];
		if(!myAccount) {
			printError("Cannot access default account. Is MetaMask locked?");
			return;
		}
		printInfo("Web3 integration loaded. Your account is " + myAccount);
		myWeb3.eth.getBalance(myAccount, function(err, balance) {
			if(err) {
				printError("getBalance() error: " + err);
				return;
			}
			if(balance > 0) {
				printInfo("Your balance is " + myWeb3.fromWei(balance, 'ether'));
			}
			else {
				printError("Your balance is zero. You won't be able to send any transaction.");
			}
			jQuery3.ajax({
				async: false,
				global: false,
				url: "abi/GemERC721.json",
				dataType: "json",
				success: function(data, textStatus, jqXHR) {
					printInfo("Gem ABI loaded successfully");
					gemABI = myWeb3.eth.contract(data.abi);
					connect_gem();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery3.ajax({
						async: false,
						global: false,
						url: "https://rawgit.com/vgorin/crypto-miner/master/web/abi/GemERC721.json",
						dataType: "json",
						success: function(data, textStatus, jqXHR) {
							printInfo("Gem ABI loaded successfully");
							gemABI = myWeb3.eth.contract(data.abi);
							connect_gem();
						},
						error: function(jqXHR, textStatus, errorThrown) {
							printError("Cannot load Gem ABI: " + errorThrown);
						}
					});
				}
			});
			jQuery3.ajax({
				async: false,
				global: false,
				url: "abi/GeodeSale.json",
				dataType: "json",
				success: function(data, textStatus, jqXHR) {
					printInfo("GeodeSale ABI loaded successfully");
					saleABI = myWeb3.eth.contract(data.abi);
					connect_sale();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					jQuery3.ajax({
						async: false,
						global: false,
						url: "https://rawgit.com/vgorin/crypto-miner/master/web/abi/GeodeSale.json",
						dataType: "json",
						success: function(data, textStatus, jqXHR) {
							printInfo("GeodeSale ABI loaded successfully");
							saleABI = myWeb3.eth.contract(data.abi);
							connect_sale();
						},
						error: function(jqXHR, textStatus, errorThrown) {
							printError("Cannot load GeodeSale ABI: " + errorThrown);
						}
					});
				}
			});
		})
	});
}

let gemInstance;

function connect_gem() {
	if(!(myWeb3 && gemABI && myAccount)) {
		printError("Web3 is not properly initialized. Reload the page.");
		gemInstance = null;
		return;
	}
	const tokenAddress = tok ? tok.value : tokAddr;
	gemInstance = gemABI.at(tokenAddress);
	try {
		gemInstance.symbol(function(err, symbol) {
			if(err) {
				printError("Error accessing Gem (ERC721 Token) Instance: " + err);
				printError("Check if the address specified points to a valid ERC721 contract");
				gemInstance = null;
				return;
			}
			if("GEM" !== symbol) {
				printError("Error accessing Gem (ERC721 Token) Instance: not a valid instance");
				printError("Check if the address specified points to an ERC721 instance with the symbol = GEM");
				gemInstance = null;
				return;
			}
			printInfo("Successfully connected to Gem (ERC721 Token) Instance at " + tokenAddress);
			const mintEvent = gemInstance.Minted({}, {fromBlock: "latest", toBlock: "latest"});
			mintEvent.watch(function(err, receipt) {
				if(err) {
					printError("Error receiving Minted event: " + err);
					return;
				}
				if(!(receipt && receipt.args && receipt.args._by && receipt.args._to && receipt.args._tokenId)) {
					printError("Minted event received in wrong format: wrong arguments");
					return;
				}
				const by = receipt.args._by;
				const to = receipt.args._to;
				const tokenId = receipt.args._tokenId.toString(16);
				printInfo("Minted(0x" + tokenId + ", " + to + ", " + by + ")");
			});
			printInfo("Successfully registered Minted(uint32, address, address) event listener");
/*
			const burnEvent = gemInstance.Burnt({}, {fromBlock: "latest", toBlock: "latest"});
			burnEvent.watch(function(err, receipt) {
				if(err) {
					printError("Error receiving Burnt event: " + err);
					return;
				}
				if(!(receipt && receipt.args && receipt.args.tokenId && receipt.args.from && receipt.args.by)) {
					printError("Burnt event received in wrong format: wrong arguments");
					return;
				}
				const tokenId = receipt.args.tokenId.toString(16);
				const from = receipt.args.from;
				const by = receipt.args.by;
				printInfo("Burnt(0x" + tokenId + ", " + from + ", " + by + ")");
			});
			printInfo("Successfully registered Burnt(uint80, address, address) event listener");
*/
			const tokenTransferEvent = gemInstance.TokenTransfer({}, {fromBlock: "latest", toBlock: "latest"});
			tokenTransferEvent.watch(function(err, receipt) {
				if(err) {
					printError("Error receiving TokenTransfer event: " + err);
					return;
				}
				if(!(receipt && receipt.args && receipt.args._from && receipt.args._to && receipt.args._tokenId)) {
					printError("TokenTransfer event received in wrong format: wrong arguments");
					return;
				}
				const from = receipt.args._from;
				const to = receipt.args._to;
				const gemId = receipt.args._tokenId.toString(16);
				printInfo("TokenTransfer(" + from + ", " + to + ", 0x" + gemId + ")");
			});
			printInfo("Successfully registered TokenTransfer(address, address, uint32) event listener");
			gemInstance.balanceOf(myAccount, function(err, balance) {
				if(err) {
					printError("Unable to read gem balance: " + err);
					gemInstance = null;
					return;
				}
				if(balance > 0) {
					printInfo("You own " + balance + " gem(s):");
					for(let i = 0; i < balance; i++) {
						gemInstance.getCollection(myAccount, function(err, collection) {
							if(err) {
								printError("Cannot load list of the gems");
								return;
							}
							for(let i = 0; i < collection.length; i++) {
								printInfo("0x" + collection[i].toString(16));
							}

							// ========= START: Draw Gems in a Table =========
							const columns = 8;
							const rows = Math.ceil(collection.length / columns);
							let html = "<table id='myGeodes'>\n";
							for(let i = 0; i < rows; i++) {
								html += "<tr>\n";
								for(let j = 0; j < columns; j++) {
									const idx = i * columns + j;
									if(idx < collection.length) {
										const gemId = "0x" + collection[idx].toString(16);
										html += "\t<td id='" + gemId + "'>\n";
										html += "\t\t" + gemId;
									}
									else {
										html += "\t<td>\n";
									}
									html += "\t</td>\n";
								}
								html += "</tr>\n";
							}
							html += "</table>\n";
							jQuery3("#pl-490").html(html);
							for(let i = 0; i < collection.length; i++) {
								const id = collection[i];
								gemInstance.gems(id, function(err, gem) {
									if(err) {
										printError("Cannot get gem " + id);
										return;
									}
									const colorId = gem[1];
									let color = "";
									let grade = "";
									const level = gem[3].toString(10);
									const gradeType = gem[5].toNumber() >> 8;
									switch(colorId.toString(10)) {
										case "1": color = "Garnet"; break;
										case "2": color = "Amethyst"; break;
										case "3": color = "Sapphire"; break;
										case "4": color = "Opal"; break;
										case "5": color = "Topaz"; break;
										case "6": color = "Turquoise"; break;
									}
									switch(gradeType) {
										case 1: grade = "D"; break;
										case 2: grade = "C"; break;
										case 3: grade = "B"; break;
										case 4: grade = "A"; break;
										case 5: grade = "AA"; break;
										case 6: grade = "AAA"; break;
									}
									let thumbnail = "https://rawgit.com/vgorin/crypto-miner/master/web/gems/thumbnails/"
										+ color.substr(0, 3) + " " + level + " " + grade + ".png";
									let html = "<img src='" + thumbnail + "'/><br/>\n";
									html += color + " " + grade + " lvl " + level;
									document.getElementById("0x" + id.toString(16)).innerHTML = html;
								});
							}
							// =========  END:  Draw Gems in a Table =========

						});
					}
				}
				else {
					printInfo("You don't own any gems");
				}
				connection_successful();
			});
		});
	}
	catch(err) {
		printError("Cannot access Gem (ERC721 Token) Instance: " + err);
		gemInstance = null;
	}
}

let saleInstance;

function connect_sale() {
	if(!(myWeb3 && saleABI && myAccount)) {
		printError("Web3 is not properly initialized. Reload the page.");
		gemInstance = null;
		return;
	}
	const saleAddress = sale ? sale.value : saleAddr;
	saleInstance = saleABI.at(saleAddress);
	try {
		registerGeodeSaleEvent();
		updateGeodePrice();
		updateGeodesSold(connection_successful);
	}
	catch(err) {
		printError("Cannot access GeodeSale Instance: " + err);
		saleInstance = null;
	}
}

function connection_successful() {
	if(myWeb3 && gemInstance && saleInstance) {
		printSuccess("Successfully connected<br/>\nNetwork ID: " + myWeb3.version.network);
	}
}

function buy() {
	if(!(myWeb3 && saleInstance && myAccount)) {
		printError("Web3 is not properly initialized. Reload the page.");
		saleInstance = null;
		return 0x1;
	}
	try {
		const n = geodesNum ? geodesNum.value: 1;
		saleInstance.currentPrice(function(err, price) {
			if(err) {
				printError("Cannot get total price of the " + n + " geodes");
				return;
			}
			price = price.times(n);
			const priceETH = myWeb3.fromWei(price, "ether");
			printInfo("Total price of the " + n + " geodes is " + priceETH);
			saleInstance.getGeodes.sendTransaction({value: price}, function(err, txHash) {
				if(err) {
					printError("Transaction failed: " + err.toString().split("\n")[0]);
					return;
				}
				printSuccess("Transaction sent: " + txHash);
				// close modal window
				location.href = "#";
			});
		});
	}
	catch(err) {
		printError("Cannot access GeodeSale Instance: " + err);
		saleInstance = null;
	}
}

function registerGeodeSaleEvent() {
	if(!(myWeb3 && saleABI && myAccount && saleInstance)) {
		printError("Web3 is not properly initialized. Reload the page.");
		saleInstance = null;
		return;
	}
	try {
		const saleEvent = saleInstance.GeodeSold({}, {fromBlock: "latest", toBlock: "latest"});
		saleEvent.watch(function(err, receipt) {
			if(err) {
				printError("Error receiving GeodeSold event: " + err);
				return;
			}
			if(!(receipt && receipt.args && receipt.args.plotId && receipt.args.owner)) {
				printError("GeodeSold event received in wrong format: wrong arguments");
				return;
			}
			const plotId = receipt.args.plotId;
			const owner = receipt.args.owner;
			printInfo("GeodeSold(" + plotId + ", " + owner + ")");
			notify("Successfully bought geode #" + plotId, "success");

			updateGeodesSold();
		});
		printInfo("Successfully registered GeodeSold(uint16, address) event listener");
	}
	catch(err) {
		printError("Cannot access GeodeSale Instance: " + err);
		saleInstance = null;
	}
}

function updateGeodePrice() {
	if(!(myWeb3 && saleABI && myAccount && saleInstance)) {
		printError("Web3 is not properly initialized. Reload the page.");
		saleInstance = null;
		return;
	}
	try {
		saleInstance.currentPrice(function(err, price) {
			if(err) {
				printError("Unable to read geode price value");
				saleInstance = null;
				return;
			}
			const priceETH = myWeb3.fromWei(price, "ether");
			const geodePriceETH = priceETH.toString(10);
			printInfo("call to currentPrice returned " + geodePriceETH + " ETH");
			jQuery3("#geodePriceETH").html(geodePriceETH);
		});
	}
	catch(err) {
		printError("Cannot access GeodeSale Instance: " + err);
		saleInstance = null;
	}
}

function updateGeodesSold(callback) {
	if(!(myWeb3 && saleABI && myAccount && saleInstance)) {
		printError("Web3 is not properly initialized. Reload the page.");
		saleInstance = null;
		return;
	}
	try {
		saleInstance.geodesSold(function(err, sold) {
			if(err) {
				printError("Unable to read geodes sold value: " + err);
				saleInstance = null;
				return;
			}
			const geodesSold = sold.toString(10);
			printInfo("call to geodesSold returned " + geodesSold);
			jQuery3("span.counter").html(geodesSold);
			if(callback) {
				callback();
			}
		});
	}
	catch(err) {
		printError("Cannot access GeodeSale Instance: " + err);
		saleInstance = null;
	}
}

function selectAndBuy() {
	if(!myWeb3) {
		location.href = "https://metamask.io/";
		return;
	}

	const getGeodeModal = document.getElementById("geode_qty_modal");
	if(getGeodeModal) {
		location.href = "#geode_qty_modal";
	}
	else {
		buy();
	}
}

function printInfo(msg) {
	console.log(msg);
	if(con) {
		con.innerHTML += msg;
		con.innerHTML += "\n";
	}
}

function printSuccess(msg) {
	console.log(msg);
	if(con) {
		con.innerHTML += '<span style="color: darkgreen;">' + msg + '</span>';
		con.innerHTML += "\n";
	}
	notify(msg, "success");
}

function printError(msg) {
	console.error(msg);
	if(con) {
		con.innerHTML += '<span style="color: red;">' + msg + '</span>';
		con.innerHTML += "\n";
	}
	notify(msg, "danger");
}

let lastNotify;
function notify(msg, type) {
	if(msg == lastNotify) {
		return;
	}
	lastNotify = msg;
	jQuery3.notify(msg, {
		type: type,
		placement: {
			from: "bottom",
			align: "right"
		},
		delay: type === "danger" ? 10000: 1000,
		template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
		'<span data-notify="icon"></span> ' +
		'<span data-notify="title">{1}</span> ' +
		'<span data-notify="message">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
		'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0;"></div>' +
		'</div>' +
		'<a href="{3}" target="{4}" data-notify="url"></a>' +
		'</div>'
	});
}

jQuery3(document).ready(function() {
	init();

	setInterval(function() {
		if(myWeb3 && myWeb3.eth.accounts[0] !== myAccount) {
			myAccount = myWeb3.eth.accounts[0];
			printInfo("Your account is switched to " + myAccount);
			init();
			setTimeout(updateGeodesSold, 988);
		}
	}, 1988);

	// TODO: get rid of this ugly solution to update geodes sold counter
	if(myWeb3 && myAccount) {
		setTimeout(updateGeodesSold, 988);
	}

	const getGeodeButton = jQuery3("#GetGeodeButton");
	getGeodeButton.bind("click", selectAndBuy);
	getGeodeButton.css("cursor", "pointer");

});