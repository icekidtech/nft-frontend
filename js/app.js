// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Set up wallet connect buttons
  document.querySelectorAll('.connect-wallet-btn').forEach(btn => {
    btn.addEventListener('click', connectWallet);
  });
  
  // Set up mint button
  const mintBtn = document.getElementById('mint-btn');
  if (mintBtn) {
    mintBtn.addEventListener('click', mintNFT);
  }
  
  // Initialize featured NFTs on home page
  if (document.getElementById('featured-nfts')) {
    displayFeaturedNFTs();
    
    // Update featured NFTs every 10 seconds
    setInterval(displayFeaturedNFTs, 10000);
  }
  
  // Update remaining NFTs if on home page or mint page
  if (document.getElementById('remaining-nfts')) {
    updateRemainingNFTs();
  }
  
  // Setup navigation active states
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('nav a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (
      (currentPage === '' && linkPage === 'index.html') ||
      currentPage === linkPage
    ) {
      link.classList.add('active');
    }
  });
});