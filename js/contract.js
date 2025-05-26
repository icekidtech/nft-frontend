const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Replace with actual address

const CONTRACT_ABI = [
  { "inputs": [], "name": "mintRandomNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getUnmintedTokens", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "NFTMinted", "type": "event" }
];

const METADATA_BASE_URL = "https://gateway.pinata.cloud/ipfs/bafybeibakn3p7jleefqdzxe2fpjzlglbb7fkdo3bwl3uobq6de4ekuptxi/";
const TOTAL_SUPPLY = 104;

function getContract() {
  if (!window.contract) {
    if (!window.ethereum) {
      console.error("No Web3 provider detected");
      return null;
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    window.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  return window.contract;
}