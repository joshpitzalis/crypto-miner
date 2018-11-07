const FEATURE_TRANSFERS = 0x00000001;
const FEATURE_TRANSFERS_ON_BEHALF = 0x00000002;
const ROLE_TOKEN_CREATOR = 0x00040000;

const Token = artifacts.require("./CountryERC721.sol");
const Sale = artifacts.require("./CountrySale.sol");

// prepare country initialization data
const COUNTRY_DATA = [
	62978, // Russia
	36777, // Canada
	35260, // China
	35084, // USA
	31366, // Brazil
	28332, // Australia
	12108, // India
	10241, // Argentina
	10037, // Kazakhstan
	8773,  // Algeria
	8639,  // Democratic Republic of the Congo
	8142,  // Kingdom of Denmark
	7918,  // Saudi Arabia
	7235,  // Mexico
	7015,  // Indonesia
	6856,  // Sudan
	6481,  // Libya
	6070,  // Iran
	5764,  // Mongolia
	4734,  // Peru
	4729,  // Chad
	4667,  // Niger
	4592,  // Angola
	4567,  // Mali
	4493,  // South Africa
	4410,  // Colombia
	4152,  // Ethiopia
	4046,  // Bolivia
	3796,  // Mauritania
	3689,  // Egypt
	3481,  // Tanzania
	3403,  // Nigeria
	3359,  // Venezuela
	3040,  // Namibia
	2961,  // Pakistan
	2953,  // Mozambique
	2875,  // Turkey
	2788,  // Chile
	2772,  // Zambia
	2499,  // Myanmar (Burma)
	2488,  // France
	2385,  // Afghanistan
	2349,  // Somalia
	2295,  // Central African Republic
	2283,  // South Sudan
	2223,  // Ukraine
	2211,  // Botswana
	2162,  // Madagascar
	2138,  // Kenya
	1945,  // Yemen
	1893,  // Thailand
	1859,  // Spain
	1798,  // Turkmenistan
	1751,  // Cameroon
	1705,  // Papua New Guinea
	1657,  // Sweden
	1648,  // Uzbekistan
	1645,  // Morocco
	1610,  // Iraq
	1498,  // Paraguay
	1439,  // Zimbabwe
	1392,  // Japan
	1315,  // Germany
	1260,  // Republic of the Congo
	1241,  // Finland
	1215,  // Malaysia
	1214,  // Vietnam
	1194,  // Norway
	1188,  // Ivory Coast
	1152,  // Poland
	1140,  // Oman
	1110,  // Italy
	1105,  // Philippines
	1044,  // Ecuador
	1010,  // Burkina Faso
	992, // New Zealand
	986, // Gabon
	906, // Guinea
	897, // United Kingdom
	890, // Uganda
	879, // Ghana
	878, // Romania
	872, // Laos
	792, // Guyana
	765, // Belarus
	731, // Kyrgyzstan
	723, // Senegal
	682, // Syria
	667, // Cambodia
	649, // Uruguay
	603, // Tunisia
	601, // Suriname
	544, // Bangladesh
	542, // Nepal
	527, // Tajikistan
	486, // Greece
	477, // Nicaragua
	447, // Eritrea
	444, // North Korea
	436, // Malawi
	415, // Benin
	413, // Honduras
	410, // Liberia
	409, // Bulgaria
	405, // Cuba
	401, // Guatemala
	379, // Iceland
	363, // South Korea
	343, // Hungary
	340, // Jordan
	336, // Portugal (Total)
	325, // Serbia
	319, // Azerbaijan
	309, // Austria
	305, // United Arab Emirates
	290, // Czech Republic
	288, // Panama
	268, // Sierra Leone
	263, // Ireland
	257, // Georgia
	242, // Sri Lanka
	240, // Lithuania
	238, // Latvia
	209, // Togo
	208, // Croatia
	188, // Bosnia and Herzegovina
	188, // Costa Rica
	180, // Slovakia
	179, // Dominican Republic
	173, // Bhutan
	167, // Estonia
	157, // Netherlands (Total)
	152, // Switzerland
	133, // Guinea-Bissau
	133, // Republic of China (Taiwan, Quemoy, Matsu)
	125, // Moldova
	120, // Belgium
	112, // Lesotho
	110, // Armenia
	106, // Albania
	105, // Solomon Islands
	103, // Equatorial Guinea
	103, // Burundi
	102, // Haiti
	99,  // Israel (Including West Bank and Gaza)
	97,  // Rwanda
	93,  // Macedonia
	85,  // Belize
	81,  // Djibouti
	77,  // El Salvador
	75,  // Slovenia
	67,  // Fiji
	66,  // Kuwait
	64,  // Swaziland
	55,  // East Timor
	51,  // Bahamas
	51,  // Montenegro
	45,  // Vanuatu
	42,  // Qatar
	42,  // The Gambia
	40,  // Jamaica
	38,  // Lebanon
	34,  // Cyprus
	21,  // Brunei
	19,  // Trinidad and Tobago
	15,  // Cape Verde
	11,  // Samoa
	10,  // Luxembourg
	8,   // Comoros
	7,   // Mauritius
	4,   // São Tomé and Príncipe
	3,   // Dominica
	3,   // Tonga
	3,   // Kiribati
	3,   // Micronesia
	3,   // Singapore
	2,   // Bahrain
	2,   // Saint Lucia
	2,   // Seychelles
	2,   // Andorra
	2,   // Palau
	2,   // Antigua and Barbuda
	2,   // Barbados
	1,   // Saint Vincent and the Grenadines
	1,   // Grenada
	1,   // Malta
	1,   // Maldives
	1,   // Saint Kitts and Nevis
	1,   // Marshall Islands
	1,   // Liechtenstein
];

//  prepare country initialization data
const COUNTRY_PRICE_DATA = [
	web3.toBigNumber(15744500000000000000),  // Russia, fits into max uint64: 18446744073709551615
	web3.toBigNumber(10507714285714300000),  // Canada
	web3.toBigNumber(10074285714285700000),  // China
	web3.toBigNumber(10024000000000000000),  // United States of America
	web3.toBigNumber(9651076923076930000),  // Brazil
	web3.toBigNumber(9444000000000000000),  // Australia
	web3.toBigNumber(4402909090909090000),  // India
	web3.toBigNumber(4096400000000000000),  // Argentina
	web3.toBigNumber(4014800000000000000),  // Kazakhstan
	web3.toBigNumber(3509200000000000000),  // Algeria
	web3.toBigNumber(3455600000000000000),  // Democratic Republic of the Congo
	web3.toBigNumber(3256800000000000000),  // Kingdom of Denmark
	web3.toBigNumber(3167200000000000000),  // Saudi Arabia
	web3.toBigNumber(2894000000000000000),  // Mexico
	web3.toBigNumber(2806000000000000000),  // Indonesia
	web3.toBigNumber(2742400000000000000),  // Sudan
	web3.toBigNumber(2645306122448980000),  // Libya
	web3.toBigNumber(2529166666666670000),  // Iran
	web3.toBigNumber(2452765957446810000),  // Mongolia
	web3.toBigNumber(2254285714285710000),  // Peru
	web3.toBigNumber(2251904761904760000),  // Chad
	web3.toBigNumber(2276585365853660000),  // Niger
	web3.toBigNumber(2240000000000000000),  // Angola
	web3.toBigNumber(2227804878048780000),  // Mali
	web3.toBigNumber(2191707317073170000),  // South Africa
	web3.toBigNumber(2151219512195120000),  // Colombia
	web3.toBigNumber(2025365853658540000),  // Ethiopia
	web3.toBigNumber(1973658536585370000),  // Bolivia
	web3.toBigNumber(1898000000000000000),  // Mauritania
	web3.toBigNumber(1844500000000000000),  // Egypt
	web3.toBigNumber(1740500000000000000),  // Tanzania
	web3.toBigNumber(1701500000000000000),  // Nigeria
	web3.toBigNumber(1679500000000000000),  // Venezuela
	web3.toBigNumber(1520000000000000000),  // Namibia
	web3.toBigNumber(1480500000000000000),  // Pakistan
	web3.toBigNumber(1476500000000000000),  // Mozambique
	web3.toBigNumber(1437500000000000000),  // Turkey
	web3.toBigNumber(1394000000000000000),  // Chile
	web3.toBigNumber(1386000000000000000),  // Zambia
	web3.toBigNumber(1249500000000000000),  // Myanmar (Burma)
	web3.toBigNumber(1244000000000000000),  // France
	web3.toBigNumber(1192500000000000000),  // Afghanistan
	web3.toBigNumber(1174500000000000000),  // Somalia
	web3.toBigNumber(1147500000000000000),  // Central African Republic
	web3.toBigNumber(1141500000000000000),  // South Sudan
	web3.toBigNumber(1111500000000000000),  // Ukraine
	web3.toBigNumber(1105500000000000000),  // Botswana
	web3.toBigNumber(1081000000000000000),  // Madagascar
	web3.toBigNumber(1069000000000000000),  // Kenya
	web3.toBigNumber(1296666666666670000),  // Yemen
	web3.toBigNumber(1262000000000000000),  // Thailand
	web3.toBigNumber(1239333333333330000),  // Spain
	web3.toBigNumber(1198666666666670000),  // Turkmenistan
	web3.toBigNumber(1167333333333330000),  // Cameroon
	web3.toBigNumber(1136666666666670000),  // Papua New Guinea
	web3.toBigNumber(1104666666666670000),  // Sweden
	web3.toBigNumber(1098666666666670000),  // Uzbekistan
	web3.toBigNumber(1096666666666670000),  // Morocco
	web3.toBigNumber(1073333333333330000),  // Iraq
	web3.toBigNumber(998666666666667000),  // Paraguay
	web3.toBigNumber(959333333333333000),  // Zimbabwe
	web3.toBigNumber(928000000000000000),  // Japan
	web3.toBigNumber(876666666666667000),  // Germany
	web3.toBigNumber(840000000000000000),  // Republic of the Congo
	web3.toBigNumber(827333333333333000),  // Finland
	web3.toBigNumber(810000000000000000),  // Malaysia
	web3.toBigNumber(809333333333334000),  // Vietnam
	web3.toBigNumber(796000000000000000),  // Norway
	web3.toBigNumber(792000000000000000),  // Ivory Coast
	web3.toBigNumber(768000000000000000),  // Poland
	web3.toBigNumber(760000000000000000),  // Oman
	web3.toBigNumber(740000000000000000),  // Italy
	web3.toBigNumber(736666666666667000),  // Philippines
	web3.toBigNumber(696000000000000000),  // Ecuador
	web3.toBigNumber(673333333333333000),  // Burkina Faso
	web3.toBigNumber(661333333333333000),  // New Zealand
	web3.toBigNumber(657333333333333000),  // Gabon
	web3.toBigNumber(604000000000000000),  // Guinea
	web3.toBigNumber(598000000000000000),  // United Kingdom
	web3.toBigNumber(593333333333333000),  // Uganda
	web3.toBigNumber(586000000000000000),  // Ghana
	web3.toBigNumber(585333333333333000),  // Romania
	web3.toBigNumber(581333333333333000),  // Laos
	web3.toBigNumber(528000000000000000),  // Guyana
	web3.toBigNumber(510000000000000000),  // Belarus
	web3.toBigNumber(487333333333333000),  // Kyrgyzstan
	web3.toBigNumber(482000000000000000),  // Senegal
	web3.toBigNumber(454666666666667000),  // Syria
	web3.toBigNumber(444666666666667000),  // Cambodia
	web3.toBigNumber(432666666666667000),  // Uruguay
	web3.toBigNumber(402000000000000000),  // Tunisia
	web3.toBigNumber(400666666666667000),  // Suriname
	web3.toBigNumber(362666666666667000),  // Bangladesh
	web3.toBigNumber(361333333333333000),  // Nepal
	web3.toBigNumber(351333333333333000),  // Tajikistan
	web3.toBigNumber(324000000000000000),  // Greece
	web3.toBigNumber(318000000000000000),  // Nicaragua
	web3.toBigNumber(298000000000000000),  // Eritrea
	web3.toBigNumber(296000000000000000),  // North Korea
	web3.toBigNumber(290666666666667000),  // Malawi
	web3.toBigNumber(276666666666667000),  // Benin
	web3.toBigNumber(275333333333333000),  // Honduras
	web3.toBigNumber(273333333333333000),  // Liberia
	web3.toBigNumber(272666666666667000),  // Bulgaria
	web3.toBigNumber(270000000000000000),  // Cuba
	web3.toBigNumber(267333333333333000),  // Guatemala
	web3.toBigNumber(252666666666667000),  // Iceland
	web3.toBigNumber(242000000000000000),  // South Korea
	web3.toBigNumber(228666666666667000),  // Hungary
	web3.toBigNumber(226666666666667000),  // Jordan
	web3.toBigNumber(224000000000000000),  // Portugal (Total)
	web3.toBigNumber(216666666666667000),  // Serbia
	web3.toBigNumber(212666666666667000),  // Azerbaijan
	web3.toBigNumber(206000000000000000),  // Austria
	web3.toBigNumber(203333333333333000),  // United Arab Emirates
	web3.toBigNumber(193333333333333000),  // Czech Republic
	web3.toBigNumber(192000000000000000),  // Panama
	web3.toBigNumber(178666666666667000),  // Sierra Leone
	web3.toBigNumber(175333333333333000),  // Ireland
	web3.toBigNumber(171333333333333000),  // Georgia
	web3.toBigNumber(161333333333333000),  // Sri Lanka
	web3.toBigNumber(160000000000000000),  // Lithuania
	web3.toBigNumber(158666666666667000),  // Latvia
	web3.toBigNumber(139333333333333000),  // Togo
	web3.toBigNumber(138666666666667000),  // Croatia
	web3.toBigNumber(125333333333333000),  // Bosnia and Herzegovina
	web3.toBigNumber(125333333333333000),  // Costa Rica
	web3.toBigNumber(120000000000000000),  // Slovakia
	web3.toBigNumber(119333333333333000),  // Dominican Republic
	web3.toBigNumber(115333333333333000),  // Bhutan
	web3.toBigNumber(111333333333333000),  // Estonia
	web3.toBigNumber(104666666666667000),  // Netherlands (Total)
	web3.toBigNumber(101333333333333000),  // Switzerland
	web3.toBigNumber(88666666666666700),  // Guinea-Bissau
	web3.toBigNumber(88666666666666700),  // Republic of China (Taiwan, Quemoy, Matsu)
	web3.toBigNumber(83333333333333300),  // Moldova
	web3.toBigNumber(80000000000000000),  // Belgium
	web3.toBigNumber(74666666666666700),  // Lesotho
	web3.toBigNumber(73333333333333300),  // Armenia
	web3.toBigNumber(70666666666666700),  // Albania
	web3.toBigNumber(70000000000000000),  // Solomon Islands
	web3.toBigNumber(68666666666666700),  // Equatorial Guinea
	web3.toBigNumber(68666666666666700),  // Burundi
	web3.toBigNumber(68000000000000000),  // Haiti
	web3.toBigNumber(66000000000000000),  // Israel (Including West Bank and Gaza)
	web3.toBigNumber(64666666666666700),  // Rwanda
	web3.toBigNumber(62000000000000000),  // Macedonia
	web3.toBigNumber(56666666666666700),  // Belize
	web3.toBigNumber(54000000000000000),  // Djibouti
	web3.toBigNumber(51333333333333300),  // El Salvador
	web3.toBigNumber(50000000000000000),  // Slovenia
	web3.toBigNumber(44666666666666700),  // Fiji
	web3.toBigNumber(44000000000000000),  // Kuwait
	web3.toBigNumber(42666666666666700),  // Swaziland
	web3.toBigNumber(36666666666666700),  // East Timor
	web3.toBigNumber(34000000000000000),  // Bahamas
	web3.toBigNumber(34000000000000000),  // Montenegro
	web3.toBigNumber(30000000000000000),  // Vanuatu
	web3.toBigNumber(28000000000000000),  // Qatar
	web3.toBigNumber(28000000000000000),  // The Gambia
	web3.toBigNumber(26666666666666700),  // Jamaica
	web3.toBigNumber(25333333333333300),  // Lebanon
	web3.toBigNumber(22666666666666700),  // Cyprus
	web3.toBigNumber(14000000000000000),  // Brunei
	web3.toBigNumber(12666666666666700),  // Trinidad and Tobago
	web3.toBigNumber(10000000000000000),  // Cape Verde
	web3.toBigNumber(7333333333333330),  // Samoa
	web3.toBigNumber(6666666666666670),  // Luxembourg
	web3.toBigNumber(5333333333333330),  // Comoros
	web3.toBigNumber(4666666666666670),  // Mauritius
	web3.toBigNumber(2666666666666670),  // São Tomé and Príncipe
	web3.toBigNumber(2000000000000000),  // Dominica
	web3.toBigNumber(2000000000000000),  // Tonga
	web3.toBigNumber(2000000000000000),  // Kiribati
	web3.toBigNumber(2000000000000000),  // Micronesia
	web3.toBigNumber(2000000000000000),  // Singapore
	web3.toBigNumber(1333333333333330),  // Bahrain
	web3.toBigNumber(1333333333333330),  // Saint Lucia
	web3.toBigNumber(1333333333333330),  // Seychelles
	web3.toBigNumber(1333333333333330),  // Andorra
	web3.toBigNumber(1333333333333330),  // Palau
	web3.toBigNumber(1333333333333330),  // Antigua and Barbuda
	web3.toBigNumber(1333333333333330),  // Barbados
	web3.toBigNumber(666666666666667),  // Saint Vincent and the Grenadines
	web3.toBigNumber(666666666666667),  // Grenada
	web3.toBigNumber(666666666666667),  // Malta
	web3.toBigNumber(666666666666667),  // Maldives
	web3.toBigNumber(666666666666667),  // Saint Kitts and Nevis
	web3.toBigNumber(666666666666667),  // Marshall Islands
	web3.toBigNumber(666666666666667),  // Liechtenstein
];

const tokenId = 117;

contract("CountrySale: Gas Usage", (accounts) => {
	it("CountryERC721: deploying a country requires 4360176 gas", async () => {
		const tk = await Token.new(COUNTRY_DATA);
		const txHash = tk.transactionHash;
		const txReceipt = await web3.eth.getTransactionReceipt(txHash);
		const gasUsed = txReceipt.gasUsed;

		assertEqual(4360176, gasUsed, "deploying CountryERC721 gas usage mismatch: " + gasUsed);
	});

	it("CountryERC721: minting a country requires 165560 gas", async () => {
		const tk = await Token.new(COUNTRY_DATA);
		const gasUsed = (await tk.mint(accounts[0], tokenId)).receipt.gasUsed;

		assertEqual(165560, gasUsed, "minting a country gas usage mismatch: " + gasUsed);
	});

	it("CountryERC721: transferring a country requires 72017 gas", async () => {
		const tk = await Token.new(COUNTRY_DATA);
		await tk.updateFeatures(FEATURE_TRANSFERS);
		await tk.mint(accounts[0], tokenId);
		const gasUsed = (await tk.safeTransferFrom(accounts[0], accounts[1], tokenId, "")).receipt.gasUsed;

		assertEqual(72017, gasUsed, "transferring a country gas usage mismatch: " + gasUsed);
	});

	it("CountrySale: deploying a country sale requires 3360909 gas", async () => {
		const tk = await Token.new(COUNTRY_DATA);
		const sale = await Sale.new(tk.address, accounts[0], COUNTRY_PRICE_DATA);
		const txHash = sale.transactionHash;
		const txReceipt = await web3.eth.getTransactionReceipt(txHash);
		const gasUsed = txReceipt.gasUsed;

		assertEqual(3360909, gasUsed, "deploying CountrySale gas usage mismatch: " + gasUsed);
	});

	it("CountrySale: buying a country requires 184086 gas", async () => {
		const tk = await Token.new(COUNTRY_DATA);
		const sale = await Sale.new(tk.address, accounts[0], COUNTRY_PRICE_DATA);
		await tk.addOperator(sale.address, ROLE_TOKEN_CREATOR);
		const gasUsed = (await sale.buy(tokenId, {from: accounts[1], value: getPrice(tokenId)})).receipt.gasUsed;

		assertEqual(184086, gasUsed, "buying a country gas usage mismatch: " + gasUsed);
	});

	it("CountrySale: buying 5 countries requires 541798 gas", async () => {
		const tk = await Token.new(COUNTRY_DATA);
		const sale = await Sale.new(tk.address, accounts[0], COUNTRY_PRICE_DATA);
		await tk.addOperator(sale.address, ROLE_TOKEN_CREATOR);
		const countries = [1, 2, 3, 4, 5];
		const price = countries.reduce((a, b) => a.plus(getPrice(b)), web3.toBigNumber(0));
		const gasUsed = (await sale.bulkBuy(countries, {from: accounts[1], value: price})).receipt.gasUsed;

		assertEqual(541798, gasUsed, "buying 5 countries gas usage mismatch: " + gasUsed);
	});
});

// check if 2 values are equal with a 5% precision
function assertEqual(expected, actual, msg) {
	assertEqualWith(expected, 0.05, actual, msg);
}

// check if 2 values are equal with the 'leeway' precision
function assertEqualWith(expected, leeway, actual, msg) {
	assert(expected * (1 - leeway) < actual && expected * (1 + leeway) > actual, msg);
}

// get price by token ID
function getPrice(tokenId) {
	return COUNTRY_PRICE_DATA[tokenId - 1];
}