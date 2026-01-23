import { Skeleton, Stack } from "@mui/material";
import { Row, Col } from "reactstrap";

interface CardSkeletonProps {
  count?: number;
}

const CardSkeleton = ({ count = 6 }: CardSkeletonProps) => {
  return (
    <Row className="g-4 p-1 mt-2">
      {Array.from({ length: count }).map((_, index) => (
        <Col md={4} key={index}>
          <Stack spacing={1}>
            <Skeleton
              variant="rectangular"
              height={180}
              animation="wave"
              sx={{ borderRadius: 2 }}
            />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Stack>
        </Col>
      ))}
    </Row>
  );
};

export default CardSkeleton;
