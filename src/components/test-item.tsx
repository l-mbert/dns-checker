import { useEffect, useState } from 'react';
import { Test, useTestStore } from '@/stores/testStore';
import { cva, VariantProps } from 'class-variance-authority';
import { DeleteIcon, MoreVerticalIcon, PenIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { IconMenu } from './icon-menu';
import { useEditTestModal } from './modals/edit-test-modal';
import { TestExplainer } from './test-explainer';
import { Popover } from './ui/popover';

const testItemVariants = cva('flex justify-between px-3 py-2 rounded-md', {
  variants: {
    variant: {
      equal: 'ring-1 ring-inset ring-gray-200',
      contains: 'ring-1 ring-inset ring-gray-200',
      regex: 'ring-1 ring-inset ring-gray-200',
    },
  },
  defaultVariants: {
    variant: 'equal',
  },
});

interface TestItemProps extends VariantProps<typeof testItemVariants> {
  test: Test;
  className?: string;
}

export function TestItem({ test, variant, className }: TestItemProps) {
  const { updateTest, removeTest } = useTestStore();
  const { setShowEditTestModal, EditTestModal } = useEditTestModal({
    test,
    onSubmit: (data) => {
      if (data.type === 'regex') {
        // Remove leading and trailing slashes
        data.value = data.value.replace(/^\/|\/$/g, '');
      }
      updateTest({ ...data, id: test.id });
      setShowEditTestModal(false);
    },
  });
  const [openPopover, setOpenPopover] = useState(false);

  const onKeyDown = (e: any) => {
    if (openPopover && ['e', 'x'].includes(e.key)) {
      e.preventDefault();
      switch (e.key) {
        case 'e':
          setShowEditTestModal(true);
          break;
        case 'x':
          removeTest(test.id);
          break;
      }
      setOpenPopover(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <>
      <EditTestModal />
      <li className={cn(testItemVariants({ variant, className }))}>
        <div className="flex flex-col">
          <div className="text-xs">{test.name}</div>
          <TestExplainer test={test} />
        </div>
        <div>
          <Popover
            content={
              <div className="grid w-full gap-px p-2 sm:w-48">
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowEditTestModal(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-gray-500 transition-all duration-75 hover:bg-gray-100"
                >
                  <IconMenu text="Edit" icon={<PenIcon className="h-4 w-4" />} />
                  <kbd className="hidden rounded bg-gray-100 px-2 py-0.5 text-xs font-light text-gray-500 transition-all duration-75 group-hover:bg-gray-200 sm:inline-block">
                    E
                  </kbd>
                </button>
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    removeTest(test.id);
                  }}
                  className="group flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-red-600 transition-all duration-75 hover:bg-red-600 hover:text-white"
                >
                  <IconMenu text="Delete" icon={<DeleteIcon className="h-4 w-4" />} />
                  <kbd className="hidden rounded bg-red-100 px-2 py-0.5 text-xs font-light text-red-600 transition-all duration-75 group-hover:bg-red-500 group-hover:text-white sm:inline-block">
                    X
                  </kbd>
                </button>
              </div>
            }
            align="end"
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <button
              type="button"
              onClick={() => {
                setOpenPopover(!openPopover);
              }}
              className="rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <span className="sr-only">Edit</span>
              <MoreVerticalIcon className="h-5 w-5 text-gray-500" />
            </button>
          </Popover>
        </div>
      </li>
    </>
  );
}
