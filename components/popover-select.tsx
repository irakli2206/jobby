import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "./ui/scroll-area"

interface PopoverSelectProps {
    singleSelection?: boolean
    selectedValues: string[] | undefined
    setSelectedValues: (key: string, value: string | string[] | undefined) => void
    title: string
    filterKey: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[],
    scrollAreaClassName?: string
}

export function PopoverSelect({
    singleSelection = false,
    selectedValues,
    setSelectedValues,
    title,
    filterKey,
    options,
    scrollAreaClassName
}: PopoverSelectProps) {
    console.log(title, selectedValues)
    const selectedValuesSet = new Set(selectedValues as string[])
    return (
        <Popover key={title} >
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {selectedValuesSet?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValuesSet.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValuesSet.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValuesSet.size} მონიშნვა
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValuesSet.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 overflow-hidden" align="start">

                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList className="overflow-hidden">
                        <ScrollArea className={`h-[300px] ${scrollAreaClassName}`}>
                            <CommandEmpty>შედეგი ვერ მოიძებნა</CommandEmpty>


                            <CommandGroup className=" ">

                                {options.map((option) => {
                                    const isSelected = selectedValuesSet.has(option.value)
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                if (singleSelection) {
                                                    selectedValuesSet.clear()
                                                    //If clicks on a different option, add that option to set
                                                    if (!isSelected) selectedValuesSet.add(option.value)
                                                }
                                                else {
                                                    if (isSelected) {
                                                        selectedValuesSet.delete(option.value)
                                                    } else {
                                                        selectedValuesSet.add(option.value)
                                                    }
                                                }

                                                const filterValues = Array.from(selectedValuesSet)
                                                setSelectedValues(
                                                    filterKey, filterValues.length ? filterValues : undefined
                                                )
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <CheckIcon className={cn("h-4 w-4")} />
                                            </div>
                                            {option.icon && (
                                                <option.icon className="mr-1 h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>{option.label}</span>
                                            {/* {facets?.get(option.value) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )} */}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>

                            {selectedValuesSet.size > 0 && (
                                <div className="bg-white sticky bottom-0 p-2">
                                    <Separator className="mb-2 " />
                                    <Button onClick={() => {
                                        if (singleSelection) setSelectedValues(filterKey, undefined)
                                        else setSelectedValues(filterKey, [])
                                    }} variant='secondary' size='sm' className="sticky bottom-0 w-full ">
                                        გაწმენდა
                                    </Button>
                                </div>
                            )}
                        </ScrollArea>

                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover >
    )
}