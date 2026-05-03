import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Zap } from 'lucide-react';
import { loginSchema, type LoginInput } from '@trio/shared/auth';
import { Form } from '@/components/forms/Form';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFormContext } from 'react-hook-form';
import { login } from '../api';
import { useMe, ME_QUERY_KEY } from '../hooks';
import { toast } from '@/hooks/useToast';

function Fields() {
    const { register } = useFormContext<LoginInput>();
    return (
        <div className="space-y-4">
            <Field name="email" label="Email">
                <Input type="email" autoComplete="email" {...register('email')} />
            </Field>
            <Field name="password" label="Password">
                <Input type="password" autoComplete="current-password" {...register('password')} />
            </Field>
        </div>
    );
}

export default function Login() {
    const nav = useNavigate();
    const location = useLocation();
    const me = useMe();
    const qc = useQueryClient();

    const from = (location.state as { from?: string } | null)?.from ?? '/overview';

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            if (data.user.role !== 'ADMIN') {
                toast.error('Account is not authorized for admin access');
                return;
            }
            await qc.invalidateQueries({ queryKey: ME_QUERY_KEY });
            toast.success('Welcome back');
            nav(from, { replace: true });
        },
        onError: (err: unknown) => {
            const msg =
                (err as { response?: { data?: { error?: string } } }).response?.data?.error ??
                'Login failed';
            toast.error(msg);
        },
    });

    if (me.data?.role === 'ADMIN') return <Navigate to={from} replace />;

    return (
        <div className="flex min-h-full items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-white">
                        <Zap className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-base font-semibold text-slate-900">Trio Admin</p>
                        <p className="text-xs text-slate-500">Sign in to continue</p>
                    </div>
                </div>
                <Form
                    schema={loginSchema}
                    defaultValues={{ email: '', password: '' }}
                    onSubmit={(values) => mutation.mutate(values)}
                    className="space-y-4"
                >
                    <Fields />
                    <Button type="submit" loading={mutation.isPending} className="w-full">
                        Sign in
                    </Button>
                </Form>
            </div>
        </div>
    );
}
