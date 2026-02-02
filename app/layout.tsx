import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import MainLayout from '@/layout/MainLayout';

export const metadata: Metadata = {
    title: 'TradeVision',
    description: 'Geleceğin Ticaret Vizyonu',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AntdRegistry>
                    <Providers>
                        <MainLayout>
                            {children}
                        </MainLayout>
                    </Providers>
                </AntdRegistry>
            </body>
        </html>
    );
}
