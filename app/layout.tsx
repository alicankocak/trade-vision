import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';

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
                        {children}
                    </Providers>
                </AntdRegistry>
            </body>
        </html>
    );
}
