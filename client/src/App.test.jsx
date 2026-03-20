/**
 * Frontend Tests — Unit + Integration
 * Tools: Vitest + @testing-library/react
 */

import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Helper: mock fetch to return predefined data
function mockFetch(data) {
    global.fetch = vi.fn((url) => {
        if (url.includes('/api/health'))
            return Promise.resolve({ json: () => Promise.resolve({ status: 'ok' }) });
        if (url.includes('/api/categories'))
            return Promise.resolve({ json: () => Promise.resolve({ categories: ['Electronics', 'Fashion'] }) });
        if (url.includes('/api/cart'))
            return Promise.resolve({ json: () => Promise.resolve({ items: [], total: 0, count: 0 }) });
        if (url.includes('/api/products'))
            return Promise.resolve({ json: () => Promise.resolve({ products: data || [], total: 0 }) });
        return Promise.resolve({ json: () => Promise.resolve({}) });
    });
}

// ─── Unit Tests ───────────────────────────────────────────────────────────────
describe('Unit: App renders static structure', () => {
    beforeEach(() => mockFetch([]));

    it('renders the ShopSmart navbar brand', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
        });
    });

    it('renders the hero heading', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        });
    });

    it('renders the Cart button in the navbar', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
        });
    });
});

// ─── Integration Tests ────────────────────────────────────────────────────────
describe('Integration: App fetches and shows products', () => {
    const sampleProducts = [
        { id: 1, name: 'Wireless Headphones', price: 2499, category: 'Electronics', rating: 4.5, image: '' },
        { id: 2, name: 'Running Shoes', price: 1899, category: 'Fashion', rating: 4.2, image: '' },
    ];

    beforeEach(() => mockFetch(sampleProducts));

    it('displays product names after fetch', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
            expect(screen.getByText('Running Shoes')).toBeInTheDocument();
        });
    });

    it('displays category filter buttons', async () => {
        render(<App />);
        await waitFor(() => {
            // Check that filter buttons exist (by role, not text, to avoid conflict with card category labels)
            const buttons = screen.getAllByRole('button');
            const buttonLabels = buttons.map(b => b.textContent.trim());
            expect(buttonLabels).toContain('Electronics');
            expect(buttonLabels).toContain('Fashion');
        });
    });

    it('shows "All" filter by default', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
        });
    });
});
