// SkeletonLoader.tsx
import "./SkeletonLoader.css";

interface SkeletonLoaderProps {
  count?: number; // number of skeleton items
  height?: string;
  width?: string;
  style?: React.CSSProperties;
}

const SkeletonLoader = ({
  count = 1,
  height = "20px",
  width = "100%",
  style,
}: SkeletonLoaderProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{ height, width, ...style }}
        ></div>
      ))}
    </>
  );
};

export default SkeletonLoader;
