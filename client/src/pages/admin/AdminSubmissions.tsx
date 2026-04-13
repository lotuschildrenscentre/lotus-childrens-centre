import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Eye, Trash2, ArrowLeft } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewed: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminSubmissions() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteDialogId, setDeleteDialogId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: submissions, isLoading } = trpc.admin.submissions.list.useQuery();
  const { data: detail } = trpc.admin.submissions.getById.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  const updateStatus = trpc.admin.submissions.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.submissions.list.invalidate();
      utils.admin.submissions.getById.invalidate();
      utils.admin.stats.invalidate();
      toast.success("Status updated");
    },
  });

  const deleteMutation = trpc.admin.submissions.delete.useMutation({
    onSuccess: () => {
      utils.admin.submissions.list.invalidate();
      utils.admin.stats.invalidate();
      setDeleteDialogId(null);
      if (selectedId === deleteDialogId) setSelectedId(null);
      toast.success("Submission deleted");
    },
  });

  // Detail view
  if (selectedId && detail) {
    const fields = [
      { label: "Full Name", value: detail.fullName },
      { label: "Email", value: detail.email },
      { label: "Date of Birth", value: detail.dateOfBirth },
      { label: "Nationality", value: detail.nationality },
      { label: "Languages", value: detail.languages },
      { label: "Intended Dates", value: detail.intendedDates },
      { label: "How Can They Help", value: detail.howHelp },
      { label: "Experience", value: detail.experience },
      { label: "Why Volunteer", value: detail.whyVolunteer },
      { label: "Criminal Record", value: detail.criminalRecord },
      { label: "Convictions", value: detail.convictions },
      { label: "Code of Conduct", value: detail.codeOfConduct },
      { label: "How Heard About Lotus", value: detail.hearAbout },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Application: {detail.fullName}
          </h1>
          <Badge className={statusColors[detail.status]}>{detail.status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field) => (
                  <div key={field.label}>
                    <label className="text-sm font-medium text-muted-foreground">
                      {field.label}
                    </label>
                    <p className="mt-1 text-foreground whitespace-pre-wrap">
                      {field.value || "—"}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Status
                  </label>
                  <Select
                    value={detail.status}
                    onValueChange={(value) => {
                      updateStatus.mutate({
                        id: detail.id,
                        status: value as "pending" | "reviewed" | "approved" | "rejected",
                        adminNotes: adminNotes || undefined,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Admin Notes
                  </label>
                  <Textarea
                    value={adminNotes || detail.adminNotes || ""}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={4}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      updateStatus.mutate({
                        id: detail.id,
                        status: detail.status,
                        adminNotes,
                      });
                    }}
                  >
                    Save Notes
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground pt-4 border-t">
                  <p>Submitted: {new Date(detail.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(detail.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Volunteer Applications
        </h1>
        <p
          className="text-muted-foreground mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Review and manage volunteer application submissions
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : !submissions?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No volunteer applications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {sub.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {sub.email}
                        {sub.intendedDates ? ` · ${sub.intendedDates}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={statusColors[sub.status]}>{sub.status}</Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedId(sub.id);
                        setAdminNotes("");
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialogId(sub.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteDialogId} onOpenChange={() => setDeleteDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this volunteer application? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogId && deleteMutation.mutate({ id: deleteDialogId })}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
