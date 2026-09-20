"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TeamMember } from "@/lib/supabase";
import {
  Users2,
  Upload,
  X,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

interface TeamManagementProps {
  initialTeamMembers: TeamMember[];
}

function AvatarThumbnail({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bcn-orange/30 via-bcn-amber/20 to-bcn-burgundy/30 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0 select-none">
      {initials}
    </div>
  );
}

export function TeamManagement({ initialTeamMembers }: TeamManagementProps) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reordering state
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMembers(initialTeamMembers);
  }, [initialTeamMembers]);

  // Clean up preview object URL
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedPhoto = () => {
    setPhotoFile(null);
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(editingMember?.photo_url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setBio(member.bio);
    setPhotoFile(null);
    setPhotoPreview(member.photo_url || null);
    setFormError(null);
    setFormSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setName("");
    setBio("");
    setPhotoFile(null);
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setFormError(null);
    setFormSuccess(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!name.trim()) {
      setFormError("Please enter the team member's name.");
      return;
    }
    if (!bio.trim()) {
      setFormError("Please enter a bio or role description.");
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("bio", bio.trim());
    if (photoFile) {
      fd.append("photo", photoFile);
    }

    try {
      if (editingMember) {
        // Edit existing
        const res = await fetch(`/api/admin/team/${editingMember.id}`, {
          method: "PATCH",
          body: fd,
        });
        const data = await res.json();
        if (res.ok && data.success && data.member) {
          setMembers((prev) =>
            prev.map((m) => (m.id === editingMember.id ? data.member : m))
          );
          setFormSuccess(`Updated ${data.member.name} successfully!`);
          cancelEdit();
          router.refresh();
        } else {
          setFormError(data.error || "Failed to update team member.");
        }
      } else {
        // Add new member
        const res = await fetch("/api/admin/team", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (res.ok && data.success && data.member) {
          setMembers((prev) => [...prev, data.member]);
          setFormSuccess(`Added ${data.member.name} to the team!`);
          setName("");
          setBio("");
          setPhotoFile(null);
          setPhotoPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          router.refresh();
        } else {
          setFormError(data.error || "Failed to add team member.");
        }
      }
    } catch (err) {
      console.error(err);
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        if (editingMember?.id === deleteTarget.id) {
          cancelEdit();
        }
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(data.error || "Failed to delete team member.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting member.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    setReorderingId(id);
    try {
      const res = await fetch("/api/admin/team/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, direction }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.members) {
        setMembers(data.members);
        router.refresh();
      } else if (!res.ok) {
        alert(data.error || "Failed to reorder.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Form Card: Add or Edit Team Member ── */}
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-bcn-orange/15 border border-bcn-orange/30 flex items-center justify-center">
              {editingMember ? (
                <Pencil className="w-4 h-4 text-bcn-orange" />
              ) : (
                <Plus className="w-4 h-4 text-bcn-orange" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {editingMember ? `Edit: ${editingMember.name}` : "Add New Team Member"}
              </h2>
              <p className="text-xs text-[#5C564E]">
                {editingMember
                  ? "Update member details and photo"
                  : "Add a member to the public Meet the Team section"}
              </p>
            </div>
          </div>

          {editingMember && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs px-3 py-1.5 rounded-lg text-[#8C857B] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {formError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#DFD8CE] mb-1.5">
                Full Name <span className="text-bcn-orange">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Adekunle"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#202020] border border-white/10 text-white placeholder-[#5C564E] text-xs focus:outline-none focus:border-bcn-orange transition-colors"
              />
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-semibold text-[#DFD8CE] mb-1.5">
                Photo <span className="text-[#8C857B] font-normal">(optional, image/*)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="team-photo-input"
                />
                <label
                  htmlFor="team-photo-input"
                  className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#202020] border border-white/10 hover:border-bcn-orange/50 text-xs font-semibold text-[#DFD8CE] hover:text-white cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-bcn-orange" />
                  {photoFile ? photoFile.name : editingMember?.photo_url ? "Replace Photo" : "Choose Image"}
                </label>

                {photoPreview && (
                  <div className="relative group shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-bcn-orange/40"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedPhoto}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-500"
                      title="Clear photo"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-[#DFD8CE] mb-1.5">
              Bio / Role <span className="text-bcn-orange">*</span>
              <span className="text-[#8C857B] font-normal ml-1">
                (2–3 lines displayed on public card)
              </span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell the community about their creative role, passion, or background with BCN..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#202020] border border-white/10 text-white placeholder-[#5C564E] text-xs focus:outline-none focus:border-bcn-orange transition-colors resize-none"
            />
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-end gap-3 pt-1">
            {editingMember && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8C857B] hover:text-white bg-transparent hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-bcn-orange hover:bg-bcn-amber transition-all shadow-[0_0_20px_rgba(255,132,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {editingMember ? "Saving Changes..." : "Adding Member..."}
                </>
              ) : editingMember ? (
                <>
                  <Pencil className="w-3.5 h-3.5" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add Team Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── List: Current Team Members ── */}
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-bcn-orange" />
            <h3 className="text-sm font-bold text-white">Current Team Members</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-[#DFD8CE]">
              {members.length}
            </span>
          </div>
          <p className="text-[11px] text-[#8C857B] hidden sm:block">
            Use arrows to reorder how they appear on the homepage
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-black/20">
            <Users2 className="w-8 h-8 text-[#5C564E] mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No team members yet</p>
            <p className="text-xs text-[#8C857B] mt-1 max-w-sm mx-auto">
              Add your first team member using the form above. When added, the Meet the Team section will appear on the homepage.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {members.map((member, index) => {
              const isFirst = index === 0;
              const isLast = index === members.length - 1;
              const isBusy = reorderingId === member.id;

              return (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#202020] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* Reorder controls */}
                    <div className="flex sm:flex-col items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleReorder(member.id, "up")}
                        disabled={isFirst || isBusy}
                        className="p-1 rounded-md text-[#8C857B] hover:text-bcn-orange hover:bg-white/5 disabled:opacity-20 disabled:hover:text-[#8C857B] disabled:hover:bg-transparent transition-colors"
                        title="Move up"
                        aria-label="Move member up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(member.id, "down")}
                        disabled={isLast || isBusy}
                        className="p-1 rounded-md text-[#8C857B] hover:text-bcn-orange hover:bg-white/5 disabled:opacity-20 disabled:hover:text-[#8C857B] disabled:hover:bg-transparent transition-colors"
                        title="Move down"
                        aria-label="Move member down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <AvatarThumbnail name={member.name} photoUrl={member.photo_url} />

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">
                          {member.name}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#8C857B] font-mono shrink-0">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-xs text-[#8C857B] line-clamp-2 mt-0.5 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(member)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#DFD8CE] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      title="Edit member"
                    >
                      <Pencil className="w-3.5 h-3.5 text-bcn-amber" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(member)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      title="Delete member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161616] border border-red-500/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3 text-[#FF5533]">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Team Member?</h3>
                <p className="text-xs text-[#8C857B]">Permanent action — cannot be undone</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
              <AvatarThumbnail name={deleteTarget.name} photoUrl={deleteTarget.photo_url} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{deleteTarget.name}</p>
                <p className="text-xs text-[#8C857B] line-clamp-1">{deleteTarget.bio}</p>
              </div>
            </div>

            <p className="text-xs text-[#A39C90] leading-relaxed">
              This will remove this member from the public homepage and delete their photo from Supabase storage.
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
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Yes, Delete Member
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
