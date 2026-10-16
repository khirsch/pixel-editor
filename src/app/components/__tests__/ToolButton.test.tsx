/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pencil } from 'lucide-react';
import { ToolButton } from '../ToolButton';

describe('ToolButton', () => {
  it('renders with icon and title', () => {
    render(
      <ToolButton
        icon={Pencil}
        active={false}
        onClick={vi.fn()}
        title="Draw"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Draw');
  });

  it('applies active styles when active prop is true', () => {
    render(
      <ToolButton
        icon={Pencil}
        active={true}
        onClick={vi.fn()}
        title="Draw"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('bg-black', 'text-white');
  });

  it('applies inactive styles when active prop is false', () => {
    render(
      <ToolButton
        icon={Pencil}
        active={false}
        onClick={vi.fn()}
        title="Draw"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('bg-white', 'hover:bg-gray-200');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <ToolButton
        icon={Pencil}
        active={false}
        onClick={handleClick}
        title="Draw"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with small size variant', () => {
    render(
      <ToolButton
        icon={Pencil}
        active={false}
        onClick={vi.fn()}
        title="Draw"
        size="sm"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw' });
    expect(button).toBeInTheDocument();
  });

  it('renders with medium size variant by default', () => {
    render(
      <ToolButton
        icon={Pencil}
        active={false}
        onClick={vi.fn()}
        title="Draw"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw' });
    expect(button).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ToolButton
        icon={Pencil}
        active={false}
        onClick={vi.fn()}
        title="Draw Tool"
      />
    );

    const button = screen.getByRole('button', { name: 'Draw Tool' });
    expect(button).toHaveAttribute('title', 'Draw Tool');
    expect(button).toHaveAttribute('aria-label', 'Draw Tool');
    expect(button).toHaveAttribute('aria-pressed');
  });
});