import { Outlet } from "react-router-dom";
import { BaseHeader } from "@components/feature";

const BaseLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <main>
      {children && children}
      <BaseHeader />
      <main>
        <Outlet />
      </main>
    </main>
  );
};

export default BaseLayout;
