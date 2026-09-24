import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const iconProps: IconProps = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
  viewBox: '0 0 24 24',
};

export function PlusIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M7 8h.01M11 8h6M7 12h.01M11 12h6M7 16h.01M11 16h6" />
    </svg>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M7 3h7l4 4v14H7zM14 3v5h4M10 12h5M10 16h5" />
    </svg>
  );
}

export function SigmaIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M18 4H6l6 8-6 8h12" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="m8 5 11 7-11 7z" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}
