import { useEffect, useRef, useState } from 'react';
import { cn } from '../../shared/lib/utils.js';
import chevronImage from '../../../public/img/chevron.svg';

export function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Выберите',
  className,
  dropdownClassName,
  optionClassName,
  renderOption,

  dropdownAlign = 'left',
  selectedClassName,
  baseOptionClassName = 'w-full justify-start px-[10px] py-1 mb-[5px]',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((option) =>
    String(value).startsWith(String(option.value))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative", isOpen && "z-[100]")} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-between gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm transition hover:bg-gray-50',
          className
        )}
      >
        <div className={cn('flex items-center', selectedClassName)}>
          {selectedOption
            ? renderOption
              ? renderOption(selectedOption)
              : selectedOption.label
            : placeholder}
        </div>

        <img
          src={chevronImage}
          alt="chevron"
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full z-[100] mt-2 min-w-full rounded-2xl border bg-white shadow-lg",
            dropdownAlign === 'right' ? 'right-0' : 'left-0',
            dropdownClassName
          )}
        >
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center rounded-xl text-left transition hover:bg-[#EDEDED]',
                  baseOptionClassName,
                  isSelected && 'bg-[#DEDEDE]',
                  optionClassName
                )}
              >
                {renderOption ? renderOption(option) : option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}