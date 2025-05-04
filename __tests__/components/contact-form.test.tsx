import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContactForm } from '../../app/components/contact-form';

// Mock the ReCaptcha hook
jest.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: jest.fn().mockResolvedValue('test-token'),
  }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('ContactForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    expect(messageInput).toHaveValue('Test message');
  });

  it('submits the form with correct data and shows success message', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    // Fill the form
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          captcha: 'test-token',
        }),
      });
    });

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
  });

  it('shows error message when API call fails', async () => {
    // Override fetch mock for this test
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'API error' }),
      })
    );

    render(<ContactForm />);
    const user = userEvent.setup();

    // Fill and submit the form
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });
  });
});
