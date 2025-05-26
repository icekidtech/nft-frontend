// NFT functions for fetching and displaying NFTs

async function fetchNFTMetadata(tokenId) {
  try {
    const response = await fetch(`${METADATA_BASE_URL}${tokenId}.json`);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching metadata for token ${tokenId}:`, error);
    return null;
  }
}

async function displayFeaturedNFTs() {
  const featuredContainer = document.getElementById('featured-nfts');
  if (!featuredContainer) return;
  
  // Clear previous NFTs
  featuredContainer.innerHTML = '';
  
  // Get 5 random NFT IDs between 1 and 104
  const randomIds = [];
  while (randomIds.length < 5) {
    const randomId = Math.floor(Math.random() * TOTAL_SUPPLY) + 1;
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }
  
  // Display NFTs
  for (const tokenId of randomIds) {
    const nftCard = document.createElement('div');
    nftCard.className = 'nft-card';
    
    // Add loading state
    nftCard.innerHTML = `
      <div class="nft-loading">
        <div class="spinner"></div>
        <p>Loading NFT #${tokenId}...</p>
      </div>
    `;
    
    featuredContainer.appendChild(nftCard);
    
    // Fetch and display NFT
    const metadata = await fetchNFTMetadata(tokenId);
    if (metadata) {
      nftCard.innerHTML = `
        <div class="nft-image">
          <img src="${metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}" alt="${metadata.name}" onerror="this.onerror=null; this.src='assets/images/placeholder.png'">
        </div>
        <div class="nft-info">
          <h3>${metadata.name}</h3>
          <p class="nft-id">Token #${tokenId}</p>
        </div>
      `;
    } else {
      nftCard.innerHTML = `
        <div class="nft-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <p>Failed to Load NFT #${tokenId}</p>
        </div>
      `;
    }
  }
}

async function updateRemainingNFTs() {
  const remainingElement = document.getElementById('remaining-nfts');
  if (!remainingElement) return;
  
  try {
    const contract = getContract();
    if (!contract) {
      remainingElement.textContent = 'Wallet not connected';
      return;
    }
    
    const unmintedTokens = await contract.getUnmintedTokens();
    remainingElement.textContent = `Remaining NFTs: ${unmintedTokens.length} out of ${TOTAL_SUPPLY}`;
  } catch (error) {
    console.error("Error getting unminted tokens:", error);
    remainingElement.textContent = 'Failed to fetch remaining NFTs';
  }
}

async function mintNFT() {
  const mintBtn = document.getElementById('mint-btn');
  const mintStatus = document.getElementById('mint-status');
  
  if (!mintBtn || !mintStatus) return;
  
  mintBtn.disabled = true;
  mintBtn.textContent = 'Minting...';
  mintStatus.textContent = 'Transaction in progress...';
  mintStatus.className = 'mint-status pending';
  
  try {
    const contract = getContract();
    if (!contract) {
      throw new Error('Contract not available. Please connect your wallet.');
    }
    
    const tx = await contract.mintRandomNFT();
    mintStatus.textContent = 'Transaction submitted! Waiting for confirmation...';
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Find the NFTMinted event in the receipt
    const event = receipt.events.find(event => event.event === 'NFTMinted');
    const tokenId = event.args.tokenId.toString();
    
    mintStatus.textContent = `Success! You minted NFT #${tokenId}`;
    mintStatus.className = 'mint-status success';
    
    // Update remaining NFTs
    updateRemainingNFTs();
    
    // Show the minted NFT
    const metadata = await fetchNFTMetadata(tokenId);
    const mintedNFTContainer = document.getElementById('minted-nft');
    if (mintedNFTContainer && metadata) {
      mintedNFTContainer.innerHTML = `
        <div class="minted-nft-card">
          <h3>Your New NFT!</h3>
          <img src="${metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}" alt="${metadata.name}">
          <h4>${metadata.name}</h4>
          <p>Token ID: ${tokenId}</p>
        </div>
      `;
      mintedNFTContainer.classList.remove('hidden');
    }
  } catch (error) {
    console.error("Error minting NFT:", error);
    mintStatus.textContent = `Minting failed: ${error.message}`;
    mintStatus.className = 'mint-status error';
  } finally {
    mintBtn.disabled = false;
    mintBtn.textContent = 'Mint NFT';
  }
}