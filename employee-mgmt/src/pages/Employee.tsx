import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchEmployees } from "../features/employees/empSlice";

export default function Employees() {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {list.map((emp: any) => (
          <li key={emp.id}>
            {emp.firstName} {emp.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}
