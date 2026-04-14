import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Trash2, Eye, CheckCheck, MessageSquare, Clock, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "unread" | "read" | "replied";

const STATUS_LABELS: Record<Status, string> = {
  unread: "Unread",
  read: "Read",
  replied: "Replied",
};

const STATUS_COLORS: Record<Status, string> = {
  unread: "bg-red-100 text-red-700 border-red-200",
  read: "bg-blue-100 text-blue-700 border-blue-200",
  replied: "bg-green-100 text-green-700 border-green-200",
};

export default function AdminMessages() {
  const utils = trpc.useUtils();
  const { data: messages = [], isLoading } = trpc.admin.messages.list.useQuery();
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const updateStatus = trpc.admin.messages.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.messages.list.invalidate();
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMessage = trpc.admin.messages.delete.useMutation({
    onSuccess: () => {
      utils.admin.messages.list.invalidate();
      setSelectedMessage(null);
      toast.success("Message deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleOpen = (msg: (typeof messages)[0]) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.adminNotes ?? "");
    // Auto-mark as read when opened
    if (msg.status === "unread") {
      updateStatus.mutate({ id: msg.id, status: "read" });
    }
  };

  const handleStatusChange = (status: Status) => {
    if (!selectedMessage) return;
    updateStatus.mutate(
      { id: selectedMessage.id, status, adminNotes: adminNotes || undefined },
      {
        onSuccess: () => {
          setSelectedMessage((prev) => prev ? { ...prev, status, adminNotes } : null);
        },
      }
    );
  };

  const handleSaveNotes = () => {
    if (!selectedMessage) return;
    updateStatus.mutate(
      { id: selectedMessage.id, status: selectedMessage.status as Status, adminNotes },
      {
        onSuccess: () => {
          setSelectedMessage((prev) => prev ? { ...prev, adminNotes } : null);
          toast.success("Notes saved");
        },
      }
    );
  };

  const filtered = messages.filter((m) => {
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-6 h-6 text-lotus-green" />
            Contact Messages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {messages.length} total message{messages.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-red-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | Status)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No messages found</p>
          <p className="text-sm mt-1">
            {messages.length === 0
              ? "Contact form submissions will appear here."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpen(msg)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md hover:border-lotus-green/30 ${
                msg.status === "unread"
                  ? "bg-red-50/50 border-red-200"
                  : "bg-card border-border"
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-lotus-green/10 flex items-center justify-center shrink-0 font-semibold text-lotus-green text-sm">
                {msg.name.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${msg.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}>
                    {msg.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{msg.email}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ml-auto ${STATUS_COLORS[msg.status as Status]}`}
                  >
                    {STATUS_LABELS[msg.status as Status]}
                  </Badge>
                </div>
                <p className={`text-sm mt-0.5 truncate ${msg.status === "unread" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {msg.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {msg.message}
                </p>
              </div>

              {/* Date */}
              <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(msg.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-lotus-green" />
                  {selectedMessage.subject}
                </DialogTitle>
              </DialogHeader>

              {/* Sender info */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-16">From:</span>
                  <span className="font-medium">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-16">Email:</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-lotus-green hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-16">Date:</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Message body */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Message</h4>
                <div className="bg-card border border-border rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status management */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {(["unread", "read", "replied"] as Status[]).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedMessage.status === s ? "default" : "outline"}
                      className={selectedMessage.status === s ? "bg-lotus-green hover:bg-lotus-green/90" : ""}
                      onClick={() => handleStatusChange(s)}
                      disabled={updateStatus.isPending}
                    >
                      {s === "unread" && <Mail className="w-3.5 h-3.5 mr-1.5" />}
                      {s === "read" && <Eye className="w-3.5 h-3.5 mr-1.5" />}
                      {s === "replied" && <CheckCheck className="w-3.5 h-3.5 mr-1.5" />}
                      {STATUS_LABELS[s]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Admin notes */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this message..."
                  rows={3}
                  className="resize-none"
                />
                <Button
                  size="sm"
                  className="mt-2 bg-lotus-green hover:bg-lotus-green/90"
                  onClick={handleSaveNotes}
                  disabled={updateStatus.isPending}
                >
                  Save Notes
                </Button>
              </div>

              {/* Quick reply link */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 text-sm text-lotus-green hover:underline font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Reply via email client
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("Delete this message? This cannot be undone.")) {
                      deleteMessage.mutate({ id: selectedMessage.id });
                    }
                  }}
                  disabled={deleteMessage.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
