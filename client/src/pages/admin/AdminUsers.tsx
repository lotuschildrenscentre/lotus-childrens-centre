import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Shield, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [confirmDialog, setConfirmDialog] = useState<{
    userId: number;
    name: string;
    newRole: "user" | "admin";
  } | null>(null);

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.users.list.useQuery();

  const updateRole = trpc.admin.users.updateRole.useMutation({
    onSuccess: () => {
      utils.admin.users.list.invalidate();
      utils.admin.stats.invalidate();
      setConfirmDialog(null);
      toast.success("User role updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          User Management
        </h1>
        <p
          className="text-muted-foreground mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Manage users and assign admin roles
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : !users?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground text-sm">Name</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Email</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Role</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Joined</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Last Login</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{u.name || "—"}</span>
                        {isSelf && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">
                      {u.email || "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        className={
                          u.role === "admin"
                            ? "bg-lotus-green/10 text-lotus-green border-lotus-green/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {u.role === "admin" ? (
                          <ShieldCheck className="h-3 w-3 mr-1" />
                        ) : (
                          <Shield className="h-3 w-3 mr-1" />
                        )}
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">
                      {new Date(u.lastSignedIn).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Select
                          value={u.role}
                          onValueChange={(value) => {
                            setConfirmDialog({
                              userId: u.id,
                              name: u.name || "this user",
                              newRole: value as "user" | "admin",
                            });
                          }}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm role change dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to change <strong>{confirmDialog?.name}</strong>'s role
            to <strong>{confirmDialog?.newRole}</strong>?
            {confirmDialog?.newRole === "admin" &&
              " They will have full access to the admin panel."}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmDialog) {
                  updateRole.mutate({
                    userId: confirmDialog.userId,
                    role: confirmDialog.newRole,
                  });
                }
              }}
              className="bg-lotus-green hover:bg-lotus-green/90"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
