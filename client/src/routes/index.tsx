import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { Home } from './Home';
import { Rentals } from './Rentals';
import { Leasing } from './Leasing';
import { Transport } from './Transport';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsConditions } from './TermsConditions';
import { RefundPolicy } from './RefundPolicy';
import { About } from './About';
import { Contact } from './Contact';
import { Blog } from './Blog';
import { BlogPost } from './BlogPost';
import { NotFound } from './NotFound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'rentals', element: <Rentals /> },
            { path: 'leasing', element: <Leasing /> },
            { path: 'transport', element: <Transport /> },
            { path: 'privacy-policy', element: <PrivacyPolicy /> },
            { path: 'terms-conditions', element: <TermsConditions /> },
            { path: 'refund-policy', element: <RefundPolicy /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
            { path: 'blog', element: <Blog /> },
            { path: 'blog/:slug', element: <BlogPost /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);
