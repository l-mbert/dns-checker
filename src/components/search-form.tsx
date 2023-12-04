'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RecordTypes } from '@/constants/recordType';
import { useTestStore } from '@/stores/testStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
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
  advancedOptionsOpen: boolean;
  setAdvancedOptionsOpen: Dispatch<SetStateAction<boolean>>;
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

export function SearchForm({ onSubmit, advancedOptionsOpen, setAdvancedOptionsOpen }: SearchFormProps) {
  const { tests, addTest } = useTestStore();
  const { setShowEditTestModal, EditTestModal } = useEditTestModal({
    onSubmit: (data) => {
      if (data.type === 'regex') {
        // Remove leading and trailing slashes
        data.value = data.value.replace(/^\/|\/$/g, '');
      }
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
      <div
        className={'fixed bottom-0 left-0 right-0 top-0 lg:hidden'}
        onClick={() => setAdvancedOptionsOpen(false)}
      ></div>
      <div className={'flex w-full justify-center'}>
        <form
          className="
            fixed z-10 bottom-0 w-full border border-gray-200 bg-white px-6 pb-10 pt-6 shadow-2xl lg:static lg:rounded-md lg:py-8 lg:shadow-none"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          <div className="mt-4 flex justify-between">
            <Button type="submit">Check my domain</Button>
            <Button type="button" variant="link" onClick={() => setAdvancedOptionsOpen((prev) => !prev)}>
              Advanced options
            </Button>
          </div>

          {/* Advanced options */}
          <AnimatePresence mode={'sync'}>
            {advancedOptionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
                className="mt-4"
              >
                <hr className="my-4 border-gray-200" />
                <h2 className="mb-2 text-xs font-medium text-gray-700/60">Advanced options</h2>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="refresh" className="block space-x-1 text-sm font-medium text-gray-700">
                      <span>Refresh interval</span>
                      <span className="text-xs text-gray-500">(leave empty to disable)</span>
                    </label>
                  </div>
                  <div className="relative mt-1 flex rounded-md">
                    <Input
                      type="number"
                      min={5}
                      id="refresh"
                      className="shadow-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      {...form.register('refresh')}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-500">
                      seconds
                    </span>
                  </div>
                  {form.formState.errors.refresh && (
                    <p className="mt-2 text-xs text-red-500">{form.formState.errors.refresh.message}</p>
                  )}
                </div>
                <div>
                  <div className="mt-4 flex items-center justify-between">
                    <label htmlFor="recordType" className="block space-x-1 text-sm font-medium text-gray-700">
                      <span>Record Type</span>
                    </label>
                  </div>
                  <div className="relative mt-1 flex rounded-md shadow-sm">
                    <select
                      id="recordType"
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                <hr className="my-4 border-gray-200" />
                <h2 className="mb-2 text-xs font-medium text-gray-700/60">Tests</h2>
                <ul className="mt-2 space-y-2">
                  {tests.map((test) => (
                    <TestItem key={test.id} test={test} />
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2 w-full"
                  onClick={() => {
                    setShowEditTestModal(true);
                  }}
                >
                  <PlusCircleIcon className="mr-2" size={16} />
                  New Test
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </>
  );
}
