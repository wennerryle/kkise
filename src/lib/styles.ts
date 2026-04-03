import { type ClassValue, clsx } from 'clsx';
import { cva, type VariantProps } from 'cva';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal class merging.
 * @param inputs - Class names or conditional class values.
 * @returns A single string with merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
	return twMerge(clsx(inputs));
};

export const separator = cn(
	'border-t border-gray-300 my-4 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full',
	'data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px'
);

export const buttonVariants = cva(
	[
		'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
		'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'
	],
	{
		variants: {
			variant: {
				default: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
				outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900',
				ghost: 'hover:bg-gray-100 hover:text-gray-900',
				destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3 rounded-lg text-xs',
				lg: 'h-11 px-8 rounded-xl text-base',
				icon: 'h-10 w-10 p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
