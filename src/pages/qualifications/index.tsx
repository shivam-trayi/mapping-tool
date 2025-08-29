import { Outlet } from "react-router-dom";

const QualificationsDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Dashboard header or sidebar can stay here */}
      <Outlet />
    </div>
  );
};

export default QualificationsDashboard;
