import React, { useState, useEffect } from 'react';

const Rewards = () => {
  const [earnings, setEarnings] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [equityPromises, setEquityPromises] = useState(0);
  const [reputationPoints, setReputationPoints] = useState(0);

  useEffect(() => {
    // Fetch rewards data from API or state management
    // Example:
    // setEarnings(fetchedEarnings);
    // setPendingPayouts(fetchedPendingPayouts);
    // setEquityPromises(fetchedEquityPromises);
    // setReputationPoints(fetchedReputationPoints);
  }, []);

  return (
    <div className="rewards-section">
      <h2>Rewards</h2>
      <div className="rewards-details">
        <div className="reward-item">
          <h3>Earnings</h3>
          <p>${earnings}</p>
        </div>
        <div className="reward-item">
          <h3>Pending Payouts</h3>
          <p>${pendingPayouts}</p>
        </div>
        <div className="reward-item">
          <h3>Equity Promises</h3>
          <p>${equityPromises}</p>
        </div>
        <div className="reward-item">
          <h3>Reputation Points</h3>
          <p>{reputationPoints}</p>
        </div>
      </div>
    </div>
  );
};

export default Rewards;