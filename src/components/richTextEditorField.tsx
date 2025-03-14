import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import RichTextEditor from './RichTextEditor';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

interface RichTextEditorFieldProps<T extends FieldValues> {
    label?: string;
    field: ControllerRenderProps<T, Path<T>>;
    placeholder?: string;
}

const RichTextEditorField = <T extends FieldValues>({
    label,
    field,
    placeholder,
}: RichTextEditorFieldProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const showRenderedDesc = () => setIsModalOpen(!isModalOpen)

    return (
        <FormItem className="w-full">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl><>
                <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={placeholder}
                />
                <Button onClick={showRenderedDesc} variant={"outline"} className='mt-3' type='button'>View Rendering</Button>
            </>
            </FormControl>
            <FormMessage />
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTitle>Description View</DialogTitle>
                <DialogContent className='w-full max-h-screen overflow-scroll'>
                    <div
                        className="prose dark:prose-invert p-4 border rounded-md"
                        dangerouslySetInnerHTML={{ __html: field.value }}
                    />
                </DialogContent>
            </Dialog>
        </FormItem>
    );
};

export default RichTextEditorField;