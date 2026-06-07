"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/admin/forms/CustomSelect";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/lib/admin/options";

/**
 * Reusable, self-contained admin form fields.
 *
 * Every input/textarea/select renders its own label, hint, and error so forms
 * stay declarative and free of duplicated markup:
 *
 *   <TextInput name="titleFa" label={f.title} dir="rtl" defaultValue={…} />
 *
 * All components are uncontrolled (defaultValue/defaultChecked) and forward
 * native attributes, so existing server actions keep working unchanged — field
 * `name`s and submission behaviour are untouched.
 */

/* ------------------------------ Field building blocks ----------------------- */

/** Small, scannable field label. */
export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.8125rem] font-semibold tracking-tight text-foreground/90"
    >
      {children}
      {required && (
        <span className="ms-0.5 text-red-400" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

/** Muted helper text shown under a field. */
export function FieldHint({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="text-xs leading-relaxed text-faint">
      {children}
    </p>
  );
}

/** Inline per-field error message. */
export function FieldError({
  id,
  children,
}: {
  id?: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      className="flex items-center gap-1.5 text-xs font-medium text-red-300"
    >
      <span
        aria-hidden
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500/20 text-[0.625rem] font-bold"
      >
        !
      </span>
      {children}
    </p>
  );
}

/** Label + control + hint/error wrapper shared by every field. */
function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <FieldLabel htmlFor={id} required={required}>
          {label}
        </FieldLabel>
      )}
      {children}
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <FieldHint id={`${id}-hint`}>{hint}</FieldHint>
      ) : null}
    </div>
  );
}

/** Shared describedby/invalid wiring for a control. */
function a11y(id: string, hint?: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error
      ? `${id}-error`
      : hint
        ? `${id}-hint`
        : undefined,
  } as const;
}

/* ----------------------------------- Inputs --------------------------------- */

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Class applied to the <input> itself (wrapper uses `wrapperClassName`). */
  className?: string;
  wrapperClassName?: string;
}

export function TextInput({
  name,
  label,
  hint,
  error,
  id,
  required,
  className,
  wrapperClassName,
  ...props
}: TextInputProps) {
  const fieldId = id ?? name;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={wrapperClassName}
    >
      <input
        id={fieldId}
        name={name}
        required={required}
        className={cn("field-control", error && "field-error", className)}
        {...a11y(fieldId, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
}

export function TextArea({
  name,
  label,
  hint,
  error,
  id,
  rows = 4,
  required,
  className,
  wrapperClassName,
  ...props
}: TextAreaProps) {
  const fieldId = id ?? name;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={wrapperClassName}
    >
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        required={required}
        className={cn(
          "field-control resize-y leading-relaxed",
          error && "field-error",
          className,
        )}
        {...a11y(fieldId, hint, error)}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectProps {
  name: string;
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  wrapperClassName?: string;
}

/**
 * Labelled select — renders the fully custom popover dropdown (CustomSelect),
 * never the native <select> UI. Submits via a hidden input under `name`.
 */
export function SelectInput({
  name,
  label,
  hint,
  error,
  id,
  options,
  defaultValue,
  placeholder,
  dir,
  disabled,
  required,
  className,
  wrapperClassName,
}: SelectProps) {
  const fieldId = id ?? name;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={wrapperClassName}
    >
      <CustomSelect
        id={fieldId}
        name={name}
        options={options}
        defaultValue={defaultValue}
        placeholder={placeholder}
        dir={dir}
        disabled={disabled}
        required={required}
        error={Boolean(error)}
        className={className}
      />
    </FieldShell>
  );
}

/* ------------------------------ Checkbox / Switch --------------------------- */

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: string;
  label: string;
  description?: string;
  error?: string;
}

export function CheckboxField({
  name,
  label,
  description,
  error,
  id,
  className,
  ...props
}: CheckboxProps) {
  const fieldId = id ?? name;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={fieldId}
        className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/40 p-3.5 backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/5 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/10"
      >
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-primary"
          {...props}
        />
        <span>
          <span className="block text-sm font-medium text-foreground">
            {label}
          </span>
          {description && (
            <span className="mt-0.5 block text-xs leading-relaxed text-faint">
              {description}
            </span>
          )}
        </span>
      </label>
      {error && <FieldError id={`${fieldId}-error`}>{error}</FieldError>}
    </div>
  );
}

/**
 * Toggle switch — a styled checkbox, so it submits exactly like CheckboxField
 * (`name=on` when checked) and stays uncontrolled. RTL-aware thumb travel.
 */
export function SwitchField({
  name,
  label,
  description,
  error,
  id,
  className,
  ...props
}: CheckboxProps) {
  const fieldId = id ?? name;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={fieldId}
        className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/40 p-3.5 backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/5 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/10"
      >
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-surface-2 ring-1 ring-inset ring-border transition-colors",
            "after:absolute after:top-0.5 after:start-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-['']",
            "peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent peer-checked:ring-primary/40",
            "peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/70",
          )}
        />
        <span>
          <span className="block text-sm font-medium text-foreground">
            {label}
          </span>
          {description && (
            <span className="mt-0.5 block text-xs leading-relaxed text-faint">
              {description}
            </span>
          )}
        </span>
      </label>
      {error && <FieldError id={`${fieldId}-error`}>{error}</FieldError>}
    </div>
  );
}

/* ----------------------------------- Layout --------------------------------- */

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** Optional element rendered at the end of the header (e.g. a badge). */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Glassy, card-like grouping for a block of related fields. */
export function FormSection({
  title,
  description,
  icon,
  aside,
  className,
  children,
}: FormSectionProps) {
  return (
    <section className={cn("admin-section p-5 sm:p-6", className)}>
      <div className="relative flex items-start gap-3">
        {icon && (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/55 text-lg text-primary-light backdrop-blur"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-faint">
              {description}
            </p>
          )}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
      <div className="relative mt-5 space-y-5">{children}</div>
    </section>
  );
}

/**
 * Read-only display of an auto-generated slug. Not a form control (no `name`),
 * so it never submits — the server action is the source of truth for slugs.
 */
export function ReadonlySlug({
  label,
  hint,
  value,
}: {
  label: string;
  hint?: string;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[0.8125rem] font-semibold tracking-tight text-foreground/90">
        {label}
      </span>
      <code
        dir="ltr"
        className="block w-full overflow-x-auto rounded-2xl border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-muted"
      >
        {value}
      </code>
      {hint && <p className="text-xs leading-relaxed text-faint">{hint}</p>}
    </div>
  );
}

/** Responsive 1→N column grid for grouping fields. */
export function FormGrid({
  cols = 2,
  className,
  children,
}: {
  cols?: 2 | 3;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-5",
        cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Form-level pieces --------------------------- */

/** Inline banner for form-level (non-field) failures. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-300 shadow-[0_8px_30px_-12px_rgba(248,113,113,0.5)]"
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-300"
      >
        !
      </span>
      <span className="leading-relaxed">{message}</span>
    </p>
  );
}

/** Submit button that reflects the pending state of the enclosing form. */
export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  const { dict } = useI18n();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? dict.admin.forms.saving : children}
    </Button>
  );
}
