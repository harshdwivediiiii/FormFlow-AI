"use client"; 
import FormUi from '@/app/edit-form/_components/FormUi';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function LiveAiForm() {
    const params = useParams(); // Directly use the hook

    const [record, setRecord] = useState(null);
    const [jsonForm, setJsonForm] = useState([]);

    useEffect(() => {
        if (params?.formid) {
            GetFormData(params.formid);
        }
    }, [params]);

    const GetFormData = async (formId) => {
        try {
            const result = await db
                .select()
                .from(JsonForms)
                .where(eq(JsonForms.id, Number(formId)));

            if (result.length > 0) {
                setRecord(result[0]);
                setJsonForm(JSON.parse(result[0].jsonform));
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    return (
        <div
            className="p-10 flex justify-center items-center"
            style={{ backgroundImage: record?.background }}
        >
            {record && (
                <FormUi
                    jsonForm={jsonForm}
                    onFieldUpdate={() => console.log}
                    deleteField={() => console.log}
                    selectedStyle={JSON.parse(record?.style)}
                    selectedTheme={record?.theme}
                    editable={false}
                    formId={record.id}
                    enabledSignIn={record?.enabledSignIn}
                />
            )}

            <Link
                className="flex gap-2 items-center bg-black text-white px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer"
                href={'/'}
            >
                <Image src={'/logo.png'} width={26} height={26} alt="logo" />
                Build your Own AI form
            </Link>
        </div>
    );
}

export default LiveAiForm;
