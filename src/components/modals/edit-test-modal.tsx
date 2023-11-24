'use client';

import { Dispatch, SetStateAction, useCallback, useId, useMemo, useState } from 'react';
import { Test } from '@/stores/testStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, FlaskConicalIcon, InfoIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import shortid from 'shortid';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// Matches type Test
const testSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['equals', 'contains', 'regex', 'startsWith', 'endsWith']),
  negated: z.boolean().default(false),
  value: z.string(),
});

interface EditTestModalProps {
  showEditTestModal: boolean;
  setShowEditTestModal: Dispatch<SetStateAction<boolean>>;
  test?: Test;
  onSubmit?: (data: z.infer<typeof testSchema>) => void;
}

export function EditTestModal({
  showEditTestModal,
  setShowEditTestModal,
  test,
  onSubmit = () => {},
}: EditTestModalProps) {
  const id = shortid();
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      id: test?.id ?? id,
      name: test?.name,
      type: test?.type,
      negated: test?.negated ?? false,
      value: test?.value,
    },
  });

  console.log(test?.negated);

  return (
    <Modal showModal={showEditTestModal} setShowModal={setShowEditTestModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <FlaskConicalIcon className="w-16 h-16 text-white bg-black rounded-full px-3" />
        <h1 className="text-lg font-medium">{test ? 'Edit' : 'Add'} Test</h1>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 bg-gray-50 px-2 py-8 text-left sm:px-10"
      >
        <div>
          <label htmlFor="name" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">Name</h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              id="name"
              placeholder="My test"
              variant={form.formState.errors.name ? 'error' : 'default'}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                <span className="sr-only">{form.formState.errors.name.message}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="value" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">Value</h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              id="value"
              placeholder="1.1.1.1"
              variant={form.formState.errors.value ? 'error' : 'default'}
              {...form.register('value')}
            />
            {form.formState.errors.value && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                <span className="sr-only">{form.formState.errors.value.message}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="type" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">Type</h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <select
              id="type"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              {...form.register('type')}
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="regex">Regex</option>
              <option value="startsWith">Starts with</option>
              <option value="endsWith">Ends with</option>
            </select>
            {form.formState.errors.type && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                <span className="sr-only">{form.formState.errors.type.message}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <Switch
              fn={(checked) => {
                form.setValue('negated', checked, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              trackDimensions="w-11 h-6"
              thumbDimensions="h-5 w-5"
              thumbTranslate="translate-x-5"
              id="negated"
              checked={form.getValues('negated')}
            />
            <label htmlFor="negated" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Negated</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                      <InfoIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="text-xs">
                      Negated tests are inverted. For example, if you want to check if the IP is not equal to{' '}
                      <code>1.1.1.1</code>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
          </div>
        </div>
        <div>
          <Button type="submit" className="w-full">
            {test ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function useEditTestModal({
  test,
  onSubmit,
}: {
  test?: Test;
  onSubmit?: (data: z.infer<typeof testSchema>) => void;
} = {}) {
  const [showEditTestModal, setShowEditTestModal] = useState(false);

  const EditTestModalCallback = useCallback(() => {
    return (
      <EditTestModal
        showEditTestModal={showEditTestModal}
        setShowEditTestModal={setShowEditTestModal}
        test={test}
        onSubmit={onSubmit}
      />
    );
  }, [showEditTestModal, setShowEditTestModal]);

  return useMemo(
    () => ({
      showEditTestModal,
      setShowEditTestModal,
      EditTestModal: EditTestModalCallback,
    }),
    [showEditTestModal, setShowEditTestModal, EditTestModalCallback]
  );
}
