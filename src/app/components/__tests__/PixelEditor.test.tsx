/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PixelEditor } from '../PixelEditor';

// Setup DOM containers needed by the component
beforeEach(() => {
  // Create the container elements that PixelEditor expects
  const mobileContainer = document.createElement('div');
  mobileContainer.id = 'mobile-canvas-container';
  document.body.appendChild(mobileContainer);

  const desktopContainer = document.createElement('div');
  desktopContainer.id = 'desktop-canvas-container';
  document.body.appendChild(desktopContainer);

  // Set desktop viewport for consistent testing
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  });
});

describe('PixelEditor Integration Tests', () => {
  it('renders without crashing', () => {
    render(<PixelEditor />);
    // The canvas gets moved to a container, so we check if the component rendered
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('initializes with pan tool selected', () => {
    render(<PixelEditor />);

    const panButton = screen.getByRole('button', { name: /^pan$/i });
    expect(panButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('allows switching between tools', async () => {
    const user = userEvent.setup();
    render(<PixelEditor />);

    const drawButton = screen.getByRole('button', { name: /^draw$/i });
    const eraseButton = screen.getByRole('button', { name: /^erase$/i });

    await user.click(drawButton);
    expect(drawButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(eraseButton);
    expect(eraseButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has grid toggle functionality', async () => {
    const user = userEvent.setup();
    render(<PixelEditor />);

    const gridButton = screen.getByRole('button', { name: /grid/i });
    
    // Grid should be on by default
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(gridButton);
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(gridButton);
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has undo button disabled initially', () => {
    render(<PixelEditor />);

    const undoButton = screen.getByRole('button', { name: /undo/i });
    expect(undoButton).toBeDisabled();
  });

  it('has redo button disabled initially', () => {
    render(<PixelEditor />);

    const redoButton = screen.getByRole('button', { name: /redo/i });
    expect(redoButton).toBeDisabled();
  });

  it('has cut/copy buttons disabled when no selection', () => {
    render(<PixelEditor />);

    const cutButton = screen.getByRole('button', { name: /cut/i });
    const copyButton = screen.getByRole('button', { name: /copy/i });

    expect(cutButton).toBeDisabled();
    expect(copyButton).toBeDisabled();
  });

  it('has paste button disabled when clipboard is empty', () => {
    render(<PixelEditor />);

    const pasteButton = screen.getByRole('button', { name: /paste/i });
    expect(pasteButton).toBeDisabled();
  });

  it('renders zoom controls', () => {
    render(<PixelEditor />);

    expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fit to view/i })).toBeInTheDocument();
  });

  it('renders file operation buttons', () => {
    render(<PixelEditor />);

    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('renders color picker', () => {
    render(<PixelEditor />);

    const colorPicker = screen.getByLabelText(/choose color/i);
    expect(colorPicker).toBeInTheDocument();
    expect(colorPicker).toHaveAttribute('type', 'color');
  });

  it('renders brush size slider', () => {
    render(<PixelEditor />);

    const brushSlider = screen.getByLabelText(/brush size/i);
    expect(brushSlider).toBeInTheDocument();
    expect(brushSlider).toHaveAttribute('type', 'range');
    expect(brushSlider).toHaveAttribute('min', '1');
    expect(brushSlider).toHaveAttribute('max', '10');
  });

  it('can change brush size', async () => {
    const user = userEvent.setup();
    render(<PixelEditor />);

    const brushSlider = screen.getByLabelText(/brush size/i) as HTMLInputElement;
    
    await user.click(brushSlider);
    await user.keyboard('{ArrowRight}{ArrowRight}');

    // Just verify the slider is interactive
    expect(brushSlider).not.toBeDisabled();
  });

  it('renders help button', () => {
    render(<PixelEditor />);

    const helpButtons = screen.getAllByRole('button', { name: /open help/i });
    expect(helpButtons.length).toBeGreaterThan(0);
  });

  it('opens help modal when help button is clicked', async () => {
    const user = userEvent.setup();
    render(<PixelEditor />);

    const helpButton = screen.getAllByRole('button', { name: /open help/i })[0];
    await user.click(helpButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('How To Use')).toBeInTheDocument();
    });
  });

  it('closes help modal when OK is clicked', async () => {
    const user = userEvent.setup();
    render(<PixelEditor />);

    // Open help
    const helpButton = screen.getAllByRole('button', { name: /open help/i })[0];
    await user.click(helpButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close help
    const okButton = screen.getByRole('button', { name: 'OK' });
    await user.click(okButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<PixelEditor />);

    // Check that important controls have labels
    expect(screen.getByRole('button', { name: /pan/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /draw/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /erase/i })).toHaveAttribute('aria-label');
    expect(screen.getByLabelText(/choose color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brush size/i)).toBeInTheDocument();
  });

  it('renders home link with proper attributes', () => {
    render(<PixelEditor />);

    const homeLink = screen.getByRole('link', { name: /home page/i });
    expect(homeLink).toHaveAttribute('href', 'https://katlandin.com');
  });
});