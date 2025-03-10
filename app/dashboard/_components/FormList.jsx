"use client"
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import FormListItem from './FormListItem'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchIcon } from 'lucide-react';

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [filteredForms, setFilteredForms] = useState([]);

    useEffect(() => {
        if (user) GetFormList();
    }, [user]);

    useEffect(() => {
        // Filter forms based on search input
        const filtered = formList.filter((form) =>
            JSON.parse(form.jsonform)?.formTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredForms(filtered);
    }, [searchTerm, formList]);

    const GetFormList = async () => {
        const result = await db.select().from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(sortOrder === "newest" ? desc(JsonForms.id) : JsonForms.id);
        
        setFormList(result);
        setFilteredForms(result);
        console.log(result);
    };

    return (
        <div className='mt-5'>
            {/* Search & Sorting Controls */}
            <div className='flex gap-3 mb-4'>
                <SearchIcon className='w-6 h-6' />
                <Input
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue="newest">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="bg-gray-600 hover:bg-white hover:text-gray-500" onClick={GetFormList}>Refresh</Button>
            </div>

            {/* Empty State */}
            {filteredForms.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>No forms found.</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
                    {filteredForms.map((form, index) => (
                        <FormListItem 
                            key={form.id}
                            jsonForm={JSON.parse(form.jsonform)}
                            formRecord={form}
                            refreshData={GetFormList}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FormList;
