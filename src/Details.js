import React from "react";

const Details = ({ nftData }) => {
  // Use the nftData to display the details of the selected NFT
  return (
    <div>
      <h2>NFT Details</h2>
      <p>Name: {nftData.name}</p>
      {/* Add other details from nftData here */}
    </div>
  );
};

export default Details;
