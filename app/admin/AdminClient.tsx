"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Registration } from "@/lib/supabase";
import {
  Search,
  CheckCircle2,
  XCircle,
  LogOut,
  RefreshCw,
  Download,
  Users,
  UserCheck,
  Clock,
  Check,
  RotateCcw,
  Loader2,
  Trash2,
} from "lucide-react";

interface AdminClientProps {
  initialRegistrations: Registration[];
}

export function AdminClient({ initialRegistrations }: AdminClientProps) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "checked_in" | "pending">("all");
  const [isPending, startTransition] = useTransition();
  const [togglingTicketId, setTogglingTicketId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats
  const totalCount = registrations.length;
  const checkedInCount = registrations.filter((r) => r.checked_in).length;
  const pendingCount = totalCount - checkedInCount;
  const checkinRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  // Filtered rows
  const filteredRows = registrations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.whatsapp && r.whatsapp.toLowerCase().includes(search.toLowerCase())) ||
      r.role.toLowerCase().includes(search.toLowerCase()) ||
      r.ticket_id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "checked_in") return r.checked_in;
    if (filter === "pending") return !r.checked_in;
    return true;
  });

  // Toggle check-in state
  const handleToggleCheckin = async (ticketId: string, currentStatus: boolean) => {
    setTogglingTicketId(ticketId);
    const newStatus = !currentStatus;

    try {
      const res = await fetch("/api/admin/toggle-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, checked_in: newStatus }),
      });

      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.ticket_id === ticketId
              ? {
                  ...r,
                  checked_in: newStatus,
                  checked_in_at: newStatus ? new Date().toISOString() : null,
                }
              : r
          )
        );
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while updating check-in status.");
    } finally {
      setTogglingTicketId(null);
    }
  };

  // Delete registration permanently
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/delete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: deleteTarget.ticket_id, id: deleteTarget.id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations((prev) => prev.filter((r) => r.ticket_id !== deleteTarget.ticket_id));
        setDeleteTarget(null);
      } else {
        alert(data.message || "Failed to delete registration. Please try again.");
      }
    } catch (err) {
      console.error("[BCN Admin Delete] Client error:", err);
      alert("Network error while deleting registration.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Refresh data from server
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ["Ticket ID", "Name", "Email", "WhatsApp", "Role", "Checked In", "Checked In At", "Registered At"];
    const rows = registrations.map((r) => [
      r.ticket_id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${(r.whatsapp || "").replace(/"/g, '""')}"`,
      `"${r.role.replace(/"/g, '""')}"`,
      r.checked_in ? "Yes" : "No",
      r.checked_in_at || "",
      r.created_at || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bcn-hangout-registrations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F5F1E8] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Top Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-bcn-orange animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-bcn-orange">
                STAFF ACCESS ONLY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              BCN Hangout 2026 — Door &amp; Registration Portal
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isPending}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/10 flex items-center gap-1.5 transition-colors"
              title="Refresh registration data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-bcn-orange" : "text-[#A39C90]"}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-white/10 flex items-center gap-1.5 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-3.5 h-3.5 text-bcn-amber" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ── KPI Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8C857B] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Total Registered</span>
              <Users className="w-4 h-4 text-bcn-orange" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalCount}</p>
          </div>

          <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8C857B] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Checked In</span>
              <UserCheck className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-400">{checkedInCount}</p>
          </div>

          <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8C857B] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Pending Arrival</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{pendingCount}</p>
          </div>

          <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8C857B] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Attendance Rate</span>
              <span className="text-xs font-bold text-bcn-amber">{checkinRate}%</span>
            </div>
            <div className="w-full bg-[#262626] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-bcn-gradient h-full rounded-full transition-all duration-500"
                style={{ width: `${checkinRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#161616] border border-white/10 rounded-2xl p-3 sm:p-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C857B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role, or ticket ID..."
              className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F1E8] placeholder-[#6C665D] focus:outline-none focus:border-bcn-orange/60 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto bg-[#0E0E0E] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === "all" ? "bg-bcn-orange text-black font-bold" : "text-[#8C857B] hover:text-white"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter("checked_in")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === "checked_in" ? "bg-green-600 text-white font-bold" : "text-[#8C857B] hover:text-white"
              }`}
            >
              Checked In ({checkedInCount})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === "pending" ? "bg-amber-600 text-white font-bold" : "text-[#8C857B] hover:text-white"
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C] border-b border-white/10 text-[#8C857B] uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-4">Attendee</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Check-in Time</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Registered</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-normal">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8C857B]">
                      {search ? "No attendees matching your search criteria." : "No registrations found in Supabase yet."}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r) => {
                    const isToggling = togglingTicketId === r.ticket_id;

                    return (
                      <tr
                        key={r.id || r.ticket_id}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          r.checked_in ? "bg-green-950/10" : ""
                        }`}
                      >
                        {/* Attendee Name & Email & WhatsApp */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{r.name}</div>
                          <div className="text-[11px] text-[#8C857B] truncate max-w-[200px]">{r.email}</div>
                          {r.whatsapp && (
                            <div className="text-[11px] text-[#A39C90] truncate max-w-[200px] flex items-center gap-1 mt-0.5 font-mono">
                              <span className="text-bcn-orange">WA:</span> {r.whatsapp}
                            </div>
                          )}
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4 text-[#DFD8CE]">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-[#242424] border border-white/10 text-xs">
                            {r.role}
                          </span>
                        </td>

                        {/* Ticket Code */}
                        <td className="py-3.5 px-4 font-mono font-bold tracking-wider text-bcn-amber text-xs">
                          {r.ticket_id}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {r.checked_in ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-950/60 border border-green-700/60 text-green-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/60 border border-amber-700/60 text-amber-400">
                              <XCircle className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Checked in at */}
                        <td className="py-3.5 px-4 text-xs text-[#8C857B] hidden md:table-cell">
                          {r.checked_in_at
                            ? new Date(r.checked_in_at).toLocaleTimeString("en-NG", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "—"}
                        </td>

                        {/* Registered at */}
                        <td className="py-3.5 px-4 text-xs text-[#8C857B] hidden lg:table-cell">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" }) : "—"}
                        </td>

                        {/* Manual Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleCheckin(r.ticket_id, r.checked_in)}
                              disabled={isToggling}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                r.checked_in
                                  ? "bg-[#252525] hover:bg-[#333333] text-[#A39C90] hover:text-white border border-white/10"
                                  : "bg-bcn-orange hover:bg-bcn-amber text-black shadow-[0_0_15px_rgba(255,132,0,0.3)]"
                              }`}
                              title={r.checked_in ? "Undo check-in" : "Check attendee in"}
                            >
                              {isToggling ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : r.checked_in ? (
                                <>
                                  <RotateCcw className="w-3 h-3" />
                                  Undo
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  Check In
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(r)}
                              className="p-1.5 rounded-lg text-[#8C857B] hover:text-[#FF5533] hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                              title={`Delete ${r.name}`}
                              aria-label={`Delete ${r.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[#5C564E] pt-2">
          BCN Staff Portal &bull; Real-time check-in verification for BCN Hangout 2026
        </p>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161616] border border-red-500/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3 text-[#FF5533]">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Registration?</h3>
                <p className="text-xs text-[#8C857B]">Permanent action — cannot be undone</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8C857B]">Name:</span>
                <span className="font-semibold text-white">{deleteTarget.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C857B]">Email:</span>
                <span className="text-[#DFD8CE]">{deleteTarget.email}</span>
              </div>
              {deleteTarget.whatsapp && (
                <div className="flex justify-between">
                  <span className="text-[#8C857B]">WhatsApp:</span>
                  <span className="text-bcn-amber font-mono">{deleteTarget.whatsapp}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#8C857B]">Ticket Code:</span>
                <span className="font-mono font-bold text-bcn-orange">{deleteTarget.ticket_id}</span>
              </div>
            </div>

            <p className="text-xs text-[#A39C90] leading-relaxed">
              This will completely delete this attendee from the Supabase database and door check-in system.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#DFD8CE] hover:text-white bg-[#252525] hover:bg-[#303030] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Yes, Delete Attendee
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
