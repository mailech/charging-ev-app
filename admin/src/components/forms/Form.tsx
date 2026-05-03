import type { FormHTMLAttributes, ReactNode } from 'react';
import {
    FormProvider,
    useForm,
    type DefaultValues,
    type FieldValues,
    type SubmitHandler,
    type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodTypeAny } from 'zod';

interface FormProps<TSchema extends ZodTypeAny, TValues extends FieldValues>
    extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children' | 'defaultValue'> {
    schema: TSchema;
    defaultValues?: DefaultValues<TValues>;
    onSubmit: SubmitHandler<TValues>;
    children: ReactNode | ((methods: UseFormReturn<TValues>) => ReactNode);
}

export function Form<TSchema extends ZodTypeAny, TValues extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    children,
    ...rest
}: FormProps<TSchema, TValues>) {
    const methods = useForm<TValues>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate {...rest}>
                {typeof children === 'function' ? children(methods) : children}
            </form>
        </FormProvider>
    );
}
