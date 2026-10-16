/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpModal } from '../HelpModal';

describe('HelpModal', () => {
  it('does not render when isOpen is false', () => {
    render(<HelpModal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('displays the correct title', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    const title = screen.getByText('How To Use');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('id', 'help-modal-title');
  });

  it('has proper ARIA attributes', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'help-modal-title');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('displays all help sections', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Drawing Tools')).toBeInTheDocument();
    expect(screen.getByText('Selection & Clipboard')).toBeInTheDocument();
    expect(screen.getByText('Canvas Controls')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('File Operations')).toBeInTheDocument();
  });

  it('displays keyboard shortcuts', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    // Use getByText with substring matching instead of regex
    expect(screen.getByText('Cut: Ctrl+X')).toBeInTheDocument();
    expect(screen.getByText('Copy: Ctrl+C')).toBeInTheDocument();
    expect(screen.getByText('Paste: Ctrl+V (drag to position)')).toBeInTheDocument();
    expect(screen.getByText('Undo: Ctrl+Z')).toBeInTheDocument();
    expect(screen.getByText('Redo: Ctrl+Shift+Z')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<HelpModal isOpen={true} onClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: /close help dialog/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when OK button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<HelpModal isOpen={true} onClose={handleClose} />);

    const okButton = screen.getByRole('button', { name: 'OK' });
    await user.click(okButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('has accessible close button', () => {
    render(<HelpModal isOpen={true} onClose={vi.fn()} />);

    const closeButton = screen.getByRole('button', { name: /close help dialog/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close help dialog');
  });
});