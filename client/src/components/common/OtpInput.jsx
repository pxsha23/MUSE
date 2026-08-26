import { useRef } from 'react';

const LENGTH = 6;

const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);
  const digits = value.padEnd(LENGTH, ' ').split('');

  const setDigit = (index, char) => {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join('').replace(/ /g, ''));
  };

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    setDigit(index, char || ' ');
    if (char && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-blush-300 bg-white text-center text-xl font-semibold text-ink-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
        />
      ))}
    </div>
  );
};

export default OtpInput;
