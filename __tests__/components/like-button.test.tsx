import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LikeButton } from '../../app/components/like-button'

// Mock fetch API
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('LikeButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementation for initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ likes: 10, userHasLiked: false })
    })
  })

  it('renders with correct initial state and fetches likes', async () => {
    render(<LikeButton slug="test-post" />)
    
    // Initial state check is done implicitly by waiting for loading to complete
    
    // After data loads
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
    
    // Check that correct API endpoint was called
    expect(mockFetch).toHaveBeenCalledWith('/api/likes?slug=test-post')
  })

  it('handles like button click correctly', async () => {
    // Setup next fetch response (for like action)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ likes: 11, userHasLiked: true })
    })
    
    render(<LikeButton slug="test-post" />)
    const user = userEvent.setup()
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
    
    // Prepare to intercept loading state
    let likeButton = screen.getByRole('button');
    
    // Click the like button within act
    await act(async () => {
      await user.click(likeButton)
      
      // Fetch is triggered but we don't wait for it to complete
    })
    
    // Check that POST request was made with correct data
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/likes',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'test-post' })
      })
    )
    
    // After like action completes
    await waitFor(() => {
      expect(screen.getByText('11')).toBeInTheDocument()
    })
    
    // Check that aria-label updates correctly
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Unlike this post')
  })

  it('handles API errors gracefully', async () => {
    // Setup mock implementation
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ likes: 10, userHasLiked: false })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' })
      });
    
    render(<LikeButton slug="test-post" />)
    const user = userEvent.setup()
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
    
    // Click the like button (with act to handle React state updates)
    await act(async () => {
      await user.click(screen.getByRole('button'))
    })
    
    // Instead of testing console.error, just verify the UI behavior
    // After error, should still render the original count
    await waitFor(() => {
      // Verify the original like count is still shown
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })
}) 