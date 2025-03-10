"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./globals.css";

interface PurchasedCourse {
  course_id: string;
  title: string;
  price: number;
}

interface SupabasePurchaseLog {
  id: number;
  created_at: string;
  site_url: string;
  user_log?: {
    title: string;
    user_email: string;
    payment_method: string;
    total_amount: number;
    purchased_courses: PurchasedCourse[];
  } | null;
}

interface ParsedPurchaseLog {
  id: number;
  title: string;
  user_email: string;
  payment_method: string;
  total_amount: number;
  purchased_courses: PurchasedCourse[];
  created_at: string;
  site_url: string;
}

export default function Home() {
  const [data, setData] = useState<ParsedPurchaseLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: rawData, error } = await supabase
          .from("purchase_log")
          .select("id, created_at, site_url, user_log");

        if (error) {
          console.error("Supabase Fetch Error:", error);
          return;
        }

        console.log("Fetched Raw Data:", JSON.stringify(rawData, null, 2));

        if (!Array.isArray(rawData)) {
          console.error("Unexpected response format", rawData);
          return;
        }

        const parsedData = rawData.map((item: SupabasePurchaseLog) => {
          const userLog = item.user_log;

          return {
            id: item.id,
            title: userLog?.title || "N/A",
            user_email: userLog?.user_email || "N/A",
            payment_method: userLog?.payment_method || "N/A",
            total_amount: userLog?.total_amount || 0,
            purchased_courses: userLog?.purchased_courses || [],
            created_at: item.created_at,
            site_url: item.site_url || "N/A",
          };
        });

        console.log("Parsed Data:", parsedData);
        setData(parsedData);
      } catch (err) {
        console.error("Unexpected Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="table-container">
      <h1 className="text-3xl font-bold mb-6 text-center">📜 FiveHeart Purchase Logs</h1>

      {loading ? (
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      ) : (
        <div className="table-container">
          <h2 className="text-2xl font-semibold text-center mb-4">🛒 Purchase Transactions</h2>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User Email</th>
                <th>Payment Method</th>
                <th>Total Amount</th>
                <th>Courses</th>
                <th>Site URL</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.user_email}</td>
                  <td>{item.payment_method}</td>
                  <td className="text-green-600 font-semibold">
                    ${item.total_amount.toLocaleString()}
                  </td>
                  <td>
                    {item.purchased_courses.length > 0 ? (
                      <ul>
                        {item.purchased_courses.map((course, i) => (
                          <li key={i} className="text-blue-700 font-medium">
                            {course.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td>
                    <a
                      href={item.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.site_url}
                    </a>
                  </td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
