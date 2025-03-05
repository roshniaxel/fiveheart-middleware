"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Define the type for the table data
interface PurchaseLog {
  id: number;
  name: string; // Modify based on your actual table fields
  // Add other necessary fields
}

export default function Home() {
  const [data, setData] = useState<PurchaseLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("purchase_log")
        .select("*")
        .returns<PurchaseLog[]>(); // Correct way to type the response
    
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(data ?? []); // Ensure it's not null
      }
      setLoading(false);
    };
    

    fetchData();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Supabase Data</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li> // Adjust fields as needed
          ))}
        </ul>
      )}
    </main>
  );
}
