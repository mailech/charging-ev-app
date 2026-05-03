import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';

interface Props {
    title: string;
    note?: string;
}

export default function Placeholder({ title, note }: Props) {
    return (
        <>
            <PageHeader title={title} description="Coming soon." />
            <Card>
                <CardBody className="text-sm text-slate-500">
                    {note ?? 'This module is part of a future phase. Stay tuned.'}
                </CardBody>
            </Card>
        </>
    );
}
