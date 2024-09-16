"use client"

import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { FormFieldType } from "@/types"
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import React from "react"

type CustomFormProps = {
  control: Control<any>
  name: string
  fieldType: FormFieldType
  placeholder?: string
  renderOthers?: React.ReactNode
  Icon?: React.ReactNode
  inputType?: string
  description?: string
  autoComplete?: "off" | "on"
}

const RenderField = ({
  field,
  props,
}: {
  field: any
  props: CustomFormProps
}) => {
  const {
    name,
    fieldType,
    placeholder,
    Icon,
    renderOthers,
    inputType,
    description,
    autoComplete,
  } = props

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center border px-2 rounded-md focus-within:border-black">
          {Icon && Icon}
          <FormControl>
            <Input
              type={inputType}
              placeholder={placeholder}
              {...field}
              className="h-11 focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
              autoComplete={autoComplete}
            />
          </FormControl>
          {renderOthers && renderOthers}
        </div>
      )
    case FormFieldType.CHECKBOX:
      return (
        <>
          <FormControl>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex gap-1 items-center">
                <Checkbox
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-slate-500"
                />
                <label htmlFor={name} className="text-slate-500">
                  {description}
                </label>
              </div>
              {renderOthers && renderOthers}
            </div>
          </FormControl>
        </>
      )
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="h-11 placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="">{renderOthers}</SelectContent>
          </Select>
        </FormControl>
      )
  }
}

const CustomFormField = (props: CustomFormProps) => {
  const { control, name } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <RenderField field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
