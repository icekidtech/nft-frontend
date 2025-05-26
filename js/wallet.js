let userAddress = null;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      
      // Update UI
      document.querySelectorAll('.wallet-address').forEach(el => {
        el.textContent = userAddress.substring(0, 6) + '...' + userAddress.substring(userAddress.length - 4);
      });
      
      document.querySelectorAll('.connect-wallet-btn').forEach(btn => {
        btn.textContent = 'Wallet Connected';
        btn.classList.add('connected');
      });
      
      document.querySelectorAll('.mint-section').forEach(section => {
        section.classList.remove('hidden');
      });
      
      // Check if we're on the right network (Lisk Sepolia)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      // Replace with actual Lisk Sepolia chain ID
      if (chainId !== '4202') { // placeholder - use correct Lisk Sepolia chain ID
        alert('Please switch to Lisk Sepolia testnet to use this dApp');
      }
      
      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet: " + error.message);
      return false;
    }
  } else {
    alert("Web3 wallet not detected. Please install MetaMask or another Web3 wallet.");
    return false;
  }
}

// Listen for account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      userAddress = null;
      document.querySelectorAll('.wallet-address').forEach(el => {
        el.textContent = 'Connect Wallet';
      });
      document.querySelectorAll('.connect-wallet-btn').forEach(btn => {
        btn.textContent = 'Connect Wallet';
        btn.classList.remove('connected');
      });
      document.querySelectorAll('.mint-section').forEach(section => {
        section.classList.add('hidden');
      });
    } else {
      userAddress = accounts[0];
      document.querySelectorAll('.wallet-address').forEach(el => {
        el.textContent = userAddress.substring(0, 6) + '...' + userAddress.substring(userAddress.length - 4);
      });
    }
  });
}