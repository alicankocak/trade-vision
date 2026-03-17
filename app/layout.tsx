import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import MainLayout from '@/layout/MainLayout';
import GlobalLoader from '@/components/GlobalLoader';

export const metadata: Metadata = {
    title: 'Customs Loupe',
    description: 'Yapay Zeka Destekli Gümrük ve Beyanname Analizi',
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
                        <GlobalLoader />
                        <MainLayout>
                            {children}
                        </MainLayout>
                    </Providers>
                </AntdRegistry>
            </body>
        </html>
    );
}
