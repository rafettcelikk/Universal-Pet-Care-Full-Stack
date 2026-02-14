import { format } from "date-fns";
import { useEffect, useState } from "react";

export const useAlertWithTimeout = (
  initialVisibility = false,
  duration = 10000,
) => {
  const [isVisible, setIsVisible] = useState(initialVisibility);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isVisible, duration]);

  return [isVisible, setIsVisible];
};

/**
 * @param {Date|Array|String} date - Şekillendirilecek tarih (Dizi, String veya Date olabilir)
 * @param {Date|String} time - Şekillendirilecek saat (Opsiyonel)
 * @returns {Object} - Formatlanmış tarih ve saat objesi
 */
export const dateTimeFormatter = (date, time) => {
  if (Array.isArray(date)) {
    date = new Date(date[0], date[1] - 1, date[2]);
  }
  const formattedDate = date ? format(new Date(date), "dd-MM-yyyy") : "";
  const formattedTime = time ? format(new Date(time), "HH:mm") : "";

  return { formattedDate, formattedTime };
};

export const formattedAppointmentStatuses = (status) => {
  const statuses = {
    CANCELLED: "İptal Edildi",
    ON_GOING: "Devam Ediyor",
    UP_COMING: "Yaklaşıyor",
    APPROVED: "Onaylandı",
    NOT_APPROVED: "Onaylanmadı",
    WAITING_FOR_APPROVAL: "Onay Bekliyor",
    COMPLETED: "Tamamlandı",
    PENDING: "Beklemede",
  };
  return statuses[status] || status;
};

export const getStatusKeyForColor = (statusText) => {
  if (!statusText) return "default";

  const map = {
    "Onay Bekliyor": "waiting-for-approval",
    Onaylandı: "approved",
    Onaylanmadı: "not-approved",
    "İptal Edildi": "cancelled",
    Beklemede: "pending",
    Tamamlandı: "completed",
    "Devam Ediyor": "on-going",
    Yaklaşıyor: "up-coming",

    WAITING_FOR_APPROVAL: "waiting-for-approval",
    APPROVED: "approved",
    NOT_APPROVED: "not-approved",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    PENDING: "pending",
    ON_GOING: "on-going",
    UP_COMING: "up-coming",
  };

  return (
    map[statusText] ||
    statusText.toString().toLowerCase().replace(/_/g, "-").replace(/ /g, "-")
  );
};

export const UserType = {
  PATIENT: "PATIENT",
  VET: "VET",
};

export const generateColor = (str) => {
  if (typeof str !== "string" || str.length === 0) {
    return "#8884d8";
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};
