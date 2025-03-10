"use client";

import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function EditForm() {
  const params = useParams();
  const formId = params?.formId;
  const { user } = useUser();
  const router = useRouter();

  const [jsonForm, setJsonForm] = useState([]);
  const [record, setRecord] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedStyle, setSelectedStyle] = useState({});

  // Fetch Form Data
  useEffect(() => {
    if (!user || !formId) return;

    const fetchFormData = async () => {
      try {
        const result = await db
          .select()
          .from(JsonForms)
          .where(
            and(
              eq(JsonForms.id, formId),
              eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
            )
          );

        if (result.length === 0) return;

        const formData = result[0];

        setRecord(formData);
        setJsonForm(JSON.parse(formData.jsonform));
        setSelectedBackground(formData.background);
        setSelectedTheme(formData.theme);
        setSelectedStyle(JSON.parse(formData.style));
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form data.");
      }
    };

    fetchFormData();
  }, [user, formId]);

  // Update Field Values
  const onFieldUpdate = (value, index) => {
    setJsonForm((prevJsonForm) => {
      const updatedFields = [...prevJsonForm.fields];
      updatedFields[index] = { ...updatedFields[index], ...value };
      return { ...prevJsonForm, fields: updatedFields };
    });

    updateJsonFormInDb();
  };

  // Update Database
  const updateJsonFormInDb = async () => {
    if (!record) return;

    try {
      await db
        .update(JsonForms)
        .set({ jsonform: JSON.stringify(jsonForm) })
        .where(
          and(
            eq(JsonForms.id, record.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      toast.success("Form updated successfully!");
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to update form.");
    }
  };

  // Delete Field
  const deleteField = (indexToRemove) => {
    setJsonForm((prevJsonForm) => ({
      ...prevJsonForm,
      fields: prevJsonForm.fields.filter((_, index) => index !== indexToRemove),
    }));

    updateJsonFormInDb();
  };

  // Update Controller Fields
  const updateControllerFields = async (value, columnName) => {
    if (!record) return;

    try {
      await db
        .update(JsonForms)
        .set({ [columnName]: value })
        .where(
          and(
            eq(JsonForms.id, record.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      toast.success("Updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("Update failed.");
    }
  };

  if (!record) return <p className="text-center">Loading...</p>;
  const shareForm = () => {
    if (navigator.share) {
        navigator.share({
            title: jsonForm?.formTitle,
            text: jsonForm?.formHeading + " - Build your form in seconds with AI Form Builder",
            url: formLink,
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
        toast("Sharing not supported on this device.");
    }
};


  return (
    <div className="p-10">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2
          className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back
        </h2>
        <div className="flex gap-2">
          <Link href={`/aiform/${record.id}`} target="_blank">
            <Button className="flex gap-2">
              <SquareArrowOutUpRight className="h-5 w-5" /> Live Preview
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="flex gap-2" onClick={shareForm}>
    <Share2 className='h-5 w-5' /> Share
</Button>

        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Controller */}
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            selectedTheme={(value) => {
              updateControllerFields(value, "theme");
              setSelectedTheme(value);
            }}
            selectedBackground={(value) => {
              updateControllerFields(value, "background");
              setSelectedBackground(value);
            }}
            selectedStyle={(value) => {
              setSelectedStyle(value);
              updateControllerFields(value, "style");
            }}
            setSignInEnable={(value) => updateControllerFields(value, "enabledSignIn")}
          />
        </div>

        {/* Right: Form UI */}
        <div
          className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center"
          style={{ backgroundImage: selectedBackground }}
        >
          <FormUi
            jsonForm={jsonForm}
            selectedTheme={selectedTheme}
            selectedStyle={selectedStyle}
            onFieldUpdate={onFieldUpdate}
            deleteField={deleteField}
          />
        </div>
      </div>
    </div>
  );
}

export default EditForm;
