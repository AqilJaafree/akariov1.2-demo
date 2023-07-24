import logo from './logo.svg';
import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import NavBar from "./Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import Details from "./Details";
import BlogsPage from "./pages/BlogsPage"; 


import { BrowserRouter as Router, Switch , Route, Routes} from "react-router-dom";

function App() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [coinGeckoData, setCoinGeckoData] = useState(null);
  

  

  async function requestAccount() {
    setLoading(true);
    setError("");

    try {
      if (window.ethereum) {
        if (address) {
          // If address exists, disconnect the wallet
          console.log("Disconnecting Metamask Wallet");
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
          setAddress("");
        } else {
          // If address does not exist, connect the wallet
          console.log("Connecting Metamask Wallet");
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAddress(accounts[0]);
        }
      } else {
        console.log("Metamask Not Detected");
      }
    } catch (e) {
      console.log(e);
      setError("An error occurred while connecting.");
    }

    setLoading(false);
  }

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  async function searchNft() {
    if (!searchTerm) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const openSeaHeaders = new Headers();
      openSeaHeaders.append("X-API-KEY", "36bcfeb8b7b848dd9eec125683d47078");

      const openSeaRequestOptions = {
        method: "GET",
        headers: openSeaHeaders,
        redirect: "follow",
      };

      const openSeaResponse = await fetch(
        `https://api.opensea.io/v2/collection/${searchTerm}/nfts?limit=50`,
        openSeaRequestOptions
      );

      const openSeaData = await openSeaResponse.json();

      console.log("OpenSea Data:", openSeaData);

      setNftData(openSeaData);

      // CoinGecko API
      const coinGeckoResponse = await fetch(
        `https://api.coingecko.com/api/v3/nfts/${searchTerm}`
      );

      const coinGeckoData = await coinGeckoResponse.json();
      console.log("CoinGecko Data:", coinGeckoData);
      setCoinGeckoData(coinGeckoData);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching NFT data");
    }

    setLoading(false);
  }

  useEffect(() => {
    requestAccount();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavBar className="navbar" />
          <button onClick={requestAccount} disabled={loading}>
            {address ? "Sign Out" : "Connect"}
          </button>
        </header>
        <div className="body-content">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {address && <h3>Wallet Address: {address}</h3>}
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter search term"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              onClick={searchNft}
              disabled={loading}
              className="search-button"
            >
              Search NFT
            </button>
          </div>
          {nftData && (
            <div>
              <h2>Search Results</h2>

              {coinGeckoData && (
                <div>
                  <h2>NFT Project Details</h2>
                  <p>Name: {coinGeckoData.name}</p>
                  {coinGeckoData.floor_price &&
                    coinGeckoData.floor_price.usd && (
                      <p>Floor Price (USD): {coinGeckoData.floor_price.usd}</p>
                    )}
                  {coinGeckoData.floor_price &&
                    coinGeckoData.floor_price.native_currency && (
                      <p>
                        Floor Price (ETH):{" "}
                        {coinGeckoData.floor_price.native_currency}
                      </p>
                    )}
                  {coinGeckoData.contract_address && (
                    <p>Contract Address: {coinGeckoData.contract_address}</p>
                  )}
                  {coinGeckoData.number_of_unique_addresses && (
                    <p>
                      Number of Unique Addresses:{" "}
                      {coinGeckoData.number_of_unique_addresses}
                    </p>
                  )}
                  {coinGeckoData.image && coinGeckoData.image.small && (
                    <img
                      src={coinGeckoData.image.small}
                      alt={coinGeckoData.name}
                    />
                  )}
                  {coinGeckoData.floor_price_1y_percentage_change &&
                    coinGeckoData.floor_price_1y_percentage_change.usd && (
                      <p>
                        Floor Price Change (1 Year, USD):{" "}
                        {coinGeckoData.floor_price_1y_percentage_change.usd}
                      </p>
                    )}
                  {coinGeckoData.floor_price_30d_percentage_change &&
                    coinGeckoData.floor_price_30d_percentage_change.usd && (
                      <p>
                        Floor Price Change (30 Days, USD):{" "}
                        {coinGeckoData.floor_price_30d_percentage_change.usd}
                      </p>
                    )}
                  {coinGeckoData.floor_price_7d_percentage_change &&
                    coinGeckoData.floor_price_7d_percentage_change.usd && (
                      <p>
                        Floor Price Change (7 Days, USD):{" "}
                        {coinGeckoData.floor_price_7d_percentage_change.usd}
                      </p>
                    )}
                  {coinGeckoData.floor_price_24h_percentage_change &&
                    coinGeckoData.floor_price_24h_percentage_change.usd && (
                      <p>
                        Floor Price Change (24 Hours, USD):{" "}
                        {coinGeckoData.floor_price_24h_percentage_change.usd}
                      </p>
                    )}
                </div>
              )}

              {nftData.nfts && nftData.nfts.length > 0 ? (
                <div>
                  <h2>NFTs</h2>
                  <div className="nft-container">
                    {nftData.nfts.map((nft) => (
                      <div key={nft.token_id} className="nft-item">
                        <h3 className="nft-name">NFT Details</h3>
                        <p className="nft-info">NFT Name: {nft.name}</p>
                        <p className="nft-info">
                          Ethereum Address: {nft.contract}
                        </p>
                        <p className="nft-info">
                          Token Standard: {nft.token_standard}
                        </p>
                        <img src={nft.image_url} alt={nft.name} />
                        {coinGeckoData && coinGeckoData.floor_price && (
                          <p>
                            Floor Price (ETH): {coinGeckoData.floor_price.usd}
                          </p>
                        )}

                        <a
                          href={nft.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Details
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No NFTs found</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/Blogs" element={<BlogsPage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Details/:nftId" element={<Details nftData={nftData} />} />
      </Routes>
    </Router>
  );
}

export default App;