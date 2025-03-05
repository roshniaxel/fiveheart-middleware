"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("your_table_name").select("*");
      if (error) console.error("Error fetching data:", error);
      else setData(data);
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
