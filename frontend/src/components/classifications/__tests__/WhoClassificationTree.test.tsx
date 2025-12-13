/**
 * Unit Tests for WhoClassificationTree Component
 *
 * This is an example test suite. To run these tests, you'll need to install:
 * - @testing-library/react
 * - @testing-library/jest-dom
 * - @testing-library/user-event
 * - jest
 *
 * Run with: npm test
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WhoClassificationTree } from '../WhoClassificationTree';
import { WhoClassification } from '../types';

// Mock the reference service
jest.mock('../../../services/reference.service', () => ({
  getWhoBoneTumors: jest.fn(() =>
    Promise.resolve([
      {
        id: '1',
        category: 'Osteogenic tumors',
        subcategory: 'Malignant',
        diagnosis: 'Osteosarcoma',
        icdO3Code: '9180/3',
        isMalignant: true,
        sortOrder: 1,
      },
      {
        id: '2',
        category: 'Osteogenic tumors',
        subcategory: 'Benign',
        diagnosis: 'Osteoid osteoma',
        icdO3Code: '9191/0',
        isMalignant: false,
        sortOrder: 2,
      },
      {
        id: '3',
        category: 'Chondrogenic tumors',
        subcategory: 'Malignant',
        diagnosis: 'Chondrosarcoma',
        icdO3Code: '9220/3',
        isMalignant: true,
        sortOrder: 3,
      },
    ])
  ),
  getWhoSoftTissueTumors: jest.fn(() => Promise.resolve([])),
}));

// Helper function to render with QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe('WhoClassificationTree', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    expect(screen.getByText(/Loading bone tumor classifications/i)).toBeInTheDocument();
  });

  it('renders classification tree after loading', async () => {
    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
      expect(screen.getByText('Chondrogenic tumors')).toBeInTheDocument();
    });
  });

  it('expands and collapses categories', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Category should be collapsed initially
    expect(screen.queryByText('Osteosarcoma')).not.toBeInTheDocument();

    // Click to expand
    const categoryButton = screen.getByText('Osteogenic tumors');
    await user.click(categoryButton);

    // Now should be visible
    expect(screen.getByText('Osteosarcoma')).toBeInTheDocument();
    expect(screen.getByText('Osteoid osteoma')).toBeInTheDocument();

    // Click to collapse
    await user.click(categoryButton);

    // Should be hidden again
    expect(screen.queryByText('Osteosarcoma')).not.toBeInTheDocument();
  });

  it('calls onSelect when classification is clicked', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Expand category
    await user.click(screen.getByText('Osteogenic tumors'));

    // Click classification
    await user.click(screen.getByText('Osteosarcoma'));

    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'Osteosarcoma',
        diagnosis: 'Osteosarcoma',
      })
    );
  });

  it('searches and filters classifications', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} searchable={true} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Search for "chondro"
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'chondro');

    await waitFor(() => {
      // Should only show Chondrogenic category
      expect(screen.getByText('Chondrogenic tumors')).toBeInTheDocument();
      expect(screen.queryByText('Osteogenic tumors')).not.toBeInTheDocument();
    });
  });

  it('shows malignancy badges', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Expand category
    await user.click(screen.getByText('Osteogenic tumors'));

    // Check for malignant badge
    expect(screen.getByText('Malignant')).toBeInTheDocument();

    // Check for benign badge
    expect(screen.getByText('Benign')).toBeInTheDocument();
  });

  it('displays ICD-O-3 codes when enabled', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} showCodes={true} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Expand category
    await user.click(screen.getByText('Osteogenic tumors'));

    // Check for ICD-O-3 code
    expect(screen.getByText(/9180\/3/)).toBeInTheDocument();
  });

  it('hides ICD-O-3 codes when disabled', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} showCodes={false} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Expand category
    await user.click(screen.getByText('Osteogenic tumors'));

    // ICD-O-3 code should not be visible
    expect(screen.queryByText(/9180\/3/)).not.toBeInTheDocument();
  });

  it('expands all categories', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      expect(screen.getByText('Expand All')).toBeInTheDocument();
    });

    // Click Expand All
    await user.click(screen.getByText('Expand All'));

    // All classifications should be visible
    expect(screen.getByText('Osteosarcoma')).toBeInTheDocument();
    expect(screen.getByText('Osteoid osteoma')).toBeInTheDocument();
    expect(screen.getByText('Chondrosarcoma')).toBeInTheDocument();
  });

  it('collapses all categories', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      expect(screen.getByText('Expand All')).toBeInTheDocument();
    });

    // First expand all
    await user.click(screen.getByText('Expand All'));

    // Then collapse all
    await user.click(screen.getByText('Collapse All'));

    // Classifications should be hidden
    expect(screen.queryByText('Osteosarcoma')).not.toBeInTheDocument();
    expect(screen.queryByText('Chondrosarcoma')).not.toBeInTheDocument();
  });

  it('saves recent selections to localStorage', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <WhoClassificationTree tumorType="BONE" onSelect={mockOnSelect} showRecent={true} />
    );

    await waitFor(() => {
      expect(screen.getByText('Osteogenic tumors')).toBeInTheDocument();
    });

    // Expand and select
    await user.click(screen.getByText('Osteogenic tumors'));
    await user.click(screen.getByText('Osteosarcoma'));

    // Check localStorage
    const recents = JSON.parse(
      localStorage.getItem('who_recent_bone_classifications') || '[]'
    );

    expect(recents).toHaveLength(1);
    expect(recents[0]).toMatchObject({
      id: '1',
      name: 'Osteosarcoma',
      category: 'Osteogenic tumors',
    });
  });
});
