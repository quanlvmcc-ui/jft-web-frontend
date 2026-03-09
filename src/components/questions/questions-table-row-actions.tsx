"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type {
  Question,
  QuestionUsageResponse,
} from "@/schemaValidations/question.schema";
import {
  useDeleteQuestionMutation,
  useDuplicateQuestionMutation,
  useCheckQuestionUsageMutation,
} from "@/queries/question";

interface QuestionsTableRowActionsProps {
  question: Question;
}

export function QuestionsTableRowActions({
  question,
}: QuestionsTableRowActionsProps) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUsageAlert, setShowUsageAlert] = useState(false);
  const [usageInfo, setUsageInfo] = useState<QuestionUsageResponse | null>(
    null,
  );

  // Mutations
  const deleteMutation = useDeleteQuestionMutation();
  const duplicateMutation = useDuplicateQuestionMutation();
  const checkUsageMutation = useCheckQuestionUsageMutation();

  const handleEdit = () => {
    router.push(`/dashboard/questions/${question.id}/edit`);
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await duplicateMutation.mutateAsync(question.id);
      router.push(`/dashboard/questions/${duplicated.id}/edit`);
    } catch (error) {
      console.error("Failed to duplicate question:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(question.id);
      setShowDeleteAlert(false);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const handleCheckUsage = async () => {
    try {
      const usage = await checkUsageMutation.mutateAsync(question.id);
      setUsageInfo(usage);
      setShowUsageAlert(true);
    } catch (error) {
      console.error("Failed to check usage:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDuplicate}
            disabled={duplicateMutation.isPending}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCheckUsage}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Check Usage
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft delete the question. You can restore it later from
              trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Usage Info Dialog */}
      <AlertDialog open={showUsageAlert} onOpenChange={setShowUsageAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Question Usage</AlertDialogTitle>
            <AlertDialogDescription>
              {usageInfo ? (
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Used in exams:</strong> {usageInfo.count}
                  </p>
                  {usageInfo.isUsed && (
                    <p className="text-sm text-yellow-600">
                      This question is currently used in exams. Deleting it may
                      affect exam content.
                    </p>
                  )}
                  {usageInfo.exams.length > 0 && (
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">Exam list:</p>
                      {usageInfo.exams
                        .slice(0, 5)
                        .map((exam: QuestionUsageResponse["exams"][number]) => (
                          <p
                            key={exam.examId}
                            className="text-muted-foreground"
                          >
                            - {exam.examTitle}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                "Loading..."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
