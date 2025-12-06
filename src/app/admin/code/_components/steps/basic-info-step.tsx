"use client"

import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RichTextEditorField from "@/components/richTextEditorField"
import type { FormValues } from "../form-schema"
import { ComboboxWithTags, type TagItem } from "../combobox-with-tags"
import { getAllCompanies, getAllTags } from "../../apiCalls"

interface BasicInfoStepProps {
  form: UseFormReturn<FormValues>
  isEditMode?: boolean
}

export default function BasicInfoStep({ form, isEditMode = false }: BasicInfoStepProps) {
  const [tags, setTags] = useState<TagItem[]>([])
  const [companies, setCompanies] = useState<TagItem[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)

  // Fetch all tags and companies on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTags(true)
      setIsLoadingCompanies(true)
      try {
        const [tagsData, companiesData] = await Promise.all([getAllTags(), getAllCompanies()])
        setTags(tagsData)
        setCompanies(companiesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoadingTags(false)
        setIsLoadingCompanies(false)
      }
    }

    fetchData()
  }, [])
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              {isEditMode ? (
                <div className="flex items-center space-x-2">
                  <Input {...field} disabled={isEditMode} className="bg-muted cursor-not-allowed" />
                  <span className="text-xs text-muted-foreground">Title cannot be changed</span>
                </div>
              ) : (
                <Input {...field} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <RichTextEditorField field={field} label="Description" placeholder="Write your description here..." />
        )}
      />

      <FormField
        control={form.control}
        name="difficulty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Difficulty</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <ComboboxWithTags
                items={tags}
                value={field.value}
                onChange={field.onChange}
                placeholder={isLoadingTags ? "Loading tags..." : "Enter tags..."}
                emptyText="No matching tags found."
                disabled={isLoadingTags}
              />
            </FormControl>
            <FormDescription>Enter tags separated by commas or select from suggestions</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="companies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Companies</FormLabel>
            <FormControl>
              <ComboboxWithTags
                items={companies}
                value={field.value}
                onChange={field.onChange}
                placeholder={isLoadingCompanies ? "Loading companies..." : "Enter companies..."}
                emptyText="No matching companies found."
                disabled={isLoadingCompanies}
              />
            </FormControl>
            <FormDescription>Enter companies separated by commas or select from suggestions</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

