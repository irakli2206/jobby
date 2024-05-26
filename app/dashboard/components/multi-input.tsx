import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash } from 'lucide-react'
import React from 'react'

export type MultiInputObjectT = {
    id: string
    text: string
}

type Props = {
    label: string
    inputs: Array<MultiInputObjectT>
    handleAdd: () => void
    handleRemove: (id: string) => void
    handleChange: (e: MultiInputObjectT[]) => void
}

const MultiInput = ({ label, inputs, handleAdd, handleRemove, handleChange }: Props) => {

    return (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-zinc-900">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
                <ol className='flex flex-col gap-2 list-disc'>
                    {
                        inputs.map((input: any, i: number) => {
                            return <div key={input.id} className='flex gap-2 items-center'>
                                <Input
                                    value={input.text}
                                    onChange={(e) => {
                                        let updatedInputs = [...inputs]
                                        updatedInputs[i].text = e.target.value
                                        handleChange(updatedInputs)
                                    }}
                                />
                                <Button onClick={() => handleRemove(input.id)} variant='ghost' size='icon'>
                                    <Trash size={20} />
                                </Button>
                            </div>
                        })
                    }

                    <Button variant='ghost' className='w-fit'
                        onClick={handleAdd}
                    >
                        <Plus size={16} className='mr-1' /> დამატება
                    </Button>
                </ol>
            </dd>
        </div>
    )
}

export default MultiInput