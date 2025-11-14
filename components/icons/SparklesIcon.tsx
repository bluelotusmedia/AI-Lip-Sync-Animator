
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2" />
    <path d="M8 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2" />
    <path d="M12 10a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2" />
    <path d="M12 2v4" />
    <path d="M12 14v8" />
    <path d="M22 12h-4" />
    <path d="M6 12h-4" />
    <path d="M4.929 4.929l2.828 2.828" />
    <path d="M16.243 16.243l2.828 2.828" />
    <path d="M4.929 19.071l2.828 -2.828" />
    <path d="M16.243 7.757l2.828 -2.828" />
  </svg>
);

export default SparklesIcon;
