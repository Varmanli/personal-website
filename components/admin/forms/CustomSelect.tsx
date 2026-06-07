"use client";

import { useId, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { FloatingPanel } from "@/components/admin/forms/FloatingPanel";
import type { SelectOption } from "@/lib/admin/options";

export interface CustomSelectProps {
  name: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  id?: string;
  className?: string;
  /** Optional change callback (for filters/controlled use). */
  onValueChange?: (value: string) => void;
}

/**
 * Fully custom dropdown (button + portal popover list) — never the native
 * <select> UI. A hidden input carries the selected value under `name`, so
 * server actions and uncontrolled form submission work unchanged. The list is
 * portalled to document.body, so it always sits above surrounding cards.
 */
export function CustomSelect({
  name,
  defaultValue,
  options,
  placeholder,
  dir,
  disabled,
  required,
  error,
  id,
  className,
  onValueChange,
}: CustomSelectProps) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((o) => o.value === value);

  function openMenu() {
    const i = options.findIndex((o) => o.value === value);
    setActive(i >= 0 ? i : 0);
    setOpen(true);
  }

  function commit(option: SelectOption) {
    if (option.disabled) return;
    setValue(option.value);
    onValueChange?.(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveActive(delta: number) {
    setActive((prev) => {
      let next = prev;
      for (let step = 0; step < options.length; step++) {
        next = (next + delta + options.length) % options.length;
        if (!options[next]?.disabled) return next;
      }
      return prev;
    });
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[active];
      if (opt) commit(opt);
    }
  }

  return (
    <div className={cn("relative", className)} dir={dir}>
      <input type="hidden" name={name} value={value} required={required} />

      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          if (disabled) return;
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "field-control flex items-center gap-2 text-start",
          error && "field-error",
          open && "border-primary/60 ring-2 ring-primary/20",
          disabled && "cursor-not-allowed opacity-55",
        )}
      >
        {selected?.icon && (
          <span className="shrink-0 text-base text-primary-light">
            {selected.icon}
          </span>
        )}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-faint")}>
          {selected ? selected.label : (placeholder ?? "")}
        </span>
        <FiChevronDown
          aria-hidden
          className={cn(
            "shrink-0 text-faint transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <FloatingPanel
        anchorRef={triggerRef}
        open={open}
        onClose={() => setOpen(false)}
        dir={dir}
        className="p-1.5"
      >
        <ul id={listId} role="listbox">
          {options.map((option, i) => {
            const isSelected = option.value === value;
            const isActive = i === active;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  disabled={option.disabled}
                  onClick={() => commit(option)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-sm transition-colors",
                    option.disabled && "cursor-not-allowed opacity-40",
                    isActive && !option.disabled
                      ? "bg-primary/15 text-foreground"
                      : "text-muted hover:bg-surface-2/70 hover:text-foreground",
                  )}
                >
                  {option.icon && (
                    <span className="shrink-0 text-base text-primary-light">
                      {option.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="block truncate text-xs text-faint">
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isSelected && <FiCheck className="shrink-0 text-primary-light" />}
                </button>
              </li>
            );
          })}
        </ul>
      </FloatingPanel>
    </div>
  );
}
