'use client';

import { Dispatch, SetStateAction, useCallback, useId, useMemo, useState } from 'react';
import { DNS } from '@/stores/dnsStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, FlaskConicalIcon, InfoIcon, ServerIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import shortid from 'shortid';
import { z } from 'zod';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const dnsSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ip: z.string().min(1),
  city: z.string().optional(),
  country: z.string().optional(),
  keepInLocalStorage: z.boolean().default(false),
});
export const dnsSchemaArray = z.array(dnsSchema);

interface AddEditDnsModalProps {
  showAddEditDnsModal: boolean;
  setShowAddEditDnsModal: Dispatch<SetStateAction<boolean>>;
  dns?: DNS;
  onSubmit?: (data: z.infer<typeof dnsSchema>) => void;
}

export function AddEditDnsModal({
  showAddEditDnsModal,
  setShowAddEditDnsModal,
  dns,
  onSubmit = () => {},
}: AddEditDnsModalProps) {
  const { isMobile } = useMediaQuery();

  const id = shortid();
  const form = useForm<z.infer<typeof dnsSchema>>({
    resolver: zodResolver(dnsSchema),
    defaultValues: {
      id: dns?.id ?? id,
      name: dns?.name,
      ip: dns?.ip,
      city: dns?.city,
      country: dns?.country,
      keepInLocalStorage: dns?.keepInLocalStorage ?? false,
    },
  });

  return (
    <Modal showModal={showAddEditDnsModal} setShowModal={setShowAddEditDnsModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <ServerIcon className="h-16 w-16 rounded-full bg-black px-3 text-white" />
        <h1 className="text-lg font-medium">{dns ? 'Edit' : 'Add'} DNS</h1>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-10"
      >
        <div>
          <label htmlFor="name" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">Name</h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              id="name"
              placeholder="My DNS"
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
          <label htmlFor="ip" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">IP</h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              id="ip"
              placeholder="IP address"
              variant={form.formState.errors.ip ? 'error' : 'default'}
              {...form.register('ip')}
            />
            {form.formState.errors.ip && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                <span className="sr-only">{form.formState.errors.ip.message}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="city" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">
              City <span className="text-gray-400">(optional)</span>
            </h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              id="city"
              placeholder="City"
              variant={form.formState.errors.city ? 'error' : 'default'}
              {...form.register('city')}
            />
            {form.formState.errors.city && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                <span className="sr-only">{form.formState.errors.city.message}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="country" className="flex items-center space-x-2">
            <h2 className="text-sm font-medium text-gray-900">
              Country <span className="text-gray-400">(optional)</span>
            </h2>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              id="country"
              placeholder="Country"
              variant={form.formState.errors.country ? 'error' : 'default'}
              {...form.register('country')}
            />
            {form.formState.errors.country && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                <span className="sr-only">{form.formState.errors.country.message}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <Switch
              fn={(checked) => {
                form.setValue('keepInLocalStorage', checked, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
              trackDimensions="w-11 h-6"
              thumbDimensions="h-5 w-5"
              thumbTranslate="translate-x-5"
              id="keepInLocalStorage"
              checked={form.getValues('keepInLocalStorage')}
            />
            <label
              htmlFor="keepInLocalStorage"
              className="flex flex-col text-sm font-medium text-gray-700 md:flex-row md:items-center md:space-x-2"
            >
              <span>Keep in local storage</span>
              {isMobile ? (
                <p className="text-xs font-normal">
                  If enabled, this DNS Server will be saved in your browser&apos;s local storage. This means it will be
                  available even after you reload the page.
                </p>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <InfoIcon className="h-4 w-4 text-gray-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-xs">
                        If enabled, this DNS Server will be saved in your browser&apos;s local storage. This means it
                        will be available even after you reload the page.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </label>
          </div>
        </div>
        <div>
          <Button type="submit" className="mt-2 w-full">
            {dns ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function useAddEditDnsModal({
  dns,
  onSubmit,
}: {
  dns?: DNS;
  onSubmit?: (data: z.infer<typeof dnsSchema>) => void;
}) {
  const [showAddEditDnsModal, setShowAddEditDnsModal] = useState(false);

  const AddEditDnsModalComponent = useCallback(
    () => (
      <AddEditDnsModal
        showAddEditDnsModal={showAddEditDnsModal}
        setShowAddEditDnsModal={setShowAddEditDnsModal}
        dns={dns}
        onSubmit={onSubmit}
      />
    ),
    [showAddEditDnsModal, setShowAddEditDnsModal, dns, onSubmit]
  );

  return useMemo(
    () => ({ AddEditDnsModalComponent, showAddEditDnsModal, setShowAddEditDnsModal }),
    [AddEditDnsModalComponent, showAddEditDnsModal, setShowAddEditDnsModal]
  );
}
