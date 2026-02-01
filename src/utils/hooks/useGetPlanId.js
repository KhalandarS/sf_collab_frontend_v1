import { useEffect, useState } from "react";
import { usersAPI } from "../APIs/userAPI";

export default function useGetPlanId() {
  const [planId, setPlanId] = useState(null);
  
  useEffect(() => {
    async function fetchPlanId() {
      try {
        const res = await usersAPI.getCurrentPlan()
        if (!res.success) {
          throw new Error("Failed to fetch current plan");
        }
        setPlanId(res.data?.plan_id || null);
      } catch (err) {
        console.error("❌ Failed to load crowdfunding plan ID", err);
      }
    }

    fetchPlanId();
  }, []);

  return [planId, setPlanId];
}