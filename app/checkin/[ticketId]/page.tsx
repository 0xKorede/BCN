import { getSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";

interface PageProps {
  params: { ticketId: string };
}

function formatTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  });
}

export default async function CheckInPage({ params }: PageProps) {
  const { ticketId } = params;

  if (!ticketId || ticketId.length !== 8) {
    return <InvalidTicket />;
  }

  try {
    const supabase = getSupabaseAdmin();

    // Fetch the ticket
    const { data: registration, error } = await supabase
      .from("registrations")
      .select("name, checked_in, checked_in_at")
      .eq("ticket_id", ticketId.toUpperCase())
      .single();

    if (error || !registration) {
      return <InvalidTicket />;
    }

    // Already checked in
    if (registration.checked_in) {
      return (
        <AlreadyCheckedIn
          name={registration.name}
          checkedInAt={formatTime(registration.checked_in_at)}
        />
      );
    }

    // First check-in — mark it
    await supabase
      .from("registrations")
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq("ticket_id", ticketId.toUpperCase());

    return <ValidCheckIn name={registration.name} />;
  } catch (err) {
    console.error("[BCN Checkin] Database lookup error:", err);
    return <InvalidTicket />;
  }
}

/* ── State Components ────────────────────────────────────────────────────── */

function ValidCheckIn({ name }: { name: string }) {
  return (
    <main className="min-h-screen bg-green-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.5)]">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <p className="text-green-400 font-bold text-lg uppercase tracking-widest mb-2">VALID TICKET</p>
      <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
        Welcome,<br />{name}!
      </h1>
      <p className="text-green-300 text-lg font-medium">Entry granted — enjoy BCN Hangout 2026! 🎉</p>
    </main>
  );
}

function AlreadyCheckedIn({ name, checkedInAt }: { name: string; checkedInAt: string }) {
  return (
    <main className="min-h-screen bg-amber-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.5)]">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-amber-400 font-bold text-lg uppercase tracking-widest mb-2">ALREADY CHECKED IN</p>
      <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
        {name}
      </h1>
      {checkedInAt && (
        <p className="text-amber-300 text-base font-medium">
          Checked in at {checkedInAt}
        </p>
      )}
      <p className="text-amber-400/70 text-sm mt-2">This ticket has already been used for entry.</p>
    </main>
  );
}

function InvalidTicket() {
  return (
    <main className="min-h-screen bg-red-950 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.5)]">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-red-400 font-bold text-lg uppercase tracking-widest mb-2">INVALID TICKET</p>
      <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
        Not Found
      </h1>
      <p className="text-red-300 text-base font-medium">
        This ticket does not exist or is invalid.<br />Please contact a BCN staff member.
      </p>
    </main>
  );
}
