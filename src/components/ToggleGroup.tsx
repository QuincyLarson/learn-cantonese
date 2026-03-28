type Option<T extends string> = {
  label: string;
  value: T;
};

type ToggleGroupProps<T extends string> = {
  ariaLabel: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function ToggleGroup<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="toggle-group" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? 'toggle-chip is-active' : 'toggle-chip'}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
