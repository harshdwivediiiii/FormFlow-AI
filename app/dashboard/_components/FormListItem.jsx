import { Button } from '@/components/ui/button'
import { Edit, Share, Trash, Eye, Copy } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { toast } from 'sonner'

function FormListItem({ formRecord, jsonForm, refreshData }) {
    const { user } = useUser();
    const [openPreview, setOpenPreview] = useState(false);
    const formLink = `${process.env.NEXT_PUBLIC_BASE_URL}/aiform/${formRecord?.id}`;

    const onDeleteForm = async () => {
        const result = await db.delete(JsonForms)
            .where(and(eq(JsonForms.id, formRecord.id),
                eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))

        if (result) {
            toast('Form Deleted!!!');
            refreshData()
        }
    }

    const copyFormLink = () => {
        navigator.clipboard.writeText(formLink);
        toast('Form link copied!');
    }

    return (
        <div className='border shadow-sm rounded-lg p-4'>
            <div className='flex justify-between'>
                {/* Status Badge */}
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${jsonForm?.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {jsonForm?.status || "Draft"}
                </span>

                {/* Delete Confirmation */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Trash className='h-5 w-5 text-red-600 cursor-pointer hover:scale-105 transition-all' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. It will permanently delete your form.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteForm()}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Form Title & Heading */}
            <h2 className='text-lg text-black'>{jsonForm?.formTitle}</h2>
            <h2 className='text-sm text-gray-500'>{jsonForm?.formHeading}</h2>

            {/* Last Updated Time */}
            <p className="text-xs text-gray-500 mt-1">Last updated: {jsonForm?.updatedAt || "N/A"}</p>

            <hr className='my-4' />

            <div className='flex justify-between'>
                {/* Share Button */}
                <Button 
    variant="outline" 
    size="sm" 
    className="flex gap-2" 
    onClick={() => {
        if (navigator.share) {
            navigator.share({
                title: jsonForm?.formTitle,
                text: jsonForm?.formHeading + " - Build your form in seconds with AI Form Builder",
                url: formLink,
            }).then(() => console.log("Shared successfully"))
            .catch((error) => console.error("Error sharing:", error));
        } else {
            toast("Web Share API not supported on this device.");
        }
    }}>
    <Share className='h-5 w-5' /> Share
</Button>

                {/* Copy Link Button */}
                <Button variant="outline" size="sm" className="flex gap-2" onClick={copyFormLink}>
                    <Copy className='h-5 w-5' /> Copy Link
                </Button>

                {/* Preview Button */}
                <Button variant="outline" size="sm" className="flex gap-2" onClick={() => setOpenPreview(true)}>
                    <Eye className='h-5 w-5' /> Preview
                </Button>

                {/* Edit Button */}
                <Link href={'/edit-form/' + formRecord?.id}>
                    <Button className="flex gap-2" size="sm">
                        <Edit className='h-5 w-5' /> Edit
                    </Button>
                </Link>
            </div>

            {/* Form Preview Modal */}
            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Form Preview</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h2 className="text-lg font-semibold">{jsonForm?.formTitle}</h2>
                        <p className="text-sm text-gray-600">{jsonForm?.formHeading}</p>
                        <p className="text-xs text-gray-500 mt-2">[Form fields preview here...]</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FormListItem
