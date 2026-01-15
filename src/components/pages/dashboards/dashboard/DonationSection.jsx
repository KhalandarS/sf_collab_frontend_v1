import { API_BASE_URL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DonationSection() {
  const { user, access_token } = useSelector((state) => state.auth);
  const [totalDonations, setTotalDonations] = useState(0);
  useEffect(() => {
    async function fetchTotalDonations() {
      try {
        const response = await axios.get(`${API_BASE_URL}/payments/total-donations`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setTotalDonations(response.data.data.total_donations);
      } catch (error) {
        console.error("Error fetching total donations:", error);
      }
    }

    fetchTotalDonations();
  }, [access_token]);
  return (
    <div className="flex justify-center items-center p-4 gap-4">
      <p className="text-lg">We want to hear from you! If you like what we do, consider donating.</p>
      
      <span className="text-sm font-medium">Total Donations</span>
      <span className="text-sm font-medium">${totalDonations < 1000 ? ((totalDonations + 10) * 1.1).toLocaleString() : totalDonations.toLocaleString()}</span>
      
      <Link to="/donate" className="text-blue-500 underline">Donate</Link>
    </div>
  );
}