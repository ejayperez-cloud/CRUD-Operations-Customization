'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/lib/config";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

interface Position {
  position_id?: number;
  position_code: string;
  position_name: string;
  position_type: string;
  department: string;
  id: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [positionType, setPositionType] = useState("");
  const [department, setDepartment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tok = getToken();
    if (!tok) {
      router.push("/login");
      return;
    }
    setToken(tok);
    fetchPositions();
  }, [router]);

  async function fetchPositions() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/positions`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = {
      id: 1,
      position_code: positionCode,
      position_name: positionName,
      position_type: positionType,
      department: department
    };

    const url = editingId ? `${API_BASE}/positions/${editingId}` : `${API_BASE}/positions`;

    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(body),
    });

    setEditingId(null);
    setPositionCode("");
    setPositionName("");
    setPositionType("");
    setDepartment("");
    fetchPositions();
  }

  return (
    <div className="min-h-screen p-8 flex flex-col bg-gradient-to-r from-red-700 via-red-800 to-zinc-900">
      <div className="flex-grow">
        <h1 className="text-center text-3xl font-bold text-white mb-4">Positions Dashboard</h1>

        <div className="p-6 rounded-3xl border-2 border-purple-600 bg-gradient-to-br from-red-300/40 to-zinc-800/40 shadow-xl mb-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 text-black font-semibold text-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-white">Create Position</span>
              <div className="flex gap-4">
                <Button className="bg-black text-white rounded-full px-6 py-2">{editingId ? "Update" : "Create"}</Button>
                <Button type="button" onClick={fetchPositions} className="bg-black text-white rounded-full px-6 py-2">{loading ? "Refreshing..." : "Refresh"}</Button>
              </div>
            </div>

            {/* Two inputs per line */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Input value={positionCode} onChange={(e) => setPositionCode(e.target.value)} placeholder="Position Code" className="flex-1 min-w-[45%] rounded-full bg-red-200/50 text-black placeholder-black text-center" />
              <Input value={positionName} onChange={(e) => setPositionName(e.target.value)} placeholder="Position Name" className="flex-1 min-w-[45%] rounded-full bg-red-200/50 text-black placeholder-black text-center" />
              <Input value={positionType} onChange={(e) => setPositionType(e.target.value)} placeholder="Position Type" className="flex-1 min-w-[45%] rounded-full bg-red-200/50 text-black placeholder-black text-center" />
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" className="flex-1 min-w-[45%] rounded-full bg-red-200/50 text-black placeholder-black text-center" />
            </div>
          </form>

          {/* Table */}
          <div className="rounded-3xl overflow-hidden border border-purple-600">
            <table className="w-full text-black">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-b from-gray-400 via-gray-600 to-red-800 text-white">
                {positions.map((p) => <tr key={p.position_id} className="text-center"><td className="px-4 py-3">{p.position_id}</td><td className="px-4 py-3">{p.position_code}</td><td className="px-4 py-3">{p.position_name}</td><td className="px-4 py-3">{p.position_type}</td><td className="px-4 py-3">{p.department}</td><td className="px-4 py-3"><div className="flex items-center justify-center gap-3"><Button onClick={() => {setEditingId(p.position_id!); setPositionCode(p.position_code); setPositionName(p.position_name); setPositionType(p.position_type); setDepartment(p.department);}} className="bg-black text-white rounded-full px-5 py-1.5 w-24">Edit</Button><Button onClick={() => {fetch(`${API_BASE}/positions/${p.position_id}`, {method:"DELETE",headers:{Authorization:`Bearer ${getToken()}`}}).then(fetchPositions);}} className="bg-red-600 text-white rounded-full px-5 py-1.5 w-24">Delete</Button></div></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bearer token */}
      {token && <footer className="text-white text-sm text-center mt-8"><div className="break-all px-4 py-2 bg-black bg-opacity-50 rounded-lg max-w-full overflow-x-auto"><strong>Bearer Token:</strong> <code>{token}</code></div></footer>}
    </div>
  );
}
