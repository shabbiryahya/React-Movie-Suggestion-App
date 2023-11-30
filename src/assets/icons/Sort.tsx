interface SortProps {
    className?: string;
  }
  
  const Sort: React.FC<SortProps> = ({ className }) => {
    return (
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M10 18L14 14L18 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 10L10 14L6 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  export default Sort;
  