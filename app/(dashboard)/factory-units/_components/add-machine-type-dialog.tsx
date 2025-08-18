"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const AddMachineTypeDialog = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/sewing-machine/machine-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, code }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      console.log(response);

      setOpen(false);
      setName("");
      setCode("");
      router.refresh();

      toast({
        title: "Machine type added successfully",
        description: `${name} (${code})`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to add machine type",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-slate-600 ">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add new 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Machine Type</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Name</label>
            <Input
              value={name}
              disabled={isSubmitting}
              onChange={(e) => {
                const upperValue = e.target.value.toUpperCase();
                setName(upperValue);
              }}
              placeholder="Enter machine type name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Code</label>
            <Input
              value={code}
              disabled={isSubmitting}
              onChange={(e) => {
                const upperValue = e.target.value.toUpperCase();
                setCode(upperValue);
              }}
              placeholder="Enter machine type code"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
