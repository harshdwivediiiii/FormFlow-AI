"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AiChatSession } from '@/configs/AiModal'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { desc, eq } from 'drizzle-orm'
import { Input } from '@/components/ui/input'

const PROMPT = ", On Basis of description create JSON form with formTitle, formHeading along with fieldName, FieldTitle, FieldType, Placeholder, Label, Required fields, and checkbox and select field type options will be in array only and in JSON format."

const templates = {
    "Feedback Form": "A form to collect user feedback with ratings and comments.",
    "Survey Form": "A form with multiple-choice and text input questions.",
    "Registration Form": "A form to collect user details like name, email, and phone number.",
    "Contact Form": "A form to collect user contact details like name, email, and phone number.",
    "Payment Form": "A form to collect user payment details like name, email, phone number, and card details.",
    "Request Form": "A form to collect user request details like name, email, phone number, and message.",
    "Order Form": "A form to collect user order details like name, email, phone number, and order items.",
    "Event Form": "A form to collect user event details like name, email, phone number, and event date and time.",
    "Login Form": "A form to allow users to log in using their email and password.",
    "Signup Form": "A form to register new users with name, email, password, and phone number.",
    "Booking Form": "A form to book appointments, services, or reservations.",
    "Complaint Form": "A form for users to submit complaints with details about the issue.",
    "Support Ticket Form": "A form to collect user support requests with issue descriptions.",
    "Newsletter Subscription Form": "A form to collect user email addresses for newsletters.",
    "Donation Form": "A form to collect donation details, including amount and payment method.",
    "Job Application Form": "A form for users to apply for jobs by submitting personal and resume details.",
    "Membership Form": "A form to register users for memberships with tier selection options.",
    "Product Review Form": "A form to collect user reviews and ratings for products.",
    "Medical History Form": "A form to collect a patient's medical history and health details.",
    "Volunteer Application Form": "A form for users to sign up as volunteers for an organization or event.",
    "Course Enrollment Form": "A form to register students for online or offline courses.",
    "Workshop Registration Form": "A form to collect details of participants for workshops.",
    "Resume Submission Form": "A form to allow users to upload and submit resumes.",
    "Property Inquiry Form": "A form for users to inquire about real estate properties.",
    "Rental Application Form": "A form for users to apply for renting an apartment or house.",
    "Warranty Registration Form": "A form to register purchased products for warranty services.",
    "Pet Adoption Form": "A form for users to apply for pet adoptions, collecting necessary details.",
    "Scholarship Application Form": "A form for students to apply for scholarships with required documents.",
    "Insurance Claim Form": "A form to collect details for insurance claims.",
    "Internship Application Form": "A form to apply for internships with personal and academic details.",
    "Business Inquiry Form": "A form for businesses to submit inquiries or collaboration requests.",
    "Contest Entry Form": "A form to collect entries for contests or giveaways.",
    "Guest Speaker Form": "A form to invite or apply as a guest speaker for an event.",
    "Referral Form": "A form for users to refer friends or clients to a business or service.",
    "Sponsorship Request Form": "A form to apply for sponsorships for events or organizations.",
    "Health Screening Form": "A form to collect health screening details from individuals.",
    "Vehicle Registration Form": "A form to collect vehicle registration details.",
    "Expense Reimbursement Form": "A form for employees to request expense reimbursements.",
    "Change of Address Form": "A form for users to update their address information.",
    "Lost and Found Form": "A form to report lost or found items.",
    "Custom Order Form": "A form to collect details for customized product orders.",
    "IT Support Request Form": "A form to request IT support for technical issues.",
    "Incident Report Form": "A form to report workplace or public incidents.",
    "Home Service Request Form": "A form to request home maintenance or repair services.",
    "Training Registration Form": "A form to register for professional training programs.",
    "Travel Booking Form": "A form to collect travel booking details like destination, dates, and passengers.",
    "Childcare Enrollment Form": "A form to register children for daycare or preschool services.",
    "Tenant Maintenance Request Form": "A form for tenants to request maintenance services for rental properties."
};

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState("")
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const [ filteredTemplates,setFilteredTemplates] = useState(Object.keys(templates))
    const [searchQuery, setSearchQuery] = useState("")
    const route = useRouter()
    const [formList, setFormList] = useState([])

    useEffect(() => {
        if (user) GetFormList()
    }, [user])
    
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredTemplates(Object.keys(templates))
        } else {
            setFilteredTemplates(
                Object.keys(templates).filter((key) =>
                    key.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        }
    }, [searchQuery])
    const GetFormList = async () => {
        const result = await db.select().from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(JsonForms.id))

        setFormList(result)
    }

    const onCreateForm = async () => {
        if (formList?.length >= 3) {
            toast('Upgrade to create unlimited forms')
            return
        }
        setLoading(true)
        const result = await AiChatSession.sendMessage("Description:" + userInput + PROMPT)
        console.log(result.response.text())

        if (result.response.text()) {
            const resp = await db.insert(JsonForms)
                .values({
                    jsonform: result.response.text(),
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD/MM/yyyy')
                }).returning({ id: JsonForms.id })

            console.log("New Form ID", resp[0].id)
            if (resp[0].id) {
                route.push('/edit-form/' + resp[0].id)
            }
        }
        setLoading(false)
    }


    return (
        <div>
            <Button className="w-full mb-4 bg-gray-600 hover:bg-white hover:text-gray-500" onClick={() => setOpenDialog(true)}>+ Create Form</Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                        <DialogDescription>
                            Enter a description for your form or select a template.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Template Selector */}
                    <Select onValueChange={(value) => setUserInput(templates[value] || "")}>
                        <SelectTrigger className="w-full my-2">
                            <SelectValue placeholder="Select a template" />
                         
    
                        </SelectTrigger>
                        {/* Search Template */}
                    <div className='relative'>
                        
                        <Input 
                            className="my-2" 
                            placeholder="Search template..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                        </div>
                        <SelectContent>
                            {Object.keys(templates).map((key) => (
                                <SelectItem key={key} value={key}>
                                    {key}
                                </SelectItem>
                            ))}
                              
                        </SelectContent>
                         
                    </Select>

                    {/* Manual Form Description Input */}
                    <Textarea
                        className="my-2"
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        placeholder="Write description of your form"
                    />

                    {/* Buttons */}
                    <div className='flex gap-2 my-3 justify-end'>
                        <Button onClick={() => setOpenDialog(false)} variant="destructive">
                            Cancel
                        </Button>
                        <Button disabled={loading} onClick={onCreateForm}>
                            {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm
