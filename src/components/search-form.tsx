'use client';

import { useEffect, useState } from 'react';
import { RecordTypes } from '@/constants/recordType';
import { useTestStore } from '@/stores/testStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useQueryString } from '@/hooks/queryString';

import { useEditTestModal } from './modals/edit-test-modal';
import { TestItem } from './test-item';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const formSchema = z.object({
  url: z
    .string()
    .min(3, {
      message: 'The domain must be at least 3 characters long',
    })
    .max(255),
  refresh: z.string().optional(),
  recordType: z.enum(RecordTypes).default('A'),
});

export function SearchForm({ onSubmit }: SearchFormProps) {
  const { tests, addTest } = useTestStore();
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const { setShowEditTestModal, EditTestModal } = useEditTestModal({
    onSubmit: (data) => {
      console.log(data);
      addTest(data);
      setShowEditTestModal(false);
    },
  });

  const { searchParams } = useQueryString();
  const url = searchParams.get('url') || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url,
      recordType: 'A',
    },
  });

  useEffect(() => {
    form.setValue('url', url);
  }, [url]);

  return (
    <>
      <EditTestModal />
      <form className="rounded-md border border-gray-200 bg-white px-6 py-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Your domain
          </label>
        </div>
        <div className="relative mt-1 flex flex-col rounded-md">
          <Input id="url" type="text" placeholder="example.com" className="shadow-sm" {...form.register('url')} />
          {form.formState.errors.url && (
            <p className="mt-2 text-xs text-red-500">{form.formState.errors.url.message}</p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <Button type="submit">Check my domain</Button>
          <Button type="button" variant="link" onClick={() => setAdvancedOptionsOpen((prev) => !prev)}>
            Advanced options
          </Button>
        </div>

        {/* Advanced options */}
        {advancedOptionsOpen && (
          <div className="mt-4">
            <hr className="border-gray-200 my-4" />
            <h2 className="text-xs font-medium text-gray-700/60 mb-2">Advanced options</h2>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="refresh" className="block space-x-1 text-sm font-medium text-gray-700">
                  <span>Refresh interval</span>
                  <span className="text-gray-500 text-xs">(leave empty to disable)</span>
                </label>
              </div>
              <div className="relative mt-1 flex rounded-md">
                <Input
                  type="number"
                  min={5}
                  id="refresh"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm"
                  {...form.register('refresh')}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-xs">
                  seconds
                </span>
              </div>
              {form.formState.errors.refresh && (
                <p className="mt-2 text-xs text-red-500">{form.formState.errors.refresh.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mt-4">
                <label htmlFor="recordType" className="block space-x-1 text-sm font-medium text-gray-700">
                  <span>Record Type</span>
                </label>
              </div>
              <div className="relative mt-1 flex rounded-md shadow-sm">
                <select
                  id="recordType"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  {...form.register('recordType')}
                >
                  {RecordTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <hr className="border-gray-200 my-4" />
            <h2 className="text-xs font-medium text-gray-700/60 mb-2">Tests</h2>
            <ul className="mt-2 space-y-2">
              {tests.map((test) => (
                <TestItem key={test.id} test={test} />
              ))}
            </ul>
            <Button
              type="button"
              variant="secondary"
              className="w-full mt-2"
              onClick={() => {
                setShowEditTestModal(true);
              }}
            >
              <PlusCircleIcon className="mr-2" size={16} />
              New Test
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
