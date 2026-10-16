/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZoomControls } from '../ZoomControls';

describe('ZoomControls', () => {
  const defaultProps = {
    zoom: 1,
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onFitToView: vi.fn(),
    isPasting: false,
    selection: null,
  };

  it('renders zoom control buttons', () => {
    render(<ZoomControls {...defaultProps} />);

    expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fit to view/i })).toBeInTheDocument();
  });

  it('calls onZoomIn when zoom in button is clicked', async () => {
    const user = userEvent.setup();
    const handleZoomIn = vi.fn();

    render(<ZoomControls {...defaultProps} onZoomIn={handleZoomIn} />);

    await user.click(screen.getByRole('button', { name: /zoom in/i }));

    expect(handleZoomIn).toHaveBeenCalledTimes(1);
  });

  it('calls onZoomOut when zoom out button is clicked', async () => {
    const user = userEvent.setup();
    const handleZoomOut = vi.fn();

    render(<ZoomControls {...defaultProps} onZoomOut={handleZoomOut} />);

    await user.click(screen.getByRole('button', { name: /zoom out/i }));

    expect(handleZoomOut).toHaveBeenCalledTimes(1);
  });

  it('calls onFitToView when fit to view button is clicked', async () => {
    const user = userEvent.setup();
    const handleFitToView = vi.fn();

    render(<ZoomControls {...defaultProps} onFitToView={handleFitToView} />);

    await user.click(screen.getByRole('button', { name: /fit to view/i }));

    expect(handleFitToView).toHaveBeenCalledTimes(1);
  });

  it('renders help button when onOpenHelp is provided', () => {
    const handleOpenHelp = vi.fn();

    render(<ZoomControls {...defaultProps} onOpenHelp={handleOpenHelp} />);

    expect(screen.getByRole('button', { name: /open help dialog/i })).toBeInTheDocument();
  });

  it('does not render help button when onOpenHelp is not provided', () => {
    render(<ZoomControls {...defaultProps} />);

    expect(screen.queryByRole('button', { name: /open help dialog/i })).not.toBeInTheDocument();
  });

  it('calls onOpenHelp when help button is clicked', async () => {
    const user = userEvent.setup();
    const handleOpenHelp = vi.fn();

    render(<ZoomControls {...defaultProps} onOpenHelp={handleOpenHelp} />);

    await user.click(screen.getByRole('button', { name: /open help dialog/i }));

    expect(handleOpenHelp).toHaveBeenCalledTimes(1);
  });

  it('displays "Click to place" message when isPasting is true', () => {
    render(<ZoomControls {...defaultProps} isPasting={true} />);

    expect(screen.getByText('Click to place')).toBeInTheDocument();
  });

  it('displays "Selection active" message when selection exists', () => {
    const selection = { startX: 0, startY: 0, endX: 5, endY: 5 };

    render(<ZoomControls {...defaultProps} selection={selection} />);

    expect(screen.getByText('Selection active')).toBeInTheDocument();
  });

  it('prioritizes paste message over selection message', () => {
    const selection = { startX: 0, startY: 0, endX: 5, endY: 5 };

    render(<ZoomControls {...defaultProps} isPasting={true} selection={selection} />);

    expect(screen.getByText('Click to place')).toBeInTheDocument();
    expect(screen.queryByText('Selection active')).not.toBeInTheDocument();
  });

  it('does not display status message when neither pasting nor selecting', () => {
    render(<ZoomControls {...defaultProps} />);

    expect(screen.queryByText('Click to place')).not.toBeInTheDocument();
    expect(screen.queryByText('Selection active')).not.toBeInTheDocument();
  });

  it('status message has proper accessibility attributes', () => {
    render(<ZoomControls {...defaultProps} isPasting={true} />);

    const status = screen.getByText('Click to place');
    expect(status).toHaveAttribute('role', 'status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('all buttons have proper accessibility labels', () => {
    render(<ZoomControls {...defaultProps} onOpenHelp={vi.fn()} />);

    expect(screen.getByRole('button', { name: /zoom in/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /zoom out/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /fit to view/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /open help dialog/i })).toHaveAttribute('aria-label');
  });
});