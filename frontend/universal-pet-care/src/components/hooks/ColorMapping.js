import React, { useEffect, useState } from "react";

const useColorMapping = () => {
  const [colors, setColors] = useState({});
  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    setColors({
      "on-going": rootStyle.getPropertyValue("--color-on-going"),
      completed: rootStyle.getPropertyValue("--color-completed"),
      cancelled: rootStyle.getPropertyValue("--color-cancelled"),
      "waiting-for-approval": rootStyle.getPropertyValue(
        "--color-waiting-for-approval",
      ),
      "not-approved": rootStyle.getPropertyValue("--color-not-approved"),
      "up-coming": rootStyle.getPropertyValue("--color-up-coming"),
      pending: rootStyle.getPropertyValue("--color-pending"),
      approved: rootStyle.getPropertyValue("--color-approved"),
      default: rootStyle.getPropertyValue("--color-default"),
    });
  }, []);
  return colors;
};

export default useColorMapping;
